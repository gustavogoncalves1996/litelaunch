import { createHmac, timingSafeEqual } from "node:crypto";
import { getTranslations } from "next-intl/server";
import { NotificationEmail } from "@/emails/notification";
import { getPathname } from "@/i18n/navigation";
import { toLocale } from "@/i18n/routing";
import { fetchSubscription } from "@/lib/lemonsqueezy";
import { sendEmail } from "@/lib/resend";
import { siteConfig } from "@/lib/site";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { SubscriptionWebhookEvent } from "@/types/lemonsqueezy";

// Lemon Squeezy calls this URL whenever a subscription changes.
export async function POST(request: Request) {
  // The signature covers the exact bytes that were sent, so read the raw body.
  const body = await request.text();

  if (!hasValidSignature(body, request.headers.get("X-Signature"))) {
    return new Response("Invalid signature", { status: 401 });
  }

  const event = parseSubscriptionEvent(body);
  const userId = event?.meta.custom_data?.user_id;
  // Another kind of event, or a purchase that did not start in this app.
  if (!event || !userId) return new Response("Ignored");

  // Events can arrive late, twice or out of order. Storing what the API says
  // now, instead of what the event carried, keeps the row right in every case.
  const { id, attributes } = await fetchSubscription(event.data.id);

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("subscriptions").upsert({
    id,
    user_id: userId,
    status: attributes.status,
    variant_id: String(attributes.variant_id),
    variant_name: attributes.variant_name,
    customer_id: String(attributes.customer_id),
    renews_at: attributes.renews_at,
    ends_at: attributes.ends_at,
    trial_ends_at: attributes.trial_ends_at,
  });
  // A failed response makes Lemon Squeezy send the event again.
  if (error) throw new Error(`Lemon Squeezy webhook: ${error.message}`);

  if (event.meta.event_name === "subscription_created") {
    // The subscription is stored either way; a failed email must not fail the webhook.
    await sendConfirmationEmail(userId, id).catch(console.error);
  }

  return new Response("OK");
}

function hasValidSignature(body: string, signature: string | null) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  // With an empty secret anyone could compute a valid signature.
  if (!secret || !signature) return false;

  const expected = Buffer.from(
    createHmac("sha256", secret).update(body).digest("hex"),
  );
  const received = Buffer.from(signature);

  // timingSafeEqual throws when the lengths differ.
  return (
    expected.length === received.length && timingSafeEqual(expected, received)
  );
}

function parseSubscriptionEvent(body: string): SubscriptionWebhookEvent | null {
  const payload: unknown = JSON.parse(body);

  return isSubscriptionEvent(payload) ? payload : null;
}

function isSubscriptionEvent(
  payload: unknown,
): payload is SubscriptionWebhookEvent {
  if (typeof payload !== "object" || payload === null) return false;

  const { meta, data } = payload as {
    meta?: { event_name?: unknown };
    data?: { type?: unknown; id?: unknown };
  };

  // Payment events are also named subscription_*, but carry an invoice.
  return (
    typeof meta?.event_name === "string" &&
    meta.event_name.startsWith("subscription_") &&
    data?.type === "subscriptions" &&
    typeof data.id === "string"
  );
}

async function sendConfirmationEmail(userId: string, subscriptionId: string) {
  const { data: user, error } = await createAdminSupabaseClient()
    .from("users")
    .select("email, name, locale")
    .eq("id", userId)
    .single();
  if (error) throw new Error(`Lemon Squeezy webhook: ${error.message}`);

  // There is no page, so no active language: use the one saved for the user.
  const locale = toLocale(user.locale);
  const [t, tPlans] = await Promise.all([
    getTranslations({ locale, namespace: "emails.subscription" }),
    getTranslations({ locale, namespace: "pricing.plans" }),
  ]);
  const values = { app: siteConfig.name, plan: tPlans("pro.name") };

  await sendEmail({
    to: user.email,
    subject: t("subject", values),
    idempotencyKey: `subscription-created/${subscriptionId}`,
    template: NotificationEmail({
      lang: locale,
      preview: t("preview", values),
      heading: t("heading", { name: user.name ?? user.email }),
      body: t("body", values),
      cta: t("cta"),
      url:
        siteConfig.url + getPathname({ href: "/dashboard/billing", locale }),
      footer: t("footer", values),
    }),
  });
}
