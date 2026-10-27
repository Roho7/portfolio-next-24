import { getProjectBySlug, getProjectSlugs } from "@/app/_actions/sanity.actions";
import { profileMarkdown, projectToMarkdown } from "@/lib/seo";
import type { Project } from "@/sanity/lib/types";

export const revalidate = 3600;

export async function GET() {
  const slugs = await getProjectSlugs();
  const projects = await Promise.all(slugs.map(getProjectBySlug));

  const body = [
    profileMarkdown(),
    "# Projects",
    ...projects.filter((p): p is Project => p !== null).map(projectToMarkdown),
  ].join("\n\n");

  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
