import { auth, currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("dashboard");
  return { title: t("title") };
}

export default async function DashboardPage() {
  // The security boundary for this page. The redirect in proxy.ts is only a shortcut.
  await auth.protect();

  const [user, t, format] = await Promise.all([
    currentUser(),
    getTranslations("dashboard"),
    getFormatter(),
  ]);
  const email = user?.primaryEmailAddress?.emailAddress;

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-balance">
        {t("welcome", { name: user?.firstName ?? email ?? "" })}
      </h1>
      <p className="mt-2 text-muted-foreground">{t("description")}</p>

      <div className="mt-8 max-w-md rounded-xl border bg-card p-6">
        <h2 className="font-medium">{t("account.title")}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">{t("account.email")}</dt>
            <dd className="truncate">{email}</dd>
          </div>
          {user && (
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">
                {t("account.memberSince")}
              </dt>
              <dd>
                {format.dateTime(new Date(user.createdAt), {
                  dateStyle: "long",
                })}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </section>
  );
}
