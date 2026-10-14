"use client";

import { Bookmark, BookmarkCheck, CalendarPlus, Check, Copy, Flag, X } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { Entity } from "@/lib/data";
import {
  JOINED_KEY,
  readSemester,
  readStringList,
  RECENT_KEY,
  REPORTS_KEY,
  SAVED_KEY,
  SEMESTER_KEY,
  storeSnapshot,
  subscribeStore,
  writeJson,
} from "@/lib/local-store";
import { addSemesterItem, removeSemesterItem } from "@/lib/v15-logic";

const learningTypes = new Set(["module", "course", "microcredential", "learning_resource", "bip", "programme", "pathway"]);

export function RecordActions({ entity }: { entity: Entity }) {
  useSyncExternalStore(subscribeStore, storeSnapshot, () => "");
  const saved = readStringList(SAVED_KEY).includes(entity.id);
  const joined = readStringList(JOINED_KEY).includes(entity.id);
  const planned = readSemester().some((item) => item.entityId === entity.id);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportText, setReportText] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const recent = readStringList(RECENT_KEY).filter((id) => id !== entity.id);
    writeJson(RECENT_KEY, [entity.id, ...recent].slice(0, 8));
  }, [entity.id]);

  const toggleList = (key: string, active: boolean) => {
    const next = new Set(readStringList(key));
    if (active) next.delete(entity.id); else next.add(entity.id);
    writeJson(key, [...next]);
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setNotice("Link copied");
    } catch {
      setNotice("Copy the address from your browser to share this record");
    }
  };

  const submitReport = () => {
    if (!reportText.trim()) return;
    const reports = readStringList(REPORTS_KEY);
    writeJson(REPORTS_KEY, [...reports, `${entity.id}: ${reportText.trim()}`]);
    setReportText("");
    setReportOpen(false);
    setNotice("Report saved on this device for prototype review")
  };

  return (
    <div className="record-actions">
      <button className="button button--secondary" type="button" aria-pressed={saved} onClick={() => toggleList(SAVED_KEY, saved)}>{saved ? <BookmarkCheck aria-hidden="true" /> : <Bookmark aria-hidden="true" />}{saved ? "Saved" : "Save"}</button>
      {learningTypes.has(entity.type) && <button className="button button--secondary" type="button" aria-pressed={planned} onClick={() => writeJson(SEMESTER_KEY, planned ? removeSemesterItem(readSemester(), entity.id) : addSemesterItem(readSemester(), entity.id))}>{planned ? <Check aria-hidden="true" /> : <CalendarPlus aria-hidden="true" />}{planned ? "In semester" : "Add to semester"}</button>}
      {entity.type !== "student" && <button className="button button--secondary" type="button" aria-pressed={joined} onClick={() => toggleList(JOINED_KEY, joined)}>{joined ? <Check aria-hidden="true" /> : <CalendarPlus aria-hidden="true" />}{joined ? "Joined locally" : "Mark as joined"}</button>}
      <button className="button button--secondary" type="button" onClick={share}><Copy aria-hidden="true" />Share</button>
      <button className="button button--secondary" type="button" onClick={() => setReportOpen(true)}><Flag aria-hidden="true" />Report outdated info</button>
      {notice && <p className="action-notice" role="status">{notice}</p>}
      {reportOpen && (
        <div className="inline-report" role="dialog" aria-modal="false" aria-labelledby="report-title">
          <button className="icon-button" type="button" aria-label="Close report form" onClick={() => setReportOpen(false)}><X aria-hidden="true" /></button>
          <h2 id="report-title">What looks outdated?</h2>
          <p>This prototype stores the note only in your browser; it does not send it to INGENIUM.</p>
          <label><span>Correction or concern</span><textarea value={reportText} onChange={(event) => setReportText(event.target.value)} rows={4} placeholder="Describe the date, status or link that needs checking." /></label>
          <button className="button button--primary" type="button" disabled={!reportText.trim()} onClick={submitReport}>Save local report</button>
        </div>
      )}
    </div>
  );
}
