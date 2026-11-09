export const site = {
  name: "Derrick Ratnaharan",
  shortName: "Derrick",
  // Update once a custom domain is connected.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://derrickratnaharan.com",
  role: "Software Engineer",
  tagline: "From kernels to apps people actually use.",
  description:
    "Derrick Ratnaharan is a software engineer studying Applied Math & Statistics at the University of Toronto. He builds LLM inference runtimes in C++, static-analysis tools in Rust, and production apps.",
  email: "derrick.ratnah@gmail.com",
  github: "https://github.com/D-Haran",
  linkedin: "https://www.linkedin.com/in/derrick-ratnaharan-a61a7a19a/",
  resume: "/Derrick_Ratnaharan_Resume.pdf",
  location: "Toronto, Ontario",
  status: "Open to 2027 SWE & ML internships",
};

export type Project = {
  slug: "kestrel" | "repograph" | "campify";
  index: string;
  title: string;
  kicker: string;
  summary: string;
  metrics: { value: string; label: string }[];
  stack: string[];
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: "kestrel",
    index: "01",
    title: "Kestrel",
    kicker: "LLM inference runtime",
    summary:
      "Llama-family inference in C++20 with CPU and Metal backends. No PyTorch, no llama.cpp. I wrote the forward pass myself and checked every layer against Hugging Face.",
    metrics: [
      { value: "4.1e-5", label: "max logit error vs. HF" },
      { value: "53 tok/s", label: "CPU decode, M2 Pro" },
    ],
    stack: ["C++20", "Metal", "CMake", "Safetensors"],
    links: [{ label: "GitHub", href: "https://github.com/D-Haran/Kestrel" }],
  },
  {
    slug: "repograph",
    index: "02",
    title: "RepoGraph",
    kicker: "Static-analysis engine",
    summary:
      "A Rust engine that uses Tree-sitter to map the calls and imports in a Python or TypeScript repo, then tells you which tests a change can break, without guessing.",
    metrics: [
      { value: "0.36s", label: "cold index, 18K-LOC Flask" },
      { value: "14,954", label: "graph edges resolved" },
    ],
    stack: ["Rust", "Tree-sitter", "Graph algorithms"],
    links: [{ label: "GitHub", href: "https://github.com/D-Haran/RepoGraph" }],
  },
  {
    slug: "campify",
    index: "03",
    title: "Campify",
    kicker: "Campus social app",
    summary:
      "A campus social app on web, iOS and Android. Students import their timetable from a screenshot, see when friends are free, and find people in their classes.",
    metrics: [
      { value: "300+", label: "students onboarded" },
      { value: "54→71%", label: "profile completion" },
    ],
    stack: ["Flutter", "React", "Firebase", "Node.js"],
    links: [
      { label: "campify.ca", href: "https://campify.ca" },
      { label: "App Store", href: "https://apps.apple.com/us/app/campify/id6754953635" },
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.derrickr.campify" },
    ],
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
    org: "Mercor Intelligence & Handshake AI",
    place: "Remote",
    dates: "May — Sep 2026",
    logos: [
      { src: "/logos/org/mercor.png", alt: "Mercor" },
      { src: "/logos/org/handshake.png", alt: "Handshake AI" },
    ],
    points: [
      "Evaluated 70+ software engineering tasks across Python, JavaScript, TypeScript and backend codebases. Reproduced failures and checked AI-generated patches against tests, edge cases and specs.",
      "Set up and debugged unfamiliar repos with Git, Docker and Linux to tell implementation bugs apart from environment, dependency and config failures.",
    ],
  },
  {
    role: "Software Team Lead",
    org: "FIRST Robotics — Markham Robotics",
    place: "Markham, ON",
    dates: "Apr 2023 — Jun 2024",
    logos: [{ src: "/logos/org/first.svg", alt: "FIRST Robotics Competition" }],
    points: [
      "Led a 6-person team building a web platform for communication, strategy planning and match tracking. It cut competition prep by 2+ hours per event.",
      "Wrote Python scouting and analytics tools over 50+ match records, cutting manual data processing by 70%.",
    ],
  },
];

export const education = {
  school: "University of Toronto Mississauga",
  degree: "B.Sc. Applied Mathematics & Applied Statistics",
  minor: "Minor in Computer Science",
  dates: "Sep 2024 — Jun 2028",
  coursework:
    "Data Structures · Software Design · Object-Oriented Programming · Systems Programming · Probability & Statistics · Multivariable Calculus",
  logo: { src: "/logos/org/utoronto.svg", alt: "University of Toronto" },
};

export const awards = [
  { event: "MacHacks 2", prize: "Best Business Solution" },
  { event: "MacHacks 2", prize: "Most Creative Use of Twilio" },
  { event: "eHacks", prize: "Best Idea for Social Impact" },
];

// Core stack: languages → frameworks/platforms → tools, each with a logo.
export const stack: { name: string; logo: string }[] = [
  { name: "Python", logo: "/logos/tech/python.svg" },
  { name: "TypeScript", logo: "/logos/tech/typescript.svg" },
  { name: "C++", logo: "/logos/tech/cpp.svg" },
  { name: "React", logo: "/logos/tech/react.svg" },
  { name: "Next.js", logo: "/logos/tech/nextjs.svg" },
  { name: "Node.js", logo: "/logos/tech/nodejs.svg" },
  { name: "Flutter", logo: "/logos/tech/flutter.svg" },
  { name: "Firebase", logo: "/logos/tech/firebase.svg" },
  { name: "AWS", logo: "/logos/tech/aws.svg" },
  { name: "Android", logo: "/logos/tech/android.svg" },
  { name: "iOS", logo: "/logos/tech/apple.svg" },
  { name: "Git", logo: "/logos/tech/git.svg" },
  { name: "Docker", logo: "/logos/tech/docker.svg" },
  { name: "Bash", logo: "/logos/tech/bash.svg" },
];
