"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Error({ error, reset }: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  return (
    <main className="min-h-screen bg-background">
      <AppShell
        eyebrow="Runtime recovery"
        title="The app hit an unexpected route-level error."
        description="This is separate from extraction failures. Reset the route and let’s get you back to the workbench."
      >
        <Card className="border-red-500/30 bg-red-500/10 shadow-[0_0_0_1px_rgba(239,68,68,0.1)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-red-100">
              <AlertTriangle className="size-5" aria-hidden="true" />
              Unexpected app error
            </CardTitle>
            <CardDescription className="text-red-100/75">
              The framework interrupted the page before the form could finish rendering.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 rounded-2xl border border-red-500/20 bg-black/20 px-4 py-3 text-sm leading-6 text-red-50/90">
              {error.message || "Unknown route-level failure."}
            </p>
            <Button onClick={reset} className="gap-2">
              <RotateCcw className="size-4" aria-hidden="true" />
              Try again
            </Button>
          </CardContent>
        </Card>
      </AppShell>
    </main>
  );
}
