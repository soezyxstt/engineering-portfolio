import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import experience from "@/data/experience.json";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Technical Leadership & Ownership",
  description: "Evidence-based technical leadership, product ownership, community delivery, and academic mentoring.",
  alternates: { canonical: "/leadership" },
};

const dimensions = [
  { title: "Technical direction", detail: "Translate user or organizational needs into a coherent platform direction and implementation path." },
  { title: "Project delivery", detail: "Move from planning through coordination, build, release, and operational follow-through." },
  { title: "Cross-functional coordination", detail: "Work between technical contributors, organizational leaders, educators, and end users." },
  { title: "Product ownership", detail: "Balance implementation detail with content, service design, iteration, and long-term usefulness." },
  { title: "Mentoring", detail: "Make technical ideas legible through tutoring and academic assistantships." },
  { title: "Community systems", detail: "Create structures that help groups coordinate instead of relying on individual heroics." },
];

const evidenceGroups = [
  {
    index: "02",
    eyebrow: "Product and technical direction",
    title: "Own the system beyond the interface",
    intro: "Roles where leadership meant setting technical direction, translating organizational requirements, and staying accountable through delivery and operation.",
    companies: ["Zyx Academy", "Himpunan Mahasiswa Mesin", "Pemira KM ITB", "Parade Wisuda Oktober"],
  },
  {
    index: "03",
    eyebrow: "Organizations and communities",
    title: "Build continuity, not dependency",
    intro: "Volunteer and organizational work spanning governance renewal, cross-campus collaboration, member development, cultural programs, and public events.",
    companies: ["GUMELAR", "Forum Mahasiswa Garut", "Unit Robotika", "Paguyuban Mojang Jajaka"],
  },
  {
    index: "04",
    eyebrow: "Teaching and mentorship",
    title: "Make difficult ideas easier to act on",
    intro: "Formal and peer teaching roles grounded in concept review, structured problem solving, academic support, and individual guidance.",
    companies: ["Orpheus Engine", "Institut Teknologi Bandung", "Excelsis Learning Center"],
  },
];

type ExperienceEntry = (typeof experience)[number];

function ExperienceRecords({ entries }: { entries: ExperienceEntry[] }) {
  return (
    <div className="experience-list">
      {entries.map((entry, index) => (
        <article key={entry.company}>
          <span className="experience-index">{String(index + 1).padStart(2, "0")}</span>
          <div className="experience-title"><h3>{entry.company}</h3><p>{entry.location}</p></div>
          <div className="experience-roles">
            {entry.positions.map((position) => (
              <div key={`${position.role}-${position.period}`}><p>{position.period}</p><strong>{position.role}</strong><span>{position.glimpse}</span></div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

export default function LeadershipPage() {
  return (
    <>
      <section className="route-hero leadership-hero">
        <p className="kicker"><span>Practice / 03</span>Leadership</p>
        <h1>Make the system easier for people to operate.</h1>
        <div className="route-hero-grid">
          <p className="route-lead">My leadership style is architectural: clarify ownership, make constraints visible, and leave people with a system they can continue operating.</p>
          <p>The evidence spans product leadership, technical teams, teaching, regional organizations, robotics, public events, and cross-campus volunteer programs.</p>
        </div>
        <div className="leadership-proof" aria-label="Selected leadership outcomes">
          <div><span>Cross-campus reach</span><strong>10+ universities</strong></div>
          <div><span>Community gathering</span><strong>94 participants</strong></div>
          <div><span>Social service</span><strong>30 children, 14 volunteers</strong></div>
          <div><span>Governance renewal</span><strong>7 month mandate</strong></div>
        </div>
      </section>

      <section className="page-section">
        <SectionHeading index="01" eyebrow="Operating model" title="Six dimensions of delivery" />
        <div className="principle-grid leadership-dimensions">
          {dimensions.map((item, index) => (
            <article key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.detail}</p></article>
          ))}
        </div>
      </section>

      {evidenceGroups.map((group) => {
        const entries = group.companies
          .map((company) => experience.find((entry) => entry.company.includes(company)))
          .filter((entry): entry is ExperienceEntry => Boolean(entry));
        return (
          <section className="page-section leadership-evidence" key={group.index}>
            <SectionHeading index={group.index} eyebrow={group.eyebrow} title={group.title} intro={group.intro} />
            <ExperienceRecords entries={entries} />
          </section>
        );
      })}

      <section className="leadership-closing">
        <p className="kicker">Evidence in the work</p>
        <h2>Leadership becomes credible when the system survives the meeting.</h2>
        <div>
          <Link href="/work/hmm-itb-platform" className="button button-primary">HMM platform case study <ArrowRight size={17} /></Link>
          <Link href="/work/pemira-platform" className="button button-secondary">PEMIRA case study <ArrowRight size={17} /></Link>
        </div>
      </section>
    </>
  );
}
