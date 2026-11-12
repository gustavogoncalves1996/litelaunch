import {
  CreditCardIcon,
  DatabaseIcon,
  LanguagesIcon,
  MailIcon,
  MoonIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

const features = [
  { key: "auth", icon: ShieldCheckIcon },
  { key: "database", icon: DatabaseIcon },
  { key: "billing", icon: CreditCardIcon },
  { key: "emails", icon: MailIcon },
  { key: "i18n", icon: LanguagesIcon },
  { key: "theme", icon: MoonIcon },
] as const;

export function Features() {
  const t = useTranslations("features");

  return (
    <section id="features" className="scroll-mt-14 border-t">
      <div className="mx-auto w-full max-w-5xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-balance">
            {t("title")}
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            {t("description")}
          </p>
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ key, icon: Icon }) => (
            <li key={key} className="rounded-xl border bg-card p-6">
              <Icon aria-hidden className="size-5 text-muted-foreground" />
              <h3 className="mt-4 font-medium">{t(`items.${key}.title`)}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t(`items.${key}.description`)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
