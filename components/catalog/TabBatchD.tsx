"use client";
import {useRef,useState,type KeyboardEvent as ReactKeyboardEvent,type ReactNode,type CSSProperties} from 'react';
import {PremiumTabs} from './PremiumTabs';
import './TabBatchD.css';

/* ---------- 1. Weather: Skylight ---------- */

type WIcon='sun'|'cloud'|'suncloud'|'rain'|'drizzle';
function WeatherGlyph({kind,className}:{kind:WIcon;className?:string}){
 const sun=<circle cx="12" cy="12" r="4.4" fill="currentColor"/>;
 const rays=<g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">{[0,45,90,135,180,225,270,315].map(a=><line key={a} x1="12" y1="4.6" x2="12" y2="7" transform={`rotate(${a} 12 12)`}/>)}</g>;
 const cloud=<path d="M7 18.5h10.2a3.8 3.8 0 0 0 .7-7.5 5.6 5.6 0 0 0-11-1.2A4.3 4.3 0 0 0 7 18.5Z" fill="currentColor"/>;
 return <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
  {kind==='sun'&&<>{rays}{sun}</>}
  {kind==='cloud'&&cloud}
  {kind==='suncloud'&&<><g transform="translate(3.5 1.5) scale(.62)">{rays}{sun}</g><g transform="translate(2 6)">{cloud}</g></>}
  {(kind==='rain'||kind==='drizzle')&&<><g transform="translate(0 -1)">{cloud}</g><g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">{[8,12,16].map(x=><line key={x} x1={x} y1="19.4" x2={x-1.2} y2={kind==='rain'?'22.4':'21.4'}/>)}</g></>}
 </svg>;
}
const hourly:[string,number,WIcon,number][]=[['Now',24,'suncloud',5],['1 PM',26,'sun',0],['2 PM',27,'sun',0],['3 PM',27,'suncloud',5],['4 PM',26,'suncloud',10],['5 PM',25,'cloud',15],['6 PM',24,'cloud',20],['7 PM',23,'drizzle',35],['8 PM',22,'rain',55],['9 PM',22,'rain',60],['10 PM',21,'drizzle',40],['11 PM',21,'cloud',20]];
const week:[string,WIcon,number,number,number][]=[['Today','suncloud',21,27,10],['Tue','sun',20,28,0],['Wed','suncloud',21,29,5],['Thu','rain',22,26,65],['Fri','rain',21,25,70],['Sat','drizzle',20,26,45],['Sun','suncloud',20,28,15]];
function SkyScene(){return <svg className="tbd-wx-scene" viewBox="0 0 640 190" preserveAspectRatio="none" role="img" aria-label="Illustrated sky: low sun, two drifting clouds and tree-lined rooftops">
 <defs><linearGradient id="tbdSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#bfe0f6"/><stop offset="1" stopColor="#e9f4fc"/></linearGradient></defs>
 <rect width="640" height="190" fill="url(#tbdSky)"/>
 <circle cx="502" cy="58" r="30" fill="#ffdf8e"/><circle cx="502" cy="58" r="44" fill="#ffdf8e" opacity=".28"/>
 <g className="tbd-wx-cloud-a" fill="#fff" opacity=".95"><ellipse cx="150" cy="56" rx="44" ry="16"/><ellipse cx="182" cy="48" rx="30" ry="14"/><ellipse cx="120" cy="50" rx="24" ry="11"/></g>
 <g className="tbd-wx-cloud-b" fill="#f4fafd" opacity=".9"><ellipse cx="360" cy="88" rx="34" ry="12"/><ellipse cx="384" cy="82" rx="22" ry="10"/></g>
 <path d="M0 158 Q80 138 160 152 T340 150 T640 146 V190 H0 Z" fill="#9db98a"/>
 <path d="M0 170 Q110 154 230 166 T470 164 T640 162 V190 H0 Z" fill="#7d9c6d"/>
 <g fill="#5d7f52"><rect x="66" y="132" width="6" height="26" rx="2"/><circle cx="69" cy="128" r="16"/><rect x="556" y="126" width="6" height="30" rx="2"/><circle cx="559" cy="121" r="19"/></g>
 <g fill="#6f8a60"><rect x="262" y="140" width="52" height="34" rx="3"/><path d="M256 142 288 122 320 142 Z"/></g>
</svg>}
function TodayPanel({unit}:{unit:'C'|'F'}){
 const t=(v:number)=>unit==='C'?`${v}°`:`${Math.round(v*9/5+32)}°`;
 const stats:[string,string,string][]=[['Wind','11 km/h','From the south-west'],['Humidity','64%','Comfortable'],['UV index','5','Moderate until 4 PM'],['Feels like',t(26),'Humidity is making it warmer']];
 return <div className="tbd-wx-today">
  <div className="tbd-wx-stats">{stats.map(([k,v,s])=><div className="tbd-wx-stat" key={k}><span>{k}</span><b>{v}</b><small>{s}</small></div>)}</div>
  <div className="tbd-wx-sun"><div className="tbd-wx-sun-head"><b>Sunrise & sunset</b><span>Day length 11 h 38 min</span></div>
   <svg viewBox="0 0 300 96" role="img" aria-label="Sun path arc: sunrise 6:12 AM, sunset 5:50 PM, current position mid afternoon">
    <path d="M20 84 A130 78 0 0 1 280 84" fill="none" stroke="#d7e5ef" strokeWidth="2" strokeDasharray="4 5"/>
    <path d="M20 84 A130 78 0 0 1 196 28" fill="none" stroke="#f0b64c" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="196" cy="28" r="7" fill="#f0b64c"/><circle cx="196" cy="28" r="11" fill="#f0b64c" opacity=".25"/>
    <line x1="8" y1="84" x2="292" y2="84" stroke="#d7e5ef" strokeWidth="2"/>
    <text x="20" y="95" textAnchor="middle">6:12 AM</text><text x="280" y="95" textAnchor="middle">5:50 PM</text>
   </svg>
  </div>
 </div>;
}
function HourlyPanel({unit}:{unit:'C'|'F'}){
 const t=(v:number)=>unit==='C'?`${v}°`:`${Math.round(v*9/5+32)}°`;
 const pts=hourly.map(([,temp],i)=>`${i*(600/(hourly.length-1))},${46-(temp-20)*4.4}`).join(' ');
 return <div className="tbd-wx-hourly">
  <div className="tbd-wx-strip">{hourly.map(([time,temp,icon,rain],i)=><div className={`tbd-wx-hour ${i===0?'tbd-now':''}`} key={time}><span>{time}</span><WeatherGlyph kind={icon}/><b>{t(temp)}</b><small className={rain>0?'tbd-rain':''}>{rain>0?`${rain}%`:'—'}</small></div>)}</div>
  <svg className="tbd-wx-curve" viewBox="0 0 600 56" preserveAspectRatio="none" role="img" aria-label="Temperature curve peaking at 27 degrees around 2 PM and easing to 21 by 11 PM"><defs><linearGradient id="tbdCurveFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3e7cb1" stopOpacity=".22"/><stop offset="1" stopColor="#3e7cb1" stopOpacity="0"/></linearGradient></defs><polygon points={`0,56 ${pts} 600,56`} fill="url(#tbdCurveFill)"/><polyline points={pts} fill="none" stroke="#3e7cb1" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/></svg>
  <p className="tbd-wx-note">Rain likely after 7 PM. The evening cools to {t(21)} with a fresh breeze.</p>
 </div>;
}
function WeekPanel({unit}:{unit:'C'|'F'}){
 const t=(v:number)=>unit==='C'?`${v}°`:`${Math.round(v*9/5+32)}°`;
 return <div className="tbd-wx-week">{week.map(([day,icon,lo,hi,rain])=>{const left=((lo-18)/14)*100,w=((hi-lo)/14)*100;
  return <div className="tbd-wx-day" key={day}><b>{day}</b><WeatherGlyph kind={icon}/><span className={`tbd-wx-rainchance ${rain>=40?'tbd-rain':''}`}>{rain>0?`${rain}%`:'—'}</span><span className="tbd-wx-lo">{t(lo)}</span><span className="tbd-wx-range"><i style={{left:`${left}%`,width:`${w}%`}}/></span><span className="tbd-wx-hi">{t(hi)}</span></div>})}
  <p className="tbd-wx-note">A wet spell settles in from Thursday. Sunday looks like the pick of the week.</p>
 </div>;
}
export function WeatherStudy(){
 const [unit,setUnit]=useState<'C'|'F'>('C');
 const t=(v:number)=>unit==='C'?`${v}°`:`${Math.round(v*9/5+32)}°`;
 return <section className="product-study tbd-study tbd-weather" aria-label="Weather tabs study">
  <div className="tbd-wx-top"><b className="tbd-wx-brand"><WeatherGlyph kind="suncloud"/> Skylight</b><span className="tbd-wx-place">Indiranagar, Bengaluru</span>
   <button className="tbd-wx-unit" onClick={()=>setUnit(u=>u==='C'?'F':'C')} aria-label={`°${unit==='C'?'F':'C'} - switch temperature units`}>°{unit==='C'?'F':'C'}</button></div>
  <div className="tbd-wx-hero"><SkyScene/>
   <div className="tbd-wx-current"><span>Monday, 12:30 PM</span><h2>{t(24)}</h2><p>Partly cloudy · High {t(27)}, Low {t(21)}</p></div>
  </div>
  <PremiumTabs label="Forecast range" variant={6} items={[
   {id:'today',label:'Today',content:<TodayPanel unit={unit}/>},
   {id:'hourly',label:'Hourly',content:<HourlyPanel unit={unit}/>},
   {id:'week',label:'7 days',content:<WeekPanel unit={unit}/>},
  ]}/>
 </section>;
}

/* ---------- 2. Map place details: Atlas ---------- */

function PlaceMap({zoom}:{zoom:number}){
 return <div className="tbd-pl-mapwrap">
  <svg className="tbd-pl-map" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustrated map of the Indiranagar neighbourhood with the cafe marked" style={{transform:`scale(${zoom})`}}>
   <rect width="400" height="400" fill="#e9efe4"/>
   <path d="M0 250 Q110 236 200 252 T400 244 V400 H0 Z" fill="#cfe3bd"/>
   <path d="M-20 60 Q120 40 210 66 T420 52" fill="none" stroke="#bcd7ea" strokeWidth="26"/>
   <path d="M-20 60 Q120 40 210 66 T420 52" fill="none" stroke="#d8ebf6" strokeWidth="18"/>
   <g stroke="#ffffff" strokeWidth="10"><path d="M60 0 V400"/><path d="M0 120 H400"/><path d="M170 90 V400"/><path d="M0 320 H400"/><path d="M300 60 V400"/></g>
   <g stroke="#f6d9a8" strokeWidth="14"><path d="M0 200 H400"/></g>
   <g stroke="#e4c07f" strokeWidth="2"><path d="M0 200 H400"/></g>
   <g fill="#d6e4c8"><rect x="192" y="132" width="46" height="46" rx="6"/><rect x="70" y="270" width="70" height="40" rx="6"/></g>
   <g fontFamily="Arial" fontSize="11" fill="#7b8a74"><text x="66" y="112">12th Main Rd</text><text x="176" y="230" transform="rotate(90 176 230)">100 Feet Rd</text><text x="210" y="310">CMH Road</text></g>
   <g transform="translate(238 178)"><circle r="26" fill="#d95f43" opacity=".18" className="tbd-pl-pin-pulse"/><path d="M0-26a16 16 0 0 1 16 16C16 2 0 14 0 14S-16 2-16-10a16 16 0 0 1 16-16Z" fill="#d95f43"/><circle cy="-10" r="6" fill="#fff"/></g>
  </svg>
  <span className="tbd-pl-mapchip">Indiranagar</span>
 </div>;
}
function Stars({value}:{value:number}){
 return <span className="tbd-pl-stars" role="img" aria-label={`Rated ${value} out of 5`}>{[1,2,3,4,5].map(i=><svg key={i} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6 14.9 8.6 21.5 9.5 16.7 14.1 17.9 20.7 12 17.5 6.1 20.7 7.3 14.1 2.5 9.5 9.1 8.6Z" fill={i<=Math.round(value)?'#e8a13a':'#ddd7cc'}/></svg>)}</span>;
}
const placePhotos:[string,string][]=[['Terrace seating at dusk','linear-gradient(160deg,#f5c982,#d98a4b 55%,#8c5a3a)'],['Counter and espresso bar','linear-gradient(160deg,#7a5c48,#4c382c 60%,#2e231c)'],['Cardamom bun, morning batch','linear-gradient(160deg,#f2e2c4,#d9b36c 60%,#a87e3f)'],['Reading corner by the window','linear-gradient(160deg,#cfe0d8,#8fae9c 60%,#56705f)'],['Pour-over station','linear-gradient(160deg,#e8d7c8,#b78d68 60%,#7d5a41)'],['Street facade, 12th Main','linear-gradient(160deg,#bcd6ea,#7fa8c9 55%,#4f7396)']];
const placeReviews:[string,string,number,string,string,number][]=[
 ['Mira Shah','MS',5,'The filter coffee is the real reason to come, but the terrace is why you stay. Quiet on weekday mornings.','2 weeks ago',24],
 ['Daniel Osei','DO',4,'Solid espresso, kind staff, and the cardamom buns sell out by ten. Gets loud on weekend afternoons.','1 month ago',11],
 ['Ananya Rao','AR',5,'Worked here three afternoons running. Plugs at most tables, decent wifi, and nobody hurries you out.','3 months ago',18]];
function OverviewPanel(){return <div className="tbd-pl-overview">
 <p className="tbd-pl-about">A slow coffee house in an old corner bungalow. Single-origin filter coffee, a short bakery case, and a terrace that catches the evening breeze.</p>
 <div className="tbd-pl-hours"><b>Hours</b>{[['Monday – Friday','7:30 AM – 10:30 PM'],['Saturday','8:00 AM – 11:30 PM'],['Sunday','8:00 AM – 10:00 PM']].map(([d,h])=><div key={d}><span>{d}</span><span>{h}</span></div>)}</div>
 <div className="tbd-pl-amenities">{['Outdoor seating','Wifi','Cards accepted','Wheelchair access','Pet friendly'].map(a=><span key={a}>{a}</span>)}</div>
</div>}
function PhotosPanel(){return <div className="tbd-pl-photos">{placePhotos.map(([label,bg],i)=><figure key={label} style={{background:bg}}><figcaption>{label}</figcaption><i>{['▲','◼','●','◗','◈','▟'][i]}</i></figure>)}</div>}
function ReviewsPanel(){
 const [voted,setVoted]=useState<number[]>([]);
 return <div className="tbd-pl-reviews">
  <div className="tbd-pl-score"><b>4.6</b><div><Stars value={4.6}/><span>318 reviews</span></div></div>
  {placeReviews.map(([name,ini,stars,text,when,helpful],i)=><article key={name}>
   <header><i className={`tbd-pl-avatar tbd-pl-av-${i}`}>{ini}</i><span><b>{name}</b><small>{when}</small></span><Stars value={stars}/></header>
   <p>{text}</p>
   <button className={voted.includes(i)?'tbd-pl-voted':''} aria-pressed={voted.includes(i)} onClick={()=>setVoted(v=>v.includes(i)?v.filter(x=>x!==i):[...v,i])}>Helpful · {helpful+(voted.includes(i)?1:0)}</button>
  </article>)}
 </div>;
}
export function PlaceDetailsStudy(){
 const [zoom,setZoom]=useState(1);
 const [saved,setSaved]=useState(false);
 return <section className="product-study tbd-study tbd-place" aria-label="Map place details tabs study">
  <div className="tbd-pl-top"><b className="tbd-pl-brand">◈ Atlas</b><span className="tbd-pl-search">⌕ <span>Search places</span></span><i className="tbd-pl-avatar tbd-pl-av-0">JL</i></div>
  <div className="tbd-pl-body">
   <div className="tbd-pl-mapside"><PlaceMap zoom={zoom}/>
    <div className="tbd-pl-zoom" role="group" aria-label="Map zoom controls">
     <button aria-label="Zoom in" onClick={()=>setZoom(z=>Math.min(1.6,+(z+0.2).toFixed(2)))}>+</button>
     <button aria-label="Zoom out" onClick={()=>setZoom(z=>Math.max(0.6,+(z-0.2).toFixed(2)))}>−</button>
     <button onClick={()=>setZoom(1)}>Reset</button>
    </div>
   </div>
   <div className="tbd-pl-sheet">
    <div className="tbd-pl-strip" role="img" aria-label="Photos of Cedar and Steam: terrace seating, the espresso counter and the street facade">{[0,1,5].map(i=><figure key={i} style={{background:placePhotos[i][1]}}><i>{['▲','◼','▟'][['0','1','5'].indexOf(String(i))]}</i></figure>)}</div>
    <div className="tbd-pl-head"><span className="tbd-pl-cat">Coffee house · ₹₹ · Indiranagar</span><h2>Cedar & Steam</h2>
     <div className="tbd-pl-rating"><b>4.6</b><Stars value={4.6}/><span>318 reviews</span></div>
     <p className="tbd-pl-open"><i/> Open now · Closes 10:30 PM</p>
     <div className="tbd-pl-actions">
      <button className="tbd-pl-primary">Directions</button>
      <button aria-pressed={saved} onClick={()=>setSaved(v=>!v)}>{saved?'✓ Saved':'Save'}</button>
      <button onClick={e=>{const x=e.currentTarget;x.textContent=x.textContent==='Share'?'Link copied':'Share';}}>Share</button>
     </div>
    </div>
    <PremiumTabs label="Place information" variant={0} items={[
     {id:'overview',label:'Overview',content:<OverviewPanel/>},
     {id:'photos',label:'Photos',badge:'24',content:<PhotosPanel/>},
     {id:'reviews',label:'Reviews',badge:'318',content:<ReviewsPanel/>},
    ]}/>
   </div>
  </div>
 </section>;
}

/* ---------- 3. Recipe: Hearth ---------- */

const recipeIngredients:[string,string,number,string][]=[
 ['Pasta','Spaghetti',320,'g'],['Pasta','Sea salt',1,'tbsp'],
 ['Sauce','Mixed mushrooms',400,'g'],['Sauce','Unsalted butter',80,'g'],['Sauce','Garlic cloves',4,''],['Sauce','Double cream',120,'ml'],['Sauce','Parmesan, grated',50,'g'],
 ['To finish','Fresh sage leaves',12,''],['To finish','Lemon',1,''],['To finish','Black pepper',1,'tsp']];
const recipeSteps:[string,string][]=[
 ['Boil the pasta','Salt a large pot of water well and cook the spaghetti one minute shy of the packet time. Save a mug of pasta water before draining.'],
 ['Crisp the sage','Melt half the butter in a wide pan. Fry the sage leaves for 30 seconds until dark and crisp, then lift them onto a plate.'],
 ['Brown the mushrooms','Add the mushrooms in a single layer and leave them alone for 3 minutes. Stir once, then cook until deeply golden at the edges.'],
 ['Build the sauce','Stir in the garlic and remaining butter. Once the butter foams and smells nutty, pour in the cream and a splash of pasta water.'],
 ['Bring it together','Toss in the spaghetti and parmesan with a squeeze of lemon. Loosen with pasta water until glossy, then top with the crisp sage and pepper.']];
const nutrition:[string,string,number][]=[['Energy','562 kcal',28],['Protein','18 g',36],['Carbohydrates','68 g',26],['Fat','24 g',34],['Fibre','5 g',18],['Sodium','480 mg',21]];
function IngredientsPanel({servings}:{servings:number}){
 const [checked,setChecked]=useState<number[]>([]);
 const scale=servings/4;let group='';
 return <div className="tbd-rc-ingredients">
  <p className="tbd-rc-progress">{checked.length} of {recipeIngredients.length} gathered</p>
  {recipeIngredients.map(([g,name,qty,unit],i)=>{
   const head=g!==group?(group=g,<h3 key={g}>{g}</h3>):null;
   return <span key={name} style={{display:'contents'}}>{head}
    <label className={`tbd-rc-ingredient ${checked.includes(i)?'tbd-done':''}`}>
     <input type="checkbox" checked={checked.includes(i)} onChange={()=>setChecked(c=>c.includes(i)?c.filter(x=>x!==i):[...c,i])}/>
     <span className="tbd-rc-qty">{Number.isInteger(qty*scale)?qty*scale:(qty*scale).toFixed(1)} {unit}</span><span>{name}</span>
    </label></span>})}
 </div>;
}
function MethodPanel(){
 const [done,setDone]=useState<number[]>([]);
 return <div className="tbd-rc-method">
  <div className="tbd-rc-methodbar"><span style={{width:`${(done.length/recipeSteps.length)*100}%`}}/></div>
  <p className="tbd-rc-progress">{done.length===recipeSteps.length?'All steps done. Dinner is ready.':`Step ${Math.min(done.length+1,recipeSteps.length)} of ${recipeSteps.length}`}</p>
  {recipeSteps.map(([title,text],i)=><div className={`tbd-rc-step ${done.includes(i)?'tbd-done':''}`} key={title}>
   <button aria-pressed={done.includes(i)} aria-label={`Mark step ${i+1}, ${title}, as ${done.includes(i)?'not done':'done'}`} onClick={()=>setDone(d=>d.includes(i)?d.filter(x=>x!==i):[...d,i])}>{done.includes(i)?'✓':i+1}</button>
   <div><h3>{title}</h3><p>{text}</p></div>
  </div>)}
 </div>;
}
function NutritionPanel(){return <div className="tbd-rc-nutrition">
 <p className="tbd-rc-progress">Per serving, based on 4 servings. Estimates from standard references.</p>
 {nutrition.map(([name,val,pct])=><div className="tbd-rc-nutrient" key={name}><span>{name}</span><b>{val}</b><div className="tbd-rc-bar"><i style={{width:`${pct}%`}}/></div><small>{pct}% of daily need</small></div>)}
 <p className="tbd-rc-allergen">Contains gluten, milk. The mushrooms can be swapped for roasted aubergine without changing the method.</p>
</div>}
export function RecipeStudy(){
 const [servings,setServings]=useState(4);
 return <section className="product-study tbd-study tbd-recipe" aria-label="Recipe tabs study">
  <div className="tbd-rc-top"><b className="tbd-rc-brand">Hearth</b><span>Weeknight cooking</span></div>
  <header className="tbd-rc-head">
   <div className="tbd-rc-title">
    <h2>Brown butter mushroom pasta</h2>
    <p>Crisp sage, golden mushrooms and a glossy parmesan sauce. On the table in about half an hour.</p>
    <div className="tbd-rc-meta"><span>◷ 35 min</span><span>♨ One pan</span><span>◐ Easy</span></div>
   </div>
   <div className="tbd-rc-servings"><span>Serves</span>
    <div role="group" aria-label="Adjust servings">
     <button aria-label="Fewer servings" disabled={servings<=2} onClick={()=>setServings(s=>Math.max(2,s-1))}>−</button>
     <b>{servings}</b>
     <button aria-label="More servings" disabled={servings>=8} onClick={()=>setServings(s=>Math.min(8,s+1))}>+</button>
    </div>
   </div>
  </header>
  <PremiumTabs label="Recipe sections" variant={9} items={[
   {id:'ingredients',label:'Ingredients',badge:String(recipeIngredients.length),content:<IngredientsPanel servings={servings}/>},
   {id:'method',label:'Method',badge:String(recipeSteps.length),content:<MethodPanel/>},
   {id:'nutrition',label:'Nutrition',content:<NutritionPanel/>},
  ]}/>
 </section>;
}

/* ---------- 4. Color & token inspector ---------- */

const tokenPalette:[string,[string,string][]][]=[
 ['Neutrals',[['ink-900','#20242a'],['ink-700','#4a5058'],['ink-500','#7d838c'],['ink-300','#c3c7cd'],['ink-100','#eceef0'],['paper','#fafaf8']]],
 ['Accent',[['blue-700','#2456c9'],['blue-500','#3f78e8'],['blue-300','#9dbdf3'],['blue-100','#e3edfc']]],
 ['Support',[['green-600','#2e7d4f'],['amber-500','#e09a1f'],['red-600','#cc4334'],['teal-500','#2a9d8f']]]];
function hexToRgb(hex:string){const n=parseInt(hex.slice(1),16);return [n>>16,(n>>8)&255,n&255];}
function luminance(hex:string){const [r,g,b]=hexToRgb(hex).map(v=>{const s=v/255;return s<=0.03928?s/12.92:Math.pow((s+0.055)/1.055,2.4);});return 0.2126*r+0.7152*g+0.0722*b;}
function contrast(a:string,b:string){const [x,y]=[luminance(a),luminance(b)].sort((p,q)=>q-p);return ((x+0.05)/(y+0.05));}
function CopyValue({text}:{text:string}){
 const [copied,setCopied]=useState(false);
 return <button className="tbd-tk-copy" onClick={async()=>{try{await navigator.clipboard.writeText(text);}catch{}setCopied(true);setTimeout(()=>setCopied(false),1400);}}>{copied?'Copied':text}</button>;
}
function PalettePanel(){
 const [sel,setSel]=useState<[string,string]>(tokenPalette[1][1][1]);
 const [name,hex]=sel;const [r,g,b]=hexToRgb(hex);
 const onPaper=contrast(hex,'#fafaf8'),onInk=contrast(hex,'#20242a');
 return <div className="tbd-tk-palette">
  <div className="tbd-tk-swatches">{tokenPalette.map(([group,swatches])=><div key={group}><h3>{group}</h3>
   <div>{swatches.map(([n,h])=><button key={n} className={n===name?'tbd-selected':''} style={{background:h}} aria-label={`${n}, ${h}${n===name?', selected':''}`} aria-pressed={n===name} onClick={()=>setSel([n,h])}/>)}</div>
  </div>)}</div>
  <div className="tbd-tk-detail">
   <div className="tbd-tk-bigchip" style={{background:hex}}/>
   <p className="tbd-tk-chipname">{name}</p>
   <dl>
    <div><dt>HEX</dt><dd><CopyValue text={hex}/></dd></div>
    <div><dt>RGB</dt><dd><CopyValue text={`${r} ${g} ${b}`}/></dd></div>
    <div><dt>CSS var</dt><dd><CopyValue text={`--${name}`}/></dd></div>
   </dl>
   <div className="tbd-tk-contrast">
    <div><span>On paper</span><b>{onPaper.toFixed(2)}</b><i className={onPaper>=4.5?'tbd-pass':onPaper>=3?'tbd-warn':'tbd-fail'}>{onPaper>=4.5?'AA':onPaper>=3?'AA18':'Fail'}</i></div>
    <div><span>On ink</span><b>{onInk.toFixed(2)}</b><i className={onInk>=4.5?'tbd-pass':onInk>=3?'tbd-warn':'tbd-fail'}>{onInk>=4.5?'AA':onInk>=3?'AA18':'Fail'}</i></div>
   </div>
  </div>
 </div>;
}
const typeScale:[string,string,number,number][]=[['Display','Good type is invisible until it isn\'t.',30,700],['Title','A quiet hierarchy does the work.',22,600],['Body','Most reading happens at this size, so it earns the most attention.',15,400],['Caption','Small text still has to carry its weight.',12,400],['Mono','--space-4: calc(var(--space) * 4)',12,500]];
function TypePanel(){
 const [base,setBase]=useState(15);
 const scale=base/15;
 return <div className="tbd-tk-type">
  <div className="tbd-tk-slider"><label htmlFor="tbd-base">Body size <b>{base}px</b></label>
   <input id="tbd-base" type="range" min={13} max={18} step={1} value={base} onChange={e=>setBase(+e.target.value)}/>
  </div>
  {typeScale.map(([name,sample,size,weight])=><div className="tbd-tk-specimen" key={name}>
   <header><b>{name}</b><code>{Math.round(size*scale)}px / {weight}</code></header>
   <p className={name==='Mono'?'tbd-tk-mono':''} style={{fontSize:size*scale,fontWeight:weight}}>{sample}</p>
  </div>)}
 </div>;
}
const spacing:[string,number][]=[['space-1',4],['space-2',8],['space-3',12],['space-4',16],['space-5',24],['space-6',32],['space-7',48],['space-8',64],['space-9',96]];
function SpacingPanel(){
 const [sel,setSel]=useState(3);
 const [name,px]=spacing[sel];
 return <div className="tbd-tk-spacing">
  <div className="tbd-tk-bars">{spacing.map(([n,p],i)=><button key={n} className={i===sel?'tbd-selected':''} aria-pressed={i===sel} onClick={()=>setSel(i)}><i style={{width:Math.min(p*2.4,230)}}/><span>{n}</span><b>{p}</b></button>)}</div>
  <div className="tbd-tk-detail tbd-tk-spdetail">
   <dl>
    <div><dt>Token</dt><dd><CopyValue text={`--${name}`}/></dd></div>
    <div><dt>Pixels</dt><dd>{px}px</dd></div>
    <div><dt>Rem</dt><dd>{(px/16).toFixed(px%16===0?0:3)}rem</dd></div>
    <div><dt>Used for</dt><dd>{['Hairline gaps','Icon gaps','Inline padding','Card padding','Section gutters','Block spacing','Panel spacing','Section breaks','Hero spacing'][sel]}</dd></div>
   </dl>
   <div className="tbd-tk-spdemo"><div style={{padding:Math.min(px,40),borderColor:'#3f78e8'}}><span/></div><small>Padding preview at {px}px (capped at 40px)</small></div>
  </div>
 </div>;
}
export function TokenInspectorStudy(){
 return <section className="product-study tbd-study tbd-tokens" aria-label="Design token inspector tabs study">
  <div className="tbd-tk-top"><b className="tbd-tk-brand">▦ tokens<span>/</span>north-ui</b><span className="tbd-tk-env">v0.9.3 · local</span></div>
  <div className="tbd-tk-head"><h2>Foundations</h2><p>The single source of truth for color, type and space.</p></div>
  <PremiumTabs label="Token category" variant={13} items={[
   {id:'palette',label:'Palette',content:<PalettePanel/>},
   {id:'type',label:'Type',content:<TypePanel/>},
   {id:'spacing',label:'Spacing',content:<SpacingPanel/>},
  ]}/>
 </section>;
}

/* ---------- 5. Hardware controller: Haven ---------- */

type Light={name:string;room:string;on:boolean;level:number};
const baseLights:Light[]=[{name:'Ceiling',room:'Living room',on:true,level:70},{name:'Reading lamp',room:'Living room',on:true,level:40},{name:'Pendant',room:'Kitchen',on:false,level:60},{name:'Counter strip',room:'Kitchen',on:true,level:85},{name:'Desk lamp',room:'Studio',on:true,level:55}];
type Scene={name:string;icon:string;levels:number[];temp:number;note:string};
const scenes:Scene[]=[
 {name:'Morning',icon:'☀',levels:[80,50,70,90,60],temp:23,note:'Bright and warm to start the day'},
 {name:'Focus',icon:'◎',levels:[40,100,0,60,90],temp:22,note:'Cool air, desk lamp up'},
 {name:'Movie night',icon:'▶',levels:[15,30,0,25,10],temp:24,note:'Low light, settled temperature'},
 {name:'Away',icon:'↗',levels:[0,0,0,0,0],temp:26,note:'Everything off, climate rests'}];
function LightingPanel({lights,setLights}:{lights:Light[];setLights:(fn:(l:Light[])=>Light[])=>void}){
 const [roomFilter,setRoomFilter]=useState('All');
 const rooms=['Living room','Kitchen','Studio'].filter(r=>roomFilter==='All'||r===roomFilter);
 return <div className="tbd-hm-lighting">
 <div className="tbd-hm-rooms" role="group" aria-label="Filter by room">{['All','Living room','Kitchen','Studio'].map(r=><button key={r} aria-pressed={roomFilter===r} className={roomFilter===r?'tbd-on':''} onClick={()=>setRoomFilter(r)}>{r}</button>)}</div>
 {rooms.map(room=>{const idxs=lights.map((l,i)=>l.room===room?i:-1).filter(i=>i>=0);
  return <div className="tbd-hm-room" key={room}><h3>{room}<span>{idxs.filter(i=>lights[i].on).length} of {idxs.length} on</span></h3>
   {idxs.map(i=>{const l=lights[i];return <div className={`tbd-hm-light ${l.on?'tbd-on':''}`} key={l.name}>
    <div className="tbd-hm-lighttop"><span className="tbd-hm-bulb" style={{opacity:l.on?0.35+l.level/130:0.12}}/><b>{l.name}</b>
     <button role="switch" aria-checked={l.on} aria-label={`${l.name} power`} className="tbd-hm-switch" onClick={()=>setLights(ls=>ls.map((x,k)=>k===i?{...x,on:!x.on}:x))}><i/></button></div>
    <input type="range" min={5} max={100} value={l.level} disabled={!l.on} aria-label={`${l.name} brightness`} style={{'--tbd-level':`${l.level}%`} as CSSProperties}
     onChange={e=>setLights(ls=>ls.map((x,k)=>k===i?{...x,level:+e.target.value}:x))}/>
    <small>{l.on?`${l.level}% brightness`:'Off'}</small>
   </div>})}
  </div>})}
 </div>;
}
function ClimatePanel({temp,setTemp}:{temp:number;setTemp:(fn:(t:number)=>number)=>void}){
 const [mode,setMode]=useState<'heat'|'cool'|'auto'>('auto');
 const [fan,setFan]=useState(true);
 const arc=((temp-16)/14)*180;
 return <div className="tbd-hm-climate">
  <div className="tbd-hm-dialwrap">
   <svg viewBox="0 0 220 130" role="img" aria-label={`Thermostat set to ${temp} degrees, current mode ${mode}`}>
    <path d="M20 118 A100 100 0 0 1 200 118" fill="none" stroke="#e3ded4" strokeWidth="10" strokeLinecap="round"/>
    <path d="M20 118 A100 100 0 0 1 200 118" fill="none" stroke={mode==='heat'?'#d9744a':mode==='cool'?'#4a86c8':'#7f9c6f'} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(arc/180)*283} 283`} className="tbd-hm-arc"/>
    <text x="110" y="86" textAnchor="middle" className="tbd-hm-temp">{temp.toFixed(1)}°</text>
    <text x="110" y="108" textAnchor="middle" className="tbd-hm-mode">{mode==='auto'?'Holding steady':mode==='heat'?'Heating to':'Cooling to'}</text>
   </svg>
   <div className="tbd-hm-dialbtns">
    <button aria-label="Lower temperature" onClick={()=>setTemp(t=>Math.max(16,+(t-0.5).toFixed(1)))}>−</button>
    <button aria-label="Raise temperature" onClick={()=>setTemp(t=>Math.min(30,+(t+0.5).toFixed(1)))}>+</button>
   </div>
  </div>
  <div className="tbd-hm-climateside">
   <div className="tbd-hm-modes" role="group" aria-label="Climate mode">{(['heat','cool','auto'] as const).map(m=><button key={m} aria-pressed={mode===m} className={mode===m?'tbd-on':''} onClick={()=>setMode(m)}>{m[0].toUpperCase()+m.slice(1)}</button>)}</div>
   <div className="tbd-hm-tiles">
    <div><span>Humidity</span><b>47%</b></div>
    <div><span>Air quality</span><b>Good</b></div>
    <div><span>Circulation</span><button role="switch" aria-checked={fan} className="tbd-hm-switch" onClick={()=>setFan(v=>!v)}><i/></button><b>{fan?'Fan on':'Fan off'}</b></div>
   </div>
  </div>
 </div>;
}
export function HomeControllerStudy(){
 const [lights,setLights]=useState(baseLights);
 const [temp,setTemp]=useState(23.5);
 const [activeScene,setActiveScene]=useState(-1);
 const apply=(s:Scene,i:number)=>{setLights(ls=>ls.map((l,k)=>({...l,level:Math.max(s.levels[k],l.on||s.levels[k]>0?5:0),on:s.levels[k]>0})));setTemp(s.temp);setActiveScene(i);};
 return <section className="product-study tbd-study tbd-home" aria-label="Home controller tabs study">
  <div className="tbd-hm-top"><div><h2>Good evening, Jamie</h2><p>{lights.filter(l=>l.on).length} lights on · Holding {temp.toFixed(1)}°</p></div><i className="tbd-hm-homeicon">⌂</i></div>
  <PremiumTabs label="Home controls" variant={1} items={[
   {id:'lighting',label:'Lighting',content:<LightingPanel lights={lights} setLights={setLights}/>},
   {id:'climate',label:'Climate',content:<ClimatePanel temp={temp} setTemp={setTemp}/>},
   {id:'scenes',label:'Scenes',content:<div className="tbd-hm-scenes">{scenes.map((s,i)=><button key={s.name} className={`tbd-hm-scene ${activeScene===i?'tbd-on':''}`} aria-pressed={activeScene===i} onClick={()=>apply(s,i)}>
    <i>{s.icon}</i><b>{s.name}</b><span>{s.note}</span>{activeScene===i&&<em>Active now</em>}</button>)}</div>},
  ]}/>
 </section>;
}

/* ---------- Batch ---------- */

export default function TabBatchD(){
 return <div className="product-studies tbd-studies">
  <WeatherStudy/>
  <PlaceDetailsStudy/>
  <RecipeStudy/>
  <TokenInspectorStudy/>
  <HomeControllerStudy/>
 </div>;
}

/* ---------- Compact tab bars for the Tabs components page ---------- */
/* Each compact has its own mechanic: dial, pin dock, bookmarks, tool palette, rocker. */

function MiniLine({children}:{children:ReactNode}){return <p className="tbd-mini-line">{children}</p>}

function useMiniTabs(ids:string[]){
 const [active,setActive]=useState(ids[0]);
 const refs=useRef<(HTMLButtonElement|null)[]>([]);
 function onKey(e:ReactKeyboardEvent<HTMLButtonElement>,i:number){
  let j=-1;
  if(e.key==='ArrowRight'||e.key==='ArrowDown')j=(i+1)%ids.length;
  else if(e.key==='ArrowLeft'||e.key==='ArrowUp')j=(i-1+ids.length)%ids.length;
  else if(e.key==='Home')j=0;
  else if(e.key==='End')j=ids.length-1;
  if(j>=0){e.preventDefault();setActive(ids[j]);refs.current[j]?.focus();}
 }
 return {active,setActive,refs,onKey};
}

function MiniPanel({scope,children}:{scope:string;children:ReactNode}){
 return <div role="tabpanel" id={`tbd-mini-${scope}-panel`} aria-labelledby={`tbd-mini-${scope}-tab`} className="tbd-mini-panel">{children}</div>;
}

/* 1. Weather: forecast dial — a needle swings between three detents */
export function WeatherTabs(){
 const ids=['today','hourly','week'];
 const labels=['Today','Hourly','7 days'];
 const copy=[<><b>24° now, partly cloudy.</b>High 27°, low 21°.</>,<><b>Clearing by 2 PM.</b>Rain likely after 7 PM.</>,<><b>A wet spell ahead.</b>Rain settles in from Thursday.</>];
 const stops=[{left:'13%',top:'56%'},{left:'50%',top:'4%'},{left:'87%',top:'56%'}];
 const {active,setActive,refs,onKey}=useMiniTabs(ids);
 const ai=ids.indexOf(active);
 return <div className="tbd-mini tbd-mini-weather">
  <div className="tbd-dial" role="tablist" aria-label="Forecast range">
   <svg className="tbd-dial-face" viewBox="0 0 120 66" aria-hidden="true">
    <path d="M10 60 A52 52 0 0 1 110 60" fill="none" stroke="#b9cfdd" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="10" cy="60" r="3.5" fill="#8fb0c4"/><circle cx="60" cy="8" r="3.5" fill="#8fb0c4"/><circle cx="110" cy="60" r="3.5" fill="#8fb0c4"/>
   </svg>
   <div className="tbd-dial-needle" style={{transform:`rotate(${-40+ai*40}deg)`}} aria-hidden="true"/>
   <div className="tbd-dial-hub" aria-hidden="true"/>
   {ids.map((id,i)=><button key={id} ref={el=>{refs.current[i]=el}} role="tab" id={i===ai?`tbd-mini-weather-tab`:undefined} aria-selected={ai===i} aria-controls={`tbd-mini-weather-panel`} tabIndex={ai===i?0:-1} onClick={()=>setActive(id)} onKeyDown={e=>onKey(e,i)} className={`tbd-dial-stop${ai===i?' tbd-on':''}`} style={{left:stops[i].left,top:stops[i].top}}>{labels[i]}</button>)}
  </div>
  <MiniPanel scope="weather"><MiniLine>{copy[ai]}</MiniLine></MiniPanel>
 </div>;
}

/* 2. Place: map-pin dock — the active pin pops off the map strip */
export function PlaceDetailsTabs(){
 const ids=['overview','photos','reviews'];
 const labels=['Overview','Photos','Reviews'];
 const badges=['','24','318'];
 const copy=[<><b>Terrace coffee house on 12th Main.</b>Open until 10:30 PM.</>,<><b>24 photos.</b>The bungalow, terrace and bakery case.</>,<><b>4.6 from 318 visits.</b>People mention the filter coffee.</>];
 const {active,setActive,refs,onKey}=useMiniTabs(ids);
 const ai=ids.indexOf(active);
 return <div className="tbd-mini tbd-mini-place">
  <div className="tbd-dock" role="tablist" aria-label="Place information">
   {ids.map((id,i)=><button key={id} ref={el=>{refs.current[i]=el}} role="tab" id={i===ai?`tbd-mini-place-tab`:undefined} aria-selected={ai===i} aria-controls={`tbd-mini-place-panel`} tabIndex={ai===i?0:-1} onClick={()=>setActive(id)} onKeyDown={e=>onKey(e,i)} className={`tbd-pin${ai===i?' tbd-on':''}`} style={{left:`${18+i*32}%`}}>
    <span className="tbd-pin-chip">{labels[i]}{badges[i]?<b>{badges[i]}</b>:null}</span>
    <svg viewBox="0 0 24 30" className="tbd-pin-drop" aria-hidden="true"><path d="M12 1C6 1 2 5.6 2 11c0 7.5 10 18 10 18s10-10.5 10-18C22 5.6 18 1 12 1z" fill="currentColor"/><circle cx="12" cy="11" r="3.4" fill="#f6f2e9"/></svg>
   </button>)}
  </div>
  <MiniPanel scope="place"><MiniLine>{copy[ai]}</MiniLine></MiniPanel>
 </div>;
}

/* 3. Recipe: hanging bookmark index — ribbons on a rail, the active one pulls down */
export function RecipeTabs(){
 const ids=['ingredients','method','nutrition'];
 const labels=['Ingredients','Method','Nutrition'];
 const marks=['10','5',''];
 const copy=[<><b>10 ingredients.</b>Mushrooms, butter, sage, parmesan and cream.</>,<><b>Five steps, one pan.</b>About 35 minutes.</>,<><b>562 kcal per serving.</b>18 g protein.</>];
 const {active,setActive,refs,onKey}=useMiniTabs(ids);
 const ai=ids.indexOf(active);
 return <div className="tbd-mini tbd-mini-recipe">
  <div className="tbd-marks" role="tablist" aria-label="Recipe sections">
   {ids.map((id,i)=><button key={id} ref={el=>{refs.current[i]=el}} role="tab" id={i===ai?`tbd-mini-recipe-tab`:undefined} aria-selected={ai===i} aria-controls={`tbd-mini-recipe-panel`} tabIndex={ai===i?0:-1} onClick={()=>setActive(id)} onKeyDown={e=>onKey(e,i)} className={`tbd-mark${ai===i?' tbd-on':''}`}>
    {labels[i]}{marks[i]?<i>{marks[i]}</i>:null}
   </button>)}
  </div>
  <MiniPanel scope="recipe"><MiniLine>{copy[ai]}</MiniLine></MiniPanel>
 </div>;
}

/* 4. Tokens: tool palette — tools in a tray, the active one lifts out */
export function TokenInspectorTabs(){
 const ids=['palette','type','spacing'];
 const labels=['Palette','Type','Spacing'];
 const copy=[<><b>19 swatches.</b>Neutrals, accent and support.</>,<><b>Five type steps.</b>15px body base.</>,<><b>Nine spacing tokens.</b>4px to 96px.</>];
 const glyphs=[
  <svg key="p" viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y="1.5" width="6" height="6" rx="1.5" fill="#b3543f"/><rect x="8.5" y="1.5" width="6" height="6" rx="1.5" fill="#3a78df"/><rect x="1.5" y="8.5" width="6" height="6" rx="1.5" fill="#5f8f5a"/><rect x="8.5" y="8.5" width="6" height="6" rx="1.5" fill="#e8a93a"/></svg>,
  <svg key="t" viewBox="0 0 16 16" aria-hidden="true"><text x="2" y="12.5" fontSize="11" fontFamily="Georgia,serif" fill="#39424a">Aa</text></svg>,
  <svg key="s" viewBox="0 0 16 16" aria-hidden="true"><rect x="1" y="5" width="14" height="6" rx="1.5" fill="none" stroke="#39424a" strokeWidth="1.4"/><path d="M4 5v3M7 5v2M10 5v3M13 5v2" stroke="#39424a" strokeWidth="1.2"/></svg>,
 ];
 const {active,setActive,refs,onKey}=useMiniTabs(ids);
 const ai=ids.indexOf(active);
 return <div className="tbd-mini tbd-mini-tokens">
  <div className="tbd-tools" role="tablist" aria-label="Token category">
   {ids.map((id,i)=><button key={id} ref={el=>{refs.current[i]=el}} role="tab" id={i===ai?`tbd-mini-tokens-tab`:undefined} aria-selected={ai===i} aria-controls={`tbd-mini-tokens-panel`} tabIndex={ai===i?0:-1} onClick={()=>setActive(id)} onKeyDown={e=>onKey(e,i)} className={`tbd-tool${ai===i?' tbd-on':''}`}>
    <span className="tbd-tool-glyph">{glyphs[i]}</span>{labels[i]}
   </button>)}
  </div>
  <MiniPanel scope="tokens"><MiniLine>{copy[ai]}</MiniLine></MiniPanel>
 </div>;
}

/* 5. Home: physical rocker — a triple switch plate, the active rocker presses in */
export function HomeControllerTabs(){
 const ids=['lighting','climate','scenes'];
 const labels=['Lighting','Climate','Scenes'];
 const copy=[<><b>4 of 5 lights on.</b>Across three rooms.</>,<><b>Holding 23.5°.</b>Humidity 47%.</>,<><b>Four scenes.</b>Morning, Focus, Movie night and Away.</>];
 const {active,setActive,refs,onKey}=useMiniTabs(ids);
 const ai=ids.indexOf(active);
 return <div className="tbd-mini tbd-mini-home">
  <div className="tbd-rocker" role="tablist" aria-label="Home controls">
   {ids.map((id,i)=><button key={id} ref={el=>{refs.current[i]=el}} role="tab" id={i===ai?`tbd-mini-home-tab`:undefined} aria-selected={ai===i} aria-controls={`tbd-mini-home-panel`} tabIndex={ai===i?0:-1} onClick={()=>setActive(id)} onKeyDown={e=>onKey(e,i)} className={`tbd-rock${ai===i?' tbd-on':''}`}>
    <span className="tbd-rock-led" aria-hidden="true"/>{labels[i]}
   </button>)}
  </div>
  <MiniPanel scope="home"><MiniLine>{copy[ai]}</MiniLine></MiniPanel>
 </div>;
}
