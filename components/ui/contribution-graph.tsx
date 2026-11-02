"use client";

import { useEffect, useRef } from "react";

import type { ContributionDay, Contributions } from "@/lib/github";
import { cn } from "@/lib/utils";

const LEVEL_CLASSES = [
  "bg-muted/50",
  "bg-primary/25",
  "bg-primary/45",
  "bg-primary/70",
  "bg-primary",
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Labels closer than this many weeks to the previous one would overlap.
const MIN_LABEL_GAP = 3;

// Pads the first week so every column starts on Sunday, like GitHub's graph.
function toWeeks(days: ContributionDay[]) {
  const padding = days.length ? new Date(days[0].date).getUTCDay() : 0;
  const cells: (ContributionDay | null)[] = [...Array(padding).fill(null), ...days];
  const weeks: (ContributionDay | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function monthLabels(weeks: (ContributionDay | null)[][]) {
  const labels: { week: number; label: string }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const first = week.find(Boolean);
    if (!first) return;
    const month = new Date(first.date).getUTCMonth();
    if (month === lastMonth) return;
    lastMonth = month;
    const previous = labels[labels.length - 1];
    if (previous && i - previous.week < MIN_LABEL_GAP) labels.pop();
    labels.push({ week: i, label: MONTHS[month] });
  });
  return labels;
}

export function ContributionGraph({ data }: { data: Contributions }) {
  const weeks = toWeeks(data.days);
  const columns = { gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` };
  const scrollRef = useRef<HTMLDivElement>(null);

  // On narrow screens the graph scrolls; start on the most recent weeks.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div ref={scrollRef} className="overflow-x-auto [scrollbar-width:none]">
        <div className="min-w-[640px] flex flex-col gap-3">
          <div className="grid gap-[3px] text-xs text-muted-foreground" style={columns}>
            {monthLabels(weeks).map(({ week, label }) => (
              <span key={week} style={{ gridColumnStart: week + 1 }} className="col-span-3">
                {label}
              </span>
            ))}
          </div>
          <div className="grid grid-flow-col grid-rows-7 gap-[3px]" style={columns}>
            {weeks.flatMap((week, w) =>
              Array.from({ length: 7 }, (_, d) => {
                const day = week[d];
                return (
                  <span
                    key={`${w}-${d}`}
                    title={day ? `${day.count} contributions on ${day.date}` : undefined}
                    className={cn(
                      "aspect-square rounded-[2px]",
                      day ? LEVEL_CLASSES[day.level] : "bg-transparent",
                    )}
                  />
                );
              }),
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
        <span>{data.total.toLocaleString("en-US")} contributions in the last year</span>
        <span className="hidden sm:flex items-center gap-1.5">
          Less
          {LEVEL_CLASSES.map((cls) => (
            <span key={cls} className={cn("size-2.5 rounded-[2px]", cls)} />
          ))}
          More
        </span>
      </div>
    </div>
  );
}
