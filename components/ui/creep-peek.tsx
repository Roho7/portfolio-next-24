"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

// Shared "summon" store so any element on the page can call the creep up,
// independently of the random schedule.
let summoners = 0;
const listeners = new Set<() => void>();

const setSummoned = (on: boolean) => {
  summoners = Math.max(0, summoners + (on ? 1 : -1));
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSummoned = () => summoners > 0;
const getServerSummoned = () => false;

/** Spread onto any element: the creep rises while it's hovered and ducks when the pointer leaves. */
export function useCreepTrigger() {
  const hovering = useRef(false);

  // Release the summon if the element unmounts mid-hover
  useEffect(
    () => () => {
      if (hovering.current) setSummoned(false);
    },
    []
  );

  return {
    onMouseEnter: () => {
      if (hovering.current) return;
      hovering.current = true;
      setSummoned(true);
    },
    onMouseLeave: () => {
      if (!hovering.current) return;
      hovering.current = false;
      setSummoned(false);
    },
  };
}

export interface CreepSchedule {
  /** ms after mount before the first appearance (random between the two). Default: 8–20s */
  firstAfter?: [number, number];
  /** ms between appearances (random between the two). Default: 30–90s */
  gap?: [number, number];
  /** ms to stay in frame before ducking back down. Default: 2.5s */
  stay?: number;
  /** Stop after this many appearances per page load. Default: Infinity */
  maxAppearances?: number;
}

interface CreepPeekProps {
  src?: string;
  /**
   * Controlled mode: pass a boolean to decide yourself when it shows up.
   * Leave undefined to let it appear on its own random schedule.
   */
  show?: boolean;
  /** Turns the random schedule off without unmounting. Default: true */
  enabled?: boolean;
  schedule?: CreepSchedule;
  /** How much of the image rises into view, 0–1. Default: 1 (all the way) */
  peek?: number;
  /** Duck back down immediately when hovered. Default: true */
  shyOnHover?: boolean;
  className?: string;
}

const DEFAULT_SCHEDULE: Required<CreepSchedule> = {
  firstAfter: [8_000, 20_000],
  gap: [30_000, 90_000],
  stay: 2_500,
  maxAppearances: Infinity,
};

const between = ([min, max]: [number, number]) => min + Math.random() * (max - min);

// Rises slowly, leaves fast.
const RISE = { duration: 1.6, ease: [0.22, 1, 0.36, 1] as const };
const DUCK = { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const };

export function CreepPeek({
  src = "/cropped-creep.png",
  show,
  enabled = true,
  schedule,
  peek = 1,
  shyOnHover = true,
  className,
}: CreepPeekProps) {
  const reduceMotion = useReducedMotion();
  const isControlled = show !== undefined;
  const [scheduledVisible, setScheduledVisible] = useState(false);
  const summoned = useSyncExternalStore(subscribe, getSummoned, getServerSummoned);
  const visible = isControlled ? show : scheduledVisible || summoned;

  const timer = useRef<ReturnType<typeof setTimeout>>();
  const appearances = useRef(0);
  const hideRef = useRef<() => void>(() => { });

  const { firstAfter, gap, stay, maxAppearances } = { ...DEFAULT_SCHEDULE, ...schedule };

  useEffect(() => {
    if (isControlled || !enabled) return;

    const appear = () => {
      // Nobody's watching: try again later instead of wasting an appearance.
      if (document.visibilityState === "hidden") {
        timer.current = setTimeout(appear, between(gap));
        return;
      }
      setScheduledVisible(true);
      timer.current = setTimeout(hide, stay);
    };

    const hide = () => {
      clearTimeout(timer.current);
      setScheduledVisible(false);
      appearances.current += 1;
      if (appearances.current < maxAppearances) {
        timer.current = setTimeout(appear, between(gap));
      }
    };

    hideRef.current = hide;
    timer.current = setTimeout(appear, between(firstAfter));
    return () => clearTimeout(timer.current);
    // Tuple deps are spread so new array literals each render don't restart the schedule
  }, [isControlled, enabled, firstAfter[0], firstAfter[1], gap[0], gap[1], stay, maxAppearances]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleHover = () => {
    if (!shyOnHover || isControlled || !scheduledVisible) return;
    hideRef.current();
  };

  const hiddenY = "100%";
  const shownY = `${(1 - peek) * 100}%`;

  return (
    <motion.div
      aria-hidden
      initial={false}
      animate={
        reduceMotion
          ? { opacity: visible ? 1 : 0, y: shownY }
          : { y: visible ? shownY : hiddenY }
      }
      transition={visible ? RISE : DUCK}
      className={cn(
        "pointer-events-none fixed bottom-0 left-0 z-30 h-[28vh] md:h-[38vh] aspect-[1104/2400]",
        className
      )}
    >
      <Image src={src} alt="" fill sizes="(min-width: 768px) 25vw, 40vw" className="object-contain object-bottom" />
      {/* Hit area covers only the person (bottom ~75%), not the transparent space above */}
      <div
        onMouseEnter={handleHover}
        className={cn("absolute inset-x-0 bottom-0 h-3/4", visible && "pointer-events-auto")}
      />
    </motion.div>
  );
}
