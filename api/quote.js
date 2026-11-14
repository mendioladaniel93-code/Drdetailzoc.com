module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
  const data = req.body || {};
  if (data.website) return res.status(200).json({ok:true});
  const fields=['name','email','phone','vehicle','size','service','date','time','city'];
  if(fields.some(k=>typeof data[k]!=='string'||!data[k].trim()))return res.status(400).json({error:'Please complete all required fields.'});
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)||fields.some(k=>data[k].length>300)||String(data.details||'').length>1500)return res.status(400).json({error:'Please check your information.'});
  if(!process.env.RESEND_API_KEY||!process.env.QUOTE_FROM_EMAIL)return res.status(503).json({error:'Quote notifications are not configured yet.'});
  const clean = v=>String(v||'').replace(/[<>]/g,'').slice(0,1500);
  const lines=[...fields,'details'].map(k=>`${k}: ${clean(data[k])}`);
  try {
    const mail=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:process.env.QUOTE_FROM_EMAIL,to:['drdetailzoc@gmail.com'],reply_to:clean(data.email),subject:'New DR DETAILZ quote request',text:lines.join('\n')})});
    if(!mail.ok){console.error('Email provider rejected request',mail.status);return res.status(502).json({error:'Unable to deliver your request. Please call us.'})}
    // Optional SMS alert; email delivery remains the required success criterion.
    if(process.env.TWILIO_ACCOUNT_SID&&process.env.TWILIO_AUTH_TOKEN&&process.env.TWILIO_FROM_NUMBER){
      try{const auth=Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');const params=new URLSearchParams({To:'+17148555030',From:process.env.TWILIO_FROM_NUMBER,Body:`DR DETAILZ quote: ${clean(data.name)} - ${clean(data.service)} - ${clean(data.phone)}`});const sms=await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,{method:'POST',headers:{Authorization:`Basic ${auth}`,'Content-Type':'application/x-www-form-urlencoded'},body:params});if(!sms.ok)console.error('SMS notification failed',sms.status)}catch(e){console.error('SMS notification unavailable')}
    }
    return res.status(200).json({ok:true});
  }catch(e){console.error('Quote delivery unavailable');return res.status(502).json({error:'Unable to send right now. Please call us.'})}
};
