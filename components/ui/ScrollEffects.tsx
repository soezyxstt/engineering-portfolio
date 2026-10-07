"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { inView, motion, scroll, useAnimate, useReducedMotion, useScroll, useSpring } from "motion/react";

const revealSelector = [
  "h1", "h2", ".section-intro", ".hero-statement", ".hero-actions", ".hero-links",
  ".hero-proof > div", ".route-hero-grid", ".about-intro > p", ".about-actions",
  "article:not(.case-study):not(.website-showcase-card)", ".website-showcase-preview",
  ".website-showcase-copy", ".profile-photo-frame", ".about-portrait", ".profile-copy > p",
  ".profile-facts > div", ".academic-details > div", ".founder-copy", ".case-summary",
  ".case-meta-grid > div", ".case-visual", ".narrative-columns > div", "figure",
].join(", ");

export function ScrollEffects({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [scope, animate] = useAnimate<HTMLElement>();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 30 });

  useEffect(() => {
    const main = scope.current;
    if (!main || reduced !== false || pathname.startsWith("/admin") || pathname === "/resume") return;

    const candidates = Array.from(main.querySelectorAll<HTMLElement>(revealSelector));
    const targets = candidates.filter((target) => !target.parentElement?.closest(revealSelector));
    const originals = targets.map((target) => [target, target.style.opacity, target.style.transform, target.style.clipPath] as const);
    const animations: ReturnType<typeof animate>[] = [];
    const pending = new Set(targets);

    targets.forEach((target) => {
      target.style.opacity = "0";
      target.style.transform = "translateY(24px)";
    });

    const reveal = (target: HTMLElement, immediate = false) => {
      if (!pending.delete(target)) return;
      const image = target.matches(".website-showcase-preview, .profile-photo-frame, .about-portrait, .case-visual, figure");
      const siblings = targets.filter((sibling) => sibling.parentElement === target.parentElement);
      animations.push(animate(target, {
        opacity: 1, y: 0,
        ...(image ? { clipPath: ["inset(0 0 12% 0)", "inset(0 0 0% 0)"] } : {}),
      }, { duration: immediate ? 0 : 0.75, delay: immediate ? 0 : Math.min(siblings.indexOf(target), 4) * 0.07, ease: [0.19, 1, 0.22, 1] }));
    };
    const stopReveal = inView(targets, (element) => reveal(element as HTMLElement), { amount: 0.12, margin: "0px 0px -5% 0px" });
    const onFocus = (event: FocusEvent) => {
      if (event.target instanceof Node) targets.filter((target) => target.contains(event.target as Node)).forEach((target) => reveal(target, true));
    };
    main.addEventListener("focusin", onFocus);

    // Small portrait drift adds depth without moving text or changing scroll behavior.
    const portrait = main.querySelector<HTMLElement>(".profile-photo-frame, .about-portrait");
    const image = portrait?.querySelector("img");
    const originalImageTransform = image?.style.transform ?? "";
    let stopParallax: (() => void) | undefined;
    if (portrait && image && window.matchMedia("(min-width: 801px) and (pointer: fine)").matches) {
      const drift = animate(image, { y: [-12, 12], scale: 1.04 }, { ease: "linear", autoplay: false });
      animations.push(drift);
      stopParallax = scroll(drift, { target: portrait, offset: ["start end", "end start"] });
    }

    return () => {
      stopReveal();
      stopParallax?.();
      animations.forEach((animation) => animation.stop());
      main.removeEventListener("focusin", onFocus);
      originals.forEach(([target, opacity, transform, clipPath]) => Object.assign(target.style, { opacity, transform, clipPath }));
      if (image) image.style.transform = originalImageTransform;
    };
  }, [pathname, reduced, scope, animate]);

  return (
    <>
      <div className="scroll-progress" aria-hidden="true"><motion.span style={{ scaleX: reduced ? scrollYProgress : progress }} /></div>
      <main id="main-content" ref={scope}>{children}</main>
    </>
  );
}
