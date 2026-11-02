"use client";

import { useState } from "react";

import { ProjectList } from "@/components/ui/project-list";
import { cn } from "@/lib/utils";
import type { Category,ProjectCard as ProjectCardType } from "@/sanity/lib/types";

interface ProjectsProps {
  projects: ProjectCardType[];
  categories: Category[];
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "uppercase tracking-wider transition-colors hover:text-primary",
        active ? "text-primary" : "text-muted-foreground"
      )}
    >
      {children}
    </button>
  );
}

export function Projects({ projects, categories }: ProjectsProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredProjects = (
    activeCategory
      ? projects.filter((p) => p.category?.slug?.current === activeCategory)
      : [...projects]
  ).sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section id="projects">
      <ProjectList
        key={activeCategory ?? "all"}
        projects={filteredProjects}
        label="Projects"
        action={
          categories.length > 0 && (
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <FilterButton
                active={activeCategory === null}
                onClick={() => setActiveCategory(null)}
              >
                All
              </FilterButton>
              {categories.map((category) => (
                <FilterButton
                  key={category._id}
                  active={activeCategory === category.slug?.current}
                  onClick={() => setActiveCategory(category.slug?.current || null)}
                >
                  {category.title}
                </FilterButton>
              ))}
            </div>
          )
        }
      />
    </section>
  );
}

export function ProjectsSkeleton() {
  return (
    <section id="projects">
      <div className="pb-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        Projects
      </div>
      <ul className="border-b border-border">
        {[...Array(6)].map((_, i) => (
          <li key={i} className="border-t border-border py-3 md:py-4">
            <div className="h-8 w-1/3 rounded bg-muted animate-pulse" />
          </li>
        ))}
      </ul>
    </section>
  );
}
