"use client";

import { LanguagesIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getPathname } from "@/i18n/navigation";
import { localeNames, routing, type Locale } from "@/i18n/routing";

export function LocaleSwitcher() {
  const t = useTranslations("locale");
  const locale = useLocale();

  // The root layout depends on [locale], so a client-side navigation would keep
  // the previous locale's tree mounted (hidden) with its own, stale ThemeProvider.
  // A full page load guarantees a single root layout.
  // The URL is read on click, not with usePathname(), so the header stays static.
  function switchLocale(next: Locale) {
    const { pathname, search, hash } = window.location;
    const prefix = getPathname({ href: "/", locale: next });
    // The first path segment is always the locale prefix.
    window.location.assign(pathname.replace(/^\/[^/]+/, prefix) + search + hash);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon" aria-label={t("label")} />}
      >
        <LanguagesIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={locale} onValueChange={switchLocale}>
          {routing.locales.map((value) => (
            <DropdownMenuRadioItem
              key={value}
              value={value}
              lang={value}
              closeOnClick
            >
              {localeNames[value]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
