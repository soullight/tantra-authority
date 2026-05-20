# Tantra Authority — Session State

**Updated:** 2026-05-20
**Purpose:** Single source of truth for any agent or operator picking up this work cold. Reconstitutes the current state without needing to re-verify endpoints or re-read every commit.

---

## Live state

**Primary URL:** https://tantra-authority.com (apex, hyphenated — this is the canonical domain, see `CNAME`)
**Aliases (301 → apex):** `www.tantra-authority.com`, `tantraauthority.com` (no-hyphen)
**Repo:** https://github.com/soullight/tantra-authority (origin = main)
**Hosting:** GitHub Pages, auto-deploys from main, build status: green. DNS is live at Cloudflare.
**Backend API:** https://api.tantra-authority.com (Cloudflare Worker, source in `../tantra-authority-api/`). D1 binding: `tantra-authority-db`.

**Deploy cadence:**
- Site: `git push` → 30-90 sec → live. No build step.
- Worker: `cd ../tantra-authority-api && wrangler deploy` (requires `CLOUDFLARE_API_TOKEN`).

---

## Pillars (read first, every session)

1. **`/Users/lawgreg/consciousness_agent/LAWRENCE_PILLARS.md`** — load-bearing concepts. Recently updated sections:
   - §3 SEX IS THE PRIMORDIAL FACT — now includes integrated-girlfriend insight, whore-as-power reframe, women's-orgasm-shame standing observation
   - §3.4 SAFETY IS THE PRECONDITION FOR ORGASMIC FREEDOM — the new pillar (six conditions: safe/open/vulnerable/shame-free/guilt-free/fear-free), cult-cannot-generate-it structural argument, three-layer build (body / relationship / dismantling). Upstream of every article.

2. **`~/.claude/projects/-Users-lawgreg-consciousness-agent/memory/MEMORY.md`** — auto-loaded into every session. Indexes the project memories.

3. **`OPERATIONAL_PROTOCOLS.md`** (this directory) — brand operations manual. Strategic spine, voice rules, article structure spec, contributor vetting, directory standards, Featured spread protocols, matching-service operating standards, voice prohibitions, definitions of done, the standing question (*does this serve the body's freedom or the brand's optics?*).

---

## Articles live on the site (as of 2026-05-15)

**Foundations (10):**
- safety-is-the-precondition.html — *the upstream reference*
- what-tantra-actually-is.html
- the-body-vocabulary.html (stub, needs deepening)
- the-dismantling.html
- cheating-isnt-a-thing.html (with full ORB framework + modern surveillance era)
- why-people-cant-cheat.html (companion body-grounded piece)
- are-you-broken.html (women's orgasm-shame foundation piece)
- is-this-normal-women-and-orgasms.html (companion Q&A piece)
- the-energy-cock-and-the-energy-pussy.html
- sex-as-meditation.html

**Practice (9):**
- the-ease-of-orgasm.html
- the-tight-vagina-mythology.html
- tantric-breathing-truth.html
- why-most-tantric-sex-doesnt-work.html
- tantric-practices-for-couples.html
- anal-play-for-straight-men.html
- premature-ejaculation-the-science.html
- why-toys-are-tantric.html
- why-being-tied-calms-the-nervous-system.html
- smell-and-body-shame.html

**Shadow Library (5):**
- beyond-the-myth-foot-fetish.html
- beyond-the-myth-submission.html
- beyond-the-myth-fetish.html (foundational reframe)
- beyond-the-myth-onlyfans.html
- beyond-the-myth-the-whore-is-power.html

**Orphan / old framework:**
- five-body-technologies.html (uses old framework, orphaned from homepage)

**Total: ~24 substantive articles live.**

---

## Surfaces / pages live

| URL path | Purpose | Status |
|---|---|---|
| `/` (index.html) | Homepage, hero + featured block + article cards | LIVE |
| `/featured.html` | Rotating editorial spotlight (Woman / Fetish / Artist / Photographer) | LIVE (architecture vision) |
| `/gallery.html` | Curated erotic art + photography | LIVE (placeholder) |
| `/directory.html` | Vetted practitioner directory | LIVE |
| `/shop.html` | Books / hypnosis / gear / coaching catalog | LIVE |
| `/test.html` | **The PPT** — Psychosexual Psychological Type Test (3 tiers: Quick 10q / Standard 30q / Deep Dive 100q) | LIVE |
| `/ask.html` | **Ask** — standalone Ask-an-Expert form | LIVE |
| `/match.html` | Honest Fetish Matching vision page | LIVE |
| `/book.html` | Beyond the Myth book funnel | LIVE |
| `/about.html` | About / imprint page | LIVE |

**Nav (all 36 pages):** Articles · Featured · Gallery · Directory · Shop · PPT · Ask · Book · About

---

## Critical infrastructure docs in this repo

1. **`OPERATIONAL_PROTOCOLS.md`** — brand operations manual (Max requested this)
2. **`MATCHING_INFRASTRUCTURE.md`** — full Cloudflare-stack build plan for the matching service (Pages + Workers + D1 + R2 + Queues + Clerk + Stripe), D1 schema, scoring algorithm, vetting workflow, 6 build phases, cost model
3. **`ASK_AN_EXPERT_AUTOMATION.md`** — backend spec for routing test submissions + Ask questions through Cloudflare Worker → D1 → agent_room cron pipeline → editorial calendar
4. **`EDITORIAL_CALENDAR.md`** — ~80 articles in 9 clusters, status notes per article, recommended weekly rotation
5. **`DEPLOY.md`** — deployment notes
6. **`README.md`** — site overview + strategy

---

## What's open / in flight

### Domain wiring (requires Lawrence + DNS)
- Add CNAME records at Cloudflare for `tantraauthority.com` and `www.tantraauthority.com` pointing to `soullight.github.io`
- Same for `tantra-authority.com` if keeping both (or set up Page Rule for redirect)
- Then add `CNAME` file to repo root + configure GitHub Pages custom domain
- HTTPS cert auto-issues

### Backend (Phase 1 of the matching service infrastructure)
- Cloudflare Worker at `api.tantraauthority.com` exposing `/api/test/submit` and `/api/ask/submit`
- D1 database with `test_submissions` and `expert_questions` tables (schema in ASK_AN_EXPERT_AUTOMATION.md)
- Frontend wiring: drop `window.TA_TEST_ENDPOINT` and `window.TA_ASK_ENDPOINT` script tag into test.html + ask.html → existing JS already handles them
- localStorage capture is already happening; nothing is lost while backend builds

### Agent_room integration (Phase 2)
- Cron job on the existing agent_room infrastructure (same machine running Twitter bots + autonomous loop)
- Pulls new submissions from D1 every 6 hours
- Clusters questions by semantic similarity
- Proposes article briefs into `automation/queue/`
- Generates weekly digest for Lawrence via Telegram
- Spec lives in ASK_AN_EXPERT_AUTOMATION.md §"Phase 2"

### Editorial pipeline (ongoing)
- Pick next article from `EDITORIAL_CALENDAR.md` (~70 queued articles remaining)
- Recommended cadence: 1 substantive article per week, rotating Practice → Foundations → Shadow Library
- High-value next candidates: Sound and the Body, Beyond the Myth: Group Sex, The Six Conditions In Practice, Coming Easily and Fast Is Great, Beyond the Myth: Porn

### Featured spread infrastructure
- `featured.html` has the architecture (Woman / Fetish / Artist / Photographer) but no actual spreads built yet
- First Featured Woman shoot + interview not yet commissioned
- Submissions inbox `editorial@tantraauthority.com` not yet wired

### Directory live listings
- `directory.html` exists with vetting standards
- No actual practitioners listed yet
- Vetting workflow not yet operationalized

### Shop catalog
- `shop.html` has product categories
- Most products forthcoming
- Affiliate links not yet placed
- Hypnosis recordings not yet produced

---

## Voice + structural spec (load-bearing for any new writing)

**Article structure** (every standalone article):
```
[header with site nav]
<main>
  <div class="article-meta">
    <span class="pill">CATEGORY · SUBCATEGORY</span>
    <span>X min read</span>
  </div>
  <h1>Title</h1>
  [opening paragraph — names what + why, no preamble]
  <h2>Section heading</h2>
  ... (6-10 sections, 1500-2500 words)
  <h2>The bigger picture</h2>
  [closing editorial paragraph]
  <div class="animal-cta">
    <div class="animal-cta-eyebrow">Invite the Animal In</div>
    <h3 class="animal-cta-headline">[permission-granting line, second-person, wilder register]</h3>
    <p class="animal-cta-intro">[1-2 sentence transition]</p>
    <div class="rabbit-hole">
      [4-8 rabbit-hole-item links]
    </div>
  </div>
</main>
<footer class="site-footer">
  <div>Tantra Authority — published by <a href="https://thenaked.press">The Naked Press</a></div>
</footer>
```

**Voice — never publish:**
- First-person ("I"/"my") except inside quoted reader experience
- Therapy-frame: "honor your journey", "trauma-informed", "hold space"
- New Age: "manifest", "vibration", "high-frequency", "twin flame"
- Substrate-naming: Game 4, Principle 67, OH SHIT shapes
- "Lawrence Daniels" or "Lawrence Gregory" — byline is **Lawrence Lanoff**, locked

**Voice — keep:**
- Em-dashes (stylistic signature)
- Real names (Porges, Levine, Lehmiller, Sagarin, Hardy, Urbaniak, Wiseman, Midori, Ramachandran, Hite, Morin, etc.)
- Real numbers where they exist
- NYC street undercurrent
- The "Invite the Animal In" tonal flip at the close

---

## Brand stack

```
LK Publishing, LLC (parent legal entity)
  └── The Naked Press (publishing imprint, DBA)
        ├── Tantra Authority (lifestyle magazine vertical) ← YOU ARE HERE
        ├── The Naked Mind (Substack — Lawrence's first-person essays)
        └── Beyond the Myth: [Topic] (book series, 7 volumes scaffolded)
```

**Author byline (locked):** Lawrence Lanoff

**Books in the 7-volume series:**
1. Definitive Guide to Modern Tantra (this is the first / primary)
2. Energy Sex
3. Open Relationships (source: `/Users/lawgreg/Documents/💗 RELATIONSHIPS/LAWRENCE_ORB_OPEN_RELATIONSHIP_BLUEPRINT.md`)
4. Male Sexuality
5. Female Sexuality
6. Sexual Shadow
7. Modern Enlightenment

---

## Memory entries added this session (in `~/.claude/projects/-Users-lawgreg-consciousness-agent/memory/`)

All indexed in MEMORY.md. Listed by priority for re-loading:

1. **project_safety_is_the_precondition.md** — the load-bearing pillar
2. **project_onlyfans_real_demand.md** — Max's strategic unlock (integrated-girlfriend insight)
3. **project_whore_as_power.md** — oldest-profession reframe
4. **project_womens_orgasm_shame.md** — the standing "is this normal? am I broken?" territory
5. **project_female_sexuality_reframes.md** — cluster: ease of orgasm, tight vagina, penis-as-vehicle myth, toys, energy cock/pussy, solo primacy
6. **project_sex_as_meditation.md** — function = focus + peace; object variable; sex/porn/vulva-as-mandala all qualify
7. **project_cheating_isnt_real.md** — 4 phenomena bundled under one shame label; ORB framework foundation
8. **project_wheel_of_consent_reframe.md** — Lawrence's read on Betty Martin (over-divides what is single fluid polarity)
9. **project_tantric_match_test.md** — earlier session — the test as lead magnet for matching service
10. **project_test_and_ask_expert_automation.md** — the PPT three-tier architecture + Ask form + data pipeline

---

## Next session pickup checklist

When you start a fresh session, read in this order:

1. `~/.claude/projects/-Users-lawgreg-consciousness-agent/memory/MEMORY.md` (auto-loaded)
2. `/Users/lawgreg/consciousness_agent/LAWRENCE_PILLARS.md`
3. **This file** (`tantra-authority/SESSION_STATE.md`)
4. `tantra-authority/OPERATIONAL_PROTOCOLS.md`
5. `tantra-authority/EDITORIAL_CALENDAR.md` (for what to write next)

Then:
- `cd /Users/lawgreg/consciousness_agent/code/verticals/tantra-authority`
- `git status` (check for parallel-agent changes)
- `git pull` (sync)
- Pick up from "What's open / in flight" above

---

## Quick references

| Need | Location |
|---|---|
| Voice + structural rules | `OPERATIONAL_PROTOCOLS.md` §2-3, §13 |
| Article structure template | `OPERATIONAL_PROTOCOLS.md` §3, also `_template/_layout.html` |
| 80-article backlog | `EDITORIAL_CALENDAR.md` |
| Cloudflare Workers + D1 backend plan | `MATCHING_INFRASTRUCTURE.md` |
| PPT + Ask data flow | `ASK_AN_EXPERT_AUTOMATION.md` |
| Strategic spine (3 load-bearing facts) | `OPERATIONAL_PROTOCOLS.md` §0 |
| Submission inboxes | `OPERATIONAL_PROTOCOLS.md` §15 |
| Crisis response procedures | `OPERATIONAL_PROTOCOLS.md` §11 |
| Definitions of done | `OPERATIONAL_PROTOCOLS.md` §16 |
| ORB blueprint (cheating / open relationships) | `/Users/lawgreg/Documents/💗 RELATIONSHIPS/LAWRENCE_ORB_OPEN_RELATIONSHIP_BLUEPRINT.md` |

---

## Recent commits (last 10)

Run `git log --oneline -20` in this directory for the live picture. As of 2026-05-15:
- PPT branding + Ask on its own page
- Test rebuild: 3 tiers + Ask an Expert + automation spec
- Article: Smell and Body Shame
- Four more: Anal Play, PE Science, Toys Are Tantric, Why Being Tied Calms
- Four articles: You Are Not Broken, The Whore Is Power, Sex as Meditation, Energy Cock + Energy Pussy
- Three articles: Tight Vagina, Cheating Isn't a Thing, Why People Can't Cheat
- Foundation article: Safety Is the Precondition
- Article: The Ease of Orgasm + EDITORIAL_CALENDAR.md
- Submission article + matching service strategic reframe + infra plan
- OPERATIONAL_PROTOCOLS.md — brand operations manual

---

## Parallel agent coordination

A second agent has been working in parallel on this repo (sometimes called the TRAE agent in git author). Patterns observed:
- They sometimes draft articles that overlap with my queue → keep both if voice differs (e.g., *Cheating Isn't a Thing* + *Why People Can't Cheat* are complementary)
- They maintain a separate BACKLOG.md in `queue_authority/` directory
- They handle some directory.html + shop.html catalog work
- Conflicts are rare; both agents `git pull` before editing the same file
- When in doubt about voice on their drafts, normalize structure (animal-cta block) without rewriting body content if voice is on
