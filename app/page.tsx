import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import profilePhoto from "@/public/me_photo.jpeg";
import { capabilityGroups, projects } from "@/data/portfolio";
import experience from "@/data/experience.json";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeaturedWorkIndex } from "@/components/home/FeaturedWorkIndex";
import { TypedSpecialty } from "@/components/home/TypedSpecialty";
import { recognition } from "@/data/recognition";

export default function Home() {
  const featuredSlugs = [
    "scara-robot",
    "zyx-academy",
    "hmm-itb-platform",
    "iam-itb",
    "pemira-platform",
    "mechanical-festival",
    "pamoka",
  ];
  const featuredProjects = featuredSlugs
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter((project): project is (typeof projects)[number] => Boolean(project));
  const selectedExperience = experience.filter((entry) =>
    ["GUMELAR", "PLN Indonesia Power", "Himpunan Mahasiswa Mesin", "Forum Mahasiswa Garut"].some((name) =>
      entry.company.includes(name),
    ),
  );

  return (
    <>
      <section className="home-hero" data-reveal>
        <div className="hero-intro">
          <p className="kicker hero-kicker"><span>Portfolio / 2026</span>Bandung, Indonesia</p>
          <h1>I build software for systems that have to work.</h1>
        </div>

        <div className="hero-brief">
          <p className="hero-statement">
            I&apos;m Adi, a software engineer and founder working across full stack products, backend systems, and applied AI, with a foundation in mechanical engineering and robotics.
          </p>
          <p className="hero-availability">Current practice: <TypedSpecialty /></p>
          <div className="hero-actions">
            <Link href="/work" className="button button-primary">
              Selected work <ArrowRight size={17} />
            </Link>
            <Link href="/resume" className="button button-secondary">
              Résumé <Download size={16} />
            </Link>
          </div>
          <div className="hero-links" aria-label="Professional links">
            <a href="https://github.com/soezyxstt" target="_blank" rel="noreferrer">
              GitHub <ArrowUpRight size={13} />
            </a>
            <a href="https://www.linkedin.com/in/adihnursyam/" target="_blank" rel="noreferrer">
              LinkedIn <ArrowUpRight size={13} />
            </a>
            <a href="mailto:soezyxst@gmail.com">Email <ArrowUpRight size={13} /></a>
          </div>
        </div>

        <div className="hero-proof" aria-label="Profile highlights">
          <div><span>01 / Current work</span><strong>Full-stack & AI products</strong></div>
          <div><span>02 / Foundation</span><strong>Mechanical Engineering, ITB</strong></div>
          <div><span>03 / Academic record</span><strong>3.90 / 4.00 GPA</strong></div>
          <div><span>04 / Ownership</span><strong>Founder & CEO, Zyx Academy</strong></div>
        </div>
      </section>

      <section id="selected-systems" className="page-section selected-systems" data-reveal>
        <SectionHeading
          index="01"
          eyebrow="Selected case studies"
          title="Read the system, not just the screenshot."
          intro="Each case study makes the challenge, my role, the architecture, and the evidence visible. Hover or focus to preview; open one to inspect the decisions behind it."
        />
        <FeaturedWorkIndex projects={featuredProjects} />
        <div className="section-action">
          <Link href="/work" className="text-link">View all selected work <ArrowRight size={17} /></Link>
        </div>
      </section>

      <section className="page-section experience-preview" data-reveal>
        <SectionHeading
          index="02"
          eyebrow="Experience & organizations"
          title="Responsibility across very different rooms."
          intro="Power-plant maintenance, robotics, digital infrastructure, and regional student leadership taught me to work with real constraints, stakeholders, and consequences."
        />
        <div className="home-experience-list">
          {selectedExperience.map((entry, index) => {
            const role = entry.positions[0];
            return (
              <article key={entry.company}>
                <span className="home-experience-index">{String(index + 1).padStart(2, "0")}</span>
                <div className="home-experience-org"><h3>{entry.company}</h3><p>{entry.location}</p></div>
                <div className="home-experience-role"><span>{role.period}</span><strong>{role.role}</strong><p>{role.glimpse}</p></div>
              </article>
            );
          })}
        </div>
        <div className="section-action"><Link href="/leadership" className="text-link">View the full experience record <ArrowRight size={17} /></Link></div>
      </section>

      <section className="page-section recognition-section" data-reveal>
        <SectionHeading
          index="03"
          eyebrow="Recognition"
          title="Selected by institutions, tested in competition."
          intro="A compact record of academic, robotics, and regional recognition, kept factual and connected to the institution that issued it."
        />
        <div className="recognition-list">
          {recognition.map((item, index) => (
            <article key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><p>{item.date}</p><h3>{item.title}</h3></div>
              <div><strong>{item.issuer}</strong><p>{item.detail}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section capability-section" data-reveal>
        <SectionHeading
          index="04"
          eyebrow="Engineering range"
          title="Four areas, one practical method."
          intro="The range is stated plainly and tied to work. No proficiency meters, only capabilities and the projects where they were applied."
        />
        <div className="capability-ledger">
          {capabilityGroups.map((group, index) => (
            <article key={group.label}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{group.label}</h3>
                <ul>{group.capabilities.map((capability) => <li key={capability}>{capability}</li>)}</ul>
              </div>
              <p><span>Demonstrated in</span>{group.projects.join(" · ")}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section profile-section" data-reveal>
        <div className="profile-photo-wrap">
          <div className="profile-photo-frame">
            <Image
              src={profilePhoto}
              alt="Portrait of Adi Haditya Nursyam wearing an ITB engineering jacket"
              placeholder="blur"
              sizes="(max-width: 800px) 100vw, 48vw"
              className="profile-photo"
            />
            <span className="photo-note photo-note-top">PROFILE / 01</span>
            <span className="photo-note photo-note-bottom">Bandung, Indonesia · GMT+7</span>
          </div>
        </div>
        <div className="profile-copy">
          <p className="kicker"><span>05</span>Profile</p>
          <h2>Software engineer by practice. Mechanical engineer by foundation.</h2>
          <p className="profile-lead">
            I work across product architecture, frontend and backend development, data, AI workflows, and cloud infrastructure without losing sight of the physical systems and people the software serves.
          </p>
          <p>
            At Institut Teknologi Bandung, mechanics, computation, and experimental reasoning became the foundation. Zyx Academy, campus platforms, robotics, and industrial work turned it into a practice of translating complex requirements into practical products.
          </p>
          <div className="profile-facts">
            <div><span>Institution</span><strong>Institut Teknologi Bandung</strong></div>
            <div><span>Program</span><strong>Mechanical Engineering</strong></div>
            <div><span>Recognition</span><strong>One of three Outstanding Students from the 2022 cohort</strong></div>
            <div><span>Academic work</span><strong>Statics & computational thinking assistantships</strong></div>
          </div>
          <Link href="/about" className="text-link">Read the full profile <ArrowRight size={17} /></Link>
        </div>
      </section>

      <section className="founder-spotlight" data-reveal>
        <div className="founder-index">06</div>
        <div>
          <p className="kicker">Founder spotlight / Zyx Academy</p>
          <h2>Building an AI learning product means owning the knowledge system.</h2>
        </div>
        <div className="founder-copy">
          <p>
            Zyx connects structured content, assessment, spaced repetition, progress, and retrieval-backed tutoring. I lead the product and engineering across full-stack application flows, relational and vector data, AI workflows, cloud infrastructure, and internal authoring systems.
          </p>
          <div className="founder-actions">
            <Link href="/work/zyx-academy" className="button button-primary">Read the case study <ArrowRight size={17} /></Link>
            <a href="https://zyxacademy.com" target="_blank" rel="noreferrer" className="button button-secondary">Visit Zyx <ArrowUpRight size={16} /></a>
          </div>
        </div>
      </section>
    </>
  );
}
