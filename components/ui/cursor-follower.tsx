"use client";

import {
  type MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useRef } from "react";

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

// Tracks the cursor relative to a container, for elements that float with the pointer.
export function useRelativeCursor<T extends HTMLElement>() {
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
export function CursorFollower({
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
