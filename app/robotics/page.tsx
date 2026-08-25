import type { Metadata } from "next";
import { DisciplineLanding } from "@/components/pages/DisciplineLanding";
import { projects } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Robotics, Control & Mechanical Systems",
  description: "Robotics portfolio covering SCARA control, embedded firmware, experimental work, CAD, and mechatronic interfaces.",
  alternates: { canonical: "/robotics" },
};

export default function RoboticsPage() {
  const selected = ["scara-robot", "fess-digital-twin", "iiot-conveyor"]
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter((project): project is NonNullable<typeof project> => Boolean(project));

  return (
    <DisciplineLanding
      eyebrow="Robotics"
      title="Physical systems, made observable and controllable."
      intro="My robotics work begins with the mechanism and continues through actuation, firmware, control logic, telemetry, and experimental validation."
      statement="The interface is not an afterthought. A well-designed HMI makes machine behavior inspectable, while disciplined data capture turns operation into evidence."
      projects={selected}
      capabilities={[
        { title: "Mechanics & CAD", detail: "Reason from geometry, loads, assembly constraints, and actuation before choosing software abstractions." },
        { title: "Embedded behavior", detail: "Develop firmware and telemetry around the timing and sensing constraints of the physical system." },
        { title: "Control & experiments", detail: "Structure controllers and test conditions so changes can be compared and explained." },
        { title: "Technical interfaces", detail: "Build HMIs that help operators understand state, commands, and system limits." },
      ]}
    />
  );
}

