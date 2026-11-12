import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { syncUser } from "@/actions/user";
import { Link } from "@/i18n/navigation";
import { getCurrentSubscription, hasActivePlan } from "@/lib/subscription";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("dashboard");
  return { title: t("title") };
}

export default async function DashboardPage() {
  // The security boundary for this page. The redirect in proxy.ts is only a shortcut.
  await auth.protect();

  const [user, subscription, t, tPlans, format] = await Promise.all([
    syncUser(await getLocale()),
    // Read as the signed-in user: Row Level Security returns only their rows.
    getCurrentSubscription(),
    getTranslations("dashboard"),
    getTranslations("pricing.plans"),
    getFormatter(),
  ]);

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-balance">
        {t("welcome", { name: user.name ?? user.email })}
      </h1>
      <p className="mt-2 text-muted-foreground">{t("description")}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-medium">{t("account.title")}</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">{t("account.email")}</dt>
              <dd className="truncate">{user.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">
                {t("account.memberSince")}
              </dt>
              <dd>
                {format.dateTime(new Date(user.created_at), {
                  dateStyle: "long",
                })}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-medium">{t("plan.title")}</h2>
          <p className="mt-4 text-2xl font-semibold tracking-tight">
            {tPlans(hasActivePlan(subscription) ? "pro.name" : "free.name")}
          </p>
          {subscription && (
            <p className="mt-1 text-sm text-muted-foreground">
              {t(`plan.status.${subscription.status}`)}
            </p>
          )}
          <Link
            href="/dashboard/billing"
            className="mt-4 inline-block text-sm font-medium underline-offset-4 hover:underline"
          >
            {t("plan.manage")}
          </Link>
        </div>
      </div>
    </section>
  );
}
