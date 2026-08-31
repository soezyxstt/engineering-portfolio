import type { Metadata } from "next";
import { ArrowDownToLine } from "lucide-react";
import experience from "@/data/experience.json";
import { PrintButton } from "@/components/ui/PrintButton";

export const metadata: Metadata = {
  title: "Résumé",
  description: "Role-specific English and Indonesian résumés for Adi Haditya Nursyam.",
  alternates: { canonical: "/resume" },
};

const resumeVariants = [
  {
    label: "Software Engineer",
    note: "Recommended for global software, full-stack, backend, and AI-product roles.",
    featured: true,
    english: "/resume/Adi-Haditya-Nursyam-Software-Engineer-Resume-EN.pdf",
    indonesian: "/resume/Adi-Haditya-Nursyam-Software-Engineer-Resume-ID.pdf",
  },
  {
    label: "Automation Engineer",
    note: "For controls, robotics, embedded systems, and industrial digitalization.",
    english: "/resume/Adi-Haditya-Nursyam-Automation-Engineer-Resume-EN.pdf",
    indonesian: "/resume/Adi-Haditya-Nursyam-Automation-Engineer-Resume-ID.pdf",
  },
  {
    label: "Mechanical Engineer",
    note: "For mechanical design, analysis, reliability, and engineering roles.",
    english: "/resume/Adi-Haditya-Nursyam-Mechanical-Engineer-Resume-EN.pdf",
    indonesian: "/resume/Adi-Haditya-Nursyam-Mechanical-Engineer-Resume-ID.pdf",
  },
  {
    label: "General Master",
    note: "A broad profile spanning software, engineering, leadership, and product ownership.",
    english: "/resume/Adi-Haditya-Nursyam-General-Master-Resume-EN.pdf",
    indonesian: "/resume/Adi-Haditya-Nursyam-General-Master-Resume-ID.pdf",
  },
];

export default function ResumePage() {
  return (
    <article className="resume-page">
      <section className="resume-downloads">
        <div className="resume-downloads-heading">
          <p className="kicker"><span>Role-specific</span> résumé library</p>
          <h1>Choose the version that matches the role.</h1>
          <p>The English Software Engineer résumé is the best default for global recruiters. Specialist versions keep the same career story while foregrounding the most relevant evidence.</p>
        </div>
        <div className="resume-variant-grid">
          {resumeVariants.map((variant) => (
            <article className={variant.featured ? "resume-variant is-featured" : "resume-variant"} key={variant.label}>
              <div>
                <p className="kicker">{variant.featured ? "Recommended" : "Specialist"}</p>
                <h2>{variant.label}</h2>
                <p>{variant.note}</p>
              </div>
              <div className="resume-variant-actions">
                <a href={variant.english} download>English PDF <ArrowDownToLine size={15} /></a>
                <a href={variant.indonesian} download>Bahasa Indonesia <ArrowDownToLine size={15} /></a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <header className="resume-header">
        <div><p className="kicker">Browser résumé / 2026</p><h2 className="resume-name">Adi Haditya Nursyam</h2><p>Software Engineer · Founder & CEO, Zyx Academy · Full-Stack & AI Products</p></div>
        <div className="resume-contact"><a href="mailto:soezyxst@gmail.com">soezyxst@gmail.com</a><a href="https://github.com/soezyxstt">github.com/soezyxstt</a><a href="https://www.linkedin.com/in/adihnursyam/">linkedin.com/in/adihnursyam</a></div>
        <PrintButton />
      </header>
      <section className="resume-summary"><h2>Profile</h2><p>Software engineer and founder with a Mechanical Engineering background from ITB. Builds full-stack products, AI-enabled learning systems, and software for real engineering problems across product architecture, frontend, backend, data, cloud infrastructure, and AI workflows.</p></section>
      <section className="resume-section"><h2>Education</h2><div className="resume-row"><span>Aug 2022 to Jul 2026</span><div><strong>Bachelor of Engineering, Mechanical Engineering · Institut Teknologi Bandung</strong><p>GPA 3.90/4.00 · Selected as one of three outstanding students from the 2022 Mechanical Engineering cohort.</p></div></div></section>
      <section className="resume-section"><h2>Selected work</h2>
        <div className="resume-row"><span>2026</span><div><strong>Two-DOF SCARA Robot</strong><p>Built the mechanical system, ESP32 firmware, selectable model-based control, telemetry, and Next.js HMI. Tracking differentiation reduced mean absolute tracking error by 38.7%; a trapezoidal profile reduced end-effector RMSE by 50.4%.</p></div></div>
        <div className="resume-row"><span>2024 to Now</span><div><strong>Zyx Academy, Founder & CEO</strong><p>Lead product and engineering for an AI-enabled learning platform spanning structured content, assessments, spaced repetition, progress, retrieval-backed tutoring, relational and vector data, cloud infrastructure, and internal authoring systems.</p></div></div>
        <div className="resume-row"><span>2025</span><div><strong>BC-54 Idler Reliability Study, PLN Indonesia Power</strong><p>Reconciled field failure evidence with static and fatigue FEA, then proposed condition-based ultrasonic thickness inspection after the model redirected the root-cause hypothesis toward abrasive wear.</p></div></div>
        <div className="resume-row"><span>2025 to 2026</span><div><strong>HMM ITB Platform</strong><p>Typed community and learning platform with authentication, relational data, content tools, object storage, testing, and deployment.</p></div></div>
      </section>
      <section className="resume-section"><h2>Recognition</h2>
        <div className="resume-row"><span>Feb 2025</span><div><strong>Mechanical Engineering Outstanding Student</strong><p>Selected as one of three outstanding students from ITB&apos;s 2022 Mechanical Engineering cohort.</p></div></div>
        <div className="resume-row"><span>Jul 2024</span><div><strong>Kontes Robot Indonesia 2024, Finalist</strong><p>Advanced to the KRAI finalist stage with Unit Robotika ITB.</p></div></div>
        <div className="resume-row"><span>Nov 2023</span><div><strong>Jajaka Calakan Kabupaten Garut</strong><p>Received the Calakan distinction in the adult category.</p></div></div>
      </section>
      <section className="resume-section"><h2>Experience & leadership</h2>{experience.map((entry) => <div className="resume-row" key={entry.company}><span>{entry.location}</span><div><strong>{entry.company}</strong>{entry.positions.map((position) => <p key={`${position.role}-${position.period}`}><b>{position.role}</b> · {position.period}<br />{position.glimpse}</p>)}</div></div>)}</section>
      <section className="resume-section"><h2>Technical range</h2><p>Full-stack product development · Frontend · Backend · TypeScript · React · Next.js · Relational databases · Vector retrieval · AI workflows · Cloud infrastructure · Python · Embedded C/C++ · Control systems · Robotics · Product delivery</p></section>
    </article>
  );
}
