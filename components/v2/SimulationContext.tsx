"use client";
import { createContext, useContext, useEffect, useReducer, useState, type Dispatch, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { initialSimulation, simulationReducer, type SimAction, type SimulationState } from "@/lib/v2/simulation-state";
import { personas } from "@/lib/v2/campus-simulation";
const SimulationContext=createContext<{state:SimulationState;dispatch:Dispatch<SimAction>}>({state:initialSimulation(),dispatch:()=>{}});
const STORAGE="ingenium-synthetic-campus-v1";
export function SimulationProvider({children}:{children:ReactNode}) {
  const [state,dispatch]=useReducer(simulationReducer,undefined,()=>initialSimulation());
  const [ready,setReady]=useState(false);
  const path=usePathname();
  useEffect(()=>{
    const restore=()=>{
      let next=initialSimulation();
      try{const saved=sessionStorage.getItem(STORAGE);if(saved){const value=JSON.parse(saved);if(value.version===1&&value.student&&value.staff)next=value;}}catch{}
      const mode=new URLSearchParams(location.search).get("mode");
      if(mode==="staff"||mode==="student")next={...next,mode};
      dispatch({type:"hydrate",state:next});setReady(true);
    };
    queueMicrotask(restore);
    const onPop=()=>{const mode=new URLSearchParams(location.search).get("mode");if(mode==="student"||mode==="staff")dispatch({type:"mode",mode});};
    window.addEventListener("popstate",onPop);return()=>window.removeEventListener("popstate",onPop);
  },[]);
  useEffect(()=>{if(!ready)return;try{sessionStorage.setItem(STORAGE,JSON.stringify(state));}catch{}},[state,ready]);
  useEffect(()=>{
    if(!ready)return;
    const params=new URLSearchParams(location.search);
    const mode=params.get("mode");
    if((mode==="staff"||mode==="student")&&mode!==state.mode)queueMicrotask(()=>dispatch({type:"mode",mode}));
  },[path,ready,state.mode]);
  return <SimulationContext.Provider value={{state,dispatch}}>{children}</SimulationContext.Provider>;
}
export function useSimulation(){const context=useContext(SimulationContext);return {...context,persona:personas[context.state.mode],personal:context.state[context.state.mode]};}
export function SimulationNotice(){return <div className="simulation-note"><span className="demo-content-label">CAMPUS SIMULATION</span><span>Adam and Paul are demo personas. Participation, colleagues, chats, resources and workshop bookings are synthetic. Your demo changes stay in this browser tab.</span></div>;}
