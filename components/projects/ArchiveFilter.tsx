"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { archiveEntries, type Discipline } from "@/data/portfolio";

const filters: Array<"All" | Discipline> = [
  "All",
  "Robotics",
  "Mechanical",
  "Embedded",
  "Control",
  "Software",
  "Platform",
  "Product",
  "Leadership",
];

export function ArchiveFilter() {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const visible = useMemo(
    () =>
      active === "All"
        ? archiveEntries
        : archiveEntries.filter((entry) => entry.disciplines.includes(active)),
    [active],
  );

  return (
    <div>
      <div className="filter-row" aria-label="Filter project archive">
        {filters.map((filter) => (
          <button
            type="button"
            key={filter}
            className={active === filter ? "is-active" : ""}
            aria-pressed={active === filter}
            onClick={() => setActive(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
      <div className="archive-table" aria-live="polite">
        {visible.map((entry, index) => {
          const external = entry.href.startsWith("http");
          const content = (
            <>
              <span className="archive-number">{String(index + 1).padStart(2, "0")}</span>
              <strong>{entry.title}</strong>
              <span>{entry.disciplines.join(" · ")}</span>
              <span>{entry.year}</span>
              <ArrowUpRight size={16} aria-hidden />
            </>
          );

          return external ? (
            <a key={entry.slug} href={entry.href} target="_blank" rel="noreferrer" className="archive-row">
              {content}
            </a>
          ) : (
            <Link key={entry.slug} href={entry.href} className="archive-row">
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

