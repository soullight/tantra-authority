# Tantra Authority

The first vertical site in the 100-fishing-lines portfolio. Built 2026-05-14 (Japan) as the per-vertical template prototype.

**Live target:** `tantraauthority.com` (owned by Lawrence, Cloudflare DNS)
**Backup domain:** `tantra-authority.com` (redirect → primary)
**Deploy via:** Cloudflare Pages (see `DEPLOY.md`)

---

## What this site is

Tantra Authority is the **practical, SEO-friendly, educational** front door to Lawrence Lanoff's tantra body of work. It is NOT the personal Substack. It is the authoritative, depersonalized destination for people who type "what is tantra" or "tantric breathing exercises" into Google.

**Persona:** The Tantra Authority Editors. Bylineless in most cases. Calm, authoritative, anti-bullshit, body-grounded.

**NOT this voice:**
- Not the punk-philosophical Naked Mind voice
- Not Lawrence speaking in first-person about his own life (most articles)
- Not edgy / Tantra Rebel voice
- Not certificate-program / weekend-mill / cult-recruiting voice
- Not Sanskrit-heavy / mystically-decorated

**IS this voice:**
- Educational. Patient. Confident.
- Stripped of mythology while honoring the practices
- Physiologically grounded ("here's what's actually happening in your body")
- Anti-fake-guru, anti-cult (explicitly) — but PRO real teachers, real workshops, real coaching, real commerce
- Generally written in third person about the field
- Funnels to *Beyond the Myth: The Definitive Guide to Modern Tantra* + The Naked Mind newsletter + the vetted practitioner directory + the shop

## Anti-fake-guru, NOT anti-money (course-correction 2026-05-15)

Earlier drafts had a tone that read as anti-workshop and anti-commerce categorically. **This is wrong and load-bearing to fix.** The actual editorial stance:

| We DO | We DON'T |
|---|---|
| Sell books (royalty, KDP, audiobook) | Sell weekend certification programs |
| Run occasional retreats — the kind that's meditating, cooking, laughing, real practice, not certification-mills | Run cult-style "level two" / "level three" upsell tracks |
| Offer high-end coaching (1:1, small group, expensive, no scale games) | Run paid private communities you must keep paying to stay inside |
| List vouched-for practitioners — tantra teachers, somatic guides, breathwork facilitators, erotic-hypnosis self-practice coaches — with full transparency about their lineage, training, and any cult/guru affiliations | List sex workers / escorts / transactional intimate services (FOSTA/regulatory complexity not worth the risk); hide a practitioner's training history; whitewash their teacher's record |
| Sell products — books, ethical sex toys (affiliate), print-on-demand (Etsy/Shopify), supplements where evidence supports them | Sell mystified products with manufactured spiritual claims |
| Affiliate to credible adult-industry, wellness, and bookseller links | Affiliate to MLM-style spiritual product schemes |
| Acknowledge that a good workshop is an accelerant, that real teachers exist, that paying for structure is sometimes the right move | Pretend everything has to be solo, free, and self-directed |
| Charge what the work is worth | Apologize for charging |

**The editorial integrity check is this:** would the reader, after engaging with what we offer, feel served — or feel recruited? If the answer is "served," it's on-brand. If "recruited," it's not.

The framework's enemy is the guru-as-authority pattern, the cult-of-personality pattern, the workshop-as-conversion-funnel pattern, the certificate-as-status pattern. The framework's enemy is NOT money, NOT teachers, NOT structure. Money is energy. Teachers are useful. Structure helps people show up. The framework runs through all of it.

## Editorial closing structure: "Invite the animal in"

Every Tantra Authority article ends with a specific closing structure, in this order:

1. **The teaching close** — the article's last sober editorial paragraph, lands the framework.
2. **`<hr>` separator.**
3. **"And now — invite the animal in"** section heading. The tone flips from sober-editor to wild-erotic-alive. 2–3 paragraphs. The "now do it" beat. Always pointing the reader at shadow / wildness / eros / the body that wants more / ritual / the unconscious. The opposite of the article's earlier register. This is where the reader gets the permission to take the framework into their own body.
4. **Rabbit-holes block** — `<div class="rabbit-holes">` with 5–8 related-article links. Mix of in-site articles (linked) and forthcoming articles (italicized, marked "(forthcoming)") to seed demand. Topics that recur: shadow, erotic hypnosis, the symbolic body, ritual, the voice, the slow practice, the workshop question, lineage transparency, the unconscious, the directory, ancient practices vs neo-tantra, the AI safe-space conversations.
5. **Cross-link to substack** — a `<p><em>` block pointing to The Naked Mind for the first-person personal-essay version of the territory.
6. **`<div class="cta-card">`** — standard book promo.

This structure does multiple jobs at once: closes the article with energy not pedantry; opens the rabbit hole that keeps the reader on the site; seeds demand for future articles by listing them as forthcoming; funnels to substack and book.

**Rabbit hole topics to seed in every article (rotate freely):**
- The Shadow That Wants More
- Erotic Hypnosis (working with the suggestible mind without lying to it)
- The Symbolic Body / When Sex Starts Speaking in Pictures
- Ritual Without Religion / Building containers that don't ask you to believe anything
- The Voice You've Been Suppressing / Why Adults Can't Make Noise
- Ancient Practices vs Neo-Tantra (what got dropped, what got kept, what got invented)
- After the Workshop / What to do when the retreat ends and the work begins
- The Vetted Practitioner Directory (when listed: a tease + link)
- The Unconscious as Tantric Substrate
- Power, Owning the Selves, the Erotic Imagination
- Tantric Photography / Tantric Art / Tantric Hypnosis as legitimate sub-disciplines
- AI Tantric Playmates / Synthetic Eros and What It Reveals About the Real Thing

Articles can also cross-link to: the shop, the directory listings, specific books in the Beyond the Myth series.

## Funnel architecture

```
Google search → Tantra Authority article →
  email signup (Substack form) →
  drip into The Naked Mind →
  preorder Beyond the Myth: Definitive Guide to Modern Tantra
```

Every article ends with the same CTA card pointing to the book. Inline newsletter signup on homepage and article pages.

## Content strategy

**Target: 30 articles in first 90 days.** Mix of:
- Foundations articles (what tantra is, the five primitives, brief history)
- Practice articles (specific techniques readers can do tonight)
- Reframe articles (what tantra is NOT — why most tantric content fails)
- Couples articles (partner practices, communication, conflict + tantra)
- Anti-cult articles (the dark side of the tantra teacher industry — high search interest)

After 30 articles, the long tail of SEO traffic should be enough that the site self-sustains traffic. Then we focus on:
- Featured articles (longer-form, ranking for high-volume queries)
- Book preorder conversion
- Email list growth

## Seeded articles (built 2026-05-14)

- `articles/what-tantra-actually-is.html` — foundational, ~2200 words
- `articles/tantric-breathing-truth.html` — practical, ~1500 words

Both end with the standard CTA + book funnel.

## Open / pending

- [ ] Connect newsletter forms to Substack (or ConvertKit / Buttondown — see DEPLOY.md)
- [ ] Add the remaining 3 articles previewed on the homepage:
  - `articles/why-most-tantric-sex-doesnt-work.html`
  - `articles/five-body-technologies.html`
  - `articles/tantric-practices-for-couples.html`
- [ ] Deploy to Cloudflare Pages (see DEPLOY.md)
- [ ] Set up custom domain (tantraauthority.com)
- [ ] Set up redirect from tantra-authority.com
- [ ] Add Cloudflare Web Analytics
- [ ] Replicate template structure for next vertical (suggest: open-relationship-blueprint)

## Notes

Built as plain static HTML (no build step) for maximum speed-to-ship and zero dependency hell. When article count exceeds ~30 or content needs more structure (categories, tags, search), consider migrating to Astro or 11ty. Not urgent.
