import { getProjectBySlug, getProjectSlugs } from "@/app/_actions/sanity.actions";
import { renderOgImage, ogSize } from "@/lib/og";
import { site } from "@/lib/profile";

export const alt = `Case study by ${site.name}`;
export const size = ogSize;
export const contentType = "image/png";

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);

  return renderOgImage({
    seed: params.slug,
    eyebrow: [project?.category?.title, project?.year].filter(Boolean).join(" · ") || "Case study",
    title: project?.title ?? site.name,
    description: project?.subtitle || project?.excerpt,
    tags: project?.tags,
  });
}
