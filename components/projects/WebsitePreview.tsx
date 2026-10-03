"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Maximize2, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { Project } from "@/data/portfolio";

function PreviewImage({ project }: { project: Project }) {
  if (project.image) return <Image src={project.image} alt={`Preview of ${project.title}`} fill sizes="(max-width: 800px) 100vw, 50vw" className="website-showcase-image" />;
  return (
    <div className="scara-sketch" role="img" aria-label="Simplified SCARA robot mechanism">
      <span className="axis axis-x">X</span><span className="axis axis-y">Y</span>
      <span className="joint joint-one" /><span className="arm arm-one" />
      <span className="joint joint-two" /><span className="arm arm-two" />
      <span className="end-effector" /><span className="arc arc-one" /><span className="arc arc-two" />
      <span className="sketch-label label-one">J1 / DC</span><span className="sketch-label label-two">J2 / STEPPER</span><span className="sketch-label label-three">TCP</span>
    </div>
  );
}

export function WebsitePreview({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const [showScreenshot, setShowScreenshot] = useState(false);
  const [frameState, setFrameState] = useState<"loading" | "loaded" | "unavailable">("loading");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const trigger = triggerRef.current;
    if (!dialog) return;
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open || frameState !== "loading") return;
    const timeout = window.setTimeout(() => setFrameState("unavailable"), 12000);
    return () => window.clearTimeout(timeout);
  }, [open, frameState]);

  return (
    <>
      <div className="website-showcase-preview">
        {project.liveUrl ? (
          <button type="button" ref={triggerRef} className="website-showcase-trigger" aria-label={`Preview ${project.title}`} aria-haspopup="dialog" onClick={() => { setFrameState("loading"); setShowScreenshot(false); setOpen(true); }}>
            <PreviewImage project={project} />
            <span className="website-showcase-preview-action"><Maximize2 size={15} aria-hidden /> Preview site</span>
          </button>
        ) : (
          <Link href={`/work/${project.slug}`} className="website-showcase-trigger" aria-label={`View ${project.title} case study`}>
            <PreviewImage project={project} />
            <span className="website-showcase-preview-action">View case study <ArrowUpRight size={15} aria-hidden /></span>
          </Link>
        )}
      </div>
      {open && project.liveUrl && (
        <dialog ref={dialogRef} className="website-preview-dialog" aria-labelledby={titleId} onCancel={() => setOpen(false)} onClose={() => setOpen(false)} onClick={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
          <div className="website-preview-panel">
            <header className="website-preview-header">
              <h2 id={titleId}>{project.title}</h2>
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">Open site <ArrowUpRight size={16} aria-hidden /></a>
              <button autoFocus type="button" aria-label={`Close ${project.title} preview`} onClick={() => setOpen(false)}><X size={22} aria-hidden /></button>
            </header>
            <p className="website-preview-help">Explore the site below. If it does not appear, open it in a new tab.</p>
            <button type="button" className="website-preview-switch" aria-pressed={showScreenshot} onClick={() => { if (showScreenshot || frameState === "unavailable") { setShowScreenshot(false); if (frameState === "unavailable") setFrameState("loading"); } else { setShowScreenshot(true); } }}>{showScreenshot || frameState === "unavailable" ? "Try live preview" : "Show screenshot"}</button>
            <div className="website-preview-body" aria-busy={!showScreenshot && frameState === "loading"}>
              {(showScreenshot || frameState !== "loaded") && <div className="website-preview-fallback"><PreviewImage project={project} />{!showScreenshot && <div role="status">{frameState === "loading" ? "Loading website…" : "The embedded preview is unavailable."}{frameState === "unavailable" && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">Open the live site <ArrowUpRight size={15} aria-hidden /></a>}</div>}</div>}
              {frameState !== "unavailable" && <iframe className={frameState === "loaded" && !showScreenshot ? "is-loaded" : ""} src={project.liveUrl} title={`${project.title} live website`} referrerPolicy="strict-origin-when-cross-origin" onLoad={() => setFrameState("loaded")} onError={() => setFrameState("unavailable")} />}
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
