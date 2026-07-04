import {
  javascript,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  docker,
  pbsc,
  ucf,
  java,
  spring,
  aws,
  mysql,
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

const technologies = [
  { name: "Java", icon: java },
  { name: "JavaScript", icon: javascript },
  { name: "React", icon: reactjs },
  { name: "Spring", icon: spring },
  { name: "AWS", icon: aws },
  { name: "Node.js", icon: nodejs },
  { name: "Tailwind", icon: tailwind },
  { name: "Redux", icon: redux },
  { name: "MongoDB", icon: mongodb },
  { name: "MySQL", icon: mysql },
  { name: "Git", icon: git },
  { name: "Docker", icon: docker },
];

// TODO(endrit): verify all experience bullets below — drafted, not confirmed.
const experiences = [
  {
    title: "Software Engineer II",
    company_name: "GEICO",
    icon: geico,
    date: "Aug 2025 — Present",
    points: [
      "Design and ship Go microservices powering policy-servicing workflows.",
      "Lead feature development across backend services and React front ends.",
      "Mentor early-career engineers and help drive code review standards.",
    ],
  },
  {
    title: "Software Engineer I",
    company_name: "GEICO",
    icon: geico,
    date: "Mar 2024 — Aug 2025",
    points: [
      "Built full-stack features for insurance platform applications.",
      "Contributed to migrating legacy systems to cloud infrastructure.",
      "Improved reliability and observability of production services.",
    ],
  },
  {
    title: "Software Engineer",
    company_name: "Wizard Studios",
    icon: ws,
    date: "Jan 2021 — Jan 2023",
    points: [
      "Developed and delivered client web applications end to end.",
      "Worked directly with clients to scope features and iterate on designs.",
    ],
  },
  {
    title: "B.S. Computer Science",
    company_name: "University of Central Florida",
    icon: ucf,
    date: "Aug 2021 — Dec 2023",
    points: [],
  },
  {
    title: "A.A.",
    company_name: "Palm Beach State College",
    icon: pbsc,
    date: "Aug 2020 — May 2022",
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
