import { AlertTriangle, LoaderCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <Card
      className="border-danger-border bg-danger-surface shadow-workbench"
      role="alert"
      aria-live="assertive"
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-danger-foreground">
          {pending ? (
            <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
          ) : (
            <AlertTriangle className="size-5" aria-hidden="true" />
          )}
          {copy.title}
        </CardTitle>
        <CardDescription className="text-danger-muted">
          {copy.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="rounded-2xl border border-danger-border bg-danger-panel px-4 py-3 text-sm leading-6 text-danger-foreground">
          {message}
        </p>
      </CardContent>
    </Card>
  );
}
