import { describe, expect, it } from "vitest";

import { getDictionary } from "@/lib/i18n/get-dictionary";
import { defaultLocale, getLocaleOrNull, isLocale, locales } from "@/lib/i18n/config";

describe("i18n config", () => {
  it("exposes the supported locales and default locale", () => {
    expect(locales).toEqual(["en", "es"]);
    expect(defaultLocale).toBe("en");
  });

  it("validates locale strings", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("es")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(getLocaleOrNull("fr")).toBeNull();
  });
});

describe("getDictionary", () => {
  it("returns English UI copy for the English locale", async () => {
    const dictionary = await getDictionary("en");

    expect(dictionary.metadata.title).toContain("Site2Markdown");
    expect(dictionary.form.label).toBe("Public page URL");
  });

  it("returns Spanish UI copy for the Spanish locale", async () => {
    const dictionary = await getDictionary("es");

    expect(dictionary.shell.eyebrow).toBe("Extracción server-first");
    expect(dictionary.result.tabs.preview).toBe("Vista previa");
  });
});
