# Old Colony v2 — Work Log

Admin portal + client accounts project. This log is for cross-session continuity.

## Vision
- **Admin** (single user): edit blogs, view booking requests, confirm/discard them, set the final ride price manually, view rides, issue invoices.
- **Client** (Google sign-in): account settings, ride history, downloadable PDF invoice per ride.

## Locked decisions
- **DB:** Neon Postgres (free tier).
- **ORM:** Prisma **7** (no-Rust-engine; uses driver adapters + `prisma.config.ts`).
- **Auth:** Auth.js (NextAuth v5), Google provider. Admin via `ADMIN_EMAILS` allowlist → `ADMIN` role.
- **Guest booking:** kept. Logged-in bookings auto-link to user; guest bookings matched by email.
- **Invoices:** downloadable PDF (`@react-pdf/renderer`).
- **Add-on:** human-friendly booking references (`OC-2026-0042`).
- **Price:** entered manually by admin per booking (no editable rate settings for now).
- **Admin portal:** English-only, outside the `[locale]` i18n system.
- **Declined for now:** client confirmation email, admin edit-booking-details, blog draft toggle, editable pricing settings. All easy to add later.

## Phases
1. **DB + Prisma + service layer** ← in progress
2. Auth.js (Google, admin allowlist, route protection)
3. Persist bookings + admin dashboard (confirm/discard/price)
4. Client portal (account + ride history)
5. Blog CRUD (migrate existing posts)
6. PDF invoices

## Progress

### Phase 1 — DB foundation ✅ COMPLETE
Done:
- Neon connected; `DATABASE_URL` (pooled) + `DIRECT_URL` (direct) in `.env.local`.
- `prisma.config.ts` migrations run over `DIRECT_URL`; runtime/seed use `DATABASE_URL`.
- First migration `20260619223655_init` applied. Seed loaded 29 posts. Verified: blogPosts=29, users=0, bookings=0.
- Note: harmless `pg` SSL warning (sslmode=require → verify-full alias). Revisit if it ever errors.

Earlier:
- Installed `prisma`, `@prisma/client`, `@prisma/adapter-pg`, `pg`, `tsx`.
- `prisma/schema.prisma` — models: User, Account, Session, VerificationToken (Auth.js), Booking, BlogPost. Enums: Role, ServiceType, VehicleType, BookingStatus. (ServiceType/VehicleType values are lowercase to match `types/index.ts`.)
- `prisma.config.ts` — Prisma 7 config; loads `.env.local`; datasource url + seed command.
- `lib/prisma.ts` — singleton PrismaClient using `PrismaPg` adapter.
- `lib/repositories/bookings.ts`, `lib/repositories/blog.ts` — repository layer (UI/pages never touch Prisma directly).
- `prisma/seed.ts` — upserts the 29 posts from `lib/data.ts` into BlogPost.
- `package.json` scripts: `db:migrate`, `db:seed`, `db:studio`, `postinstall: prisma generate`.
- Schema validates, client generates, `tsc --noEmit` clean.

Security fix done:
- `.env.local` was tracked by git (reCAPTCHA secret in history). Added `.env*` to `.gitignore`, untracked the file (`git rm --cached`). **TODO (user): rotate reCAPTCHA secret if repo becomes public.**

**BLOCKED ON USER:** need Neon `DATABASE_URL` in `.env.local`, then run `npm run db:migrate` (first migration) + `npm run db:seed`.

Notes for next session:
- Prisma 7 specifics: NO `url` in schema datasource block; it lives in `prisma.config.ts`. Runtime requires the `adapter` (PrismaPg). Don't "fix" these back to v6 style.

### Phase 2 — Auth.js ✅ COMPLETE
Key version fact: this Next renames `middleware.ts` → **`proxy.ts`** (runs on Node runtime). next-intl's proxy already existed; matcher now excludes `admin|account|login|api`.
Done:
- Installed `next-auth@beta` (v5) + `@auth/prisma-adapter`.
- `auth.ts` (root) — Google provider, PrismaAdapter, **database** session strategy, `trustHost`, `pages.signIn=/login`. Admin determined by `ADMIN_EMAILS` allowlist (source of truth in `session` callback; also persisted to DB via `signIn` event).
- `app/api/auth/[...nextauth]/route.ts` — exports handlers.
- `types/next-auth.d.ts` — augments Session.user with `id` + `role`.
- `lib/auth-dal.ts` — `getCurrentUser` (React cache), `requireUser`, `requireAdmin`.
- Portal route group `app/(portal)/` with its own English `<html>` (root layout delegates html to children, mirroring `[locale]`): `login`, `admin` (requireAdmin), `account` (requireUser), shared `_components/SignOutButton`.
- `.env.local`: AUTH_SECRET set; ADMIN_EMAILS=mhmdkassab666@gmail.com; GOOGLE_CLIENT_ID/SECRET empty (awaiting user).
- Verified via dev server: /login=200, /admin & /account=307→/login, /en=200, NextAuth csrf/providers/session endpoints OK. Callback URL: http://localhost:3000/api/auth/callback/google.

**BLOCKED ON USER:** paste Google OAuth Client ID + Secret → fill `.env.local` → test real Google login end-to-end.

Decision recorded: session strategy = database (OK since Google-only, no Credentials provider). Login redirects to /account; admins navigate to /admin (login page auto-routes admins to /admin if already signed in).

VERIFIED end-to-end: real Google login created user mhmdkassab666@gmail.com with role ADMIN, 1 session, 1 google account.
Strict role separation enforced (auth-dal): `requireAdmin` → clients bounce to /account; `requireClient` (account layout) → admins bounce to /admin. An email is exactly one role (allowlist-driven). `requireUser` kept for any-authenticated use.

### Phase 2.5 — UI/theme integration ✅
Theme reference: brand magenta #C2185B / pink #E91E8C / light #FFF0F6 / border #F5C6DC; serif headings (Cormorant) via globals @layer base; `type-*` utility classes; `Button` (primary/outline/ghost, sm/md/lg). Color tokens exist as `brand-*` in globals @theme.
- `components/layout/AccountMenu.tsx` (client, useSession) — top-right account widget; desktop dropdown + mobile stacked variant. Logged out → "Sign In"; admin → avatar + "Admin Dashboard" + Sign out; client → "My Rides" + "Account settings" + Sign out. Uses next-auth/react signOut.
- Navbar (already `fixed top-0`, always visible) now renders AccountMenu (desktop + mobile). `[locale]/layout` wraps children in `<SessionProvider>` so the client Navbar has session (public pages stay SSG; session fetched client-side via /api/auth/session).
- Portal themed: `_components/PortalHeader` (sticky, brand logo, role-based nav) used by admin & account layouts; `SignOutButton` now uses `Button` outline; login/admin/account pages re-themed; new `account/rides` (My Rides) page with empty state (history wired in Phase 4).
- Verified: tsc clean; /en, /login = 200; /account, /account/rides, /admin redirect to /login when logged out; /api/auth/session 200.
- Header polish: Sign In is now a filled primary button (hierarchy vs outline contact chips); email + phone are matching `contactChip` boxes; logo/phone/email/Sign In all whitespace-nowrap; divider between contact and lang/account groups.

### Phase 3 — Booking persistence + admin dashboard ✅
- `/api/booking` now persists via `createBooking` (keeps recaptcha+honeypot+Telegram). Links `userId`/`email` from session when signed in. scheduledAt = wall-clock encoded as UTC (`toScheduledAt`); display always timeZone:'UTC' via `lib/format`. Returns `{success, reference}`.
- `lib/format.ts`: formatUSD, formatRideDateTime, SERVICE_LABEL, VEHICLE_LABEL, STATUS_META.
- Admin `/admin` = bookings dashboard: status tabs (Pending default/Confirmed/Completed/Cancelled/All) with counts; `BookingCard` shows full details; server actions in `admin/actions.ts` (confirmBooking+price, cancel, complete) all `requireAdmin` + `revalidatePath('/admin')`.
- Test data inserted: OC-2026-0001 (airport, pending), OC-2026-0002 (city, pending). Discardable via dashboard.

### Phase 4 — Client ride history ✅
- `listBookingsForAccount(userId, email)` (OR userId/email → covers guest bookings made with same email).
- `/account/rides` lists `ClientRideCard`s (status, price-or-pending, invoice button when COMPLETED). Account page links to it.

### Phase 5 — Blog CRUD + public blog from DB ✅
- Admin: `/admin/blog` (list + delete), `/admin/blog/new`, `/admin/blog/[id]/edit`; `PostForm` (client) with live HTML preview; `blog/actions.ts` (create/update/delete, requireAdmin, slugify, revalidate admin + all locale homepages). Cover image is a URL field (file upload deferred). Content is HTML textarea (no WYSIWYG dep).
- Public `BlogSection` now takes `posts` prop; homepage fetches `listBlogPosts()` (mapped, createdAt→YYYY-MM-DD) with `export const revalidate = 60`. (Homepage is now dynamic ƒ since Prisma read isn't a cached fetch — acceptable; could wrap in unstable_cache later.)
- Admin PortalHeader nav: Bookings + Blog.

### Phase 6 — PDF invoices ✅
- `@react-pdf/renderer` installed. `lib/invoice/renderInvoice.tsx` → `renderInvoicePdf(booking): Buffer` (branded invoice, business details hardcoded).
- Route `app/(portal)/account/rides/[id]/invoice/route.ts` (runtime=nodejs): auth + ownership check (owner by userId/email, or admin), only COMPLETED + finalPrice, streams application/pdf inline.
- Verified: full `next build` passes (16 routes); sample invoice renders to a valid 3.4KB PDF.

## Audit pass (post-phase-6)
Fixed:
- Destructive actions now use a confirmation modal (`(portal)/_components/ConfirmSubmit.tsx`): blog delete, booking discard/cancel. (Honors "no one-click destructive / no native dialogs" rule.)
- Homepage blog fetch wrapped in try/catch → degrades to no posts instead of 500 if DB is down.
- Admin booking actions now guard current status (confirm only PENDING, complete only CONFIRMED, cancel only PENDING/CONFIRMED).

CRITICAL — RESOLVED via Option A:
- EmailJS removed from the client. `BookingForm.onSubmit` now does a single awaited POST to `/api/booking` (UI success/error driven by the response). `/api/booking` is the sole authority: verifies reCAPTCHA once → persists → notifies operator via Resend email (`lib/email.ts`) + Telegram (both best-effort).
- `lib/email.ts` made lazy + fail-soft (build caught it constructing Resend at import → threw without key). Skips sending if `RESEND_API_KEY` unset.
- ACTION FOR USER: set `RESEND_API_KEY` in `.env.local` for booking emails to actually send. EmailJS env vars now unused (see `.env.example`). Build green (16 routes).

## STATUS: All planned phases (1–6) complete + audit pass. Remaining/optional ideas: WYSIWYG editor + image upload for blog; move business info/pricing to admin Settings; rotate exposed reCAPTCHA + Google secrets before going public.

## Phase 7 — UX/feature round (client-requested batch of 10)
Done:
- **Login redirect:** `/login` (and already-signed-in guard) now go to `/` for all roles, not `/account`/`/admin`.
- **Invoice download:** route now `Content-Disposition: attachment`; client + admin cards use a plain `<a download>` (not next/link) so it reliably downloads. Admin card shows Invoice on COMPLETED.
- **Sticky mobile bar:** always visible (removed scroll gate), compact `size sm` + `whitespace-nowrap` so the phone number stays one line; `[locale]/page.tsx` has an `h-16 md:hidden` spacer so it never covers the footer.
- **Header email:** removed the email chip from `Navbar` desktop; email now lives in footer (already) + the mobile menu contact block.
- **Collapsible cards:** new `app/(portal)/_components/CollapsibleCard.tsx` (native `<details>`, no JS). `ClientRideCard` collapsed by default; admin `BookingCard` `defaultOpen` for PENDING (the actionable queue).
- **Admin delete:** `deleteBooking` repo + `deleteBookingAction` (requireAdmin) + Delete via `ConfirmSubmit` on all statuses. (Decided AGAINST archive — the 4 statuses + tab filter already cover the lifecycle.)
- **Emails (Resend):** new `lib/email/layout.ts` (branded, table-based, HTML wordmark, escapes user input). `lib/email.ts` → `sendBookingEmail` (operator) + new `sendBookingConfirmationEmail` (client, only if email present). Both wired in `/api/booking`. No invoice email (per decision).
- **Saved addresses (task 4):** new `SavedAddress` model + migration `20260623120000_add_saved_addresses` (DDL + backfill from legacy `User.defaultAddress`, which is KEPT but no longer written). `lib/repositories/addresses.ts` (list/create/setDefault/delete, ownership-scoped). Account page: `AddressManager` (edit-flow, immediate server actions: add/setDefault/delete). `ProfileForm` slimmed to phone only. New `components/ui/AddressAutocomplete.tsx` (extracted from BookingForm's old inline AddressInput; adds saved-address quick picks, default first). `BookingForm` fetches `/api/me/addresses` and passes saved list to pickup/dropoff. New `GET /api/me/addresses` (returns [] for guests).
- **Color/UX:** portal `<body>` switched from `bg-neutral-50 text-neutral-900` to brand tokens (`bg-brand-fog text-brand-dark`). Audit found NO arbitrary hex in components (only Google brand SVG + the PDF renderer, both legitimate) — the broader "comfort/hero UX" polish is subjective and pending visual review.

**BLOCKED ON USER:** run `npm run db:migrate` (or `npx prisma migrate deploy`) to create `SavedAddress` — until then the `/account` page errors for signed-in users (booking form degrades gracefully). tsc + eslint clean on all touched files.

### Phase 8 — Vehicle-name fix + first-rides ($50) promo ✅
Three client-requested items:
- **Q (logged-in booking email):** confirmed — `/api/booking` sends operator + client confirmation emails; logged-in users get the confirmation (email pulled from session). Guests get none (form has no email field). Requires `RESEND_API_KEY`.
- **Vehicle "vip" bug:** the Resend email was already correct (`formatVehicle`). The raw `vip` was the **Telegram** message (`route.ts`) — now uses `formatVehicle(body.vehicleId, vehicleType)` → "GLE 450 - VIP". Also switched admin `BookingCard` vehicle line from `VEHICLE_LABEL` to `formatVehicle`. (Still raw label in `ClientRideCard` + admin user-profile rides — left as-is; not part of the booking notification the user flagged.)
- **First-rides promo ($50 off each of first 3 rides, cancelled excluded):**
  - `lib/promo.ts` — `FIRST_RIDES_LIMIT=3`, `FIRST_RIDE_DISCOUNT=50`, `isFirstRidesEligible()`. Pure (no server-only) so client+server can import.
  - `countActiveBookingsForAccount(userId, email)` in bookings repo (non-cancelled, OR userId/email).
  - `GET /api/me/ride-stats` (mirrors `/api/me/addresses`) → `{ eligible, remaining, discount, limit }`; guests get `eligible:false`.
  - `BookingForm`: fetches ride-stats, shows a gentle brand banner above the stepper. Two variants: **guests** get a "$50 off your first 3 rides — sign in to claim it" nudge linking to `/login` (drives signups); **signed-in + eligible** users get "$50 off this ride". Used-up users get nothing. `/api/me/ride-stats` returns `authenticated` so the client picks the variant. i18n keys `booking.promo.{amountOff,bannerTail,signupLead,signupTail}` in en/fr/es.
  - Admin `page.tsx`: numbers each customer's non-cancelled rides by request order **in-memory** (no extra queries), passes `ride={position,total}` to `BookingCard`.
  - `BookingCard`: "$50 off" pill in the collapsed summary + a highlighted "Customer's ride #N of 3 — apply $50 first-rides discount" cue (or a muted "used up" line when past 3). Discount is applied manually by admin when pricing (no auto-pricing).
- Promo is **logged-in only** by design (guest bookings have null userId/email → can't be attributed). tsc clean; eslint clean (only the pre-existing RHF `watch()` warning).

### Phase 9 — Performance Max / ad-conversion readiness ✅
Prep for the $500 Google Ads PMax credit. Audit found tracking scaffold was live (`AW-16634852218`, form label set, tag mounted site-wide, tel:/mailto: click delegation) but incomplete. Changes:
- **Enhanced conversions:** `lib/gtag.ts` `trackFormConversion(lead)` now sends `user_data` (email/phone→E.164/name) via `gtag('set','user_data',…)` so Google hashes + matches. `BookingForm.onSubmit` passes `{ reference, name, phone }` (form has no email field; logged-in email not in client state).
- **Value + dedup:** conversion now sends `value`/`currency` (from `NEXT_PUBLIC_LEAD_VALUE`, default 50) + `transaction_id` = booking reference (stops reload double-counting).
- **GA4:** `gtag.ts` exports `GA4_ID`; `GoogleAds.tsx` configs both AW + GA4 (loads tag with whichever id exists, `id="google-tag-init"`). Set `NEXT_PUBLIC_GA4_ID` to enable.
- **Cleanup:** removed unused `@emailjs/browser` dep (`npm uninstall`) + the 3 `NEXT_PUBLIC_EMAILJS_*` env vars.
- tsc + eslint clean (only the pre-existing RHF `watch()` warning).

**BLOCKED ON USER (Google Ads side — code is ready, waiting on config):**
1. Create **Phone-call** + **Email-click** conversion actions → paste labels into `NEXT_PUBLIC_GOOGLE_ADS_LABEL_PHONE/_EMAIL` (empty now → those conversions don't fire). Phone is the biggest miss for a car service.
2. Enable **"Enhanced conversions for leads"** in Google Ads (Google-tag method) + accept terms — otherwise `user_data` is ignored.
3. Mark **form-submit + phone** as Primary conversions, email-click as Secondary.
4. (Optional) create a GA4 property → set `NEXT_PUBLIC_GA4_ID`.
5. Tune `NEXT_PUBLIC_LEAD_VALUE` to real avg margin.
6. Geo: target the service-area cities with **"Presence: people in/regularly in"** (not presence-or-interest); turn **Final URL expansion OFF** initially (land on homepage form).

### Phase 10 — UX/conversion + SEO round (Old Colony, 2026-07-22) ✅
Brainstorm session with Wael → approved package (Twilio SMS deferred):
- **Instant flat-rate quote in BookingForm** — new `lib/quote.ts` detects corridor-town ↔ Logan trips from the typed addresses (conservative string match + "final price confirmed" copy). Step 1 shows a rate banner (sedan + SUV), step 2 vehicle cards show per-vehicle `$X flat` (replaces meaningless VIP badge when quoted), step 3 summary shows the locked rate. `quotedRate` flows into the API → Telegram, both emails, and is prepended to DB notes (`[Quoted flat rate: $X]`) for the admin dashboard. i18n en+fr.
- **Email field (optional) on step 3** — guests finally get the Resend confirmation email (API already supported it; form never collected it).
- **Success screen** — booking reference + "confirm within 30 min" + phone link (was a bare checkmark).
- **Real reviews** — REVIEWS in `lib/data.ts` replaced with the 4 real Google reviews from the Birdeye profile (Kesia S., MarDeb B., Ali S., Temesgen M.). Removed `aggregateRating`/`review` JSON-LD from layout (Google treats third-party-collected review markup as self-serving spam). Testimonials section: 2-col grid + "real reviews from Google" sub.
- **Homepage restructure** — order now Hero → FlatRates → HowItWorks → Services → Fleet → Testimonials → ServiceArea → FAQ. StatsSection deleted (trust markers already in hero), Blog section removed from homepage (still at /blog; navbar/footer now link to the page instead of a dead #blog anchor). Navbar gained a "Rates" link. Homepage no longer queries the DB.
- **FAQPage JSON-LD** on the homepage, built from the same localized `faq.items` the section renders.
- **WhatsApp** — `lib/contact.ts` (WHATSAPP_URL + canonical phone/email consts), `WhatsAppIcon` component; green button in StickyMobileBar + link in Footer contact.
- **Corporate travel page** — new `corporate-travel` entry in SERVICE_PAGES (EN+FR, monthly-invoicing pitch, assistant-friendly copy); auto-appears in sitemap; footer "Corporate Travel" link.
- **Services positioning polish** — airport page now quotes the published $79–105 corridor rates; black-car page corridor-anchored (dropped "30+ towns" claims).
- **Photos** — hero was literally the *Manhattan* skyline (og-hero.jpg too): replaced with a Boston-skyline-at-dusk Pexels photo (hero.avif 2400×1350 + og-hero.jpg 1200×630). c300.avif had garbled AI text on the grille → replaced with a clean black S-Class (Pexels). Suburban/Escalade/GLE kept. Pexels license: free commercial use, no attribution required.
- Deferred: Twilio SMS (Wael), 29 blog posts DB retarget (low ROI now), review-request automation (pointless until GBP exists — no review link to send).
- Verified: `tsc --noEmit` clean, `next build` all routes OK.

### Phase 11 — Hero fare finder (2026-07-22) ✅
- New `components/ui/FareFinder.tsx` in the hero: town select (10 corridor towns) + sedan/SUV toggle → published rate shown instantly (animated via `oc-pop` keyframe in globals.css). "Book this rate" dispatches `oc:prefill` CustomEvent + scrolls to #booking.
- `BookingForm` listens for the event: sets serviceType=AIRPORT, pickup "<Town>, MA", dropoff "Boston Logan International Airport (BOS)" — `lib/quote.ts` then re-derives the same rate in the form, so finder + form can never disagree.
- Hero right card got a navy header ("Book Your Ride" / "Price confirmed in writing within 30 minutes" / "No surge — ever" badge); phone CTA merged into the trust row to make room. i18n en+fr (`hero.fare.*`, `hero.form*`).
- tsc + next build clean.
