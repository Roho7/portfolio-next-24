"use client";

import { FolderKanban, House, Menu, MessageCircle, User, X } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "./button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

function Notch() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });

  // Stretch based on velocity (physics based fluid animation)
  const scaleY = useTransform(smoothVelocity, [-2000, 0, 2000], [0.9, 1, 1.2]);
  const widthTransform = useTransform(smoothVelocity, [-2000, 0, 2000], [1.018, 1, 0.98]);
  // Use inverse scale for content to keep it stable
  const contentScaleY = useTransform(smoothVelocity, [-2000, 0, 2000], [1 / 0.9, 1, 1 / 1.2]);
  const contentScaleX = useTransform(smoothVelocity, [-2000, 0, 2000], [1 / 1.018, 1, 1 / 0.98]);

  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState(pathname);

  // Jiggle animation state
  const [isJiggling, setIsJiggling] = useState(false);

  const handleLinkClick = (href: string) => {
    setActiveTab(href);
    // Trigger jiggle
    setIsJiggling(true);
    setTimeout(() => setIsJiggling(false), 400);
  };

  return (
    <motion.div
      style={{
        scaleY,
        scaleX: widthTransform,
        transformOrigin: "top",
      }}
      animate={isJiggling ? {
        scaleX: [1, 2.5, 0.95, 1.62, 0.98, 1],
        transition: { duration: 0.4 }
      } : {}}
      className="fixed inset-0  z-[60] hidden md:flex flex-col items-center pointer-events-none"
    >
      {/* The Notch Container */}
      <div
        className="relative bg-black text-white px-2 pb-2 pt-0 rounded-b-[24px] shadow-lg flex items-center gap-1 border-b border-white/10 pointer-events-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Left Connector */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute -left-5 top-0 text-black fill-current"
        >
          <path d="M20 20C20 8.95431 11.0457 0 0 0H20V20Z" />
        </svg>

        {/* Right Connector */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute -right-5 top-0 text-black fill-current"
        >
          <path d="M0 20C0 8.95431 8.95431 0 20 0H0V20Z" />
        </svg>

        <motion.div
          className="flex items-center px-4 py-2 gap-2"
          style={{
            scaleX: contentScaleX,
            scaleY: contentScaleY,
          }}
          animate={isJiggling ? {
            scaleX: [1, 1 / 2.5, 1 / 0.95, 1 / 1.62, 1 / 0.98, 1],
            transition: { duration: 0.4 }
          } : {}}
        >
          {navLinks.map((link) => {
            const isActive = activeTab === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => handleLinkClick(link.href)}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors relative",
                    isActive ? "text-background bg-primary" : "text-white/60 hover:text-white "
                  )}
                >
                  {/* {isActive && ( */}
                  {/* <motion.div
                       layoutId="notch-pill"
                       className="absolute inset-0 bg-primary/40 rounded-full"
                       transition={{ type: "spring", bounce: 0.2, duration: 0.2 }}
                     /> */}
                  {/* )} */}
                  <span className="relative z-10">{link.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
}

const MAIL_HREF = "mailto:rohosen2@gmail.com?subject=Hello Roho! I'd like to discuss a project with you.";

const radialItems = [
  { href: "/", label: "Home", icon: House },
  { href: "/work", label: "Work", icon: FolderKanban },
  { href: "/#about", label: "About", icon: User },
  { href: "/#contact", label: "Contact", icon: MessageCircle },
];

const RADIUS = 150;
const DISC_SIZE = (RADIUS + 44) * 2;
// Fan from straight left (180deg) to straight down (90deg), since the button sits top-right.
const ARC_START = 180;
const ARC_END = 90;

function radialPosition(index: number) {
  const step = (ARC_END - ARC_START) / (radialItems.length - 1);
  const angle = ((ARC_START + step * index) * Math.PI) / 180;
  return { x: Math.cos(angle) * RADIUS, y: Math.sin(angle) * RADIUS };
}

function RadialMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="relative md:hidden">
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 -z-10 bg-background/60 backdrop-blur-sm"
            />
            <motion.div
              key="disc"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              style={{ width: DISC_SIZE, height: DISC_SIZE, marginLeft: -DISC_SIZE / 2, marginTop: -DISC_SIZE / 2 }}
              className="absolute left-1/2 top-1/2 -z-10 rounded-full border border-border bg-card/90"
            />
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open &&
          radialItems.map((item, index) => {
            const { x, y } = radialPosition(index);
            const isActive = item.href === pathname;
            const Icon = item.icon;
            const className = cn(
              "flex size-12 items-center justify-center rounded-full border transition-colors",
              isActive
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border active:bg-secondary"
            );
            return (
              <motion.div
                key={item.href}
                initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                animate={{ x, y, scale: 1, opacity: 1 }}
                exit={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 380, damping: 24, delay: index * 0.035 }}
                className="absolute left-1/2 top-1/2 -ml-6 -mt-6"
              >
                {item.href.startsWith("mailto:") ? (
                  <a href={item.href} aria-label={item.label} onClick={() => setOpen(false)} className={className}>
                    <Icon className="size-5" />
                  </a>
                ) : (
                  <Link href={item.href} aria-label={item.label} onClick={() => setOpen(false)} className={className}>
                    <Icon className="size-5" />
                  </Link>
                )}
              </motion.div>
            );
          })}
      </AnimatePresence>

      <motion.button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.9 }}
        className={cn(
          "relative flex size-10 items-center justify-center rounded-full transition-colors",
          open ? "bg-primary text-primary-foreground" : "bg-black text-foreground"
        )}
      >
        <motion.span
          key={open ? "close" : "open"}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </motion.span>
      </motion.button>
    </div>
  );
}

export function Navbar() {
  const { scrollY } = useScroll();

  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["hsl(var(--background) / 0)", "hsl(var(--background) / 0.8)"]
  );
  const backdropBlur = useTransform(scrollY, [0, 100], ["blur(0px)", "blur(12px)"]);
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 1]);


  return (
    <>
      {/* Desktop Notch */}
      <Notch />

      <motion.header
        className="fixed top-0 left-0 right-0 z-50 pointer-events-none md:pointer-events-auto"
      >
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px"
        />
        <nav className="container mx-auto px-4 md:px-6 pointer-events-auto">
          <div className="flex h-16 md:h-20 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 1.5, damping: 20, mass: 1.5, ease: "easeInOut" }}
                className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center"
              >
                <Image src="/logo.png" alt="Rohosen" width={32} height={32} className="text-primary-foreground font-bold text-lg" />
              </motion.div>
            </Link>

            {/* Hidden on Desktop, replaced by Notch */}
            <div className="hidden md:block w-[1px]" />

            <div className="flex items-center gap-4">
              <a href={MAIL_HREF} className="hidden md:block">
                <Button variant="glow">Get in touch</Button>
              </a>
              <RadialMenu />
            </div>
          </div>
        </nav>
      </motion.header>

    </>
  );
}
