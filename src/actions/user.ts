"use server";

import { currentUser } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";
import { NotificationEmail } from "@/emails/notification";
import { getPathname } from "@/i18n/navigation";
import { toLocale, type Locale } from "@/i18n/routing";
import { sendEmail } from "@/lib/resend";
import { siteConfig } from "@/lib/site";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { User } from "@/types/database";

// Copies the signed-in Clerk user into the users table and returns the row.
// Safe to call on every visit: a new user is inserted once, an existing one is
// refreshed with the latest profile from Clerk.
export async function syncUser(requestedLocale: string): Promise<User> {
  // A Server Action is a public endpoint: never trust its arguments.
  const locale = toLocale(requestedLocale);

  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("syncUser: not signed in.");

  const email = clerkUser.primaryEmailAddress?.emailAddress;
  if (!email) throw new Error("syncUser: the user has no email address.");

  const profile = {
    email,
    name: clerkUser.fullName,
    image_url: clerkUser.imageUrl,
    locale,
  };
  const supabase = createAdminSupabaseClient();

  // Returns a row only when the insert happened, which is true exactly once per user.
  const { data: created, error: insertError } = await supabase
    .from("users")
    .upsert(
      { id: clerkUser.id, ...profile },
      { onConflict: "id", ignoreDuplicates: true },
    )
    .select()
    .maybeSingle();
  if (insertError) throw new Error(`syncUser: ${insertError.message}`);

  if (created) {
    // The account exists either way; a failed email must not block the dashboard.
    await sendWelcomeEmail(created, locale).catch(console.error);
    return created;
  }

  const { data: updated, error: updateError } = await supabase
    .from("users")
    .update(profile)
    .eq("id", clerkUser.id)
    .select()
    .single();
  if (updateError) throw new Error(`syncUser: ${updateError.message}`);

  return updated;
}

async function sendWelcomeEmail(user: User, locale: Locale) {
  const t = await getTranslations({ locale, namespace: "emails.welcome" });
  const app = siteConfig.name;

  await sendEmail({
    to: user.email,
    subject: t("subject", { app }),
    idempotencyKey: `welcome/${user.id}`,
    template: NotificationEmail({
      lang: locale,
      preview: t("preview", { app }),
      heading: t("heading", { name: user.name ?? user.email }),
      body: t("body", { app }),
      cta: t("cta"),
      url: siteConfig.url + getPathname({ href: "/dashboard", locale }),
      footer: t("footer", { app }),
    }),
  });
}
