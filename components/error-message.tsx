import { AlertTriangle, LoaderCircle } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Dictionary } from "@/lib/i18n/types";

export function ErrorMessage({
  message,
  copy,
  pending,
}: Readonly<{
  message: string;
  copy: Dictionary["inlineError"];
  pending?: boolean;
}>) {
  return (
    <Card className="border-red-500/30 bg-red-500/10 shadow-2xl shadow-red-950/20" role="alert" aria-live="assertive">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-red-100">
          {pending ? <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> : <AlertTriangle className="size-5" aria-hidden="true" />}
          {copy.title}
        </CardTitle>
        <CardDescription className="text-red-100/75">{copy.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="rounded-2xl border border-red-500/20 bg-black/20 px-4 py-3 text-sm leading-6 text-red-50">{message}</p>
      </CardContent>
    </Card>
  );
}
