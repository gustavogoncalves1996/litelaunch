"use client";

import { MenuIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/i18n/navigation";
import { navLinks } from "@/lib/site";

export function MobileNav() {
  const t = useTranslations("header");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            aria-label={t("menu")}
          />
        }
      >
        <MenuIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {navLinks.map(({ key, href }) => (
          <DropdownMenuItem key={key} render={<Link href={href} />}>
            {t(key)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
