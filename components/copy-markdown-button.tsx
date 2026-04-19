"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n/types";

export function CopyMarkdownButton({
  markdown,
  copy,
}: Readonly<{
  markdown: string;
  copy: Dictionary["buttons"];
}>) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;

    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      toast.success(copy.copySuccess);
    } catch {
      setCopied(false);
      toast.error(copy.copyError);
    }
  }

  return (
    <Button type="button" variant="secondary" onClick={handleCopy} className="gap-2">
      {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
      {copied ? copy.copied : copy.copy}
    </Button>
  );
}
