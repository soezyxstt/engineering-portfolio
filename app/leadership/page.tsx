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

export default function LeadershipPage() {
  const selected = experience.filter((entry) =>
    ["Himpunan Mahasiswa Mesin", "Forum Mahasiswa Garut", "Pemira KM ITB", "Unit Robotika"].some((name) => entry.company.includes(name)),
  );

  return (
    <>
      <section className="route-hero leadership-hero">
        <p className="kicker"><span>Practice / 03</span>Leadership</p>
        <h1>Make the system easier for people to operate.</h1>
        <div className="route-hero-grid">
          <p className="route-lead">My leadership style is architectural: clarify interfaces, make constraints visible, and help people move work through the system.</p>
          <p>Leadership claims here are anchored to named roles and projects. Team work remains team work; my contribution is described through direction, implementation, and coordination.</p>
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

      <section className="page-section leadership-evidence">
        <SectionHeading
          index="02"
          eyebrow="Selected evidence"
          title="Roles connected to real work"
          intro="Periods and descriptions are synchronized with the current LinkedIn record. Public project links are used where the work can be inspected."
        />
        <div className="experience-list">
          {selected.map((entry, index) => (
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
        <div className="section-action"><Link href="/work/hmm-itb-platform" className="text-link">See technical leadership in the HMM platform <ArrowRight size={17} /></Link></div>
      </section>
    </>
  );
}
