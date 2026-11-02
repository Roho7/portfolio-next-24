"use client";

import { ArrowUpRight, Mail } from "lucide-react";
import { motion } from "motion/react";
import type { ComponentType } from "react";
import { FaLinkedin } from "react-icons/fa";
import { SiGithub, SiX } from "react-icons/si";

import { EASE_OUT } from "@/components/ui/cursor-follower";
import { site } from "@/lib/profile";

type Social = {
  label: string;
  handle: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  iconClassName: string;
};

const SOCIALS: Social[] = [
  {
    label: "GitHub",
    handle: `@${site.github}`,
    href: `https://github.com/${site.github}`,
    icon: SiGithub,
    iconClassName: "text-foreground",
  },
  {
    label: "LinkedIn",
    handle: "@rohosen-bhattacharya",
    href: `https://www.linkedin.com/in/${site.linkedin}/`,
    icon: FaLinkedin,
    iconClassName: "text-[#0A66C2]",
  },
  {
    label: "X",
    handle: site.twitterHandle,
    href: `https://x.com/${site.twitterHandle.slice(1)}`,
    icon: SiX,
    iconClassName: "text-foreground",
  },
  {
    label: "Email",
    handle: site.email,
    href: `mailto:${site.email}`,
    icon: Mail,
    iconClassName: "text-primary",
  },
];

export function Socials() {
  return (
    <section id="socials" className="px-4 md:px-6 py-20 md:py-28">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-serif italic text-4xl md:text-5xl mb-8">socials.</h2>
        <ul className="grid sm:grid-cols-2 gap-x-12 gap-y-6">
          {SOCIALS.map(({ label, handle, href, icon: Icon, iconClassName }, index) => (
            <motion.li
              key={label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.06, ease: EASE_OUT }}
            >
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${label}: ${handle}`}
                className="group inline-flex items-center gap-4 text-lg text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon className={`size-6 shrink-0 ${iconClassName}`} />
                <span className="truncate">{handle}</span>
                <ArrowUpRight className="size-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
