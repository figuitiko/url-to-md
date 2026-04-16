"use client";

import { useParams } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { coerceLocale } from "@/lib/i18n/config";
import { en } from "@/lib/i18n/en";
import { es } from "@/lib/i18n/es";

const dictionaries = { en, es } as const;

export default function Loading() {
  const params = useParams<{ locale?: string }>();
  const locale = coerceLocale(params?.locale);
  const dictionary = dictionaries[locale];

  return (
    <main className="min-h-screen bg-background">
      <AppShell locale={locale} copy={dictionary.shell}>
        <Card className="border-border bg-surface shadow-workbench">
          <CardHeader>
            <CardTitle className="text-foreground">
              {dictionary.loading.cardTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="h-12 animate-pulse rounded-2xl bg-surface-strong" />
            <div className="h-105 animate-pulse rounded-3xl bg-surface-muted" />
          </CardContent>
        </Card>
      </AppShell>
    </main>
  );
}
