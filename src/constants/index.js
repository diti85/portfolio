import {
    mobile,
    backend,
    web,
    javascript,
    html,
    css,
    reactjs,
    redux,
    tailwind,
    nodejs,
    mongodb,
    git,
    figma,
    docker,
    pbsc,
    carrent,
    ucf,
    jobit,
    tripguide,
    threejs,
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
    {
      id: "about",
      title: "About",
    },
    {
      id: "work",
      title: "Work",
    },
    {
      id: "contact",
      title: "Contact",
    },
  ];
  
  const services = [
    {
      title: "Full Stack Developer",
      icon: web,
    },
    {
      title: "Data Engineering",
      icon: mobile,
    },
    {
      title: "Cloud Computing",
      icon: mobile,
    },
    {
      title: "DevOps",
      icon: backend,
    },
  ];
  
  const technologies = [
    {
      name: "Java",
      icon: java,
    },
    {
      name: "JavaScript",
      icon: javascript,
    },
    {
      name: "React JS",
      icon: reactjs,
    },
    {
      name: "Spring",
      icon: spring,
    },
    {
      name: "AWS",
      icon: aws,
    },
    {
      name: "Node JS",
      icon: nodejs,
    },
    {
      name: "Tailwind CSS",
      icon: tailwind,
    },
    // {
    //   name: "HTML 5",
    //   icon: html,
    // },
    // {
    //   name: "CSS 3",
    //   icon: css,
    // },

    {
      name: "Redux Toolkit",
      icon: redux,
    },
    {
      name: "MongoDB",
      icon: mongodb,
    },
    {
      name: "MySQL",
      icon: mysql,
    },
    // {
    //   name: "Three JS",
    //   icon: threejs,
    // },
    {
      name: "git",
      icon: git,
    },
    // {
    //   name: "figma",
    //   icon: figma,
    // },
    {
      name: "docker",
      icon: docker,
    },
  ];
  
  const experiences = [
    {
      title: "TDP Software Engineer",
      company_name: "GEICO",
      icon: geico,
      iconBg: "#E6DEDD",
      date: "Mar 2023 - Present",
      points: [      ],
    },
    {
      title: "Software Engineer",
      company_name: "Wizard Studios",
      icon: ws,
      iconBg: "#E6DEDD",
      date: "Jan 2021 - Jan 2022",
      points: [      ],
    },
    {
      title: "UCF - Bachelor of Science",
      company_name: "University of Central Florida",
      icon: ucf,
      iconBg: "#383E56",
      date: "Aug 2021 - Dec 2023",
      points: [
      ],
    },
    {
      title: "PBSC - Associate in Arts",
      company_name: "Palm Beach State College",
      icon: pbsc,
      iconBg: "#E6DEDD",
      date: "Aug 2020 - May 2022",
      points: [],
    },
  ];
  
  // const testimonials = [
  //   {
  //     testimonial:
  //       "I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
  //     name: "Sara Lee",
  //     designation: "CFO",
  //     company: "Acme Co",
  //     image: "https://randomuser.me/api/portraits/women/4.jpg",
  //   },
  //   {
  //     testimonial:
  //       "I've never met a web developer who truly cares about their clients' success like Rick does.",
  //     name: "Chris Brown",
  //     designation: "COO",
  //     company: "DEF Corp",
  //     image: "https://randomuser.me/api/portraits/men/5.jpg",
  //   },
  //   {
  //     testimonial:
  //       "After Rick optimized our website, our traffic increased by 50%. We can't thank them enough!",
  //     name: "Lisa Wang",
  //     designation: "CTO",
  //     company: "456 Enterprises",
  //     image: "https://randomuser.me/api/portraits/women/6.jpg",
  //   },
  // ];
  
  const projects = [
    {
      name: "Non Profit Tech Guide",
      description:
        "My capstone project where I led in backend development, architecting and implementing a robust authentication system. Leveraged cutting-edge cloud services, including AWS Cognito, Lambda functions, and Serverless Application Model (SAM), to ensure secure and scalable user authentication and authorization processes.",
      tags: [
        {
          name: "aws",
          color: "blue-text-gradient",
        },
        {
          name: "react",
          color: "green-text-gradient",
        },
        {
          name: "serverless",
          color: "pink-text-gradient",
        },
      ],
      image: nptg,
      source_code_link: "github.com/diti85",
    },
    {
      name: "HouseHold",
      description:
        "Full-stack application for mobile and web that improves productivity between roomates by allowing users to create, manage, and join households with their roomates. Roomates can create and manage events, tasks, and shopping lists for their household.",
      tags: [
        {
          name: "react",
          color: "blue-text-gradient",
        },
        {
          name: "react-native",
          color: "green-text-gradient",
        },
        {
          name: "aws",
          color: "pink-text-gradient",
        },
        {
          name: "graphql",
          color: "blue-text-gradient",
        },
      ],
      image: household,
      source_code_link: "https://github.com/carlos-jmh/large-project",
    },
    {
      name: "SimBank",
      description:
        "a JAVA Maven project created using Spring Boot and a Model-View-Controller architecture. A ongoing full stack personal project that simulates an online banking application.",
      tags: [
        {
          name: "java",
          color: "blue-text-gradient",
        },
        {
          name: "jwt",
          color: "green-text-gradient",
        },
        {
          name: "postgresql",
          color: "pink-text-gradient",
        },
      ],
      image: simbank,
      source_code_link: "https://github.com/diti85",
    },
    {
      name: "Date Night",
      description:
        "A personalized date night app I made for my girlfriend to solve the 'what to eat' dilemma with a fun and user-friendly way that allows you to create and manage date night ideas. Users can create, edit, and delete date night ideas. Users can also filter date night ideas by category.",
      tags: [
        {
          name: "react",
          color: "blue-text-gradient",
        },
        {
          name: "node",
          color: "green-text-gradient",
        },
        {
          name: "express",
          color: "pink-text-gradient",
        },
        {
          name: "mongodb",
          color: "blue-text-gradient",
        },
      ],
      image: datenight,
      source_code_link: "https://github.com/diti85",
    },
    {
      name: "Reactique",
      description:
        "A complete e-commerce application with login/register, shopping cart, product, and product categories made with React, Express, and Redux.",
      tags: [
        {
          name: "react",
          color: "blue-text-gradient",
        },
        {
          name: "node",
          color: "green-text-gradient",
        },
        {
          name: "redux",
          color: "pink-text-gradient",
        },
      ],
      image: reactique,
      source_code_link: "https://github.com/diti85",
    },
  ];
  
  export { services, technologies, experiences,  projects };