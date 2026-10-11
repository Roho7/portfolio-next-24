"use client";

import {
  type MotionValue,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import type { ProjectCard } from "@/sanity/lib/types";
import { cn } from "@/lib/utils";

const NAME = "Rohosen";
// Where the name breaks onto a second line on mobile: ROHO / SEN
const NAME_BREAK = 4;
const NAME_LINES = [
  { text: NAME.slice(0, NAME_BREAK), offset: 0 },
  { text: NAME.slice(NAME_BREAK), offset: NAME_BREAK },
];
const LOCATION = "Based in India";
const TIMEZONE = "Asia/Kolkata";
const MAX_PROJECTS = 5;

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const GLITCH_GLYPHS = "#%&@$*/<>{}[]=+?!01ΣΔ§¥ABCDEFGHJKMNPQRTUVWXYZ";
const GLITCH_START_DELAY = 1600;
const GLITCH_FRAME_MS = 70;

type Glitch = { glyph: string; offset: number };

const randomGlyph = () =>
  GLITCH_GLYPHS[Math.floor(Math.random() * GLITCH_GLYPHS.length)];

// Every few seconds, scramble 1–2 letters through a few random glyphs, then restore.
function useNameGlitch(length: number, enabled: boolean) {
  const [glitches, setGlitches] = useState<Record<number, Glitch>>({});

  useEffect(() => {
    if (!enabled) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const schedule = (fn: () => void, ms: number) => {
      timers.push(setTimeout(fn, ms));
    };

    const burst = () => {
      const first = Math.floor(Math.random() * length);

      const step = Math.random() < 0.5 ? -2 : 2;
      const candidate = first + step;
      const second = candidate < 0 || candidate >= length ? first - step : candidate;

      const glitchLetter = (index: number, frames: number, startAt: number) => {
        for (let f = 0; f < frames; f++) {
          schedule(
            () => setGlitches({ [index]: { glyph: randomGlyph(), offset: (Math.random() - 0.5) * 0.06 } }),
            startAt + f * GLITCH_FRAME_MS
          );
        }
        return startAt + frames * GLITCH_FRAME_MS;
      };

      const firstEnd = glitchLetter(first, 3 + Math.floor(Math.random() * 2), 0); // long
      const secondEnd = glitchLetter(second, 1 + Math.floor(Math.random() * 2), firstEnd); // short

      schedule(() => setGlitches({}), secondEnd);
      schedule(burst, secondEnd + 1800 + Math.random() * 2800);
    };

    schedule(burst, GLITCH_START_DELAY);
    return () => timers.forEach(clearTimeout);
  }, [length, enabled]);

  return glitches;
}

function MetaItem({
  label,
  children,
  delay,
}: {
  label: string;
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: EASE_OUT }}
      className="flex flex-col gap-1"
    >
      <span className="text-muted-foreground/60">{label}</span>
      <span className="text-foreground">{children}</span>
    </motion.div>
  );
}

function ProjectRow({
  project,
  index,
  isActive,
  isDimmed,
  onEnter,
}: {
  project: ProjectCard;
  index: number;
  isActive: boolean;
  isDimmed: boolean;
  onEnter: () => void;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.1 + index * 0.07, ease: EASE_OUT }}
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

// Tracks the cursor relative to a container, for elements that float with the pointer.
function useRelativeCursor<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const onMouseMove = (e: React.MouseEvent<T>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  return { ref, x, y, onMouseMove };
}

// Springs toward the cursor and tilts with horizontal velocity.
function CursorFollower({
  x,
  y,
  visible,
  offsetClassName,
  className,
  children,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  visible: boolean;
  offsetClassName: string;
  className?: string;
  children: React.ReactNode;
}) {
  const springX = useSpring(x, { stiffness: 220, damping: 28, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 220, damping: 28, mass: 0.6 });
  const velocityX = useVelocity(springX);
  const rotate = useTransform(velocityX, [-2000, 0, 2000], [-8, 0, 8], {
    clamp: true,
  });

  return (
    <motion.div
      aria-hidden
      style={{ x: springX, y: springY }}
      className="pointer-events-none absolute left-0 top-0 z-20 hidden md:block"
    >
      <div className={offsetClassName}>
        <motion.div
          style={{ rotate }}
          animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.85 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
          className={className}
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
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

const styledText = (text: string) => <em className="text-primary">{text}</em>;

const TOOLTIP_LINES = [
  <>Just call me {styledText("Roho")}</>,
  <>I prefer {styledText("Roho")}</>,
  <>Just {styledText("Roho")} is fine</>,
  <span key="face" className="flex">```<Image src="/cropped-face.png" alt="Roho" width={64} height={64} />```</span>,
  <>&quot;{styledText("Sen")}&quot; is not my surname</>,
];

// Picks a line different from the current one, so consecutive hovers always change.
const pickTooltipIndex = (current: number) => {
  const next = Math.floor(Math.random() * (TOOLTIP_LINES.length - 1));
  return next >= current ? next + 1 : next;
};

function NameTooltip({
  x,
  y,
  visible,
  lineIndex,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  visible: boolean;
  lineIndex: number;
}) {
  return (
    <CursorFollower
      x={x}
      y={y}
      visible={visible}
      offsetClassName="translate-x-5 -translate-y-[calc(100%+1.25rem)]"
      className="whitespace-nowrap rounded-full border border-border bg-card/90 backdrop-blur px-5 py-2.5 font-serif text-2xl shadow-2xl"
    >
      {TOOLTIP_LINES[lineIndex]}
    </CursorFollower>
  );
}

export function EditorialHero({ projects }: { projects: ProjectCard[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isNameHovered, setIsNameHovered] = useState(false);
  const [tooltipIndex, setTooltipIndex] = useState(0);
  const glitches = useNameGlitch(NAME.length, !reduceMotion);
  const listCursor = useRelativeCursor<HTMLDivElement>();
  const nameCursor = useRelativeCursor<HTMLDivElement>();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const nameY = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);
  const nameOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const featured = [...projects]
    .sort((a, b) => Number(a.order) - Number(b.order))
    .slice(0, MAX_PROJECTS);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-between px-4 md:px-8 pt-24 md:pt-28 pb-10"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6 font-mono text-[11px] uppercase tracking-wider">
        <MetaItem label="Role" delay={0.1}>
          Software engineer
        </MetaItem>
        <MetaItem label="Based in" delay={0.15}>
          Bangalore, India
        </MetaItem>
        <MetaItem label="Currently" delay={0.2}>
          <a
            href="https://fireflies.ai"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-border underline-offset-4 hover:decoration-primary"
          >
            Fireflies AI
          </a>
        </MetaItem>
        <MetaItem label="Status" delay={0.25}>
          <span className="inline-flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Open to work
          </span>
        </MetaItem>
      </div>

      <motion.div
        style={reduceMotion ? undefined : { y: nameY, opacity: nameOpacity }}
        className="my-10 md:my-6"
      >
        <h1 className="sr-only">Rohosen Bhattacharya, software engineer</h1>
        <div
          ref={nameCursor.ref}
          onMouseMove={nameCursor.onMouseMove}
          onMouseEnter={() => {
            setTooltipIndex(pickTooltipIndex);
            setIsNameHovered(true);
          }}
          onMouseLeave={() => setIsNameHovered(false)}
          className="relative cursor-default"
        >
          <div
            aria-hidden
            className="font-hero font-bold uppercase leading-[0.8] tracking-[-0.05em] text-[calc((100vw-2rem)/2.6)] md:text-[calc((100vw-4rem)/4.6)] -ml-[0.04em] flex flex-col md:flex-row"
          >
            {NAME_LINES.map((line) => (
              <div key={line.offset} className="flex overflow-y-clip pb-[0.04em]">
                {line.text.split("").map((letter, j) => {
                  const i = line.offset + j;
                  return (
                    <motion.span
                      key={i}
                      initial={reduceMotion ? false : { y: "105%" }}
                      animate={{ y: "0%" }}
                      transition={{ duration: 0.9, delay: 0.2 + i * 0.05, ease: EASE_OUT }}
                      className="relative inline-block"
                    >
                      <span className={cn(glitches[i] && "invisible")}>{letter}</span>
                      {glitches[i] && (
                        <span
                          style={{ transform: `translateX(${glitches[i].offset}em)` }}
                          className="absolute inset-0 flex justify-center text-primary"
                        >
                          {glitches[i].glyph}
                        </span>
                      )}
                    </motion.span>
                  );
                })}
              </div>
            ))}
          </div>
          <NameTooltip
            x={nameCursor.x}
            y={nameCursor.y}
            visible={isNameHovered}
            lineIndex={tooltipIndex}
          />
        </div>

        {/* <div className="mt-6 md:mt-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: EASE_OUT }}
            className="font-serif text-2xl md:text-4xl leading-tight max-w-2xl text-balance"
          >
            I build <em className="text-primary">AI agents</em>, clean
            interfaces &amp; the backends that keep them honest.
          </motion.p>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground"
          >
            {LOCATION}
          </motion.span>
        </div> */}
      </motion.div>

      {featured.length > 0 && (
        <div
          ref={listCursor.ref}
          onMouseMove={listCursor.onMouseMove}
          onMouseLeave={() => setActiveIndex(null)}
          className="relative"
        >
          <div className="flex items-baseline justify-between pb-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <span>Selected work ({String(featured.length).padStart(2, "0")})</span>
            <Link href="#projects" className="hover:text-primary transition-colors">
              All projects ↓
            </Link>
          </div>
          <ul className="border-b border-border">
            {featured.map((project, i) => (
              <ProjectRow
                key={project._id}
                project={project}
                index={i}
                isActive={activeIndex === i}
                isDimmed={activeIndex !== null && activeIndex !== i}
                onEnter={() => setActiveIndex(i)}
              />
            ))}
          </ul>
          <CursorPreview
            projects={featured}
            activeIndex={activeIndex}
            x={listCursor.x}
            y={listCursor.y}
          />
        </div>
      )}
    </section>
  );
}
