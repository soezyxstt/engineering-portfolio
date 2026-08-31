import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import profilePhoto from "@/public/me_photo.jpeg";

export const metadata: Metadata = {
  title: "About",
  description: "Profile, education, engineering philosophy, and multidisciplinary path of Adi Haditya Nursyam.",
  alternates: { canonical: "/about" },
};

const values = [
  ["Build from first principles", "Understand what the system must do before choosing tools."],
  ["See the whole system", "Trace decisions across mechanics, data, interfaces, and operations."],
  ["Make trade-offs explicit", "Name constraints and explain why one path was chosen over another."],
  ["Validate with evidence", "Treat experiments, tests, and observation as part of the build."],
  ["Communicate clearly", "Make complex behavior legible to collaborators and operators."],
  ["Own delivery", "Stay with the work through deployment, use, and iteration."],
];

export default function AboutPage() {
  return (
    <>
      <section className="about-hero">
        <div className="about-portrait">
          <Image src={profilePhoto} alt="Adi Haditya Nursyam at Institut Teknologi Bandung" placeholder="blur" priority sizes="(max-width: 900px) 100vw, 50vw" />
          <span>ADI HADITYA NURSYAM / BANDUNG</span>
        </div>
        <div className="about-intro">
          <p className="kicker"><span>Profile / 04</span>About</p>
          <h1>Software is most useful when it understands the system around it.</h1>
          <p className="route-lead">I am a software engineer and the founder and CEO of Zyx Academy, with a Mechanical Engineering foundation from ITB.</p>
          <p>I build full-stack products, AI-enabled learning systems, and software connected to real engineering problems. At Zyx, I lead product and engineering across structured content, assessment, spaced repetition, progress, retrieval-backed tutoring, relational and vector data, cloud infrastructure, and internal authoring systems.</p>
          <p>Beyond Zyx, I have built campus platforms, a local-first AI assistant, robotics and embedded systems, industrial IoT interfaces, and control projects. At PLN Indonesia Power, I also worked with field maintenance and finite-element and fatigue analysis of critical coal-handling equipment.</p>
          <div className="about-actions"><Link href="/work" className="button button-primary">Explore the work <ArrowRight size={17} /></Link><Link href="/resume" className="button button-secondary">Open résumé</Link></div>
        </div>
      </section>

      <section className="page-section academic-panel">
        <div><p className="kicker"><span>01</span>Academic foundation</p><h2>Institut Teknologi Bandung</h2></div>
        <div className="academic-details">
          <div><span>Program</span><strong>Bachelor of Engineering, Mechanical Engineering · Aug 2022 to Jul 2026</strong></div>
          <div><span>GPA</span><strong>3.90 / 4.00</strong></div>
          <div><span>Recognition</span><strong>Mechanical Engineering Outstanding Student 2022, selected as one of three students in the department.</strong></div>
          <div><span>Teaching</span><strong>Statics & Structural Analysis Academic Assistant; Computational Thinking Practicum Assistant.</strong></div>
        </div>
      </section>

      <section className="page-section values-section">
        <div className="case-section-heading"><p className="kicker"><span>02</span>Working philosophy</p><h2>Principles I use to make decisions</h2></div>
        <div className="values-list">
          {values.map(([title, detail], index) => (
            <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{detail}</p></article>
          ))}
        </div>
      </section>

      <section className="about-closing">
        <p className="kicker">What I want to work on</p>
        <h2>Complex products where software, knowledge, operations, and people all matter.</h2>
        <p>Software engineering, full-stack, backend, AI product, and product engineering roles are the strongest fit.</p>
        <Link href="/contact" className="text-link">Start a conversation <ArrowRight size={17} /></Link>
      </section>
    </>
  );
}
