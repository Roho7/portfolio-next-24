export type ContributionDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

export type Contributions = { total: number; days: ContributionDay[] };

export async function getContributions(username: string): Promise<Contributions | null> {
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
      { next: { revalidate: 60 * 60 * 12 } }
    );
    if (!res.ok) return null;
    const data: { total: { lastYear: number }; contributions: ContributionDay[] } =
      await res.json();
    return { total: data.total.lastYear, days: data.contributions };
  } catch {
    return null;
  }
}
