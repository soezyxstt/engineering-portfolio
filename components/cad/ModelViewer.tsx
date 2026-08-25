"use client";

import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Grid,
  Center,
  Bounds,
  Html,
  ContactShadows,
  useGLTF,
} from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export type Hotspot = {
  position: [number, number, number];
  label: string;
};

type ModelViewerProps = {
  /** Path to a .glb file under /public (e.g. "/models/gearbox.glb"), or null for the procedural placeholder. */
  model: string | null;
  hotspots?: Hotspot[];
};

/* -------------------------------------------------------------------------- */
/* Procedural placeholder — a metallic gear, shown until a real GLB is added. */
/* -------------------------------------------------------------------------- */
function makeGearGeometry({
  teeth = 18,
  outerR = 1.25,
  rootR = 1.02,
  boreR = 0.34,
  depth = 0.42,
} = {}) {
  const shape = new THREE.Shape();
  const segs = teeth * 2;
  const step = (Math.PI * 2) / segs;
  for (let i = 0; i < segs; i++) {
    const r = i % 2 === 0 ? outerR : rootR;
    const a = i * step;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();

  const bore = new THREE.Path();
  bore.absarc(0, 0, boreR, 0, Math.PI * 2, true);
  shape.holes.push(bore);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 2,
    steps: 1,
  });
  geo.center();
  geo.computeVertexNormals();
  return geo;
}

function PlaceholderModel({ wireframe }: { wireframe: boolean }) {
  const geometry = useMemo(() => makeGearGeometry(), []);
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          color="#aebfd2"
          metalness={0.85}
          roughness={0.34}
          wireframe={wireframe}
        />
      </mesh>
      {/* central hub */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.5, 48]} />
        <meshStandardMaterial
          color="#8aa0bb"
          metalness={0.9}
          roughness={0.28}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* Real GLB model                                                             */
/* -------------------------------------------------------------------------- */
function GlbModel({ url, wireframe }: { url: string; wireframe: boolean }) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    cloned.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const materials = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];
        materials.forEach((m) => {
          (m as THREE.MeshStandardMaterial).wireframe = wireframe;
        });
      }
    });
  }, [cloned, wireframe]);

  return <primitive object={cloned} />;
}

/* -------------------------------------------------------------------------- */
/* Hotspot annotations                                                        */
/* -------------------------------------------------------------------------- */
function Hotspots({ hotspots }: { hotspots: Hotspot[] }) {
  return (
    <>
      {hotspots.map((h, i) => (
        <Html
          key={`${h.label}-${i}`}
          position={h.position}
          center
          distanceFactor={8}
          occlude
        >
          <div className="flex items-center gap-2 whitespace-nowrap select-none">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
            </span>
            <span className="font-mono-ui text-[10px] uppercase tracking-[0.14em] text-foreground bg-background/80 border border-accent/30 px-2 py-0.5 backdrop-blur-sm">
              {h.label}
            </span>
          </div>
        </Html>
      ))}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Loader fallback                                                            */
/* -------------------------------------------------------------------------- */
function SceneLoader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 border border-accent/30 border-t-accent rounded-full animate-spin" />
        <span className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-[color:var(--muted)]">
          Loading model…
        </span>
      </div>
    </Html>
  );
}

/* -------------------------------------------------------------------------- */
/* Toolbar                                                                     */
/* -------------------------------------------------------------------------- */
function ToolButton({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`cursor-hit font-mono-ui text-[10px] uppercase tracking-[0.14em] px-2.5 py-1.5 border transition-colors ${
        active
          ? "border-accent text-background bg-accent"
          : "border-border text-[color:var(--muted)] hover:text-accent hover:border-accent/50 bg-background/60"
      }`}
    >
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Main viewer                                                                */
/* -------------------------------------------------------------------------- */
export default function ModelViewer({ model, hotspots = [] }: ModelViewerProps) {
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  return (
    <div
      data-lenis-prevent
      className="cursor-canvas relative w-full h-full"
    >
      <Canvas
        shadows="soft"
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [3.2, 2.2, 4.2], fov: 45 }}
      >
        {/* studio lighting tuned for dark blueprint scene */}
        <hemisphereLight args={["#cfe6ff", "#0a0c10", 0.45]} />
        <ambientLight intensity={0.25} />
        <directionalLight
          position={[5, 6, 4]}
          intensity={1.4}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-5, 3, -4]} intensity={0.5} color="#9bd4ff" />
        {/* cyan accent rim light */}
        <pointLight position={[-3, 1.5, 3]} intensity={18} color="#38e1ff" distance={12} />

        <Suspense fallback={<SceneLoader />}>
          <Bounds fit clip observe margin={1.25}>
            <Center>
              {model ? (
                <GlbModel url={model} wireframe={wireframe} />
              ) : (
                <PlaceholderModel wireframe={wireframe} />
              )}
            </Center>
          </Bounds>
          {hotspots.length > 0 && <Hotspots hotspots={hotspots} />}
        </Suspense>

        <ContactShadows
          position={[0, -1.35, 0]}
          opacity={0.5}
          scale={12}
          blur={2.4}
          far={4}
          color="#0a0c10"
        />

        {showGrid && (
          <Grid
            position={[0, -1.35, 0]}
            args={[24, 24]}
            cellSize={0.5}
            cellThickness={0.6}
            cellColor="#1d3a52"
            sectionSize={2.5}
            sectionThickness={1}
            sectionColor="#2f6bff"
            fadeDistance={26}
            fadeStrength={1.5}
            infiniteGrid
            followCamera={false}
          />
        )}

        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.08}
          autoRotate={autoRotate}
          autoRotateSpeed={0.9}
          minDistance={2}
          maxDistance={12}
          makeDefault
        />
      </Canvas>

      {/* Toolbar */}
      <div className="absolute top-3 right-3 z-10 flex flex-wrap gap-1.5">
        <ToolButton active={autoRotate} onClick={() => setAutoRotate((v) => !v)}>
          {autoRotate ? "spin ◷" : "spin ✕"}
        </ToolButton>
        <ToolButton active={wireframe} onClick={() => setWireframe((v) => !v)}>
          wire
        </ToolButton>
        <ToolButton active={showGrid} onClick={() => setShowGrid((v) => !v)}>
          grid
        </ToolButton>
        <ToolButton onClick={() => controlsRef.current?.reset()}>reset</ToolButton>
      </div>

      {/* Corner readout */}
      <div className="absolute bottom-3 left-3 z-10 coord-readout pointer-events-none">
        drag · orbit &nbsp;|&nbsp; scroll · zoom
      </div>
    </div>
  );
}
