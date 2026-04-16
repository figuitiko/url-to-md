import { LoaderCircle, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export function SubmitButton({ pending }: Readonly<{ pending: boolean }>) {
  return (
    <Button type="submit" size="lg" disabled={pending} className="min-w-44 gap-2">
      {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Sparkles className="size-4" aria-hidden="true" />}
      {pending ? "Converting…" : "Extract markdown"}
    </Button>
  );
}
