import { getProjects } from "@/app/_actions/sanity.actions";
import { profileMarkdown, projectSummaryLine } from "@/lib/seo";
import { site } from "@/lib/profile";

export const revalidate = 3600;

export async function GET() {
  const projects = await getProjects();

  const body = [
    profileMarkdown(),
    `## Projects\n\n${projects.map(projectSummaryLine).join("\n")}`,
    `## Optional\n\n- [Full case studies](${site.url}/llms-full.txt): every project write-up as plain text`,
  ].join("\n\n");

  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
