export const LANGUAGES = ["en", "hi", "mr"];
export const esc = (v) =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export const jsonScript = (v) => JSON.stringify(v).replace(/</g, "\\u003c");
export const local = (v, lang = "en") =>
  typeof v === "object" && v ? v[lang] || v.en || "" : String(v || "");
export const originFor = (request, env) => {
  if (!env.PUBLIC_ORIGIN) return new URL(request.url).origin;
  const u = new URL(env.PUBLIC_ORIGIN);
  if (
    u.pathname !== "/" ||
    u.search ||
    u.hash ||
    u.username ||
    u.password ||
    !["http:", "https:"].includes(u.protocol)
  )
    throw new Error("Invalid PUBLIC_ORIGIN");
  return u.origin;
};
export const indexing = (request, env) =>
  env.INDEXING_ENABLED === "true" &&
  Boolean(env.PUBLIC_ORIGIN) &&
  new URL(request.url).origin === originFor(request, env) &&
  originFor(request, env).startsWith("https://");
export const imageLabels = {
  original: "Original photo",
  enhanced: "AI-enhanced photo",
  design: "Design visualisation",
};
export function blankContent() {
  return {
    settings: {
      businessName: "Buniyaad Builders & Suppliers",
      phone: "",
      whatsapp: "",
      city: "Yavatmal",
      address: "",
      email: "",
      workingHours: "",
      serviceAreas: "Yavatmal; nearby availability confirmed by location",
      mapUrl: "",
      profileUrl: "",
      searchConsoleVerification: "",
    },
    materials: Object.fromEntries(
      ["sand", "bricks", "cement"].map((k) => [
        k,
        {
          available: true,
          note: "Availability, specification and delivery confirmed on enquiry.",
        },
      ]),
    ),
    testimonials: [],
    projects: [
      {
        id: "completed-modern",
        slug: "contemporary-residence-yavatmal",
        title: "Contemporary Residence",
        location: "Yavatmal",
        area: "",
        mode: "",
        description:
          "Completed house featuring a contemporary facade, a covered entrance and a black-and-gold gate. View the original photograph alongside the enhanced showcase image.",
        status: "completed",
        publication: "published",
        stage: "completed",
        order: 0,
        translations: {},
        images: [
          {
            src: "/assets/completed-original.jpeg",
            kind: "original",
            stage: "completed",
            alt: "Original night photograph of the completed contemporary residence in Yavatmal",
            caption: "Original site photograph",
            width: 1440,
            height: 1151,
          },
          {
            src: "/assets/completed-enhanced.webp",
            kind: "enhanced",
            stage: "completed",
            alt: "AI-enhanced twilight view of the completed contemporary residence",
            caption: "AI-enhanced showcase image; see original site photograph",
            width: 1536,
            height: 1024,
          },
        ],
      },
      {
        id: "ongoing-classic",
        slug: "neoclassical-residence-yavatmal",
        title: "Neoclassical Residence",
        location: "Yavatmal",
        area: "",
        mode: "",
        description:
          "A house currently under construction in Yavatmal. These elevation views illustrate the planned exterior, including arched windows and a cream facade. Actual construction progress photographs will be added separately.",
        status: "ongoing",
        publication: "published",
        stage: "design",
        order: 1,
        translations: {},
        images: ["front", "angle", "elevation"].map((view) => ({
          src: `/assets/ongoing-neoclassical-${view}.webp`,
          kind: "design",
          stage: "design",
          alt: `${view} design visualisation of the ongoing neoclassical residence; not completed work`,
          caption: "Planned exterior — Design visualisation",
          width: view === "front" ? 1536 : 1599,
          height: { front: 1024, angle: 1600, elevation: 1068 }[view],
        })),
      },
    ],
  };
}
export async function readContent(env) {
  if (!env.DB) throw new Error("D1 binding missing");
  const row = await env.DB.prepare(
    "SELECT body, revision, updated_at FROM site_content WHERE id = 1",
  ).first();
  return row
    ? {
        ...JSON.parse(row.body),
        revision: row.revision,
        updatedAt: row.updated_at,
      }
    : { ...blankContent(), revision: 0, updatedAt: null };
}
export function published(content) {
  return {
    settings: content.settings,
    materials: content.materials,
    testimonials: content.testimonials.filter((t) => t.permission === true),
    projects: content.projects
      .filter((p) => p.publication === "published")
      .sort((a, b) => a.order - b.order),
    revision: content.revision,
  };
}
export function validImagePath(src) {
  return (
    /^\/assets\/[a-zA-Z0-9_-]+\.(webp|jpeg|jpg|png)$/.test(src) ||
    /^\/media\/[a-f0-9-]{36}\/display$/.test(src)
  );
}
function text(v, max = 600) {
  if (typeof v !== "string" || v.length > max)
    throw new Error(`Text required (maximum ${max} characters)`);
  return v.trim();
}
export function validateContent(input) {
  if (
    !input ||
    !input.settings ||
    !Array.isArray(input.projects) ||
    input.projects.length > 150
  )
    throw new Error("Invalid content document (maximum 150 projects)");
  const settings = {};
  for (const key of Object.keys(blankContent().settings))
    settings[key] = text(
      input.settings[key] ?? "",
      key === "serviceAreas" ? 1000 : 300,
    );
  if (!settings.businessName) throw new Error("Business name required");
  for (const key of ["mapUrl", "profileUrl"])
    if (settings[key] && !/^https:\/\/[^\s]+$/.test(settings[key]))
      throw new Error("Business links must use HTTPS");
  for (const key of ["phone", "whatsapp"])
    if (
      settings[key] &&
      (!/^\+?[\d ()-]{7,20}$/.test(settings[key]) ||
        !/^\d{7,15}$/.test(settings[key].replace(/\D/g, "")))
    )
      throw new Error("Enter a valid contact number");
  const ids = new Set(),
    slugs = new Set();
  const projects = input.projects.map((p, i) => {
    if (!/^[a-zA-Z0-9-]{1,80}$/.test(p.id) || ids.has(p.id))
      throw new Error("Invalid or duplicate project ID");
    if (
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug) ||
      p.slug.length > 100 ||
      slugs.has(p.slug)
    )
      throw new Error("Invalid or duplicate project URL");
    ids.add(p.id);
    slugs.add(p.slug);
    if (
      !["draft", "published", "archived"].includes(p.publication) ||
      !["completed", "ongoing"].includes(p.status)
    )
      throw new Error("Invalid project status");
    if (!Array.isArray(p.images) || p.images.length > 30)
      throw new Error("Maximum 30 photos per project");
    const images = p.images.map((image) => {
      if (!validImagePath(image.src) || !imageLabels[image.kind])
        throw new Error(
          "Use uploaded or approved site images with an image label",
        );
      return {
        src: image.src,
        kind: image.kind,
        alt: text(image.alt || "", 250),
        caption: text(image.caption || "", 300),
        stage: text(image.stage || "", 40),
        width: Math.max(1, Math.min(10000, Number(image.width) || 1600)),
        height: Math.max(1, Math.min(10000, Number(image.height) || 1200)),
      };
    });
    const translations = {};
    for (const lang of ["hi", "mr"])
      if (p.translations?.[lang]?.title && p.translations?.[lang]?.description)
        translations[lang] = {
          title: text(p.translations[lang].title, 120),
          description: text(p.translations[lang].description, 2500),
        };
    const result = {
      id: p.id,
      slug: p.slug,
      title: text(p.title, 120),
      location: text(p.location || "", 120),
      area: text(p.area || "", 80),
      description: text(p.description || "", 2500),
      mode: text(p.mode || "", 50),
      stage: text(p.stage || "", 40),
      status: p.status,
      publication: p.publication,
      images,
      translations,
      order: Number.isFinite(p.order) ? p.order : i,
      seoTitle: text(p.seoTitle || "", 160),
      seoDescription: text(p.seoDescription || "", 300),
      updatedAt: new Date().toISOString(),
    };
    if (!result.title) throw new Error("Project title required");
    if (
      p.publication === "published" &&
      (!result.description ||
        !images.length ||
        images.some((image) => !image.alt))
    )
      throw new Error(
        "Published projects require a description, cover photo and photo descriptions",
      );
    return result;
  });
  const materials = {};
  for (const key of ["sand", "bricks", "cement"])
    materials[key] = {
      available: input.materials?.[key]?.available === true,
      note: text(input.materials?.[key]?.note || "", 300),
    };
  if (!Array.isArray(input.testimonials) || input.testimonials.length > 50)
    throw new Error("Invalid testimonials");
  const testimonials = input.testimonials.map((t) => {
    if (t.permission !== true) throw new Error("Customer permission required");
    return {
      id: text(t.id, 80),
      name: text(t.name, 100),
      location: text(t.location || "", 120),
      quote: text(t.quote, 700),
      permission: true,
    };
  });
  return { settings, materials, projects, testimonials };
}
