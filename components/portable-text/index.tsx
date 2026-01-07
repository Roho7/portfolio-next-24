"use client";

import { PortableText, PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";
import type { ContentBlock, ImageGallery, VideoEmbed, CodeBlock, Section, Callout, Stats, SanityImage } from "@/sanity/lib/types";
import { motion, AnimatePresence } from "motion/react";
import { Info, AlertTriangle, CheckCircle, Quote, X, ZoomIn } from "lucide-react";
import { createContext, useContext, useState, useEffect } from "react";

// --- Lightbox Context & Components ---

interface LightboxContextType {
  openLightbox: (image: SanityImage) => void;
  closeLightbox: () => void;
}

const LightboxContext = createContext<LightboxContextType | null>(null);

function useLightbox() {
  const context = useContext(LightboxContext);
  if (!context) {
    throw new Error("useLightbox must be used within a LightboxProvider");
  }
  return context;
}

function Lightbox({ image, onClose }: { image: SanityImage | null; onClose: () => void }) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (image) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [image, onClose]);

  return (
    <AnimatePresence>
      {image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-background/80 backdrop-blur-md overflow-y-auto py-8 px-4"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            className="fixed top-4 right-4 p-2 rounded-full bg-background/50 hover:bg-background border border-border transition-colors z-50"
          >
            <X className="w-6 h-6" />
            <span className="sr-only">Close</span>
          </button>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-[80vw] max-w-[80vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={urlFor(image).url()}
              alt={image.alt || ""}
              width={1920}
              height={1080}
              className="w-full h-auto"
              sizes="80vw"
              priority
            />
            {image.caption && (
              <div className="mt-4 text-center p-4 bg-black/50 backdrop-blur-sm rounded-xl">
                <p className="text-white text-sm">{image.caption}</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- Helper for Aspect Ratio ---

const getImageDimensions = (id: string) => {
    const pattern = /^image-([a-f\d]+)-(\d+x\d+)-(\w+)$/;
    const match = pattern.exec(id);
    if (!match) return { width: 16, height: 9, aspectRatio: 16/9 };
    const [_, assetId, dimensions, format] = match;
    const [width, height] = dimensions.split('x').map(Number);
    return { width, height, aspectRatio: width / height };
};


const calloutIcons = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  quote: Quote,
};

const calloutStyles = {
  info: "bg-blue-500/10 border-blue-500/30 text-blue-200",
  warning: "bg-yellow-500/10 border-yellow-500/30 text-yellow-200",
  success: "bg-green-500/10 border-green-500/30 text-green-200",
  quote: "bg-primary/10 border-primary/30 text-foreground italic",
};

function ImageBlock({ value }: { value: SanityImage }) {
  const { openLightbox } = useLightbox();
  
  if (!value?.asset) return null;

  
  const dims = value.asset._ref ? getImageDimensions(value.asset._ref) : { width: 1600, height: 900, aspectRatio: 16/9 };
  
  const layoutClasses = {
    full: "w-full",
    wide: "w-full max-w-5xl mx-auto",
    normal: "w-full max-w-3xl mx-auto",
    small: "w-full max-w-xl mx-auto",
  };

  return (
    <motion.figure
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn("my-8 md:my-12", layoutClasses[value.layout || "wide"])}
    >
      <div 
        className="relative overflow-hidden rounded-xl cursor-zoom-in bg-muted/20 group"
        onClick={() => openLightbox(value)}
      >
        <Image
          src={urlFor(value).width(1200).url()}
          alt={value.alt || ""}
          width={dims.width}
          height={dims.height}
          className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
             <ZoomIn className="text-white w-10 h-10 drop-shadow-md" />
        </div>
      </div>
      {value.caption && (
        <figcaption className="text-center text-muted-foreground text-sm mt-3">
          {value.caption}
        </figcaption>
      )}
    </motion.figure>
  );
}

function ImageGalleryBlock({ value }: { value: ImageGallery }) {
  const { openLightbox } = useLightbox();
  
  if (!value?.images?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "my-8 md:my-12 grid gap-4",
        value.columns === 2 && "grid-cols-1 md:grid-cols-2",
        value.columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        value.columns === 4 && "grid-cols-2 md:grid-cols-4"
      )}
    >
      {value.images.map((img, index) => (
        <figure 
            key={index} 
            className="relative aspect-square overflow-hidden rounded-xl cursor-zoom-in group"
            onClick={() => openLightbox(img)}
        >
          <Image
            src={urlFor(img).width(600).height(600).url()}
            alt={img.alt || ""}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
           <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
             <ZoomIn className="text-white w-8 h-8 drop-shadow-md" />
            </div>
        </figure>
      ))}
    </motion.div>
  );
}

function VideoEmbedBlock({ value }: { value: VideoEmbed }) {
  if (!value?.url) return null;

  const getEmbedUrl = (url: string) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/)?.[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("vimeo.com")) {
      const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  return (
    <motion.figure
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="my-8 md:my-12"
    >
      <div className="relative aspect-video overflow-hidden rounded-xl bg-card">
        <iframe
          src={getEmbedUrl(value.url)}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {value.caption && (
        <figcaption className="text-center text-muted-foreground text-sm mt-3">
          {value.caption}
        </figcaption>
      )}
    </motion.figure>
  );
}

function CodeBlockComponent({ value }: { value: CodeBlock }) {
  if (!value?.code) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="my-8 md:my-12"
    >
      {value.filename && (
        <div className="bg-muted px-4 py-2 rounded-t-xl border border-b-0 border-border">
          <span className="text-sm font-mono text-muted-foreground">{value.filename}</span>
        </div>
      )}
      <pre className={cn(
        "p-4 overflow-x-auto bg-card border border-border",
        value.filename ? "rounded-b-xl" : "rounded-xl"
      )}>
        <code className="text-sm font-mono">{value.code}</code>
      </pre>
    </motion.div>
  );
}

function SectionBlock({ value }: { value: Section }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="my-16 md:my-24"
    >
      <div className="mb-8">
        {value.sectionNumber && (
          <span className="text-primary font-mono text-sm block mb-2">
            _{value.sectionNumber}
          </span>
        )}
        {value.sectionTitle && (
          <h2 className="text-3xl md:text-4xl font-display font-bold">
            {value.sectionTitle}
          </h2>
        )}
      </div>
      {value.sectionContent && (
        <div className="prose prose-invert max-w-none">
          <PortableText value={value.sectionContent as any} components={portableTextComponents} />
        </div>
      )}
    </motion.section>
  );
}

function CalloutBlock({ value }: { value: Callout }) {
  const Icon = calloutIcons[value.type];
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={cn(
        "my-8 p-6 rounded-xl border flex gap-4",
        calloutStyles[value.type]
      )}
    >
      <Icon className="w-6 h-6 flex-shrink-0 mt-0.5" />
      <p className="text-base leading-relaxed">{value.content}</p>
    </motion.div>
  );
}

function StatsBlock({ value }: { value: Stats }) {
  if (!value?.items?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="my-8 md:my-12 grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      {value.items.map((item, index) => (
        <div key={index} className="p-6 rounded-xl bg-card border border-border text-center">
          <div className="text-3xl md:text-4xl font-display font-bold text-primary mb-1">
            {item.value}
          </div>
          <div className="text-sm text-muted-foreground">{item.label}</div>
        </div>
      ))}
    </motion.div>
  );
}

export const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="text-3xl md:text-4xl font-display font-bold mt-12 mb-6">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl md:text-3xl font-display font-bold mt-10 mb-4">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl md:text-2xl font-display font-semibold mt-8 mb-3">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="text-lg text-muted-foreground leading-relaxed mb-6">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-6 my-8 italic text-xl text-foreground">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    code: ({ children }) => (
      <code className="px-1.5 py-0.5 bg-muted rounded text-sm font-mono">{children}</code>
    ),
    highlight: ({ children }) => (
      <mark className="bg-primary/30 text-foreground px-1 rounded">{children}</mark>
    ),
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6 ml-4">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-6 ml-4">
        {children}
      </ol>
    ),
  },
  types: {
    image: ImageBlock,
    imageGallery: ImageGalleryBlock,
    videoEmbed: VideoEmbedBlock,
    codeBlock: CodeBlockComponent,
    section: SectionBlock,
    callout: CalloutBlock,
    stats: StatsBlock,
  },
};

interface PortableTextRendererProps {
  content: ContentBlock[];
}

export function PortableTextRenderer({ content }: PortableTextRendererProps) {
  const [lightboxImage, setLightboxImage] = useState<SanityImage | null>(null);

  return (
    <LightboxContext.Provider value={{ 
        openLightbox: setLightboxImage, 
        closeLightbox: () => setLightboxImage(null) 
    }}>
      <div className="max-w-4xl mx-auto">
        <PortableText value={content as any} components={portableTextComponents} />
      </div>
      <Lightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </LightboxContext.Provider>
  );
}
