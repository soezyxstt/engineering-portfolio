import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Project } from "@/data/portfolio";

type DisciplineLandingProps = {
  eyebrow: string;
  title: string;
  intro: string;
  statement: string;
  projects: Project[];
  capabilities: Array<{ title: string; detail: string }>;
};

export function DisciplineLanding({ eyebrow, title, intro, statement, projects, capabilities }: DisciplineLandingProps) {
  return (
    <>
      <section className="route-hero route-hero-discipline">
        <p className="kicker"><span>Field note</span>{eyebrow}</p>
        <h1>{title}</h1>
        <div className="route-hero-grid">
          <p className="route-lead">{intro}</p>
          <p>{statement}</p>
        </div>
      </section>
      <section className="page-section discipline-work">
        <SectionHeading index="01" eyebrow="Relevant work" title={`Selected ${eyebrow.toLowerCase()} systems`} />
        <div className="project-grid-two">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index + 1} large={index === 0} />
          ))}
        </div>
      </section>
      <section className="page-section discipline-capabilities">
        <SectionHeading
          index="02"
          eyebrow="Working range"
          title="What I bring to the problem"
          intro="Capabilities are paired with the decisions they support, not presented as an ungrounded technology inventory."
        />
        <div className="principle-grid">
          {capabilities.map((capability, index) => (
            <article key={capability.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{capability.title}</h3>
              <p>{capability.detail}</p>
            </article>
          ))}
        </div>
        <div className="section-action"><Link href="/work" className="text-link">Browse the complete portfolio <ArrowRight size={17} /></Link></div>
      </section>
    </>
  );
}
