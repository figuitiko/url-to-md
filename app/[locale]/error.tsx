"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { useParams } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { coerceLocale } from "@/lib/i18n/config";
import { en } from "@/lib/i18n/en";
import { es } from "@/lib/i18n/es";

const dictionaries = { en, es } as const;

export default function Error({
  error,
  reset,
}: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  const params = useParams<{ locale?: string }>();
  const locale = coerceLocale(params?.locale);
  const dictionary = dictionaries[locale];

  return (
    <main className="min-h-screen bg-background">
      <AppShell locale={locale} copy={dictionary.shell}>
        <Card className="border-danger-border bg-danger-surface shadow-workbench">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-danger-foreground">
              <AlertTriangle className="size-5" aria-hidden="true" />
              {dictionary.routeError.cardTitle}
            </CardTitle>
            <CardDescription className="text-danger-muted">
              {dictionary.routeError.cardDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 rounded-2xl border border-danger-border bg-danger-panel px-4 py-3 text-sm leading-6 text-danger-foreground">
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
