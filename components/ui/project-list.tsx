"use client";

import { type MotionValue, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import type { ProjectCard } from "@/sanity/lib/types";
import { cn } from "@/lib/utils";
import { CursorFollower, EASE_OUT, useRelativeCursor } from "@/components/ui/cursor-follower";

function ProjectRow({
  project,
  index,
  delay,
  isActive,
  isDimmed,
  onEnter,
}: {
  project: ProjectCard;
  index: number;
  delay: number;
  isActive: boolean;
  isDimmed: boolean;
  onEnter: () => void;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: delay + index * 0.07, ease: EASE_OUT }}
    >
      <Link
        href={`/project/${project.slug.current}`}
        onMouseEnter={onEnter}
        onFocus={onEnter}
        className={cn(
          "group grid grid-cols-[2.5rem_1fr_auto] md:grid-cols-[3rem_1fr_12rem_4rem_1.5rem] items-baseline gap-x-4",
          "border-t border-border py-3 md:py-4 transition-opacity duration-300",
          isDimmed && "opacity-30"
        )}
      >
        <span className="font-mono text-xs text-muted-foreground">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          className={cn(
            "font-hero text-2xl md:text-3xl font-semibold tracking-tight transition-transform duration-500",
            isActive && "md:translate-x-3 text-primary"
          )}
        >
          {project.title}
        </span>
        <span className="hidden md:block font-mono text-xs uppercase text-muted-foreground truncate">
          {project.category?.title}
        </span>
        <span className="font-mono text-xs text-muted-foreground md:text-right">
          {project.year}
        </span>
        <ArrowUpRight
          className={cn(
            "hidden md:block w-5 h-5 transition-all duration-300",
            isActive ? "text-primary rotate-45" : "text-muted-foreground"
          )}
        />
      </Link>
    </motion.li>
  );
}

function CursorPreview({
  projects,
  activeIndex,
  x,
  y,
}: {
  projects: ProjectCard[];
  activeIndex: number | null;
  x: MotionValue<number>;
  y: MotionValue<number>;
}) {
  return (
    <CursorFollower
      x={x}
      y={y}
      visible={activeIndex !== null}
      offsetClassName="translate-x-10 -translate-y-1/2"
      className="relative w-[22rem] aspect-[16/10] overflow-hidden rounded-lg"
    >
      {projects.map((project, i) =>
        project.heroImage?.asset ? (
          <Image
            key={project._id}
            src={urlFor(project.heroImage).width(720).height(450).url()}
            alt=""
            fill
            sizes="352px"
            className={cn(
              "object-cover transition-opacity duration-300",
              i === activeIndex ? "opacity-100" : "opacity-0"
            )}
          />
        ) : null
      )}
    </CursorFollower>
  );
}

// Numbered project rows with a mono header and an image preview that follows the cursor.
export function ProjectList({
  projects,
  label,
  action,
  delay = 0,
}: {
  projects: ProjectCard[];
  label: string;
  action?: React.ReactNode;
  delay?: number;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const cursor = useRelativeCursor<HTMLDivElement>();

  return (
    <div
      ref={cursor.ref}
      onMouseMove={cursor.onMouseMove}
      onMouseLeave={() => setActiveIndex(null)}
      className="relative"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pb-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        <span>
          {label} ({String(projects.length).padStart(2, "0")})
        </span>
        {action}
      </div>
      <ul className="border-b border-border">
        {projects.map((project, i) => (
          <ProjectRow
            key={project._id}
            project={project}
            index={i}
            delay={delay}
            isActive={activeIndex === i}
            isDimmed={activeIndex !== null && activeIndex !== i}
            onEnter={() => setActiveIndex(i)}
          />
        ))}
      </ul>
      <CursorPreview
        projects={projects}
        activeIndex={activeIndex}
        x={cursor.x}
        y={cursor.y}
      />
    </div>
  );
}
