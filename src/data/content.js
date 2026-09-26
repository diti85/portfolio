// Every figure on the site comes from the résumé
// (~/Documents/Resumes/EndritBasha.pdf) or from the project repositories.
// Keep it that way: no rounded-up or invented numbers.

import oneamsToday from "../assets/projects/oneams-today.webp";
import oneamsAsk from "../assets/projects/oneams-ask.webp";
import aipSite from "../assets/projects/aip.webp";
import bashaSite from "../assets/projects/basha-mgmt.webp";
import nptg from "../assets/archive/nptg.webp";
import household from "../assets/archive/household.webp";
import simbank from "../assets/archive/simbank.webp";
import datenight from "../assets/archive/date-night-sc.webp";
import reactique from "../assets/archive/reactique.webp";

export const profile = {
  name: "Endrit Basha",
  role: "Software Engineer II",
  team: "Data Engineering at GEICO",
  study: "M.S. Computer Science, University of Illinois",
  location: "Florida",
  timeZone: "America/New_York",
  email: "bashaditi@gmail.com",
  resume: "/Endrit-Basha-Resume.pdf",
  links: {
    github: "https://github.com/diti85",
    linkedin: "https://www.linkedin.com/in/endritbasha",
  },
};

export const nav = [
  { id: "systems", label: "Systems" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

// 30M+ messages/day, the ingestion service's documented volume.
export const MESSAGES_PER_DAY = 30_000_000;

export const pipelineSteps = [
  {
    title: "Thirty-three sources",
    body: "Enterprise systems publish events onto Service Bus topics around the clock, each at its own rhythm. I onboarded all 33 of them to one ingestion service.",
    readout: "sources",
  },
  {
    title: "Adaptive batching",
    body: "The service groups messages into batches that grow under heavy load and shrink when traffic is light, so throughput stays high without trading away latency.",
    readout: "batch",
  },
  {
    title: "Backpressure",
    body: "When a destination slows down, the service eases off: concurrency drops, work waits in line, and nothing is lost. When the destination recovers, the flow resumes on its own.",
    readout: "concurrency",
  },
  {
    title: "Delivered, twice",
    body: "Every message lands in Cosmos DB for operational reads and in Snowflake for analytics, at more than thirty million messages a day.",
    readout: "delivered",
  },
];

// Illustrative lineage for the health-engine demo. Names are made up;
// the shape (sources → pipelines → data products → reports) is the real idea.
export const lineage = {
  layers: ["Sources", "Pipelines", "Data products", "Reports"],
  nodes: [
    { id: "s0", layer: 0, label: "Customer events" },
    { id: "s1", layer: 0, label: "Payments feed" },
    { id: "s2", layer: 0, label: "Partner files" },
    { id: "s3", layer: 0, label: "Web telemetry" },
    { id: "p0", layer: 1, label: "Event ingest" },
    { id: "p1", layer: 1, label: "Payments ingest" },
    { id: "p2", layer: 1, label: "File loader" },
    { id: "p3", layer: 1, label: "Telemetry stream" },
    { id: "d0", layer: 2, label: "Customer 360" },
    { id: "d1", layer: 2, label: "Revenue daily" },
    { id: "d2", layer: 2, label: "Engagement" },
    { id: "d3", layer: 2, label: "Ops metrics" },
    { id: "r0", layer: 3, label: "Executive KPIs" },
    { id: "r1", layer: 3, label: "Finance close" },
    { id: "r2", layer: 3, label: "Operations" },
    { id: "r3", layer: 3, label: "Marketing" },
  ],
  edges: [
    ["s0", "p0"],
    ["s1", "p1"],
    ["s2", "p1"],
    ["s2", "p2"],
    ["s3", "p3"],
    ["p0", "d0"],
    ["p1", "d0"],
    ["p1", "d1"],
    ["p2", "d1"],
    ["p0", "d2"],
    ["p3", "d2"],
    ["p2", "d3"],
    ["p3", "d3"],
    ["d0", "r0"],
    ["d1", "r0"],
    ["d1", "r1"],
    ["d3", "r2"],
    ["d0", "r3"],
    ["d2", "r3"],
  ],
};

export const projects = [
  {
    id: "oneams",
    name: "OneAMS",
    years: "2026",
    role: "Founder and engineer",
    summary:
      "Membership management for volunteer-run associations, with AI assistants that work inside the permissions a board sets.",
    image: oneamsToday,
    imageAlt: "The OneAMS admin console showing an approval inbox and overdue dues grouped by age.",
    url: "https://oneams.ai",
    urlLabel: "oneams.ai",
    facts: [
      { value: "4,000+", label: "automated tests" },
      { value: "84", label: "database migrations" },
      { value: "Live", label: "in production since September 2026" },
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "Postgres",
      "Drizzle",
      "Claude API",
      "Stripe Connect",
      "WordPress plugin",
    ],
    story: {
      problem:
        "Most associations are run by volunteers juggling spreadsheets, payment apps and group chats. The software built for them is either too expensive or assumes a full-time staff.",
      built: [
        "A multi-tenant platform for members and households, dues and renewals, chapters with a national roll-up, events with tickets and check-in, email campaigns, and a member portal.",
        "Invoices posted to a double-entry ledger, so the treasurer's numbers always reconcile.",
        "AI assistants that answer plain-English questions as fixed reports with cited records, draft campaigns in the organization's own voice, and prepare renewals. All of it goes through an approval inbox, with per-organization autonomy settings and daily budgets.",
        "A WordPress plugin that connects OneAMS to an association's existing website with single sign-on, embeds and members-only content.",
      ],
      gallery: [
        {
          src: oneamsAsk,
          alt: "OneAMS answering “How many active members do we have at each level?” with a table and an explanation of how it was computed.",
        },
      ],
    },
  },
  {
    id: "aip",
    name: "AIP",
    fullName: "Association Intelligence Platform",
    years: "2026",
    role: "Creator",
    summary:
      "A buying-signal engine that maps more than 100,000 U.S. associations and notices when one is ready to change how it works.",
    image: aipSite,
    imageAlt:
      "The AIP landing page: a serif headline over a dot map of the United States, one dot per association.",
    url: "https://aip-pi.vercel.app",
    urlLabel: "aip-pi.vercel.app",
    facts: [
      { value: "100K+", label: "associations mapped" },
      { value: "1.9M", label: "IRS records screened" },
      { value: "528", label: "automated tests" },
    ],
    stack: ["Python", "FastAPI", "SQLAlchemy", "Postgres", "Playwright", "React", "Stripe"],
    story: {
      problem:
        "Sales tools can tell you which software a company runs. They can't tell you that a cultural association still collects dues by cheque, or that its board just changed.",
      built: [
        "A universe of associations loaded from the IRS Business Master File (about 1.9 million rows), with websites filled in from the organizations' own Form 990 filings.",
        "A polite crawler that respects robots.txt and reads how each organization actually operates: published dues, payment methods, sign-up forms, officers, chapters, and whether it uses any membership platform at all.",
        "A diff on every re-crawl, so a leadership handover or a platform switch arrives as a dated trigger. Every fact keeps its evidence snippet and source URL.",
        "A 0–100 fit score with a written reason for every point, served through a FastAPI and React dashboard with subscriber tiers and ten scheduled workflows.",
      ],
      gallery: [],
    },
  },
  {
    id: "basha",
    name: "Basha Management",
    years: "2025–2026",
    role: "Engineering",
    summary:
      "The website and consultation funnel for a family-run firm that manages associations and nonprofits.",
    image: bashaSite,
    imageAlt:
      "The Basha Management Services homepage: “Your Association Deserves a Team That's All In.”",
    url: "https://bashamanagement.com",
    urlLabel: "bashamanagement.com",
    facts: [],
    stack: ["Next.js", "React", "Tailwind", "Playwright", "Vercel"],
    story: {
      problem:
        "A small, family-run management firm competing with large agencies needed to look credible and make booking a first conversation effortless.",
      built: [
        "Services, industries, case studies and a founding-partner program, each page built toward a single consultation booking.",
        "A companion bookkeeping landing page aimed at CPA firms and fractional CFOs.",
        "End-to-end Playwright tests that run on every change, so the booking funnel can't quietly break.",
      ],
      gallery: [],
    },
  },
  {
    id: "rescue",
    name: "A nonprofit, restored",
    years: "2026",
    role: "Volunteer engineer, via Catchafire",
    summary:
      "A youth-mentoring nonprofit lost its website when its previous developer disappeared. I brought it back.",
    image: null,
    url: null,
    facts: [
      { value: "0", label: "source files to start from" },
      { value: "1", label: "theme staff can edit themselves" },
    ],
    stack: ["WordPress", "PHP", "WP-CLI", "Python"],
    story: {
      problem:
        "With no access to the old site, its files or its hosting, the only surviving copy of the organization's web presence was in public archives.",
      built: [
        "Recovered pages and images from the Wayback Machine and scripted their import into a fresh install.",
        "Rebuilt the site as a custom block-editor theme, so non-technical staff can update it without a developer.",
        "Set up program application forms and wrote handoff documentation for the team.",
      ],
      gallery: [],
    },
  },
];

export const archive = [
  {
    year: "2023",
    name: "Non Profit Tech Guide",
    note: "Capstone: a platform connecting nonprofits with vetted vendors, with MFA and SSO",
    stack: "AWS Lambda, DynamoDB, Cognito, React",
    image: nptg,
    url: null,
  },
  {
    year: "2023",
    name: "HouseHold",
    note: "Shared tasks, lists and events for roommates, on web and mobile",
    stack: "React Native, GraphQL, AWS",
    image: household,
    url: "https://github.com/diti85/large-project",
  },
  {
    year: "2023",
    name: "SimBank",
    note: "An online banking simulator with JWT authentication",
    stack: "Spring Boot, PostgreSQL",
    image: simbank,
    url: "https://github.com/diti85/SimBank",
  },
  {
    year: "2023",
    name: "Date Night",
    note: "Settles the “where should we eat?” question for two",
    stack: "React, Express, MongoDB",
    image: datenight,
    url: "https://github.com/diti85/date-night",
  },
  {
    year: "2023",
    name: "Reactique",
    note: "An e-commerce storefront with auth, cart and categories",
    stack: "React, Redux, Express",
    image: reactique,
    url: "https://github.com/diti85/Reactique",
  },
];

// Dates are [year, month] with month 1–12. `end: null` means ongoing.
export const timeline = [
  {
    id: "wizard",
    org: "Wizard Studios",
    title: "Software Engineer",
    place: "North Palm Beach, FL",
    start: [2021, 1],
    end: [2024, 3],
    points: [
      "Delivered 8+ full-stack projects, including e-commerce platforms and ordering systems.",
      "Drove end-to-end development from requirements to deployment in a cross-functional team of six.",
    ],
  },
  {
    id: "ucf",
    org: "University of Central Florida",
    title: "B.S. Computer Science",
    place: "Orlando, FL",
    // Only the graduation date is on the résumé; the thread fades in from the left.
    start: null,
    end: [2023, 12],
    points: ["Florida Academic Scholars Award: full funding toward the degree."],
  },
  {
    id: "geico",
    org: "GEICO",
    title: "Software Engineer I → II, Data Engineering",
    place: "Remote",
    start: [2024, 3],
    end: null,
    knots: [{ at: [2025, 7], label: "Promoted to Software Engineer II" }],
    points: [
      "Architected and scaled a distributed ingestion microservice streaming Azure Service Bus topics into Cosmos DB and Snowflake: 33 enterprise data sources, 30M+ messages a day.",
      "Owned scalability and performance: adaptive batching, concurrency controls and backpressure for variable load at low latency.",
      "Built a data observability platform and a lineage-aware health engine that gives real-time visibility into failures affecting Power BI and downstream analytics, with proactive failure detection and impact analysis.",
      "Led a fault-tolerant, NYDFS-aligned data retention platform in Go that automates policy-based deletion at scale.",
      "Replaced a legacy translation system with a custom Go service, retiring a $150K vendor dependency.",
      "Selected as a TDP Peer Mentor for new engineers.",
    ],
  },
  {
    id: "uiuc",
    org: "University of Illinois Urbana-Champaign",
    title: "M.S. Computer Science",
    place: "Online, part-time",
    start: [2025, 8],
    end: [2027, 12],
    expected: true,
    points: ["Graduate coursework alongside full-time work; expected December 2027."],
  },
];

export const ledger = [
  { label: "Messages ingested per day", value: "30M+" },
  { label: "Enterprise data sources onboarded", value: "33" },
  { label: "Vendor contract retired", value: "$150K" },
  { label: "Audit risk reduced", value: "75%" },
  { label: "Projected storage costs cut", value: "40%" },
  { label: "Peer-mentoring satisfaction", value: "90%+" },
];

export const capabilities = [
  {
    group: "Languages",
    items: ["Go", "Java", "Python", "TypeScript", "JavaScript", "SQL", "C", "PHP"],
  },
  {
    group: "Data and streaming",
    items: ["Azure Service Bus", "Kafka", "Snowflake", "Cosmos DB", "Postgres"],
  },
  {
    group: "Cloud and platform",
    items: ["Azure", "AWS", "Docker", "Kubernetes", "Terraform", "ArgoCD", "CI/CD"],
  },
  { group: "Observability", items: ["OpenTelemetry", "Grafana"] },
  {
    group: "Product",
    items: ["React", "Next.js", "Node and Express", "Spring", "Gin", "FastAPI", "React Native"],
  },
];

export const credentials = [
  { name: "AWS Certified Cloud Practitioner", kind: "Certification" },
  { name: "TestOut CyberDefense Pro", kind: "Certification" },
  { name: "Florida Academic Scholars Award", kind: "Award" },
  { name: "TDP Peer Mentor, GEICO", kind: "Selection" },
];
