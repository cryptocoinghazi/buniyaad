import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { readFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import worker from "../worker/index.mjs";
import { authorize } from "../worker/auth.mjs";
import { blankContent, validateContent } from "../worker/content.mjs";
const base = "https://buniyaad.example";
let privateKey, jwk, token, originalFetch, temporary;
const b64 = (x) =>
  Buffer.from(typeof x === "string" ? x : JSON.stringify(x)).toString(
    "base64url",
  );
async function sign(extra = {}, header = {}) {
  const h = b64({ alg: "RS256", kid: "test-key", ...header }),
    p = b64({
      iss: "https://buniyaad-test.cloudflareaccess.com",
      aud: ["test-aud"],
      sub: "owner",
      email: "owner@example.com",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      ...extra,
    });
  return `${h}.${p}.${Buffer.from(await crypto.subtle.sign("RSASSA-PKCS1-v1_5", privateKey, new TextEncoder().encode(`${h}.${p}`))).toString("base64url")}`;
}
before(async () => {
  temporary = await mkdtemp(path.join(tmpdir(), "buniyaad-"));
  const pair = await crypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
    },
    true,
    ["sign", "verify"],
  );
  privateKey = pair.privateKey;
  jwk = {
    ...(await crypto.subtle.exportKey("jwk", pair.publicKey)),
    kid: "test-key",
  };
  token = await sign();
  originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    assert.equal(
      String(url),
      "https://buniyaad-test.cloudflareaccess.com/cdn-cgi/access/certs",
    );
    return Response.json({ keys: [jwk] });
  };
});
after(async () => {
  globalThis.fetch = originalFetch;
  await rm(temporary, { recursive: true, force: true });
});
class D1 {
  constructor(filename = ":memory:") {
    this.db = new DatabaseSync(filename);
  }
  prepare(sql) {
    const db = this.db;
    return {
      args: [],
      bind(...args) {
        this.args = args;
        return this;
      },
      async first() {
        return db.prepare(sql).get(...this.args) || null;
      },
      async all() {
        return { results: db.prepare(sql).all(...this.args) };
      },
      async run() {
        const r = db.prepare(sql).run(...this.args);
        return { meta: { changes: r.changes } };
      },
    };
  }
  async batch(statements) {
    this.db.exec("BEGIN");
    try {
      const results = [];
      for (const s of statements) results.push(await s.run());
      this.db.exec("COMMIT");
      return results;
    } catch (e) {
      this.db.exec("ROLLBACK");
      throw e;
    }
  }
}
async function environment(filename) {
  const DB = new D1(filename);
  DB.db.exec(await readFile("migrations/0001_content.sql", "utf8"));
  const objects = new Map();
  return {
    DB,
    BUCKET: {
      async put(k, v) {
        objects.set(k, Uint8Array.from(v));
      },
      async get(k) {
        return objects.has(k) ? { body: objects.get(k) } : null;
      },
      async delete(k) {
        objects.delete(k);
      },
    },
    ASSETS: {
      async fetch(req) {
        try {
          const p = new URL(req.url).pathname;
          return new Response(await readFile(path.join("dist", p)), {
            headers: {
              "Content-Type": p.endsWith(".html")
                ? "text/html"
                : "application/octet-stream",
            },
          });
        } catch {
          return new Response("Not found", { status: 404 });
        }
      },
    },
    PUBLIC_ORIGIN: base,
    INDEXING_ENABLED: "false",
    ACCESS_TEAM_DOMAIN: "buniyaad-test.cloudflareaccess.com",
    ACCESS_AUD: "test-aud",
    ADMIN_EMAIL: "owner@example.com",
  };
}
const request = (url, options = {}) => new Request(base + url, options);
const get = (env, url, headers = {}) =>
  worker.fetch(request(url, { headers }), env);
const adminHeaders = () => ({
  "Cf-Access-Jwt-Assertion": token,
  Origin: base,
  "Content-Type": "application/json",
});
const load = async (env) =>
  (await get(env, "/api/admin/content", adminHeaders())).json();
const save = (env, data, headers = adminHeaders()) =>
  worker.fetch(
    request("/api/admin/content", {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    }),
    env,
  );

test("owner authorization verifies signature, issuer, audience, expiry and explicit email", async () => {
  const env = await environment();
  assert.equal(
    await authorize(request("/admin", { headers: adminHeaders() }), env),
    true,
  );
  for (const claims of [
    { email: "other@example.com" },
    { aud: ["wrong"] },
    { iss: "https://attacker.example" },
    { exp: 1 },
    { iat: Math.floor(Date.now() / 1000) + 500 },
    { sub: "" },
  ]) {
    const t = await sign(claims);
    assert.equal(
      await authorize(
        request("/admin", { headers: { "Cf-Access-Jwt-Assertion": t } }),
        env,
      ),
      false,
    );
  }
  assert.equal(
    await authorize(
      request("/admin", {
        headers: { "Cf-Access-Jwt-Assertion": token.slice(0, -4) + "AAAA" },
      }),
      env,
    ),
    false,
  );
  assert.equal(
    await authorize(
      request("/admin", {
        headers: {
          "oai-authenticated-user-email": "owner@example.com",
          "Cf-Access-Authenticated-User-Email": "owner@example.com",
        },
      }),
      env,
    ),
    false,
  );
  assert.equal(
    await authorize(request("/admin", { headers: adminHeaders() }), {
      ...env,
      ACCESS_AUD: "",
    }),
    false,
  );
});
test("anonymous visitors cannot read admin, change content, upload, or obtain backups", async () => {
  const env = await environment();
  for (const url of [
    "/admin",
    "/admin/",
    "/admin.html",
    "/admin.js",
    "/api/admin/content",
    "/api/admin/backup",
    "/api/admin/preview/completed-modern",
  ])
    assert.equal((await get(env, url)).status, 401, url);
  assert.equal(
    (await save(env, blankContent(), { "Content-Type": "application/json" }))
      .status,
    401,
  );
  assert.equal(
    (await worker.fetch(request("/api/admin/media", { method: "POST" }), env))
      .status,
    401,
  );
  const headers = { ...adminHeaders(), Origin: "https://attacker.example" };
  assert.equal(
    (await save(env, { ...blankContent(), revision: 0 }, headers)).status,
    403,
  );
});
test("published changes persist across independent requests and database reopening; conflicting editors are rejected", async () => {
  const file = path.join(temporary, "content.db"),
    env = await environment(file);
  const content = await load(env);
  content.settings.businessName = "Owner supplied name";
  let response = await save(env, content);
  assert.equal(response.status, 200);
  const saved = await response.json();
  const old = structuredClone(content);
  old.settings.businessName = "Stale overwrite";
  assert.equal((await save(env, old)).status, 409);
  env.DB.db.close();
  env.DB = new D1(file);
  const page = await get(env, "/");
  assert.equal(page.status, 200);
  assert.match(await page.text(), /Owner supplied name/);
  assert.equal((await load(env)).revision, saved.revision);
});
test("drafts are absent from public HTML, JSON and sitemap; archive/delete revoke visibility immediately", async () => {
  const env = await environment();
  env.INDEXING_ENABLED = "true";
  let c = await load(env);
  c.projects[0].publication = "draft";
  assert.equal((await save(env, c)).status, 200);
  for (const url of ["/", "/api/public/content", "/sitemap.xml"]) {
    const text = await (await get(env, url)).text();
    assert.doesNotMatch(
      text,
      /Contemporary Residence|contemporary-residence-yavatmal/,
      url,
    );
  }
  assert.equal(
    (await get(env, "/projects/contemporary-residence-yavatmal/")).status,
    404,
  );
  assert.equal(
    (await get(env, "/api/admin/preview/completed-modern", adminHeaders()))
      .status,
    200,
  );
  c = await load(env);
  c.projects[0].publication = "published";
  await save(env, c);
  assert.equal(
    (await get(env, "/projects/contemporary-residence-yavatmal/")).status,
    200,
  );
  c = await load(env);
  c.projects[0].publication = "archived";
  await save(env, c);
  assert.equal(
    (await get(env, "/projects/contemporary-residence-yavatmal/")).status,
    404,
  );
  c = await load(env);
  c.projects = [];
  await save(env, c);
  assert.doesNotMatch(
    await (await get(env, "/sitemap.xml")).text(),
    /\/projects\//,
  );
});
test("server renders projects, service copy, honest labels and published translations without JavaScript", async () => {
  const env = await environment();
  const response = await get(env, "/"),
    html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /<div class="project-grid"[^>]*><article/);
  assert.match(html, /Original photo/);
  assert.match(html, /Design visualisation/);
  assert.doesNotMatch(html, /Sample Yavatmal home journey|foundation.webp/);
  for (const l of ["hi", "mr"]) {
    const text = await (await get(env, `/${l}/`)).text();
    assert.match(text, new RegExp(`<html lang="${l}">`));
    assert.match(text, /hreflang="en"/);
    assert.match(text, l === "hi" ? /घर/ : /बांधकाम/);
  }
  const service = await (
    await get(env, "/services/sand-supplier-yavatmal/")
  ).text();
  assert.match(service, /<h1>Sand Supply in Yavatmal<\/h1>/);
  assert.match(service, /quantity/);
  assert.equal(
    (await get(env, "/hi/projects/contemporary-residence-yavatmal/")).status,
    404,
  );
  let c = await load(env);
  c.projects[0].translations.hi = {
    title: "आधुनिक निवास",
    description: "यवतमाल में पूर्ण घर की मूल तस्वीर।",
  };
  await save(env, c);
  const translated = await (
    await get(env, "/hi/projects/contemporary-residence-yavatmal/")
  ).text();
  assert.match(translated, /आधुनिक निवास/);
  assert.match(translated, /hreflang="hi"/);
  for (const match of html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
  ))
    assert.ok(JSON.parse(match[1])["@context"]);
});
test("indexing is gated by explicit production origin and flag, and sitemap excludes private paths", async () => {
  const env = await environment();
  let html = await (await get(env, "/")).text();
  assert.match(html, /noindex,nofollow/);
  assert.match(await (await get(env, "/robots.txt")).text(), /Disallow: \/\n/);
  assert.doesNotMatch(await (await get(env, "/sitemap.xml")).text(), /<loc>/);
  env.INDEXING_ENABLED = "true";
  html = await (await get(env, "/")).text();
  assert.match(html, /name="robots" content="index,follow"/);
  const sitemap = await (await get(env, "/sitemap.xml")).text();
  assert.match(sitemap, /https:\/\/buniyaad.example\/projects\//);
  assert.doesNotMatch(sitemap, /admin|draft|altimetrik/);
  const staging = await worker.fetch(
    new Request("https://staging.example/"),
    env,
  );
  assert.match(await staging.text(), /noindex,nofollow/);
  env.PUBLIC_ORIGIN = "https://new-domain.example";
  html = await (
    await worker.fetch(new Request("https://new-domain.example/"), env)
  ).text();
  assert.match(
    html,
    /<link rel="canonical" href="https:\/\/new-domain.example\/"/,
  );
  assert.doesNotMatch(html, /altimetrik.chatgpt.site/);
});
test("renamed project URLs redirect to the current published slug, then stop when unpublished", async () => {
  const env = await environment();
  let c = await load(env);
  c.projects[0].slug = "renamed-house";
  assert.equal((await save(env, c)).status, 200);
  let response = await get(env, "/projects/contemporary-residence-yavatmal/");
  assert.equal(response.status, 301);
  assert.equal(
    response.headers.get("location"),
    base + "/projects/renamed-house/",
  );
  c = await load(env);
  c.projects[0].publication = "draft";
  await save(env, c);
  assert.equal(
    (await get(env, "/projects/contemporary-residence-yavatmal/")).status,
    404,
  );
});
test("upload preserves original bytes and unpublished image variants are protected", async () => {
  const env = await environment();
  const bytes = new Uint8Array(
    await readFile("dist/assets/completed-enhanced.webp"),
  );
  const form = new FormData();
  for (const k of ["original", "display", "thumb"])
    form.append(k, new File([bytes], "test.webp", { type: "image/webp" }));
  form.append("width", "1536");
  form.append("height", "1024");
  const response = await worker.fetch(
    request("/api/admin/media", {
      method: "POST",
      headers: { "Cf-Access-Jwt-Assertion": token, Origin: base },
      body: form,
    }),
    env,
  );
  assert.equal(response.status, 201);
  const media = await response.json();
  assert.equal((await get(env, media.src)).status, 404);
  const original = await get(
    env,
    `/api/admin/media/${media.id}/original`,
    adminHeaders(),
  );
  assert.deepEqual(new Uint8Array(await original.arrayBuffer()), bytes);
  const c = await load(env);
  c.projects[0].images = [
    {
      ...media,
      kind: "original",
      alt: "Owner-provided image",
      caption: "",
      stage: "completed",
    },
  ];
  await save(env, c);
  assert.equal((await get(env, media.src)).status, 200);
  assert.equal(
    (await get(env, media.src.replace("/display", "/original"))).status,
    404,
  );
  const html = await (await get(env, "/")).text();
  assert.match(html, /srcset=/);
  c.revision = 1;
  c.projects[0].publication = "draft";
  assert.equal((await save(env, c)).status, 200);
  assert.equal((await get(env, media.src)).status, 404);
});
test("validation rejects external media, injected paths, empty published projects and missing upload references", async () => {
  const env = await environment();
  for (const src of [
    "javascript:alert(1)",
    "https://attacker.example/p.jpg",
    "/assets/../admin.html",
    "data:image/png;base64,AAAA",
  ]) {
    const c = { ...blankContent(), revision: 0 };
    c.projects[0].images[0].src = src;
    assert.equal((await save(env, c)).status, 400);
  }
  let c = { ...blankContent(), revision: 0 };
  c.projects[0].images = [];
  assert.equal((await save(env, c)).status, 400);
  c = { ...blankContent(), revision: 0 };
  c.projects[0].images[0].src =
    "/media/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/display";
  assert.equal((await save(env, c)).status, 400);
  assert.throws(() =>
    validateContent({
      ...blankContent(),
      projects: [{ ...blankContent().projects[0], slug: "bad/slug" }],
    }),
  );
});
test("unknown routes return real 404s; admin HTML is non-cacheable and noindex", async () => {
  const env = await environment();
  assert.equal((await get(env, "/missing-page/")).status, 404);
  assert.equal((await get(env, "/index.html")).status, 301);
  assert.equal(
    (await get(env, "/services/sand-supplier-yavatmal")).status,
    301,
  );
  const admin = await get(env, "/admin", adminHeaders());
  assert.equal(admin.status, 200);
  assert.equal(admin.headers.get("cache-control"), "no-store");
  assert.match(admin.headers.get("x-robots-tag"), /noindex/);
});
