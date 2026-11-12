import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  const t = useTranslations("header");

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-semibold tracking-tight">
            {siteConfig.name}
          </Link>
          <nav
            aria-label={t("navigation")}
            className="hidden gap-6 text-sm text-muted-foreground sm:flex"
          >
            <a href="#features" className="hover:text-foreground">
              {t("features")}
            </a>
            <a href="#pricing" className="hover:text-foreground">
              {t("pricing")}
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-1">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
