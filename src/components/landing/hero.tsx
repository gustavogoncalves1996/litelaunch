import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-4 py-24 text-center sm:py-32">
      <p className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
        {t("badge")}
      </p>
      <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
        {t("title")}
      </h1>
      <p className="max-w-2xl text-lg text-pretty text-muted-foreground">
        {t("description")}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <a href="#pricing" className={buttonVariants({ size: "lg" })}>
          {t("primaryCta")}
        </a>
        <a
          href="#features"
          className={buttonVariants({ size: "lg", variant: "outline" })}
        >
          {t("secondaryCta")}
        </a>
      </div>
    </section>
  );
}
