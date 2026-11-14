# Buniyaad Builders & Suppliers

House construction and building-material enquiries in Yavatmal. The working business name and contact details remain owner-configurable.

## Current implementation

Vanilla HTML/CSS/JavaScript frontend, preserved from the initial design, with a new Cloudflare Worker backend:

- D1 stores shared business settings, materials, approved testimonials and project records.
- R2 stores original uploads and WebP display/thumbnail variants. Original uploads require owner authentication; public variants are served only while a published project references them.
- Cloudflare Access signs the owner identity. The Worker verifies the JWT signature, issuer, audience, expiry and the configured owner's email. Every admin route is checked independently. No browser password or client-side role is trusted.
- Project editor supports draft/publish/archive/delete, project order, cover order, later construction-stage images and reviewed title/description translations.
- Public homepages are rendered in English, Hindi and Marathi. Six English service pages and individual project pages contain delivered HTML, metadata and structured data. Additional project language URLs exist only after title and description translations are supplied.
- Metadata, sitemap, project visibility and redirects update directly from the database without manual rebuilds after publishing. No paid AI service or SEO subscription is required.

**This branch is prepared for external public Cloudflare hosting. It has not been deployed or connected to an owner account.** The existing private OpenAI Sites preview is unchanged. Its workspace allows only restricted access, so it cannot currently be the public customer-facing host.

Read [docs/launch.md](docs/launch.md) for required owner setup, commands, free-tier limitations and launch checks. Read [docs/implementation-report.md](docs/implementation-report.md) for verification and remaining limitations.

## Development

Node.js 22+ is needed for Wrangler; the test suite uses Node.js 24's built-in SQLite module.

```sh
npm ci
npm run build
npm run db:local
npm run dev
```

The local Worker uses local D1/R2. Cloudflare Access is not simulated: admin requests fail closed unless configured and supplied a valid owner JWT. There is no insecure development password or production auth bypass.

```sh
npm test
npm run check
npx wrangler deploy --dry-run --outdir build/cloudflare
```

`npm run check` builds and renders public pages and checks metadata, image descriptions/dimensions, internal paths, asset existence and JavaScript syntax. `npm test` builds first and exercises authorization, persistent SQLite-backed publishing, redirects, uploads, staging controls and private content boundaries.

## Configuration

`wrangler.jsonc` contains non-secret deployment settings and placeholder resource names. `.dev.vars.example` documents local overrides; `.dev.vars` is ignored. Do not put privileged credentials in frontend files, source control, documentation or messages.

Keep `INDEXING_ENABLED=false` until the intended public host is ready. Set `PUBLIC_ORIGIN` to its exact HTTPS origin. Preview hostnames remain noindexed even when the production flag is enabled.

The existing `.openai/hosting.json` and historical PowerShell publishing helper retain the original private Site identity for reference. **Do not deploy this backend branch with the old static Sites helper:** it would publish only static files, without the database, storage or authentication boundary. Use the documented Cloudflare Worker workflow.

## Photos and project provenance

The portfolio contains two real owner-described projects, rather than six separate projects:

1. Completed contemporary residence: owner-supplied original night photograph and a separately labelled AI-enhanced showcase image.
2. Ongoing neoclassical residence: three owner-supplied planned exterior visualisations, explicitly labelled as design intent.

The old generated foundation/brickwork/completed demo assets remain in Git history and the assets directory, but are absent from the real-project portfolio. The site does not claim those images depict the owner's work.

Original upload downloads and a JSON/media-manifest export are available in the dashboard. Content exports reference media; also back up the R2 objects. Uploads do not appear publicly until their project is published. Video uploads are explicitly unsupported.

## Browser-local data migration

Nothing clears the old browser's localStorage. On the old origin/device, export its dashboard JSON before moving. The new dashboard can export old data only if it is opened on that same origin/device, and can import a JSON exported elsewhere. Imported project data is merged by ID and saved as drafts after review; embedded JPEG/PNG/WebP data URLs are uploaded to shared storage. Existing public settings, material notes and testimonials are not silently overwritten by imports. Re-enter reviewed business settings in their dedicated forms. Keep source exports until the shared import has been verified.
