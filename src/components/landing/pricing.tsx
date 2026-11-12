import { CheckIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { PlanButton } from "@/components/landing/plan-button";
import { currency, plans } from "@/lib/plans";
import { cn } from "@/lib/utils";

export function Pricing() {
  const t = useTranslations("pricing");
  const format = useFormatter();

  return (
    <section id="pricing" className="scroll-mt-14 border-t">
      <div className="mx-auto w-full max-w-5xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-balance">
            {t("title")}
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            {t("description")}
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2">
          {plans.map((plan) => (
            <article
              key={plan.key}
              className={cn(
                "rounded-xl border bg-card p-6",
                plan.featured && "border-primary",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-medium">{t(`plans.${plan.key}.name`)}</h3>
                {plan.featured && (
                  <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
                    {t("popular")}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {t(`plans.${plan.key}.description`)}
              </p>
              <p className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-semibold tracking-tight">
                  {format.number(plan.price, {
                    style: "currency",
                    currency,
                    maximumFractionDigits: 0,
                  })}
                </span>
                <span className="text-sm text-muted-foreground">
                  {t("perMonth")}
                </span>
              </p>
              <PlanButton paid={plan.price > 0} featured={plan.featured}>
                {t(`plans.${plan.key}.cta`)}
              </PlanButton>
              <ul className="mt-6 space-y-2 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckIcon aria-hidden className="size-4 shrink-0" />
                    {t(`features.${feature}`)}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
