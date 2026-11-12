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
import { getPathname, usePathname } from "@/i18n/navigation";
import { localeNames, routing, type Locale } from "@/i18n/routing";

export function LocaleSwitcher() {
  const t = useTranslations("locale");
  const locale = useLocale();
  const pathname = usePathname();

  // The root layout depends on [locale], so a client-side navigation would keep
  // the previous locale's tree mounted (hidden) with its own, stale ThemeProvider.
  // A full page load guarantees a single root layout.
  function switchLocale(next: Locale) {
    window.location.assign(getPathname({ href: pathname, locale: next }));
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
