import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ODDS_API_BASE = "https://api.the-odds-api.com/v4";
const API_KEY = Deno.env.get("ODDS_API_KEY") ?? "69f879212d5be6406be0ff8c69704cf6";

interface SportGroup { key: string; emoji: string; priority: number; }

const ALL_SPORTS: SportGroup[] = [
  { key: "soccer_epl", emoji: "\u26bd", priority: 1 },
  { key: "soccer_uefa_champs_league", emoji: "\u26bd", priority: 2 },
  { key: "soccer_italy_serie_a", emoji: "\u26bd", priority: 3 },
  { key: "soccer_club_friendlies", emoji: "\u26bd", priority: 4 },
  { key: "soccer_efl_champ", emoji: "\u26bd", priority: 5 },
  { key: "basketball_nba", emoji: "\ud83c\udfc0", priority: 6 },
  { key: "americanfootball_nfl", emoji: "\ud83c\udfc8", priority: 7 },
  { key: "baseball_mlb", emoji: "\u26be", priority: 8 },
  { key: "icehockey_nhl", emoji: "\ud83c\udfd2", priority: 9 },
  { key: "tennis_atp_singles", emoji: "\ud83c\udfbe", priority: 10 },
  { key: "rugby_league_super_league", emoji: "\ud83c\udfc9", priority: 11 },
  { key: "motorsport_f1", emoji: "\ud83c\udfce\ufe0f", priority: 12 },
];

const PRIORITY_SPORTS: Record<string, string[]> = {
  uk: ["soccer_epl", "soccer_uefa_champs_league", "tennis_atp_singles", "rugby_league_super_league"],
  us: ["americanfootball_nfl", "basketball_nba", "baseball_mlb", "icehockey_nhl"],
  it: ["soccer_italy_serie_a", "soccer_uefa_champs_league", "tennis_atp_singles", "motorsport_f1"],
};

function getSportsForRegion(region: string): SportGroup[] {
  const priority = PRIORITY_SPORTS[region] ?? [];
  const prioritySet = new Set(priority);
  const prioritized = priority.map((k) => ALL_SPORTS.find((s) => s.key === k)).filter((s): s is SportGroup => s !== undefined);
  const rest = ALL_SPORTS.filter((s) => !prioritySet.has(s.key));
  return [...prioritized, ...rest];
}

interface OddsApiEvent { id: string; sport_key: string; commence_time: string; home_team: string; away_team: string; }
interface LivePill { label: string; text: string; emoji: string; live?: boolean; score?: string; time?: string; }

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") { return new Response(null, { status: 200, headers: corsHeaders }); }
  try {
    const url = new URL(req.url);
    const region = (url.searchParams.get("region") ?? "uk").toLowerCase();
    const sports = getSportsForRegion(region);
    const pills: LivePill[] = [];
    for (const sport of sports) {
      if (pills.length >= 8) break;
      try {
        const res = await fetch(`${ODDS_API_BASE}/sports/${sport.key}/events?apiKey=${API_KEY}`);
        if (!res.ok) continue;
        const data = await res.json().catch(() => []);
        const events: OddsApiEvent[] = Array.isArray(data) ? data : (data?.data ?? []);
        if (!events || !Array.isArray(events)) continue;
        const upcoming = events.filter((e) => e?.home_team && e?.away_team && e?.commence_time).sort((a, b) => new Date(a.commence_time).getTime() - new Date(b.commence_time).getTime()).slice(0, 2);
        for (const event of upcoming) {
          if (pills.length >= 8) break;
          const commence = new Date(event.commence_time);
          const now = new Date();
          const isLive = commence.getTime() <= now.getTime();
          const timeStr = commence.toLocaleString("en-US", { weekday: "short", hour: "numeric", minute: "2-digit" });
          pills.push({ label: `${event.home_team} vs ${event.away_team}`, text: `${event.home_team} vs ${event.away_team}`, emoji: sport.emoji, live: isLive, time: isLive ? undefined : timeStr });
        }
      } catch { continue; }
    }
    return new Response(JSON.stringify({ pills }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ pills: [], error: err?.message ?? "Unexpected error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
