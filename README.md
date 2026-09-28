# Regio Foods website

Next.js 16 (App Router) + TypeScript + SCSS modules + Prisma/Postgres.

The public site is at **regiofoods.in**. The admin panel is at **admin.regiofoods.in**. Staff use the admin to change page text, photos, products and categories without a developer.

The admin follows the same patterns as the other AWC sites:

- **Essentia:** NextAuth email and password login, the `requireAdmin()` API guard, a sticky save bar with unsaved-change tracking, and a sidebar shell.
- **Prince Foods:** Hetzner Object Storage uploads (`src/lib/storage.ts`, same `HETZNER_S3_*` variables), a products and categories manager, and CSV import and export.

---

## Running it locally

```bash
docker compose up -d           # local Postgres
cp .env.example .env.local     # then fill in NEXTAUTH_SECRET
yarn install
yarn prisma:migrate:deploy     # create the tables
yarn seed:catalogue            # load src/data/products.json into the database
SEED_ADMIN_EMAIL="you@example.com" SEED_ADMIN_PASSWORD="<something strong>" yarn seed:admin
yarn dev
```

| Page    | URL                                   |
| ------- | ------------------------------------- |
| Website | http://localhost:3000                 |
| Admin   | http://localhost:3000/admin           |
| Sign in | http://localhost:3000/auth/signin     |

If `HETZNER_S3_*` is not set, uploads made in development are saved to `public/uploads/`. That folder is git-ignored. In production, uploads require the bucket.

---

## How content works

Every editable section is defined once in `src/content/sections/*.ts`. Each definition gives the section's key, its label, the list of fields shown in the admin, and its **default wording**. The defaults are the text the site shipped with.

- The admin builds its forms from those field lists. You don't need a separate admin component for each section.
- A saved section is stored as one `ContentBlock` row (key → JSON). A section that has never been saved shows its defaults.
- `getContent(section)` in `src/lib/content.ts` reads the database. If the database is unreachable, it falls back to the defaults, so the site never breaks.
- Saved content is merged with the defaults field by field, never by list index. A blank value stays blank, the same rule as Essentia.
- Pages are `force-dynamic`. They read the database on every request, so edits show up immediately.

**To make a new section editable:**

1. Add a `defineSection({...})` to the right file in `src/content/sections/`. Put the current wording in `defaults`.
2. Add it to that file's exported array.
3. Give the component a `content` prop typed as `typeof mySection.defaults`, and call `getContent(mySection)` in the page.

It then appears in the admin under its page group automatically.

**Products** come from the `Product`, `ProductVariant` and `Category` tables (`src/lib/catalogue.ts`). If the database is unavailable, the catalogue falls back to `src/data/products.json`.

**Icons:** icons are bundled from `@iconify-json/mdi` into `src/lib/icons-mdi.json`, so they never call the Iconify web API. After using a new `mdi:` icon in code, run `yarn icons`.

---

## Deploying

| Branch      | Target                                  |
| ----------- | --------------------------------------- |
| `main-hetz` | Hetzner → regiofoods.in (live)          |
| `dev`       | Vercel                                  |
| `feat/*`    | Vercel preview                          |

`.cicd-config.yml` declares `project_type: node`, with an `admin` domain and Postgres, like Essentia. The server needs these variables:

`DATABASE_URL`, `DIRECT_DATABASE_URL`, `NEXTAUTH_URL=https://admin.regiofoods.in`, `NEXTAUTH_SECRET`, `NEXT_PUBLIC_SITE_URL=https://regiofoods.in`, and the six `HETZNER_S3_*` values. `SMTP_*` is optional; it is used to email contact-form enquiries.

After the first deploy, run these inside the container:

```bash
npx prisma migrate deploy
node scripts/seed-catalogue.mjs        # only imports when there are no products yet
SEED_ADMIN_EMAIL=… SEED_ADMIN_PASSWORD=… node scripts/seed-admin.mjs
```

---

## Before committing

```bash
npx tsc --noEmit
yarn lint
yarn build
```
