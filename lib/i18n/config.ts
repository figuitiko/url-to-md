export const locales = ["en", "es"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getLocaleOrNull(value: string | null | undefined): Locale | null {
  if (!value) {
    return null;
  }

  return isLocale(value) ? value : null;
}

export function coerceLocale(value: string | string[] | null | undefined): Locale {
  const candidate = Array.isArray(value) ? value[0] : value;
  return getLocaleOrNull(candidate) ?? defaultLocale;
}
