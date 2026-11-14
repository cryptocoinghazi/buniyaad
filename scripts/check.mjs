import { readFile, access } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { blankContent, published } from "../worker/content.mjs";
import {
  renderHome,
  renderProject,
  renderService,
  projectPath,
} from "../worker/render.mjs";
import { services } from "../worker/services.mjs";
const content = published({ ...blankContent(), revision: 0 });
const origin = "https://check.example";
const pages = [
  ...["en", "hi", "mr"].map((l) => ({
    path: l === "en" ? "/" : `/${l}/`,
    html: renderHome(content, origin, l, true),
  })),
  ...content.projects.map((p) => ({
    path: projectPath(p),
    html: renderProject(content, p, origin, "en", true),
  })),
  ...services.map((s) => ({
    path: `/services/${s.slug}/`,
    html: renderService(content, s, origin, true),
  })),
];
const paths = new Set(pages.map((p) => p.path));
let checks = 0;
const errors = [];
for (const page of pages) {
  for (const tag of [
    "<title>",
    'name="description"',
    'rel="canonical"',
    'property="og:title"',
    'name="twitter:card"',
  ]) {
    checks++;
    if (!page.html.includes(tag)) errors.push(`${page.path}: missing ${tag}`);
  }
  const headings = [...page.html.matchAll(/<h1\b/g)];
  if (headings.length !== 1) errors.push(`${page.path}: expected one H1`);
  for (const script of page.html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
  )) {
    checks++;
    try {
      JSON.parse(script[1]);
    } catch {
      errors.push(`${page.path}: invalid JSON-LD`);
    }
  }
  for (const image of page.html.matchAll(/<img\b([^>]+)>/g)) {
    if (!/\bsrc=/.test(image[1])) continue;
    checks++;
    if (
      !/\balt="[^"]*"/.test(image[1]) ||
      !/\bwidth="\d+"/.test(image[1]) ||
      !/\bheight="\d+"/.test(image[1])
    )
      errors.push(`${page.path}: image needs alt/dimensions`);
  }
  for (const match of page.html.matchAll(/(?:href|src)="(\/[^"#?]*)[^" ]*"/g)) {
    const target = match[1];
    checks++;
    if (
      target.startsWith("/assets/") ||
      ["/styles.css", "/publishing.css", "/app.js", "/admin.html"].includes(
        target,
      )
    ) {
      try {
        await access("dist" + target);
      } catch {
        errors.push(`${page.path}: missing asset ${target}`);
      }
    } else if (target !== "/" && !paths.has(target))
      errors.push(`${page.path}: broken internal link ${target}`);
  }
}
for (const file of [
  "dist/app.js",
  "dist/admin.js",
  "worker/index.mjs",
  "worker/auth.mjs",
  "worker/content.mjs",
  "worker/render.mjs",
  "scripts/dev.mjs",
])
  execFileSync(process.execPath, ["--check", file]);
if (errors.length) {
  console.error([...new Set(errors)].join("\n"));
  process.exit(1);
}
console.log(
  `${checks} static checks passed across ${pages.length} rendered pages. Syntax checks passed.`,
);
