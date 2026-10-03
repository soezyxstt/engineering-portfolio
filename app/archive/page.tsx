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
        <h1>Project archive.</h1>
        <p className="route-lead">Explore my projects by discipline.</p>
      </section>
      <section className="page-section archive-section"><ArchiveFilter /></section>
    </>
  );
}
