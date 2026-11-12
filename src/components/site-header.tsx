import { useTranslations } from "next-intl";
import { HeaderAuth } from "@/components/header-auth";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link } from "@/i18n/navigation";
import { navLinks, siteConfig } from "@/lib/site";

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
            {navLinks.map(({ key, href }) => (
              <Link key={key} href={href} className="hover:text-foreground">
                {t(key)}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-1">
          {/* First in the row: it appears after Clerk loads and must not push the toggles. */}
          <HeaderAuth />
          <LocaleSwitcher />
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
