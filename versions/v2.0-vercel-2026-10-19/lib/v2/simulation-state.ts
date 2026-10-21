import type { Entity } from "../data";
import { personas, simPeople, simSpaces, simThreads, spaceEntityId, type CampusMode, type ConnectionDegree, type SimMessage } from "./campus-simulation";

export interface PersonaState {joined:string[]; connections:string[]; messages:Record<string,SimMessage[]>; completed:string[]; workshops:string[]; readThreads:string[]; drafts:Record<string,string>; proposals:Record<string,string>; liked:string[]; posts:{id:string;body:string;spaceId:string}[];}
export interface SimulationState {version:1; mode:CampusMode; student:PersonaState; staff:PersonaState; notice:string;}
function seed(mode:CampusMode):PersonaState {return {joined:[...personas[mode].joinedSpaceIds],connections:[...personas[mode].connectedIds],messages:{},completed:simSpaces.filter((space)=>space.mode===mode).flatMap((space)=>space.tasks.filter((task)=>task.status==="Done").map((task)=>task.id)),workshops:[],readThreads:[],drafts:{},proposals:{},liked:[],posts:[]};}
export function initialSimulation(mode:CampusMode="student"):SimulationState {return {version:1,mode,student:seed("student"),staff:seed("staff"),notice:""};}
export type SimAction =
  | {type:"hydrate";state:SimulationState}
  | {type:"mode";mode:CampusMode}
  | {type:"reset"}
  | {type:"join";id:string}
  | {type:"connect";id:string}
  | {type:"message";id:string;text:string}
  | {type:"read";id:string}
  | {type:"task";id:string}
  | {type:"workshop";id:string}
  | {type:"draft";id:string;text:string}
  | {type:"proposal";id:string;stage:string}
  | {type:"like";id:string}
  | {type:"post";spaceId:string;text:string};
const toggle=(items:string[],id:string)=>items.includes(id)?items.filter((item)=>item!==id):[...items,id];
export function simulationReducer(state:SimulationState,action:SimAction):SimulationState {
  if(action.type==="hydrate") return action.state.version===1 ? {...action.state,notice:""} : state;
  if(action.type==="mode") return {...state,mode:action.mode,notice:""};
  if(action.type==="reset") return {...state,[state.mode]:seed(state.mode),notice:"This demo persona has been reset."};
  const mode=state.mode, current=state[mode];
  const finish=(next:PersonaState,notice="")=>({...state,[mode]:next,notice});
  if(action.type==="join") {
    if(!simSpaces.some((space)=>space.id===action.id&&space.mode===mode)) return state;
    return finish({...current,joined:toggle(current.joined,action.id)},"Demo membership updated.");
  }
  if(action.type==="connect") {
    if(!simPeople.some((person)=>person.id===action.id&&person.modes.includes(mode))) return state;
    return finish({...current,connections:toggle(current.connections,action.id)},"Demo connection updated. Map and network priorities now reflect this change.");
  }
  if(action.type==="message"||action.type==="read") {
    const thread=simThreads.find((item)=>item.id===action.id&&item.mode===mode);
    if(!thread) return state;
    if(thread.spaceId&&!current.joined.includes(thread.spaceId)) return finish(current,"Join this demo workspace before contributing to its chat.");
    if(action.type==="read") return finish({...current,readThreads:[...new Set([...current.readThreads,action.id])]});
    const text=action.text.trim().slice(0,1500);
    if(!text) return state;
    const list=current.messages[action.id]??[];
    return finish({...current,messages:{...current.messages,[action.id]:[...list,{id:`local-${mode}-${action.id}-${list.length}`,authorId:personas[mode].id,text,time:"Now · local demo"}]},readThreads:[...new Set([...current.readThreads,action.id])]},"Message added to the local simulation.");
  }
  if(action.type==="task") {
    if(!simSpaces.some((space)=>space.mode===mode&&space.tasks.some((task)=>task.id===action.id))) return state;
    return finish({...current,completed:toggle(current.completed,action.id)});
  }
  if(action.type==="workshop") {
    const conference=simSpaces.find((space)=>space.mode===mode&&space.workshops?.some((workshop)=>workshop.id===action.id));
    const workshop=conference?.workshops?.find((item)=>item.id===action.id);
    if(!workshop||!conference) return state;
    if(current.workshops.includes(action.id)) return finish({...current,workshops:current.workshops.filter((id)=>id!==action.id)},"Your simulated workshop booking has been cancelled.");
    if(!current.joined.includes(conference.id)) return finish(current,"Join the demo conference before choosing a workshop.");
    if(workshop.booked>=workshop.capacity) return finish(current,"This sample workshop is full. Choose another session.");
    const clash=conference.workshops?.find((other)=>current.workshops.includes(other.id)&&other.day===workshop.day&&other.start<workshop.end&&workshop.start<other.end);
    if(clash) return finish(current,`Time clash with ${clash.title}. Cancel that sample booking first.`);
    return finish({...current,workshops:[...current.workshops,action.id]},"Workshop added to your simulated conference plan. No real registration was made.");
  }
  if(action.type==="draft") {
    if(!simSpaces.some((space)=>space.mode===mode&&space.resources.some((resource)=>resource.id===action.id))) return state;
    return finish({...current,drafts:{...current.drafts,[action.id]:action.text.slice(0,18000)}},"Draft saved in this browser tab.");
  }
  if(action.type==="proposal") {
    if(!["Concept draft","Partner review","Ready for discussion"].includes(action.stage)||!simSpaces.some((space)=>space.mode===mode&&space.id===action.id&&space.kind==="research")) return state;
    return finish({...current,proposals:{...current.proposals,[action.id]:action.stage}},"Simulated proposal stage updated. Nothing was submitted.");
  }
  if(action.type==="like") return finish({...current,liked:toggle(current.liked,action.id)});
  if(action.type==="post") {
    if(!current.joined.includes(action.spaceId)||!action.text.trim()) return state;
    return finish({...current,posts:[{id:`local-post-${mode}-${current.posts.length}`,spaceId:action.spaceId,body:action.text.trim().slice(0,1500)},...current.posts]},"Post added to your local campus feed.");
  }
  return state;
}

export function connectionInfo(record:Entity,mode:CampusMode,state:PersonaState):{degree:ConnectionDegree;label:string;reason:string} {
  const p=personas[mode];
  if(record.id===p.id) return {degree:1,label:"You",reason:"Your simulated profile is the centre of this campus."};
  const membership=simSpaces.find((space)=>space.mode===mode&&state.joined.includes(space.id)&&spaceEntityId(space)===record.id);
  if(membership) return {degree:1,label:"1st · Joined",reason:`You participate in ${membership.title} in this simulation.`};
  if(state.connections.includes(record.id)) return {degree:1,label:"1st · Connected",reason:"A direct connection in your simulated network."};
  const text=`${record.title} ${record.studentSummary} ${record.themes.join(" ")}`.toLowerCase();
  const interest=p.interests.find((topic)=>text.includes(topic));
  if(interest&&record.type!=="university") return {degree:2,label:mode==="student"?"2nd · Degree related":"2nd · Work related",reason:`Related to ${mode==="student"?"your Software Development degree":"your teaching/research interests"} through “${interest}”. Topic relevance does not confirm eligibility.`};
  const person=simPeople.find((item)=>item.id===record.id);
  const mutual=person?.connectedTo.find((id)=>state.connections.includes(id));
  if(mutual) return {degree:3,label:"3rd · Through a connection",reason:`Connected through ${simPeople.find((item)=>item.id===mutual)?.name??"a demo contact"}.`};
  const shared=simSpaces.find((space)=>space.mode===mode&&spaceEntityId(space)===record.id&&space.memberIds.some((id)=>state.connections.includes(id)));
  if(shared) return {degree:3,label:"3rd · Through your network",reason:"Someone in your demo network participates here."};
  return {degree:4,label:"4th+ · Wider alliance",reason:"A wider-alliance discovery beyond your direct activities and study/work topics."};
}
export function prioritiseConnections(records:Entity[],mode:CampusMode,state:PersonaState,filter="all") {
  return records.map((record,index)=>({record,index,connection:connectionInfo(record,mode,state)}))
    .filter((item)=>filter==="all"||(filter==="3+"?item.connection.degree>=3:String(item.connection.degree)===filter))
    .sort((a,b)=>a.connection.degree-b.connection.degree||a.index-b.index).map((item)=>item.record);
}
export function simulationEdges(mode:CampusMode,state:PersonaState) {
  const root=personas[mode].id;
  const edges:{id:string;source:string;target:string;label:string;explanation:string}[]=[];
  const add=(source:string,target:string,label:string)=>edges.push({id:`sim-edge-${source}-${target}`,source,target,label,explanation:`Synthetic relationship: ${label.toLowerCase()}.`});
  state.connections.forEach((id)=>add(root,id,"Connected with"));
  simSpaces.filter((space)=>space.mode===mode).forEach((space)=>{
    const id=spaceEntityId(space);
    if(state.joined.includes(space.id)) add(root,id,"Participates in demo workspace");
    space.memberIds.filter((person)=>person!==root).forEach((person)=>add(person,id,"Sample participant"));
  });
  simPeople.filter((person)=>person.modes.includes(mode)).forEach((person)=>person.connectedTo.forEach((target)=>{if(person.id<target)add(person.id,target,"Demo colleague / peer");}));
  return edges;
}
