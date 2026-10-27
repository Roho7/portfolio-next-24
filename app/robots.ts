import type { MetadataRoute } from "next";
import { site } from "@/lib/profile";

// AI crawlers are listed by name so a future blanket rule can't silently shut them out
const aiCrawlers = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "CCBot",
  "meta-externalagent",
  "Amazonbot",
  "DuckAssistBot",
  "MistralAI-User",
  "cohere-ai",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/studio" },
      { userAgent: aiCrawlers, allow: "/", disallow: "/studio" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
