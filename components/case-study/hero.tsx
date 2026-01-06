"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { urlFor } from "@/sanity/lib/image";
import type { Project } from "@/sanity/lib/types";
import { ArrowLeft, ExternalLink, Github, Figma, Play } from "lucide-react";

interface CaseStudyHeroProps {
  project: Project;
}

export function CaseStudyHero({ project }: CaseStudyHeroProps) {
  return (
    <section className="relative">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="gradient-blur opacity-50" />
      
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/#projects">
            <Button variant="ghost" className="mb-8 -ml-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to projects
            </Button>
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {project.year && (
                <span className="text-primary font-mono text-sm mb-4 block">
                  {project.year}
                </span>
              )}
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold tracking-tight mb-4">
                {project.title}
              </h1>
              {project.subtitle && (
                <p className="text-xl md:text-2xl text-muted-foreground mb-6">
                  {project.subtitle}
                </p>
              )}
            </motion.div>

            {project.excerpt && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg text-muted-foreground leading-relaxed mb-8"
              >
                {project.excerpt}
              </motion.p>
            )}

            {project.tags && project.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap gap-2 mb-8"
              >
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </motion.div>
            )}

            {project.links && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap gap-3"
              >
                {project.links.live && (
                  <Link href={project.links.live} target="_blank">
                    <Button variant="glow">
                      <ExternalLink className="w-4 h-4" />
                      View Live
                    </Button>
                  </Link>
                )}
                {project.links.github && (
                  <Link href={project.links.github} target="_blank">
                    <Button variant="outline">
                      <Github className="w-4 h-4" />
                      GitHub
                    </Button>
                  </Link>
                )}
                {project.links.figma && (
                  <Link href={project.links.figma} target="_blank">
                    <Button variant="outline">
                      <Figma className="w-4 h-4" />
                      Figma
                    </Button>
                  </Link>
                )}
                {project.links.video && (
                  <Link href={project.links.video} target="_blank">
                    <Button variant="outline">
                      <Play className="w-4 h-4" />
                      Demo
                    </Button>
                  </Link>
                )}
              </motion.div>
            )}
          </div>

          {project.projectInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="grid grid-cols-2 gap-6"
            >
              {project.projectInfo.platform && (
                <InfoCard label="Platform" value={project.projectInfo.platform} />
              )}
              {project.projectInfo.duration && (
                <InfoCard label="Duration" value={project.projectInfo.duration} />
              )}
              {project.projectInfo.team && (
                <InfoCard label="Team" value={project.projectInfo.team} />
              )}
              {project.projectInfo.client && (
                <InfoCard label="Client" value={project.projectInfo.client} />
              )}
              {project.projectInfo.role && project.projectInfo.role.length > 0 && (
                <div className="col-span-2 p-6 rounded-xl bg-card border border-border">
                  <span className="text-sm text-muted-foreground block mb-2">My Role</span>
                  <div className="flex flex-wrap gap-2">
                    {project.projectInfo.role.map((role) => (
                      <Badge key={role} variant="outline">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {project.heroImage?.asset && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="relative mt-8 md:mt-12"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl">
              <Image
                src={urlFor(project.heroImage).width(1920).url()}
                alt={project.heroImage.alt || project.title}
                width={1920}
                height={1080}
                priority
                className="w-full h-auto object-cover object-center"
                style={{ maxHeight: 'none' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
            </div>
          </div>
        </motion.div>
      )}

      {project.heroVideo && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="container mx-auto px-4 md:px-6 mt-8 md:mt-12"
        >
          <div className="relative aspect-video overflow-hidden rounded-2xl md:rounded-3xl bg-card">
            <iframe
              src={getEmbedUrl(project.heroVideo)}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </motion.div>
      )}
    </section>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-6 rounded-xl bg-card border border-border">
      <span className="text-sm text-muted-foreground block mb-1">{label}</span>
      <span className="text-lg font-semibold">{value}</span>
    </div>
  );
}

function getEmbedUrl(url: string): string {
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const videoId = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    )?.[1];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  if (url.includes("vimeo.com")) {
    const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
    return `https://player.vimeo.com/video/${videoId}`;
  }
  return url;
}



