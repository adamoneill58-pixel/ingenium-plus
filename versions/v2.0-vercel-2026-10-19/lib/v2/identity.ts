import type { ChatGPTUser } from "../v151/chatgpt-user";
export interface AccessConfig {
  ACCESS_TEAM_DOMAIN?: string;
  ACCESS_AUD?: string;
}
type Jwk = JsonWebKey & { kid?: string; alg?: string };
const keyCache = new Map<string, { until: number; keys: Jwk[] }>();
function decode(value: string): Uint8Array {
  return Uint8Array.from(
    atob(value.replace(/-/g, "+").replace(/_/g, "/")),
    (c) => c.charCodeAt(0),
  );
}
/** Only a signed Access assertion establishes identity; oai-* headers are ignored. */
export async function verifyAccessToken(
  token: string | null,
  config: AccessConfig,
  fetcher: typeof fetch = fetch,
  now = Date.now(),
): Promise<ChatGPTUser | null> {
  try {
    const domain = config.ACCESS_TEAM_DOMAIN;
    if (
      !token ||
      token.length > 16384 ||
      !domain ||
      !/^[a-z0-9-]+\.cloudflareaccess\.com$/.test(domain) ||
      !config.ACCESS_AUD
    )
      return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const head = JSON.parse(new TextDecoder().decode(decode(parts[0])));
    if (head.alg !== "RS256" || typeof head.kid !== "string") return null;
    const issuer = `https://${domain}`;
    const claims = JSON.parse(new TextDecoder().decode(decode(parts[1])));
    const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
    if (
      claims.iss !== issuer ||
      !audiences.includes(config.ACCESS_AUD) ||
      typeof claims.exp !== "number" ||
      claims.exp * 1000 <= now ||
      (claims.nbf !== undefined &&
        (typeof claims.nbf !== "number" || claims.nbf * 1000 > now)) ||
      typeof claims.sub !== "string" ||
      !claims.sub ||
      typeof claims.email !== "string"
    )
      return null;
    let cached = keyCache.get(domain);
    // Unknown key IDs fail closed against the cached set. They cannot force
    // unbounded certificate requests; the set refreshes after five minutes.
    if (!cached || cached.until <= now) {
      const res = await fetcher(`${issuer}/cdn-cgi/access/certs`, {
        redirect: "error",
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) return null;
      const body = (await res.json()) as { keys: Jwk[] };
      if (!Array.isArray(body.keys) || body.keys.length > 20) return null;
      cached = { until: now + 300000, keys: body.keys };
      keyCache.set(domain, cached);
    }
    const jwk = cached.keys.find(
      (k) =>
        k.kid === head.kid && k.kty === "RSA" && (!k.alg || k.alg === "RS256"),
    );
    if (!jwk) return null;
    const key = await crypto.subtle.importKey(
      "jwk",
      jwk,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"],
    );
    if (
      !(await crypto.subtle.verify(
        "RSASSA-PKCS1-v1_5",
        key,
        decode(parts[2]) as Uint8Array<ArrayBuffer>,
        new TextEncoder().encode(`${parts[0]}.${parts[1]}`),
      ))
    )
      return null;
    return {
      userId: claims.sub,
      email: claims.email,
      displayName: claims.email,
      fullName: null,
    };
  } catch {
    return null;
  }
}
