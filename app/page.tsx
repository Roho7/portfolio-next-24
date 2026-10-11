import { Hero } from "@/components/sections/hero";
import { EditorialHero } from "@/components/sections/editorial-hero";
import { Projects, ProjectsSkeleton } from "@/components/sections/projects";
import { About } from "@/components/sections/about";
import { MarqueeSection } from "@/components/sections/marquee-section";
import { getProjects, getCategories } from "@/app/_actions/sanity.actions";
import { Suspense } from "react";

async function ProjectsSection() {
  const [projects, categories] = await Promise.all([
    getProjects(),
    getCategories(),
  ]);

  return <Projects projects={projects} categories={categories} />;
}

async function HeroSection() {
  const projects = await getProjects();

  return <EditorialHero projects={projects} />;
}

// TODO: drop the ?hero=classic comparison toggle and the old Hero before merging
export default function Home({
  searchParams,
}: {
  searchParams: { hero?: string };
}) {
  return (
    <>
      {searchParams.hero === "classic" ? (
        <Hero />
      ) : (
        <Suspense fallback={<EditorialHero projects={[]} />}>
          <HeroSection />
        </Suspense>
      )}
      <MarqueeSection />
      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectsSection />
      </Suspense>
      <About />
    </>
  );
}
