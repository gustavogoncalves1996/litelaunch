import { useTranslations } from "next-intl";

// Also the Suspense boundary that lets page.tsx read the session at request time.
export default function DashboardLoading() {
  const t = useTranslations("dashboard");

  return (
    <section
      role="status"
      className="mx-auto w-full max-w-5xl animate-pulse px-4 py-12"
    >
      <span className="sr-only">{t("loading")}</span>
      <div className="h-9 w-64 rounded-md bg-muted" />
      <div className="mt-3 h-5 w-80 max-w-full rounded-md bg-muted" />
      <div className="mt-8 h-36 max-w-md rounded-xl bg-muted" />
    </section>
  );
}
