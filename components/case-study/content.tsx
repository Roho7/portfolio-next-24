"use client";

import { PortableTextRenderer } from "@/components/portable-text";
import type { ContentBlock } from "@/sanity/lib/types";

interface CaseStudyContentProps {
  content: ContentBlock[];
}

export function CaseStudyContent({ content }: CaseStudyContentProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <PortableTextRenderer content={content} />
      </div>
    </section>
  );
}







