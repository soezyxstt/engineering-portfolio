"use client";

import Image from "next/image";
import { Link } from "next-view-transitions";
import { motion, Variants } from "framer-motion";
import cadData from "@/data/cad.json";
import { ModelViewerClient } from "@/components/cad/ModelViewerClient";
import type { Hotspot } from "@/components/cad/ModelViewer";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

/* A technical "gear drawing" placeholder shown until a real render is supplied. */
function BlueprintGearTile() {
  const teeth = Array.from({ length: 24 });
  const bolts = Array.from({ length: 6 });
  return (
    <svg
      viewBox="0 0 100 100"
      className="h-2/3 w-2/3 animate-spin text-accent"
      style={{ animationDuration: "26s" }}
      fill="none"
      aria-hidden
    >
      {/* crosshair */}
      <line x1="50" y1="4" x2="50" y2="96" stroke="currentColor" strokeOpacity="0.12" strokeWidth="0.4" />
      <line x1="4" y1="50" x2="96" y2="50" stroke="currentColor" strokeOpacity="0.12" strokeWidth="0.4" />
      {/* pitch + root circles */}
      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.5" strokeDasharray="2 2" />
      <circle cx="50" cy="50" r="34" stroke="currentColor" strokeOpacity="0.55" strokeWidth="0.8" />
      <circle cx="50" cy="50" r="9" stroke="currentColor" strokeOpacity="0.7" strokeWidth="0.8" />
      {/* teeth ticks, with coordinates rounded so server and client SSR strings match exactly */}
      {teeth.map((_, i) => {
        const a = (i / teeth.length) * Math.PI * 2;
        const x1 = (50 + Math.cos(a) * 34).toFixed(3);
        const y1 = (50 + Math.sin(a) * 34).toFixed(3);
        const x2 = (50 + Math.cos(a) * 40).toFixed(3);
        const y2 = (50 + Math.sin(a) * 40).toFixed(3);
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeOpacity="0.5" strokeWidth="0.7" />
        );
      })}
      {/* bolt circle */}
      <circle cx="50" cy="50" r="22" stroke="currentColor" strokeOpacity="0.25" strokeWidth="0.4" strokeDasharray="1 2" />
      {bolts.map((_, i) => {
        const a = (i / bolts.length) * Math.PI * 2;
        const cx = (50 + Math.cos(a) * 22).toFixed(3);
        const cy = (50 + Math.sin(a) * 22).toFixed(3);
        return <circle key={i} cx={cx} cy={cy} r="2.2" stroke="currentColor" strokeOpacity="0.5" strokeWidth="0.6" />;
      })}
    </svg>
  );
}

export function CadGallery() {
  return (
    <section id="cad" className="w-full max-w-[92rem] mx-auto px-5 md:px-6 py-32">
      <div className="flex items-end justify-between gap-6 mb-4">
        <h2 className="font-display font-extrabold text-6xl md:text-8xl tracking-tight transition-all duration-1000 starting:opacity-0 starting:translate-y-8">
          Engineering / CAD
        </h2>
        <span className="coord-readout hidden sm:block pb-3 whitespace-nowrap">
          <span className="text-accent">/02</span> · {cadData.length} models
        </span>
      </div>
      <div className="flex items-center gap-3 mb-12">
        <span className="coord-readout text-accent">3D · INTERACTIVE</span>
        <span className="dim-line flex-1" />
        <span className="coord-readout hidden md:inline">drag to orbit · click to open</span>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        {cadData.map((cad, index) => (
          <motion.div key={cad.id} variants={item}>
            <Link
              href={`/cad/${cad.id}`}
              className="cursor-hit group relative block border border-border hover:border-accent/40 transition-colors duration-500"
            >
              <span className="corner corner-tl z-20 opacity-50 group-hover:opacity-100 transition-opacity" />
              <span className="corner corner-tr z-20 opacity-50 group-hover:opacity-100 transition-opacity" />
              <span className="corner corner-bl z-20 opacity-50 group-hover:opacity-100 transition-opacity" />
              <span className="corner corner-br z-20 opacity-50 group-hover:opacity-100 transition-opacity" />

              {/* viewport tile */}
              <div className="relative aspect-[4/3] overflow-hidden bg-surface/40">
                <span className="absolute top-3 left-3 z-20 font-mono-ui text-[10px] uppercase tracking-[0.14em] text-accent">
                  M-{String(index + 1).padStart(2, "0")}
                </span>
                <span className="absolute top-3 right-3 z-20 coord-readout">{cad.software}</span>

                {cad.model ? (
                  <div className="absolute inset-0">
                    <ModelViewerClient model={cad.model} hotspots={cad.hotspots as Hotspot[]} />
                  </div>
                ) : cad.poster ? (
                  <Image
                    src={cad.poster}
                    alt={cad.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BlueprintGearTile />
                    <span className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono-ui text-[9px] uppercase tracking-[0.24em] text-[color:var(--muted)]">
                      3D model · placeholder
                    </span>
                  </div>
                )}

                {/* hover overlay */}
                <div className="absolute inset-0 bg-[rgba(10,12,16,0.78)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="inline-flex items-center gap-2 font-mono-ui text-[11px] uppercase tracking-[0.16em] text-accent border border-accent/40 px-3 py-1.5 glow-pill">
                    Open viewer <span className="text-base leading-none">↗</span>
                  </span>
                </div>
              </div>

              {/* meta */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-2 mb-2 coord-readout">
                  <span className="text-accent">{cad.category}</span>
                  <span className="dim-line flex-1" />
                  <span>{cad.specs.dimensions}</span>
                </div>
                <h3 className="font-display font-bold text-2xl tracking-tight text-foreground group-hover:text-accent transition-colors">
                  {cad.title}
                </h3>
                <p className="mt-1 font-mono-ui text-[11px] tracking-[0.08em] text-[color:var(--muted)]">
                  {cad.specs.material} · {cad.specs.parts} parts
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
