const keysCache = new Map();
const bytes = (s) =>
  Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) =>
    c.charCodeAt(0),
  );
export async function authorize(request, env, fetchKeys = fetch) {
  const domain = env.ACCESS_TEAM_DOMAIN || "";
  if (
    !/^[a-z0-9-]+\.cloudflareaccess\.com$/.test(domain) ||
    !env.ACCESS_AUD ||
    !env.ADMIN_EMAIL
  )
    return false;
  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token || token.length > 12000) return false;
  try {
    const [h, p, sig, extra] = token.split(".");
    if (extra || !sig) return false;
    const header = JSON.parse(new TextDecoder().decode(bytes(h)));
    const claims = JSON.parse(new TextDecoder().decode(bytes(p)));
    const now = Date.now() / 1000;
    if (
      header.alg !== "RS256" ||
      typeof header.kid !== "string" ||
      claims.iss !== `https://${domain}` ||
      !Number.isFinite(claims.exp) ||
      claims.exp <= now ||
      !Number.isFinite(claims.iat) ||
      claims.iat > now + 30 ||
      (claims.nbf !== undefined &&
        (!Number.isFinite(claims.nbf) || claims.nbf > now + 30)) ||
      !(Array.isArray(claims.aud) ? claims.aud : [claims.aud]).includes(
        env.ACCESS_AUD,
      ) ||
      typeof claims.sub !== "string" ||
      !claims.sub ||
      String(claims.email || "").toLowerCase() !== env.ADMIN_EMAIL.toLowerCase()
    )
      return false;
    let cached = keysCache.get(domain);
    if (!cached || cached.until < now) {
      const response = await fetchKeys(
        `https://${domain}/cdn-cgi/access/certs`,
      );
      if (!response.ok) return false;
      const result = await response.json();
      cached = { keys: result.keys, until: now + 300 };
      keysCache.set(domain, cached);
    }
    const jwk = cached.keys?.find(
      (k) => k.kid === header.kid && k.kty === "RSA",
    );
    if (!jwk) return false;
    const key = await crypto.subtle.importKey(
      "jwk",
      jwk,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"],
    );
    return await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      key,
      bytes(sig),
      new TextEncoder().encode(`${h}.${p}`),
    );
  } catch {
    return false;
  }
}
