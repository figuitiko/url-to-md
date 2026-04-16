import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { defaultLocale, getLocaleOrNull } from "@/lib/i18n/config";

const LOCALE_HEADER = "x-site-locale";

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const [, localeSegment] = request.nextUrl.pathname.split("/");
  const locale = getLocaleOrNull(localeSegment) ?? defaultLocale;

  requestHeaders.set(LOCALE_HEADER, locale);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/", "/(en|es)/:path*"],
};
