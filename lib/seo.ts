import { toPlainText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import type { Callout, ContentBlock, Project, ProjectCard, Section, Stats } from "@/sanity/lib/types";
import { experience, education, skills, site } from "@/lib/profile";

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${site.url}/#person`,
    name: site.name,
    alternateName: site.alternateName,
    url: site.url,
    image: `${site.url}/logo.png`,
    jobTitle: site.jobTitle,
    description: site.description,
    email: `mailto:${site.email}`,
    address: { "@type": "PostalAddress", addressCountry: site.location },
    sameAs: site.sameAs,
    worksFor: experience
      .filter((exp, i, all) => exp.period.includes("2026") && all.findIndex((e) => e.company === exp.company) === i)
      .map((exp) => ({ "@type": "Organization", name: exp.company, url: exp.link })),
    alumniOf: education.map((edu) => ({
      "@type": "EducationalOrganization",
      name: edu.institution,
    })),
    knowsAbout: skills.flatMap((group) => group.items),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    description: site.description,
    author: { "@id": `${site.url}/#person` },
    inLanguage: "en",
  };
}

export function projectJsonLd(project: Project, imageUrl?: string) {
  const url = `${site.url}/project/${project.slug.current}`;

  return [
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "@id": `${url}#work`,
      name: project.title,
      headline: project.subtitle || project.title,
      description: project.excerpt,
      url,
      image: imageUrl,
      dateCreated: project.year,
      keywords: project.tags?.join(", "),
      genre: project.category?.title,
      author: { "@id": `${site.url}/#person` },
      creator: { "@id": `${site.url}/#person` },
      sameAs: [project.links?.live, project.links?.github].filter(Boolean),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: project.title, item: url },
      ],
    },
  ];
}

function blockToMarkdown(block: ContentBlock): string {
  const type = (block as { _type?: string })._type;

  if (type === "block") return toPlainText([block as PortableTextBlock]);
  if (type === "section") {
    const section = block as Section;
    return [
      `### ${section.sectionTitle}`,
      ...section.sectionContent
        .filter((child) => (child as { _type?: string })._type === "block")
        .map((child) => toPlainText([child as PortableTextBlock])),
    ].join("\n\n");
  }
  if (type === "callout") return `> ${(block as Callout).content}`;
  if (type === "stats") {
    return (block as Stats).items.map((item) => `- ${item.label}: ${item.value}`).join("\n");
  }
  return "";
}

export function projectSummaryLine(project: ProjectCard) {
  const meta = [project.category?.title, project.year].filter(Boolean).join(", ");
  return `- [${project.title}](${site.url}/project/${project.slug.current})${meta ? ` (${meta})` : ""}: ${(project.excerpt || project.subtitle || "").replace(/\s+/g, " ").trim()}`;
}

export function projectToMarkdown(project: Project) {
  const info = project.projectInfo;
  const facts = [
    info?.role?.length && `- Role: ${info.role.join(", ")}`,
    info?.platform && `- Platform: ${info.platform}`,
    info?.team && `- Team: ${info.team}`,
    info?.duration && `- Duration: ${info.duration}`,
    info?.client && `- Client: ${info.client}`,
    project.year && `- Year: ${project.year}`,
    project.tags?.length && `- Tags: ${project.tags.join(", ")}`,
    project.links?.live && `- Live: ${project.links.live}`,
    project.links?.github && `- Source: ${project.links.github}`,
  ].filter(Boolean);

  return [
    `## ${project.title}`,
    `URL: ${site.url}/project/${project.slug.current}`,
    project.subtitle,
    project.excerpt,
    facts.join("\n"),
    ...(project.content ?? []).map(blockToMarkdown),
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function profileMarkdown() {
  return [
    `# ${site.name}`,
    `> ${site.description}`,
    `## Experience\n\n${experience
      .map((exp) => `- ${exp.role}, ${exp.company} (${exp.period}): ${exp.description}`)
      .join("\n")}`,
    `## Education\n\n${education
      .map((edu) => `- ${edu.degree}, ${edu.institution} (${edu.period})${edu.note ? `, ${edu.note}` : ""}`)
      .join("\n")}`,
    `## Skills\n\n${skills
      .map((group) => `- ${group.category}: ${group.items.join(", ")}`)
      .join("\n")}`,
    `## Contact\n\n- Email: ${site.email}\n${site.sameAs.map((link) => `- ${link}`).join("\n")}`,
  ].join("\n\n");
}
