"use client";
import {INPUT_FAMILY} from "./InputFamily";
export default function InputCatalog({index}:{index:number}){const Component=INPUT_FAMILY[index]?.Component;return Component?<div className="ifx" style={{width:"min(100%,560px)",colorScheme:"light"}}><div className="ifx-item"><Component/></div></div>:null;}
