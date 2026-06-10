# PRODUCTS.md — Tantra Authority Product Catalog (staging + merchandising map)

**Built 2026-06-09.** Source survey of Lawrence's full back-catalog so `shop.html` can actually SELL.
Sources: `~/command-center/MASTER_INVENTORY.md`, `INVENTORY_PLATFORMS.md`, `/Volumes/untitled/00-INVENTORY.md`, `~/.claude/.../memory/project_s3_archive.md`, `ACIF_HUB.html`, `AFFILIATE_PRODUCTS.md`.

---

## 🚨 THE HEADLINE (read first — ✅ UPDATED 2026-06-10: CHECKOUT IS SOLVED)

**The store is LIVE.** Clover one-time checkout is wired + proven end-to-end on `tantra-authority.com/shop.html` (Buy → $97 → **course streams from S3** → recover-by-email). **2 products selling now @ $97: Tantra X (men, bucket `tantra-x`) + Chakra Healing (women, bucket `chakra-healing-program`).** S3 delivery works (AWS creds = Worker secrets; presigned URLs verified). Adding any product below = set `priceCents`+`bucket` in `tantra-authority-api/src/checkout.js` + a shop card → buyable.

> ⚠️ **Re-reading the "NEEDS-LINK" status below:** it no longer means "no checkout exists." It now means **"this S3 bucket hasn't been verified + merchandised onto the shop yet."** The plumbing is done; the remaining work is per-product (verify the bucket has the right files, price it, add the card) + finished-product quality (e.g. the chakra audio restoration pass — see the dossier).

*(Historical survey context preserved — what the original gap was.)* Earlier the constraint was *distribution + a checkout*: ClickFunnels products were stranded on an un-loginnable Mac Mini, S3 had no creds on the machine, `thenaked.press` didn't resolve. **All of that is now bypassed** — the TA Worker holds AWS + Clover creds and streams directly from the S3 buckets.

---

## STATUS LEGEND

- **LIVE-LINK** — a sales/landing URL was found AND verified HTTP 200 in this session.
- **NEEDS-LINK** — real finished product, but no working checkout exists. Blocked on Lawrence providing a Gumroad/Teachable/Stripe/etc. link (or restoring access to the Mac Mini / S3).
- **COMING-SOON** — in production / not yet finished; merchandise as named "coming soon," no link.

---

## 📦 COURSES (finished IP — the fastest money, all blocked on checkout)

| Title | Format | Topic / Cluster | Source location | Sales link | Price | Status |
|---|---|---|---|---|---|---|
| **Tantra XO** | Course (9 vols: audio+video+bonuses; CAT Touch, Boundaries, Body Beliefs) | Tantra / couples practice | S3 `TantraXO`, Mac Mini | — | unknown (was paid) | NEEDS-LINK |
| **Tantra X / TXF** | Course (50 Laws of Sexual Power, 5 vols + TXF 9-vol + interviews) | Tantra / sexual power | S3 `tantra-x`, Mac Mini | — | unknown | NEEDS-LINK |
| **The Open Relationship Blueprint** | Course (15+ video modules) | Open relationships / non-monogamy | S3 `the-open-relationship-blueprint` | — | unknown | NEEDS-LINK |
| **Chakra Healing Program** | Course (27 meditation/energy sessions) | Energy / meditation | S3 `chakra-healing-program` | — | unknown | NEEDS-LINK |
| **Red Hot Touch** | Course (8 massage/touch video modules) | Touch / partnered practice (Dodson/Ross era) | S3 `redhottouch` | — | unknown | NEEDS-LINK |
| **Sexual Charisma Course** | Course (7-day video series) | Charisma / shadow | S3 `sexualcharismacourse` | — | unknown | NEEDS-LINK |
| **Language of Lust Mastery** | Course (47 modules: dirty talk, texting, hypnosis) | Shadow / erotic language | S3 `languageoflustmastery` | — | unknown | NEEDS-LINK (needs assembly) |
| **45-Minute Orgasm** | Course (7 modules) | Female orgasm | S3 `45minuteorgasm` | — | unknown | NEEDS-LINK (partial) |
| **Energy-Sex** | Course (18 modules) | Energy practice | S3 `energy-sex` | — | unknown | NEEDS-LINK (partial) |
| **The Optimized Mind** | Course (11 mindset modules) | Modern enlightenment / mindset | S3 `theoptimizedmind` | — | unknown | NEEDS-LINK (raw) |
| **Lawrence the Energy Master** | Course | Energy practice | S3 `lawrencethenergymaster` | — | unknown | NEEDS-LINK |
| **Radical Self-Acceptance** | Course | Shadow / mindset | S3 `radicalselfacceptance` | — | unknown | NEEDS-LINK |
| **Sexual Tsunami** | Bonus course | Female pleasure | S3 `sexualtsunamibonus` | — | bonus | NEEDS-LINK |
| **5-Minute Meditation / Binaural Downloads** | Lead-magnet audio | Meditation (entry/lead) | S3 `5-minute-meditation`, `binauraldownloads` | — | free/lead | NEEDS-LINK (good as lead magnet) |

---

## 📚 BOOKS

| Title | Format | Topic / Cluster | Sales/landing link | Price | Status |
|---|---|---|---|---|---|
| **Beyond the Myth: The Definitive Guide to Modern Tantra** | Book (42 ch / ~133K, first draft done) | Tantra (flagship) | `book.html` pre-order list (LIVE 200; working email capture) | Forthcoming 2026 | **LIVE-LINK** (pre-order list only — not a paid checkout) |
| **A Course in Freedom: The Drunken Monkey Speaks** (2007) | Book (PDF + ePub, finished) | Consciousness / foundational | — (vault PDF) | unknown | NEEDS-LINK |
| **The Open Relationship Blueprint** (book) | Book (outline + full source framework) | Open relationships | — | — | COMING-SOON |
| **Unbuilding the Drunken Monkey** | Book (PDF, finished) | Consciousness | — (vault) | — | NEEDS-LINK |
| **Freedom OS** | Book (PDF, finished) | Consciousness OS | — (vault) | — | NEEDS-LINK |
| **Getting Over God** | Book (extracted .md) | Post-religion | — (vault) | — | NEEDS-LINK |
| **Beyond the Myth series** (Energy Sex · Female Sexuality · Male Sexuality · Modern Enlightenment · Sexual Shadow) | Books (outlines + research) | various | — | — | COMING-SOON |

---

## 🎧 AUDIO / HYPNOSIS LIBRARY (finished, vault-resident — needs hosting + checkout)

| Title | Format | Topic / Cluster | Source | Sales link | Status |
|---|---|---|---|---|---|
| **Active Meditations 2026** (~20 tracks) | Audio (Berserker, Freedom/Consciousness, submission, wealth-liberation, heart-open) | Hypnosis / meditation | vault `Active_Meditations_2026/` | — | NEEDS-LINK (needs R2 hosting) |
| **Deep Hypnosis systems** (Circle Master Magnetism, Golden Walrus, Infinite Flow, Symbolic Power) | Audio (45–60 min each, M3U) | Hypnosis | vault `deep_hypnosis/` | — | NEEDS-LINK |
| **Big Tits Alpha** | Audio (magnetism/confidence, 3 voices + guide) | Shadow / confidence | vault `big_tits_alpha/` | — | NEEDS-LINK |
| **Charlotte Overnight Megamix** | Audio (8-hr sleep loop) | Sleep / installation | vault `charlotte_overnight_megamix/` | — | NEEDS-LINK |
| **Dual Voice** (Eriksonian 30-min) | Audio | Hypnosis | vault `dual_voice/` | — | NEEDS-LINK |
| **Shame-Layer Dissolution series** | Audio (planned named product per OPERATIONAL_PROTOCOLS §9) | Shadow / dismantling | to assemble from above | — | COMING-SOON |
| **Meditation/teaching library** (180+ sessions, 9.7GB) | Audio | Consciousness | `consciousness_agent/audio_local/` | — | NEEDS-LINK (mine for products) |

> NOTE: `Sexual_Freedom_Vault/hypnosis/` (5 external MP4s, ~1.4GB) are **third-party purchases — CANNOT be resold.** Excluded from catalog.

---

## 🧑‍🏫 COACHING

| Offer | Format | Sales path | Price | Status |
|---|---|---|---|---|
| **1:1 with Lawrence** | 3-month container, application-only | `ask.html` (LIVE 200) is the existing intake door | on inquiry | LIVE-LINK (application door, not "buy now" — correct per protocol §9) |
| **The Naked Practice** (small-group cohort) | 8-person, 12-week | — | — | COMING-SOON |
| **Annual retreat** | 8 people, one week | — | — | COMING-SOON |

---

## 🛒 AFFILIATE GEAR (third-party — the only verified live links)

| Item | Link | Verified | Status |
|---|---|---|---|
| Massage wand | `https://amzn.to/43ZQkMi` | 200 (L) | **LIVE-LINK** (tag `dailyforager-20`) |
| The Rose (suction vibe) | `https://amzn.to/4v1LtpK` | 200 (L) | **LIVE-LINK** |
| Coconut oil (tantric lube) | on `coconut-oil-the-tantric-lube.html` (Nutiva/Viva /dp, tag wired) | — | LIVE-LINK (article-embedded) |
| We-Vibe / Lelo / Magic Wand / Tantus / Pure Wand / Womanizer / Doxy / Tenga | — | — | NEEDS-LINK (affiliate accounts not set up) |

---

## 🔢 THE COUNT

- **Total sellable products surveyed:** ~36 (14 courses + 7 books + ~8 audio products/systems + 3 coaching + ~4 affiliate gear lines).
- **LIVE-LINK (verified 200):** **5** — Beyond the Myth pre-order list (`book.html`), 1:1 coaching application (`ask.html`), and 3 Amazon affiliate gear links. *Note: none of these is a paid checkout for a Lawrence-made digital product. The book is a list; coaching is an application; the gear is third-party affiliate.*
- **NEEDS-LINK (real product, no checkout):** **~24** — the entire course catalog + finished books + the audio/hypnosis library.
- **COMING-SOON:** ~7 (unfinished series books, group cohort, retreat, named audio bundle).

**Bottom line: the funnel hub points at a shop with zero paid product checkouts. Fixing that needs ONE thing — checkout links (see GATE).**

---

## STEP 3 — ARTICLE CLUSTER → PRODUCT CTA MAP (the doorway → product path)

Each live article cluster has a natural product it should CTA to once a checkout exists. Until then, the CTA is the **email/notify list** (`book.html`, verified live) or the **1:1 door** (`ask.html`) — never a dead "Buy" button.

| Cluster | Representative live articles | Should CTA to (product) | Interim safe CTA (live now) |
|---|---|---|---|
| **Foundations** (what tantra is / ritual / breath) | `what-tantra-actually-is`, `ritual-without-religion`, `tantric-breathing-truth`, `five-body-technologies`, `the-dismantling` | **Beyond the Myth book** + **Chakra Healing / Energy-Sex** courses | `book.html` pre-order list |
| **Practice** (couples / touch / breath drills) | `tantric-practices-for-couples`, `the-blossom-technique`, `pelvic-floor-techniques`, `why-most-tantric-sex-doesnt-work`, `the-body-vocabulary` | **Tantra XO**, **Red Hot Touch** courses + **Audio practice library** | `book.html` list / `shop.html` audio section |
| **Pleasure** (orgasm / female sexuality — the new topic) | `is-this-normal-women-and-orgasms`, `the-ease-of-orgasm`, `letting-your-orgasm-flow`, `the-tight-vagina-mythology`, `the-energy-cock-and-the-energy-pussy` | **45-Minute Orgasm**, **Sexual Tsunami**, **Energy-Sex** courses + female-pleasure audio | `shop.html` (gear: massage wand / Rose, verified) + `book.html` list |
| **Shadow** (fetish / kink / OnlyFans / shame) | `beyond-the-myth-fetish`, `beyond-the-myth-submission`, `beyond-the-myth-onlyfans`, `the-shadow-that-wants-more`, `erotic-hypnosis`, `objectification-is-great` | **Language of Lust Mastery**, **Sexual Charisma**, **hypnosis/Shame-Layer Dissolution** audio | `book.html` list (+ existing `/premium/` agent digest) |
| **Open relationships** (non-monogamy) | `cheating-isnt-a-thing`, `why-people-cant-cheat` | **The Open Relationship Blueprint** (course + book) | `book.html` list |
| **Aging / sexual health** (60+) | `dating-again-after-60`, `pleasure-after-70`, `sex-after-65-good-medicine`, `dryness-and-painful-sex-fixes` | (no direct course) → **Beyond the Myth** + gear | `shop.html` gear + `book.html` list |

> Do NOT mass-edit articles yet. This is the map. Wire CTAs per-cluster once real checkout links land.

---

## 🚪 THE GATE — what Lawrence must provide to unlock monetization

**This is the ONLY thing blocking the funnel from selling.** Everything is built and staged. Provide a real, working checkout/landing URL (Gumroad / Teachable / Stripe Payment Link / Podia / SamCart — any) for each product below, and `shop.html` flips from "notify me" to "Buy now" instantly.

**Tier 1 — fastest money (fully finished courses):**
1. **Tantra XO** — checkout link?
2. **Tantra X / TXF** — checkout link?
3. **The Open Relationship Blueprint** (course) — checkout link?
4. **Chakra Healing Program** — checkout link?
5. **Red Hot Touch** — checkout link?
6. **Sexual Charisma Course** — checkout link?

**Tier 2 — finished books (need a store / KDP / Gumroad page):**
7. **A Course in Freedom** — sales link? (or confirm KDP listing)
8. **Unbuilding the Drunken Monkey** / **Freedom OS** / **Getting Over God** — links?

**Tier 3 — audio/hypnosis (need R2 hosting + checkout):**
9. **Active Meditations / Deep Hypnosis bundles** — host on R2 + a checkout link.

**ALTERNATIVELY — restore access (unblocks the whole catalog at once):**
- **Mac Mini `boxys-mac-mini`:** which user/volume the migrated ClickFunnels products live on, OR admin creds. This box holds the productized course funnels.
- **AWS S3:** put `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY` in `consciousness_agent/.env` (or `aws sso login`) so the 22+ course-master buckets can be hosted/sold.
- **`thenaked.press`:** the imprint domain doesn't resolve — stand it up if it's meant to be the store.

**Affiliate (quick, no Lawrence-checkout needed):** set up affiliate accounts for We-Vibe / Lelo / Womanizer / Doxy / Tenga to populate the gear section with verified links (the same way `amzn.to/43ZQkMi` and `amzn.to/4v1LtpK` are already wired).

---

*No dead "Buy" buttons were deployed. `shop.html` lists real products as named "coming soon / join the list" entries pointing only to verified-live pages (`book.html` capture form, `ask.html` intake) + the verified Amazon affiliate links. Full monetization is one set of checkout URLs away.*
