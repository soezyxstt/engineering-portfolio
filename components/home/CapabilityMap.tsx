"use client";

import { useState } from "react";
import { capabilityGroups } from "@/data/portfolio";

export function CapabilityMap() {
  const [active, setActive] = useState(0);
  const selected = capabilityGroups[active];

  return (
    <div className="capability-map">
      <div className="capability-tabs" role="tablist" aria-label="Engineering capability layers">
        {capabilityGroups.map((group, index) => (
          <button
            type="button"
            role="tab"
            aria-selected={active === index}
            aria-controls="capability-panel"
            id={`capability-tab-${index}`}
            key={group.label}
            onClick={() => setActive(index)}
            className={active === index ? "is-active" : ""}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {group.label}
          </button>
        ))}
      </div>
      <div
        className="capability-panel"
        id="capability-panel"
        role="tabpanel"
        aria-labelledby={`capability-tab-${active}`}
      >
        <div className="capability-orbit" aria-hidden>
          <span className="orbit-core">SYSTEM</span>
          {selected.capabilities.map((capability, index) => (
            <span className={`orbit-label orbit-label-${index + 1}`} key={capability}>
              {capability}
            </span>
          ))}
        </div>
        <div className="capability-detail">
          <p className="kicker">Active layer</p>
          <h3>{selected.label}</h3>
          <ul>
            {selected.capabilities.map((capability) => (
              <li key={capability}>{capability}</li>
            ))}
          </ul>
          <p className="capability-projects">
            <span>Demonstrated in</span>
            {selected.projects.join(" · ")}
          </p>
        </div>
      </div>
    </div>
  );
}

