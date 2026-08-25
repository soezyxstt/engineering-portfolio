import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Download } from "lucide-react";
import profilePhoto from "@/public/me_photo.jpeg";
import { projects } from "@/data/portfolio";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CapabilityMap } from "@/components/home/CapabilityMap";

export default function Home() {
  const flagship = projects.filter((project) => project.flagship);

  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <p className="kicker hero-kicker">
            <span>AHN / 2026</span>
            Robotics & Software Engineer
          </p>
          <h1>
            I build complete
            <em> systems.</em>
          </h1>
          <p className="hero-statement">
            I design and build integrated systems across mechanics, control, embedded software, and production-grade digital products.
          </p>
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

        <div className="hero-system" role="img" aria-label="System layers from mechanics to product delivery">
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
          <span className="system-coordinate coordinate-x">X +420</span>
          <span className="system-coordinate coordinate-y">Y +280</span>
        </div>

        <a className="hero-scroll" href="#selected-systems">
          Selected systems <ArrowDown size={15} />
        </a>
      </section>

      <section className="credibility-strip" aria-label="Profile highlights">
        <div><span>Education</span><strong>Mechanical Engineering · ITB</strong></div>
        <div><span>Academic record</span><strong>3.90 / 4.00 GPA</strong></div>
        <div><span>Recognition</span><strong>Outstanding Student · 2022</strong></div>
        <div><span>Ownership</span><strong>Founder · Zyx Academy</strong></div>
      </section>

      <section id="selected-systems" className="page-section selected-systems">
        <SectionHeading
          index="01"
          eyebrow="Selected systems"
          title="Three projects. One operating principle."
          intro="The strongest work is not a collection of screens. Each project connects decisions across technical layers and carries them through to a working result."
        />
        <div className="flagship-stack">
          {flagship.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index + 1} large />
          ))}
        </div>
        <div className="section-action">
          <Link href="/work" className="text-link">View all selected work <ArrowRight size={17} /></Link>
        </div>
      </section>

      <section className="page-section capability-section">
        <SectionHeading
          index="02"
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
          <p className="kicker"><span>03</span>Profile</p>
          <h2>Mechanical engineer by training. Systems builder by practice.</h2>
          <p className="profile-lead">
            I work comfortably between physical behavior and digital infrastructure—because the most useful engineering problems rarely stop at a disciplinary boundary.
          </p>
          <p>
            At Institut Teknologi Bandung, I built a foundation in mechanics, computation, and experimental reasoning. Robotics work turned that foundation into firmware, control, telemetry, and interfaces. Leading digital platforms made product ownership and organizational execution part of the same practice.
          </p>
          <div className="profile-facts">
            <div><span>Institution</span><strong>Institut Teknologi Bandung</strong></div>
            <div><span>Program</span><strong>Mechanical Engineering</strong></div>
            <div><span>Recognition</span><strong>One of three department Outstanding Students, 2022</strong></div>
            <div><span>Academic work</span><strong>Statics & computational thinking assistantships</strong></div>
          </div>
          <Link href="/about" className="text-link">Read the full profile <ArrowRight size={17} /></Link>
        </div>
      </section>

      <section className="page-section leadership-preview">
        <SectionHeading
          index="04"
          eyebrow="Leadership & ownership"
          title="Technical work gets real when people can deliver it."
          intro="Roles are presented through responsibility and system outcomes—not self-rated skill bars or inflated team claims."
        />
        <div className="leadership-grid">
          <article>
            <span>01 / Founder</span>
            <h3>Zyx Academy</h3>
            <p>Own the connection between tutoring operations, product direction, technical implementation, and continuous iteration.</p>
          </article>
          <article>
            <span>02 / Technical direction</span>
            <h3>HMM ITB</h3>
            <p>Lead digital-platform work that connects member needs, content, administrative workflows, and software delivery.</p>
          </article>
          <article>
            <span>03 / Project delivery</span>
            <h3>PEMIRA KM ITB</h3>
            <p>Served as Head of Information Technology for a team-delivered university election platform.</p>
          </article>
          <article>
            <span>04 / Community systems</span>
            <h3>FORMAT & Gumelar</h3>
            <p>Organized education and regional collaboration initiatives while building clearer coordination structures.</p>
          </article>
        </div>
        <div className="section-action"><Link href="/leadership" className="text-link">Explore leadership evidence <ArrowRight size={17} /></Link></div>
      </section>

      <section className="founder-spotlight">
        <div className="founder-index">05</div>
        <div>
          <p className="kicker">Founder spotlight / Zyx Academy</p>
          <h2>Building an education product means owning more than the code.</h2>
        </div>
        <div className="founder-copy">
          <p>
            Zyx connects tutor-led learning with a digital platform for structured course journeys and interactive technical practice. It is where software architecture, teaching, content operations, and product judgment meet.
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
