"use client";

import { Mail } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { FaLinkedin, FaWhatsapp } from "react-icons/fa";

import { ContributionGraph } from "@/components/ui/contribution-graph";
import { EASE_OUT } from "@/components/ui/cursor-follower";
import type { Contributions } from "@/lib/github";
import { site } from "@/lib/profile";

function InlineLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-foreground font-medium underline decoration-border underline-offset-4 hover:decoration-primary transition-colors"
    >
      {children}
    </a>
  );
}

export function Intro({ contributions }: { contributions: Contributions | null }) {
  return (
    <section id="intro" className="px-4 md:px-6 py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
        className="max-w-3xl mx-auto flex flex-col gap-8"
      >
        <div className="flex items-center gap-5">
          <Image
            src="/cropped-face.png"
            alt={site.name}
            width={96}
            height={96}
            className="size-20 md:size-24 rounded-full object-cover bg-card border border-border"
          />
          <div>
            <h2 className="font-hero text-3xl md:text-4xl font-bold tracking-tight">{site.name}</h2>
            <p className="text-lg md:text-xl text-muted-foreground">{site.jobTitle}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 text-lg leading-relaxed text-muted-foreground text-pretty">
          <p>
            I run <InlineLink href="https://officepaglu.com/">Office Paglu</InlineLink>, a
            place where I make find cool, work-related (and slightly unprofessional) tees.
          </p>
          <p>
            I was a Senior Founding Engineer at <InlineLink href="https://periskope.app/">Periskope</InlineLink>,
            was building AI Agents for WhatsApp. Made a lot of customers happy and learnt almost everything I know about building products.
          </p>
          <p>
            Recently, I joined <InlineLink href="https://fireflies.ai/">Fireflies AI</InlineLink>, as a Senior Engineer in the payments team, where I built payments infrastructures
            and GTM tools.
          </p>
          <p>
            Payments, AI Agents and GTM Tools are my main areas of expertise.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-1.5">
          {contributions && (
            <div className="rounded-xl bg-background border border-border p-4 md:p-6">
              <ContributionGraph data={contributions} />
            </div>
          )}
          <div className="flex flex-col gap-4 p-4 md:p-5">
            <p className="text-foreground">Interested in working together?</p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`mailto:${site.email}?subject=Hello Roho! I'd like to discuss a project with you.`}
                className="inline-flex items-center gap-2 rounded-lg bg-foreground text-background px-4 py-2.5 font-medium transition-colors hover:bg-primary"
              >
                <Mail className="size-4" />
                Send an email
              </a>
              <a
                href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hi Roho! I'd like to discuss a project with you.")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 font-medium transition-colors hover:border-[#25D366]/60 hover:bg-[#25D366]/10"
              >
                <FaWhatsapp className="size-4 text-[#25D366]" />
                Message on WhatsApp
              </a>
              <Link
                href={`https://www.linkedin.com/in/${site.linkedin}/`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 font-medium transition-colors hover:border-foreground/40 hover:bg-secondary"
              >
                <FaLinkedin className="size-4" />
                Connect on LinkedIn
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
