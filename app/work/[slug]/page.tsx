import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";
import { ArchitectureDiagram } from "@/components/projects/ArchitectureDiagram";
import { getProject, projects } from "@/data/portfolio";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} | Engineering Case Study`,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.title} | Engineering Case Study`,
      description: project.summary,
      images: project.image ? [project.image] : ["/me_photo.jpeg"],
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const currentIndex = projects.findIndex((entry) => entry.slug === project.slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <article className="case-study" style={{ "--project-accent": project.accent } as React.CSSProperties}>
      <header className="case-hero">
        <Link href="/work" className="back-link"><ArrowLeft size={15} /> All work</Link>
        <h1>{project.title}</h1>
        <p className="case-summary">{project.summary}</p>
        <div className="case-meta-grid">
          <div><span>Role</span><strong>{project.role}</strong></div>
          <div><span>Period</span><strong>{project.year}</strong></div>
          <div><span>Status</span><strong>{project.status}</strong></div>
          <div><span>Evidence</span><strong>{project.evidence}</strong></div>
        </div>
        <div className="case-actions">
          {project.liveUrl ? <a className="button button-primary" href={project.liveUrl} target="_blank" rel="noreferrer">Visit live project <ArrowUpRight size={16} /></a> : null}
          {project.repoUrl ? <a className="button button-secondary" href={project.repoUrl} target="_blank" rel="noreferrer">View repository <ArrowUpRight size={16} /></a> : null}
        </div>
      </header>

      <div className="case-visual">
        {project.image ? (
          <Image src={project.image} alt={`${project.title} project preview`} fill preload sizes="100vw" className="case-image" />
        ) : (
          <div className="case-schematic" aria-label="SCARA system signal path">
            {project.architecture.map((layer, index) => (
              <div key={layer.label}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{layer.label}</strong>
                <small>{layer.detail}</small>
              </div>
            ))}
          </div>
        )}
      </div>

      <section className="case-section case-narrative">
        <div><h2>The engineering problem</h2></div>
        <div className="narrative-columns">
          <div><span>Challenge</span><p>{project.challenge}</p></div>
          <div><span>Response</span><p>{project.response}</p></div>
          <div><span>Outcome</span><p>{project.outcome}</p></div>
        </div>
      </section>

      <section className="case-section">
        <div className="case-section-heading">
          <h2>System architecture</h2>
        </div>
        <ArchitectureDiagram project={project} />
      </section>

      <section className="case-section decision-section">
        <div className="case-section-heading">
          <h2>Engineering decisions</h2>
        </div>
        <div className="decision-list">
          {project.decisions.map((decision, index) => (
            <article key={decision.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><h3>{decision.title}</h3><p>{decision.detail}</p></div>
            </article>
          ))}
        </div>
      </section>

      {project.gallery?.length ? (
        <section className="case-section case-gallery-section">
          <div className="case-section-heading">
            <h2>Project gallery</h2>
          </div>
          <div className="case-gallery">
            {project.gallery.map((item) => (
              <figure className={item.wide ? "is-wide" : undefined} key={item.src}>
                <div className="case-gallery-media">
                  <Image src={item.src} alt={item.alt} fill sizes="(max-width: 900px) 100vw, 50vw" />
                </div>
                <figcaption>{item.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {project.videos?.length ? (
        <section className="case-section case-video-section">
          <div className="case-section-heading">
            <h2>Demonstrations</h2>
          </div>
          <div className="case-video-grid">
            {project.videos.map((item) => (
              <figure key={item.src}>
                <video controls preload="metadata" playsInline muted poster={item.poster} aria-label={item.title}>
                  <source src={item.src} type="video/mp4" />
                </video>
                <figcaption>{item.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      <section className="case-section case-proof">
        <div>
          <h2>Tools and technologies</h2>
        </div>
        <div>
          <ul className="stack-list">{project.stack.map((item) => <li key={item}>{item}</li>)}</ul>
          <ul className="highlight-list">{project.highlights.map((item) => <li key={item}><CheckCircle2 size={16} />{item}</li>)}</ul>
        </div>
      </section>

      <Link href={`/work/${nextProject.slug}`} className="next-project">
        <span>Next case study</span>
        <strong>{nextProject.title}</strong>
        <ArrowRight size={24} />
      </Link>
    </article>
  );
}
