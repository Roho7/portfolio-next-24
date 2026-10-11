import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export interface SanityImage {
  asset: {
    _ref: string;
    _type: string;
    url?: string;
  };
  alt?: string;
  caption?: string;
  layout?: "full" | "wide" | "normal" | "small";
}

export interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
}

export interface ProjectInfo {
  platform?: string;
  role?: string[];
  team?: string;
  duration?: string;
  client?: string;
}

export interface ProjectLinks {
  live?: string;
  github?: string;
  figma?: string;
  video?: string;
}

export interface ImageGallery {
  _type: "imageGallery";
  images: SanityImage[];
  columns: number;
}

export interface VideoEmbed {
  _type: "videoEmbed";
  url: string;
  caption?: string;
}

export interface CodeBlock {
  _type: "codeBlock";
  language: string;
  code: string;
  filename?: string;
}

export interface Section {
  _type: "section";
  sectionNumber?: string;
  sectionTitle: string;
  sectionContent: (PortableTextBlock | SanityImage)[];
}

export interface Callout {
  _type: "callout";
  type: "info" | "warning" | "success" | "quote";
  content: string;
}

export interface Stats {
  _type: "stats";
  items: { label: string; value: string }[];
}

export type ContentBlock =
  | PortableTextBlock
  | SanityImage
  | ImageGallery
  | VideoEmbed
  | CodeBlock
  | Section
  | Callout
  | Stats;

export interface Project {
  _id: string;
  title: string;
  slug: { current: string };
  subtitle?: string;
  excerpt?: string;
  year?: string;
  tags?: string[];
  order?: number;
  featured?: boolean;
  heroImage?: SanityImage;
  heroVideo?: string;
  projectInfo?: ProjectInfo;
  content?: ContentBlock[];
  links?: ProjectLinks;
  category?: Category;
}

export interface ProjectCard {
  _id: string;
  title: string;
  slug: { current: string };
  subtitle?: string;
  excerpt?: string;
  year?: string;
  tags?: string[];
  featured?: boolean;
  heroImage?: SanityImage;
  category?: Category;
  order?: number;
}

