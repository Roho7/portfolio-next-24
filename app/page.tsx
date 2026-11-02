import { Suspense } from "react";

import { getProjects } from "@/app/_actions/sanity.actions";
import { About } from "@/components/sections/about";
import { EditorialHero } from "@/components/sections/editorial-hero";
import { Hero } from "@/components/sections/hero";
import { Intro } from "@/components/sections/intro";
import { MarqueeSection } from "@/components/sections/marquee-section";
import { Socials } from "@/components/sections/socials";
import { getContributions } from "@/lib/github";
import { site } from "@/lib/profile";

async function IntroSection() {
  const contributions = await getContributions(site.github);

  return <Intro contributions={contributions} />;
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
      <Suspense fallback={<Intro contributions={null} />}>
        <IntroSection />
      </Suspense>
      <MarqueeSection />
      <About />
      <Socials />
    </>
  );
}
