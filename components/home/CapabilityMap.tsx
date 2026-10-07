"use client";

import { useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Plus } from "lucide-react";
import { capabilityGroups } from "@/data/portfolio";

export function CapabilityMap() {
  const [active, setActive] = useState<number | null>(0);
  const id = useId();
  const reduced = useReducedMotion();

  return (
    <div className="capability-ledger">
      {capabilityGroups.map((group, index) => {
        const open = active === index;
        return (
          <article key={group.label} className="capability-disclosure">
            <h3>
              <button type="button" id={`${id}-trigger-${index}`} aria-expanded={open} aria-controls={`${id}-panel-${index}`} onClick={() => setActive(open ? null : index)}>
                <span className="capability-number">{String(index + 1).padStart(2, "0")}</span>
                {group.label}
                <motion.span className="capability-toggle" aria-hidden animate={{ rotate: open ? 45 : 0 }} transition={{ duration: reduced ? 0 : 0.3 }}><Plus size={20} /></motion.span>
              </button>
            </h3>
            <motion.div id={`${id}-panel-${index}`} role="region" aria-labelledby={`${id}-trigger-${index}`} aria-hidden={!open} inert={!open} className="capability-content" initial={false} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }} transition={{ duration: reduced ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}>
              <div className="capability-content-inner">
                <ul>{group.capabilities.map((capability) => <li key={capability}>{capability}</li>)}</ul>
                <p><span>Demonstrated in</span>{group.projects.join(" · ")}</p>
              </div>
            </motion.div>
          </article>
        );
      })}
    </div>
  );
}
