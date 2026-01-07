"use client";

import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform, useSpring, useVelocity, useMotionValueEvent } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./button";
import { Menu, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#projects", label: "Projects" },
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
  const contentScaleY = useTransform(smoothVelocity, [-2000, 0, 2000], [1/0.9, 1, 1/1.2]);
  const contentScaleX = useTransform(smoothVelocity, [-2000, 0, 2000], [1/1.018, 1, 1/0.98]);

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
            scaleX: [1, 1/2.5, 1/0.95, 1/1.62, 1/0.98, 1],
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
                      isActive ? "text-white bg-primary/60" : "text-white/60 hover:text-white "
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

export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
              <span className="font-display font-bold text-lg hidden sm:block">
                Rohosen
              </span>
            </Link>

            {/* Hidden on Desktop, replaced by Notch */}
            <div className="hidden md:block w-[1px]" /> 

            <div className="flex items-center gap-4">
              <Link href="mailto:rohosen2@gmail.com?subject=Hello Roho! I'd like to discuss a project with you." className="hidden md:block">
                <Button variant="glow">Get in touch</Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden bg-black rounded-full aspect-square"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>
        </nav>
      </motion.header>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 z-40 bg-background pt-20 md:hidden"
        >
          <nav className="container px-4 py-8">
            <div className="flex flex-col gap-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-2xl font-display py-6"
                    >
                      {link.label}
                    </Button>
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
                className="mt-4"
              >
                <Link href="mailto:rohosen2@gmail.com?subject=Hello Roho! I'd like to discuss a project with you." onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="glow" className="w-full" size="lg">
                    Get in touch
                  </Button>
                </Link>
              </motion.div>
            </div>
          </nav>
        </motion.div>
      )}
    </>
  );
}
