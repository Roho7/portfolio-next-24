import { ImageResponse } from "next/og";
import { site } from "@/lib/profile";

export const ogSize = { width: 1200, height: 630 };

const colors = {
  background: "#080808",
  foreground: "#fafafa",
  muted: "#a3a3a3",
  border: "#262626",
  primary: "#acc322",
};

const GRID = 5;
const CELL = 92;

async function loadGoogleFont(family: string, axes: string) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:${axes}`
  ).then((res) => res.text());
  const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
  if (!url) throw new Error(`Could not load font ${family}`);
  return fetch(url).then((res) => res.arrayBuffer());
}

// mulberry32 seeded from a string hash, so the same link always renders the same pattern
function seededRandom(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h |= 0;
    h = (h + 0x6d2b79f5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const corners = ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"] as const;

function Tile({ random }: { random: () => number }) {
  const shape = Math.floor(random() * 5);
  const roll = random();
  const fill = roll < 0.35 ? colors.primary : roll < 0.6 ? colors.foreground : "transparent";
  const outline = fill === "transparent" ? `2px solid ${colors.muted}` : "none";
  const base = { width: CELL, height: CELL, display: "flex", background: fill, border: outline };

  if (shape === 0) return <div style={{ width: CELL, height: CELL, display: "flex" }} />;
  if (shape === 1) return <div style={{ ...base, borderRadius: CELL }} />;
  if (shape === 2) return <div style={{ ...base, [corners[Math.floor(random() * 4)]]: CELL }} />;
  if (shape === 3) {
    return (
      <div style={{ width: CELL, height: CELL, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ ...base, width: CELL * 0.42, height: CELL * 0.42, borderRadius: CELL }} />
      </div>
    );
  }
  return <div style={{ ...base, [corners[Math.floor(random() * 4)]]: CELL, [corners[Math.floor(random() * 4)]]: CELL }} />;
}

interface OgImageProps {
  seed: string;
  eyebrow: string;
  title: string;
  description?: string;
  tags?: string[];
}

export async function renderOgImage({ seed, eyebrow, title, description, tags = [] }: OgImageProps) {
  const random = seededRandom(seed);
  const [hero, mono, serif] = await Promise.all([
    loadGoogleFont("Bricolage Grotesque", "wght@600"),
    loadGoogleFont("JetBrains Mono", "wght@400"),
    loadGoogleFont("Instrument Serif", "ital@1"),
  ]);

  // keep the pill row on one line within the text column
  let tagChars = 0;
  const visibleTags = tags.slice(0, 3).filter((tag) => (tagChars += tag.length) <= 34);

  const summary = description && description.length > 150 ? `${description.slice(0, 147).trimEnd()}…` : description;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: colors.background,
          color: colors.foreground,
          padding: 64,
          gap: 56,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Mono", fontSize: 22, letterSpacing: 2 }}>
            <div style={{ display: "flex", color: colors.primary, textTransform: "uppercase" }}>{eyebrow}</div>
            <div style={{ display: "flex", color: colors.muted }}>{new URL(site.url).host}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", fontFamily: "Hero", fontSize: title.length > 28 ? 60 : 76, lineHeight: 1.02, letterSpacing: -2 }}>
              {title}
            </div>
            {summary && (
              <div style={{ display: "flex", fontFamily: "Serif", fontStyle: "italic", fontSize: 32, lineHeight: 1.25, color: colors.muted }}>
                {summary}
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 12, fontFamily: "Mono", fontSize: 20, color: colors.muted }}>
            {visibleTags.map((tag) => (
              <div key={tag} style={{ display: "flex", border: `1px solid ${colors.border}`, borderRadius: 999, padding: "6px 16px" }}>
                {tag}
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: GRID * CELL,
            height: GRID * CELL,
            alignSelf: "center",
          }}
        >
          {Array.from({ length: GRID * GRID }, (_, i) => (
            <Tile key={i} random={random} />
          ))}
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Hero", data: hero, weight: 600 },
        { name: "Mono", data: mono, weight: 400 },
        { name: "Serif", data: serif, style: "italic" },
      ],
    }
  );
}
