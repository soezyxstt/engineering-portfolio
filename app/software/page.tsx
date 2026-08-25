import type { Metadata } from "next";
import { DisciplineLanding } from "@/components/pages/DisciplineLanding";
import { projects } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Software, Platforms & Product Engineering",
  description: "Software portfolio covering Zyx Academy, community platforms, typed application architecture, infrastructure, and product ownership.",
  alternates: { canonical: "/software" },
};

export default function SoftwarePage() {
  const selected = ["zyx-academy", "hmm-itb-platform", "iam-itb", "pemira-platform"]
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter((project): project is NonNullable<typeof project> => Boolean(project));

  return (
    <DisciplineLanding
      eyebrow="Software"
      title="Digital products with real operating context."
      intro="I build web platforms as systems of users, data, workflows, infrastructure, and product decisions—not as collections of pages."
      statement="The strongest examples serve education, engineering communities, alumni operations, or campus processes, giving the architecture a concrete reason to exist."
      projects={selected}
      capabilities={[
        { title: "Typed architecture", detail: "Use TypeScript, validation, and explicit data boundaries to keep complex features understandable." },
        { title: "Data & identity", detail: "Design relational models, migrations, authentication, and permissions around actual workflows." },
        { title: "Product operations", detail: "Connect software choices with content, administrative work, and user support." },
        { title: "Delivery", detail: "Carry projects through testing, deployment, migration, and iteration instead of stopping at a prototype." },
      ]}
    />
  );
}

