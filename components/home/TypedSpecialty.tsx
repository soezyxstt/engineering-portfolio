"use client";

import { useEffect, useState } from "react";

const specialties = ["full stack products", "AI learning systems", "robotics interfaces", "platform infrastructure"];

export function TypedSpecialty() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [length, setLength] = useState(specialties[0].length);
  const [deleting, setDeleting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReducedMotion(query.matches);
    syncPreference();
    query.addEventListener("change", syncPreference);
    return () => query.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const phrase = specialties[phraseIndex];
    const complete = length === phrase.length;
    const empty = length === 0;
    const delay = complete && !deleting ? 1500 : deleting ? 34 : 62;
    const timer = window.setTimeout(() => {
      if (complete && !deleting) {
        setDeleting(true);
      } else if (empty && deleting) {
        setDeleting(false);
        setPhraseIndex((current) => (current + 1) % specialties.length);
      } else {
        setLength((current) => current + (deleting ? -1 : 1));
      }
    }, delay);
    return () => window.clearTimeout(timer);
  }, [deleting, length, phraseIndex, reducedMotion]);

  const visibleText = reducedMotion ? specialties[0] : specialties[phraseIndex].slice(0, length);

  return (
    <span className="typed-specialty">
      <span aria-hidden="true">{visibleText}<span className="typed-caret" /></span>
      <span className="sr-only">full stack products, AI learning systems, robotics interfaces, and platform infrastructure</span>
    </span>
  );
}
