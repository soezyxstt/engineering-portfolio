import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { projects, type Project } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Selected Engineering Work",
  description: "Robotics, control, embedded, platform, and product case studies by Adi Haditya Nursyam.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  const selectedSlugs = [
    "scara-robot",
    "zyx-academy",
    "hmm-itb-platform",
    "iam-itb",
    "pemira-platform",
    "mechanical-festival",
    "pamoka",
    "mebot",
  ];
  const selectedProjects = selectedSlugs
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter((project): project is Project => Boolean(project));

  return (
    <>
      <section className="route-hero work-hero" data-reveal>
        <p className="kicker"><span>Index / 01</span>Selected work</p>
        <h1>Systems, not isolated artifacts.</h1>
        <div className="route-hero-grid">
          <p className="route-lead">A focused selection of projects where physical, digital, and organizational layers meet.</p>
          <p>Flagship studies go deep on architecture and decisions. Supporting work shows range without pretending every project had the same scope or ownership model.</p>
        </div>
      </section>
      <section className="page-section work-index" data-reveal>
        <div className="project-grid-two">
          {selectedProjects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index + 1} large={index < 2} />
          ))}
        </div>
        <div className="section-action"><Link href="/archive" className="text-link">Open the wider project archive <ArrowRight size={17} /></Link></div>
      </section>
    </>
  );
}
