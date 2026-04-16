import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { UrlSubmitForm } from "@/components/url-submit-form";
import { getLocaleOrNull } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

async function getLocaleDictionary(params: Promise<{ locale: string }>) {
  const { locale } = await params;
  const resolvedLocale = getLocaleOrNull(locale);

  if (!resolvedLocale) {
    notFound();
  }

  return {
    locale: resolvedLocale,
    dictionary: await getDictionary(resolvedLocale),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { dictionary } = await getLocaleDictionary(params);

  return {
    title: dictionary.metadata.title,
    description: dictionary.metadata.description,
  };
}

export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, dictionary } = await getLocaleDictionary(params);

  return (
    <main className="min-h-screen bg-background">
      <AppShell locale={locale} copy={dictionary.shell}>
        <UrlSubmitForm
          dictionary={{
            buttons: dictionary.buttons,
            emptyState: dictionary.emptyState,
            form: dictionary.form,
            inlineError: dictionary.inlineError,
            result: dictionary.result,
          }}
        />
      </AppShell>
    </main>
  );
}
