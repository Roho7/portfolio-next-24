import { renderOgImage, ogSize } from "@/lib/og";
import { site } from "@/lib/profile";

export const alt = site.title;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    seed: "home",
    eyebrow: "Portfolio",
    title: site.name,
    description: "Full-stack engineer solving his own problems among other things.",
    tags: ["Full-Stack", "Design", "AI", "Engineer"],
  });
}
