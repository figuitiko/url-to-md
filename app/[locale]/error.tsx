"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { useParams } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { coerceLocale } from "@/lib/i18n/config";
import { en } from "@/lib/i18n/en";
import { es } from "@/lib/i18n/es";

const dictionaries = { en, es } as const;

export default function Error({ error, reset }: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  const params = useParams<{ locale?: string }>();
  const locale = coerceLocale(params?.locale);
  const dictionary = dictionaries[locale];

  return (
    <main className="min-h-screen bg-background">
      <AppShell locale={locale} copy={dictionary.shell}>
        <Card className="border-red-500/30 bg-red-500/10 shadow-[0_0_0_1px_rgba(239,68,68,0.1)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-red-100">
              <AlertTriangle className="size-5" aria-hidden="true" />
              {dictionary.routeError.cardTitle}
            </CardTitle>
            <CardDescription className="text-red-100/75">{dictionary.routeError.cardDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 rounded-2xl border border-red-500/20 bg-black/20 px-4 py-3 text-sm leading-6 text-red-50/90">
              {error.message || dictionary.routeError.unknownMessage}
            </p>
            <Button onClick={reset} className="gap-2">
              <RotateCcw className="size-4" aria-hidden="true" />
              {dictionary.routeError.retry}
            </Button>
          </CardContent>
        </Card>
      </AppShell>
    </main>
  );
}
