import { esc, jsonScript, imageLabels, LANGUAGES } from "./content.mjs";
import { services } from "./services.mjs";
import { templates } from "./templates.generated.mjs";
export const homePath = (lang) => (lang === "en" ? "/" : `/${lang}/`);
export const projectPath = (p, lang = "en") =>
  `${lang === "en" ? "" : `/${lang}`}/projects/${p.slug}/`;
export const translatedProject = (p, lang) =>
  lang === "en" ? p : { ...p, ...p.translations[lang] };
function structured(settings, origin) {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: settings.businessName,
    url: origin + "/",
    areaServed: settings.serviceAreas,
    ...(settings.phone ? { telephone: settings.phone } : {}),
    ...(settings.email ? { email: settings.email } : {}),
    ...(settings.address ? { address: settings.address } : {}),
  };
}
function head(
  settings,
  origin,
  path,
  title,
  description,
  enabled,
  alternates = [],
  image = "/assets/completed-enhanced.webp",
  breadcrumbs = null,
) {
  const url = origin + path;
  const schemas = [structured(settings, origin)];
  if (breadcrumbs)
    schemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((x, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: x.name,
        item: origin + x.path,
      })),
    });
  return `<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="${enabled ? "index,follow" : "noindex,nofollow"}"><link rel="canonical" href="${esc(url)}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="website"><meta property="og:url" content="${esc(url)}"><meta property="og:image" content="${esc(origin + image)}"><meta name="twitter:card" content="summary_large_image">${settings.searchConsoleVerification ? `<meta name="google-site-verification" content="${esc(settings.searchConsoleVerification)}">` : ""}${alternates.map((a) => `<link rel="alternate" hreflang="${a.lang}" href="${esc(origin + a.path)}">`).join("")}<link rel="icon" href="/assets/favicon.svg"><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/publishing.css">${schemas.map((s) => `<script type="application/ld+json">${jsonScript(s)}</script>`).join("")}`;
}
export function picture(image, priority = false) {
  const media = image.src.match(/^\/media\/([^/]+)\/display$/);
  const responsive =
    media && image.width > 640
      ? `srcset="/media/${media[1]}/thumb ${image.thumbWidth || Math.round(image.width * Math.min(1, 640 / Math.max(image.width, image.height)))}w, ${esc(image.src)} ${image.width}w" sizes="(max-width: 700px) 100vw, 50vw"`
      : "";
  return `<img src="${esc(image.src)}" ${responsive} width="${image.width}" height="${image.height}" alt="${esc(image.alt)}" loading="${priority ? "eager" : "lazy"}" decoding="async">`;
}
export function projectCards(projects, lang = "en") {
  return (
    projects
      .map((p, i) => {
        const t = p.translations?.[lang] || p;
        return `<article class="project-card" data-filter-tags="all ${p.status} ${esc(p.stage)}"><a class="project-card__media" href="${projectPath(p, p.translations?.[lang] ? lang : "en")}">${picture(p.images[0], i === 0)}<span class="project-status">${p.status === "completed" ? "Completed" : "Ongoing"} · ${imageLabels[p.images[0].kind]}</span></a><div class="project-card__body"><h3><a href="${projectPath(p, p.translations?.[lang] ? lang : "en")}">${esc(t.title)}</a></h3><p>${esc(p.location)}${p.area ? ` · ${esc(p.area)}` : ""}</p><p>${esc(t.description)}</p></div></article>`;
      })
      .join("") || "<p>No projects are currently published.</p>"
  );
}
function serviceLinks() {
  return `<section class="shell section" aria-label="Service pages"><h2>Explore our services in Yavatmal</h2><div class="service-links">${services.map((s) => `<a href="/services/${s.slug}/">${esc(s.title)} ↗</a>`).join("")}</div></section>`;
}
export function renderHome(content, origin, lang, enabled) {
  const title = {
    en: `House Construction & Building Materials in Yavatmal | ${content.settings.businessName}`,
    hi: `यवतमाल में घर निर्माण और निर्माण सामग्री | ${content.settings.businessName}`,
    mr: `यवतमाळमध्ये घर बांधकाम आणि बांधकाम साहित्य | ${content.settings.businessName}`,
  }[lang];
  const description = {
    en: "House construction with materials or labour-only scope, plus sand, bricks and cement enquiries in Yavatmal. Explore actual projects and request a quotation.",
    hi: "यवतमाल में सामग्री के साथ या केवल श्रम पर घर निर्माण। रेत, ईंट और सीमेंट के लिए पूछताछ करें और हमारे प्रोजेक्ट देखें।",
    mr: "यवतमाळमध्ये साहित्यासह किंवा केवळ मजुरीवर घर बांधकाम. वाळू, विटा आणि सिमेंटसाठी चौकशी करा आणि आमचे प्रकल्प पाहा.",
  }[lang];
  let html = templates[lang].replace(
    /<head>[\s\S]*?<\/head>/,
    `<head>${head(
      content.settings,
      origin,
      homePath(lang),
      title,
      description,
      enabled,
      LANGUAGES.map((l) => ({ lang: l, path: homePath(l) })),
    )}</head>`,
  );
  html = html.replace(
    '<div class="project-grid" id="projectGrid" aria-live="polite"></div>',
    `<div class="project-grid" id="projectGrid" aria-live="polite">${projectCards(content.projects, lang)}</div>`,
  );
  html = html.replace(
    /<strong class="brand-mobile"[^>]*>[\s\S]*?<\/strong>/,
    `<strong class="brand-mobile" aria-hidden="true">${esc(content.settings.businessName)}</strong>`,
  );
  html = html.replace(
    /<strong data-business-name>[^<]*<\/strong>/g,
    `<strong data-business-name>${esc(content.settings.businessName)}</strong>`,
  );
  html = html.replace(
    /<span class="preview-note"[^>]*>[\s\S]*?<\/span>/,
    `<span class="preview-note">${esc(content.settings.serviceAreas)}</span>`,
  );
  html = html.replace(
    /<button type="button" class="is-active" data-lang="en"[^>]*>EN<\/button>|<button type="button" data-lang="(hi|mr)"[^>]*>[\s\S]*?<\/button>/g,
    (m) => {
      const l = m.match(/data-lang="([^"]+)"/)[1];
      return `<a href="${homePath(l)}" hreflang="${l}" ${l === lang ? 'aria-current="page"' : ""}>${{ en: "EN", hi: "हिंदी", mr: "मराठी" }[l]}</a>`;
    },
  );
  html = html.replace(
    /<script src="\/app.js" defer><\/script>/,
    `<script id="site-content" type="application/json">${jsonScript({ ...content, language: lang })}</script><script src="/app.js" defer></script>`,
  );
  html = html.replace(
    /<\/main>/,
    `${serviceLinks()}<section class="shell section"><h2>${lang === "hi" ? "संपर्क और सेवा क्षेत्र" : lang === "mr" ? "संपर्क आणि सेवा क्षेत्र" : "Contact and service areas"}</h2>${businessDetails(content.settings)}</section></main>`,
  );
  return html;
}
function businessDetails(s) {
  return `<p>${esc(s.businessName)} · ${esc(s.city)}</p><p>${esc(s.serviceAreas)}</p>${s.address ? `<p>${esc(s.address)}</p>` : ""}${s.workingHours ? `<p>${esc(s.workingHours)}</p>` : ""}${s.phone ? `<p><a href="tel:${esc(s.phone.replace(/[^+\d]/g, ""))}">${esc(s.phone)}</a></p>` : "<p>Contact number will be added before launch.</p>"}${s.mapUrl ? `<a href="${esc(s.mapUrl)}" rel="noopener noreferrer">View location</a>` : ""}${s.profileUrl ? ` <a href="${esc(s.profileUrl)}" rel="noopener noreferrer">Business profile</a>` : ""}`;
}
export function shell(
  content,
  origin,
  {
    path,
    title,
    description,
    body,
    enabled,
    lang = "en",
    alternates = [],
    image,
    breadcrumbs,
  },
) {
  const s = content.settings;
  return `<!doctype html><html lang="${lang}"><head>${head(s, origin, path, title, description, enabled, alternates, image, breadcrumbs)}</head><body><a class="skip-link" href="#main">Skip to content</a><header class="site-header detail-header"><div class="shell header-inner"><a class="brand" href="/">${esc(s.businessName)}</a><nav class="site-nav" aria-label="Navigation"><a href="/#projects">Projects</a><a href="/#construction">Construction</a><a href="/#materials">Materials</a><a href="/#quote">Request a quote</a></nav></div></header><main id="main" class="shell section detail-page">${body}</main><footer class="site-footer"><div class="shell">${businessDetails(s)}<a href="/">Back to home</a></div></footer></body></html>`;
}
export function renderProject(
  content,
  p,
  origin,
  lang,
  enabled,
  preview = false,
) {
  const t = translatedProject(p, lang),
    path = projectPath(p, lang);
  const alternatives = ["en", ...Object.keys(p.translations || {})].map(
    (l) => ({ lang: l, path: projectPath(p, l) }),
  );
  return shell(content, origin, {
    path,
    title:
      p.seoTitle && lang === "en"
        ? p.seoTitle
        : `${t.title} | ${content.settings.businessName}`,
    description:
      p.seoDescription && lang === "en"
        ? p.seoDescription
        : t.description.slice(0, 250),
    enabled: enabled && !preview,
    lang,
    alternates: alternatives,
    image: p.images[0]?.src,
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: t.title, path },
    ],
    body: `${preview ? '<p role="status">Private draft preview — not published</p>' : ""}<p>${esc(p.location)} · ${p.status === "completed" ? "Completed" : "Under construction"}</p><h1>${esc(t.title)}</h1><p>${esc(t.description)}</p>${p.area ? `<p>Area: ${esc(p.area)}</p>` : ""}${p.mode ? `<p>Scope: ${esc(p.mode)}</p>` : ""}<div class="project-detail-grid">${p.images.map((im, i) => `<figure>${picture(im, i === 0)}<figcaption>${imageLabels[im.kind]}${im.stage ? ` · ${esc(im.stage)}` : ""}${im.caption ? ` — ${esc(im.caption)}` : ""}</figcaption></figure>`).join("")}</div><a class="button button--primary" href="/#quote">Request similar work</a>`,
  });
}
export function renderService(content, s, origin, enabled) {
  const availability = s.material
    ? `<p>${content.materials[s.material].available ? "Open for enquiries" : "Availability requires confirmation"}: ${esc(content.materials[s.material].note)}</p>`
    : "";
  return shell(content, origin, {
    path: `/services/${s.slug}/`,
    title: `${s.title} | ${content.settings.businessName}`,
    description: s.description,
    enabled,
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: s.title, path: `/services/${s.slug}/` },
    ],
    body: `<p>Yavatmal, Maharashtra</p><h1>${esc(s.title)}</h1><h2>${esc(s.heading)}</h2><p>${esc(s.body)}</p>${availability}<ul>${s.details.map((d) => `<li>${esc(d)}</li>`).join("")}</ul><a class="button button--primary" href="/#quote">Request a quotation</a><h2>Our projects</h2><div class="project-grid">${projectCards(content.projects)}</div>${serviceLinks()}`,
  });
}
