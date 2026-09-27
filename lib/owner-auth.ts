import { env } from "cloudflare:workers";

export async function isOwner(authorization: string | null) {
  const password = (env as typeof env & { ADMIN_PASSWORD?: string }).ADMIN_PASSWORD;
  if (!password || !authorization?.startsWith("Basic ")) return false;
  try {
    const supplied = atob(authorization.slice(6));
    const encoder = new TextEncoder();
    const expected = await crypto.subtle.digest("SHA-256", encoder.encode("owner:" + password));
    const actual = await crypto.subtle.digest("SHA-256", encoder.encode(supplied));
    return crypto.subtle.timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}
