import type { Project } from "@/data/portfolio";
import { ProjectCard } from "@/components/projects/ProjectCard";

export function FeaturedWorkIndex({ projects }: { projects: Project[] }) {
  return (
    <div className="website-showcase-grid">
      {projects.map((project, index) => (
        <ProjectCard key={project.slug} project={project} index={index + 1} />
      ))}
    </div>
  );
}
