import type { Project } from "@/data/portfolio";

export function ArchitectureDiagram({ project }: { project: Project }) {
  return (
    <div className="architecture" role="img" aria-label={`${project.title} system architecture`}>
      <div className="architecture-flow" aria-hidden>
        {project.architecture.map((layer, index) => (
          <div className="architecture-step" key={layer.label}>
            <div className="architecture-node">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{layer.label}</strong>
              <small>{layer.detail}</small>
            </div>
            {index < project.architecture.length - 1 ? <span className="architecture-line" /> : null}
          </div>
        ))}
      </div>
      <ol className="architecture-fallback">
        {project.architecture.map((layer) => (
          <li key={layer.label}>
            <strong>{layer.label}:</strong> {layer.detail}
          </li>
        ))}
      </ol>
    </div>
  );
}

