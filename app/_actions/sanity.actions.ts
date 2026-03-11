import { client } from "@/sanity/lib/client";
import {
  projectsQuery,
  projectsByCategory,
  projectBySlugQuery,
  featuredProjectsQuery,
  categoriesQuery,
  projectSlugsQuery,
} from "@/sanity/lib/queries";
import type { Project, ProjectCard, Category } from "@/sanity/lib/types";

const fetchOptions = { next: { revalidate: 60 } }; // revalidate every 60 seconds

export async function getProjects(): Promise<ProjectCard[]> {
  return client.fetch(projectsQuery, {}, fetchOptions);
}

export async function getProjectsByCategory(category: string): Promise<ProjectCard[]> {
  return client.fetch(projectsByCategory, { category }, fetchOptions);
}

export async function getFeaturedProjects(): Promise<ProjectCard[]> {
  return client.fetch(featuredProjectsQuery, {}, fetchOptions);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return client.fetch(projectBySlugQuery, { slug }, fetchOptions);
}

export async function getCategories(): Promise<Category[]> {
  return client.fetch(categoriesQuery, {}, fetchOptions);
}

export async function getProjectSlugs(): Promise<string[]> {
  return client.fetch(projectSlugsQuery, {}, fetchOptions);
}

