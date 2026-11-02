"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { type ReactNode } from "react";

import { useCreepTrigger } from "@/components/ui/creep-peek";
import { EASE_OUT } from "@/components/ui/cursor-follower";
import { education, experience } from "@/lib/profile";

const domainOf = (url: string) => new URL(url).hostname.replace(/^www\./, "");

function ListHeading({ children }: { children: ReactNode }) {
  return <h2 className="font-serif italic text-4xl md:text-5xl mb-6 md:mb-8">{children}</h2>;
}

function Row({ index, children }: { index: number; children: ReactNode }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: EASE_OUT }}
      className="flex flex-col gap-1.5 py-6 border-b border-border last:border-b-0"
    >
      {children}
    </motion.li>
  );
}

function RowTitle({ title, period }: { title: ReactNode; period: string }) {
  return (
    <div className="flex flex-col-reverse sm:flex-row sm:items-baseline sm:justify-between gap-x-6 gap-y-1">
      <h3 className="text-xl md:text-2xl font-medium tracking-tight">{title}</h3>
      <span className="shrink-0 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {period}
      </span>
    </div>
  );
}

function Experience() {
  return (
    <div>
      <ListHeading>experience.</ListHeading>
      <ul>
        {experience.map((exp, index) => (
          <Row key={`${exp.company}-${exp.role}`} index={index}>
            <RowTitle title={`${exp.role}, ${exp.company}`} period={exp.period} />
            <a
              href={exp.link}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex w-fit items-center gap-1 text-foreground/90 hover:text-primary transition-colors"
            >
              <span className="text-muted-foreground">at,</span> {domainOf(exp.link)}
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <p className="text-muted-foreground mt-1">{exp.description}</p>
            <p className="font-mono text-sm text-muted-foreground/80 mt-2 leading-relaxed">
              {exp.stack.join(" / ")}
            </p>
          </Row>
        ))}
      </ul>
    </div>
  );
}

function Education() {
  const creepTrigger = useCreepTrigger();

  return (
    <div>
      <ListHeading>education.</ListHeading>
      <ul>
        {education.map((edu, index) => (
          <Row key={edu.degree} index={index}>
            <RowTitle title={edu.degree} period={edu.period} />
            <p className="text-muted-foreground">
              {"summonsCreep" in edu ? (
                <span {...creepTrigger} className="cursor-default">
                  {edu.institution}
                </span>
              ) : (
                edu.institution
              )}
              {edu.note && <span className="text-foreground/80"> · {edu.note}</span>}
            </p>
          </Row>
        ))}
      </ul>
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="px-4 md:px-6 py-20 md:py-28">
      <div className="max-w-3xl mx-auto flex flex-col gap-20">
        <Experience />
        <Education />
      </div>
    </section>
  );
}
