import { Link } from "next-view-transitions";
import { MoveLeft } from "lucide-react";
import { notFound } from "next/navigation";
import cadData from "@/data/cad.json";
import { ModelViewerClient } from "@/components/cad/ModelViewerClient";
import type { Hotspot } from "@/components/cad/ModelViewer";

export async function generateStaticParams() {
  return cadData.map((cad) => ({ slug: cad.id }));
}

export default async function CadPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const model = cadData.find((m) => m.id === slug);

  if (!model) return notFound();

  const specRows: { label: string; value: string }[] = [
    { label: "Software", value: model.software },
    { label: "Material", value: model.specs.material },
    { label: "Parts", value: model.specs.parts },
    { label: "Dimensions", value: model.specs.dimensions },
    { label: "Mass", value: model.specs.mass },
  ];

  return (
    <article className="w-full max-w-[92rem] mx-auto px-5 md:px-6 py-28 flex flex-col gap-12 min-h-screen">
      <div className="flex flex-col gap-6">
        <Link
          href="/#cad"
          className="cursor-hit flex items-center gap-2 text-xs font-mono-ui font-medium uppercase tracking-[0.16em] text-[color:var(--muted)] hover:text-accent transition-colors w-fit"
        >
          <MoveLeft className="w-4 h-4" />
          Back to CAD
        </Link>

        <div className="flex items-center gap-3">
          <span className="coord-readout text-accent">CAD · {slug.toUpperCase()}</span>
          <span className="dim-line flex-1" />
          <span className="coord-readout hidden sm:inline">{model.category}</span>
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight">
          {model.title}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Interactive viewer */}
        <div className="lg:col-span-8 order-2 lg:order-1">
          <div className="relative h-[60vh] min-h-[420px] w-full overflow-hidden border border-border bg-[#0b0f16] glow-cyan">
            <span className="corner corner-tl z-20" />
            <span className="corner corner-tr z-20" />
            <span className="corner corner-bl z-20" />
            <span className="corner corner-br z-20" />
            <ModelViewerClient
              model={model.model}
              hotspots={(model.hotspots ?? []) as Hotspot[]}
            />
          </div>
          {!model.model && (
            <p className="mt-3 font-mono-ui text-[10px] uppercase tracking-[0.14em] text-[color:var(--muted)]">
              ▲ Showing a procedural placeholder — drop{" "}
              <span className="text-accent">/public/models/{model.id}.glb</span> in to load
              the real assembly.
            </p>
          )}
        </div>

        {/* Spec title block */}
        <aside className="lg:col-span-4 order-1 lg:order-2">
          <div className="border border-border">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-surface/40">
              <span className="font-mono-ui text-[11px] uppercase tracking-[0.16em] text-accent">
                Title Block
              </span>
              <span className="coord-readout">REV · A</span>
            </div>
            <dl className="divide-y divide-[color:var(--border)]">
              {specRows.map((row) => (
                <div key={row.label} className="grid grid-cols-[120px_1fr] gap-3 px-4 py-3">
                  <dt className="coord-readout pt-0.5">{row.label}</dt>
                  <dd className="font-mono-ui text-sm text-[color:var(--text)]">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="coord-readout text-accent">NOTES</span>
              <span className="dim-line flex-1" />
            </div>
            <p className="text-[0.98rem] leading-relaxed text-[color:var(--text)]/80">
              {model.description}
            </p>
          </div>
        </aside>
      </div>
    </article>
  );
}
