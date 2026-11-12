import { UserButton } from "@clerk/nextjs";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";

export default function DashboardLayout({
  children,
}: LayoutProps<"/[locale]">) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
          <Link href="/dashboard" className="font-semibold tracking-tight">
            {siteConfig.name}
          </Link>
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
