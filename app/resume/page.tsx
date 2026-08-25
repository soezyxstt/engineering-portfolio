import type { Metadata } from "next";
import experience from "@/data/experience.json";
import { PrintButton } from "@/components/ui/PrintButton";

export const metadata: Metadata = {
  title: "Résumé",
  description: "Print-friendly résumé for Adi Haditya Nursyam, Robotics and Software Engineer.",
  alternates: { canonical: "/resume" },
};

export default function ResumePage() {
  return (
    <article className="resume-page">
      <header className="resume-header">
        <div><p className="kicker">Résumé / 2026</p><h1>Adi Haditya Nursyam</h1><p>Robotics & Software Engineer · Systems Builder</p></div>
        <div className="resume-contact"><a href="mailto:soezyxst@gmail.com">soezyxst@gmail.com</a><a href="https://github.com/soezyxstt">github.com/soezyxstt</a><a href="https://www.linkedin.com/in/adihnursyam/">linkedin.com/in/adihnursyam</a></div>
        <PrintButton />
      </header>
      <section className="resume-summary"><h2>Profile</h2><p>Mechanical engineer by training, working across robotics, embedded control, full-stack software, product development, and technical leadership. Builds integrated systems from physical behavior through deployed interfaces.</p></section>
      <section className="resume-section"><h2>Education</h2><div className="resume-row"><span>Institut Teknologi Bandung</span><div><strong>B.Eng. track, Mechanical Engineering</strong><p>GPA 3.90/4.00 · Mechanical Engineering Outstanding Student 2022, selected as one of three department students.</p></div></div></section>
      <section className="resume-section"><h2>Selected work</h2>
        <div className="resume-row"><span>2026</span><div><strong>Two-DOF SCARA Robot</strong><p>Mechanical system, ESP32 firmware, selectable control compensation, shared telemetry, Next.js HMI, and experiment export tooling.</p></div></div>
        <div className="resume-row"><span>2024—Now</span><div><strong>Zyx Academy — Founder</strong><p>Hybrid tutoring initiative and education product spanning learning operations, content, platform development, and product ownership.</p></div></div>
        <div className="resume-row"><span>2025—2026</span><div><strong>HMM ITB Platform</strong><p>Typed community and learning platform with authentication, relational data, content tools, object storage, testing, and deployment.</p></div></div>
      </section>
      <section className="resume-section"><h2>Experience & leadership</h2>{experience.map((entry) => <div className="resume-row" key={entry.company}><span>{entry.location}</span><div><strong>{entry.company}</strong>{entry.positions.map((position) => <p key={`${position.role}-${position.period}`}><b>{position.role}</b> · {position.period}<br />{position.glimpse}</p>)}</div></div>)}</section>
      <section className="resume-section"><h2>Technical range</h2><p>Robotics · Mechanical design · Embedded C/C++ · Control systems · ESP32 · TypeScript · React · Next.js · Relational databases · MQTT · Three.js · Python · Product delivery</p></section>
    </article>
  );
}

