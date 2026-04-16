import { AlertTriangle, LoaderCircle } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ErrorMessage({
  message,
  pending,
}: Readonly<{
  message: string;
  pending?: boolean;
}>) {
  return (
    <Card className="border-red-500/30 bg-red-500/10 shadow-2xl shadow-red-950/20" role="alert" aria-live="assertive">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-red-100">
          {pending ? <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> : <AlertTriangle className="size-5" aria-hidden="true" />}
          Conversion failed
        </CardTitle>
        <CardDescription className="text-red-100/75">
          Friendly validation and extraction errors stay inline so you can correct the request without losing context.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="rounded-2xl border border-red-500/20 bg-black/20 px-4 py-3 text-sm leading-6 text-red-50">{message}</p>
      </CardContent>
    </Card>
  );
}
