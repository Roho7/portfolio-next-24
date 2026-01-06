"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "./badge";
import { BorderBeam } from "./border-beam";
import { urlFor } from "@/sanity/lib/image";
import type { ProjectCard as ProjectCardType } from "@/sanity/lib/types";
import { ArrowUpRight } from "lucide-react";

interface ProjectCardProps {
  project: ProjectCardType;
  index?: number;
  featured?: boolean;
}

export function ProjectCard({ project, index = 0, featured = false }: ProjectCardProps) {
  return (
    <Link href={`/project/${project.slug.current}`}>
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ y: -5 }}
        className={cn(
          "group relative overflow-hidden rounded-2xl bg-card border border-border",
          "transition-all duration-500",
          featured ? "col-span-2 row-span-2" : ""
        )}
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          {project.heroImage?.asset && (
            <Image
              src={urlFor(project.heroImage).width(800).height(500).url()}
              alt={project.heroImage.alt || project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-500" />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {project.year && (
                <span className="text-primary font-mono text-xs mb-2 block">
                  {project.year}
                </span>
              )}
              <h3 className="text-xl md:text-2xl font-display font-bold tracking-tight mb-1 truncate group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {project.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="ghost" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <motion.div
              className="p-2 rounded-full bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-opacity"
              whileHover={{ scale: 1.1 }}
            >
              <ArrowUpRight className="w-5 h-5" />
            </motion.div>
          </div>
        </div>

        <BorderBeam
          size={300}
          duration={10}
          colorFrom="hsl(var(--primary))"
          colorTo="hsl(var(--primary) / 0.2)"
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />
      </motion.article>
    </Link>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-card border border-border animate-pulse">
      <div className="aspect-[16/10] bg-muted" />
      <div className="p-6">
        <div className="h-3 w-12 bg-muted rounded mb-2" />
        <div className="h-6 w-3/4 bg-muted rounded mb-1" />
        <div className="h-4 w-1/2 bg-muted rounded mb-3" />
        <div className="flex gap-1.5">
          <div className="h-5 w-16 bg-muted rounded-full" />
          <div className="h-5 w-20 bg-muted rounded-full" />
        </div>
      </div>
    </div>
  );
}

