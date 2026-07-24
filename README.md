# Shortlist — Market Research Discovery App

AI recruiting SaaS discovery / pilot waitlist for **Shortlist**: collect recruiter pain, willingness-to-pay, and pilot interest. Survey questions are **database-driven with conditional branching**, managed in a full **Questions Builder**.

## Stack

- Next.js (App Router) + React + TypeScript
- MongoDB + Mongoose
- Zod validation
- JWT session cookies for admin
- Visual language from `shortlist-landing-page.html` (paper / ink / highlighter)

## Languages (public site)

Header language switcher with persistent choice (`localStorage` + cookie):

- **English** (`en`)
- **Arabic** (`ar`) — hardcoded UI + survey copy, RTL
- **Tagalog** (`tl`) — hardcoded UI + survey copy

Admin stays English. Survey answer **values** stay language-stable (slug keys); labels/options are localized in the UI.

## Setup

1. **Install**

```bash
npm install
```

2. **Environment**

```bash
cp .env.example .env.local
```

Set at least:

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | MongoDB connection string |
| `ADMIN_USERNAME` | Admin login (default shown on form) |
| `ADMIN_PASSWORD` | Admin password (default shown on form) |
| `JWT_SECRET` / `SESSION_SECRET` | Cookie signing |
| `NEXT_PUBLIC_SITE_URL` | Canonical / OG / sitemap base URL |

3. **Run MongoDB** locally or use Atlas, then:

```bash
npm run seed
# or force wipe + reseed:
npx tsx scripts/seed.ts --force
```

Empty question collections are also auto-seeded on first public page / API load.

4. **Dev server**

```bash
npm run dev
```

- Public discovery: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Admin login (pre-prod)

Credentials are shown **on purpose** in the login labels:

- **Username** (`adnan.akhonbay@gmail.com`)
- **Password** (`interviewx@1234`)

Note under the form: *Pre-prod only — credentials are shown on purpose.*

## Questions Builder (`/admin/questions`)

Primary way to create and maintain research questions (not hardcoded in React).

### Three panels

1. **List** — order, key, type, required/active, conditional badge; reorder ↑↓; duplicate; deactivate; delete  
2. **Editor** — Basics, Options, Branching (visual showIf), Dynamic label, Advanced JSON  
3. **Live preview / simulator** — answer paths like the public form; highlight edited question

### Branching (`showIf`)

Stored on each question:

```json
{
  "logic": "and",
  "conditions": [
    { "questionKey": "role", "operator": "equals", "value": "agency" }
  ]
}
```

Operators: `equals`, `not_equals`, `includes`, `not_includes`, `answered`, `not_answered`.

Public form and `POST /api/submissions` both evaluate visibility; hidden answers are pruned client-side and rejected server-side.

### Seed

Admin button **Load seed questions** (or `npm run seed`) inserts the 25 default branching questions (role → volume → video → WTP → pilot email, etc.).

## Submissions (`/admin/submissions`)

- Table with email, date, status, answer previews  
- Detail with label snapshots + branch path  
- Status / notes  
- CSV export  

## SEO checklist (public)

- [x] Metadata API titles/descriptions per page  
- [x] `metadataBase` + canonical via `NEXT_PUBLIC_SITE_URL`  
- [x] Open Graph + Twitter `summary_large_image` (`opengraph-image.tsx` 1200×630)  
- [x] `robots: index,follow` on marketing; `noindex` on `/admin`  
- [x] `app/sitemap.ts` (public only) + `app/robots.ts` (disallow `/admin`)  
- [x] SSR marketing copy (RSC); survey is a client island with server-fetched questions  
- [x] JSON-LD: SoftwareApplication, Organization, FAQPage  
- [x] Semantic landmarks, one H1, H2/H3 hierarchy  
- [x] `next/font` Archivo + IBM Plex Mono; `prefers-reduced-motion` for highlighter  
- [x] Footer with brand + `hello@getshortlist.app`

## API overview

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/questions` | public | Active questions |
| POST | `/api/submissions` | public | Validate + save |
| POST | `/api/admin/login` | — | Session cookie |
| POST | `/api/admin/logout` | — | Clear session |
| GET/POST | `/api/admin/questions` | admin | List / create |
| PATCH/DELETE | `/api/admin/questions/[id]` | admin | Update / delete |
| PATCH | `/api/admin/questions/reorder` | admin | Persist order |
| POST | `/api/admin/questions/duplicate` | admin | Clone |
| POST | `/api/admin/questions/seed` | admin | Seed defaults |
| GET | `/api/admin/submissions` | admin | List + stats |
| GET/PATCH | `/api/admin/submissions/[id]` | admin | Detail / update |
| GET | `/api/admin/submissions/export` | admin | CSV |

## Project layout

```
src/
  app/                 # App Router pages + API route handlers
  components/
    landing/           # JSON-LD
    survey/            # FormRenderer / QuestionField
    admin/             # Login, Questions Builder, Submissions
  lib/                 # db, auth, conditions, validation, seed
  models/              # Question, Submission
  types/
scripts/seed.ts
```

## Notes

- This app is **discovery + research only** — not the screening/video product itself.  
- Never hardcode survey fields beyond the type→widget mapper, condition evaluator, and builder controls.  
- Change `JWT_SECRET` and admin password before any real deployment.
