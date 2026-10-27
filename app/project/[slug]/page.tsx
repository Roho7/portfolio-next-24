import { notFound } from "next/navigation";
import { getProjectBySlug, getProjectSlugs } from "@/app/_actions/sanity.actions";
import { CaseStudyHero } from "@/components/case-study/hero";
import { CaseStudyContent } from "@/components/case-study/content";
import { RelatedProjects } from "@/components/case-study/related-projects";
import type { Metadata } from "next";
import { urlFor } from "@/sanity/lib/image";
import { JsonLd } from "@/components/ui/json-ld";
import { projectJsonLd } from "@/lib/seo";

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: project.title,
    description: project.excerpt,
    keywords: project.tags,
    alternates: { canonical: `/project/${params.slug}` },
    openGraph: {
      type: "article",
      url: `/project/${params.slug}`,
      title: project.title,
      description: project.excerpt || "",
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="pt-20">
      <JsonLd
        data={projectJsonLd(
          project,
          project.heroImage
            ? urlFor(project.heroImage).width(1200).height(630).url()
            : undefined
        )}
      />
      <CaseStudyHero project={project} />
      {project.content && project.content.length > 0 && (
        <CaseStudyContent content={project.content} />
      )}
      <RelatedProjects currentSlug={params.slug} />
    </article>
  );
}

