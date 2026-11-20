/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { BASE_RESUME } from './constants';
import { MapPin, MapPinOff, Phone, PhoneOff, ClipboardPaste, Check, Trash2, Printer, Download, Copy, RotateCcw } from 'lucide-react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import html2pdf from 'html2pdf.js';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const formatText = (text: string) => {
  return text.replace(/<span class=['"]bold['"]>(.*?)<\/span>/g, '<strong>$1</strong>');
};

interface ParsedProject {
  name: string;
  url?: string;
  roleOrTech?: string;
  description?: string;
  bullets?: string[];
}

const defaultProjectMap: Record<string, any> = {
  mindjjo: {
    url: "http://mindjjo.com",
    bullets: [
      "Architected and deployed scalable backend services and <span class='bold'>RESTful APIs</span> supporting high-traffic educational SaaS workflows",
      "Optimized database queries and API response times by 30% through structured caching and query indexing"
    ]
  },
  memoedu: {
    url: "https://memoedu.com/",
    bullets: [
      "Built interactive learning modules and spaced-repetition algorithms with automated review scheduling",
      "Engineered reliable backend endpoints and authentication flows for seamless multi-device synchronization"
    ]
  },
  xiltrix: {
    url: "https://xiltrix.com/",
    bullets: [
      "Contributed to real-time laboratory facility monitoring dashboards and IoT telemetry data ingestion pipelines",
      "Implemented automated alert dispatchers and WebSocket-driven live status monitoring for critical assets"
    ]
  },
  coworks: {
    url: "https://www.coworks.com/",
    bullets: [
      "Developed flexible workspace scheduling software, automated desk/room reservations, and member directories",
      "Integrated billing workflows and webhook listeners with third-party payment gateways"
    ]
  }
};

const parseProjects = (projects: any): ParsedProject[] => {
  const renderedProjects: ParsedProject[] = [];
  if (!projects) return renderedProjects;

  if (Array.isArray(projects)) {
    projects.forEach((proj: any) => {
      if (typeof proj === 'string') {
        renderedProjects.push({ name: proj, bullets: [] });
      } else if (typeof proj === 'object' && proj !== null) {
        const name = proj.name || proj.title || proj.projectName || 'Project';
        const lookup = defaultProjectMap[name.toLowerCase()];
        const bullets = Array.isArray(proj.bullets) && proj.bullets.length > 0
          ? proj.bullets
          : (proj.bulletPoints || proj.highlights || lookup?.bullets || (proj.description ? [proj.description] : []));
        renderedProjects.push({
          name,
          url: proj.url || proj.link || proj.website || proj.github || lookup?.url || '',
          roleOrTech: proj.role || (proj.techStack ? (Array.isArray(proj.techStack) ? proj.techStack.join(', ') : proj.techStack) : ''),
          description: proj.description || '',
          bullets
        });
      }
    });
  } else if (typeof projects === 'object' && projects !== null) {
    Object.entries(projects).forEach(([key, val]: [string, any]) => {
      const lookup = defaultProjectMap[key.toLowerCase()];
      if (typeof val === 'string') {
        const isUrl = val.startsWith('http://') || val.startsWith('https://');
        renderedProjects.push({
          name: key,
          url: isUrl ? val : (lookup?.url || ''),
          description: !isUrl ? val : '',
          bullets: lookup?.bullets || []
        });
      } else if (typeof val === 'object' && val !== null) {
        if (Array.isArray(val)) {
          renderedProjects.push({
            name: key,
            url: lookup?.url || '',
            bullets: val
          });
        } else {
          renderedProjects.push({
            name: key,
            url: val.url || val.link || lookup?.url || '',
            roleOrTech: val.role || (val.techStack ? (Array.isArray(val.techStack) ? val.techStack.join(', ') : val.techStack) : ''),
            description: val.description || '',
            bullets: Array.isArray(val.bullets) ? val.bullets : (val.bulletPoints || lookup?.bullets || [])
          });
        }
      }
    });
  }

  return renderedProjects;
};

const generateDoubleColumnHtml = (
  resumeData: any,
  showLocation: boolean = false,
  showPhone: boolean = true
) => {
  const { name, contact, professionalSummary, coreCompetencies, experience, projects, education } = resumeData;
  const currentTitle = resumeData.title || (experience && experience[0]?.title) || "Team Lead";
  const cleanLinkedIn = (contact?.linkedin || "").replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

  let html = `<div class="dc-container">\n`;

  // Header (without profile icon)
  html += `<div class="dc-header">\n`;
  html += `<div class="dc-header-left">\n`;
  html += `<h1 class="dc-name">${name}</h1>\n`;
  html += `<div class="dc-title">${currentTitle}</div>\n`;
  html += `<div class="dc-contacts">\n`;
  if (showPhone && contact?.phone) {
    html += `<span class="dc-contact-item">\n`;
    html += `<svg class="dc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>\n`;
    html += `<span>${contact.phone}</span>\n`;
    html += `</span>\n`;
  }
  if (contact?.email) {
    html += `<span class="dc-contact-item">\n`;
    html += `<svg class="dc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>\n`;
    html += `<a href="mailto:${contact.email}">${contact.email}</a>\n`;
    html += `</span>\n`;
  }
  if (contact?.linkedin) {
    html += `<span class="dc-contact-item">\n`;
    html += `<svg class="dc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>\n`;
    html += `<a href="${contact.linkedin}" target="_blank" rel="noopener noreferrer">${cleanLinkedIn}</a>\n`;
    html += `</span>\n`;
  }
  if (showLocation && (contact?.location || 'Lahore, Pakistan')) {
    html += `<span class="dc-contact-item">\n`;
    html += `<svg class="dc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>\n`;
    html += `<span>${contact.location || 'Lahore, Pakistan'}</span>\n`;
    html += `</span>\n`;
  }
  html += `</div>\n`;
  html += `</div>\n`;
  html += `</div>\n`;

  // 2-Column Body
  html += `<div class="dc-body">\n`;

  // Left Column (Main): Summary, Experience, Education
  html += `<div class="dc-col-main">\n`;

  // Summary
  if (professionalSummary) {
    html += `<section class="dc-section">\n`;
    html += `<h2 class="dc-sec-heading">Summary</h2>\n`;
    html += `<p class="dc-summary-text">${formatText(professionalSummary)}</p>\n`;
    html += `</section>\n`;
  }

  // Experience
  if (experience && experience.length > 0) {
    html += `<section class="dc-section">\n`;
    html += `<h2 class="dc-sec-heading">Experience</h2>\n`;
    experience.forEach((exp: any) => {
      html += `<div class="dc-exp-item">\n`;
      html += `<div class="dc-exp-title">${exp.title}</div>\n`;
      html += `<div class="dc-exp-company">${exp.company}</div>\n`;
      html += `<div class="dc-exp-meta">\n`;
      if (exp.period) {
        html += `<span class="dc-meta-item">\n`;
        html += `<svg class="dc-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>\n`;
        html += `<span>${exp.period}</span>\n`;
        html += `</span>\n`;
      }
      if (exp.location) {
        html += `<span class="dc-meta-item">\n`;
        html += `<svg class="dc-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>\n`;
        html += `<span>${exp.location}</span>\n`;
        html += `</span>\n`;
      }
      html += `</div>\n`;
      if (exp.bullets && exp.bullets.length > 0) {
        html += `<ul class="dc-bullets">\n`;
        exp.bullets.forEach((b: string) => {
          html += `<li>${formatText(b)}</li>\n`;
        });
        html += `</ul>\n`;
      }
      html += `</div>\n`;
    });
    html += `</section>\n`;
  }

  // Education
  const eduContent = education || (contact && contact.education);
  if (eduContent) {
    html += `<section class="dc-section">\n`;
    html += `<h2 class="dc-sec-heading">Education</h2>\n`;
    if (Array.isArray(eduContent)) {
      eduContent.forEach((edu: any) => {
        if (typeof edu === 'string') {
          html += `<div class="dc-edu-item"><p>${formatText(edu)}</p></div>\n`;
        } else if (typeof edu === 'object' && edu !== null) {
          const degree = edu.degree || edu.title || '';
          const school = edu.institution || edu.school || edu.university || '';
          const year = edu.period || edu.year || '';
          html += `<div class="dc-edu-item">\n`;
          if (degree) html += `<div class="dc-edu-degree">${formatText(degree)}</div>\n`;
          if (school) html += `<div class="dc-edu-school">${formatText(school)}</div>\n`;
          if (year) {
            html += `<div class="dc-edu-meta">\n`;
            html += `<svg class="dc-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>\n`;
            html += `<span>${year}</span>\n`;
            html += `</div>\n`;
          }
          html += `</div>\n`;
        }
      });
    } else {
      const str = String(eduContent);
      const parts = str.split('|').map(p => p.trim());
      if (parts.length >= 2) {
        html += `<div class="dc-edu-item">\n`;
        html += `<div class="dc-edu-degree">${formatText(parts[0])}</div>\n`;
        html += `<div class="dc-edu-school">${formatText(parts[1])}</div>\n`;
        if (parts[2]) {
          html += `<div class="dc-edu-meta">\n`;
          html += `<svg class="dc-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>\n`;
          html += `<span>${parts[2]}</span>\n`;
          html += `</div>\n`;
        }
        html += `</div>\n`;
      } else {
        html += `<div class="dc-edu-item"><p>${formatText(str)}</p></div>\n`;
      }
    }
    html += `</section>\n`;
  }

  html += `</div>\n`; // End dc-col-main

  // Right Column (Sidebar): Skills, Projects
  html += `<div class="dc-col-side">\n`;

  // Skills
  if (coreCompetencies) {
    html += `<section class="dc-section">\n`;
    html += `<h2 class="dc-sec-heading">Skills</h2>\n`;
    html += `<div class="dc-skills-wrap">\n`;

    if (Array.isArray(coreCompetencies)) {
      coreCompetencies.forEach((catObj: any, cIdx: number) => {
        const catName = typeof catObj === 'string' ? 'Skills' : (catObj.category || catObj.name || 'Skills');
        const rawSkills = typeof catObj === 'string' ? [catObj] : (catObj.skills || catObj.items || []);
        const skillList = Array.isArray(rawSkills) ? rawSkills : [String(rawSkills)];

        if (cIdx > 0) html += `<div class="dc-skill-divider"></div>\n`;
        html += `<div class="dc-skill-group">\n`;
        html += `<div class="dc-skill-cat-title">${catName}</div>\n`;
        html += `<div class="dc-chips-container">\n`;
        skillList.forEach((sk: string) => {
          html += `<span class="dc-chip">${formatText(String(sk).trim())}</span>\n`;
        });
        html += `</div>\n`;
        html += `</div>\n`;
      });
    } else if (typeof coreCompetencies === 'object') {
      const entries = Object.entries(coreCompetencies);
      entries.forEach(([category, skills]: [string, any], cIdx: number) => {
        const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1');
        const skillList = Array.isArray(skills) 
          ? skills 
          : String(skills || '').split(',').map(s => s.trim()).filter(Boolean);

        if (cIdx > 0) html += `<div class="dc-skill-divider"></div>\n`;
        html += `<div class="dc-skill-group">\n`;
        html += `<div class="dc-skill-cat-title">${formattedCategory}</div>\n`;
        html += `<div class="dc-chips-container">\n`;
        skillList.forEach((sk: string) => {
          html += `<span class="dc-chip">${formatText(String(sk).trim())}</span>\n`;
        });
        html += `</div>\n`;
        html += `</div>\n`;
      });
    }

    html += `</div>\n`;
    html += `</section>\n`;
  }

  // Projects
  const parsedProjects = parseProjects(projects);
  if (parsedProjects.length > 0) {
    html += `<section class="dc-section">\n`;
    html += `<h2 class="dc-sec-heading">Projects</h2>\n`;
    parsedProjects.forEach((proj) => {
      html += `<div class="dc-proj-item">\n`;
      html += `<div class="dc-proj-title">\n`;
      if (proj.url) {
        html += `<a href="${proj.url}" target="_blank" rel="noopener noreferrer">${proj.name}</a>\n`;
      } else {
        html += `<span>${proj.name}</span>\n`;
      }
      if (proj.roleOrTech) {
        html += `<span class="dc-proj-tech">| ${proj.roleOrTech}</span>\n`;
      }
      html += `</div>\n`;
      if (proj.description && (!proj.bullets || proj.bullets.length === 0)) {
        html += `<p class="dc-proj-desc">${formatText(proj.description)}</p>\n`;
      }
      if (proj.bullets && proj.bullets.length > 0) {
        html += `<ul class="dc-bullets dc-proj-bullets">\n`;
        proj.bullets.forEach((b: string) => {
          html += `<li>${formatText(b)}</li>\n`;
        });
        html += `</ul>\n`;
      }
      html += `</div>\n`;
    });
    html += `</section>\n`;
  }

  html += `</div>\n`; // End dc-col-side
  html += `</div>\n`; // End dc-body
  html += `</div>\n`; // End dc-container

  return html;
};

const generateMarkdownFromResume = (
  resumeData: any, 
  showLocation: boolean = false, 
  showPhone: boolean = true,
  template: string = 'double-column'
) => {
  if (template === 'double-column') {
    return generateDoubleColumnHtml(resumeData, showLocation, showPhone);
  }

  const { name, contact, professionalSummary, coreCompetencies, experience, projects, education } = resumeData;

  let markdown = `<div class="resume-header">\n`;
  markdown += `<h1>${name}</h1>\n`;
  markdown += `<div class="contact-info${!showLocation ? ' flex' : ''}">\n\n`;
  
  const contactParts = [];
  if (contact?.email) contactParts.push(`<strong>Email:</strong> ${contact.email}`);
  if (showPhone && contact?.phone) contactParts.push(`<strong>Phone:</strong> ${contact.phone}`);
  if (showLocation && (contact?.location || 'Lahore Punjab')) contactParts.push(`<strong>Location:</strong> ${contact.location || 'Lahore Punjab'}`);
  if (contact?.linkedin) contactParts.push(`<strong>LinkedIn:</strong> ${contact.linkedin}`);
  
  markdown += contactParts.join(' | ') + `\n\n`;
  markdown += `</div>\n`;
  markdown += `</div>\n\n`;

  markdown += `<h2>Summary</h2>\n${formatText(professionalSummary)}\n\n`;

  // Skills Section
  if (coreCompetencies) {
    const items: string[] = [];

    if (Array.isArray(coreCompetencies)) {
      coreCompetencies.forEach((item: any) => {
        if (typeof item === 'string') {
          items.push(`- ${formatText(item)}`);
        } else if (typeof item === 'object' && item !== null) {
          const cat = item.category || item.name || item.title || 'Skills';
          const sk = item.skills || item.items || item.list || [];
          const skText = Array.isArray(sk)
            ? sk.map((s: string) => formatText(String(s).trim())).join(', ')
            : formatText(String(sk));
          items.push(`- <strong>${cat}:</strong> ${skText}`);
        }
      });
    } else if (typeof coreCompetencies === 'object') {
      Object.entries(coreCompetencies).forEach(([category, skills]: [string, any]) => {
        const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1');
        const formattedSkills = Array.isArray(skills)
          ? skills.map((skill: string) => formatText(String(skill).trim())).join(', ')
          : formatText(String(skills || ''));
        items.push(`- <strong>${formattedCategory}:</strong> ${formattedSkills}`);
      });
    }

    if (items.length > 0) {
      markdown += `<h2>Skills</h2>\n`;
      if (items.length === 1) {
        markdown += `<div class="skills-container">\n`;
        markdown += `<div class="skills-col skills-col-left">\n\n`;
        markdown += items[0] + '\n\n';
        markdown += `</div>\n`;
        markdown += `</div>\n\n`;
      } else {
        const leftItems: string[] = [];
        const rightItems: string[] = [];

        items.forEach((item, idx) => {
          if (idx % 2 === 0) {
            leftItems.push(item);
          } else {
            rightItems.push(item);
          }
        });

        markdown += `<div class="skills-container">\n`;
        markdown += `<div class="skills-col skills-col-left">\n\n`;
        markdown += leftItems.join('\n') + '\n\n';
        markdown += `</div>\n`;
        markdown += `<div class="skills-col skills-col-right">\n\n`;
        markdown += rightItems.join('\n') + '\n\n';
        markdown += `</div>\n`;
        markdown += `</div>\n\n`;
      }
    }
  }

  markdown += `<h2>Experience</h2>\n`;
  if (experience) {
    experience.forEach((exp: any) => {
      markdown += `<div class="experience-item">\n`;
      markdown += `<div class="experience-sidebar">\n`;
      markdown += `<h3>${exp.company} | ${exp.location}</h3>\n`;
      markdown += `<h4>${exp.title}</h4>\n`;
      markdown += `<span class="experience-date">${exp.period}</span>\n`;
      markdown += `</div>\n`;
      markdown += `<div class="experience-main">\n\n`;
      if (exp.bullets) {
        exp.bullets.forEach((bullet: string) => {
          markdown += `- ${formatText(bullet)}\n`;
        });
      }
      markdown += `\n</div>\n`;
      markdown += `</div>\n\n`;
    });
  }

  // Projects Section
  const renderedProjects = parseProjects(projects);
  if (renderedProjects.length > 0) {
    markdown += `<h2>Projects</h2>\n`;
    renderedProjects.forEach((proj) => {
      markdown += `<div class="project-item">\n`;
      markdown += `<div class="project-header">\n`;
      const titleLink = proj.url 
        ? `<a href="${proj.url}" target="_blank" rel="noopener noreferrer">${proj.name}</a>`
        : proj.name;
      const tech = proj.roleOrTech ? ` <span class="project-tech">| ${proj.roleOrTech}</span>` : '';
      markdown += `<h3>${titleLink}${tech}</h3>\n`;
      markdown += `</div>\n`;

      if (proj.bullets && proj.bullets.length > 0) {
        markdown += `<div class="project-main">\n\n`;
        proj.bullets.forEach((bullet: string) => {
          markdown += `- ${formatText(bullet)}\n`;
        });
        markdown += `\n</div>\n`;
      } else if (proj.description) {
        markdown += `<div class="project-main">\n\n`;
        markdown += `- ${formatText(proj.description)}\n\n`;
        markdown += `</div>\n`;
      }
      markdown += `</div>\n\n`;
    });
  }

  // Education Section (below Projects)
  const eduContent = education || (contact && contact.education);
  if (eduContent) {
    markdown += `<h2>Education</h2>\n`;
    if (Array.isArray(eduContent)) {
      eduContent.forEach((edu: any) => {
        if (typeof edu === 'string') {
          markdown += `${formatText(edu)}\n\n`;
        } else if (typeof edu === 'object' && edu !== null) {
          const degree = edu.degree || edu.title || '';
          const school = edu.institution || edu.school || edu.university || '';
          const year = edu.period || edu.year || '';
          const line = [degree, school, year].filter(Boolean).join(' | ');
          markdown += `${formatText(line)}\n\n`;
        }
      });
    } else {
      markdown += `${formatText(String(eduContent))}\n\n`;
    }
  }

  return markdown;
};

export default function App() {
  const [jobDescription, setJobDescription] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);
  const [currentResumeData, setCurrentResumeData] = useState<any>(BASE_RESUME);
  const [template, setTemplate] = useState('double-column');
  const [showLocation, setShowLocation] = useState(false);
  const [showPhone, setShowPhone] = useState(true);
  const [generatedResume, setGeneratedResume] = useState<string | null>(
    generateMarkdownFromResume(BASE_RESUME, false, true, 'double-column')
  );
  const [identifiedTitle, setIdentifiedTitle] = useState('Naveed resume');
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [headingColor, setHeadingColor] = useState('#0284c7');
  const [pasteStatus, setPasteStatus] = useState<'idle' | 'pasted' | 'cleared'>('idle');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const processJobDescription = (inputText: string) => {
    const raw = inputText.trim();
    if (!raw) {
      setParseError(null);
      return;
    }

    try {
      let trimmedInput = raw;
      if (!trimmedInput.startsWith('{') || !trimmedInput.endsWith('}')) {
        const firstBrace = trimmedInput.indexOf('{');
        const lastBrace = trimmedInput.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          trimmedInput = trimmedInput.substring(firstBrace, lastBrace + 1);
        }
      }

      if (trimmedInput.startsWith('{') && trimmedInput.endsWith('}')) {
        const parsedObject = new Function(`return ${trimmedInput}`)();
        if (parsedObject && typeof parsedObject === 'object') {
          const fullResumeData = {
            ...BASE_RESUME,
            ...parsedObject
          };
          setCurrentResumeData(fullResumeData);
          setIdentifiedTitle("Naveed resume");
          setParseError(null);
          return;
        }
      }

      setParseError("Paste a valid resume object (starting with { and ending with }).");
    } catch (error) {
      console.error("Processing error:", error);
      setParseError("Could not parse resume object. Please check the format.");
    }
  };

  useEffect(() => {
    processJobDescription(jobDescription);
  }, [jobDescription]);

  const handlePasteFromClipboard = async () => {
    // 1. Always clear the job description box first
    setJobDescription('');
    setParseError(null);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.value = '';
      textarea.focus();
    }

    const applyPastedText = (text: string) => {
      setJobDescription(text);
      if (textareaRef.current) {
        textareaRef.current.value = text;
        textareaRef.current.focus();
      }
      setPasteStatus(text.length > 0 ? 'pasted' : 'cleared');
      setTimeout(() => setPasteStatus('idle'), 2000);
    };

    try {
      // 2. Try Async Clipboard readText()
      if (navigator.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        applyPastedText(text);
        return;
      }
    } catch (readTextErr) {
      console.warn('clipboard.readText failed, trying fallbacks:', readTextErr);
    }

    try {
      // 3. Fallback: Async Clipboard read() (ClipboardItem)
      if (navigator.clipboard?.read) {
        const items = await navigator.clipboard.read();
        for (const item of items) {
          if (item.types.includes('text/plain')) {
            const blob = await item.getType('text/plain');
            const text = await blob.text();
            applyPastedText(text);
            return;
          }
        }
      }
    } catch (readErr) {
      console.warn('clipboard.read failed, trying execCommand fallback:', readErr);
    }

    // 4. Fallback: document.execCommand('paste') on focused empty textarea
    if (textarea) {
      try {
        textarea.focus();
        const didPaste = document.execCommand('paste');
        if (didPaste && textarea.value) {
          applyPastedText(textarea.value);
          return;
        }
      } catch (execErr) {
        console.warn('execCommand paste failed:', execErr);
      }
    }

    // 5. If browser policy blocks all programmatic clipboard reads, keep box emptied & focused
    setPasteStatus('cleared');
    setTimeout(() => setPasteStatus('idle'), 3500);
    if (textarea) {
      textarea.focus();
    }
  };

  useEffect(() => {
    try {
      setGeneratedResume(generateMarkdownFromResume(currentResumeData, showLocation, showPhone, template));
    } catch (e) {
      console.error(e);
    }
  }, [currentResumeData, showLocation, showPhone, template]);

  const templates = [
    { id: 'double-column', name: 'Double column', desc: 'Enhancv Multi-Column' },
    { id: 'executive', name: 'Executive', desc: 'Premium & Detailed' },
    { id: 'modern', name: 'Modern', desc: 'Clean & Professional' },
    { id: 'classic', name: 'Classic', desc: 'Traditional & Formal' },
    { id: 'minimal', name: 'Minimal', desc: 'Sleek & Compact' }
  ];

  const handleResetToBase = () => {
    setJobDescription('');
    setParseError(null);
    setIdentifiedTitle('Naveed resume');
    setCurrentResumeData(BASE_RESUME);
  };

  const handleCopy = () => {
    if (generatedResume) {
      navigator.clipboard.writeText(generatedResume);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    const content = document.getElementById('resume-content');
    if (!content) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print your resume.');
      return;
    }

    // Get all stylesheets to preserve styling in the new window
    const styles = Array.from(document.styleSheets)
      .map(styleSheet => {
        try {
          return Array.from(styleSheet.cssRules)
            .map(rule => rule.cssText)
            .join('');
        } catch (e) {
          return '';
        }
      })
      .join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>${identifiedTitle}</title>
          <style>
            ${styles}
            body { 
              background: #f3f4f6 !important; 
              padding: 20px !important; 
              margin: 0 !important;
              display: flex;
              justify-content: center;
            }
            #resume-content { 
              width: 816px !important;
              min-height: 1056px !important;
              box-shadow: none !important;
            }
            #resume-content h1, #resume-content h2 {
              color: ${headingColor} !important;
            }
            @page { 
              size: letter; 
              margin: 0.20in; 
            }
            @media print {
              body { padding: 0 !important; background: white !important; }
              #resume-content { margin: 0 !important; width: 100% !important; min-height: auto !important; height: auto !important; }
            }
          </style>
        </head>
        <body>
          <div id="resume-content" class="prose template-${template}">
            ${content.innerHTML}
          </div>
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('resume-content');
    if (!element) return;

    setIsExporting(true);
    try {
      const opt = {
        margin:       5.08,
        filename:     `${identifiedTitle.replace(/\s+/g, '_')}_Resume.pdf`,
        image:        { type: 'png' as const, quality: 1.0 },
        html2canvas:  { 
          scale: 3, 
          useCORS: true, 
          letterRendering: true,
          scrollX: 0,
          scrollY: 0,
          windowWidth: 816
        },
        jsPDF:        { unit: 'mm' as const, format: 'letter' as const, orientation: 'portrait' as const, compress: true },
        pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF generation error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans selection:bg-emerald-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200 print:hidden">
        <div className="w-full px-4 sm:px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center shadow-sm shadow-emerald-200" />
            <h1 className="text-base font-bold tracking-tight text-zinc-900">AI Resume Tailor</h1>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href={BASE_RESUME.contact.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-1.5 text-zinc-500 hover:text-emerald-600 transition-colors text-xs font-medium"
            >
              LinkedIn
            </a>
            <div className="h-3.5 w-px bg-zinc-200" />
            <span className="text-xs font-medium text-zinc-600 hidden sm:block">
              {BASE_RESUME.name}
            </span>
          </div>
        </div>
      </header>

      <main className="w-full px-4 sm:px-5 py-4 print:p-0 print:m-0 print:max-w-none">
        <div className="grid grid-cols-1 lg:grid-cols-[270px_minmax(0,1fr)_215px] xl:grid-cols-[310px_minmax(0,1fr)_230px] gap-4 items-start print:block">
          
          {/* Left Column: Job Description Only */}
          <aside className="lg:sticky lg:top-16 print:hidden">
            <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <h2 className="text-sm font-semibold text-zinc-900">Job Description</h2>
                {jobDescription && (
                  <button
                    type="button"
                    onClick={() => {
                      setJobDescription('');
                      setParseError(null);
                      if (textareaRef.current) {
                        textareaRef.current.value = '';
                        textareaRef.current.focus();
                      }
                    }}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer shrink-0"
                    title="Clear job description"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handlePasteFromClipboard}
                className="w-full mb-2.5 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all active:scale-[0.98] shadow-xs cursor-pointer bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300"
                title="Empty the box and paste from clipboard"
              >
                {pasteStatus === 'pasted' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-semibold">Pasted &amp; Applied!</span>
                  </>
                ) : pasteStatus === 'cleared' ? (
                  <>
                    <ClipboardPaste className="w-3.5 h-3.5 text-amber-600" />
                    <span className="font-semibold">Cleared — Press Ctrl+V</span>
                  </>
                ) : (
                  <>
                    <ClipboardPaste className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Paste from Clipboard</span>
                  </>
                )}
              </button>

              {pasteStatus === 'cleared' && (
                <p className="mb-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
                  Box cleared. If your browser blocked automatic clipboard read, press Ctrl+V (or Cmd+V) to paste.
                </p>
              )}

              {parseError && (
                <p className="mb-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-2.5 py-1.5">
                  {parseError}
                </p>
              )}

              <textarea
                id="jobDescription"
                ref={textareaRef}
                rows={16}
                placeholder="Paste the tailored resume object here — it updates the resume automatically..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-y"
              />
            </div>
          </aside>

          {/* Center Column: Resume Preview */}
          <section className="min-w-0 print:block">
            {generatedResume && (
              <div className="overflow-x-auto pb-4 print:overflow-visible print:pb-0">
                <div 
                  id="resume-content" 
                  className={cn(
                    "prose max-w-none print:prose-p:text-black print:prose-li:text-black print:prose-h3:text-black rounded-xl border border-zinc-200/80 print:border-none print:rounded-none",
                    template === 'double-column' && "template-double-column",
                    template === 'modern' && "template-modern",
                    template === 'classic' && "template-classic",
                    template === 'minimal' && "template-minimal",
                    template === 'executive' && "template-executive"
                  )}
                  style={{ '--heading-color': headingColor } as React.CSSProperties}
                >
                  <Markdown rehypePlugins={[rehypeRaw]}>{generatedResume}</Markdown>
                </div>
              </div>
            )}
          </section>

          {/* Right Column: Print at Top Right + All Other Controls Vertically Aligned */}
          <aside className="space-y-3 lg:sticky lg:top-16 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto print:hidden">
            {generatedResume && (
              <div className="bg-white rounded-xl border border-zinc-200 p-3.5 shadow-sm flex flex-col gap-2.5">
                {/* Print button at top right side of the resume */}
                <button
                  onClick={handlePrint}
                  className="w-full py-2.5 px-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-sm shadow-emerald-200 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>

                <div className="flex items-center gap-2 px-1 pt-0.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider truncate">
                    {identifiedTitle ? identifiedTitle : 'Preview'}
                  </span>
                </div>

                {/* Vertical Actions */}
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isExporting}
                    className="w-full inline-flex items-center justify-between px-3 py-2 text-xs font-semibold text-zinc-700 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Download className="w-3.5 h-3.5" />
                      <span>{isExporting ? 'Exporting...' : 'Download PDF'}</span>
                    </span>
                  </button>

                  <button
                    onClick={handleCopy}
                    className="w-full inline-flex items-center justify-between px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    <span className="inline-flex items-center gap-2">
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </span>
                  </button>

                  <button
                    onClick={handleResetToBase}
                    className="w-full inline-flex items-center justify-between px-3 py-2 text-xs font-medium text-zinc-600 bg-zinc-50 border border-zinc-200 rounded-lg hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 transition-colors cursor-pointer"
                    title="Reset to Base Resume"
                  >
                    <span className="inline-flex items-center gap-2">
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </span>
                  </button>
                </div>

                {/* Vertical Display Toggles */}
                <div className="flex flex-col gap-1.5 pt-2 border-t border-zinc-100">
                  <label className="w-full flex items-center justify-between bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 cursor-pointer">
                    <span className="text-xs font-medium text-zinc-600">Theme Color</span>
                    <input 
                      type="color" 
                      value={headingColor} 
                      onChange={(e) => setHeadingColor(e.target.value)}
                      className="w-5 h-5 rounded cursor-pointer border-none p-0 bg-transparent"
                      title="Choose Heading Color"
                    />
                  </label>

                  <button
                    onClick={() => setShowPhone(!showPhone)}
                    className={cn(
                      "w-full px-3 py-2 rounded-lg transition-all text-xs font-medium flex items-center justify-between cursor-pointer",
                      showPhone 
                        ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100" 
                        : "text-zinc-500 bg-zinc-100 hover:bg-zinc-200"
                    )}
                    title={showPhone ? "Hide Phone" : "Show Phone"}
                  >
                    <span className="inline-flex items-center gap-2">
                      {showPhone ? <Phone className="w-3.5 h-3.5" /> : <PhoneOff className="w-3.5 h-3.5" />}
                      <span>Phone</span>
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold">
                      {showPhone ? 'On' : 'Off'}
                    </span>
                  </button>

                  <button
                    onClick={() => setShowLocation(!showLocation)}
                    className={cn(
                      "w-full px-3 py-2 rounded-lg transition-all text-xs font-medium flex items-center justify-between cursor-pointer",
                      showLocation 
                        ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100" 
                        : "text-zinc-500 bg-zinc-100 hover:bg-zinc-200"
                    )}
                    title={showLocation ? "Hide Location" : "Show Location"}
                  >
                    <span className="inline-flex items-center gap-2">
                      {showLocation ? <MapPin className="w-3.5 h-3.5" /> : <MapPinOff className="w-3.5 h-3.5" />}
                      <span>Location</span>
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold">
                      {showLocation ? 'On' : 'Off'}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Vertical Template Selector */}
            <div className="bg-white rounded-xl border border-zinc-200 p-3.5 shadow-sm">
              <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                Template
              </h2>
              <div className="flex flex-col gap-1.5">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTemplate(t.id)}
                    className={cn(
                      "w-full text-left px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer flex items-center justify-between",
                      template === t.id
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-xs"
                        : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
                    )}
                  >
                    <span>{t.name}</span>
                    {template === t.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-4 sm:px-6 py-6 border-t border-zinc-200 mt-6 print:hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500">
            © 2024 Muhammad Naveed. Built with Gemini AI.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors">Terms of Service</a>
            <a href="#" className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
