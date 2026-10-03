import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/portfolio";
import { WebsitePreview } from "./WebsitePreview";

export function ProjectCard({ project, index, large = false }: { project: Project; index: number; large?: boolean }) {
  return (
    <article
      className={`website-showcase-card${large ? " website-showcase-card-wide" : ""}`}
      style={{ "--project-accent": project.accent, "--reveal-delay": `${Math.min(index - 1, 4) * 70}ms` } as React.CSSProperties}
      data-reveal
    >
      <WebsitePreview project={project} />
      <div className="website-showcase-copy">
        <h3><Link href={`/work/${project.slug}`}>{project.title}</Link></h3>
        <p>{project.summary}</p>
        <div className="website-showcase-links">
          <Link href={`/work/${project.slug}`}>Case study <ArrowRight size={15} aria-hidden /></Link>
          {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">Visit site <ArrowUpRight size={15} aria-hidden /></a>}
          {project.repoUrl && <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">Source <ArrowUpRight size={15} aria-hidden /></a>}
        </div>
      </div>
    </article>
  );
}
