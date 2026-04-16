import { LoaderCircle, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n/types";

export function SubmitButton({
  pending,
  copy,
}: Readonly<{
  pending: boolean;
  copy: Dictionary["buttons"];
}>) {
  return (
    <Button type="submit" size="lg" disabled={pending} className="min-w-44 gap-2">
      {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Sparkles className="size-4" aria-hidden="true" />}
      {pending ? copy.submitting : copy.submit}
    </Button>
  );
}
