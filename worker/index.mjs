import { authorize } from "./auth.mjs";
import {
  readContent,
  published,
  validateContent,
  esc,
  originFor,
  indexing,
  LANGUAGES,
} from "./content.mjs";
import { services } from "./services.mjs";
import {
  renderHome,
  renderProject,
  renderService,
  shell,
  homePath,
  projectPath,
} from "./render.mjs";
const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
const error = (status, message) =>
  Object.assign(new Error(message), { status });
async function limitedBody(request, limit) {
  const chunks = [];
  let size = 0;
  if (Number(request.headers.get("content-length")) > limit)
    throw error(413, "Upload too large");
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > limit) {
      await reader.cancel();
      throw error(413, "Upload too large");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const c of chunks) {
    bytes.set(c, offset);
    offset += c.length;
  }
  return bytes;
}
function imageType(bytes) {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff)
    return "image/jpeg";
  if (
    bytes.length > 24 &&
    [137, 80, 78, 71, 13, 10, 26, 10].every((v, i) => bytes[i] === v)
  )
    return "image/png";
  const prefix = new TextDecoder().decode(bytes.slice(0, 16));
  if (
    prefix.startsWith("RIFF") &&
    prefix.slice(8, 12) === "WEBP" &&
    ["VP8 ", "VP8L", "VP8X"].includes(prefix.slice(12, 16))
  )
    return "image/webp";
  return null;
}
async function serveMedia(request, env, path, admin) {
  const match = path.match(
    /^\/(?:api\/admin\/)?media\/([a-f0-9-]{36})\/(display|thumb|original)$/,
  );
  if (!match) return null;
  const [, id, variant] = match;
  if (variant === "original" && !admin)
    return json({ error: "Not found" }, 404);
  if (!admin) {
    const content = published(await readContent(env));
    if (
      !content.projects.some((p) =>
        p.images.some((im) => im.src === `/media/${id}/display`),
      )
    )
      return json({ error: "Not found" }, 404);
  }
  const meta = await env.DB.prepare("SELECT * FROM media WHERE id = ?")
    .bind(id)
    .first();
  if (!meta) return json({ error: "Not found" }, 404);
  const object = await env.BUCKET.get(`${id}/${variant}`);
  if (!object) return json({ error: "Not found" }, 404);
  return new Response(object.body, {
    headers: {
      "Content-Type":
        variant === "original" ? meta.original_type : "image/webp",
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": admin ? "noindex" : "index",
      ...(variant === "original"
        ? {
            "Content-Disposition": `attachment; filename="${id}.${meta.original_type.split("/")[1]}"`,
          }
        : {}),
    },
  });
}
async function adminApi(request, env, path) {
  if (path === "/api/admin/health" && request.method === "GET") {
    const c = await readContent(env),
      publicContent = published(c),
      issues = [];
    if (!env.PUBLIC_ORIGIN) issues.push("Production domain is not configured.");
    if (env.INDEXING_ENABLED !== "true")
      issues.push("Search indexing is disabled (correct for staging).");
    if (!c.settings.phone || !c.settings.whatsapp)
      issues.push("Phone or WhatsApp details are missing.");
    const titles = new Set(),
      descriptions = new Set();
    for (const p of publicContent.projects) {
      const title = p.seoTitle || `${p.title} | ${c.settings.businessName}`,
        description = p.seoDescription || p.description.slice(0, 250);
      if (titles.has(title))
        issues.push(`Duplicate project search title: ${p.title}`);
      if (descriptions.has(description))
        issues.push(`Duplicate project search description: ${p.title}`);
      titles.add(title);
      descriptions.add(description);
      if (!description) issues.push(`Missing description: ${p.title}`);
      for (const im of p.images)
        if (!im.alt) issues.push(`Missing image description: ${p.title}`);
    }
    return json({
      issues,
      publishedProjects: publicContent.projects.length,
      draftProjects: c.projects.filter((p) => p.publication === "draft").length,
      note: "This checks configuration and published project metadata. Use npm run check and public crawl checks for technical validation; it does not measure Google ranking or verify indexing.",
    });
  }
  if (path === "/api/admin/content" && request.method === "GET")
    return json(await readContent(env));
  if (path === "/api/admin/backup" && request.method === "GET") {
    const content = await readContent(env);
    const rows = await env.DB.prepare("SELECT * FROM media").all();
    return json({
      format: "buniyaad-shared-v1",
      exportedAt: new Date().toISOString(),
      content,
      mediaManifest: rows.results,
    });
  }
  if (path === "/api/admin/content" && request.method === "PUT") {
    if (!request.headers.get("content-type")?.startsWith("application/json"))
      throw error(415, "JSON required");
    let incoming;
    try {
      incoming = JSON.parse(
        new TextDecoder().decode(await limitedBody(request, 1_500_000)),
      );
    } catch (e) {
      if (e.status) throw e;
      throw error(400, "Invalid JSON");
    }
    let content;
    try {
      content = validateContent(incoming);
    } catch (e) {
      throw error(400, e.message);
    }
    const before = await readContent(env);
    if (incoming.revision !== before.revision)
      throw error(
        409,
        "Content changed in another session. Export your edits, then reload before saving.",
      );
    const checkedAssets = new Set(),
      mediaIds = new Set();
    for (const p of content.projects)
      for (const image of p.images) {
        const m = image.src.match(/^\/media\/([^/]+)\//);
        if (m) mediaIds.add(m[1]);
        if (!m && !checkedAssets.has(image.src)) {
          const asset = await env.ASSETS.fetch(
            new Request(new URL(image.src, request.url)),
          );
          if (!asset.ok) throw error(400, `Missing site image: ${image.src}`);
          checkedAssets.add(image.src);
        }
      }
    if (mediaIds.size) {
      const existing = await env.DB.prepare(
        "SELECT id FROM media WHERE id IN (SELECT value FROM json_each(?))",
      )
        .bind(JSON.stringify([...mediaIds]))
        .all();
      if (existing.results.length !== mediaIds.size)
        throw error(400, "A project references a missing upload");
    }
    const aliases = (
      await env.DB.prepare(
        "SELECT slug,project_id FROM project_redirects",
      ).all()
    ).results;
    if (
      content.projects.some((p) =>
        aliases.some((a) => a.slug === p.slug && a.project_id !== p.id),
      )
    )
      throw error(
        400,
        "This URL belongs to another project's history; choose a different URL",
      );
    if (
      content.projects.some((p) =>
        before.projects.some((old) => old.slug === p.slug && old.id !== p.id),
      )
    )
      throw error(
        400,
        "A project cannot reuse another project's URL in the same update",
      );
    const now = new Date().toISOString(),
      body = JSON.stringify(content);
    const update =
      before.revision === 0
        ? env.DB.prepare(
            "INSERT OR IGNORE INTO site_content (id,body,revision,updated_at) VALUES (1,?,1,?)",
          ).bind(body, now)
        : env.DB.prepare(
            "UPDATE site_content SET body = ?, revision = revision + 1, updated_at = ? WHERE id = 1 AND revision = ?",
          ).bind(body, now, before.revision);
    const redirects = before.projects
      .filter((old) =>
        content.projects.some((p) => p.id === old.id && p.slug !== old.slug),
      )
      .map((old) =>
        env.DB.prepare(
          "INSERT INTO project_redirects (slug,project_id) SELECT ?,? WHERE EXISTS (SELECT 1 FROM site_content WHERE id = 1 AND revision = ? AND body = ?) ON CONFLICT(slug) DO UPDATE SET project_id=excluded.project_id",
        ).bind(old.slug, old.id, before.revision + 1, body),
      );
    const [result] = await env.DB.batch([update, ...redirects]);
    if (result.meta.changes !== 1)
      throw error(409, "Content changed. Reload before saving.");
    return json({ ...content, revision: before.revision + 1, updatedAt: now });
  }
  if (path === "/api/admin/media" && request.method === "POST") {
    if (!env.BUCKET) throw error(503, "Image storage is not configured");
    if (
      !request.headers.get("content-type")?.startsWith("multipart/form-data;")
    )
      throw error(415, "Multipart image upload required");
    const body = await limitedBody(request, 15_000_000);
    const form = await new Request(request.url, {
      method: "POST",
      headers: { "Content-Type": request.headers.get("content-type") },
      body,
    }).formData();
    const payload = {};
    for (const name of ["original", "display", "thumb"]) {
      const file = form.get(name);
      if (!(file instanceof File))
        throw error(400, "Original and two image variants required");
      const bytes = new Uint8Array(await file.arrayBuffer());
      const type = imageType(bytes);
      if (
        !type ||
        type !== file.type ||
        (name !== "original" && type !== "image/webp") ||
        bytes.length > (name === "original" ? 12_000_000 : 2_000_000)
      )
        throw error(
          400,
          "Use valid JPEG, PNG or WebP images within the upload limits",
        );
      payload[name] = { file, bytes, type };
    }
    const width = Number(form.get("width")),
      height = Number(form.get("height"));
    if (
      !Number.isInteger(width) ||
      !Number.isInteger(height) ||
      width < 1 ||
      width > 1600 ||
      height < 1 ||
      height > 1600
    )
      throw error(400, "Invalid image dimensions");
    const id = crypto.randomUUID();
    try {
      for (const [variant, item] of Object.entries(payload))
        await env.BUCKET.put(`${id}/${variant}`, item.bytes, {
          httpMetadata: { contentType: item.type },
        });
      await env.DB.prepare(
        "INSERT INTO media (id,original_type,original_name,created_at) VALUES (?,?,?,?)",
      )
        .bind(
          id,
          payload.original.type,
          payload.original.file.name.slice(0, 200),
          new Date().toISOString(),
        )
        .run();
    } catch (e) {
      for (const variant of ["original", "display", "thumb"])
        await env.BUCKET.delete(`${id}/${variant}`);
      throw e;
    }
    return json({ id, src: `/media/${id}/display`, width, height }, 201);
  }
  const media = await serveMedia(request, env, path, true);
  if (media) return media;
  if (path.startsWith("/api/admin/preview/") && request.method === "GET") {
    const c = await readContent(env),
      p = c.projects.find((p) => p.id === path.split("/").pop());
    if (!p) return json({ error: "Project not found" }, 404);
    const preview = { ...c, projects: [p] };
    // Private previews use protected image paths, not public draft URLs.
    const html = renderProject(
      preview,
      p,
      originFor(request, env),
      "en",
      false,
      true,
    )
      .replaceAll('src="/media/', 'src="/api/admin/media/')
      .replaceAll('srcset="/media/', 'srcset="/api/admin/media/')
      .replaceAll(", /media/", ", /api/admin/media/");
    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex",
      },
    });
  }
  return json({ error: "Unknown admin endpoint" }, 404);
}
async function route(request, env) {
  const url = new URL(request.url);
  let path;
  try {
    path = decodeURIComponent(url.pathname);
  } catch {
    throw error(400, "Invalid URL");
  }
  const admin =
    path === "/admin" ||
    path === "/admin/" ||
    path === "/admin.html" ||
    path === "/admin.js" ||
    path.startsWith("/api/admin/");
  if (admin) {
    if (!(await authorize(request, env)))
      return json(
        {
          error:
            "Owner sign-in required. Configure Cloudflare Access for /admin* and /api/admin/*.",
        },
        401,
      );
    if (
      !["GET", "HEAD"].includes(request.method) &&
      request.headers.get("origin") !== url.origin
    )
      throw error(403, "Same-origin request required");
    if (path.startsWith("/api/admin/")) return adminApi(request, env, path);
    if (!["GET", "HEAD"].includes(request.method))
      throw error(405, "Method not allowed");
    return env.ASSETS.fetch(
      new Request(
        url.origin + (path === "/admin.js" ? "/admin.js" : "/admin.html"),
      ),
    );
  }
  if (!["GET", "HEAD"].includes(request.method))
    throw error(405, "Method not allowed");
  if (path === "/index.html") return Response.redirect(url.origin + "/", 301);
  if (path === "/api/public/content")
    return json(published(await readContent(env)));
  const media = await serveMedia(request, env, path, false);
  if (media) return media;
  if (
    [
      "/styles.css",
      "/publishing.css",
      "/app.js",
      "/assets/favicon.svg",
    ].includes(path) ||
    /^\/assets\/[a-zA-Z0-9_-]+\.(webp|jpeg|jpg|png)$/.test(path)
  )
    return env.ASSETS.fetch(new Request(url.origin + path));
  const origin = originFor(request, env),
    enabled = indexing(request, env);
  if (path === "/robots.txt")
    return new Response(
      `User-agent: *\n${enabled ? "Disallow: /admin\nDisallow: /api/" : "Disallow: /"}\n${enabled ? `Sitemap: ${origin}/sitemap.xml\n` : ""}`,
      {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
        },
      },
    );
  const content = published(await readContent(env));
  if (path === "/sitemap.xml") {
    const paths = enabled
      ? [
          ...LANGUAGES.map(homePath),
          ...services.map((s) => `/services/${s.slug}/`),
          ...content.projects.flatMap((p) => [
            projectPath(p),
            ...Object.keys(p.translations || {}).map((l) => projectPath(p, l)),
          ]),
        ]
      : [];
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((p) => `<url><loc>${esc(origin + p)}</loc></url>`).join("")}</urlset>`,
      {
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "no-store",
        },
      },
    );
  }
  let html,
    status = 200;
  const home = path.match(/^\/(?:(hi|mr)\/)?$/),
    project = path.match(/^\/(?:(hi|mr)\/)?projects\/([a-z0-9-]+)\/$/),
    service = path.match(/^\/services\/([a-z0-9-]+)\/$/);
  if (home) html = renderHome(content, origin, home[1] || "en", enabled);
  else if (project) {
    const p = content.projects.find((p) => p.slug === project[2]);
    const lang = project[1] || "en";
    if (p && (lang === "en" || p.translations?.[lang]))
      html = renderProject(content, p, origin, lang, enabled);
  } else if (service) {
    const s = services.find((s) => s.slug === service[1]);
    if (s) html = renderService(content, s, origin, enabled);
  }
  if (!html) {
    // Old slugs are tracked separately and never redirect to drafts or deleted projects.
    const row = await env.DB.prepare(
      "SELECT project_id FROM project_redirects WHERE slug = ?",
    )
      .bind(project?.[2] || "")
      .first();
    const target = row && content.projects.find((p) => p.id === row.project_id);
    if (target) return Response.redirect(origin + projectPath(target), 301);
    if (!path.endsWith("/") && !path.includes(".")) {
      const known =
        services.some((s) => path === `/services/${s.slug}`) ||
        content.projects.some((p) => path === `/projects/${p.slug}`) ||
        ["/hi", "/mr"].includes(path);
      if (known) return Response.redirect(origin + path + "/", 301);
    }
    status = 404;
    html = shell(content, origin, {
      path,
      title: "Page not found",
      description: "The requested page is not available.",
      enabled: false,
      body: '<h1>Page not found</h1><p>This page may have moved or is not published.</p><a href="/">Return to the website</a>',
    });
  }
  return new Response(html, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag":
        enabled && status === 200 ? "index, follow" : "noindex, nofollow",
    },
  });
}
export default {
  async fetch(request, env) {
    let response;
    try {
      response = await route(request, env);
    } catch (e) {
      response = json(
        {
          error: e.status
            ? e.message
            : "Service unavailable. Please try again later.",
        },
        e.status || 503,
      );
    }
    response = new Response(
      request.method === "HEAD" ? null : response.body,
      response,
    );
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; img-src 'self' blob: data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'",
    );
    let responsePath = new URL(request.url).pathname;
    try {
      responsePath = decodeURIComponent(responsePath);
    } catch {}
    if (
      responsePath.startsWith("/admin") ||
      responsePath.startsWith("/api/admin/")
    ) {
      response.headers.set("Cache-Control", "no-store");
      response.headers.set("X-Robots-Tag", "noindex, nofollow");
    }
    return response;
  },
};
