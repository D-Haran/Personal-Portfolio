export const site = {
  name: "Derrick Ratnaharan",
  shortName: "Derrick",
  // Update once a custom domain is connected.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://derrickratnaharan.com",
  role: "Software Engineer",
  tagline: "From kernels to apps people actually use.",
  description:
    "Derrick Ratnaharan is a software engineer studying Applied Math & Statistics at the University of Toronto. He builds LLM inference runtimes in C++, systems software in C, and production apps people use.",
  email: "derrick.ratnah@gmail.com",
  github: "https://github.com/D-Haran",
  linkedin: "https://www.linkedin.com/in/derrick-ratnaharan-a61a7a19a/",
  resume: "/Derrick_Ratnaharan_Resume.pdf",
  location: "Toronto, Ontario",
  status: "Open to 2027 SWE & ML internships",
};

export type Project = {
  slug: "campify" | "kestrel" | "cosign" | "shell";
  index: string;
  title: string;
  kicker: string;
  /** One line for the home-page card. */
  blurb: string;
  summary: string;
  metrics: { value: string; label: string }[];
  stack: string[];
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: "campify",
    index: "01",
    title: "Campify",
    kicker: "Campus social app",
    blurb:
      "Timetable sharing and friend discovery for university students, on iOS, Android and web.",
    summary:
      "A campus social app on web, iOS and Android. Students import their timetable from a screenshot, see when friends are free, and find people in their classes.",
    // Shown only on the home-page card, so the labels stay short.
    metrics: [
      { value: "300+", label: "students" },
      { value: "92%", label: "classes read" },
    ],
    stack: ["Flutter", "React", "Firebase", "Node.js"],
    links: [
      { label: "campify.ca", href: "https://campify.ca" },
      { label: "App Store", href: "https://apps.apple.com/us/app/campify/id6754953635" },
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.derrickr.campify" },
    ],
  },
  {
    slug: "kestrel",
    index: "02",
    title: "Kestrel",
    kicker: "LLM inference engine",
    blurb:
      "A Llama inference engine written from scratch in C++20, with CPU and Metal backends.",
    summary:
      "Llama-family inference in C++20 with CPU and Metal backends. No PyTorch, no llama.cpp. I wrote the forward pass myself, then made the GPU path 10× faster without breaking a single output.",
    metrics: [
      { value: "217", label: "tok/s decode" },
      { value: "50/50", label: "vs HF" },
    ],
    stack: ["C++20", "Metal", "CMake", "Safetensors"],
    links: [{ label: "GitHub", href: "https://github.com/D-Haran/Kestrel" }],
  },
  {
    slug: "cosign",
    index: "03",
    title: "Cosign",
    kicker: "AI output verification",
    blurb:
      "Checks AI-written documents against real sources, and pays research agents only for what holds up.",
    summary:
      "A verification layer for AI-written documents, built at Hack the North 2026. It reads a document against itself, sends what's left to independent research agents, and pays them on-chain only for the claims it can ground.",
    metrics: [
      { value: "25/30", label: "errors caught" },
      { value: "60K", label: "chars/audit" },
    ],
    stack: ["TypeScript", "React", "Cloudflare Workers", "Solana"],
    links: [{ label: "GitHub", href: "https://github.com/D-Haran/htn-cosign" }],
  },
  {
    slug: "shell",
    index: "04",
    title: "mysh",
    kicker: "Unix shell & TCP chat server",
    blurb:
      "A Unix shell in C with pipelines and background jobs, plus a TCP chat server on one select() loop.",
    summary:
      "A Unix shell written in C — pipelines, background jobs, variable expansion — with a single-threaded TCP chat server built into it, multiplexing every client through one non-blocking select() loop.",
    metrics: [
      { value: "11", label: "built-ins" },
      { value: "50+", label: "clients" },
    ],
    stack: ["C", "POSIX", "Python"],
    links: [],
  },
];

export type ExperienceItem = {
  role: string;
  org: string;
  place: string;
  dates: string;
  logos: { src: string; alt: string }[];
  points: string[];
};

export const experience: ExperienceItem[] = [
  {
    role: "Technical Lead",
    org: "Google Developer Groups on Campus",
    place: "Mississauga, ON",
    dates: "Oct 2026 — Present",
    logos: [{ src: "/logos/org/gdg.svg", alt: "Google Developer Groups" }],
    points: [
      "Build the technical content for hands-on AI/ML and software engineering workshops: live coding demos and project-based materials.",
      "Plan sessions on app development, debugging and deployment with the executive team.",
    ],
  },
  {
    role: "Software Engineering Evaluator (Contract)",
    org: "Mercor Intelligence",
    place: "Remote",
    dates: "Jun — Sep 2026",
    logos: [{ src: "/logos/org/mercor.png", alt: "Mercor" }],
    points: [
      "Evaluated AI-generated code patches across 70+ software engineering tasks in Python and TypeScript, using Pytest as the arbiter.",
      "Authored up to 13 regression tests per issue, verifying each one failed before the patch and passed cleanly after it.",
      "Validated candidates in isolated Docker environments, running targeted checks and suites of up to 2,991 tests, and traced root causes across application logic, test suites and external dependencies.",
    ],
  },
  {
    role: "Software Team Lead",
    org: "FIRST Robotics — Markham Robotics",
    place: "Markham, ON",
    dates: "Apr 2023 — Jun 2024",
    logos: [{ src: "/logos/org/first.svg", alt: "FIRST Robotics Competition" }],
    points: [
      "Built a full-stack Next.js/Firebase scouting app with a searchable team database and a unified interactive strategy map.",
      "Replaced manual Excel scouting with a central dashboard tracking 50+ opposing teams across 2 regional events.",
      "Three other FRC teams asked for access and deployed the platform for their own tournament scouting.",
    ],
  },
];

export const education = {
  school: "University of Toronto",
  degree: "B.Sc. Applied Mathematics & Applied Statistics",
  minor: "Minor in Computer Science",
  dates: "Sep 2024 — Expected May 2028",
  coursework: "Data Structures & Algorithms · Software Design · Systems Programming · Machine Learning",
  logo: { src: "/logos/org/utoronto.svg", alt: "University of Toronto" },
};

export const awards = [
  { event: "MacHacks 2 · 2023", prize: "Best Business Solution", project: "Friday, an SMS personal finance assistant" },
  { event: "MacHacks 2 · 2023", prize: "Most Creative Use of Twilio", project: "Friday, an SMS personal finance assistant" },
  { event: "eHacks · 2024", prize: "Best Idea for Social Impact", project: "Stuart, an SMS wellness habit coach" },
  { event: "Hack the North · 2026", prize: "Nominated — Best Use of Solana", project: "Cosign, AI output verification" },
];

/** Core stack, grouped the way the résumé groups it. Each entry has a logo tile. */
export const stack: { group: string; items: { name: string; logo: string }[] }[] = [
  {
    group: "Languages",
    items: [
      { name: "Python", logo: "/logos/tech/python.svg" },
      { name: "TypeScript", logo: "/logos/tech/typescript.svg" },
      { name: "JavaScript", logo: "/logos/tech/javascript.svg" },
      { name: "C++", logo: "/logos/tech/cpp.svg" },
      { name: "C", logo: "/logos/tech/c.svg" },
      { name: "SQL", logo: "/logos/tech/sql.svg" },
      { name: "Dart", logo: "/logos/tech/dart.svg" },
    ],
  },
  {
    group: "Frameworks & libraries",
    items: [
      { name: "React", logo: "/logos/tech/react.svg" },
      { name: "Next.js", logo: "/logos/tech/nextjs.svg" },
      { name: "Node.js", logo: "/logos/tech/nodejs.svg" },
      { name: "Flutter", logo: "/logos/tech/flutter.svg" },
      { name: "NumPy", logo: "/logos/tech/numpy.svg" },
      { name: "pandas", logo: "/logos/tech/pandas.svg" },
    ],
  },
  {
    group: "Cloud & databases",
    items: [
      { name: "Firebase", logo: "/logos/tech/firebase.svg" },
      { name: "PostgreSQL", logo: "/logos/tech/postgresql.svg" },
      { name: "AWS", logo: "/logos/tech/aws.svg" },
      { name: "OpenAI API", logo: "/logos/tech/openai.svg" },
      { name: "Vertex AI", logo: "/logos/tech/vertexai.svg" },
      { name: "Elasticsearch", logo: "/logos/tech/elasticsearch.svg" },
      { name: "Cloudflare Workers", logo: "/logos/tech/cloudflare.svg" },
    ],
  },
  {
    group: "Tools",
    items: [
      { name: "Git", logo: "/logos/tech/git.svg" },
      { name: "Docker", logo: "/logos/tech/docker.svg" },
      { name: "Linux", logo: "/logos/tech/linux.svg" },
      { name: "Bash", logo: "/logos/tech/bash.svg" },
      { name: "CMake", logo: "/logos/tech/cmake.svg" },
      { name: "Metal", logo: "/logos/tech/apple.svg" },
    ],
  },
];
