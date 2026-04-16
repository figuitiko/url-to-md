"use client";

import Link from "next/link";
import { Languages } from "lucide-react";
import { usePathname } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";
import type { Locale } from "@/lib/i18n/config";

function getAlternateLocale(locale: Locale): Locale {
  return locale === "en" ? "es" : "en";
}

function swapLocaleInPath(pathname: string | null, locale: Locale) {
  const alternateLocale = getAlternateLocale(locale);

  if (!pathname || pathname === "/") {
    return `/${alternateLocale}`;
  }

  const segments = pathname.split("/");

  if (segments[1] === locale) {
    segments[1] = alternateLocale;
    return segments.join("/");
  }

  return `/${alternateLocale}${pathname}`;
}

export function LocaleSwitcher({
  locale,
  labels,
}: Readonly<{
  locale: Locale;
  labels?: {
    switchToEnglish: string;
    switchToSpanish: string;
  };
}>) {
  const pathname = usePathname();
  const href = swapLocaleInPath(pathname, locale);
  const nextLocale = getAlternateLocale(locale);
  const fallbackLabels = {
    switchToEnglish: "Switch to English",
    switchToSpanish: "Cambiar a español",
  };
  const copy = labels ?? fallbackLabels;

  return (
    <Link
      href={href}
      aria-label={nextLocale === "en" ? copy.switchToEnglish : copy.switchToSpanish}
      prefetch={false}
      className={cn(
        buttonVariants({ variant: "ghost", size: "sm" }),
        "gap-2 rounded-full border border-white/10 bg-black/20 px-3 text-zinc-200 hover:bg-white/10 hover:text-white",
      )}
    >
      <Languages className="size-4" aria-hidden="true" />
      {nextLocale.toUpperCase()}
    </Link>
  );
}

export { getAlternateLocale, swapLocaleInPath };
