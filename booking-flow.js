// Shared durable attempt/receipt across tabs. Browsers without Web Locks fail closed.
(function () {
  // Keep source and the complete originating experiment tuple in the frozen payment attempt.
  window.bookingAttribution = function () {
    const valid=(v,max)=>typeof v==='string' && v.length>0 && v.length<=max && /^[A-Za-z0-9_.:-]+$/.test(v);
    const query=new URLSearchParams(window.location?.search || '');
    const one=(key,max)=>{const values=query.getAll(key);return values.length===1 && valid(values[0],max)?values[0]:'';};
    let stored='';try {stored=window.localStorage.getItem('xpmt_src')||'';} catch {}
    const channel=one('utm_source',40), campaign=one('utm_campaign',70);
    const src=one('src',120) || (channel && campaign ? channel+':'+campaign : channel) || (valid(stored,120)?stored:'');
    const fields=[['xp_vid','xpVid',64],['xp_exp','xpExp',64],['xp_arm','xpArm',32],['xp_prop','xpProp',64]];
    let tuple=Object.fromEntries(fields.map(([key,body,max])=>[body,one(key,max)]));
    if(!fields.every(([,body,max])=>valid(tuple[body],max))) {
      tuple={xpVid:'',xpExp:'',xpArm:'',xpProp:''};
      const tracker=window.xpmt, keys=Object.keys(tracker?.assignments || {});
      if(keys.length===1) {
        const candidate={xpVid:tracker.vid,xpExp:keys[0],xpArm:tracker.assignments[keys[0]],xpProp:tracker.property};
        if(fields.every(([,body,max])=>valid(candidate[body],max))) tuple=candidate;
      }
    }
    let ref='';try {const url=new URL(window.document?.referrer || '');if(url.protocol==='https:')ref=(url.origin+url.pathname).slice(0,300);} catch {}
    return {src,ref,...tuple};
  };
  window.createBookingFlow = function (api, suppliedStorage) {
    let busy = false;
    return {async run({product, email, name, slot, minutes, pay}) {
      if (busy) return {ok:false,error:'busy'};
      busy = true;
      email=email.trim().toLowerCase();
      const key='paid-session-v2:'+product+':'+email;
      try {
        if (!window.navigator?.locks || !window.crypto?.randomUUID) return {ok:false,error:'safe_payment_unavailable'};
        return await window.navigator.locks.request(key,async()=>{
          const storage=suppliedStorage || window.localStorage;
          let receipt=JSON.parse(storage.getItem(key)||'null');
          if (!receipt?.orderId) {
            if (receipt?.uncertain && !receipt.payload) return {ok:false,error:'payment_uncertain'};
            if (!receipt) {
              const available=await fetch(api+'/api/slots'), state=await available.json();
              if(!available.ok || state.ok!==true || !Array.isArray(state.intervals)) return {ok:false,error:'booking_unavailable'};
              const start=Date.parse(slot),end=start+minutes*60000;
              if(!Number.isFinite(start) || state.intervals.some(r=>r.start<end&&r.end>start)) return {ok:false,error:'slot_taken'};
              receipt={attemptId:window.crypto.randomUUID(),attemptSecret:Array.from(window.crypto.getRandomValues(new Uint8Array(32)),v=>v.toString(16).padStart(2,'0')).join(''),uncertain:true};
              storage.setItem(key,JSON.stringify(receipt));
            }
            const freeze=payload=>{
              if(receipt.payload && JSON.stringify(receipt.payload)!==JSON.stringify(payload)) throw Error('changed payment payload');
              receipt.payload=payload;storage.setItem(key,JSON.stringify(receipt));return payload;
            };
            const paid=await pay({attemptId:receipt.attemptId,attemptSecret:receipt.attemptSecret,payload:receipt.payload,slot,freeze});
            if(!paid.ok || !paid.orderId || !paid.accessToken) {
              if(paid.paymentNotAttempted===true || ['card_declined','bad_card_token','bad_email','cancelled_before_charge'].includes(paid.error)) storage.removeItem(key);
              return {ok:false,error:paid.error||'payment_uncertain'};
            }
            receipt={...receipt,orderId:paid.orderId,accessToken:paid.accessToken,uncertain:false};
            storage.setItem(key,JSON.stringify(receipt));
          }
          const response=await fetch(api+'/api/book-session',{method:'POST',headers:{'Content-Type':'application/json'},
            body:JSON.stringify({product,email,name,slot,orderId:receipt.orderId,accessToken:receipt.accessToken})});
          const booking=await response.json();
          if(!response.ok || booking.ok!==true || booking.persisted!==true)
            return {ok:false,error:booking.error||'booking_unavailable',paid:booking.paid===true};
          return booking;
        });
      } catch {return {ok:false,error:'connection_or_storage_failure'};}
      finally {busy=false;}
    }};
  };
  window.bookingFailureMessage = function (result) {
    if(result.error==='busy') return 'Your request is being processed.';
    if(['payment_uncertain','payment_reconciliation_required','payment_attempt_conflict','connection_or_storage_failure','paid_session_required','payment_proof_required','payment_access_expired','payment_refunded'].includes(result.error))
      return 'Please contact soullight@gmail.com to check your payment before trying again.';
    if(result.paid) return 'Your payment is recorded. Choose an available time and try booking again; your payment will be reused.';
    if(result.error==='slot_taken') return 'That time is taken. Please choose another time.';
    if(result.error==='card_declined') return 'Your card was declined. You can try another card.';
    return 'Booking is unavailable right now. Please try again shortly.';
  };
})();
