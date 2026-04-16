import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocaleOrNull, locales, type Locale } from "@/lib/i18n/config";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  const resolvedLocale = getLocaleOrNull(locale);

  if (!resolvedLocale) {
    notFound();
  }

  return resolvedLocale;
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const locale = await resolveLocale(params);
  const dictionary = await getDictionary(locale);

  return (
    <div lang={locale} data-locale={locale} data-app-title={dictionary.metadata.title}>
      {children}
    </div>
  );
}
