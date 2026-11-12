import { hasLocale, type Messages } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { routing, type Locale } from "./routing";

// A locale without a loader, or a dictionary missing a key of en.json, fails to compile.
const dictionaries = {
  en: () => import("./dictionaries/en.json"),
  "pt-PT": () => import("./dictionaries/pt-PT.json"),
} satisfies Record<Locale, () => Promise<{ default: Messages }>>;

export default getRequestConfig(async ({ locale }) => {
  const requested = locale ?? (await rootLocale());
  if (!hasLocale(routing.locales, requested)) notFound();

  return {
    locale: requested,
    messages: (await dictionaries[requested]()).default,
  };
});
