import { UserButton } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";

export default function DashboardLayout({
  children,
}: LayoutProps<"/[locale]">) {
  const t = useTranslations("dashboard.nav");

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="font-semibold tracking-tight">
              {siteConfig.name}
            </Link>
            <nav
              aria-label={t("label")}
              className="flex gap-4 text-sm text-muted-foreground"
            >
              <Link href="/dashboard" className="hover:text-foreground">
                {t("overview")}
              </Link>
              <Link href="/dashboard/billing" className="hover:text-foreground">
                {t("billing")}
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-1">
            <LocaleSwitcher />
            <ThemeToggle />
            {/* Fixed size so the header does not shift when Clerk loads. */}
            <div className="ml-2 flex size-7 items-center justify-center">
              <UserButton />
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </>
  );
}
