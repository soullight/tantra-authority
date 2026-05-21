/**
 * Tantra Authority — agent-payments client.
 * Drop into any page that contains an element with [data-agent-unlock="<slug>"].
 * Handles the human-friendly Lightning checkout (invoice QR + polling).
 * The same backend serves agents directly via HTTP 402 (no JS required).
 *
 * Globals (optional):
 *   window.TA_API_BASE       — API origin (default: https://api.tantra-authority.com)
 *   window.TA_ALLOW_SIMULATE — show the "Simulate payment" button for demos
 */
(function () {
  const API_BASE = window.TA_API_BASE || 'https://api.tantra-authority.com';
  const POLL_INTERVAL_MS = 3000;
  const TOKEN_STORE = 'ta_unlock_tokens';

  function getStoredToken(slug) {
    try {
      const map = JSON.parse(localStorage.getItem(TOKEN_STORE) || '{}');
      const entry = map[slug];
      if (entry && entry.expiresAt > Date.now()) return entry.token;
    } catch (_) {}
    return null;
  }

  function storeToken(slug, token, ttlSeconds) {
    try {
      const map = JSON.parse(localStorage.getItem(TOKEN_STORE) || '{}');
      map[slug] = { token, expiresAt: Date.now() + (ttlSeconds || 86400) * 1000 };
      localStorage.setItem(TOKEN_STORE, JSON.stringify(map));
    } catch (_) {}
  }

  async function init() {
    const targets = document.querySelectorAll('[data-agent-unlock]');
    for (const el of targets) {
      const slug = el.getAttribute('data-agent-unlock');
      const token = getStoredToken(slug);
      if (token) {
        try {
          const res = await fetch(`${API_BASE}/api/unlock/${slug}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            renderUnlocked(el, data);
            continue;
          }
        } catch (_) {}
      }
      renderPaywall(el, slug);
    }
  }

  function renderPaywall(el, slug) {
    el.innerHTML = `
      <div class="agent-paywall">
        <div class="agent-paywall-eyebrow">Director's Digest — agent-readable</div>
        <div class="agent-paywall-headline">Unlock the structured version</div>
        <p class="agent-paywall-blurb">
          The free article is published at <a href="../articles/${slug}.html">/articles/${slug}.html</a>.
          What unlocks here is the machine-readable digest — thesis, the three load-bearing reframes, quotable passages,
          and the cross-pollination pointers — the form an AI agent (or a researcher, or a writer) actually wants to work with.
        </p>
        <button class="agent-paywall-button" data-action="start-pay">Unlock — pay with Lightning</button>
        <div class="agent-paywall-tech">
          Agents: this resource is also available via <code>HTTP 402</code> at
          <code>${API_BASE}/api/unlock/${slug}</code>. See
          <a href="/.well-known/agent-services.json"><code>/.well-known/agent-services.json</code></a>.
        </div>
      </div>
    `;
    el.querySelector('[data-action="start-pay"]').addEventListener('click', () => startPayment(el, slug));
  }

  async function startPayment(el, slug) {
    el.innerHTML = `<div class="agent-paywall"><div class="agent-paywall-status">Generating Lightning invoice…</div></div>`;
    let res;
    try { res = await fetch(`${API_BASE}/api/unlock/${slug}`); }
    catch (e) { el.innerHTML = `<div class="agent-paywall">Network error. Try again.</div>`; return; }
    if (res.status !== 402) {
      el.innerHTML = `<div class="agent-paywall">Unexpected response (${res.status}). Try again.</div>`;
      return;
    }
    const data = await res.json();
    const lightning = (data.accepts || []).find(a => a.scheme === 'lightning');
    if (!lightning) {
      el.innerHTML = `<div class="agent-paywall">No Lightning payment method available.</div>`;
      return;
    }
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(lightning.payTo)}`;
    el.innerHTML = `
      <div class="agent-paywall">
        <div class="agent-paywall-eyebrow">Lightning Network — Bitcoin</div>
        <div class="agent-paywall-headline">${data.title}</div>
        <p class="agent-paywall-blurb">${data.description || ''}</p>
        <div class="agent-paywall-invoice">
          <img alt="Lightning invoice QR code" src="${qrUrl}" />
          <div class="agent-paywall-amount"><strong>${lightning.maxAmountRequired}</strong> sats · expires in <span data-countdown>${msToHuman(lightning.expiresAt - Date.now())}</span></div>
          <textarea readonly class="agent-paywall-bolt11">${lightning.payTo}</textarea>
          <div class="agent-paywall-row">
            <button class="agent-paywall-copy" data-copy="${lightning.payTo}">Copy invoice</button>
            ${window.TA_ALLOW_SIMULATE ? `<button class="agent-paywall-simulate" data-action="simulate">Simulate payment (demo)</button>` : ''}
          </div>
        </div>
        <div class="agent-paywall-status" data-status>Waiting for payment…</div>
      </div>
    `;
    const copyBtn = el.querySelector('[data-copy]');
    if (copyBtn) copyBtn.addEventListener('click', () => {
      navigator.clipboard?.writeText(copyBtn.dataset.copy);
      copyBtn.textContent = 'Copied';
      setTimeout(() => { copyBtn.textContent = 'Copy invoice'; }, 1500);
    });
    const simBtn = el.querySelector('[data-action="simulate"]');
    if (simBtn) simBtn.addEventListener('click', async () => {
      simBtn.disabled = true; simBtn.textContent = 'Simulating…';
      try {
        await fetch(`${API_BASE}/api/unlock/${slug}/simulate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId: lightning.paymentId }),
        });
      } catch (_) {}
    });

    const cdEl = el.querySelector('[data-countdown]');
    const cdInterval = setInterval(() => {
      if (!cdEl.isConnected) { clearInterval(cdInterval); return; }
      cdEl.textContent = msToHuman(lightning.expiresAt - Date.now());
    }, 1000);

    pollUntilPaid(el, slug, data.pollUrl, cdInterval);
  }

  async function pollUntilPaid(el, slug, pollUrl, cdInterval) {
    const statusEl = el.querySelector('[data-status]');
    const start = Date.now();
    while (Date.now() - start < 15 * 60 * 1000) {
      await sleep(POLL_INTERVAL_MS);
      let d;
      try { d = await (await fetch(pollUrl)).json(); }
      catch (_) { if (statusEl) statusEl.textContent = 'Network hiccup, retrying…'; continue; }
      if (d.paid) {
        clearInterval(cdInterval);
        if (d.token) storeToken(slug, d.token, d.tokenTtlSeconds);
        renderUnlocked(el, d);
        return;
      }
      if (d.expired) {
        clearInterval(cdInterval);
        statusEl.textContent = 'Invoice expired. Refresh to try again.';
        return;
      }
    }
    clearInterval(cdInterval);
    if (statusEl) statusEl.textContent = 'Timed out waiting for payment.';
  }

  function renderUnlocked(el, data) {
    const contentType = data.contentType || data.content_type || 'text/plain';
    let body;
    if (contentType === 'application/json' && data.content) {
      let parsed; try { parsed = JSON.parse(data.content); } catch { parsed = null; }
      if (parsed) {
        body = renderStructuredDigest(parsed);
      } else {
        body = `<pre class="agent-paywall-raw">${escapeHtml(data.content)}</pre>`;
      }
    } else if (data.content) {
      body = `<div class="agent-paywall-body">${escapeHtml(data.content)}</div>`;
    } else if (data.contentUrl) {
      body = `<p><a class="agent-paywall-link" href="${data.contentUrl}">Access unlocked content →</a></p>`;
    } else {
      body = `<p>Unlocked.</p>`;
    }
    el.innerHTML = `
      <div class="agent-paywall agent-paywall-unlocked">
        <div class="agent-paywall-eyebrow">Unlocked · re-access for 24h</div>
        <div class="agent-paywall-headline">${data.title || ''}</div>
        ${body}
      </div>
    `;
  }

  function renderStructuredDigest(d) {
    const reframes = (d.key_reframes || []).map(r => `
      <li class="ta-reframe">
        <div class="ta-reframe-from"><span>From</span> ${escapeHtml(r.from)}</div>
        <div class="ta-reframe-to"><span>To</span> ${escapeHtml(r.to)}</div>
      </li>
    `).join('');
    const quotes = (d.quotable || []).map(q => `<blockquote class="ta-quote">${escapeHtml(q)}</blockquote>`).join('');
    const related = (d.related_concepts || []).map(c => `<li>${escapeHtml(c.name)}</li>`).join('');
    const uses = (d.agent_use_cases || []).map(u => `<li>${escapeHtml(u)}</li>`).join('');
    return `
      <div class="ta-digest">
        <p class="ta-thesis"><strong>Thesis.</strong> ${escapeHtml(d.thesis || '')}</p>
        <h3>Three reframes</h3>
        <ul class="ta-reframes">${reframes}</ul>
        <p class="ta-structural"><strong>Structural insight.</strong> ${escapeHtml(d.structural_insight || '')}</p>
        <h3>Quotable</h3>
        ${quotes}
        <h3>Related concepts</h3>
        <ul class="ta-related">${related}</ul>
        <h3>Agent use cases</h3>
        <ul class="ta-agent-uses">${uses}</ul>
        <p class="ta-source">Free article: <a href="${escapeHtml(d.primary_article)}">${escapeHtml(d.primary_article)}</a></p>
        <p class="ta-license">${escapeHtml(d.license || '')}</p>
      </div>
    `;
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
  function msToHuman(ms) {
    if (ms <= 0) return 'expired';
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  }
  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
