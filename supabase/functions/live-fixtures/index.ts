import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const responseHeaders = {
  ...corsHeaders,
  "Content-Type": "application/json",
  "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=30",
};

const ODDS_API_BASE = "https://api.the-odds-api.com/v4";
const API_KEY = Deno.env.get("ODDS_API_KEY") ?? "";
const ATP_SPORT_KEY = "tennis_atp";
const CACHE_TTL_MS = 60 * 1000;
const ACTIVE_SPORTS_TTL_MS = 10 * 60 * 1000;

interface SportGroup { key: string; emoji: string; }
interface OddsApiSport { key: string; active?: boolean; has_outrights?: boolean; }
interface OddsApiEvent { id: string; sport_key: string; commence_time: string; home_team: string; away_team: string; }
interface LivePill { label: string; text: string; emoji: string; live?: boolean; score?: string; time?: string; }

const REGION_SPORTS: Record<string, SportGroup[]> = {
  uk: [
    { key: "soccer_epl", emoji: "\u26bd" },
    { key: "soccer_uefa_champs_league", emoji: "\u26bd" },
    { key: ATP_SPORT_KEY, emoji: "\ud83c\udfbe" },
  ],
  us: [
    { key: "americanfootball_nfl", emoji: "\ud83c\udfc8" },
    { key: "basketball_nba", emoji: "\ud83c\udfc0" },
    { key: "baseball_mlb", emoji: "\u26be" },
    { key: "icehockey_nhl", emoji: "\ud83c\udfd2" },
  ],
  it: [
    { key: "soccer_italy_serie_a", emoji: "\u26bd" },
    { key: "soccer_uefa_champs_league", emoji: "\u26bd" },
    { key: ATP_SPORT_KEY, emoji: "\ud83c\udfbe" },
  ],
};

const fixtureCache = new Map<string, { expiresAt: number; body: string }>();
let activeAtpCache: { expiresAt: number; keys: string[] } | null = null;

async function getActiveAtpKeys(): Promise<string[]> {
  if (activeAtpCache && activeAtpCache.expiresAt > Date.now()) return activeAtpCache.keys;
  try {
    const response = await fetch(`${ODDS_API_BASE}/sports/?apiKey=${API_KEY}`);
    if (!response.ok) return [];
    const data = await response.json().catch(() => []) as OddsApiSport[];
    const keys = (Array.isArray(data) ? data : [])
      .filter((sport) => sport?.active !== false && !sport?.has_outrights && sport?.key?.startsWith("tennis_atp_"))
      .map((sport) => sport.key)
      .slice(0, 4);
    activeAtpCache = { expiresAt: Date.now() + ACTIVE_SPORTS_TTL_MS, keys };
    return keys;
  } catch {
    return [];
  }
}

async function getSportsForRegion(region: string): Promise<SportGroup[]> {
  const configured = REGION_SPORTS[region] ?? REGION_SPORTS.uk;
  if (!configured.some((sport) => sport.key === ATP_SPORT_KEY)) return configured;
  const activeAtpKeys = await getActiveAtpKeys();
  return configured.flatMap((sport) => sport.key === ATP_SPORT_KEY
    ? activeAtpKeys.map((key) => ({ key, emoji: sport.emoji }))
    : [sport]);
}

async function fetchUpcomingEvents(sport: SportGroup): Promise<{ sport: SportGroup; events: OddsApiEvent[] }> {
  try {
    const response = await fetch(`${ODDS_API_BASE}/sports/${sport.key}/events?apiKey=${API_KEY}`);
    if (!response.ok) return { sport, events: [] };
    const data = await response.json().catch(() => []);
    const events: OddsApiEvent[] = Array.isArray(data) ? data : (data?.data ?? []);
    const upcoming = (Array.isArray(events) ? events : [])
      .filter((event) => event?.home_team && event?.away_team && event?.commence_time)
      .sort((a, b) => new Date(a.commence_time).getTime() - new Date(b.commence_time).getTime())
      .slice(0, 2);
    return { sport, events: upcoming };
  } catch {
    return { sport, events: [] };
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: responseHeaders });
  try {
    if (!API_KEY) {
      return new Response(JSON.stringify({ pills: [], error: "Odds service is not configured." }), { status: 500, headers: responseHeaders });
    }

    const url = new URL(req.url);
    const requestedRegion = (url.searchParams.get("region") ?? "uk").toLowerCase();
    const region = requestedRegion in REGION_SPORTS ? requestedRegion : "uk";
    const cached = fixtureCache.get(region);
    if (cached && cached.expiresAt > Date.now()) return new Response(cached.body, { headers: responseHeaders });

    const sports = await getSportsForRegion(region);
    const results = await Promise.all(sports.map(fetchUpcomingEvents));
    const pills: LivePill[] = [];

    for (const { sport, events } of results) {
      for (const event of events) {
        if (pills.length >= 8) break;
        const commence = new Date(event.commence_time);
        const isLive = commence.getTime() <= Date.now();
        const time = commence.toLocaleString("en-US", { weekday: "short", hour: "numeric", minute: "2-digit" });
        const label = `${event.home_team} vs ${event.away_team}`;
        pills.push({ label, text: label, emoji: sport.emoji, live: isLive, time: isLive ? undefined : time });
      }
      if (pills.length >= 8) break;
    }

    const body = JSON.stringify({ pills });
    fixtureCache.set(region, { expiresAt: Date.now() + CACHE_TTL_MS, body });
    return new Response(body, { headers: responseHeaders });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return new Response(JSON.stringify({ pills: [], error: message }), { status: 500, headers: responseHeaders });
  }
});
