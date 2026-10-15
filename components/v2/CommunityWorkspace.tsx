"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  Heart,
  MessageCircle,
  RotateCcw,
  Search,
  Send,
  Users,
} from "lucide-react";
import type { Entity } from "@/lib/data";
import {
  demoGroups,
  demoMessages,
  demoPosts,
  demoProfiles,
} from "@/lib/v2/demo-community";

type Tab = "feed" | "groups" | "messages";

export function CommunityWorkspace({
  realCommunities,
}: {
  realCommunities: Entity[];
}) {
  const [tab, setTab] = useState<Tab>("feed");
  const [joined, setJoined] = useState<string[]>(["ai-across-campuses"]);
  const [liked, setLiked] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [messages, setMessages] = useState(demoMessages);
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState(demoPosts);
  const [postDraft, setPostDraft] = useState("");
  const [composing, setComposing] = useState(false);

  function reset() {
    setTab("feed");
    setJoined(["ai-across-campuses"]);
    setLiked([]);
    setSaved([]);
    setMessages(demoMessages);
    setDraft("");
    setQuery("");
    setPosts(demoPosts);
    setPostDraft("");
    setComposing(false);
  }

  const matchingGroups = demoGroups.filter((group) =>
    `${group.name} ${group.description} ${group.topic}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  return (
    <div className="community-shell">
      <div className="demo-boundary" role="note">
        <div>
          <strong>Interactive demonstration · every person, post and message below is synthetic.</strong>
          <p>
            Real INGENIUM records are linked and identified separately. Nothing
            is sent, published or saved after this page is refreshed.
          </p>
        </div>
        <button onClick={reset}><RotateCcw size={15} /> Reset demo</button>
      </div>

      <div className="community-tabs" aria-label="Community views">
        {(["feed", "groups", "messages"] as const).map((value) => (
          <button key={value} aria-pressed={tab === value} onClick={() => setTab(value)}>
            {value === "feed" ? "Campus feed" : value === "groups" ? "Groups" : "Messages"}
          </button>
        ))}
      </div>

      {tab === "feed" && (
        <div className="community-layout">
          <aside className="demo-profile-card">
            <span className="demo-avatar">YO</span>
            <strong>You · local demo</strong>
            <p>Explore how a future INGENIUM profile and network could feel.</p>
            <dl><div><dt>Joined groups</dt><dd>{joined.length}</dd></div><div><dt>Saved posts</dt><dd>{saved.length}</dd></div></dl>
            <Link href="/my-campus">Open My Campus →</Link>
          </aside>
          <section className="social-feed" aria-label="Synthetic campus feed">
            <div className="demo-composer">
              <span className="demo-avatar demo-avatar--small">YO</span>
              <button onClick={() => setComposing((old) => !old)}>Share a question with a demo group…</button>
            </div>
            {composing && <form className="demo-post-form" onSubmit={(event) => {
              event.preventDefault();
              if (!postDraft.trim()) return;
              setPosts((old) => [{...demoPosts[0],id:`local-post-${old.length}`,authorId:"you-demo",age:"Now",body:postDraft.trim(),reactions:0,comments:0},...old]);
              setPostDraft("");
              setComposing(false);
            }}><label htmlFor="local-demo-post">Post to the AI across campuses demo group</label><textarea id="local-demo-post" value={postDraft} onChange={(event)=>setPostDraft(event.target.value)} maxLength={800} rows={4}/><button disabled={!postDraft.trim()}>Add local demo post</button></form>}
            {posts.map((post) => {
              const author = demoProfiles.find((profile) => profile.id === post.authorId) ?? {initials:"YO",name:"You · local demo",role:"Demo visitor",university:"This tab"};
              const group = demoGroups.find((item) => item.id === post.groupId)!;
              const isLiked = liked.includes(post.id);
              const isSaved = saved.includes(post.id);
              return (
                <article className="social-post" key={post.id}>
                  <header>
                    <span className="demo-avatar demo-avatar--small">{author.initials}</span>
                    <div><strong>{author.name}</strong><span>{author.role} · {author.university}</span><small>{group.name} · {post.age} · synthetic</small></div>
                    <span className="demo-content-label">DEMO</span>
                  </header>
                  <p>{post.body}</p>
                  <Link className="linked-real-record" href={`/records/${post.linkedRecordSlug}`}>
                    <span>REAL INGENIUM RECORD</span>{post.linkedRecordLabel} →
                  </Link>
                  <div className="post-stats"><span>{post.reactions + (isLiked ? 1 : 0)} reactions</span><span>{post.comments} sample comments</span></div>
                  <footer>
                    <button aria-pressed={isLiked} onClick={() => setLiked((old) => isLiked ? old.filter((id) => id !== post.id) : [...old, post.id])}><Heart size={16} fill={isLiked ? "currentColor" : "none"} /> Useful</button>
                    <button onClick={() => setTab("messages")}><MessageCircle size={16} /> Discuss</button>
                    <button aria-pressed={isSaved} onClick={() => setSaved((old) => isSaved ? old.filter((id) => id !== post.id) : [...old, post.id])}><Bookmark size={16} fill={isSaved ? "currentColor" : "none"} /> Save</button>
                  </footer>
                </article>
              );
            })}
          </section>
          <aside className="community-side-panel">
            <span className="eyebrow">REAL NETWORK ROUTES</span>
            <h3>Official communities</h3>
            {realCommunities.slice(0, 4).map((community) => (
              <Link href={`/records/${community.slug}`} key={community.id}><strong>{community.title}</strong><span>Source-backed record →</span></Link>
            ))}
            <Link className="all-communities" href="/communities">See the full verified directory</Link>
          </aside>
        </div>
      )}

      {tab === "groups" && (
        <section className="groups-view">
          <div className="groups-heading"><div><span className="eyebrow">SYNTHETIC GROUP DIRECTORY</span><h2>Find a conversation to join.</h2></div><label><Search size={16} /><span className="sr-only">Search demo groups</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search topics" /></label></div>
          <div className="group-grid">
            {matchingGroups.map((group) => {
              const isJoined = joined.includes(group.id);
              return <article className="group-card" key={group.id}><span className="demo-content-label">DEMO GROUP</span><Users size={22} /><h3>{group.name}</h3><p>{group.description}</p><span>{group.members} fictional members · {group.topic}</span><Link href={`/records/${group.linkedRecordSlug}`}>Real reference: {group.linkedRecordLabel} →</Link><button aria-pressed={isJoined} onClick={() => setJoined((old) => isJoined ? old.filter((id) => id !== group.id) : [...old, group.id])}>{isJoined ? "Leave demo group" : "Join demo group"}</button></article>;
            })}
          </div>
        </section>
      )}

      {tab === "messages" && (
        <section className="messages-view">
          <aside><span className="eyebrow">SYNTHETIC INBOX</span><h2>Project group</h2>{demoProfiles.slice(0, 3).map((profile) => <div key={profile.id}><span className="demo-avatar demo-avatar--small">{profile.initials}</span><span><strong>{profile.name}</strong><small>{profile.university} · demo profile</small></span></div>)}</aside>
          <div className="chat-panel">
            <header><div><strong>SeismicX idea team</strong><span>3 fictional participants · no live presence</span></div><span className="demo-content-label">DEMO CHAT</span></header>
            <div className="chat-messages" aria-live="polite">
              {messages.map((message) => {
                const profile = demoProfiles.find((item) => item.id === message.profileId);
                return <div className={message.profileId === "you-demo" ? "is-you" : ""} key={message.id}><strong>{profile?.name ?? "You · local demo"}</strong><p>{message.text}</p><small>{message.time} · synthetic</small></div>;
              })}
            </div>
            <form onSubmit={(event) => {event.preventDefault(); const text = draft.trim(); if (!text) return; setMessages((old) => [...old, {id: `local-${old.length}`, profileId: "you-demo", text, time: "Now", synthetic: true}]); setDraft("");}}><label className="sr-only" htmlFor="demo-message">Write a local demo message</label><input id="demo-message" value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={400} placeholder="Write a local demo message…" /><button aria-label="Add message to local demo" disabled={!draft.trim()}><Send size={17} /></button></form>
          </div>
        </section>
      )}
    </div>
  );
}
