// glass4-engine.js - GOAT UI liquid glass engine (own code).
// Rim-slope liquid glass for canvas 2D: a signed-distance shape gets real
// refraction of the backdrop (strong bend at the rim, clear center), chromatic
// RGB split, frost, tint, meniscus, fresnel, dual speculars, directional rim
// light, and a drop shadow. One shape per call; call per element per frame.
// Usage: define a full-canvas backing canvas `sc` (W x H) holding the backdrop,
// get its 2d context as `s`, then call glass4({sdf, x0,y0,x1,y1, ...params}).
// The engine reads/writes pixels on `s` in place. See README.md for parameters.

function blurred(img,down){
  const b=document.createElement('canvas'); b.width=Math.max(2,Math.round(W/down)); b.height=Math.max(2,Math.round(H/down));
  const bc=b.getContext('2d'); bc.drawImage(img,0,0,b.width,b.height);
  const o=document.createElement('canvas'); o.width=W; o.height=H;
  const oc=o.getContext('2d'); oc.imageSmoothingEnabled=true; oc.drawImage(b,0,0,W,H);
  return oc.getImageData(0,0,W,H);
}


function glass4(shape){
  const {sdf,x0,y0,x1,y1, et=6, rimPow=2.1, refrRim=34, refrBase=6, kR=1.12,kB=0.88,
    tint=[20,20,24], tintMix=0.35, frost=8, frostMix=0.6,
    fresPow=2.6, fresK=0.42, n3K=1.35,
    sp1L=[-0.45,-0.75,0.55], sp1Pow=42, sp1K=0.95, sp2L=[0.55,0.68,0.48], sp2Pow=28, sp2K=0.65,
    rimT=66, rimB=41, rimR=9, rimL=-31, rimW=1.1, brGlow=0, brGX=0, brGY=0, brGR=10,
    menK=-8, menD0=1.2, menD1=4.5, glossK=0,
    shadowK=0, shadowDX=0, shadowDY=0, shadowBlur=10,
    nearest=false, menMode=0}=shape;  // nearest: point-sample the backdrop; menMode: 0 symmetric, 1 top-weighted, 2 bottom-weighted band
  // drop shadow pass (under the shape)
  const sharp=s.getImageData(0,0,W,H), blur=blurred(sc,frost);
  const out=s.getImageData(0,0,W,H);
  const S=sharp.data, B=blur.data, O=out.data;
  if(shadowK>0){
    for(let py=Math.floor(Math.max(0,y0-30));py<=Math.min(H-1,Math.ceil(y1+30));py++)for(let px=Math.floor(Math.max(0,x0-30));px<=Math.min(W-1,Math.ceil(x1+30));px++){
      const d=sdf(px-shadowDX,py-shadowDY);
      if(d>=shadowBlur) continue;
      const m=Math.max(0,1-Math.max(0,d)/shadowBlur)*shadowK*(d<0?0.4:1);
      const idx=(py*W+px)*4;
      O[idx]=S[idx]*(1-m); O[idx+1]=S[idx+1]*(1-m); O[idx+2]=S[idx+2]*(1-m);
    }
    s.putImageData(out,0,0);
    for(let k=0;k<3;k++){ S.set(s.getImageData(0,0,W,H).data); break; }
    const sh2=s.getImageData(0,0,W,H); S.set(sh2.data);
    const bl2=blurred(sc,frost); B.set(bl2.data);
  }
  const L1=Math.hypot(...sp1L), l1=[sp1L[0]/L1,sp1L[1]/L1,sp1L[2]/L1];
  const L2=Math.hypot(...sp2L), l2=[sp2L[0]/L2,sp2L[1]/L2,sp2L[2]/L2];
  const sam=nearest ? (data,sx,sy,ch)=>{
    const ix=Math.min(W-1,Math.max(0,Math.round(sx))), iy=Math.min(H-1,Math.max(0,Math.round(sy)));
    return data[(iy*W+ix)*4+ch];
  } : (data,sx,sy,ch)=>{
    const x0=Math.max(0,Math.min(W-2,Math.floor(sx))), y0=Math.max(0,Math.min(H-2,Math.floor(sy)));
    const fx=Math.min(1,Math.max(0,sx-x0)), fy=Math.min(1,Math.max(0,sy-y0));
    const i00=(y0*W+x0)*4+ch, i10=i00+4, i01=i00+W*4, i11=i01+4;
    return (data[i00]*(1-fx)+data[i10]*fx)*(1-fy)+(data[i01]*(1-fx)+data[i11]*fx)*fy;
  };
  for(let py=Math.floor(Math.max(0,y0));py<=Math.min(H-1,Math.ceil(y1));py++)for(let px=Math.floor(Math.max(0,x0));px<=Math.min(W-1,Math.ceil(x1));px++){
    const d=sdf(px+0.5,py+0.5);
    if(d>=2.2) continue;
    const idx=(py*W+px)*4;
    const depth=Math.max(0,-d);
    const gx=(sdf(px+1.5,py+0.5)-sdf(px-1.5,py+0.5))*0.5;
    const gy=(sdf(px+0.5,py+1.5)-sdf(px+0.5,py-1.5))*0.5;
    const gl=Math.hypot(gx,gy)||1;
    const nx=gx/gl, ny=gy/gl;
    // Bandi's rim-slope method: edgeFactor/rimSlope drive bend + highlights
    const edgeFactor=Math.min(1,Math.max(0,depth/et));
    const rimSlope=Math.pow(1-edgeFactor,rimPow);
    const n2x=nx*rimSlope, n2y=ny*rimSlope;
    const baseRefract=refrRim*rimSlope+refrBase*(1-edgeFactor);
    const sr=sam(S,px-n2x*baseRefract*kR,py-n2y*baseRefract*kR,0);
    const sg=sam(S,px-n2x*baseRefract,py-n2y*baseRefract,1);
    const sb2=sam(S,px-n2x*baseRefract*kB,py-n2y*baseRefract*kB,2);
    const fr=sam(B,px-n2x*baseRefract,py-n2y*baseRefract,0), fg=sam(B,px-n2x*baseRefract,py-n2y*baseRefract,1), fb=sam(B,px-n2x*baseRefract,py-n2y*baseRefract,2);
    const fm=frostMix*Math.min(1,Math.max(0,(depth-2)/6));
    let rr_=sr*(1-fm)+fr*fm, gg=sg*(1-fm)+fg*fm, bb=sb2*(1-fm)+fb*fm;
    // slight tint
    rr_=rr_*(1-tintMix)+tint[0]*tintMix; gg=gg*(1-tintMix)+tint[1]*tintMix; bb=bb*(1-tintMix)+tint[2]*tintMix;
    // meniscus inner band (signed; strongest at top, shallow on sides/bottom)
    const men=Math.exp(-Math.pow((depth-(menD0+menD1)/2)/((menD1-menD0)/2),2))*(menMode===1 ? 0.45+0.55*Math.max(0,ny) : menMode===2 ? 0.35+0.65*Math.max(0,-ny) : 0.35+0.65*Math.abs(ny));
    rr_+=menK*men; gg+=menK*men; bb+=menK*men;
    // 3D normal for shading
    const n3x=n2x*n3K, n3y=n2y*n3K;
    const n3z=Math.sqrt(Math.max(0.02,1-n3x*n3x-n3y*n3y));
    const nl=Math.hypot(n3x,n3y,n3z);
    const Nx=n3x/nl, Ny=n3y/nl, Nz=n3z/nl;
    // fresnel
    const fres=Math.pow(1-Nz,fresPow)*fresK;
    rr_+=255*fres; gg+=255*fres; bb+=255*fres;
    // dual speculars (half-vector)
    const h1x=l1[0], h1y=l1[1], h1z=l1[2]+1, h1l=Math.hypot(h1x,h1y,h1z);
    const d1=(Nx*h1x+Ny*h1y+Nz*h1z)/h1l;
    const s1=Math.pow(Math.max(0,d1),sp1Pow)*sp1K*(0.15+0.85*Math.abs(nx));
    const h2x=l2[0], h2y=l2[1], h2z=l2[2]+1, h2l=Math.hypot(h2x,h2y,h2z);
    const d2=(Nx*h2x+Ny*h2y+Nz*h2z)/h2l;
    const s2=Math.pow(Math.max(0,d2),sp2Pow)*sp2K*(0.15+0.85*Math.abs(nx));
    rr_+=255*(s1+s2); gg+=255*(s1+s2); bb+=255*(s1+s2);
    // directional outer rim line
    const rimDir=rimT*(1-Math.min(1,Math.abs(nx)*1.4))*Math.max(0,-ny)+rimB*Math.max(0,ny)+rimL*Math.max(0,-nx)+rimR*Math.max(0,nx);
    const brg=brGlow>0?brGlow*255*Math.exp(-(Math.pow(px-brGX,2)+Math.pow(py-brGY,2))/(brGR*brGR)):0;
    const rimBand=Math.exp(-Math.pow((d+0.5)/rimW,2))*(d<0.4?1:0);
    // top gloss sweep
    if(glossK>0){ const gl2=glossK*Math.max(0,-ny)*Math.exp(-Math.max(0,depth-2)/et); rr_+=255*gl2*0.2; gg+=255*gl2*0.2; bb+=255*gl2*0.2; }
    const cov=Math.min(1,Math.max(0,(0.2-d)/1.2));
    rr_=S[idx]*(1-cov)+rr_*cov+rimDir*rimBand+brg;
    gg=S[idx+1]*(1-cov)+gg*cov+rimDir*rimBand+brg;
    bb=S[idx+2]*(1-cov)+bb*cov+rimDir*rimBand+brg;
    O[idx]=Math.min(255,Math.max(0,rr_)); O[idx+1]=Math.min(255,Math.max(0,gg)); O[idx+2]=Math.min(255,Math.max(0,bb));
  }
  s.putImageData(out,0,0);
}


function sdfRR(cx,cy,hw,hh,r){
  return function(px,py){
    const dx=Math.max(Math.abs(px-cx)-(hw-r),0), dy=Math.max(Math.abs(py-cy)-(hh-r),0);
    return Math.hypot(dx,dy)-r;
  };
}


function sdfCirc(cx,cy,r){ return function(px,py){ return Math.hypot(px-cx,py-cy)-r; }; }

// exact rounded-rect distance (negative depth inside); sdfRR above keeps the flat interior used by older items
function sdfRRx(cx,cy,hw,hh,r){
  return function(px,py){
    const qx=Math.abs(px-cx)-(hw-r), qy=Math.abs(py-cy)-(hh-r);
    return Math.hypot(Math.max(qx,0),Math.max(qy,0))+Math.min(Math.max(qx,qy),0)-r;
  };
}
