import { en } from "@/lib/i18n/en";
import { es } from "@/lib/i18n/es";
import type { Locale } from "@/lib/i18n/config";

const dictionaries = {
  en: async () => en,
  es: async () => es,
} as const;

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}
