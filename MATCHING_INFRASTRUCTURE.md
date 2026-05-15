# Honest Fetish Matching — Infrastructure Plan

Internal planning doc for the matching service (`/match.html` vision). Captures the recommended tech stack, data model, build phases, and known unknowns so any agent or developer can pick up the build.

Last updated: 2026-05-15.

---

## Strategic spine (read first)

The actual unmet demand on every adult sexuality platform — OnlyFans, cam, escort, Playboy, the playmate economy, the existing fetish-matching apps — is **the integrated woman**: real person, real life, real lineage, real appetite, sexually free without being depleted, sexually generous without being available to everyone, partner-capable. Both creators and consumers are looking for this. The platforms monetize the gap.

Honest Fetish Matching serves the demand on both sides directly + adds a **teaching/training layer** (body practices, dismantling work, hypnosis, coaching, lineage-aware education) that platforms cannot offer. The teaching layer is the unfair advantage.

This shapes every infrastructure decision below. Build for trust, vetting, integration, and partnership outcomes — not for swipe-rate or session-time.

---

## Stack recommendation

**Frontend.** Static HTML/CSS/vanilla JS for the marketing surface (already built — `index.html`, `match.html`, `test.html`). For the authenticated app surface, a small SPA in **SvelteKit** or **Astro + Svelte islands**. Avoid React/Next unless a developer with strong React preference is doing the build — the marketing site is already vanilla and Svelte keeps the same low-overhead feel.

**Hosting.** **Cloudflare Pages** for the entire static + SPA surface. Already in the Cloudflare account. Free tier covers traffic for the first ~12 months. Custom domains route through the same Cloudflare account.

**Backend / API.** **Cloudflare Workers** for all serverless API routes. Single deployment, edge-distributed, no cold-start, billed per request. The match-test scoring, account creation, profile read/write, vetting workflow, payment webhooks, and matching algorithm all live as Worker routes.

**Database.** **Cloudflare D1** (SQLite-on-edge) for relational data — accounts, profiles, test results, matches, messages, vetting state, payment records. D1 is currently capped at 10GB per database; that's enough for hundreds of thousands of profiles. Worker-to-D1 latency is sub-millisecond.

**Object storage.** **Cloudflare R2** for profile photos, ID verification documents (encrypted at rest, TTL-deleted after vetting), and any uploaded media. R2 is S3-compatible, has zero egress fees, and bills only on storage.

**Queues / async.** **Cloudflare Queues** for vetting workflow (review → background-check → human-approval), matching batch jobs, email sending, and any retryable work.

**Email / notifications.** **Resend** (transactional) + **ConvertKit** or **Buttondown** (newsletter cross-promotion). Worker writes to Resend API for vetting status, match notifications, and aftercare check-ins.

**Payments.** **Stripe** for one-time vetting fees and recurring subscriptions. Stripe Connect is *not* needed unless we eventually pay practitioners for matched introductions — and even then, Connect is overkill for the first version.

**Auth.** **Clerk** or **Auth0** for the account layer. Clerk is the cheaper option and integrates cleanly with Workers via JWT. Magic-link login + optional WebAuthn (FIDO2) for the vetted-member tier — passwords are weak for a service whose value is identity integrity.

**Background-check vendor.** **Checkr** or **Sterling** for any background screening on practitioners listed in the directory. Out of scope for v1 of the matching service itself (matches happen between members, not against practitioners).

**Why this stack.**
- Single vendor (Cloudflare) for hosting, compute, database, storage, queues, CDN, DDoS — one bill, one auth context, one set of dashboards.
- Edge-distributed by default — global latency is solved before it's a problem.
- Cost-linear with usage — no $500/month minimums on a service still in private beta.
- Real ownership of data — no Vercel/AWS lock-in story to unwind later.
- Replicates trivially to other verticals in the 100-fishing-lines portfolio.

---

## Data model (D1 schema, first pass)

```sql
-- Accounts (auth)
CREATE TABLE accounts (
  id TEXT PRIMARY KEY,                    -- Clerk user ID
  email TEXT UNIQUE NOT NULL,
  created_at INTEGER NOT NULL,
  vetting_status TEXT NOT NULL,           -- 'unvetted' | 'in_review' | 'approved' | 'rejected' | 'removed'
  membership_tier TEXT,                   -- 'free' | 'standard' | 'premium' | NULL
  test_complete BOOLEAN DEFAULT 0
);

-- Test results (one row per test attempt; latest wins for matching)
CREATE TABLE test_results (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id),
  taken_at INTEGER NOT NULL,
  ar INTEGER, bg INTEGER, d INTEGER, pv INTEGER, op INTEGER,
  rt INTEGER, s INTEGER, dm INTEGER, v INTEGER,
  shadow_appetite TEXT,                   -- comma-separated codes (F,G,V,...)
  code TEXT NOT NULL                      -- denormalized portable code
);

-- Profiles (the actual matching surface)
CREATE TABLE profiles (
  account_id TEXT PRIMARY KEY REFERENCES accounts(id),
  display_name TEXT,
  pronouns TEXT,
  age INTEGER,
  city TEXT,
  region TEXT,
  bio TEXT,
  practices_offered TEXT,                 -- JSON array
  practices_sought TEXT,                  -- JSON array
  hard_limits TEXT,                       -- JSON array
  relationship_structure TEXT,            -- 'monogamous' | 'open' | 'polyamorous' | 'undecided' | 'situational'
  visibility TEXT NOT NULL DEFAULT 'private',  -- 'private' | 'matched_only' | 'directory'
  updated_at INTEGER NOT NULL
);

-- Matches (algorithmic candidates surfaced to a member)
CREATE TABLE matches (
  id TEXT PRIMARY KEY,
  account_a TEXT NOT NULL REFERENCES accounts(id),
  account_b TEXT NOT NULL REFERENCES accounts(id),
  score REAL NOT NULL,                    -- 0.0-1.0 structural compatibility
  surfaced_at INTEGER NOT NULL,
  a_response TEXT,                        -- 'pending' | 'opened' | 'passed'
  b_response TEXT,
  conversation_started_at INTEGER
);

-- Messages (structured-prompt opener + free-form thereafter)
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL REFERENCES matches(id),
  sender_id TEXT NOT NULL,
  body TEXT NOT NULL,
  prompt_template TEXT,                   -- if structured opener
  sent_at INTEGER NOT NULL,
  read_at INTEGER
);

-- Vetting events (audit trail)
CREATE TABLE vetting_events (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id),
  event_type TEXT NOT NULL,               -- 'submitted_id' | 'video_call_scheduled' | 'human_review' | 'approved' | 'flagged'
  notes TEXT,
  reviewer TEXT,
  occurred_at INTEGER NOT NULL
);

-- Reports (member-flagged behavior)
CREATE TABLE reports (
  id TEXT PRIMARY KEY,
  reporter_id TEXT NOT NULL REFERENCES accounts(id),
  reported_id TEXT NOT NULL REFERENCES accounts(id),
  category TEXT NOT NULL,                 -- 'consent_violation' | 'misrepresentation' | 'harassment' | 'other'
  body TEXT,
  status TEXT NOT NULL,                   -- 'open' | 'investigating' | 'resolved' | 'rejected'
  filed_at INTEGER NOT NULL
);
```

Indexes on `(account_id)` and `(vetting_status)` and `(score DESC)` for the surfacing query. Migrations stored in `/migrations` and applied via `wrangler d1 migrations apply`.

---

## Matching algorithm (v1)

The 9-axis test code is the seed. Compatibility is computed pairwise between every approved member and every other approved member with overlapping geography or stated remote-friendliness. Score is a weighted distance function on the 9 axes plus shadow-appetite Jaccard similarity:

```
score(a, b) = 1 - (
  w_complement * complement_distance(a, b)  // for AR, S, DM (these match by complementarity)
  + w_align * align_distance(a, b)           // for BG, D, PV, OP, RT, V (these match by similarity)
  + w_shadow * (1 - jaccard(a.shadow, b.shadow))
  + w_limits * limits_violation(a, b)        // hard limits are deal-breakers
)
```

`limits_violation` is binary — any hard limit on either side that the other has stated as desired forces score to 0. The remaining weights are tuned during private beta.

The algorithm is intentionally simple and explainable. Members can see *why* a match was surfaced ("you both want X, your structures are compatible, your shadow appetites overlap on Y"). Black-box ML is a feature for v3 at the earliest.

---

## Vetting workflow (v1)

1. Member completes test (free, no account required).
2. Member creates account to save test result.
3. Member submits profile — name, photos, bio, practices, limits, structure.
4. Member submits ID verification (government photo ID) via R2 upload.
5. Member books a 15-minute video call with a human reviewer.
6. Reviewer confirms ID, talks to member about expectations, flags anything off.
7. Reviewer approves or rejects in dashboard.
8. Approved member becomes visible to matching algorithm.
9. ID upload is TTL-deleted from R2 after 30 days; only the verification fact persists.

Vetting fee charged at step 4 ($100-300 depending on tier). Subscription begins at step 8 ($25-50/mo).

---

## Build phases

### Phase 0 — Marketing surface (DONE)
- `/match.html` vision page LIVE.
- `/test.html` interactive demo LIVE.
- Both in nav across all pages.

### Phase 1 — Test infrastructure (NEXT)
- Migrate `test.html` from client-side-only to write-through to D1.
- Account creation gated behind test completion.
- Email capture for "save my code" → ConvertKit.
- ~30-question full version (current is 10-question demo).
- Estimated effort: 1-2 weeks.

### Phase 2 — Profile + vetting
- Profile creation form.
- ID upload via R2 (presigned URLs).
- Vetting dashboard for human reviewer.
- Stripe integration for vetting fee.
- Estimated effort: 4-6 weeks.

### Phase 3 — Matching + messaging
- Pairwise scoring batch job (Queues).
- Match surfacing UI.
- Structured-prompt message opener.
- Aftercare check-in scheduling.
- Estimated effort: 4-6 weeks.

### Phase 4 — Teaching layer integration
- Practice library access (gated by membership).
- Hypnosis recording delivery (R2 + signed URLs).
- Coaching booking flow (Cal.com or custom).
- Practitioner directory cross-link with vetted-member badges.
- Estimated effort: 4-6 weeks.

### Phase 5 — Soft launch
- Private beta with 50-100 hand-picked members.
- Two months of observed-use data.
- Tune algorithm weights, vetting standards, pricing.

### Phase 6 — Public launch
- Open application waitlist.
- Editorial coverage in Tantra Authority + Naked Mind.
- Featured Woman / Featured Practitioner cross-promotion.

---

## Domain decision (open)

Three candidates considered:
- `match.tantraauthority.com` — subdomain. Cheapest, fastest, lowest brand-isolation.
- `entendre.authority` — own domain. Distinct brand for a service that may want distance from "tantra" framing for legal/marketing reasons.
- `theintegrated.app` or similar — name that signals what it actually does.

Recommendation: build on subdomain for v1 (Phase 1-3), reserve a standalone domain for Phase 5+ when launching publicly. Lawrence currently owns enough Cloudflare-managed domains that this can be revisited cheaply.

---

## Legal structure (defer to attorney, but plan for)

- Adult-content vendor compliance (most payment processors require explicit acknowledgment).
- FOSTA-SESTA exposure — the platform must not facilitate transactional sex; clear Terms-of-Service language and active enforcement of behavior reports.
- KYC/identity verification on members (already covered by vetting workflow).
- Data residency — Cloudflare offers regional storage; consider EU residency for any EU members under GDPR.
- 18 U.S.C. 2257 record-keeping if any user-generated explicit content is hosted (current plan: do not host such content; profile photos must be SFW).
- Mandatory reporting obligations for any reports of underage involvement (zero-tolerance, immediate ban + report to NCMEC).

These are not optional. Engage a lawyer with adult-platform experience before Phase 4.

---

## Costs (rough monthly, at scale of 5000 members)

| Service | Monthly cost |
|---|---|
| Cloudflare Pages + Workers + D1 + R2 + Queues | $20-100 |
| Clerk (auth) | $25-100 |
| Resend (email) | $20 |
| Stripe (% of revenue, no fixed cost) | — |
| Background-check vendor (per practitioner) | $30-50/check |
| Lawyer (retainer + per-incident) | $500-1500 |
| Human reviewer (part-time, 20 hrs/wk) | $2000-4000 |
| **Total monthly fixed cost (excluding revenue-share fees)** | **~$3000-6000** |

Revenue model at 5000 members ($25/mo average subscription + $200 average vetting fee amortized over 24mo) = ~$165,000/mo. Net margin after fixed costs and Stripe fees: ~$140,000/mo at 5000 members.

The math works at much smaller numbers too. 500 members at the same pricing: ~$13,500/mo gross, ~$8,000-9,000/mo net.

---

## Known unknowns

- Test-to-account conversion rate. Unknown until Phase 1 data exists.
- Vetting throughput per reviewer-hour. Estimate 4-6 fifteen-minute calls per hour, but unknown until practiced.
- Match acceptance rate. Will determine whether the algorithm is over-tuned (too few surfaced matches) or under-tuned (too many low-quality matches).
- Aftercare check-in compliance. Whether members actually fill out post-meet feedback. This data is essential for tuning the algorithm but cannot be coerced.
- Cross-vertical traffic from Tantra Authority article funnel. Unknown until articles are mature.

---

## Adjacent infrastructure

- **Practitioner directory** (`/directory.html`) is independent of the matching service but shares vetting standards and member-discount integration.
- **Tantric Match Test** (`/test.html`) is the free top-of-funnel for matching, but also functions as standalone SEO content (BDSM-test analog).
- **Shop** (`/shop.html`) eventually surfaces hypnosis recordings, books, gear — the teaching-layer products that the matching service unlocks for members.
- **Featured Woman** editorial spreads are the highest-fidelity expression of the strategic spine — render real women honestly, give them voice and context, prove the alternative to the OnlyFans flatten.

---

## Pointers

- Marketing surface code: `/Users/lawgreg/consciousness_agent/code/verticals/tantra-authority/`
- Strategic spine memory: `~/.claude/projects/-Users-lawgreg-consciousness-agent/memory/project_onlyfans_real_demand.md`
- Test memory: `~/.claude/projects/-Users-lawgreg-consciousness-agent/memory/project_tantric_match_test.md`
- Pillars (load-bearing concepts): `/Users/lawgreg/consciousness_agent/LAWRENCE_PILLARS.md`
- Portfolio (where this fits in the 100-fishing-lines plan): `/Users/lawgreg/consciousness_agent/LAWRENCE_DIGITAL_PORTFOLIO.md`
