"use client";

import { useEffect, useState } from "react";

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine)");
    if (!media.matches) return;

    const handleMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
      setIsVisible(true);
    };

    const handleEnter = () => setIsVisible(true);
    const handleLeave = () => setIsVisible(false);

    const handleHoverCheck = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const interactive = target?.closest("a, button, [role='button'], .cursor-hit");
      setIsHovering(Boolean(interactive));
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseover", handleHoverCheck);
    document.addEventListener("mouseenter", handleEnter);
    document.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleHoverCheck);
      document.removeEventListener("mouseenter", handleEnter);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  const size = isHovering ? 46 : 26;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[100] hidden md:block"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        opacity: isVisible ? 1 : 0,
        transition: "opacity 160ms ease-out",
      }}
    >
      {/* Technical crosshair reticle */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{
          width: size,
          height: size,
          transition: "width 200ms cubic-bezier(0.2,0.8,0.2,1), height 200ms cubic-bezier(0.2,0.8,0.2,1)",
        }}
      >
        {/* center dot */}
        <span
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
          style={{ width: 3, height: 3 }}
        />
        {/* crosshair arms */}
        <span className="absolute left-1/2 top-0 -translate-x-1/2 h-[6px] w-px bg-accent/70" />
        <span className="absolute left-1/2 bottom-0 -translate-x-1/2 h-[6px] w-px bg-accent/70" />
        <span className="absolute top-1/2 left-0 -translate-y-1/2 w-[6px] h-px bg-accent/70" />
        <span className="absolute top-1/2 right-0 -translate-y-1/2 w-[6px] h-px bg-accent/70" />
        {/* corner ticks */}
        <span className="absolute top-0 left-0 w-2 h-2 border-l border-t border-accent/60" />
        <span className="absolute top-0 right-0 w-2 h-2 border-r border-t border-accent/60" />
        <span className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-accent/60" />
        <span className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-accent/60" />
      </div>
    </div>
  );
}
