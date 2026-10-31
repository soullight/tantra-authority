/* funnel-fixes v1 (2026-10-30): GA4 funnel events for homepage, access.html, checkout.html.
   Events: ta_view (every page), cta_click (any [data-ev] link/button), begin_checkout (checkout.html load).
   Uses the existing GA4 property; dataLayer is shared with GTM-WTXBXKTS. */
(function(){
  var GA4_ID = "G-BH9J7R357H";
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  if (!document.querySelector('script[src*="gtag/js?id=' + GA4_ID + '"]')) {
    var s = document.createElement("script"); s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA4_ID;
    document.head.appendChild(s);
    window.gtag("js", new Date());
    window.gtag("config", GA4_ID);
  }
  var qs = new URLSearchParams(location.search);
  var page = location.pathname.replace(/\/index\.html$/, "/") || "/";
  var src = (qs.get("src") || qs.get("utm_source") || "direct").slice(0, 100);
  window.gtag("event", "ta_view", {page_path: page, src: src});
  if (/checkout\.html$/.test(page)) {
    var pid = (qs.get("product") || "").slice(0, 64);
    window.gtag("event", "begin_checkout", {items: [{item_id: pid}], src: src});
  }
  document.addEventListener("click", function(e){
    var el = e.target.closest && e.target.closest("[data-ev]");
    if (!el) return;
    window.gtag("event", "cta_click", {cta: el.getAttribute("data-ev"), page_path: page, link_url: el.href || "", transport_type: "beacon"});
  }, true);
})();
