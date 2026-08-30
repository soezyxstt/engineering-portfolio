import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Download } from "lucide-react";
import profilePhoto from "@/public/me_photo.jpeg";
import { projects } from "@/data/portfolio";
import experience from "@/data/experience.json";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CapabilityMap } from "@/components/home/CapabilityMap";
import { FeaturedWorkIndex } from "@/components/home/FeaturedWorkIndex";
import { PublicBuildIndex } from "@/components/home/PublicBuildIndex";
import { recognition } from "@/data/recognition";

export default function Home() {
  const flagship = projects.filter((project) => project.flagship);
  const selectedExperience = experience.filter((entry) =>
    ["GUMELAR", "PLN Indonesia Power", "Himpunan Mahasiswa Mesin", "Forum Mahasiswa Garut"].some((name) =>
      entry.company.includes(name),
    ),
  );

  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <p className="kicker hero-kicker">
            <span>Adi Haditya Nursyam</span>
            Bandung, Indonesia · GMT+7
          </p>
          <h1>
            Engineering between
            <em> atoms & software.</em>
          </h1>
          <p className="hero-statement">
            Software engineer and founder building full-stack products and AI-enabled learning systems—grounded in mechanical engineering, robotics, and real operational constraints.
          </p>
          <p className="hero-availability"><i aria-hidden="true" /><span>Open to software, backend, AI product & product engineering roles</span></p>
          <div className="hero-actions">
            <Link href="/work" className="button button-primary">
              Explore selected work <ArrowRight size={17} />
            </Link>
            <Link href="/resume" className="button button-secondary">
              View résumé <Download size={16} />
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

        <div className="hero-system" role="img" aria-label="Adi's engineering practice across mechanics, control, software, and product delivery">
          <span className="system-title">ONE PRACTICE / FOUR LAYERS</span>
          <div className="system-stage system-stage-1">
            <span>01</span>
            <strong>Mechanics</strong>
            <small>geometry · loads · actuation</small>
          </div>
          <div className="system-stage system-stage-2">
            <span>02</span>
            <strong>Control</strong>
            <small>motion · sensing · firmware</small>
          </div>
          <div className="system-stage system-stage-3">
            <span>03</span>
            <strong>Interface</strong>
            <small>data · software · operation</small>
          </div>
          <div className="system-stage system-stage-4">
            <span>04</span>
            <strong>Product</strong>
            <small>people · delivery · iteration</small>
          </div>
          <div className="system-core">
            <span>AHN</span>
            <small>whole-system view</small>
          </div>
          <span className="system-coordinate coordinate-x">BUILD / TEST / ITERATE</span>
          <span className="system-coordinate coordinate-y">BANDUNG / ID</span>
        </div>

        <a className="hero-scroll" href="#selected-systems">
          Selected systems <ArrowDown size={15} />
        </a>
      </section>

      <section className="credibility-strip" aria-label="Profile highlights">
        <div><span>Current focus</span><strong>Full-stack & AI products</strong></div>
        <div><span>Academic record</span><strong>3.90 / 4.00 GPA</strong></div>
        <div><span>Recognition</span><strong>Outstanding Student · ITB Mechanical Engineering</strong></div>
        <div><span>Ownership</span><strong>Founder & CEO · Zyx Academy</strong></div>
      </section>

      <section id="selected-systems" className="page-section selected-systems">
        <SectionHeading
          index="01"
          eyebrow="Selected case studies"
          title="Read the system—not just the screenshot."
          intro="Each case study makes the challenge, my role, the architecture, and the evidence visible. Hover or focus to preview; open one to inspect the decisions behind it."
        />
        <FeaturedWorkIndex projects={flagship} />
        <div className="section-action">
          <Link href="/work" className="text-link">View all selected work <ArrowRight size={17} /></Link>
        </div>
      </section>

      <section className="page-section experience-preview">
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

      <section className="page-section recognition-section">
        <SectionHeading
          index="03"
          eyebrow="Recognition"
          title="Selected by institutions, tested in competition."
          intro="A compact record of academic, robotics, and regional recognition—kept factual and connected to the institution that issued it."
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

      <section className="page-section public-builds-section">
        <SectionHeading
          index="04"
          eyebrow="Public code & deployments"
          title="More shipped work, kept in proportion."
          intro="A broader sample of public web work verified from GitHub repository metadata, READMEs, and linked deployments. Supporting projects stay concise so the strongest case studies remain clear."
        />
        <PublicBuildIndex />
        <div className="section-action"><Link href="/archive" className="text-link">Browse the complete project archive <ArrowRight size={17} /></Link></div>
      </section>

      <section className="page-section capability-section">
        <SectionHeading
          index="05"
          eyebrow="Engineering range"
          title="Breadth, organized as a system."
          intro="Mechanical engineering and software are not separate identities here. They are adjacent layers of how a product behaves, communicates, and reaches people."
        />
        <CapabilityMap />
      </section>

      <section className="page-section profile-section">
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
          <p className="kicker"><span>06</span>Profile</p>
          <h2>Software engineer by practice. Mechanical engineer by foundation.</h2>
          <p className="profile-lead">
            I work across product architecture, frontend and backend development, data, AI workflows, and cloud infrastructure—without losing sight of the physical systems and people the software serves.
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

      <section className="founder-spotlight">
        <div className="founder-index">07</div>
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
