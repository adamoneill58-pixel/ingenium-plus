"use client";
import { GraduationCap, BriefcaseBusiness } from "lucide-react";
import { useSimulation } from "./v2/SimulationContext";
import { useRouter } from "next/navigation";
export function ModeSwitcher() {
  const {state,dispatch}=useSimulation();
  const router=useRouter();
  return <div className="persona-mode-switch" aria-label="Student or staff demo mode">{(["student","staff"] as const).map((mode)=>{const Icon=mode==="student"?GraduationCap:BriefcaseBusiness;return <button key={mode} aria-pressed={state.mode===mode} onClick={()=>{if(location.pathname.startsWith("/campus/")){router.push(`/campus?mode=${mode}`);return;}const url=new URL(location.href);url.searchParams.set("mode",mode);url.searchParams.delete("node");history.replaceState(null,"",url.pathname+url.search);dispatch({type:"mode",mode});}}><Icon size={16}/><span>{mode==="student"?"Student":"Staff"}</span></button>;})}</div>;
}
