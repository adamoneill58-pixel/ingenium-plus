"use client";
import { useEffect, useRef, useState } from "react";
import type { Core } from "cytoscape";
import type { Entity } from "@/lib/data";
import { useSimulation } from "./SimulationContext";
import { connectionInfo, simulationEdges } from "@/lib/v2/simulation-state";
interface Edge {
  id: string;
  source: string;
  target: string;
  label: string;
  explanation: string;
}
export default function NetworkCanvas({
  records,
  selected,
  onSelect,
  publicEntry = false,
}: {
  records: Entity[];
  selected: string;
  onSelect: (id: string) => void;
  publicEntry?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const cy = useRef<Core | null>(null);
  const [error, setError] = useState("");
  const [explanation, setExplanation] = useState("");
  const [depth, setDepth] = useState(1);
  const {state,personal,persona}=useSimulation();
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    Promise.all([
      import("cytoscape"),
      fetch("/api/v2/network", { signal: controller.signal }).then(
        async (r) => {
          if (!r.ok) throw new Error("Network data unavailable");
          return r.json() as Promise<{ relationships: Edge[] }>;
        },
      ),
    ])
      .then(([module, data]) => {
        if (cancelled || !ref.current) return;
        const allowed = new Map(records.map((r) => [r.id, r]));
        const relationships=publicEntry?data.relationships:[...data.relationships,...simulationEdges(state.mode,personal)];
        let display = records;
        if (selected && allowed.has(selected)) {
          const ids = new Set([selected]);
          for (let d = 0; d < depth; d++) {
            const frontier = new Set(ids);
            for (const e of relationships)
              if (frontier.has(e.source) || frontier.has(e.target)) {
                if (allowed.has(e.source)) ids.add(e.source);
                if (allowed.has(e.target)) ids.add(e.target);
              }
          }
          if(allowed.has(persona.id))ids.add(persona.id);
          display = records.filter((r) => ids.has(r.id));
        }
        const ids = new Set(display.map((r) => r.id));
        cy.current = module.default({
          container: ref.current,
          elements: [
            ...display.map((r) => ({
              data: { id: r.id, label: r.shortTitle ?? r.title, kind: r.type,degree:publicEntry?4:r.id===persona.id?0:connectionInfo(r,state.mode,personal).degree,root:!publicEntry&&r.id===persona.id?1:0 },
            })),
            ...relationships
              .filter((e) => ids.has(e.source) && ids.has(e.target))
              .map((e) => ({ data: e })),
          ],
          layout: { name: "concentric", concentric:(node)=>6-Number(node.data("degree")),levelWidth:()=>1,minNodeSpacing:35,animate:false },
          style: [
            {
              selector: "node",
              style: {
                "background-color": "#007b65",
                label: "data(label)",
                color: "#ecf8f4",
                "font-size": 11,
                "text-wrap": "wrap",
                "text-max-width": "100px",
                "text-valign": "bottom",
                "text-margin-y": 8,
                width: 18,
                height: 18,
              },
            },
            {
              selector: 'node[kind="university"]',
              style: { "background-color": "#94d7be", width: 32, height: 32 },
            },
            {selector:'node[kind="person"]',style:{"background-color":"#df3984","border-width":3,"border-color":"#fff",width:30,height:30}},
            {selector:'node[degree=1]',style:{"border-width":3,"border-color":"#bbe86a",width:26,height:26}},
            {selector:'node[degree=2]',style:{"border-width":2,"border-color":"#00a3d7"}},
            {selector:'node[root=1]',style:{"background-color":"#fff","border-color":"#df3984","border-width":6,color:"#fff",width:56,height:56,"font-size":16}},
            {
              selector: "edge",
              style: {
                width: 1,
                "line-color": "#52766c",
                "curve-style": "bezier",
                opacity: 0.45,
              },
            },
            {
              selector: ":selected",
              style: {
                "background-color": "#00a5dc",
                "line-color": "#00a5dc",
                width: 25,
                height: 25,
              },
            },
          ],
        });
        cy.current.on("tap", "node", (e) => onSelect(e.target.id()));
        cy.current.on("tap", "edge", (e) =>
          setExplanation(
            `${e.target.data("label")}: ${e.target.data("explanation")}`,
          ),
        );
      })
      .catch(() => {
        if (!cancelled)
          setError(
            "The graph could not load. Use the List view to explore the same records.",
          );
      });
    return () => {
      cancelled = true;
      controller.abort();
      cy.current?.destroy();
    };
  }, [records, selected, depth, onSelect,state.mode,personal,persona.id,publicEntry]);
  return (
    <section className="network-surface">
      <div className="network-tools">
        <span>{publicEntry?"Source-backed catalogue · explore the connections":`${persona.firstName}’s network · people + activities · connection tiers 1–4+`}</span>
        <div>
          <button
            onClick={() => cy.current?.zoom(cy.current.zoom() * 1.2)}
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            onClick={() => cy.current?.zoom(cy.current.zoom() / 1.2)}
            aria-label="Zoom out"
          >
            −
          </button>
          <button onClick={() => cy.current?.fit(undefined, 40)}>Fit</button>
          <label>
            Depth{" "}
            <select
              value={depth}
              onChange={(e) => setDepth(Number(e.target.value))}
            >
              <option value={1}>1 connection</option>
              <option value={2}>2 connections</option>
            </select>
          </label>
        </div>
      </div>
      {error ? (
        <p role="alert">{error}</p>
      ) : (
        <div
          ref={ref}
          className="network-canvas"
          role="img"
          aria-label="Interactive opportunity network. An equivalent List view is available above."
        />
      )}
      <p className="network-caption" role="status">
        {explanation ||
          "Select a record to focus its connections. Select a line to read the evidence behind it."}
      </p>
    </section>
  );
}
