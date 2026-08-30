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
  gallery?: { src: string; alt: string; caption: string; wide?: boolean }[];
  videos?: { src: string; title: string; caption: string; poster?: string }[];
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
      "Built a shared telemetry contract between ESP32 firmware and a Next.js HMI, then tested a tracking differentiator, a trapezoidal motion profile, and independently switchable inertia, Coriolis, and gravity compensation.",
    outcome:
      "The tracking differentiator reduced mean absolute tracking error by 38.7%, while the trapezoidal profile reduced end-effector RMSE by 50.4%. The same experiments also exposed model mismatch: inertia compensation increased contour error, while gravity compensation cut final uphill error from 97.77 mm to 8.45 mm.",
    disciplines: ["Robotics", "Mechanical", "Embedded", "Control", "Software"],
    stack: ["ESP32", "C++", "Next.js", "TypeScript", "Python", "Web Serial"],
    highlights: ["38.7% lower tracking error with TD", "50.4% lower RMSE with trapezoidal motion", "Five controlled experiment groups"],
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
      {
        title: "Report the result, not the expected story",
        detail:
          "Inertia compensation increased mean contour error by 95.7% under the tested model. Keeping that negative result visible made model mismatch an engineering finding instead of hiding it behind aggregate performance claims.",
      },
    ],
    image: "/work/scara/monitor.png",
    gallery: [
      {
        src: "/work/scara/hardware.jpg",
        alt: "Physical two degree-of-freedom SCARA teaching robot",
        caption: "Hardware / the physical two-link teaching platform used for the experiments",
      },
      {
        src: "/work/scara/analysis.png",
        alt: "SCARA phase portrait and end-effector analysis charts",
        caption: "Analysis / phase portrait, Cartesian error, and velocity response",
      },
      {
        src: "/work/scara/step-noise.png",
        alt: "SCARA step response and filtered position analysis interface",
        caption: "Step & noise / target response, jitter, and steady-state error",
      },
      {
        src: "/work/scara/readme.png",
        alt: "SCARA browser HMI technical user guide",
        caption: "Documentation / operating guide embedded in the deployed HMI",
      },
    ],
    videos: [
      {
        src: "/work/scara/run-demo.mp4",
        title: "SCARA motion run",
        caption: "Physical run / a concise motion demonstration of the assembled two-link platform",
        poster: "/work/scara/hardware.jpg",
      },
      {
        src: "/work/scara/controller-tuning.mp4",
        title: "SCARA controller tuning",
        caption: "Controller tuning / parameter adjustment and response review through the operating interface",
        poster: "/work/scara/monitor.png",
      },
    ],
    liveUrl: "https://tugasakhir.adihnursyam.com",
    repoUrl: "https://github.com/soezyxstt/scara-final-year-project",
    flagship: true,
    accent: "#3757d5",
    evidence: "Signed thesis report, physical prototype, experiment datasets, public repository, and deployed HMI",
  },
  {
    slug: "zyx-academy",
    title: "Zyx Academy",
    eyebrow: "Flagship / AI Learning Platform",
    year: "2024—Now",
    role: "Founder & CEO · Product and engineering lead",
    status: "Active AI-enabled learning platform",
    summary:
      "An AI-enabled learning platform combining structured content, assessments, spaced repetition, progress tracking, and retrieval-backed tutoring.",
    challenge:
      "Turn fragmented learning content, practice, progress, and tutoring into one coherent product that can support learners between live sessions.",
    response:
      "Lead product architecture and full-stack development across learner experiences, relational and vector data, cloud infrastructure, AI workflows, and internal authoring systems.",
    outcome:
      "A live platform and operating education initiative demonstrating long-term ownership across product, engineering, content operations, and delivery.",
    disciplines: ["Software", "Platform", "Product", "Leadership"],
    stack: ["Next.js 16", "TypeScript", "Drizzle", "Turso", "Cloudflare R2", "Vectorize", "Gemini", "MCP"],
    highlights: ["Founder & CEO", "Retrieval-backed tutoring", "Structured authoring pipeline"],
    architecture: [
      { label: "Learner", detail: "Structured content, assessment, spaced repetition, progress, and tutor support." },
      { label: "Application", detail: "Full-stack product flows connect learning activity with operational workflows." },
      { label: "Knowledge", detail: "Relational records and vector retrieval support grounded learning experiences." },
      { label: "AI workflow", detail: "Retrieval-backed tutoring and internal authoring systems extend the product." },
      { label: "Operations", detail: "Teaching, content decisions, and platform iteration continuously inform one another." },
    ],
    decisions: [
      {
        title: "Build around a real learning operation",
        detail:
          "The platform is shaped by the needs of an operating tutoring initiative rather than by a fictional product brief.",
      },
      {
        title: "Ground AI in structured knowledge",
        detail:
          "Retrieval and authoring workflows are designed around maintained learning content rather than an unbounded general-purpose chat experience.",
      },
    ],
    image: "/work/zyx/home.png",
    gallery: [
      {
        src: "/work/zyx/architecture-public.png",
        alt: "Public-safe Zyx Academy system architecture showing interfaces, product core, canonical knowledge, storage, retrieval, and AI delivery",
        caption: "Architecture / public system view with operational identifiers and security-sensitive internals removed",
        wide: true,
      },
      {
        src: "/work/zyx/learning-loop.png",
        alt: "Zyx Academy mastery map and personalized learning loop",
        caption: "Learning loop / diagnosis, mastery mapping, and next-step guidance",
      },
      {
        src: "/work/zyx/zyra.png",
        alt: "Zyra retrieval-backed learning assistant section",
        caption: "Zyra / answers grounded in maintained course material",
      },
    ],
    liveUrl: "https://zyxacademy.com",
    repoUrl: "https://github.com/soezyxstt/zyx-academy-showcase",
    flagship: true,
    accent: "#a1642b",
    evidence: "Live product, sanitized captures, and a public engineering case-study repository",
  },
  {
    slug: "mebot",
    title: "MeBot",
    eyebrow: "Flagship / Local-First AI Assistant",
    year: "2026",
    role: "Product architect & full-stack engineer",
    status: "Active personal productivity product",
    summary:
      "A local-first personal assistant for capturing unstructured thoughts, turning them into actions, and managing the workspace through an agent interface.",
    challenge:
      "Make fast, messy capture useful without forcing people to organize every thought up front—or making private notes depend on a constant network connection.",
    response:
      "Designed an IndexedDB-first experience with an offline write queue, structured AI triage, semantic memory, a client-side vault, and an agent mode for changing workspace behavior through natural language.",
    outcome:
      "A deployed PWA that demonstrates privacy-conscious product boundaries, resilient local interaction, compound-input handling, and integrations with Google Calendar and Tasks.",
    disciplines: ["Software", "Platform", "Product"],
    stack: ["Next.js 16", "React 19", "TypeScript", "IndexedDB", "Cloudflare Workers", "D1", "R2", "Vectorize", "Gemini"],
    highlights: ["Local-first capture", "Offline write queue", "Semantic memory & agent mode"],
    architecture: [
      { label: "Capture", detail: "A low-friction dump interface accepts unstructured and compound input." },
      { label: "Local state", detail: "IndexedDB and an offline queue keep the primary interaction resilient." },
      { label: "AI triage", detail: "Structured output turns raw input into notes, tasks, categories, and follow-up actions." },
      { label: "Memory", detail: "Vector search and controlled context retrieval support continuity across sessions." },
      { label: "Integrations", detail: "Cloud services connect reminders with Google Calendar and Tasks." },
    ],
    decisions: [
      {
        title: "Keep capture local-first",
        detail:
          "The interface writes locally before synchronization, so the most frequent action remains fast and available when connectivity is unreliable.",
      },
      {
        title: "Separate dumping from agent control",
        detail:
          "Dump mode is optimized for capture; Agent mode is reserved for deliberate workspace changes such as categories, themes, reminders, and memory rules.",
      },
      {
        title: "Publish the system, not private data",
        detail:
          "The public case study documents architecture and interaction patterns while excluding notes, database contents, credentials, vault data, and security-sensitive implementation detail.",
      },
    ],
    image: "/work/mebot/dump-brain.png",
    gallery: [
      {
        src: "/work/mebot/agent-mode.png",
        alt: "MeBot agent workspace configuration interface",
        caption: "Agent mode / natural-language control for workspace configuration",
      },
    ],
    liveUrl: "https://mebot.adihnursyam.com",
    repoUrl: "https://github.com/soezyxstt/me-bot-showcase",
    flagship: true,
    accent: "#895c3f",
    evidence: "Live authenticated product, privacy-safe captures, and a sanitized public engineering case study",
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
    slug: "pln-idler-reliability",
    title: "BC-54 Idler Reliability Study",
    eyebrow: "Supporting / Industrial Reliability",
    year: "2025",
    role: "Primary Energy and Ash Maintenance Intern",
    status: "Field-informed internship study",
    summary:
      "A finite-element and failure-mechanism study of catastrophic carrying-idler shell damage in the BC-54 coal-handling conveyor at PLN Indonesia Power Banten 1 Suralaya Unit 8.",
    challenge:
      "Field failures were severe enough to split an idler shell, yet maintenance was largely reactive. The study needed to determine whether the original design was structurally inadequate or whether another degradation mechanism explained the mismatch.",
    response:
      "Measured the component in the field, translated the 800 TPH operating context into a 1,234.78 N equivalent load, built a simplified ASTM A36 shaft-and-shell model, and compared static and fatigue results with physical failure evidence.",
    outcome:
      "The model returned 68.77 MPa maximum von Mises stress, a 1.7449 minimum static safety factor, and a pure-fatigue prediction beyond one million cycles. That discrepancy redirected the root-cause hypothesis toward abrasive wear, wall thinning, and subsequent fatigue fracture—and informed a proposed ultrasonic thickness-inspection program.",
    disciplines: ["Mechanical"],
    stack: ["Ansys Workbench", "Finite Element Analysis", "Failure Analysis", "Field Measurement", "Condition-Based Maintenance"],
    highlights: ["68.77 MPa maximum stress", "1.7449 minimum safety factor", ">1M-cycle pure-fatigue prediction"],
    architecture: [
      { label: "Field evidence", detail: "Observed shell wear and catastrophic splitting on the BC-54 carrying idler." },
      { label: "Load model", detail: "Converted conveyor capacity, belt mass, and idler spacing into a 1,234.78 N equivalent load." },
      { label: "FEA", detail: "Evaluated static stress, safety factor, and fatigue life using a simplified ASTM A36 model." },
      { label: "Reconciliation", detail: "Compared safe-model results with the failed physical component instead of stopping at the simulation output." },
      { label: "Maintenance proposal", detail: "Proposed periodic ultrasonic wall-thickness inspection as a condition-based intervention." },
    ],
    decisions: [
      {
        title: "Treat disagreement as evidence",
        detail:
          "A safe static model did not invalidate the field failure. It narrowed the investigation toward degradation modes excluded from the simulation, especially abrasive wear and wall thinning.",
      },
      {
        title: "State the model boundary",
        detail:
          "Bearings, seals, abrasive wear, corrosion, impact loading, and possible misalignment were not represented. The portfolio therefore presents the maintenance thresholds as analytical proposals, not verified plant outcomes.",
      },
      {
        title: "Turn analysis into an actionable inspection concept",
        detail:
          "The report proposed an initial six-month ultrasonic inspection interval, a 2.0 mm warning level, and planned replacement at or below 1.5 mm, subject to refinement with real wear-rate data.",
      },
    ],
    image: "/work/pln/method.jpg",
    gallery: [
      {
        src: "/work/pln/failure.jpg",
        alt: "Failed BC-54 conveyor carrying idler shell documented during the PLN internship",
        caption: "Field evidence / severe abrasive wear and a split carrying-idler shell",
      },
      {
        src: "/work/pln/results.jpg",
        alt: "Ansys stress and safety-factor results for the BC-54 idler shell",
        caption: "Simulation / 68.77 MPa maximum stress and 1.7449 minimum safety factor",
      },
      {
        src: "/work/pln/maintenance.jpg",
        alt: "Condition-based maintenance proposal for BC-54 idler shell thickness inspection",
        caption: "Proposal / periodic ultrasonic thickness inspection with explicit action thresholds",
      },
    ],
    accent: "#9a7429",
    evidence: "Internship report, field photographs, measurement-derived load model, and Ansys results",
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
    href: "https://github.com/soezyxstt/moka",
  },
  {
    slug: "shaft-misalignment-calculator",
    title: "Shaft Misalignment Calculator",
    year: "2025",
    disciplines: ["Mechanical", "Software"] as Discipline[],
    summary: "A browser-based engineering calculator for face-and-rim shaft alignment corrections.",
    href: "https://github.com/soezyxstt/misalignment-calculator",
  },
  {
    slug: "hmm-election-platform",
    title: "HMM ITB Election Platform",
    year: "2024",
    disciplines: ["Software", "Platform"] as Discipline[],
    summary: "An authenticated, database-backed voting workflow for an internal HMM ITB election.",
    href: "https://github.com/soezyxstt/pemilu-hmm",
  },
  {
    slug: "engineering-tryout",
    title: "Engineering Tryout Platform",
    year: "2025",
    disciplines: ["Software", "Product"] as Discipline[],
    summary: "A subject-based practice-test application for engineering problem sets.",
    href: "https://github.com/soezyxstt/try-out",
  },
  {
    slug: "cakrai-attendance",
    title: "CAKRAI Internship Attendance",
    year: "2024",
    disciplines: ["Software", "Platform"] as Discipline[],
    summary: "An authenticated attendance workflow built for an organizational internship program.",
    href: "https://presensi-magang-cakrai.vercel.app",
  },
];

export const publicBuilds = [
  {
    slug: "shaft-misalignment-calculator",
    title: "Shaft Misalignment Calculator",
    description: "Turns face-and-rim readings, machine geometry, and bracket sag into bearing corrections.",
    stack: ["Next.js", "TypeScript", "Engineering utility"],
    repoUrl: "https://github.com/soezyxstt/misalignment-calculator",
  },
  {
    slug: "hmm-election-platform",
    title: "HMM ITB Election Platform",
    description: "Protected voting flow with typed APIs, authentication, and relational persistence.",
    stack: ["Next.js", "tRPC", "Prisma", "NextAuth"],
    repoUrl: "https://github.com/soezyxstt/pemilu-hmm",
  },
  {
    slug: "engineering-tryout",
    title: "Engineering Tryout Platform",
    description: "Subject-based engineering practice tests backed by a relational application model.",
    stack: ["Next.js", "Prisma", "Zod", "Recharts"],
    repoUrl: "https://github.com/soezyxstt/try-out",
  },
  {
    slug: "cakrai-attendance",
    title: "CAKRAI Internship Attendance",
    description: "A responsive attendance application with sign-in and participant workflows.",
    stack: ["T3 Stack", "Auth", "Prisma", "React"],
    liveUrl: "https://presensi-magang-cakrai.vercel.app",
    repoUrl: "https://github.com/soezyxstt/presensi-magang-cakrai",
  },
  {
    slug: "heat-transfer-portal",
    title: "Heat Transfer Summary Portal",
    description: "An academic reference interface for convection, phase change, and heat exchangers.",
    stack: ["Next.js", "KaTeX", "TypeScript"],
    liveUrl: "https://perpan.vercel.app",
    repoUrl: "https://github.com/soezyxstt/perpan",
  },
  {
    slug: "futuregen-prototype",
    title: "FutureGen for Change — v0",
    description: "A motion-led early prototype for a sustainability and social-impact initiative.",
    stack: ["Next.js", "Motion", "Lenis"],
    liveUrl: "https://future-lestari-v-0.vercel.app",
    repoUrl: "https://github.com/soezyxstt/future-lestari-v.0",
  },
];

export const capabilityGroups = [
  {
    label: "Physical system",
    capabilities: ["Mechanical Design", "CAD", "FEA", "Machine Constraints"],
    projects: ["Two-DOF SCARA Robot", "BC-54 Idler Reliability Study", "FESS Digital Twin"],
  },
  {
    label: "Behavior",
    capabilities: ["Control", "Embedded Firmware", "Telemetry", "Experimental Design"],
    projects: ["Two-DOF SCARA Robot", "IIoT Conveyor Interface"],
  },
  {
    label: "Digital product",
    capabilities: ["Web Architecture", "Data Models", "Interfaces", "Infrastructure"],
    projects: ["Zyx Academy", "MeBot", "HMM ITB Platform", "IAM ITB"],
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
