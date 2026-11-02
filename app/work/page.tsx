import type { Metadata } from "next";
import { Suspense } from "react";

import { getCategories, getProjects } from "@/app/_actions/sanity.actions";
import { Projects, ProjectsSkeleton } from "@/components/sections/projects";

export const metadata: Metadata = {
  title: "All work",
  description: "Every project Rohosen Bhattacharya has designed and built, filterable by category.",
  alternates: { canonical: "/work" },
};

async function ProjectsSection() {
  const [projects, categories] = await Promise.all([getProjects(), getCategories()]);

  return <Projects projects={projects} categories={categories} />;
}

export default function WorkPage() {
  return (
    <div className="px-4 md:px-8 pt-28 md:pt-36 pb-20 md:pb-32">
      <h1 className="font-serif italic text-4xl md:text-5xl mb-6 md:mb-8">all work.</h1>
      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectsSection />
      </Suspense>
    </div>
  );
}
