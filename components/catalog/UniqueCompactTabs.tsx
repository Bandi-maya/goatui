"use client";
import {ProductTabs} from './ProductTabs';
import './UniqueCompactTabs.css';
export function MilestoneTabNav(){return <section className="unique-nav milestone-nav"><ProductTabs label="Preference groups" items={['Interest','Skill','Availability'].map((label,i)=>({id:String(i),label,content:<p>{['Choose what you want to learn.','Set a comfortable starting level.','Make room for a regular session.'][i]}</p>}))}/></section>}
export function TicketTabNav(){return <section className="unique-nav ticket-nav"><ProductTabs label="Trip documents" items={['Route','Stays','Saved'].map((label,i)=>({id:String(i),label,content:<p>{['Lisbon to Porto, four days along the coast.','Three places to stay near the water.','Places worth keeping for the next trip.'][i]}</p>}))}/></section>}
