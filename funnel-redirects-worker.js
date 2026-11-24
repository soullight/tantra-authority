/**
 * 301 old tantra-authority.com funnel URLs to the fixed v2/v3/v4 copies.
 * Query strings (product, src, h, utm_*) are preserved.
 * Old files stay in the repo; rollback is a git revert plus removing
 * the Worker routes and (optionally) setting the apex/www CNAMEs back to DNS-only.
 */
const REDIRECTS = {
  "/what-is-tantra": "/what-is-tantra-v2/",
  "/what-is-tantra/": "/what-is-tantra-v2/",
  "/pleasure-mindset.html": "/pleasure-mindset-v2.html",
  "/yt/kiss": "/yt/kiss-v3/",
  "/yt/kiss/": "/yt/kiss-v3/",
  "/yt/energy-sex": "/yt/energy-sex-v3/",
  "/yt/energy-sex/": "/yt/energy-sex-v3/",
  "/yt/yoni": "/yt/yoni-v4/",
  "/yt/yoni/": "/yt/yoni-v4/",
  "/yt/yoni-v2": "/yt/yoni-v4/",
  "/yt/yoni-v2/": "/yt/yoni-v4/",
  "/yt/g-spot": "/yt/g-spot-v4/",
  "/yt/g-spot/": "/yt/g-spot-v4/",
  "/yt/g-spot-v2": "/yt/g-spot-v4/",
  "/yt/g-spot-v2/": "/yt/g-spot-v4/",
  "/yt/beginners": "/yt/beginners-v3/",
  "/yt/beginners/": "/yt/beginners-v3/",
  "/start-here.html": "/start-here-v2.html",
  "/checkout.html": "/checkout-v3.html",
  "/book.html": "/book-v4.html",
  "/thank-you.html": "/thank-you-v2.html",
  "/test.html": "/test-v2.html",
  "/men.html": "/men-v2.html",
  "/tantra-for-women.html": "/tantra-for-women-v2.html",
  "/hard-alone.html": "/hard-alone-v2.html",
  "/get-out-of-your-head.html": "/get-out-of-your-head-v2.html",
  "/awaken-sexually.html": "/awaken-sexually-v2.html",
  "/pleasure-mindset-book.html": "/pleasure-mindset-book-v2.html",
  "/psychological-clitorectomy.html": "/psychological-clitorectomy-v2.html",
  "/reading-unlimited-30d.html": "/reading-unlimited-30d-v2.html",
  "/work-with-lawrence.html": "/work-with-lawrence-v2.html",
  "/index.html": "/v4/",
  "/": "/v4/",
  "/yt/yoni/index.html": "/yt/yoni-v4/",
  "/yt/yoni-v2/index.html": "/yt/yoni-v4/",
  "/yt/yoni-v3": "/yt/yoni-v4/",
  "/yt/yoni-v3/": "/yt/yoni-v4/",
  "/yt/yoni-v3/index.html": "/yt/yoni-v4/",
  "/yt/g-spot/index.html": "/yt/g-spot-v4/",
  "/yt/g-spot-v2/index.html": "/yt/g-spot-v4/",
  "/yt/g-spot-v3": "/yt/g-spot-v4/",
  "/yt/g-spot-v3/": "/yt/g-spot-v4/",
  "/yt/g-spot-v3/index.html": "/yt/g-spot-v4/",
  "/yt/kiss/index.html": "/yt/kiss-v3/",
  "/yt/kiss-v2": "/yt/kiss-v3/",
  "/yt/kiss-v2/": "/yt/kiss-v3/",
  "/yt/kiss-v2/index.html": "/yt/kiss-v3/",
  "/yt/energy-sex/index.html": "/yt/energy-sex-v3/",
  "/yt/energy-sex-v2": "/yt/energy-sex-v3/",
  "/yt/energy-sex-v2/": "/yt/energy-sex-v3/",
  "/yt/energy-sex-v2/index.html": "/yt/energy-sex-v3/",
  "/yt/beginners/index.html": "/yt/beginners-v3/",
  "/yt/beginners-v2": "/yt/beginners-v3/",
  "/yt/beginners-v2/": "/yt/beginners-v3/",
  "/yt/beginners-v2/index.html": "/yt/beginners-v3/",
  "/checkout-v2.html": "/checkout-v3.html",
};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const dest = REDIRECTS[url.pathname];
    if (dest) {
      return new Response(null, {
        status: 301,
        headers: { Location: dest + url.search },
      });
    }
    // Fallback if a broader route is ever attached: send the request to
    // GitHub Pages without looping back through this Worker.
    return fetch(request, { cf: { resolveOverride: "soullight.github.io" } });
  },
};
