import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/portfolio";

type ProjectCardProps = {
  project: Project;
  index: number;
  large?: boolean;
};

export function ProjectCard({ project, index, large = false }: ProjectCardProps) {
  return (
    <article
      className={`project-card ${large ? "project-card-large" : ""} ${large && index % 2 === 0 ? "project-card-reversed" : ""}`}
      style={{ "--project-accent": project.accent, "--reveal-delay": `${Math.min(index - 1, 4) * 70}ms` } as React.CSSProperties}
      data-reveal
    >
      <Link href={`/work/${project.slug}`} className="project-card-link">
        <div className="project-visual">
          {project.image ? (
            <Image
              src={project.image}
              alt={`Interface preview for ${project.title}`}
              fill
              sizes={large ? "(max-width: 900px) 100vw, 72vw" : "(max-width: 900px) 100vw, 50vw"}
              className="project-image"
            />
          ) : (
            <div className="scara-sketch" aria-label="Simplified SCARA mechanism diagram">
              <span className="axis axis-x">X</span>
              <span className="axis axis-y">Y</span>
              <span className="joint joint-one" />
              <span className="arm arm-one" />
              <span className="joint joint-two" />
              <span className="arm arm-two" />
              <span className="end-effector" />
              <span className="arc arc-one" />
              <span className="arc arc-two" />
              <span className="sketch-label label-one">J1 / DC</span>
              <span className="sketch-label label-two">J2 / STEPPER</span>
              <span className="sketch-label label-three">TCP</span>
            </div>
          )}
          <span className="project-index">{String(index).padStart(2, "0")}</span>
          <span className="project-open" aria-hidden>
            Open case study <ArrowUpRight size={14} />
          </span>
        </div>
        <div className="project-card-copy">
          <p className="kicker">{project.eyebrow}</p>
          <h3>{project.title}</h3>
          <p>{project.summary}</p>
          <div className="project-meta">
            <span>{project.role}</span>
            <span>{project.year}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
