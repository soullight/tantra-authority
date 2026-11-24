/* ta-track.js v1 (2026-11-24): first-party funnel events for tantra-authority.com.
   Sends small anonymous events to the xpmt collector (no cookies, no PII, no emails).
   Events: view, cta_click, optin_submit, optin_ok, optin_fail, checkout_view,
   pay_click, pay_msg (checkout status/error text), purchase_ok, js_error. */
(function(){
  try{
    var EP='https://xpmt.soullight.workers.dev/e', P='tantra-authority';
    var ls=window.localStorage, ss=window.sessionStorage;
    function rid(){return (Date.now().toString(36)+Math.random().toString(36).slice(2,10));}
    var v=ls.getItem('ta_vid'); if(!v){v=rid(); ls.setItem('ta_vid',v);}
    var s=ss.getItem('ta_sid'); if(!s){s=rid(); ss.setItem('ta_sid',s);}
    var qs=new URLSearchParams(location.search);
    var src=(qs.get('src')||qs.get('utm_source')||ss.getItem('ta_src')||'').slice(0,120);
    if(src) ss.setItem('ta_src',src);
    var ref=(document.referrer||'').slice(0,300);
    function send(t,extra,val){
      try{
        var body=JSON.stringify({v:v,s:s,p:P,ref:ref,src:src,e:[{t:t,x:extra?String(extra).slice(0,64):null,u:(location.pathname+location.search).slice(0,300),val:typeof val==='number'?val:null,ts:Date.now()}]});
        fetch(EP,{method:'POST',headers:{'Content-Type':'text/plain'},body:body,keepalive:true,mode:'cors'}).catch(function(){});
      }catch(_){}
    }
    window.taTrack=send;
    send('view');
    document.addEventListener('click',function(e){
      var a=e.target&&e.target.closest?e.target.closest('a[href]'):null;
      if(!a) return;
      var h=a.getAttribute('href')||'';
      if(/checkout/.test(h)){ var m=h.match(/product=([\w-]+)/); send('cta_click',m?m[1]:h.slice(0,60)); }
      else if(/\.pdf(\?|$)/.test(h)){ send('pdf_click',h.split('/').pop().slice(0,60)); }
    },true);
    document.addEventListener('submit',function(e){
      var f=e.target; if(!f||!f.querySelector) return;
      if(f.querySelector('input[type=email]')) send('optin_submit',(f.querySelector('input[name=source]')||{}).value||'');
    },true);
    // opt-in result: watch .msg boxes for the success / failure text the page already shows
    document.querySelectorAll('.msg').forEach(function(m){
      new MutationObserver(function(){
        var t=(m.textContent||'').trim(); if(!t) return;
        if(/you.re in/i.test(t)) send('optin_ok'); else if(/sorry|error|invalid/i.test(t)) send('optin_fail',t.slice(0,60));
      }).observe(m,{childList:true,subtree:true,characterData:true});
    });
    // checkout page hooks
    if(/checkout/.test(location.pathname)){
      send('checkout_view',qs.get('product')||'');
      var go=document.getElementById('go');
      if(go) go.addEventListener('click',function(){send('pay_click',qs.get('product')||'');},true);
      var msg=document.getElementById('msg'), done=document.getElementById('done'), last='';
      if(msg) new MutationObserver(function(){var t=(msg.textContent||'').trim(); if(t&&t!==last){last=t; send('pay_msg',t.slice(0,64));}}).observe(msg,{childList:true,subtree:true,characterData:true});
      if(done) new MutationObserver(function(){ if(done.style.display!=='none') send('purchase_ok',qs.get('product')||''); }).observe(done,{attributes:true,attributeFilter:['style'],childList:true});
    }
    window.addEventListener('error',function(e){ send('js_error',((e&&e.message)||'').slice(0,64)); });
  }catch(_){}
})();
