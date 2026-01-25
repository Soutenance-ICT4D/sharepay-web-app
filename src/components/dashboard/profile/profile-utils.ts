export type JwtClaims = {
  sub?: string;
  email?: string;
  name?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
};

function base64UrlDecode(input: string) {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return atob(padded);
}

export function decodeJwt(token: string): JwtClaims | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = base64UrlDecode(parts[1]);
    return JSON.parse(payload) as JwtClaims;
  } catch {
    return null;
  }
}

export function formatEpochSeconds(epochSeconds?: number) {
  if (!epochSeconds) return null;
  try {
    return new Date(epochSeconds * 1000).toLocaleString();
  } catch {
    return null;
  }
}
