import {
  javascript,
  reactjs,
  nodejs,
  git,
  docker,
  ucf,
  java,
  spring,
  aws,
  ws,
  household,
  simbank,
  reactique,
  datenight,
  nptg,
  geico,
} from "../assets";

export const navLinks = [
  { id: "about", title: "About" },
  { id: "work", title: "Work" },
  { id: "contact", title: "Contact" },
];

// Entries without an icon render a mono abbreviation tile instead.
const technologies = [
  { name: "Go", abbr: "Go" },
  { name: "Java", icon: java },
  { name: "JavaScript", icon: javascript },
  { name: "Python", abbr: "Py" },
  { name: "React", icon: reactjs },
  { name: "Node.js", icon: nodejs },
  { name: "Spring", icon: spring },
  { name: "AWS", icon: aws },
  { name: "Azure", abbr: "Az" },
  { name: "Docker", icon: docker },
  { name: "Kubernetes", abbr: "K8s" },
  { name: "Terraform", abbr: "Tf" },
  { name: "Kafka", abbr: "Ka" },
  { name: "Git", icon: git },
];

const experiences = [
  {
    title: "Software Engineer II",
    company_name: "GEICO — Data Engineering",
    icon: geico,
    date: "Jul 2025 — Present",
    points: [
      "Architected and scaled a distributed data ingestion microservice streaming Azure Service Bus topics into CosmosDB and Snowflake — 33 enterprise data sources, 30M+ messages/day.",
      "Own scalability and performance engineering: adaptive batching, concurrency controls, and backpressure handling for variable load at low latency.",
      "Built a data observability platform with a lineage-aware health engine, giving real-time visibility into failures impacting PowerBI and downstream analytics.",
    ],
  },
  {
    title: "M.S. Computer Science",
    company_name: "University of Illinois Urbana-Champaign",
    abbr: "I",
    date: "Aug 2025 — Dec 2027",
    points: [],
  },
  {
    title: "Software Engineer I",
    company_name: "GEICO — Data Engineering",
    icon: geico,
    date: "Mar 2024 — Jul 2025",
    points: [
      "Led development of a fault-tolerant, NYDFS-compliant data retention platform in Go — automated policy-based deletion, cutting audit risk 75% and projected storage costs 40%.",
      "Replaced a legacy translation system with a custom Go service, eliminating a $150K vendor dependency.",
      "Selected as a TDP Peer Mentor, guiding new engineers with a 90%+ satisfaction rate.",
    ],
  },
  {
    title: "Software Engineer",
    company_name: "Wizard Studios",
    icon: ws,
    date: "Jan 2021 — Mar 2024",
    points: [
      "Delivered 8+ full-stack projects including e-commerce platforms and ordering systems.",
      "Drove end-to-end development from requirements to deployment in a cross-functional team of 6.",
    ],
  },
  {
    title: "B.S. Computer Science",
    company_name: "University of Central Florida",
    icon: ucf,
    date: "Dec 2023",
    points: [],
  },
];

const projects = [
  {
    name: "Non Profit Tech Guide",
    description:
      "Capstone project where I led backend development, architecting a robust authentication system on AWS Cognito, Lambda, and SAM for secure, scalable authorization.",
    tags: [{ name: "aws" }, { name: "react" }, { name: "serverless" }],
    image: nptg,
    source_code_link: "https://github.com/diti85",
  },
  {
    name: "HouseHold",
    description:
      "Full-stack mobile and web app that improves productivity between roommates — create and manage households, events, tasks, and shared shopping lists.",
    tags: [
      { name: "react" },
      { name: "react-native" },
      { name: "aws" },
      { name: "graphql" },
    ],
    image: household,
    source_code_link: "https://github.com/carlos-jmh/large-project",
  },
  {
    name: "SimBank",
    description:
      "Java Spring Boot project with an MVC architecture — a full-stack personal project simulating an online banking application.",
    tags: [{ name: "java" }, { name: "jwt" }, { name: "postgresql" }],
    image: simbank,
    source_code_link: "https://github.com/diti85",
  },
  {
    name: "Date Night",
    description:
      "A personalized app that solves the 'what to eat' dilemma — create, edit, and filter date night ideas by category.",
    tags: [
      { name: "react" },
      { name: "node" },
      { name: "express" },
      { name: "mongodb" },
    ],
    image: datenight,
    source_code_link: "https://github.com/diti85",
  },
  {
    name: "Reactique",
    description:
      "A complete e-commerce application with auth, shopping cart, products, and categories — built with React, Express, and Redux.",
    tags: [{ name: "react" }, { name: "node" }, { name: "redux" }],
    image: reactique,
    source_code_link: "https://github.com/diti85",
  },
];

export { technologies, experiences, projects };
