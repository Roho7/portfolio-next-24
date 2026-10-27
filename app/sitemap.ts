import type { MetadataRoute } from "next";
import { getProjects } from "@/app/_actions/sanity.actions";
import { site } from "@/lib/profile";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();

  return [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/llms.txt`, changeFrequency: "weekly", priority: 0.5 },
    ...projects.map((project) => ({
      url: `${site.url}/project/${project.slug.current}`,
      changeFrequency: "monthly" as const,
      priority: project.featured ? 0.9 : 0.7,
    })),
  ];
}
