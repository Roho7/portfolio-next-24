"use client";

import { motion } from "motion/react";
import { AnimatedText, AnimatedWords } from "@/components/ui/animated-text";
import { Button } from "@/components/ui/button";
import { ArrowDown, Sparkles } from "lucide-react";
import Link from "next/link";
import { SlotMachine } from "@/components/ui/slot-machine";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="gradient-blur" />

      <div className="absolute inset-0 noise pointer-events-none" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2, delay: 0.8 }}
        className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-[100px]"
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">
              Looking for new projects
            </span>
          </motion.div>

          <h1 className="text-4xl max-lg:my-8 md:text-7xl lg:text-8xl xl:text-9xl font-display font-bold tracking-tight mb-6 flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className=""
            >
              <SlotMachine
                items={["Building", "Architecting", "Designing", "Developing"]}
                interval={2800}
                highlightColor={true}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="block"
            >
              <SlotMachine
                items={["AI Agents", "clean interfaces", "scalable backends", "automations"]}
                interval={3500}
              />
            </motion.div>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Currently working at{" "}
            <a href="https://periskope.app" target="_blank" className="text-foreground font-semibold">
              Periskope
            </a>{" "}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="#projects">
              <Button size="lg" variant="glow">
                View my work
              </Button>
            </Link>
            <Link href="#contact">
              <Button size="lg" variant="outline">
                Get in touch
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Link
            href="#projects"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowDown className="w-6 h-6" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
