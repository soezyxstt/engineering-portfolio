"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import type { Project } from "@/data/portfolio";

type FeaturedWorkIndexProps = {
  projects: Project[];
};

export function FeaturedWorkIndex({ projects }: FeaturedWorkIndexProps) {
  const [activeSlug, setActiveSlug] = useState(projects[0]?.slug ?? "");
  const activeProject = projects.find((project) => project.slug === activeSlug) ?? projects[0];

  if (!activeProject) return null;

  return (
    <div className="featured-index">
      <div className="featured-preview" style={{ "--project-accent": activeProject.accent } as React.CSSProperties}>
        <div className="featured-preview-media">
          {activeProject.image ? (
            <Image
              key={activeProject.image}
              src={activeProject.image}
              alt={`Interface preview for ${activeProject.title}`}
              fill
              sizes="(max-width: 900px) 100vw, 46vw"
              className="featured-preview-image"
            />
          ) : (
            <div className="featured-scara" role="img" aria-label="Simplified two-joint SCARA mechanism">
              <span className="featured-scara-axis axis-horizontal" />
              <span className="featured-scara-axis axis-vertical" />
              <span className="featured-scara-joint joint-base">J1</span>
              <span className="featured-scara-arm arm-primary" />
              <span className="featured-scara-joint joint-elbow">J2</span>
              <span className="featured-scara-arm arm-secondary" />
              <span className="featured-scara-tool">TCP</span>
              <span className="featured-scara-note">CONTROLLED PLANAR SYSTEM / 2 DOF</span>
            </div>
          )}
          <span className="featured-preview-label">Active case / {activeProject.year}</span>
        </div>
        <div className="featured-preview-caption">
          <p>{activeProject.evidence}</p>
          <div>
            {activeProject.liveUrl ? (
              <a href={activeProject.liveUrl} target="_blank" rel="noreferrer">
                Live <ArrowUpRight size={13} />
              </a>
            ) : null}
            {activeProject.repoUrl ? (
              <a href={activeProject.repoUrl} target="_blank" rel="noreferrer">
                Source <ArrowUpRight size={13} />
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <div className="featured-list" aria-label="Featured project case studies">
        {projects.map((project, index) => {
          const isActive = project.slug === activeProject.slug;

          return (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              className={`featured-row ${isActive ? "is-active" : ""}`}
              onMouseEnter={() => setActiveSlug(project.slug)}
              onFocus={() => setActiveSlug(project.slug)}
            >
              <span className="featured-row-index">{String(index + 1).padStart(2, "0")}</span>
              <span className="featured-row-copy">
                <span className="featured-row-eyebrow">{project.eyebrow.replace("Flagship / ", "")}</span>
                <strong>{project.title}</strong>
                <span className="featured-row-summary">{project.summary}</span>
                <span className="featured-row-meta">{project.role} · {project.year}</span>
              </span>
              <ArrowRight className="featured-row-arrow" size={20} aria-hidden />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
