import { ArrowUpRight } from "lucide-react";
import { publicBuilds } from "@/data/portfolio";

export function PublicBuildIndex() {
  return (
    <div className="public-build-index">
      {publicBuilds.map((project, index) => (
        <article key={project.slug} className="public-build-row">
          <span className="public-build-number">{String(index + 1).padStart(2, "0")}</span>
          <div className="public-build-title">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
          </div>
          <div className="public-build-stack" aria-label={`Technology used for ${project.title}`}>
            {project.stack.map((item) => <span key={item}>{item}</span>)}
          </div>
          <div className="public-build-links">
            {project.liveUrl ? (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={`Open live ${project.title}`}>
                Live <ArrowUpRight size={13} />
              </a>
            ) : null}
            <a href={project.repoUrl} target="_blank" rel="noreferrer" aria-label={`Open source for ${project.title}`}>
              Code <ArrowUpRight size={13} />
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
