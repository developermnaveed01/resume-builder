/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const BASE_RESUME = {
  name: "Muhammad Naveed",

  contact: {
    email: "mnaveed47012@gmail.com",
    phone: "+92-306-4702841",
    linkedin: "https://www.linkedin.com/in/mnaveed47012/",
    github: "https://github.com/naveedHashmi",
    education: "BS Computer Science | Punjab University College of Information and Technology | 2017-2021"
  },

  professionalSummary:
    "Senior Full Stack Engineer and Team Lead with <span class='bold'>6+ years</span> of experience building <span class='bold'>React</span> and <span class='bold'>TypeScript</span> applications with <span class='bold'>Node.js</span> backends on AWS. Currently lead a team shipping production AI features, including <span class='bold'>agentic AI</span> workflows, <span class='bold'>LLM API</span> integrations (OpenAI, Anthropic), <span class='bold'>RAG</span>, and <span class='bold'>tool/function calling</span>, backed by evaluation, guardrails, and cost/latency monitoring. Experienced in service-to-service API design, <span class='bold'>CI/CD</span>, and Agile/Scrum delivery in remote, cross-functional teams.",

  coreCompetencies: {
    frontend: ["<span class='bold'>React.js</span>", "Next.js", "Responsive UI Development"],
    languages: ["<span class='bold'>TypeScript</span>", "JavaScript (ES6+)"],
    backend: ["Agentic AI Workflows (Multi-step Agents)", "MCP (Model Context Protocol)", "LLM Integration (OpenAI/Anthropic APIs)", "Tool/Function Calling", "RAG", "Data Pipelines", "RESTful APIs", "Service-to-Service Integrations", "API Development"],
    backendFrameworks: ["Node.js", "Express.js"],
    architecture: ["API-Driven Architecture", "AI-Assisted Workflows", "Scalable Systems Design", "Microservices", "Distributed Systems"],
    databases: ["PostgreSQL", "MongoDB", "Relational Databases", "dbt (Familiarity)"],
    cloud: ["AWS (EC2, S3, CloudFront)", "Azure", "Docker"],
    devPractices: ["CI/CD Pipelines", "Agile/Scrum", "Team Leadership", "Mentoring", "AI-Assisted Development (Claude Code, Copilot, Cursor)", "Code Reviews", "Remote Collaboration"]
  },

  experience: [
    {
      title: "Team Lead",
      company: "Rstack Labs",
      location: "Remote",
      period: "April 2026–Present",
      techStack: ["React", "TypeScript", "Agentic Workflows", "OpenAI API", "Anthropic API", "RAG", "Function Calling", "AWS", "Azure", "CI/CD"],
      bullets: [
        "Lead a team of 4 engineers shipping AI-powered features in production with <span class='bold'>React</span>, <span class='bold'>TypeScript</span>, and <span class='bold'>LLM</span> integrations, serving 5 clients",
        "Design and deploy <span class='bold'>agentic AI</span> workflows in which multi-step agents plan tasks and call tools autonomously, with guardrails and fallback handling",
        "Architect <span class='bold'>OpenAI API</span> and <span class='bold'>Anthropic API</span> integrations covering prompt design, structured outputs, <span class='bold'>RAG</span> with supporting data pipelines, and <span class='bold'>tool/function calling</span>",
        "Define AI engineering standards: prompt versioning, evaluation and testing of model outputs, guardrails, cost and latency monitoring, and fallback handling, reducing LLM cost by 25%",
        "Introduced AI-assisted development (Claude Code, Copilot, Cursor) and mentor engineers on AI integration patterns, backend architecture, and code review practices",
        "Translate client requirements into AI-driven solutions through scoping, estimates, and sprint delivery, deploying on <span class='bold'>AWS</span> and <span class='bold'>Azure</span> with <span class='bold'>CI/CD</span> and delivering 12 releases on schedule"
      ]
    },
    {
      title: "Senior Full Stack Engineer",
      company: "Mindjjo",
      location: "Coimbatore, Tamil Nadu | India",
      period: "April 2024–April 2026",
      techStack: ["TypeScript", "Next.js", "Node.js", "PostgreSQL", "AWS", "Docker"],
      bullets: [
        "Designed and developed scalable backend services and RESTful APIs with <span class='bold'>TypeScript</span> and <span class='bold'>Node.js</span> for distributed web applications",
        "Built modular, maintainable architecture for high-traffic SaaS applications using <span class='bold'>Next.js</span> and <span class='bold'>PostgreSQL</span>",
        "Owned the full feature lifecycle, from architecture and implementation to deployment on <span class='bold'>AWS</span> with <span class='bold'>Docker</span>",
        "Optimized backend services and PostgreSQL queries, reducing API response times by 40%",
        "Resolved production issues and contributed to architecture decisions alongside product and engineering teams in Agile sprints"
      ]
    },
    {
      title: "Full Stack Developer",
      company: "Devsinc",
      location: "Lahore, Pakistan",
      period: "March 2022–April 2024",
      techStack: ["TypeScript", "React.js", "Node.js", "MongoDB", "AWS"],
      bullets: [
        "Built and maintained <span class='bold'>React.js</span> and <span class='bold'>TypeScript</span> user interfaces alongside <span class='bold'>Node.js</span> backend services",
        "Implemented RESTful APIs and backend modules for new product features and third-party integrations",
        "Improved API performance by 30% by optimizing logic and <span class='bold'>MongoDB</span> interactions",
        "Shipped user-facing features with designers, product managers, and engineers, maintaining quality through code reviews and testing"
      ]
    },
    {
      title: "Software Engineer",
      company: "Devsinc",
      location: "Lahore, Pakistan | Onsite",
      period: "March 2021–April 2022",
      techStack: ["Node.js", "React", "Express", "PostgreSQL"],
      bullets: [
        "Developed RESTful APIs and endpoints with <span class='bold'>Node.js</span> and <span class='bold'>Express</span>, integrating <span class='bold'>React</span> components with <span class='bold'>PostgreSQL</span>-backed services",
        "Took part in agile sprint planning, development, and peer code reviews"
      ]
    }
  ],

  education: "BS Computer Science | Punjab University College of Information and Technology | 2017-2021",

  projects: [
    {
name: "EduGuide AI",
url: "https://www.cialfo.co/",
description: "AI assistant and tool-calling backend for a K-12 student guidance platform (client project)",
techStack: ["MCP", "TypeScript", "React", "CI/CD"],
bullets: [
"Built an <span class='bold'>MCP</span> (Model Context Protocol) tool-calling backend with 21 tools, role- and plan-based access control, safe error handling, and an audit log of every tool call",
"Developed AI assistant chat interfaces in <span class='bold'>TypeScript</span> and Angular with streaming, resumable conversations, page-aware context, and dynamic UI cards",
"Built <span class='bold'>CI/CD</span> and evaluation tooling: replay-based tests on pull requests, pre-commit security checks, and automated Sentry issue triage that drafts fixes"
]
},
    {
      name: "Mindjjo",
      url: "http://mindjjo.com",
      bullets: [
        "Architected and deployed scalable backend services and <span class='bold'>RESTful APIs</span> supporting high-traffic educational SaaS workflows",
        "Optimized database queries and API response times by 30% through structured caching and query indexing"
      ]
    },
    {
      name: "Memoedu",
      url: "https://memoedu.com/",
      bullets: [
        "Built interactive learning modules and spaced-repetition algorithms with automated review scheduling",
        "Engineered reliable backend endpoints and authentication flows for seamless multi-device synchronization"
      ]
    },
    {
      name: "Xiltrix",
      url: "https://xiltrix.com/",
      bullets: [
        "Contributed to real-time laboratory facility monitoring dashboards and IoT telemetry data ingestion pipelines",
        "Implemented automated alert dispatchers and WebSocket-driven live status monitoring for critical assets"
      ]
    },
    {
      name: "Coworks",
      url: "https://www.coworks.com/",
      bullets: [
        "Developed flexible workspace scheduling software, automated desk/room reservations, and member directories",
        "Integrated billing workflows and webhook listeners with third-party payment gateways"
      ]
    }
  ]
};