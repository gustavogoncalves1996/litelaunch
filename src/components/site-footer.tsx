import { useTranslations } from "next-intl";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-1 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-medium text-foreground">{siteConfig.name}</span>
          {" · "}
          {t("tagline")}
        </p>
        <p>{t("builtWith")}</p>
      </div>
    </footer>
  );
}
