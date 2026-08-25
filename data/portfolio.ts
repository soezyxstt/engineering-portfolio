export type Discipline =
  | "Robotics"
  | "Mechanical"
  | "Embedded"
  | "Control"
  | "Software"
  | "Platform"
  | "Product"
  | "Leadership";

export type Project = {
  slug: string;
  title: string;
  eyebrow: string;
  year: string;
  role: string;
  status: string;
  summary: string;
  challenge: string;
  response: string;
  outcome: string;
  disciplines: Discipline[];
  stack: string[];
  highlights: string[];
  architecture: { label: string; detail: string }[];
  decisions: { title: string; detail: string }[];
  image?: string;
  liveUrl?: string;
  repoUrl?: string;
  flagship?: boolean;
  accent: string;
  evidence: string;
};

export const projects: Project[] = [
  {
    slug: "scara-robot",
    title: "Two-DOF SCARA Robot",
    eyebrow: "Flagship / Robotics & Control",
    year: "2026",
    role: "Mechanical, control, firmware & HMI engineering",
    status: "Final-year engineering project",
    summary:
      "A planar teaching robot developed as one connected system: mechanical hardware, embedded control, telemetry, experiments, and a browser-based operator interface.",
    challenge:
      "Make a two-joint physical system understandable and testable across mechanics, actuation, motion control, sensing, and experimental analysis.",
    response:
      "Built a shared telemetry contract between ESP32 firmware and a Next.js HMI, then structured the controller so inertia, Coriolis, and gravity compensation could be evaluated independently.",
    outcome:
      "A working research platform with reproducible experiment exports, Web Serial operation, technical documentation, and selected datasets for five experiment families.",
    disciplines: ["Robotics", "Mechanical", "Embedded", "Control", "Software"],
    stack: ["ESP32", "C++", "Next.js", "TypeScript", "Python", "Web Serial"],
    highlights: ["2 controlled joints", "921,600 baud telemetry", "5 experiment families"],
    architecture: [
      { label: "Mechanism", detail: "Planar two-link SCARA hardware with DC and stepper actuation." },
      { label: "Firmware", detail: "PID, tracking differentiator, trapezoidal trajectory, and selectable feedforward terms." },
      { label: "Telemetry", detail: "A shared packet schema keeps firmware and HMI interpretations aligned." },
      { label: "HMI", detail: "Browser-based operation, visualization, capture, and experiment review." },
      { label: "Analysis", detail: "Python export tooling produces selected CSV datasets for comparison." },
    ],
    decisions: [
      {
        title: "Separate the compensation terms",
        detail:
          "Inertia, Coriolis, and gravity compensation are independently switchable so experiments can make causal comparisons rather than treating feedforward as one opaque feature.",
      },
      {
        title: "Share the telemetry definition",
        detail:
          "Firmware and web code are generated around one packet definition, reducing silent drift between embedded output and interface parsing.",
      },
      {
        title: "Treat data capture as part of the product",
        detail:
          "Experiment records and export scripts live beside the operating software, making validation a first-class system layer.",
      },
    ],
    liveUrl: "https://tugasakhir.adihnursyam.com",
    repoUrl: "https://github.com/soezyxstt/scara-final-year-project",
    flagship: true,
    accent: "#3757d5",
    evidence: "Public repository, firmware documentation, selected datasets, and deployed HMI",
  },
  {
    slug: "zyx-academy",
    title: "Zyx Academy",
    eyebrow: "Flagship / Founder Product",
    year: "2024—Now",
    role: "Founder, product owner & software engineer",
    status: "Active education initiative",
    summary:
      "A hybrid tutoring initiative and digital learning product built to make demanding engineering foundations easier to navigate and practice.",
    challenge:
      "Connect tutoring, structured learning material, and interactive practice in a product that supports learners beyond a single class session.",
    response:
      "Developed the initiative as both an education service and a software product, with modular course journeys and interactive mathematics and science experiences.",
    outcome:
      "A functioning public platform that demonstrates long-term product ownership across teaching, content operations, interface design, and software delivery.",
    disciplines: ["Software", "Platform", "Product", "Leadership"],
    stack: ["React", "Node.js", "Interactive math", "Product operations"],
    highlights: ["Founder-led", "Hybrid tutoring", "Live product"],
    architecture: [
      { label: "Learner", detail: "A clear entry point into courses, practice, and tutor-led support." },
      { label: "Learning product", detail: "Modular content and interactive science or mathematics experiences." },
      { label: "Operations", detail: "Tutoring delivery, content decisions, and platform iteration inform one another." },
    ],
    decisions: [
      {
        title: "Build around a real service",
        detail:
          "The platform is shaped by the needs of an operating tutoring initiative rather than by a fictional product brief.",
      },
      {
        title: "Keep public claims conservative",
        detail:
          "Private product metrics and infrastructure details are intentionally omitted until they can be published with evidence.",
      },
    ],
    image: "/work/zyx.png",
    liveUrl: "https://zyxacademy.com",
    flagship: true,
    accent: "#a1642b",
    evidence: "Founder context supplied for this portfolio and the public Zyx Academy product",
  },
  {
    slug: "hmm-itb-platform",
    title: "HMM ITB Platform",
    eyebrow: "Flagship / Community Infrastructure",
    year: "2025—2026",
    role: "Technical lead & full-stack engineer",
    status: "Deployed community platform",
    summary:
      "A learning and community platform that grew from course management into shared digital infrastructure for HMM ITB.",
    challenge:
      "Unify academic resources, community information, administrative workflows, and member-facing tools without turning the product into disconnected microsites.",
    response:
      "Developed a typed Next.js platform with authentication, Prisma-backed data, file storage, rich content tooling, notifications, and a worker layer.",
    outcome:
      "A deployed platform with a substantial application surface, documented setup, database migrations, tests, and ongoing organizational use.",
    disciplines: ["Software", "Platform", "Product", "Leadership"],
    stack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Auth.js", "tRPC", "R2"],
    highlights: ["Community platform", "PWA capability", "Tested application"],
    architecture: [
      { label: "Experience", detail: "Member, learning, event, content, and administrative interfaces." },
      { label: "Application", detail: "Typed server and client flows built with Next.js and tRPC." },
      { label: "Identity", detail: "Authenticated access with an Auth.js and Prisma integration." },
      { label: "Data", detail: "Prisma migrations over a relational application model." },
      { label: "Services", detail: "Object storage, notifications, calendar data, and background worker concerns." },
    ],
    decisions: [
      {
        title: "Let the platform evolve",
        detail:
          "The repository documents its transition from a learning-management tool into a broader community application instead of hiding that product history.",
      },
      {
        title: "Keep operational tools in the same system",
        detail:
          "Member-facing experiences and administrative workflows share the same data and identity foundations.",
      },
    ],
    image: "/work/hmmitb.png",
    liveUrl: "https://hmmitb.com",
    repoUrl: "https://github.com/soezyxstt/hmm-lms",
    flagship: true,
    accent: "#265b4b",
    evidence: "Public repository, README, package architecture, migrations, tests, and deployment",
  },
  {
    slug: "fess-digital-twin",
    title: "FESS Monitoring & Digital Twin",
    eyebrow: "Supporting / Mechatronics HMI",
    year: "2025",
    role: "HMI & visualization engineer",
    status: "Engineering interface prototype",
    summary:
      "A monitoring interface for a flywheel energy-storage concept, combining MQTT telemetry, time-series views, and a Three.js digital twin.",
    challenge:
      "Give operators one legible view of machine state, vibration-oriented signals, and the physical assembly.",
    response:
      "Combined typed web components, MQTT messaging, charting, a relational data layer, and React Three Fiber visualization.",
    outcome:
      "A deployed technical HMI and public codebase that connect mechatronic context with modern web visualization patterns.",
    disciplines: ["Mechanical", "Embedded", "Software"],
    stack: ["Next.js", "MQTT", "Three.js", "Recharts", "Drizzle"],
    highlights: ["MQTT telemetry", "3D assembly", "Signal views"],
    architecture: [
      { label: "Machine", detail: "Flywheel assembly and instrumentation context." },
      { label: "Messaging", detail: "MQTT carries telemetry into the browser experience." },
      { label: "Interface", detail: "Charts and a 3D view provide complementary readings of system state." },
    ],
    decisions: [
      { title: "Use 3D only where it explains", detail: "The model is tied to the monitored machine rather than used as decorative WebGL." },
    ],
    image: "/work/fess.png",
    liveUrl: "https://fess-hmi.vercel.app",
    repoUrl: "https://github.com/soezyxstt/fess-hmi",
    accent: "#6d4ca5",
    evidence: "Public repository, dependencies, commit history, and deployment",
  },
  {
    slug: "iiot-conveyor",
    title: "IIoT Conveyor Interface",
    eyebrow: "Supporting / Industrial Automation",
    year: "2025—2026",
    role: "Full-stack HMI engineer",
    status: "Deployed laboratory interface",
    summary:
      "A browser-based conveyor HMI connecting MQTT machine data, operator controls, diagnostics, and persisted application state.",
    challenge:
      "Translate sensor and actuator state into an interface that supports both normal operation and troubleshooting.",
    response:
      "Separated monitoring, control, and diagnostic concerns while using MQTT, React Query, Zustand, validation, and a Drizzle-backed data layer.",
    outcome:
      "A public deployed interface and broker companion that demonstrate hardware-to-web system integration.",
    disciplines: ["Embedded", "Software", "Platform"],
    stack: ["Next.js", "MQTT", "Zustand", "React Query", "Drizzle", "Zod"],
    highlights: ["Live controls", "Diagnostics", "Broker companion"],
    architecture: [
      { label: "Conveyor", detail: "Sensors, relays, and actuators expose machine state." },
      { label: "Broker", detail: "MQTT provides the real-time messaging boundary." },
      { label: "HMI", detail: "Monitoring, controls, and diagnostics are separated by operator intent." },
    ],
    decisions: [
      { title: "Separate operational modes", detail: "The interface distinguishes routine control from diagnostic actions to keep risky controls contextual." },
    ],
    image: "/work/iot-convyor.png",
    liveUrl: "https://iiot-conveyor-hmi.vercel.app",
    repoUrl: "https://github.com/soezyxstt/iiot-conveyor-hmi",
    accent: "#a34c3f",
    evidence: "Public HMI and broker repositories, README architecture, and deployment",
  },
  {
    slug: "pemira-platform",
    title: "PEMIRA KM ITB Platform",
    eyebrow: "Supporting / Election Infrastructure",
    year: "2023—2024",
    role: "Head of Information Technology",
    status: "Team-delivered university platform",
    summary:
      "The official web platform for the 2023/2024 ITB student election, delivered as a team project with identity, data, statistics, and containerized deployment concerns.",
    challenge:
      "Support a visible campus process with clear candidate information and reliable application foundations.",
    response:
      "Contributed technical leadership and implementation within a Next.js, tRPC, Prisma, NextAuth, and Docker stack.",
    outcome:
      "A deployed election website with a public team repository and documented production configuration.",
    disciplines: ["Software", "Platform", "Leadership"],
    stack: ["Next.js", "tRPC", "Prisma", "NextAuth", "Docker", "Recharts"],
    highlights: ["Team project", "Containerized", "Official platform"],
    architecture: [
      { label: "Public experience", detail: "Election information and statistical presentation." },
      { label: "Application", detail: "Typed API flows, identity, and relational data." },
      { label: "Delivery", detail: "Separate development and production container configuration." },
    ],
    decisions: [
      { title: "Credit the team context", detail: "The portfolio describes Adi’s leadership role without presenting an organizational platform as solo work." },
    ],
    image: "/work/pemirakmitb.png",
    liveUrl: "https://pemirakmitb.vercel.app",
    repoUrl: "https://github.com/soezyxstt/web-pemira",
    accent: "#b43b36",
    evidence: "Public team repository, README, dependency graph, Docker configuration, and role history",
  },
  {
    slug: "iam-itb",
    title: "IAM ITB Digital Platform",
    eyebrow: "Supporting / Content Platform",
    year: "2026",
    role: "Platform engineer",
    status: "Active organization platform",
    summary:
      "A content-managed digital platform for the ITB mechanical-engineering alumni organization, with editorial workflows and migration tooling.",
    challenge:
      "Create a maintainable publishing system for organizational information rather than a static brochure site.",
    response:
      "Built on Payload CMS with structured content, search and SEO capabilities, form workflows, storage integration, migrations, and automated tests.",
    outcome:
      "An actively developed public codebase with deployment, database migration, moderation, and content-authoring concerns represented explicitly.",
    disciplines: ["Software", "Platform", "Product"],
    stack: ["Next.js", "Payload CMS", "PostgreSQL", "Turso", "R2", "Playwright"],
    highlights: ["Headless CMS", "Migration tooling", "E2E tests"],
    architecture: [
      { label: "Publishing", detail: "Structured editorial content and authoring workflows." },
      { label: "Application", detail: "Next.js presentation integrated with Payload CMS." },
      { label: "Data & media", detail: "Relational content, migration scripts, and object storage." },
    ],
    decisions: [
      { title: "Design for editors", detail: "Recent repository work focuses on moderation, authoring guidance, and operational content quality—not only the public UI." },
    ],
    image: "/work/iam-itb.png",
    liveUrl: "https://iam-omega.vercel.app",
    repoUrl: "https://github.com/soezyxstt/iam",
    accent: "#1f5974",
    evidence: "Public repository, migrations, tests, dependency graph, and recent commit history",
  },
];

export const archiveEntries = [
  ...projects.map((project) => ({
    slug: project.slug,
    title: project.title,
    year: project.year,
    disciplines: project.disciplines,
    summary: project.summary,
    href: `/work/${project.slug}`,
  })),
  {
    slug: "gumelar",
    title: "Gumelar Collaboration Hub",
    year: "2026",
    disciplines: ["Software", "Leadership"] as Discipline[],
    summary: "A public-facing coordination site for a Garut student collaboration initiative.",
    href: "https://www.ormadagumelar.com/",
  },
  {
    slug: "sentuh-undang",
    title: "Sentuh Undang",
    year: "2026",
    disciplines: ["Software", "Product"] as Discipline[],
    summary: "A digital invitation product exploring culturally specific presentation and guest workflows.",
    href: "https://sentuhundang.vercel.app/",
  },
  {
    slug: "mechanical-festival",
    title: "Mechanical Festival 2025",
    year: "2025",
    disciplines: ["Software", "Product"] as Discipline[],
    summary: "An event website focused on clear program communication and visual identity.",
    href: "https://m-fest-theta.vercel.app/",
  },
  {
    slug: "pamoka",
    title: "Pamoka Garut",
    year: "2026",
    disciplines: ["Software", "Platform"] as Discipline[],
    summary: "A content and program portal for Paguyuban Mojang Jajaka Garut.",
    href: "https://www.pamokagarut.com/",
  },
];

export const capabilityGroups = [
  {
    label: "Physical system",
    capabilities: ["Mechanical Design", "CAD", "Actuation", "Machine Constraints"],
    projects: ["Two-DOF SCARA Robot", "FESS Digital Twin"],
  },
  {
    label: "Behavior",
    capabilities: ["Control", "Embedded Firmware", "Telemetry", "Experimental Design"],
    projects: ["Two-DOF SCARA Robot", "IIoT Conveyor Interface"],
  },
  {
    label: "Digital product",
    capabilities: ["Web Architecture", "Data Models", "Interfaces", "Infrastructure"],
    projects: ["Zyx Academy", "HMM ITB Platform", "IAM ITB"],
  },
  {
    label: "Delivery",
    capabilities: ["Product Ownership", "Technical Direction", "Team Coordination", "Operations"],
    projects: ["Zyx Academy", "PEMIRA KM ITB", "HMM ITB Platform"],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

