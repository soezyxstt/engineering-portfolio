"use client";

import dynamic from "next/dynamic";
import type { Hotspot } from "./ModelViewer";

function ViewerSkeleton() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
      <div className="h-8 w-8 border border-accent/30 border-t-accent rounded-full animate-spin" />
      <span className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-[color:var(--muted)]">
        Initializing viewer…
      </span>
    </div>
  );
}

// `ssr: false` must live inside a Client Component (Next.js 16 requirement).
const ModelViewer = dynamic(() => import("./ModelViewer"), {
  ssr: false,
  loading: () => <ViewerSkeleton />,
});

type ModelViewerClientProps = {
  model: string | null;
  hotspots?: Hotspot[];
};

export function ModelViewerClient({ model, hotspots }: ModelViewerClientProps) {
  return <ModelViewer model={model} hotspots={hotspots} />;
}
