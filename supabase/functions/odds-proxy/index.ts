import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const FALLBACK_KEY = "ccb5cfa1c1d8909e7668399923bbec06";
const BASE_URL = "https://api.the-odds-api.com/v4/sports";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") { return new Response(null, { status: 200, headers: corsHeaders }); }
  try {
    const url = new URL(req.url);
    const sportKey = url.searchParams.get("sportKey") || "upcoming";
    const region = url.searchParams.get("regions") || "uk";
    const market = url.searchParams.get("markets") || "h2h";
    const oddsFormat = url.searchParams.get("oddsFormat") || "decimal";
    const envKey = Deno.env.get("ODDS_API_KEY") || Deno.env.get("VITE_ODDS_API_KEY");
    const candidateKeys = [envKey, FALLBACK_KEY].filter((k): k is string => Boolean(k));
    let response: Response | null = null;
    let usedKey = "";
    for (const key of candidateKeys) {
      const apiUrl = `${BASE_URL}/${sportKey}/odds/?apiKey=${key}&regions=${region}&markets=${market}&oddsFormat=${oddsFormat}`;
      response = await fetch(apiUrl);
      if (response.ok) { usedKey = key; break; }
      if (response.status !== 401) break;
    }
    if (!response || !response.ok) {
      const errText = response ? await response.text() : "No response from upstream";
      return new Response(JSON.stringify({ error: `Upstream API error: ${response?.status ?? 500}`, detail: errText }), { status: response?.status ?? 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const data = await response.json();
    const remaining = response.headers.get("x-requests-remaining");
    const headers: Record<string, string> = { ...corsHeaders, "Content-Type": "application/json" };
    if (remaining) headers["x-requests-remaining"] = remaining;
    return new Response(JSON.stringify(data), { status: 200, headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "Internal proxy error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
