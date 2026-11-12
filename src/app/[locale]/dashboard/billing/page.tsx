import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { openCustomerPortal, startCheckout } from "@/actions/billing";
import { AutoRefresh } from "@/components/auto-refresh";
import { SubmitButton } from "@/components/submit-button";
import { currency, proPlan } from "@/lib/plans";
import {
  canSubscribe,
  getCurrentSubscription,
  hasActivePlan,
} from "@/lib/subscription";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("dashboard.billing");
  return { title: t("title") };
}

export default async function BillingPage({
  searchParams,
}: PageProps<"/[locale]/dashboard/billing">) {
  // The security boundary for this page. The redirect in proxy.ts is only a shortcut.
  await auth.protect();

  const [subscription, locale, t, tPlans, format, { checkout }] =
    await Promise.all([
      getCurrentSubscription(),
      getLocale(),
      getTranslations("dashboard"),
      getTranslations("pricing.plans"),
      getFormatter(),
      searchParams,
    ]);

  const active = hasActivePlan(subscription);
  // Back from the checkout, but the webhook has not stored the subscription yet.
  const confirming = checkout === "success" && !active;
  const date = (value: string) =>
    format.dateTime(new Date(value), { dateStyle: "long" });

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-balance">
        {t("billing.title")}
      </h1>
      <p className="mt-2 text-muted-foreground">{t("billing.description")}</p>

      {confirming && (
        <p role="status" className="mt-6 rounded-lg border bg-muted p-4 text-sm">
          {t("billing.confirming")}
          <AutoRefresh />
        </p>
      )}

      <div className="mt-8 max-w-md rounded-xl border bg-card p-6">
        <h2 className="font-medium">{t("billing.currentPlan")}</h2>
        <p className="mt-4 text-2xl font-semibold tracking-tight">
          {tPlans(active ? "pro.name" : "free.name")}
        </p>
        {subscription && (
          <p className="mt-1 text-sm text-muted-foreground">
            {t(`plan.status.${subscription.status}`)}
            {subscription.ends_at &&
              ` · ${t(
                subscription.status === "expired"
                  ? "billing.endedOn"
                  : "billing.endsOn",
                { date: date(subscription.ends_at) },
              )}`}
            {!subscription.ends_at &&
              subscription.renews_at &&
              ` · ${t("billing.renewsOn", { date: date(subscription.renews_at) })}`}
          </p>
        )}

        {canSubscribe(subscription) ? (
          <form action={startCheckout.bind(null, locale)} className="mt-6">
            <SubmitButton>
              {t("billing.upgrade", { plan: tPlans("pro.name") })}
            </SubmitButton>
            <p className="mt-3 text-sm text-muted-foreground">
              {t("billing.upgradeDescription", {
                price: format.number(proPlan.price, {
                  style: "currency",
                  currency,
                  maximumFractionDigits: 0,
                }),
              })}
            </p>
          </form>
        ) : (
          <form action={openCustomerPortal.bind(null, locale)} className="mt-6">
            <SubmitButton variant="outline">{t("billing.manage")}</SubmitButton>
            <p className="mt-3 text-sm text-muted-foreground">
              {t("billing.manageDescription")}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
