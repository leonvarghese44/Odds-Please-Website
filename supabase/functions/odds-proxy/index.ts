import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const BASE_URL = "https://api.the-odds-api.com/v4/sports";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") { return new Response(null, { status: 200, headers: corsHeaders }); }
  try {
    const apiKey = Deno.env.get("ODDS_API_KEY") ?? "";
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Odds service is not configured." }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const url = new URL(req.url);
    const sportKey = url.searchParams.get("sportKey") || "upcoming";
    const region = url.searchParams.get("regions") || "uk";
    const market = url.searchParams.get("markets") || "h2h";
    const oddsFormat = url.searchParams.get("oddsFormat") || "decimal";
    const query = new URLSearchParams({
      apiKey,
      regions: region,
      markets: market,
      oddsFormat,
      includeLinks: "true",
      includeSids: "true",
    });
    const response = await fetch(`${BASE_URL}/${encodeURIComponent(sportKey)}/odds/?${query.toString()}`);
    if (!response.ok) {
      const errText = await response.text();
      return new Response(JSON.stringify({ error: `Upstream API error: ${response.status}`, detail: errText }), { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const data = await response.json();
    const remaining = response.headers.get("x-requests-remaining");
    const headers: Record<string, string> = { ...corsHeaders, "Content-Type": "application/json" };
    if (remaining) headers["x-requests-remaining"] = remaining;
    return new Response(JSON.stringify(data), { status: 200, headers });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal proxy error";
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
