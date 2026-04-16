import type { Metadata } from "next";
import { headers } from "next/headers";
import type { ReactNode } from "react";

import "@/app/globals.css";
import { coerceLocale } from "@/lib/i18n/config";

export const metadata: Metadata = {
  title: {
    default: "Site2Markdown",
    template: "%s | Site2Markdown",
  },
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const requestHeaders = await headers();
  const locale = coerceLocale(requestHeaders.get("x-site-locale"));

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}
