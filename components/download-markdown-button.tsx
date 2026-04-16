"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

export function DownloadMarkdownButton({
  markdown,
  filename,
}: Readonly<{
  markdown: string;
  filename: string;
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
      Download .md
    </Button>
  );
}
