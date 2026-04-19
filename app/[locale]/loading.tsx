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
          <CardHeader className="gap-4">
            <CardTitle className="text-foreground">
              {dictionary.loading.cardTitle}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground" role="status" aria-live="polite">
              <div className="size-2 rounded-full bg-sky-400 animate-pulse" />
              <span>{dictionary.loading.description}</span>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
            <div className="space-y-4 rounded-[28px] border border-border bg-surface-strong p-5">
              <div className="h-5 w-32 animate-pulse rounded-full bg-surface-muted" />
              <div className="h-11 animate-pulse rounded-2xl bg-surface-muted" />
              <div className="h-11 animate-pulse rounded-2xl bg-surface-muted" />
              <div className="h-11 w-40 animate-pulse rounded-2xl bg-surface-muted" />
              <div className="h-4 w-3/4 animate-pulse rounded-full bg-surface-muted" />
              <div className="h-4 w-2/3 animate-pulse rounded-full bg-surface-muted" />
            </div>

            <div className="space-y-4 rounded-[28px] border border-border bg-surface-strong p-5">
              <div className="flex gap-3">
                <div className="h-7 w-32 animate-pulse rounded-full bg-surface-muted" />
                <div className="h-7 w-28 animate-pulse rounded-full bg-surface-muted" />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="h-20 animate-pulse rounded-2xl bg-surface-muted" />
                <div className="h-20 animate-pulse rounded-2xl bg-surface-muted" />
                <div className="h-20 animate-pulse rounded-2xl bg-surface-muted" />
              </div>
              <div className="h-80 animate-pulse rounded-[28px] bg-surface-muted" />
            </div>
          </CardContent>
        </Card>
      </AppShell>
    </main>
  );
}
