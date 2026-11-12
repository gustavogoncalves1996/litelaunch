import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";

export function Cta() {
  const t = useTranslations("cta");

  return (
    <section className="border-t">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-4 py-20 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-balance">
          {t("title")}
        </h2>
        <p className="text-pretty text-muted-foreground">{t("description")}</p>
        <a href="#pricing" className={buttonVariants({ size: "lg" })}>
          {t("button")}
        </a>
      </div>
    </section>
  );
}
