import type { Metadata } from "next";
import { ArchiveFilter } from "@/components/projects/ArchiveFilter";

export const metadata: Metadata = {
  title: "Project Archive",
  description: "Filterable archive of robotics, embedded, software, platform, product, and leadership work.",
  alternates: { canonical: "/archive" },
};

export default function ArchivePage() {
  return (
    <>
      <section className="route-hero compact-route-hero">
        <p className="kicker"><span>Index / 02</span>Archive</p>
        <h1>The wider body of work.</h1>
        <p className="route-lead">A compact index for exploring projects by discipline. Full case studies are reserved for work with enough evidence and technical depth.</p>
      </section>
      <section className="page-section archive-section"><ArchiveFilter /></section>
    </>
  );
}

