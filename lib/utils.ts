import { isIP } from "node:net";

const FALLBACK_FILENAME_BASE = "site2markdown-output";
const MAX_FILENAME_BASE_LENGTH = 80;
const WINDOWS_RESERVED_DEVICE_NAMES = new Set([
  "con",
  "prn",
  "aux",
  "nul",
  "com1",
  "com2",
  "com3",
  "com4",
  "com5",
  "com6",
  "com7",
  "com8",
  "com9",
  "lpt1",
  "lpt2",
  "lpt3",
  "lpt4",
  "lpt5",
  "lpt6",
  "lpt7",
  "lpt8",
  "lpt9",
]);

function stripBracketsAndDot(hostname: string) {
  return hostname.replace(/^\[(.*)\]$/u, "$1").replace(/\.$/u, "");
}

function parseIpv4Octets(hostname: string) {
  const parts = hostname.split(".");
  if (parts.length !== 4) return null;
  const octets = parts.map((part) => {
    if (!/^\d+$/u.test(part)) return Number.NaN;
    const value = Number(part);
    return Number.isInteger(value) && value >= 0 && value <= 255 ? value : Number.NaN;
  });
  return octets.some(Number.isNaN) ? null : octets;
}

function isPrivateIpv4(hostname: string) {
  const octets = parseIpv4Octets(hostname);
  if (!octets) return false;

  const [first, second] = octets;

  if (first === 0) return true;
  if (first === 10) return true;
  if (first === 127) return true;
  if (first === 169 && second === 254) return true;
  if (first === 192 && second === 168) return true;
  if (first === 100 && second >= 64 && second <= 127) return true;
  if (first === 172 && second >= 16 && second <= 31) return true;

  return false;
}

function isPrivateIpv6(hostname: string) {
  const normalized = hostname.toLowerCase();

  if (normalized === "::" || normalized === "::1") return true;
  if (/^fe[89ab]/u.test(normalized)) {
    return true;
  }
  if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true;
  if (normalized.startsWith("::ffff:")) {
    return isPrivateIpv4(normalized.slice("::ffff:".length));
  }

  return false;
}

export function normalizeHostname(hostname: string) {
  return stripBracketsAndDot(hostname.trim().toLowerCase());
}

export function isLocalHostname(hostname: string) {
  const normalized = normalizeHostname(hostname);
  return (
    normalized === "localhost" ||
    normalized.endsWith(".localhost") ||
    normalized === "localhost.localdomain" ||
    normalized.endsWith(".localhost.localdomain") ||
    normalized === "local"
  );
}

export function isInternalHostname(hostname: string) {
  const normalized = normalizeHostname(hostname);

  if (isLocalHostname(normalized)) return true;
  if (normalized.endsWith(".local")) return true;
  if (normalized.endsWith(".internal")) return true;
  if (normalized.endsWith(".intranet")) return true;
  if (normalized.endsWith(".lan")) return true;
  if (normalized.endsWith(".corp")) return true;
  if (normalized.endsWith(".home")) return true;

  return !normalized.includes(".");
}

export function isPrivateHostname(hostname: string) {
  const normalized = normalizeHostname(hostname);
  const ipVersion = isIP(normalized);

  if (isInternalHostname(normalized)) return true;
  if (normalized === "0.0.0.0") return true;

  if (ipVersion === 4) return isPrivateIpv4(normalized);
  if (ipVersion === 6) return isPrivateIpv6(normalized);

  return false;
}

export function isReservedWindowsDeviceName(name: string) {
  return WINDOWS_RESERVED_DEVICE_NAMES.has(normalizeHostname(name));
}

export function slugifyFilenameBase(input: string | null | undefined) {
  const normalized = (input ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/gu, "")
    .replace(/['’]/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/-+/gu, "-")
    .replace(/^-+|-+$/gu, "")
    .slice(0, MAX_FILENAME_BASE_LENGTH)
    .replace(/-+$/u, "");

  return normalized || FALLBACK_FILENAME_BASE;
}
