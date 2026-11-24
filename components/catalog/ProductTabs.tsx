"use client";
import {useEffect,useRef} from 'react';
import {PremiumTabs,type TabsProps} from './PremiumTabs';
/** A damped spring that follows the measured selected tab, including on resize. */
export function ProductTabs(props:TabsProps){
 const host=useRef<HTMLDivElement>(null);
 useEffect(()=>{const node=host.current;if(!node)return;const list=node.querySelector<HTMLElement>('[role=tablist]'),indicator=node.querySelector<HTMLElement>('.ptabs-indicator');if(!list||!indicator)return;let frame=0,previous=0,ready=false;let position=[0,0,0,0],velocity=[0,0,0,0],target=[0,0,0,0];const media=matchMedia('(prefers-reduced-motion: reduce)');
 const paint=()=>{indicator.style.left=`${position[0]}px`;indicator.style.top=`${position[1]}px`;indicator.style.width=`${position[2]}px`;indicator.style.height=`${position[3]}px`;};
 const step=(time:number)=>{const dt=Math.min((time-previous)/1000||1/60,1/30);previous=time;let moving=false;for(let i=0;i<4;i++){const force=360*(target[i]-position[i])-30*velocity[i];velocity[i]+=force*dt;position[i]+=velocity[i]*dt;if(Math.abs(target[i]-position[i])>.03||Math.abs(velocity[i])>.03)moving=true;}paint();if(moving)frame=requestAnimationFrame(step);else{position=[...target];paint();frame=0;}};
 const update=()=>{const selected=list.querySelector<HTMLElement>('[role=tab][aria-selected=true]');if(!selected||!selected.offsetWidth)return;target=[selected.offsetLeft,selected.offsetTop,selected.offsetWidth,selected.offsetHeight];if(!ready||media.matches){position=[...target];velocity=[0,0,0,0];ready=true;cancelAnimationFrame(frame);frame=0;paint();}else if(!frame){previous=performance.now();frame=requestAnimationFrame(step);}};
 const mutations=new MutationObserver(update);mutations.observe(list,{subtree:true,attributes:true,attributeFilter:['aria-selected']});const resize=new ResizeObserver(update);resize.observe(list);list.querySelectorAll('[role=tab]').forEach(t=>resize.observe(t));media.addEventListener('change',update);document.fonts?.ready.then(update);update();return()=>{cancelAnimationFrame(frame);mutations.disconnect();resize.disconnect();media.removeEventListener('change',update);};
 },[]);
 return <div className="product-tabs-motion" ref={host}><PremiumTabs {...props}/></div>;
}
