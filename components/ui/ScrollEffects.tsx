"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function ScrollEffects() {
  const pathname = usePathname();
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = Array.from(document.querySelectorAll<HTMLElement>("main > section, main .page-section, [data-reveal]"));
    targets.forEach((target) => target.setAttribute("data-reveal", ""));

    if (reduceMotion) {
      targets.forEach((target) => target.classList.add("is-revealed"));
      return;
    }

    root.classList.add("motion-ready");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: "0px 0px -8% 0px" },
    );
    targets.forEach((target) => observer.observe(target));

    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.max(0, Math.min(window.scrollY / scrollable, 1)) : 0;
      progressRef.current?.style.setProperty("transform", `scaleX(${progress})`);
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateProgress);
      root.classList.remove("motion-ready");
    };
  }, [pathname]);

  return <div className="scroll-progress" aria-hidden="true"><span ref={progressRef} /></div>;
}
