"use client";

import { Section, SectionHeader } from "@/components/ui/section";
import { MagicCard, MagicContainer } from "@/components/ui/magic-card";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import { Briefcase, GraduationCap, MapPin, Calendar, ExternalLink } from "lucide-react";
import Link from "next/link";

const experience = [
  {
    company: "Periskope",
    role: "Full-Stack Developer",
    period: "2023 - Present",
    description: "One of the first 5 employees. Built over 10 large features and counting.",
    link: "https://periskope.app/",
  },
  {
    company: "SimpliML",
    role: "Full-Stack Developer",
    period: "2023",
    description: "Built the foundation of the product from ground up.",
    link: "https://simpliml.com/",
  },
  {
    company: "Frenzopay",
    role: "UI/UX Designer",
    period: "2022 - 2023",
    description: "Solo designer. Built the entire product design from scratch.",
    link: "https://frenzopay.com/",
  },
];

const education = [
  {
    degree: "M.Sc. Human-Computer Interaction",
    institution: "University of Nottingham",
    period: "2023 - 2024",
    note: "Distinction",
  },
  {
    degree: "CS50x: Introduction to Computer Science",
    institution: "Harvard University",
    period: "2023",
    note: "Certificate",
  },
  {
    degree: "B.Sc. Neuroscience",
    institution: "Amity University Noida",
    period: "2020 - 2023",
    note: "",
  },
];

const skills = [
  { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
  { category: "Backend", items: ["Node.js", "Python", "PostgreSQL", "Firebase"] },
  { category: "Design", items: ["Figma", "After Effects", "Illustrator"] },
  { category: "Other", items: ["Unity", "C#", "Git", "Sanity"] },
];

function ExperienceCard() {
  return (
    <MagicCard className="p-8 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Briefcase className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-xl font-display font-bold">Experience</h3>
      </div>
      <div className="space-y-6">
        {experience.map((exp, index) => (
          <motion.div
            key={exp.company}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <Link
                  href={exp.link}
                  target="_blank"
                  className="inline-flex items-center gap-2 text-lg font-semibold group-hover:text-primary transition-colors"
                >
                  {exp.company}
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <p className="text-muted-foreground">{exp.role}</p>
                <p className="text-sm text-muted-foreground mt-1">{exp.description}</p>
              </div>
              <Badge variant="outline" className="shrink-0">
                {exp.period}
              </Badge>
            </div>
          </motion.div>
        ))}
      </div>
    </MagicCard>
  );
}

function EducationCard() {
  return (
    <MagicCard className="p-8 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <GraduationCap className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-xl font-display font-bold">Education</h3>
      </div>
      <div className="space-y-6">
        {education.map((edu, index) => (
          <motion.div
            key={edu.degree}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="text-lg font-semibold">{edu.degree}</h4>
                <p className="text-muted-foreground">{edu.institution}</p>
                {edu.note && (
                  <Badge variant="ghost" className="mt-2">
                    {edu.note}
                  </Badge>
                )}
              </div>
              <Badge variant="outline" className="shrink-0">
                {edu.period}
              </Badge>
            </div>
          </motion.div>
        ))}
      </div>
    </MagicCard>
  );
}

function StatsCard() {
  return (
    <MagicCard className="p-8">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="font-semibold">India</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Experience</p>
            <p className="font-semibold">3+ Years</p>
          </div>
        </div>
      </div>
    </MagicCard>
  );
}

function SkillsCard() {
  return (
    <MagicCard className="p-8 h-full">
      <h3 className="text-xl font-display font-bold mb-6">Skills</h3>
      <div className="space-y-6">
        {skills.map((skillGroup, index) => (
          <motion.div
            key={skillGroup.category}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <p className="text-sm text-muted-foreground mb-2">{skillGroup.category}</p>
            <div className="flex flex-wrap gap-2">
              {skillGroup.items.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </MagicCard>
  );
}

export function About() {
  return (
    <Section id="about" className="bg-card/30">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeader
          number="02"
          title="About Me"
          subtitle="A blend of research, design, and development expertise."
        />

        <MagicContainer className="grid lg:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-4"
          >
            <ExperienceCard />
            <EducationCard />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <StatsCard />
            <SkillsCard />
          </motion.div>
        </MagicContainer>
      </div>
    </Section>
  );
}
