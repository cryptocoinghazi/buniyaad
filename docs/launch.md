# Public launch setup

## Hosting decision

The existing `altimetrik.chatgpt.site` preview is owner-restricted. Its available audience modes are `custom` and `workspace_all`; neither is anonymous public access. No access policy, DNS, production deployment or paid service was changed.

Recommended public stack: Cloudflare Workers (frontend and server), D1 (records), R2 (photos), and Cloudflare Access (owner-only admin). A `workers.dev` hostname can be used initially; a custom domain is optional. This is an independently deployable Worker, not a Pages-only/static deployment.

Cloudflare offers free allowances, but this is **not a promise of unlimited free hosting**. Workers Free currently has 100,000 requests/day and a 10 ms CPU allowance per invocation; public HTML and media traverse this Worker. D1 and R2 have separate storage/operation quotas. R2 enablement may require billing setup; confirm the account's actual requirements and usage pricing before enabling it. Storage can grow because removed uploads are retained privately until explicitly cleaned up. Configure usage notifications and review costs; a domain purchase is separate. No paid plan was enabled.

References:
- https://developers.cloudflare.com/workers/platform/limits/
- https://developers.cloudflare.com/d1/platform/pricing/
- https://developers.cloudflare.com/r2/pricing/
- https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/
- https://developers.cloudflare.com/workers/configuration/cloudflare-access/

## Owner steps before deployment

1. Create/sign in to your own Cloudflare account. Confirm Workers, D1, R2 and Access eligibility and any billing requirement. Do not enter credentials into the website dashboard.
2. Clone the implementation branch from GitHub. Install Node.js 24 and run `npm ci` and `npm run build`.
3. Run `npx wrangler login` locally and complete the Cloudflare browser authorization yourself.
4. Create resources using `npx wrangler d1 create buniyaad-content` and `npx wrangler r2 bucket create buniyaad-media`. Replace the D1 database ID in `wrangler.jsonc` with the actual returned ID and use your actual bucket name. Never deploy with the placeholder ID.
5. Choose your intended public hostname and set `PUBLIC_ORIGIN` to its HTTPS origin (no path). Keep `INDEXING_ENABLED=false`.
6. Create a **hostname/path-based self-hosted Access application**, restricted to your specific owner email. Protect `/admin*` and `/api/admin/*` on the chosen hostname. Ensure both paths use the same application/audience. Enable an available sign-in method, such as email one-time PIN. Do not protect the entire Worker if customers should browse anonymously. Protect those paths on every enabled hostname; application-level JWT verification also rejects direct/alternate-host unauthenticated requests.
7. Copy the Access team hostname (`your-team.cloudflareaccess.com`) and application audience into `ACCESS_TEAM_DOMAIN` and `ACCESS_AUD`; set `ADMIN_EMAIL` to the exact permitted owner email. These are configuration identifiers, not passwords.
8. From the repository root run:

```sh
npm test
npm run check
npm run db:remote
npx wrangler deploy --dry-run --outdir build/cloudflare
npx wrangler deploy
```

The final two remote actions provision schema/deploy code on your account. They have **not** been performed by this implementation task. Wrangler's first deployment can provide the assigned workers.dev hostname; if necessary deploy with indexing disabled, then configure that actual hostname and Access paths, and redeploy. Admin remains inaccessible until all auth configuration is valid.

9. Sign in at `/admin`, confirm both seeded projects, configure actual business name, phone, WhatsApp, address only if public, working hours and genuine service areas. Save once to persist the initial content document. Replace or supplement design renders with actual progress photographs.
10. Test in a separate signed-out browser: published pages visible; admin, originals, backups and drafts inaccessible. Upload a test photo as a draft and confirm it is not publicly accessible; publish, check from another device, then archive and check it is removed. Back up before deleting content.

## Enabling search discovery

After the public site and contacts work, set `INDEXING_ENABLED=true` on that production origin and redeploy. Verify `/robots.txt`, `/sitemap.xml`, canonical URLs and response headers. Staging stays noindexed when its origin differs from `PUBLIC_ORIGIN`.

Add the public property to your own Google Search Console. Use DNS verification for a domain property or the offered meta-tag method for an appropriate URL-prefix property. The dashboard's Search Console field expects the verification code, not an entire HTML tag. Submit `/sitemap.xml` after verification. Create/verify your Google Business Profile separately and add its real link in business settings. These owner actions have not been performed. No index submission endpoint or ranking guarantee is fabricated.

## Backups and rollback

The dashboard exports JSON content and a media manifest. Download originals individually or back up the entire private R2 bucket through Cloudflare-supported tools. A JSON export alone cannot recreate a deleted bucket. Imports into the same bucket merge projects as drafts; missing media references cause a clear validation failure. For a different bucket, restore objects first or re-upload originals.

Edits use revision checks to reject stale overwrites. After a conflict, export unsaved edits, reload the dashboard and reapply them. Old project URLs redirect only to their current published project. Archived/deleted projects and their historical routes return 404.

GitHub retains the original static snapshot on `main`; this implementation is on a separate branch/PR. Do not overwrite the working private Site or migrate DNS until the new public installation has passed the owner launch checks.
