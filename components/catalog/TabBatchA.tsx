"use client";
import {useEffect,useState} from 'react';
import {PremiumTabs} from './PremiumTabs';
import './TabBatchA.css';

/* ---------- 1. Contact: a small studio's contact page ---------- */

const callDays=[['Tue','25'],['Wed','26'],['Thu','27']];
const callTimes=['10:00','11:30','14:00','16:30'];

function EmailPanel(){
 const [topic,setTopic]=useState('project');const[name,setName]=useState('');const[from,setFrom]=useState('');const[msg,setMsg]=useState('');const[sent,setSent]=useState(false);
 if(sent)return <div className="contact-done" role="status"><b>Message on its way.</b><p>Thanks{name?`, ${name.split(' ')[0]}`:''}. A real person reads every note, usually within one working day.</p><button onClick={()=>{setSent(false);setMsg('');}}>Write another message</button></div>;
 return <form className="contact-form" onSubmit={e=>{e.preventDefault();setSent(true);}}>
  <div className="contact-topic" role="radiogroup" aria-label="What is this about?">
   {[['project','A new project'],['press','Press'],['hello','Just saying hello']].map(([v,l])=><button type="button" role="radio" aria-checked={topic===v} className={topic===v?'is-picked':''} onClick={()=>setTopic(v)} key={v}>{l}</button>)}
  </div>
  <div className="contact-fields">
   <label>Your name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Ananya Rao" required/></label>
   <label>Email<input type="email" value={from} onChange={e=>setFrom(e.target.value)} placeholder="ananya@example.com" required/></label>
  </div>
  <label className="contact-message">Message<textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Tell us what you are making, and when it needs to exist." required/></label>
  <div className="contact-actions"><span>Replies within one working day.</span><button className="contact-send" type="submit">Send message</button></div>
 </form>;
}

function CallPanel(){
 const [day,setDay]=useState(0);const[time,setTime]=useState(-1);const[booked,setBooked]=useState('');
 if(booked)return <div className="contact-done" role="status"><b>Intro call held for you.</b><p>{booked}. We call you, so no waiting on hold. A calendar invite follows by email.</p><button onClick={()=>{setBooked('');setTime(-1);}}>Pick a different time</button></div>;
 return <div className="contact-call">
  <p className="contact-call-intro">Book a twenty minute intro call. We talk through what you need; you decide afterwards.</p>
  <div className="contact-day-row" role="radiogroup" aria-label="Choose a day">
   {callDays.map(([d,n],i)=><button role="radio" aria-checked={day===i} className={day===i?'is-picked':''} onClick={()=>{setDay(i);setTime(-1);}} key={d}><span>{d}</span><b>{n}</b></button>)}
  </div>
  <div className="contact-time-row" role="radiogroup" aria-label="Choose a time">
   {callTimes.map((t,i)=><button role="radio" aria-checked={time===i} className={time===i?'is-picked':''} onClick={()=>setTime(i)} key={t}>{t}</button>)}
  </div>
  <div className="contact-actions"><span>Prefer to call yourself? <b>+91 80 4123 8864</b></span><button className="contact-send" disabled={time<0} onClick={()=>setBooked(`${callDays[day][0]} ${callDays[day][1]} Nov, ${callTimes[time]} IST`)}>Hold this slot</button></div>
 </div>;
}

function VisitPanel(){
 const [directions,setDirections]=useState(false);
 return <div className="contact-visit">
  <div className="contact-map" role="img" aria-label="Illustrated map of the streets around the studio"><i className="map-road r1"/><i className="map-road r2"/><i className="map-road r3"/><i className="map-block b1"/><i className="map-block b2"/><i className="map-block b3"/><span className="map-pin">◉</span></div>
  <div className="contact-visit-info">
   <p><b>Fern &amp; Field Studio</b><br/>14 Lavelle Road, second floor<br/>Bengaluru 560001</p>
   <table><tbody>
    <tr><td>Mon – Fri</td><td>10:00 – 19:00</td></tr>
    <tr><td>Saturday</td><td>11:00 – 16:00</td></tr>
    <tr><td>Sunday</td><td>Closed</td></tr>
   </tbody></table>
   <button className="contact-directions" aria-expanded={directions} onClick={()=>setDirections(v=>!v)}>{directions?'Hide directions':'Show directions'}</button>
   {directions&&<ol className="contact-steps"><li>Metro to MG Road station, exit 3.</li><li>Walk five minutes south on Lavelle Road.</li><li>Look for the green door beside the bookshop.</li></ol>}
  </div>
 </div>;
}

export function ContactFormStudy(){
 const[vertical,setVertical]=useState(false);useEffect(()=>{const media=matchMedia("(min-width:701px)");const update=()=>setVertical(media.matches);update();media.addEventListener("change",update);return()=>media.removeEventListener("change",update)},[]);
 return <section className="taba-study contact-study" aria-label="Contact tabs study">
  <div className="contact-intro">
   <span className="contact-mark">Fern &amp; Field</span>
   <h2>Start a conversation.</h2>
   <p>A two-person studio that answers its own email. No forms into the void, no ticket numbers.</p>
   <small>Currently booking work for January 2027.</small>
  </div>
  <div className="contact-card">
   <PremiumTabs orientation={vertical?"vertical":"horizontal"} label="Ways to reach the studio" items={[
    {id:'email',label:'Email',content:<EmailPanel/>},
    {id:'call',label:'Call',content:<CallPanel/>},
    {id:'visit',label:'Visit',content:<VisitPanel/>},
   ]}/>
  </div>
 </section>;
}

/* ---------- 2. Radio-tag preference builder ---------- */

const prefGroups=[
 {id:'interest',title:'What pulls you?',note:'Pick the one you never get tired of.',options:['Making things','Understanding systems','Telling stories','Working with numbers','Helping people']},
 {id:'skill',title:'Where are you starting from?',note:'Honest answers make better plans.',options:['Just curious','Some practice','Working professionally','Teaching others']},
 {id:'availability',title:'When do you have an hour?',note:'Sessions are short. Consistency beats length.',options:['Early mornings','Lunch hours','Evenings','Weekends']},
];

export function PreferenceBuilderStudy(){
 const [picks,setPicks]=useState<Record<string,number>>({interest:-1,skill:-1,availability:-1});
 const [done,setDone]=useState(false);
 const chosen=prefGroups.every(g=>picks[g.id]>=0);
 return <section className="taba-study prefs-study" aria-label="Preference builder tabs study">
  <header className="prefs-top">
   <div className="prefs-logo">◔ <b>skillpath</b></div>
   <div className="prefs-progress" role="progressbar" aria-label="Setup progress" aria-valuemin={1} aria-valuemax={4} aria-valuenow={2}><span style={{width:'50%'}}/></div>
   <span className="prefs-step">Step 2 of 4</span>
  </header>
  <div className="prefs-body">
   <h2>Shape your first month.</h2>
   <p className="prefs-sub">Three quick choices. You can change all of this later.</p>
   <PremiumTabs label="Preference groups" items={prefGroups.map((g)=>({id:g.id,label:g.id[0].toUpperCase()+g.id.slice(1),badge:picks[g.id]>=0?'✓':undefined,content:
    <div className="prefs-panel">
     <h3>{g.title}</h3>
     <p>{g.note}</p>
     <div className="prefs-tags" role="radiogroup" aria-label={g.title}>
      {g.options.map((o,i)=><button role="radio" aria-checked={picks[g.id]===i} className={picks[g.id]===i?'is-picked':''} onClick={()=>{setPicks(p=>({...p,[g.id]:i}));setDone(false);}} key={o}>{o}</button>)}
     </div>
    </div>}))}/>
  </div>
  <footer className="prefs-foot">
   <div className="prefs-summary">
    {prefGroups.map(g=><span key={g.id} className={picks[g.id]>=0?'is-set':''}><small>{g.id}</small>{picks[g.id]>=0?g.options[picks[g.id]]:'Not picked yet'}</span>)}
   </div>
   {done
    ?<span className="prefs-set" role="status">You are set. Your first plan is being sketched.</span>
    :<button className="prefs-continue" disabled={!chosen} onClick={()=>setDone(true)}>Continue</button>}
  </footer>
 </section>;
}

/* ---------- 3. Photo editor ---------- */

const filterPresets:[string,string][]=[
 ['None','none'],
 ['Mono','grayscale(1) contrast(1.12)'],
 ['Chrome','saturate(1.65) contrast(1.18)'],
 ['Fade','brightness(1.12) saturate(.55)'],
 ['Warm','sepia(.34) saturate(1.35)'],
 ['Noir','grayscale(1) contrast(1.45) brightness(.92)'],
];
const aspects:[string,string][]=[['Original','4 / 3'],['Square','1 / 1'],['Portrait','4 / 5'],['Wide','16 / 9']];

function Scene({style}:{style?:React.CSSProperties}){
 return <div className="photo-scene" style={style} aria-hidden="true">
  <i className="sc-sky"/><i className="sc-sun"/><i className="sc-hill h1"/><i className="sc-hill h2"/><i className="sc-water"/><i className="sc-glint"/>
 </div>;
}

export function PhotoEditorStudy(){
 const [exposure,setExposure]=useState(0);const[contrast,setContrast]=useState(0);const[warmth,setWarmth]=useState(0);const[fade,setFade]=useState(0);
 const [aspect,setAspect]=useState(0);const[angle,setAngle]=useState(0);
 const [preset,setPreset]=useState(0);const[frame,setFrame]=useState(0);
 const adjust=`brightness(${1+exposure/130}) contrast(${1+contrast/110}) sepia(${warmth/220})`;
 const full=`${filterPresets[preset][1]==='none'?'':filterPresets[preset][1]+' '}${adjust}`;
 const reset=()=>{setExposure(0);setContrast(0);setWarmth(0);setFade(0);setPreset(0);setAngle(0);};
 return <section className="taba-study photo-study" aria-label="Photo editor tabs study">
  <div className="photo-top"><span className="photo-dots"><i/><i/><i/></span><b>monsoon-lake.raw</b><span className="photo-zoom">80%<small> ⌕</small></span></div>
  <div className="photo-layout">
   <aside className="photo-rail"><b>▤</b><span>◐</span><span>✂</span><span>✦</span><span>⌗</span><footer>?</footer></aside>
   <div className="photo-canvas-wrap">
    <div className="photo-frame" style={{aspectRatio:aspects[aspect][1]}}>
     <div className="photo-rot" style={{transform:`rotate(${angle}deg) scale(1.12)`}}>
      <Scene style={{filter:full}}/>
      {fade>0&&<i className="photo-fade" style={{opacity:fade/160}}/>}
     </div>
    </div>
    <div className="photo-strip">
     {['s1','s2','s3','s4'].map((s,i)=><button key={s} aria-pressed={frame===i} aria-label={`Select frame ${i+1}`} className={frame===i?'is-picked':''} onClick={()=>setFrame(i)}><Scene style={frame===i?{filter:full}:undefined}/></button>)}
    </div>
   </div>
   <div className="photo-tools">
    <PremiumTabs label="Editing tools" items={[
     {id:'adjust',label:'Adjust',content:<div className="photo-panel">
      {([['Exposure',exposure,setExposure],['Contrast',contrast,setContrast],['Warmth',warmth,setWarmth],['Fade',fade,setFade]] as const).map(([l,v,set])=>
       <label className="photo-slider" key={l}><span>{l}<b>{v>0?`+${v}`:v}</b></span><input type="range" min={l==='Fade'?0:-50} max={l==='Fade'?100:50} value={v} onChange={e=>set(+e.target.value)} aria-label={l}/></label>)}
      <button className="photo-reset" onClick={reset}>Reset everything</button>
     </div>},
     {id:'crop',label:'Crop',content:<div className="photo-panel">
      <div className="photo-aspects" role="radiogroup" aria-label="Aspect ratio">
       {aspects.map(([l,r],i)=><button role="radio" aria-checked={aspect===i} className={aspect===i?'is-picked':''} onClick={()=>setAspect(i)} key={l}><i className="aspect-box" style={{aspectRatio:r}} aria-hidden="true"/>{l}</button>)}
      </div>
      <label className="photo-slider"><span>Straighten<b>{angle>0?`+${angle}`:angle}°</b></span><input type="range" min={-5} max={5} step={0.5} value={angle} onChange={e=>setAngle(+e.target.value)} aria-label="Straighten"/></label>
      <p className="photo-hint">The crop is non-destructive. The original file is never touched.</p>
     </div>},
     {id:'filters',label:'Filters',content:<div className="photo-panel">
      <div className="photo-filters">
       {filterPresets.map(([l,f],i)=><button key={l} aria-pressed={preset===i} className={preset===i?'is-picked':''} onClick={()=>setPreset(i)}><span><Scene style={f==='none'?undefined:{filter:f}}/></span>{l}</button>)}
      </div>
      <p className="photo-hint">Filters stack with your adjustments, so you can keep tuning afterwards.</p>
     </div>},
    ]}/>
   </div>
  </div>
  <div className="photo-status"><span>ISO 200　 ƒ/5.6　 1/250</span><span>{filterPresets[preset][0]==='None'?'No filter':filterPresets[preset][0]} · {aspects[aspect][0]} · Edits are local to this preview</span></div>
 </section>;
}

/* ---------- 4. Checkout: delivery / pickup / digital ---------- */

const checkoutItems=[['Everyday notebook, dot grid ×2','₹640'],['Brass ballpoint pen','₹450'],['Washi tape set','₹210']];
const pickupPoints=[['Indiranagar','12th Main Road','0.8 km','Open until 21:00'],['Koramangala','5th Block, near the park','3.1 km','Open until 20:30'],['Jayanagar','4th T Block complex','5.4 km','Open until 20:00']];

export function CheckoutStudy(){
 const [method,setMethod]=useState('delivery');
 const [addr,setAddr]=useState({name:'Ananya Rao',street:'221, 8th Cross, Domlur',city:'Bengaluru',pin:'560071'});
 const [speed,setSpeed]=useState(0);const[point,setPoint]=useState(0);
 const [demail,setDemail]=useState('ananya@example.com');const[gift,setGift]=useState(false);
 const [reviewed,setReviewed]=useState(false);
 const fee=method==='digital'?0:method==='pickup'?0:speed===1?120:0;
 const total=1300+fee;
 const dirty=()=>setReviewed(false);
 return <section className="taba-study checkout-study" aria-label="Checkout delivery tabs study">
  <div className="checkout-main">
   <div className="checkout-head"><b>◈ papercup</b><span>Checkout · nothing is charged in this preview</span></div>
   <h2>How should it reach you?</h2>
   <PremiumTabs label="Fulfilment method" value={method} onValueChange={v=>{setMethod(v);dirty();}} items={[
    {id:'delivery',label:'Delivery',content:<div className="checkout-panel">
     <h3>Delivery address</h3>
     <div className="checkout-grid">
      <label>Full name<input value={addr.name} onChange={e=>{setAddr({...addr,name:e.target.value});dirty();}}/></label>
      <label>Street and area<input value={addr.street} onChange={e=>{setAddr({...addr,street:e.target.value});dirty();}}/></label>
      <label>City<input value={addr.city} onChange={e=>{setAddr({...addr,city:e.target.value});dirty();}}/></label>
      <label>PIN code<input inputMode="numeric" value={addr.pin} onChange={e=>{setAddr({...addr,pin:e.target.value});dirty();}}/></label>
     </div>
     <h3>Speed</h3>
     <div className="checkout-speed" role="radiogroup" aria-label="Delivery speed">
      <button role="radio" aria-checked={speed===0} className={speed===0?'is-picked':''} onClick={()=>{setSpeed(0);dirty();}}><b>Standard</b><span>4–6 days · Free</span></button>
      <button role="radio" aria-checked={speed===1} className={speed===1?'is-picked':''} onClick={()=>{setSpeed(1);dirty();}}><b>Express</b><span>2 days · ₹120</span></button>
     </div>
    </div>},
    {id:'pickup',label:'Pickup',content:<div className="checkout-panel">
     <h3>Pick a collection point</h3>
     <div className="checkout-points" role="radiogroup" aria-label="Collection points">
      {pickupPoints.map(([n,a,d,h],i)=><button role="radio" aria-checked={point===i} className={point===i?'is-picked':''} onClick={()=>{setPoint(i);dirty();}} key={n}>
       <span className="checkout-radio"/><span className="checkout-point-copy"><b>{n}</b><small>{a}</small></span><span className="checkout-point-meta"><b>{d}</b><small>{h}</small></span>
      </button>)}
     </div>
     <p className="checkout-note">Bring any ID and the order code we email you. Orders are held for five days.</p>
    </div>},
    {id:'digital',label:'Digital',content:<div className="checkout-panel">
     <h3>Email delivery</h3>
     <p className="checkout-note">Printables and templates land in your inbox as soon as the order is reviewed. No shipping, no waiting.</p>
     <label className="checkout-email">Send files to<input type="email" value={demail} onChange={e=>{setDemail(e.target.value);dirty();}}/></label>
     <label className="checkout-gift"><input type="checkbox" checked={gift} onChange={e=>{setGift(e.target.checked);dirty();}}/> This is a gift — send a nice note with the files.</label>
    </div>},
   ]}/>
  </div>
  <aside className="checkout-summary">
   <h3>Order summary</h3>
   <ul>{checkoutItems.map(([n,p])=><li key={n}><span>{n}</span><b>{p}</b></li>)}</ul>
   <div className="checkout-totals">
    <div><span>Subtotal</span><b>₹1,300</b></div>
    <div><span>{method==='delivery'?'Delivery':method==='pickup'?'Pickup':'Email delivery'}</span><b>{fee===0?'Free':'₹'+fee}</b></div>
    <div className="checkout-grand"><span>Total</span><b>₹{total.toLocaleString('en-IN')}</b></div>
   </div>
   {reviewed
    ?<p className="checkout-reviewed" role="status">Reviewed — {method==='delivery'?`arriving by ${speed===1?'Express':'Standard'} post to ${addr.city}`:method==='pickup'?`collecting from ${pickupPoints[point][0]}`:`files go to ${demail||'your email'}`}. No payment is taken in this preview.</p>
    :<button className="checkout-review" onClick={()=>setReviewed(true)}>Review order</button>}
  </aside>
 </section>;
}

/* ---------- 5. Hiring pipeline ---------- */

type Cand={ini:string;name:string;from:string;stage:number;match:number;when:string;note:string};
const stages=['Screening','Portfolio','Interview','Offer'];
const initialCands:Cand[]=[
 {ini:'AR',name:'Arjun Raman',from:'Currently at Loom & Co',stage:2,match:92,when:'2 days ago',note:'Strong systems thinking. Portfolio review went well; the team liked the fintech case study.'},
 {ini:'PK',name:'Priya Krishnan',from:'Freelance, Kochi',stage:1,match:88,when:'3 days ago',note:'Editorial work is excellent. Waiting on the second portfolio piece she promised.'},
 {ini:'DS',name:'Dev Sharma',from:'Currently at Northwind',stage:0,match:81,when:'5 days ago',note:'Good motion sensibility. Resume reads more engineering than design; worth a call.'},
 {ini:'MI',name:'Mira Iyer',from:'Recently at Paperplane',stage:2,match:85,when:'1 week ago',note:'Warm, organised, asks the right questions. Second round scheduled for Friday.'},
];
const interviews=[['25','Nov','Mira Iyer','Portfolio walkthrough','Sana (Design Lead)','Video · 45 min'],['26','Nov','Arjun Raman','Design exercise review','Tom (Head of Product)','Onsite · 90 min'],['28','Nov','Priya Krishnan','Introductory call','Sana (Design Lead)','Video · 30 min']];
const initialOffers=[{name:'Kabir Anand',level:'Senior Product Designer',comp:'₹38 LPA',status:1},{name:'Rhea D’Souza',level:'Product Designer II',comp:'₹26 LPA',status:2},{name:'Aditya Menon',level:'Design Intern',comp:'₹40k / month',status:0}];
const offerStates=['Draft','Sent','Signed'];

export function HiringPipelineStudy(){
 const [cands,setCands]=useState(initialCands);
 const [open,setOpen]=useState(-1);
 const [offers,setOffers]=useState(initialOffers);
 const [confirmed,setConfirmed]=useState<Record<number,boolean>>({});
 const counts=[cands.length,interviews.length,offers.length];
 return <section className="taba-study hiring-study" aria-label="Hiring pipeline tabs study">
  <div className="hiring-top"><b>◧ talentdesk</b><span>⌕ <span>Search people, roles, notes</span></span><i>SK</i></div>
  <div className="hiring-role">
   <div><p>OPEN ROLE</p><h2>Product Designer</h2><span>Bengaluru · Full time · Posted 3 weeks ago</span></div>
   <div className="hiring-stats"><span><b>24</b>in pipeline</span><span><b>6</b>interviews this week</span><span><b>3</b>offers out</span></div>
  </div>
  <PremiumTabs label="Pipeline stage" items={[
   {id:'candidates',label:'Candidates',badge:String(counts[0]),content:<div className="hiring-panel">
    {open<0?<div className="hiring-table">
     <div className="hiring-row hiring-head"><span>Name</span><span>Stage</span><span>Match</span><span>Applied</span></div>
     {cands.map((c,i)=><button className="hiring-row" key={c.name} onClick={()=>setOpen(i)}>
      <span className="hiring-who"><i className={`hiring-ava av-${i}`}>{c.ini}</i><span><b>{c.name}</b><small>{c.from}</small></span></span>
      <span className={`hiring-stage stage-${c.stage}`}>{stages[c.stage]}</span>
      <span className="hiring-match"><svg viewBox="0 0 24 24" aria-hidden="true"><circle className="ring-bg" cx="12" cy="12" r="9"/><circle className="ring-fg" cx="12" cy="12" r="9" style={{'--d':`${(56.5487*c.match/100).toFixed(2)} 56.5487`} as React.CSSProperties}/></svg>{c.match}%</span>
      <span className="hiring-when">{c.when}</span>
     </button>)}
    </div>
    :<div className="hiring-open">
     <button className="hiring-back" onClick={()=>setOpen(-1)}>← All candidates</button>
     <div className="hiring-open-head"><i className={`hiring-ava av-${open}`}>{cands[open].ini}</i><div><h3>{cands[open].name}</h3><span>{cands[open].from} · applied {cands[open].when}</span></div></div>
     <p className="hiring-note">{cands[open].note}</p>
     <div className="hiring-stage-track" aria-label="Current stage">{stages.map((s,i)=><span key={s} className={i<=cands[open].stage?'is-reached':''}>{s}</span>)}</div>
     <button className="hiring-advance" disabled={cands[open].stage>=3} onClick={()=>setCands(cs=>cs.map((c,i)=>i===open?{...c,stage:Math.min(3,c.stage+1)}:c))}>{cands[open].stage>=3?'At final stage':`Move to ${stages[cands[open].stage+1]}`}</button>
    </div>}
   </div>},
   {id:'interviews',label:'Interviews',badge:String(counts[1]),content:<div className="hiring-panel">
    {interviews.map(([d,m,who,what,withWhom,mode],i)=><div className="hiring-iv" key={who}>
     <div className="hiring-date"><b>{d}</b><span>{m}</span></div>
     <div className="hiring-iv-copy"><b>{who}</b><span>{what} · {withWhom}</span></div>
     <span className="hiring-mode">{mode}</span>
     <button className={confirmed[i]?'is-done':''} onClick={()=>setConfirmed(c=>({...c,[i]:!c[i]}))}>{confirmed[i]?'Confirmed ✓':'Confirm'}</button>
    </div>)}
    <p className="hiring-foot-note">Interview kits and scorecards are shared with the panel a day before.</p>
   </div>},
   {id:'offers',label:'Offers',badge:String(counts[2]),content:<div className="hiring-panel">
    <div className="hiring-offers">
     {offers.map((o,i)=><div className="hiring-offer" key={o.name}>
      <div className="hiring-offer-top"><b>{o.name}</b><span>{o.level}</span></div>
      <div className="hiring-offer-comp">{o.comp}</div>
      <div className="hiring-offer-track">{offerStates.map((s,j)=><span key={s} className={j<=o.status?'is-reached':''}>{s}</span>)}</div>
      <button disabled={o.status>=2} onClick={()=>setOffers(os=>os.map((x,j)=>j===i?{...x,status:x.status+1}:x))}>{o.status===0?'Send offer':o.status===1?'Mark as signed':'Signed ✓'}</button>
     </div>)}
    </div>
   </div>},
  ]}/>
 </section>;
}

/* ---------- 6. Travel planner ---------- */

const routeDays=[
 {day:'Day 1',title:'Bengaluru to the coast',stops:[['08:00','Leave home','Fuel up and pick up the good playlist.'],['13:30','Lunch near Hassan','The place with the garden seating, not the highway one.'],['17:00','Check in at Mangaluru','Drop bags, breathe, do nothing for an hour.'],['19:30','Panambur beach walk','Sunset is around 18:45 this time of year.']]},
 {day:'Day 2',title:'Slow morning, old town',stops:[['07:30','Breakfast at the homestay','Neer dosa, apparently famous locally.'],['10:00','St Aloysius chapel','The painted ceiling. About forty minutes is enough.'],['13:00','Seafood lunch','Ask what came in that morning.'],['16:30','Lighthouse Hill','Short climb, big view.']]},
 {day:'Day 3',title:'Udupi day trip',stops:[['09:00','Drive to Udupi','About an hour up the coast.'],['11:00','Temple square and market','Pick up the banana chips everyone mentions.'],['15:00','Malpe beach','Boats to St Mary’s Island if the sea is calm.'],['19:00','Back for dinner','Early night before the drive home.']]},
];
const stays=[['Coconut Grove Homestay','Family-run, 6 rooms','₹3,200','4.7','sk'],['The Cliff House','Sea-facing, breakfast included','₹5,800','4.5','cl'],['Backwater Lodge','Quiet, on the river','₹4,100','4.8','bk']];
const savedPlaces=[['Kudroli temple','Place','2 km from stay'],['Pabbas ice cream','Food','Book the evening slot'],['Surathkal lighthouse','Place','Windy, hold your hat'],['Pilikula artisan village','Day trip','Closed Mondays']];

export function TravelPlannerStudy(){
 const [dayOpen,setDayOpen]=useState(0);const[stopOpen,setStopOpen]=useState(-1);
 const [stay,setStay]=useState(-1);
 const [saved,setSaved]=useState(savedPlaces.map(()=>true));
 const savedCount=saved.filter(Boolean).length;
 return <section className="taba-study travel-study" aria-label="Travel planner tabs study">
  <div className="travel-hero">
   <div className="travel-sky" role="img" aria-label="Illustrated view of a calm sea, a low sun and a distant headland"><i className="tv-sun"/><i className="tv-headland"/><i className="tv-sea"/><i className="tv-boat"/></div>
   <div className="travel-hero-copy">
    <p>WAYMARK · TRIP</p>
    <h2>Coastal Karnataka</h2>
    <span>25 – 29 November · 2 travelers · 1 car</span>
   </div>
  </div>
  <PremiumTabs label="Trip sections" items={[
   {id:'route',label:'Route',content:<div className="travel-route">
    {routeDays.map((d,di)=><div className="travel-day" key={d.day}>
     <button className="travel-day-head" aria-expanded={dayOpen===di} onClick={()=>{setDayOpen(dayOpen===di?-1:di);setStopOpen(-1);}}><span>{d.day}</span><b>{d.title}</b><i>{dayOpen===di?'−':'+'}</i></button>
     {dayOpen===di&&<ol className="travel-stops">
      {d.stops.map(([t,n,note],si)=><li key={t}>
       <button className="travel-stop" aria-expanded={stopOpen===si} onClick={()=>setStopOpen(stopOpen===si?-1:si)}><time>{t}</time><b>{n}</b></button>
       {stopOpen===si&&<p className="travel-note">{note}</p>}
      </li>)}
     </ol>}
    </div>)}
   </div>},
   {id:'stays',label:'Stays',content:<div className="travel-stays">
    {stays.map(([n,d,p,r,k],i)=><div className={`travel-stay ${stay===i?'is-picked':''}`} key={n}>
     <div className={`travel-thumb ${k}`} aria-hidden="true"><i/><b/></div>
     <div className="travel-stay-copy"><b>{n}</b><span>{d}</span><small><i>★</i> {r} · {p} / night</small></div>
     <button aria-pressed={stay===i} onClick={()=>setStay(stay===i?-1:i)}>{stay===i?'Selected ✓':'Select'}</button>
    </div>)}
    <p className="travel-stay-total" role="status">{stay<0?'Pick a stay to see the trip estimate.':`${stays[stay][0]} · about ₹${(parseInt(stays[stay][2].replace(/[₹,]/g,''))*4).toLocaleString('en-IN')} for 4 nights`}</p>
   </div>},
   {id:'saved',label:'Saved',content:<div className="travel-saved">
    {savedCount===0?<p className="travel-empty">Nothing saved. Tap the bookmark on any place and it will wait for you here.</p>
    :<ul>{savedPlaces.map(([n,k,note],i)=>saved[i]&&<li key={n}>
      <span className={`travel-kind k-${i%3}`}>{k==='Place'?'◉':k==='Food'?'♨':'◈'}</span>
      <span className="travel-saved-copy"><b>{n}</b><small>{k} · {note}</small></span>
      <button aria-label={`Remove ${n} from saved`} onClick={()=>setSaved(s=>s.map((v,j)=>j===i?false:v))}>Remove</button>
     </li>)}</ul>}
    <p className="travel-count" role="status">{savedCount} {savedCount===1?'place':'places'} saved for this trip</p>
   </div>},
  ]}/>
 </section>;
}

/* ---------- Compact tab navigations for the Tabs components page ---------- */

export function ContactTabNav(){
 const[vertical,setVertical]=useState(false);useEffect(()=>{const media=matchMedia("(min-width:701px)");const update=()=>setVertical(media.matches);update();media.addEventListener("change",update);return()=>media.removeEventListener("change",update)},[]);
 return <div className="taba-study contact-study taba-nav"><PremiumTabs orientation={vertical?"vertical":"horizontal"} label="Ways to reach the studio" items={[
  {id:'email',label:'Email',content:<p className="taba-nav-panel">Write to the studio. A person replies, usually within a day.</p>},
  {id:'call',label:'Call',content:<p className="taba-nav-panel">Hold a twenty minute intro call. We phone you.</p>},
  {id:'visit',label:'Visit',content:<p className="taba-nav-panel">14 Lavelle Road, Bengaluru. The green door beside the bookshop.</p>},
 ]}/></div>;
}

export function PreferenceTabNav(){
 return <div className="taba-study prefs-study taba-nav"><PremiumTabs label="Preference groups" items={[
  {id:'interest',label:'Interest',content:<p className="taba-nav-panel">Pick the one subject you never get tired of.</p>},
  {id:'skill',label:'Skill',content:<p className="taba-nav-panel">Say where you are starting from. Honest answers help.</p>},
  {id:'availability',label:'Availability',content:<p className="taba-nav-panel">Short sessions. Consistency beats length.</p>},
 ]}/></div>;
}

export function PhotoEditorTabNav(){
 return <div className="taba-study photo-study taba-nav"><PremiumTabs label="Editing tools" items={[
  {id:'adjust',label:'Adjust',content:<p className="taba-nav-panel">Exposure, contrast, warmth and fade, tuned by hand.</p>},
  {id:'crop',label:'Crop',content:<p className="taba-nav-panel">Non-destructive crops. The original is never touched.</p>},
  {id:'filters',label:'Filters',content:<p className="taba-nav-panel">Presets that stack with your own adjustments.</p>},
 ]}/></div>;
}

export function CheckoutTabNav(){
 const [method,setMethod]=useState('delivery');
 return <div className="taba-study checkout-study taba-nav"><PremiumTabs label="Fulfilment method" value={method} onValueChange={setMethod} items={[
  {id:'delivery',label:'Delivery',content:<p className="taba-nav-panel">Standard post in 4–6 days, Express in 2.</p>},
  {id:'pickup',label:'Pickup',content:<p className="taba-nav-panel">Collect from three points across the city.</p>},
  {id:'digital',label:'Digital',content:<p className="taba-nav-panel">Files land in your inbox. No shipping, no waiting.</p>},
 ]}/></div>;
}

export function HiringTabNav(){
 return <div className="taba-study hiring-study taba-nav"><PremiumTabs label="Pipeline stage" items={[
  {id:'candidates',label:'Candidates',badge:'4',content:<p className="taba-nav-panel">Everyone in the running, with stage and match.</p>},
  {id:'interviews',label:'Interviews',badge:'3',content:<p className="taba-nav-panel">This week’s conversations, confirmed in one tap.</p>},
  {id:'offers',label:'Offers',badge:'3',content:<p className="taba-nav-panel">Draft, sent, signed. See where each offer stands.</p>},
 ]}/></div>;
}

export function TravelTabNav(){
 return <div className="taba-study travel-study taba-nav"><PremiumTabs label="Trip sections" items={[
  {id:'route',label:'Route',content:<p className="taba-nav-panel">Day by day, stop by stop, at your own pace.</p>},
  {id:'stays',label:'Stays',content:<p className="taba-nav-panel">Three good beds near the water.</p>},
  {id:'saved',label:'Saved',content:<p className="taba-nav-panel">Everything you bookmarked for later.</p>},
 ]}/></div>;
}

/* ---------- Batch ---------- */

export default function TabBatchA(){
 return <>
  <div className="taba-studies"><ContactFormStudy/><PreferenceBuilderStudy/><PhotoEditorStudy/><CheckoutStudy/><HiringPipelineStudy/><TravelPlannerStudy/></div>
  <div className="taba-navs"><ContactTabNav/><PreferenceTabNav/><PhotoEditorTabNav/><CheckoutTabNav/><HiringTabNav/><TravelTabNav/></div>
 </>;
}
