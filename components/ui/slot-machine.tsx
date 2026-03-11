  "use client";

  import { useState, useEffect } from "react";
  import { motion, AnimatePresence } from "motion/react";

  interface SlotMachineProps {
    items: string[];
    interval: number;
    className?: string;
    highlightColor?: boolean;
  }

  export function SlotMachine({ items, interval, className = "", highlightColor = false }: SlotMachineProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(1); // 1 = up, -1 = down

    useEffect(() => {
      const timer = setInterval(() => {
        setDirection(Math.random() > 0.5 ? 1 : -1);
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }, interval);

      return () => clearInterval(timer);
    }, [items.length, interval]);

    const variants = {
      initial: (direction: number) => ({
        y: direction === 1 ? "110%" : "-110%",
        filter: "blur(9px)",
        opacity: 0,
      }),
      animate: {
        y: "0%",
        filter: "blur(0px)",
        opacity: 1,
      },
      exit: (direction: number) => ({
        y: direction === 1 ? "-110%" : "110%",
        filter: "blur(9px)",
        opacity: 0,
      }),
    };

    return (
      <div className={`inline-flex relative overflow-hidden lg:h-[1.1em] items-center ${className}`}>
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.span
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              y: {
                  type: "spring",
                  stiffness: 150,
                  damping: 15,
                  mass: 1.8,
              },
              filter: { duration: 0.2 },
              opacity: { duration: 0.2 },
            }}
            className={`absolute left-0 right-0 whitespace-nowrap ${highlightColor ? "text-primary" : ""}`}
          >
            {items[currentIndex]}
          </motion.span>
        </AnimatePresence>
        {/* Invisible spacer to maintain width */}
        <span className="invisible whitespace-nowrap" aria-hidden="true">
          {items.reduce((a, b) => a.length > b.length ? a : b)}
        </span>
      </div>
    );
  }

