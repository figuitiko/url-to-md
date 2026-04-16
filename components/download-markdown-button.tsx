"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n/types";

export function DownloadMarkdownButton({
  markdown,
  filename,
  copy,
}: Readonly<{
  markdown: string;
  filename: string;
  copy: Dictionary["buttons"];
}>) {
  function handleDownload() {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = objectUrl;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(objectUrl);
  }

  return (
    <Button type="button" onClick={handleDownload} className="gap-2">
      <Download className="size-4" aria-hidden="true" />
      {copy.download}
    </Button>
  );
}
