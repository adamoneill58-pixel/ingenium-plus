"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { usePathname } from "next/navigation";
const Enabled = createContext(false);
export function PilotContext({
  enabled,
  children,
}: {
  enabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <Enabled.Provider value={enabled}>
      {children}
      <VisitTracker enabled={enabled} />
    </Enabled.Provider>
  );
}
export function usePilotEvent() {
  const enabled = useContext(Enabled);
  return useCallback(
    (event: string, target: string, campus?: string) => {
      if (enabled)
        void fetch("/api/v2/events", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            event,
            target,
            ...(campus ? { campus } : {}),
          }),
          keepalive: true,
        }).catch(() => {});
    },
    [enabled],
  );
}
export function usePilotEnabled() {
  return useContext(Enabled);
}
function VisitTracker({ enabled }: { enabled: boolean }) {
  const path = usePathname();
  const last = useRef("");
  useEffect(() => {
    if (!enabled || last.current === path) return;
    last.current = path;
    const campus = /^\/pilot\/(mtu|xamk|tuiasi)$/.exec(path)?.[1];
    const target = path.startsWith("/records/") ? "/records/[slug]" : path;
    const allowed = [
      "/",
      "/explore",
      "/calendar",
      "/my-campus",
      "/learning",
      "/collaborate",
      "/universities",
      "/survey",
      "/about-pilot",
      "/records/[slug]",
    ];
    if (campus || allowed.includes(target))
      void fetch("/api/v2/events", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          event: "page_view",
          target,
          ...(campus ? { campus } : {}),
        }),
        keepalive: true,
      }).catch(() => {});
  }, [path, enabled]);
  return null;
}
export function Useful({ id }: { id: string }) {
  const enabled = usePilotEnabled();
  const send = usePilotEvent();
  const [selected, setSelected] = useState(false);
  if (!enabled) return null;
  return (
    <fieldset className="useful">
      <legend>Was this useful?</legend>
      {selected ? (
        <span role="status">Thank you for your feedback.</span>
      ) : (
        ["Yes", "No"].map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => {
              send(label === "Yes" ? "useful_yes" : "useful_no", id);
              setSelected(true);
            }}
          >
            {label}
          </button>
        ))
      )}
    </fieldset>
  );
}
