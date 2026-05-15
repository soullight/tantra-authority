# Ask an Expert + Psychosexual Psychological Test — Automation Spec

The intake → processing → article-pipeline architecture for the test and the expert question form. Designed to route reader submissions into the agent_room infrastructure that already runs the bot ecosystem.

Last updated: 2026-05-15. Status: frontend live, backend pending Phase 1 build.

---

## What's live now (Phase 0)

Both the three-tier Psychosexual Psychological Test and the Ask an Expert form are deployed on `/test.html`:

- **Test data capture:** Every test submission is written to the user's `localStorage` (`ta_test_submissions` array + `ta_test_latest` object). If the page is configured with a `window.TA_TEST_ENDPOINT`, the JSON is also POSTed to that endpoint.
- **Ask an Expert capture:** Every question is written to `localStorage` (`ta_ask_submissions` array). If `window.TA_ASK_ENDPOINT` is configured, JSON is POSTed there. Otherwise, the form falls back to `mailto:editorial@tantraauthority.com` with a pre-filled body — the user's email client opens with the structured submission ready to send.

The localStorage capture means we lose nothing while the backend is being built. Once the backend is live, we can ask returning users to re-submit from their localStorage cache, OR we treat the existing local data as forfeit and start fresh from the backend launch.

---

## Phase 1 — Cloudflare Worker backend (target architecture)

Single Worker exposing two endpoints. Writes to D1. Routes to agent_room via a polling mechanism the existing autonomous-loop infrastructure already runs.

### Endpoints

```
POST https://api.tantraauthority.com/api/test/submit
  body: { timestamp, tier, gender, email, code, axes, internal }
  response: { ok: true, id: <submission_id>, code: <full_code> }

POST https://api.tantraauthority.com/api/ask/submit
  body: { timestamp, name, email, topic, question, publish_consent, follow_up_consent }
  response: { ok: true, id: <submission_id> }
```

Both endpoints:
- Validate email format
- Rate-limit per IP (10/min, 50/hour)
- Sanitize input (HTML strip, length cap)
- Write to D1
- Return a success identifier the frontend can show

### D1 schema

```sql
CREATE TABLE test_submissions (
  id TEXT PRIMARY KEY,
  timestamp INTEGER NOT NULL,
  tier TEXT NOT NULL,           -- quick | standard | deep
  gender TEXT,
  email TEXT NOT NULL,
  code TEXT NOT NULL,            -- the portable compatibility code
  axes_json TEXT NOT NULL,       -- full submission.axes
  internal_json TEXT,            -- WM markers etc (internal only)
  source_ip TEXT,
  user_agent TEXT
);
CREATE INDEX idx_test_email ON test_submissions(email);
CREATE INDEX idx_test_tier ON test_submissions(tier);

CREATE TABLE expert_questions (
  id TEXT PRIMARY KEY,
  timestamp INTEGER NOT NULL,
  name TEXT,
  email TEXT NOT NULL,
  topic TEXT NOT NULL,
  question TEXT NOT NULL,
  publish_consent BOOLEAN DEFAULT 0,
  follow_up_consent BOOLEAN DEFAULT 0,
  status TEXT DEFAULT 'new',     -- new | reviewing | answered | published | archived
  cluster_id TEXT,                -- nullable; populated when clustered with similar questions
  article_id TEXT,                -- nullable; populated when question informs an article
  source_ip TEXT
);
CREATE INDEX idx_q_status ON expert_questions(status);
CREATE INDEX idx_q_topic ON expert_questions(topic);
CREATE INDEX idx_q_cluster ON expert_questions(cluster_id);
```

### Wiring the frontend

Once the Worker is live at `api.tantraauthority.com`, add to `test.html` (before the existing scripts):

```html
<script>
  window.TA_TEST_ENDPOINT = 'https://api.tantraauthority.com/api/test/submit';
  window.TA_ASK_ENDPOINT = 'https://api.tantraauthority.com/api/ask/submit';
</script>
```

The frontend already handles both endpoints gracefully — POSTs with `fetch(...).catch(()=>{})` so a failed endpoint doesn't break the user experience.

---

## Phase 2 — Agent_room processing pipeline

The agent_room infrastructure (the machine running the Twitter bots and the autonomous loop) gets a new cron job: `process_tantra_submissions.py` runs every 6 hours.

### Job behavior

```python
# Pseudocode
def process_tantra_submissions():
    # 1. Pull new submissions from D1 (status='new')
    new_questions = db.query("SELECT * FROM expert_questions WHERE status='new' ORDER BY timestamp ASC LIMIT 100")
    
    # 2. Cluster by semantic similarity
    clusters = cluster_questions(new_questions, model='embedding-3-small')
    
    # 3. For each cluster, identify if it matches an existing editorial calendar item
    for cluster in clusters:
        matching_article = find_in_editorial_calendar(cluster.topic_summary)
        if matching_article and matching_article.status == 'QUEUED':
            # Add this cluster as supporting reader interest signal
            tag_article_with_reader_demand(matching_article, cluster)
        else:
            # New cluster = candidate new article
            propose_article_brief(cluster)
    
    # 4. Generate weekly digest for Lawrence
    if is_weekly_digest_day():
        digest = build_digest(new_questions, clusters)
        send_to_lawrence(digest, channels=['telegram', 'email'])
    
    # 5. Mark processed questions
    db.execute("UPDATE expert_questions SET status='reviewing', cluster_id=? WHERE id IN (?)", ...)
```

### Article generation triggers

A cluster becomes article-ready when:
- 5+ questions cluster around the same topic, OR
- A single question hits a topic Lawrence has flagged as priority, OR
- A cluster aligns with a QUEUED item in the editorial calendar

When triggered:
1. Article brief is generated from cluster (topic, key angles, reader quotes if publish_consent=true)
2. Brief is added to `automation/queue/` in the consciousness_agent repo
3. The Writer agent (already part of agent_room) picks up the brief on its next run
4. Draft is created in `automation/drafts/`
5. QC agent reviews
6. Lawrence reviews via Telegram alert
7. Approved drafts go live on tantra-authority.com

### Lawrence's weekly digest

A digest summarizing the last 7 days' submissions:
- Top 5 topic clusters by submission volume
- 3 most-interesting individual questions (selected by interestingness score)
- New article candidates the pipeline has proposed
- Pending items needing Lawrence's input
- Sent via Telegram (existing infrastructure) + email

---

## Phase 3 — Test data analytics

The test submissions are also load-bearing data:

- **Audience profile mapping.** What does the typical reader of this site actually look like across the 25 axes? Useful for editorial calendar prioritization (write what the audience needs, not what we assume they need).
- **Subgroup identification.** Are certain demographics (gender, openness, world model) systematically over- or under-represented? Where is the funnel leaking?
- **Match-service intake quality.** When the matching service launches, its initial member quality depends on the test having pre-filtered well. The data tells us whether the test discriminates usefully.
- **Article success correlation.** Submissions that follow specific articles' publication — do they cluster around that article's topic? If so, that's evidence the article hit. If they pivot elsewhere, the article opened other questions.

A Python notebook in `automation/analytics/` should run weekly to produce:
- Audience profile snapshot (distribution across each axis)
- Trend deltas (how has the audience shifted over the last 4 weeks)
- Question cluster size distribution
- Article-to-submission correlation

---

## Privacy + ethics

- All emails captured with implicit consent (the user typed them into the form).
- `publish_consent` is opt-in, default off. Articles built from submissions must anonymize unless this is checked.
- `follow_up_consent` is opt-in, default off. Without it, the email is for record only — no outreach.
- Data retention: indefinite for now (the matching-service intake depends on it), reviewable by user via a future delete-my-data endpoint.
- No third-party sharing. The data stays in the Cloudflare account and the agent_room.
- The internal-only `WM` (world model / Games framework) markers are not shared back to the user and are not in the public code. They are for editorial analysis only.

---

## Test code interpretation (public-facing reference)

The code generated by each test is structured to be readable.

**Example Quick code:** `[Q] AR-7 / BG-4 / D-6 / PV-8 / OP-3 / RT-5 / S-7 / DM-4 / V-2 / OPEN-8 / TRY-9`

**Example Standard code:** `[S] AR-7 / BG-4 / D-6 / PV-8 / OP-3 / RT-5 / S-7 / DM-4 / V-2 / SH-FGV / OPEN-8 / TRY-9 / WOC-3`

**Example Deep code:** `[D] AR-7 / BG-4 / D-6 / PV-8 / OP-3 / RT-5 / S-7 / DM-4 / V-2 / SH-FGV / OPEN-8 / TRY-9 / DG-3 / WOC-3 / COM-7 / AC-8 / FREQ-6 / SO-4 / EW-6 / SHP-7 / MRC-5 / SP-OBHT`

Each segment is `<axis>-<value 0-9>` or `<axis>-<multi-select string>`.

The matching service uses these codes as input to its pairwise scoring algorithm. Reading the code:
- High AR (8-9) = strongly receptive. Low AR (0-1) = strongly active. 4-5 = balanced / switch.
- Same shape applies to BG, D, etc.
- SH-string = letters indicating selected shadow appetites (F=Feet, G=Group, V=Voyeur/Exhib, A=Anal, R=Restraint, P=Public, X=Pain, L=Role-play, D=Daddy/Mommy, C=Cuck/Share)
- SP-string = letters indicating solo practice elements (O=Orgasm, B=Breath, M=Meditation, F=Fantasy, H=Hypnosis, T=Toys, K=Solo Kink, N=None)

A future `/code-decoder.html` page should explain this to users who want to interpret their own code.

---

## Pointers

- Frontend: `tantra-authority/test.html` (the live test + Ask an Expert form)
- Matching infrastructure overall: `tantra-authority/MATCHING_INFRASTRUCTURE.md`
- Operational protocols: `tantra-authority/OPERATIONAL_PROTOCOLS.md`
- Memory reference: `~/.claude/projects/-Users-lawgreg-consciousness-agent/memory/project_test_and_ask_expert_automation.md`
- Strategic spine: `LAWRENCE_PILLARS.md` + `MEMORY.md`
