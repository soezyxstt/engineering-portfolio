"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Maximize2, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Project } from "@/data/portfolio";

const MotionLink = motion.create(Link);

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
  const reduced = useReducedMotion();
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
      <motion.div className="website-showcase-preview" initial="rest" whileHover="hover" transition={{ duration: reduced ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}>
        {project.liveUrl ? (
          <motion.button type="button" ref={triggerRef} className="website-showcase-trigger" whileFocus="hover" aria-label={`Preview ${project.title}`} aria-haspopup="dialog" onClick={() => { setFrameState("loading"); setShowScreenshot(false); setOpen(true); }}>
            <motion.div className="website-showcase-media" variants={{ rest: { scale: 1 }, hover: { scale: reduced ? 1 : 1.035 } }} transition={{ duration: reduced ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}><PreviewImage project={project} /></motion.div>
            <motion.span className="website-showcase-preview-action" variants={{ rest: { y: 0 }, hover: { y: reduced ? 0 : -5 } }} transition={{ duration: reduced ? 0 : 0.35 }}><Maximize2 size={15} aria-hidden /> Preview site</motion.span>
          </motion.button>
        ) : (
          <MotionLink href={`/work/${project.slug}`} className="website-showcase-trigger" whileFocus="hover" aria-label={`View ${project.title} case study`}>
            <motion.div className="website-showcase-media" variants={{ rest: { scale: 1 }, hover: { scale: reduced ? 1 : 1.035 } }} transition={{ duration: reduced ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}><PreviewImage project={project} /></motion.div>
            <motion.span className="website-showcase-preview-action" variants={{ rest: { y: 0 }, hover: { y: reduced ? 0 : -5 } }} transition={{ duration: reduced ? 0 : 0.35 }}>View case study <ArrowUpRight size={15} aria-hidden /></motion.span>
          </MotionLink>
        )}
      </motion.div>
      {open && project.liveUrl && (
        <dialog ref={dialogRef} className="website-preview-dialog" aria-labelledby={titleId} onCancel={() => setOpen(false)} onClose={() => setOpen(false)} onClick={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
          <motion.div className="website-preview-panel" initial={reduced ? false : { opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}>
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
          </motion.div>
        </dialog>
      )}
    </>
  );
}
