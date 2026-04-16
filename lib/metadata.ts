import { isReservedWindowsDeviceName, slugifyFilenameBase } from "./utils";

const FALLBACK_DOWNLOAD_FILENAME = "site2markdown-output";
const MAX_DOWNLOAD_FILENAME_LENGTH = 80;

export function buildDownloadFilename(title: string | null | undefined) {
  let base = slugifyFilenameBase(title ?? FALLBACK_DOWNLOAD_FILENAME).slice(0, MAX_DOWNLOAD_FILENAME_LENGTH);

  if (isReservedWindowsDeviceName(base)) {
    base = `${base}-file`;
  }

  return `${base}.md`;
}
