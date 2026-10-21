import { MessageWorkspace } from "@/components/v2/MessageWorkspace";
export const metadata={title:"Messages"};
export default async function MessagesPage({searchParams}:{searchParams:Promise<{thread?:string}>}){const query=await searchParams;return <main id="main-content" className="campus-main inner-campus"><MessageWorkspace initialThread={query.thread}/></main>;}
