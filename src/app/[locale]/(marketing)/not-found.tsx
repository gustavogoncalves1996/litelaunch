import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-4 py-24 text-center sm:py-32">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {t("title")}
      </h1>
      <p className="text-pretty text-muted-foreground">{t("description")}</p>
      <Link href="/" className={buttonVariants({ size: "lg" })}>
        {t("back")}
      </Link>
    </section>
  );
}
