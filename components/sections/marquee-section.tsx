"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { type ComponentType, type ReactNode, useRef } from "react";
import {
  SiClaude,
  SiClickhouse,
  SiDocker,
  SiFigma,
  SiMongodb,
  SiNestjs,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRedis,
  SiStripe,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";

type Tech = { name: string; icon: ComponentType<{ className?: string }>; color: string };

const STACK: Tech[] = [
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  { name: "React", icon: SiReact, color: "#61DAFB" },
  { name: "Next.js", icon: SiNextdotjs, color: "#FFFFFF" },
  { name: "Node.js", icon: SiNodedotjs, color: "#5FA04E" },
  { name: "NestJS", icon: SiNestjs, color: "#E0234E" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
  { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
  { name: "Stripe", icon: SiStripe, color: "#635BFF" },
  { name: "Tailwind", icon: SiTailwindcss, color: "#06B6D4" },
  { name: "Python", icon: SiPython, color: "#3776AB" },
  { name: "Redis", icon: SiRedis, color: "#FF4438" },
  { name: "Docker", icon: SiDocker, color: "#2496ED" },
  { name: "Clickhouse", icon: SiClickhouse, color: "#FFCC01" },
  { name: "Claude", icon: SiClaude, color: "#D97757" },
  { name: "Figma", icon: SiFigma, color: "#F24E1E" },
];

const DOMAINS = [
  "ai agents",
  "payments infrastructure",
  "system design",
  "product design",
  "automations",
  "frontend craft",
  "scalable backends",
];

// Keeps a value inside [min, max), so the track loops seamlessly.
const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

// Drifts on its own and speeds up (or reverses) with the page's scroll velocity.
function VelocityRow({ children, baseVelocity }: { children: ReactNode; baseVelocity: number }) {
  const reduceMotion = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const smoothVelocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false });
  const skewX = useTransform(smoothVelocity, [-2500, 2500], [8, -8]);
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduceMotion) return;
    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;
    const move = direction.current * baseVelocity * (delta / 1000);
    baseX.set(baseX.get() + move + move * Math.abs(factor));
  });

  return (
    <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <motion.div style={{ x, skewX: reduceMotion ? 0 : skewX }} className="flex w-max">
        {/* Two identical halves: shifting by -50% lands exactly on the start of the copy. */}
        <div className="flex shrink-0 items-center">{children}</div>
        <div aria-hidden className="flex shrink-0 items-center">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

function TechItem({ name, icon: Icon, color }: Tech) {
  return (
    <span
      style={{ "--brand": color } as React.CSSProperties}
      className="group flex items-center gap-4 md:gap-6 px-5 md:px-8 font-hero font-bold uppercase tracking-[-0.03em] text-5xl md:text-7xl lg:text-8xl text-foreground/15 transition-colors duration-300 hover:text-foreground"
    >
      <Icon className="size-9 md:size-14 lg:size-16 shrink-0 transition-colors duration-300 group-hover:text-[var(--brand)]" />
      {name}
    </span>
  );
}

export function MarqueeSection() {
  return (
    <section aria-label="Tools and focus areas" className="py-16 md:py-24 flex flex-col gap-2 md:gap-4">
      <VelocityRow baseVelocity={-2}>
        {STACK.map((tech) => (
          <TechItem key={tech.name} {...tech} />
        ))}
      </VelocityRow>
      <VelocityRow baseVelocity={2.5}>
        {DOMAINS.map((domain) => (
          <span
            key={domain}
            className="flex items-center gap-6 md:gap-10 px-3 md:px-5 font-serif italic text-4xl md:text-6xl lg:text-7xl text-muted-foreground whitespace-nowrap"
          >
            {domain}
            <span className="text-primary not-italic text-2xl md:text-4xl">✦</span>
          </span>
        ))}
      </VelocityRow>
    </section>
  );
}
