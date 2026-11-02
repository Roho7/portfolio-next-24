"use client";

import { ArrowUpRight, Github, Linkedin, Mail, Twitter } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

import { site } from "@/lib/profile";

const socialLinks = [
  { href: "https://github.com/roho7", icon: Github, label: "GitHub" },
  { href: "https://www.linkedin.com/in/rohosen-bhattacharya-9311611aa/", icon: Linkedin, label: "LinkedIn" },
  { href: "https://x.com/Rohosen_", icon: Twitter, label: "Twitter" },
  { href: "mailto:rohosen2@gmail.com?subject=Hello Roho! I'd like to discuss a project with you.", icon: Mail, label: "Email" },
];

export function Footer() {
  return (
    <footer id="contact" className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6"
            >
              Let&apos;s work
              <br />
              <span className="text-primary">together</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-lg max-w-md"
            >
              I&apos;m always open to discussing new projects, creative ideas, or
              opportunities to be part of your vision.
            </motion.p>
          </div>

          <div className="flex flex-col justify-between">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link
                href="mailto:rohosen2@gmail.com?subject=Hello Roho! I'd like to discuss a project with you."
                className="group inline-flex items-center gap-3 text-2xl md:text-3xl font-display font-bold hover:text-primary transition-colors"
              >
                rohosen2@gmail.com
                <ArrowUpRight className="w-6 h-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link
                href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hi Roho! I'd like to discuss a project with you.")}`}
                className="group inline-flex items-center gap-3 text-2xl md:text-3xl font-display font-bold hover:text-primary transition-colors"
              >
                +919836025090
                <ArrowUpRight className="w-6 h-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex gap-4 mt-8"
            >
              {socialLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                >
                  <link.icon className="w-5 h-5" />
                  <span className="sr-only">{link.label}</span>
                </Link>
              ))}
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-muted-foreground text-sm">
            Designed & Built with care by
            <span className="text-primary">{" "}Roho</span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

