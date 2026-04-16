import { describe, expect, it } from "vitest";

import { generateStaticParams, default as LocaleLayout } from "@/app/[locale]/layout";
import { generateMetadata } from "@/app/[locale]/page";

describe("localized route files", () => {
  it("pre-generates the supported locale params", () => {
    expect(generateStaticParams()).toEqual([{ locale: "en" }, { locale: "es" }]);
  });

  it("returns localized metadata for Spanish", async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ locale: "es" }) });

    expect(metadata.title).toBe("Site2Markdown");
    expect(metadata.description).toMatch(/markdown listo/i);
  });

  it("adds locale metadata on the localized layout wrapper", async () => {
    const element = await LocaleLayout({
      children: "hola",
      params: Promise.resolve({ locale: "es" }),
    });

    expect(element.props.lang).toBe("es");
    expect(element.props["data-locale"]).toBe("es");
  });
});
