import type { ConvertErrorState } from "@/lib/convert-state";
import type { Dictionary } from "@/lib/i18n/types";

export function getLocalizedConvertErrorMessage(error: ConvertErrorState, copy: Dictionary["inlineError"]) {
  if (error.errorCode === "HTTP_STATUS") {
    if (error.errorStatus === 403) return copy.http.blocked;
    if (error.errorStatus === 404) return copy.http.notFound;
    if (error.errorStatus && error.errorStatus >= 500) return copy.http.server;
    if (error.errorStatus) return `${copy.genericHttpPrefix} ${error.errorStatus}.`;
    return copy.fallback;
  }

  return copy.messages[error.errorCode] ?? copy.fallback;
}
