import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {
  extractPlayerParticipantText,
  findUnambiguousPlayerHint,
  playerNamesReferToSameEntity,
  resolveCanonicalPlayerSelection,
} from "./player-resolution.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ODDS_API_BASE = "https://api.the-odds-api.com/v4";
const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const API_KEY = Deno.env.get("ODDS_API_KEY") ?? "";
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") ?? "";
const SEARCH_INTERPRETER_MODEL = Deno.env.get("SEARCH_INTERPRETER_MODEL") ?? Deno.env.get("SPORT_CLASSIFIER_MODEL") ?? "gpt-5.4-nano";
const ATP_SPORT_KEY = "tennis_atp";
const EVENT_MARKET_CACHE_TTL_MS = 60_000;
const QUERY_INTERPRETATION_CACHE_TTL_MS = 10 * 60_000;
const PLAYER_EVENT_SCAN_LIMIT = 8;

interface SportMapping {
  key: string;
  sport: string;
  icon: string;
  hints: string[];
}

const SPORT_MAP: SportMapping[] = [
  { key: "soccer_epl", sport: "Soccer", icon: "\u26bd", hints: ["premier league", "epl", "arsenal", "chelsea", "liverpool", "man city", "manchester city", "man united", "manchester united", "man utd", "spurs", "tottenham", "everton", "newcastle", "brighton", "villa", "aston villa", "west ham", "wolves", "leeds", "wigan", "hull city", "hull", "coventry", "crystal palace", "brentford", "fulham", "nottingham forest", "bournemouth", "luton", "burnley", "sheffield united"] },
  { key: "soccer_uefa_champs_league", sport: "Soccer", icon: "\u26bd", hints: ["champions league", "ucl", "real madrid", "bayern", "bayern munich", "psg", "paris saint germain", "barcelona", "barca", "inter", "inter milan", "milan", "ac milan", "juventus", "juve", "atletico", "atletico madrid", "dortmund", "borussia dortmund", "napoli", "porto", "benfica", "atalanta", "leverkusen"] },
  { key: "soccer_italy_serie_a", sport: "Soccer", icon: "\u26bd", hints: ["serie a", "inter", "inter milan", "milan", "ac milan", "juventus", "juve", "napoli", "roma", "as roma", "lazio", "atalanta", "fiorentina", "torino", "bologna", "genoa", "udinese", "sassuolo", "monza", "lecce", "verona", "cagliari", "empoli", "frosinone", "salernitana"] },
  { key: "basketball_nba", sport: "Basketball", icon: "\ud83c\udfc0", hints: ["nba", "lakers", "los angeles lakers", "celtics", "boston celtics", "lebron", "lebron james", "warriors", "golden state warriors", "bulls", "chicago bulls", "knicks", "new york knicks", "basketball", "clippers", "la clippers", "nuggets", "denver nuggets", "bucks", "milwaukee bucks", "heat", "miami heat", "suns", "phoenix suns", "76ers", "sixers", "philadelphia", "mavericks", "dallas mavericks", "rockets", "houston rockets", "spurs", "san antonio spurs", "pelicans", "new orleans pelicans", "grizzlies", "memphis grizzlies", "thunder", "oklahoma city thunder", "timberwolves", "minnesota timberwolves", "kings", "sacramento kings", "magic", "orlando magic", "hornets", "charlotte hornets", "pacers", "indiana pacers", "cavaliers", "cleveland cavaliers", "pistons", "detroit pistons", "raptors", "toronto raptors", "nets", "brooklyn nets", "hawks", "atlanta hawks", "jazz", "utah jazz", "trail blazers", "portland trail blazers", "wizards", "washington wizards"] },
  { key: "americanfootball_nfl", sport: "Football", icon: "\ud83c\udfc8", hints: ["nfl", "football", "chiefs", "kansas city chiefs", "bills", "buffalo bills", "mahomes", "patrick mahomes", "cowboys", "dallas cowboys", "eagles", "philadelphia eagles", "packers", "green bay packers", "49ers", "san francisco 49ers", "ravens", "baltimore ravens", "bengals", "cincinnati bengals", "lions", "detroit lions", "jets", "new york jets", "dolphins", "miami dolphins", "kelce", "travis kelce", "seahawks", "seattle seahawks", "seattle", "falcons", "atlanta falcons", "atlanta", "patriots", "new england patriots", "pats", "rams", "los angeles rams", "steelers", "pittsburgh steelers", "colts", "indianapolis colts", "texans", "houston texans", "panthers", "carolina panthers", "bears", "chicago bears", "buccaneers", "tampa bay buccaneers", "bucs", "jaguars", "jacksonville jaguars", "browns", "cleveland browns", "saints", "new orleans saints", "titans", "tennessee titans", "vikings", "minnesota vikings", "chargers", "los angeles chargers", "raiders", "las vegas raiders", "broncos", "denver broncos", "commanders", "washington commanders", "cardinals", "arizona cardinals"] },
  { key: "baseball_mlb", sport: "Baseball", icon: "\u26be", hints: ["mlb", "baseball", "dodgers", "los angeles dodgers", "padres", "san diego padres", "yankees", "new york yankees", "red sox", "boston red sox", "astros", "houston astros", "braves", "atlanta braves", "atlanta", "cubs", "chicago cubs", "mets", "new york mets", "phillies", "philadelphia phillies", "brewers", "milwaukee brewers", "pirates", "pittsburgh pirates", "cardinals", "st louis cardinals", "reds", "cincinnati reds", "giants", "san francisco giants", "rockies", "colorado rockies", "diamondbacks", "arizona diamondbacks", "dbacks", "padres", "rays", "tampa bay rays", "twins", "minnesota twins", "white sox", "chicago white sox", "guardians", "cleveland guardians", "tigers", "detroit tigers", "royals", "kansas city royals", "angels", "los angeles angels", "athletics", "oakland athletics", "a's", "mariners", "seattle mariners", "rangers", "texas rangers", "nationals", "washington nationals", "orioles", "baltimore orioles", "blue jays", "toronto blue jays", "marlins", "miami marlins"] },
  { key: "icehockey_nhl", sport: "Hockey", icon: "\ud83c\udfd2", hints: ["nhl", "hockey", "rangers", "new york rangers", "bruins", "boston bruins", "maple leafs", "toronto maple leafs", "oilers", "edmonton oilers", "avalanche", "colorado avalanche", "penguins", "pittsburgh penguins", "panthers", "florida panthers", "stars", "dallas stars", "devils", "new jersey devils", "islanders", "new york islanders", "seattle kraken", "kraken", "sabres", "buffalo sabres", "canadiens", "montreal canadiens", "canadiens", "senators", "ottawa senators", "jets", "winnipeg jets", "flames", "calgary flames", "canucks", "vancouver canucks", "sharks", "san jose sharks", "kings", "los angeles kings", "ducks", "anaheim ducks", "coyotes", "arizona coyotes", "wild", "minnesota wild", "predators", "nashville predators", "blackhawks", "chicago blackhawks", "red wings", "detroit red wings", "blue jackets", "columbus blue jackets", "flyers", "philadelphia flyers", "capitals", "washington capitals", "hurricanes", "carolina hurricanes", "lightning", "tampa bay lightning", "golden knights", "vegas golden knights", "knights"] },
  { key: ATP_SPORT_KEY, sport: "Tennis", icon: "\ud83c\udfbe", hints: ["tennis", "atp", "alcaraz", "carlos alcaraz", "djokovic", "novak djokovic", "sinner", "jannik sinner", "medvedev", "daniil medvedev", "federer", "roger federer", "nadal", "rafa nadal", "zverev", "alexander zverev", "wimbledon", "us open", "french open", "australian open", "tsitsipas", "rublev", "hurkacz", "ruud", "khachanov", "de minaur", "fritz", "shelton", "tiafoe", "paul"] },
  { key: "rugby_league_super_league", sport: "Rugby", icon: "\ud83c\udfc9", hints: ["super league", "rugby", "rhinos", "leeds rhinos", "wigan warriors", "wigan", "st helens", "warrington wolves", "warrington", "hull fc", "hull kr", "castleford tigers", "castleford", "huddersfield giants", "huddersfield", "catalan dragons", "catalan", "salford red devils", "salford", "wakefield trinity", "wakefield", "leigh leopards", "leigh"] },
  { key: "motorsport_f1", sport: "Motorsport", icon: "\ud83c\udfce\ufe0f", hints: ["f1", "formula 1", "formula one", "monaco", "grand prix", "gp", "verstappen", "max verstappen", "hamilton", "lewis hamilton", "leclerc", "charles leclerc", "norris", "lando norris", "russell", "george russell", "perez", "sergio perez", "sainz", "carlos sainz", "alonso", "fernando alonso", "piastri", "oscar piastri", "gasly", "ocon", "bottas", "zhou", "stroll", "hulkenberg", "magnussen", "tsunoda", "ricciardo", "albon", "sargeant"] },
  { key: "soccer_club_friendlies", sport: "Soccer", icon: "\u26bd", hints: ["friendly", "friendlies", "club friendly", "club friendlies", "pre-season", "pre season", "preseason"] },
  { key: "soccer_efl_champ", sport: "Soccer", icon: "\u26bd", hints: ["championship", "efl", "efl championship", "norwich", "leeds united", "leeds", "wigan", "hull city", "hull", "coventry", "swansea", "swansea city", "cardiff", "cardiff city", "bristol city", "middlesbrough", "millwall", "stoke city", "stoke", "west brom", "west bromwich albion", "birmingham city", "birmingham", "blackburn rovers", "blackburn", "sheffield wednesday", "sheffield united", "plymouth", "rotherham", "huddersfield", "watford", "luton", "burnley", "sunderland", "ipswich", "southampton", "qpr", "queens park rangers"] },
  { key: "soccer_england_league1", sport: "Soccer", icon: "\u26bd", hints: ["league one", "league 1", "charlton", "charlton athletic", "derby", "derby county", "bolton", "bolton wanderers", "portsmouth", "blackpool", "wigan", "reading", "shrewsbury", "cambridge", "cheltenham", "fleetwood", "lincoln", "lincoln city", "peterborough", "oxford", "oxford united", "burton", "burton albion", "bristol rovers", "exeter", "barnsley", "northampton", "wigan athletic", "wycombe", "wycombe wanderers", "leyton orient", "stevenage", "carlisle", "cheltenham town", "wrexham", "stockport"] },
  { key: "soccer_england_league2", sport: "Soccer", icon: "\u26bd", hints: ["league two", "league 2", "bradford", "bradford city", "crewe", "crewe alexandra", "doncaster", "doncaster rovers", "gillingham", "grimsby", "grimsby town", "harrogate", "hartlepool", "mansfield", "mansfield town", "newport", "newport county", "salford", "salford city", "tranmere", "tranmere rovers", "walsall", "wimbledon", "afc wimbledon", "morecambe", "crawley", "crawley town", "colchester", "colchester united", "barrow", "barrow afc", "forest green", "rotherham united", "accrington", "accrington stanley", "sutton", "sutton united", "mk dons", "milton keynes"] },
  { key: "soccer_scotland_prem", sport: "Soccer", icon: "\u26bd", hints: ["scottish premiership", "spl", "celtic", "rangers", "aberdeen", "hearts", "heart of midlothian", "hibs", "hibernian", "kilmarnock", "motherwell", "st mirren", "st johnstone", "ross county", "dundee", "dundee united", "livingston", "partick thistle"] },
  { key: "soccer_spain_la_liga", sport: "Soccer", icon: "\u26bd", hints: ["la liga", "real madrid", "barcelona", "barca", "atletico", "atletico madrid", "atletico", "sevilla", "real betis", "betis", "villarreal", "real sociedad", "athletic bilbao", "athletic club", "valencia", "celta vigo", "celta", "getafe", "osasuna", "rayo vallecano", "rayo", "mallorca", "almeria", "cadiz", "granada", "las palmas", "girona", "alaves", "elche", "espanyol", "levante"] },
  { key: "soccer_germany_bundesliga", sport: "Soccer", icon: "\u26bd", hints: ["bundesliga", "bayern", "bayern munich", "dortmund", "borussia dortmund", "leverkusen", "rb leipzig", "leipzig", "frankfurt", "eintracht frankfurt", "stuttgart", "freiburg", "hoffenheim", "wolfsburg", "mainz", "augsburg", "werder bremen", "bremen", "bochum", "union berlin", "hertha", "hertha berlin", "schalke", "koln", "fc koln", "monchengladbach", "borussia monchengladbach", "darmstadt", "heidenheim"] },
  { key: "soccer_france_ligue_one", sport: "Soccer", icon: "\u26bd", hints: ["ligue 1", "ligue one", "psg", "paris saint germain", "paris saint-germain", "marseille", "monaco", "lyon", "lille", "rennes", "nice", "lens", "nantes", "strasbourg", "montpellier", "toulouse", "brest", "le havre", "metz", "lorient", "clermont", "reims", "angers", "troyes", "ajaccio", "auxerre"] },
  { key: "soccer_uefa_europa_league", sport: "Soccer", icon: "\u26bd", hints: ["europa league", "uel", "sevilla", "roma", "as roma", "juventus", "juve", "bayer leverkusen", "leverkusen", "west ham", "brighton", "liverpool", "atalanta", "marsaille", "sporting", "sporting lisbon", "porto", "fc porto", "benfica", "sl benfica", "feyenoord", "ajax", "psv", "eindhoven", "braga", "sc braga", "rangers", "celtic", "lazio", "freiburg", "toulouse", "rennes", "shakhtar", "shakhtar donetsk"] },
  { key: "soccer_uefa_europa_conference_league", sport: "Soccer", icon: "\u26bd", hints: ["conference league", "europa conference", "conference", "fiorentina", "west ham", "az alkmaar", "az", "basel", "fc basel", "nice", "lille", "anderlecht", "rsc anderlecht", "club brugge", "gent", "slavia praha", "slavia", "ferencvaros", "ferencv\u00e1ros", "lugano", "fc lugano", "dinamo zagreb", "maccabi", "maccabi tel aviv", "apoel", "viktoria plzen", "viktoria", "linfield", "hjk", "klaksvik"] },
  { key: "soccer_england_efl_cup", sport: "Soccer", icon: "\u26bd", hints: ["efl cup", "carabao cup", "league cup", "carabao"] },
  { key: "soccer_england_fa_cup", sport: "Soccer", icon: "\u26bd", hints: ["fa cup", "football association"] },
  { key: "soccer_spain_copa_del_rey", sport: "Soccer", icon: "\u26bd", hints: ["copa del rey", "copa", "spanish cup"] },
  { key: "soccer_italy_coppa_italia", sport: "Soccer", icon: "\u26bd", hints: ["coppa italia", "italian cup"] },
  { key: "soccer_germany_bundesliga2", sport: "Soccer", icon: "\u26bd", hints: ["bundesliga 2", "2. bundesliga", "second bundesliga", "hamburg", "hsv", "st pauli", "fc st pauli", "holstein kiel", "kiel", "fortuna dusseldorf", "dusseldorf", "d\u00fcsseldorf", "paderborn", "sc paderborn", "darmstadt", "sv darmstadt", "karlsruher", "karlsruhe", "hannover", "hannover 96", "nurnberg", "1. fc nurnberg", "n\u00fcrnberg", "greuther furth", "furth", "kaiserslautern", "1. fc kaiserslautern", "magdeburg", "fc magdeburg", "wehen", "sv wehen", "wiesbaden", "osnabruck", "vfl osnabruck", "osnabr\u00fcck", "rostock", "hansa rostock", "braunschweig", "eintracht braunschweig", "saarbrucken", "1. fc saarbrucken", "saarbr\u00fccken"] },
  { key: "soccer_france_ligue2", sport: "Soccer", icon: "\u26bd", hints: ["ligue 2", "ligue2", "second division france", "auxerre", "aj auxerre", "metz", "fc metz", "caen", "sm caen", "amiens", "amiens sc", "paris fc", "grenoble", "grenoble foot", "sochaux", "fc sochaux", "valenciennes", "va", "nancy", "asnancy", "lorient", "fc lorient", "annecy", "fc annecy", "niort", "chamois niortais", "guingamp", "ea guingamp", "le havre", "hac", "saint-etienne", "as saint-etienne", "asse", "bastia", "sc bastia", "rodez", "af rodez", "quevilly", "quevilly-rouen", "dijon", "dijon fco", "laval", "stade laval", "ac ajaccio", "ajaccio", "pau", "pau fc", "concarneau", "us concarneau", "troyes", "estac troyes", "usl dunkerque", "dunkerque"] },
  { key: "soccer_netherlands_eredivisie", sport: "Soccer", icon: "\u26bd", hints: ["eredivisie", "dutch league", "ajax", "psv", "eindhoven", "psv eindhoven", "feyenoord", "az alkmaar", "az", "twente", "fc twente", "utrecht", "fc utrecht", "heerenveen", "sc heerenveen", "vitesse", "sparta rotterdam", "sparta", "nec", "nec nijmegen", "heracles", "heracles almelo", "go ahead eagles", "go ahead", "zwolle", "pec zwolle", "fortuna sittard", "fortuna", "almere", "almere city", "rkc", "rkc waalwijk", "excelsior", "sbv excelsior", "emmen", "fc emmen", " cambuur", "sc cambuur", "groningen", "fc groningen"] },
  { key: "soccer_portugal_primeira_liga", sport: "Soccer", icon: "\u26bd", hints: ["primeira liga", "portuguese league", "portuguese premiership", "benfica", "sl benfica", "porto", "fc porto", "sporting", "sporting cp", "braga", "sc braga", "vitoria", "vitoria guimaraes", "guimaraes", "famalicao", "famalic\u00e3o", "boavista", "boavista fc", "moreirense", "moreirense fc", "rio ave", "rio ave fc", "estoril", "estoril praia", "casa pia", "casa pia ac", "vizela", "fc vizela", "portimonense", "portimonense sc", "gil vicente", "gil vicente fc", "estrela", "estrela amadora", "chaves", "gd chaves", "maritimo", "cs maritimo", "academico", "academico viseu", "vizela"] },
  { key: "soccer_uefa_nations_league", sport: "Soccer", icon: "\u26bd", hints: ["nations league", "uefa nations", "spain", "france", "germany", "netherlands", "italy", "england", "portugal", "croatia", "belgium", "denmark", "switzerland", "austria", "poland", "turkey", "serbia", "scotland", "ukraine", "sweden", "norway", "greece", "czech republic", "czechia", "romania", "ireland", "republic of ireland", "wales", "finland", "bosnia", "slovenia", "slovakia", "albania", "bulgaria", "israel", "hungary", "montenegro", "lithuania", "luxembourg", "kazakhstan", "armenia", "georgia", "north macedonia", "kosovo", "belarus", "cyprus", "latvia", "estonia", "faroe islands", "gibraltar", "liechtenstein", "san marino", "andorra", "malta", "moldova", "azerbaijan"] },
  { key: "soccer_italy_serie_b", sport: "Soccer", icon: "\u26bd", hints: ["serie b", "italian second division", "como", "como 1907", "venezia", "venezia fc", "cremonese", "us cremonese", "parma", "parma calcio", "catanzaro", "us catanzaro", "palermo", "us palermo", "brescia", "brescia calcio", "sampdoria", "uc sampdoria", "modena", "modena fc", "bari", "ssc bari", "ternana", "ternana calcio", "terni", "reggiana", "ac reggiana", "cosenza", "cosenza calcio", "cittadella", "as cittadella", "frosinone", "frosinone calcio", "pisa", "pisa sporting club", "ascoli", "ascoli picchio", "ascoli calcio", "lecco", "calcio lecco", "sampdoria", "el verona", "hellas verona", "reggina", "l.r. vicenza", "vicenza", "reggina", "l.r. vicenza", "sudtirol", "fc sudtirol", "south tyrol", "southern tyrol"] },
  { key: "soccer_spain_segunda_division", sport: "Soccer", icon: "\u26bd", hints: ["segunda", "segunda division", "la liga 2", "spanish second division", "spanish second tier", "leganes", "leganes", "cd leganes", "espanyol", "rcd espanyol", "valladolid", "real valladolid", "tenerife", "cd tenerife", "oviedo", "real oviedo", "elche", "elche cf", "cartagena", "fc cartagena", "eibar", "sd eibar", "alaves", "deportivo alaves", "alav\u00e9s", "almeria", "ud almeria", "almer\u00eda", "levante", "levante ud", "gijon", "sporting gijon", "sporting de gijon", "las palmas", "ud las palmas", "borussia monchengladbach", "monchengladbach", "mirandas", "mirandas", "cd mirandas", "amorebieta", "sd amorebieta", "andorra", "fc andorra", "fc andorra", "alcorcon", "ad alcorcon", "alcorc\u00f3n", "leganes", "fuenlabrada", "cf fuenlabrada", "ponferradina", "sd ponferradina", "ponferradina", "castellon", "cd castellon", "castell\u00f3n", "zaragoza", "real zaragoza", "burgos", "burgos cf", "villarreal b", "villarreal cf b", "villarreal b", "albacete", "albacete balompie", "albacete", "racing santander", "racing de santander", "racing", "santander"] },
  { key: "soccer_uefa_champs_league", sport: "Soccer", icon: "\u26bd", hints: ["champions league", "ucl", "real madrid", "bayern", "bayern munich", "psg", "paris saint germain", "barcelona", "barca", "inter", "inter milan", "milan", "ac milan", "juventus", "juve", "atletico", "atletico madrid", "dortmund", "borussia dortmund", "napoli", "porto", "benfica", "atalanta", "leverkusen"] },
];

const REGION_SPORTS: Record<string, string[]> = {
  uk: ["soccer_epl", "soccer_efl_champ", "soccer_england_league1", "soccer_england_league2", "soccer_scotland_prem", "soccer_uefa_champs_league", "soccer_uefa_europa_league", "soccer_uefa_europa_conference_league", "soccer_england_efl_cup", "soccer_england_fa_cup", "soccer_spain_la_liga", "soccer_germany_bundesliga", "soccer_france_ligue_one", "soccer_germany_bundesliga2", "soccer_france_ligue2", "soccer_netherlands_eredivisie", "soccer_portugal_primeira_liga", "soccer_uefa_nations_league", "soccer_italy_serie_a", "soccer_italy_serie_b", "soccer_spain_segunda_division", ATP_SPORT_KEY, "rugby_league_super_league"],
  us: ["americanfootball_nfl", "basketball_nba", "baseball_mlb", "icehockey_nhl", "soccer_epl", "soccer_uefa_champs_league", "soccer_uefa_europa_league", "soccer_spain_la_liga", "soccer_germany_bundesliga", "soccer_france_ligue_one", "soccer_italy_serie_a", "soccer_uefa_nations_league", ATP_SPORT_KEY],
  it: ["soccer_italy_serie_a", "soccer_italy_serie_b", "soccer_uefa_champs_league", "soccer_uefa_europa_league", "soccer_uefa_europa_conference_league", "soccer_italy_coppa_italia", "soccer_spain_la_liga", "soccer_germany_bundesliga", "soccer_france_ligue_one", "soccer_epl", "soccer_uefa_nations_league", ATP_SPORT_KEY, "motorsport_f1"],
};

function getSportsForRegion(region: string): SportMapping[] {
  const keys = REGION_SPORTS[region] ?? Object.values(REGION_SPORTS).flat();
  const keySet = new Set(keys);
  return SPORT_MAP.filter((s) => keySet.has(s.key));
}

function getSportMetadata(sportKey: string): SportMapping {
  const configured = SPORT_MAP.find((sport) => sport.key === sportKey);
  if (configured) return configured;
  if (sportKey.startsWith("tennis_atp_")) return { key: sportKey, sport: "Tennis", icon: "\ud83c\udfbe", hints: [] };
  if (sportKey.startsWith("basketball")) return { key: sportKey, sport: "Basketball", icon: "\ud83c\udfc0", hints: [] };
  if (sportKey.startsWith("americanfootball")) return { key: sportKey, sport: "Football", icon: "\ud83c\udfc8", hints: [] };
  if (sportKey.startsWith("baseball")) return { key: sportKey, sport: "Baseball", icon: "\u26be", hints: [] };
  if (sportKey.startsWith("icehockey")) return { key: sportKey, sport: "Hockey", icon: "\ud83c\udfd2", hints: [] };
  return { key: sportKey, sport: "Soccer", icon: "\u26bd", hints: [] };
}

const CLASSIFIABLE_SPORT_KEYS = [...new Set(SPORT_MAP.map((sport) => sport.key))];
const CLASSIFIABLE_SPORT_KEY_SET = new Set(CLASSIFIABLE_SPORT_KEYS);
const QUERY_INTENTS = ["fixture", "team_market", "player_prop", "unknown"] as const;
const QUERY_MARKET_KEYS = [
  "unknown", "h2h", "totals", "spreads", "btts", "draw_no_bet", "double_chance", "correct_score", "to_qualify", "win_to_nil",
  "player_goal_scorer_anytime", "player_goal_scorer_first", "player_shots_on_target",
  "player_points", "player_rebounds", "player_assists", "player_threes",
  "player_pass_yds", "player_rush_yds", "player_receptions", "player_anytime_td", "player_1st_td",
  "batter_home_runs", "batter_hits", "pitcher_strikeouts", "player_goals",
] as const;
const QUERY_OUTCOMES = ["unspecified", "over", "under", "yes", "no", "home", "away", "draw", "score"] as const;

type QueryIntent = typeof QUERY_INTENTS[number];
type QueryMarketKey = typeof QUERY_MARKET_KEYS[number];
type QueryOutcome = typeof QUERY_OUTCOMES[number];

interface QueryInterpretation {
  sport_key: string;
  intent: QueryIntent;
  corrected_query: string;
  participant: string;
  team_hint: string;
  opponent_hint: string;
  market_key: QueryMarketKey;
  outcome: QueryOutcome;
  point: number;
  confidence: number;
}

interface QueryInterpretationResult {
  interpretation: QueryInterpretation | null;
  errorCode: string | null;
}

const QUERY_INTERPRETATION_SYSTEM_PROMPT = `You interpret plain-English sports-betting searches for a live-odds application.
Return only the required JSON object. Correct obvious spelling mistakes and common abbreviations without changing the user's intent.
Select sport_key from this allowlist: ${CLASSIFIABLE_SPORT_KEYS.join(", ")}.
Core mappings: NBA=basketball_nba; NFL=americanfootball_nfl; MLB=baseball_mlb; NHL=icehockey_nhl; ATP men's tennis=${ATP_SPORT_KEY}.
Treat "football" as association football for UK/IT context unless NFL teams, players, or American-football markets are present.

For a player request, put the player's most likely full canonical name in participant and their likely current team in team_hint. A surname or familiar short name is sufficient evidence when it is unambiguous in context. Preserve the player's identity when correcting a typo: never substitute a different player merely because they play for the same team or appear in the same fixture. Use opponent_hint only when an opponent is stated. These are search hints that will be validated against live data, so use an empty string rather than guessing when genuinely ambiguous.
Set intent to player_prop for player statistics or scoring, team_market for a requested team/match outcome, fixture when no outcome is requested, or unknown when unclear.
Map the requested market precisely: soccer "to score"=player_goal_scorer_anytime; first scorer=player_goal_scorer_first; shots on target=player_shots_on_target; NBA points/rebounds/assists/threes=their player_* key; NFL passing/rushing yards, receptions and touchdowns=their player_* key; MLB homer/hits/pitcher strikeouts=their batter_* or pitcher_* key; NHL to score=player_goals; match winner or moneyline=h2h; game total=totals; handicap=spreads.
For a threshold such as "25+ points" or "250+ yards", set outcome=over and point to the sportsbook line immediately below it (24.5 and 249.5 respectively). Use point=-1 when no numeric line is requested.
Examples: "saka to score" means Bukayo Saka, Arsenal, soccer_epl, player_goal_scorer_anytime, score, -1. "sakaa to scor" has the same interpretation. "gyokores score" means Viktor Gyökeres, Arsenal, soccer_epl, player_goal_scorer_anytime, score, -1; it must never be changed to another Arsenal player. "mahomes 250+ yds" means Patrick Mahomes, Kansas City Chiefs, americanfootball_nfl, player_pass_yds, over, 249.5. "lebron 25+ points" means LeBron James, Los Angeles Lakers, basketball_nba, player_points, over, 24.5. "ohtani homer" means Shohei Ohtani, Los Angeles Dodgers, baseball_mlb, batter_home_runs, over, 0.5. Never invent an event, opponent, price, or bookmaker.`;

interface OddsApiSport {
  key: string;
  group?: string;
  title?: string;
  active?: boolean;
  has_outrights?: boolean;
}

interface OpenAiResponsesPayload {
  output_text?: string;
  output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
}

let activeAtpCache: { expiresAt: number; sports: SportMapping[] } | null = null;
const queryInterpretationCache = new Map<string, { expiresAt: number; interpretation: QueryInterpretation }>();
let openAiUnavailableCache: { expiresAt: number; errorCode: string } | null = null;

function getResponseOutputText(payload: OpenAiResponsesPayload): string | null {
  if (typeof payload?.output_text === "string" && payload.output_text.trim()) return payload.output_text.trim();
  for (const item of payload?.output ?? []) {
    for (const content of item?.content ?? []) {
      if (content?.type === "output_text" && typeof content.text === "string") return content.text.trim();
    }
  }
  return null;
}

async function interpretQueryWithLlm(prediction: string, region: string): Promise<QueryInterpretationResult> {
  if (!OPENAI_API_KEY) return { interpretation: null, errorCode: "openai_not_configured" };
  if (!prediction.trim()) return { interpretation: null, errorCode: "empty_query" };
  const cacheKey = `${region.toLowerCase()}|${prediction.toLowerCase().trim()}`;
  const cached = queryInterpretationCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return { interpretation: cached.interpretation, errorCode: null };
  if (cached) queryInterpretationCache.delete(cacheKey);
  if (openAiUnavailableCache && openAiUnavailableCache.expiresAt > Date.now()) {
    return { interpretation: null, errorCode: openAiUnavailableCache.errorCode };
  }
  if (openAiUnavailableCache) openAiUnavailableCache = null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: SEARCH_INTERPRETER_MODEL,
        instructions: QUERY_INTERPRETATION_SYSTEM_PROMPT,
        input: `Region: ${region}\nQuery: ${prediction}`,
        max_output_tokens: 260,
        text: {
          format: {
            type: "json_schema",
            name: "betting_query_interpretation",
            strict: true,
            schema: {
              type: "object",
              properties: {
                sport_key: { type: "string", enum: CLASSIFIABLE_SPORT_KEYS },
                intent: { type: "string", enum: QUERY_INTENTS },
                corrected_query: { type: "string" },
                participant: { type: "string" },
                team_hint: { type: "string" },
                opponent_hint: { type: "string" },
                market_key: { type: "string", enum: QUERY_MARKET_KEYS },
                outcome: { type: "string", enum: QUERY_OUTCOMES },
                point: { type: "number" },
                confidence: { type: "number", minimum: 0, maximum: 1 },
              },
              required: ["sport_key", "intent", "corrected_query", "participant", "team_hint", "opponent_hint", "market_key", "outcome", "point", "confidence"],
              additionalProperties: false,
            },
          },
        },
      }),
    });
    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({})) as { error?: { code?: string; type?: string } };
      const apiCode = normalizeSearchValue(errorPayload?.error?.code ?? errorPayload?.error?.type ?? "api_error").replace(/ /g, "_");
      const errorCode = `openai_http_${response.status}_${apiCode}`;
      if (response.status === 429) {
        openAiUnavailableCache = { expiresAt: Date.now() + (apiCode === "insufficient_quota" ? 5 * 60_000 : 15_000), errorCode };
      }
      console.error(`QUERY INTERPRETER ERROR: status=${response.status} code=${apiCode}`);
      return { interpretation: null, errorCode };
    }
    const payload = await response.json() as OpenAiResponsesPayload;
    const outputText = getResponseOutputText(payload);
    if (!outputText) return { interpretation: null, errorCode: "openai_empty_output" };
    const parsed = JSON.parse(outputText) as QueryInterpretation;
    if (!parsed?.sport_key || !CLASSIFIABLE_SPORT_KEY_SET.has(parsed.sport_key)) return { interpretation: null, errorCode: "openai_invalid_sport" };
    if (!QUERY_INTENTS.includes(parsed.intent) || !QUERY_MARKET_KEYS.includes(parsed.market_key) || !QUERY_OUTCOMES.includes(parsed.outcome)) return { interpretation: null, errorCode: "openai_invalid_output" };

    const interpretation: QueryInterpretation = {
      sport_key: parsed.sport_key,
      intent: parsed.intent,
      corrected_query: typeof parsed.corrected_query === "string" ? parsed.corrected_query.trim().slice(0, 300) : prediction.trim(),
      participant: typeof parsed.participant === "string" ? parsed.participant.trim().slice(0, 100) : "",
      team_hint: typeof parsed.team_hint === "string" ? parsed.team_hint.trim().slice(0, 100) : "",
      opponent_hint: typeof parsed.opponent_hint === "string" ? parsed.opponent_hint.trim().slice(0, 100) : "",
      market_key: parsed.market_key,
      outcome: parsed.outcome,
      point: Number.isFinite(parsed.point) ? parsed.point : -1,
      confidence: Number.isFinite(parsed.confidence) ? Math.min(1, Math.max(0, parsed.confidence)) : 0,
    };
    if (interpretation.intent === "player_prop") {
      const enteredParticipant = extractPlayerParticipantText(prediction);
      if (enteredParticipant && interpretation.participant && !playerNamesReferToSameEntity(enteredParticipant, interpretation.participant)) {
        console.warn(`QUERY INTERPRETER REJECTED PLAYER SUBSTITUTION: entered=${enteredParticipant} interpreted=${interpretation.participant}`);
        return { interpretation: null, errorCode: "openai_player_identity_mismatch" };
      }
    }
    if (queryInterpretationCache.size >= 200) {
      const oldestKey = queryInterpretationCache.keys().next().value;
      if (oldestKey) queryInterpretationCache.delete(oldestKey);
    }
    queryInterpretationCache.set(cacheKey, { expiresAt: Date.now() + QUERY_INTERPRETATION_CACHE_TTL_MS, interpretation });
    return { interpretation, errorCode: null };
  } catch (err) {
    console.error("QUERY INTERPRETER ERROR:", err instanceof Error ? err.message : "Unknown interpreter error");
    const errorCode = err instanceof DOMException && err.name === "AbortError" ? "openai_timeout" : "openai_response_error";
    return { interpretation: null, errorCode };
  } finally {
    clearTimeout(timeoutId);
  }
}

function getHintMatchedSports(text: string): SportMapping[] {
  const scored = SPORT_MAP.map((sport) => ({
    sport,
    score: Math.max(0, ...(sport.hints ?? []).filter((hint) => text.includes(hint)).map((hint) => hint.length)),
  })).filter(({ score }) => score > 0);
  if (scored.length === 0) return [];
  const bestScore = Math.max(...scored.map(({ score }) => score));
  const seen = new Set<string>();
  return scored
    .filter(({ score }) => score === bestScore)
    .map(({ sport }) => sport)
    .filter((sport) => {
      if (seen.has(sport.key)) return false;
      seen.add(sport.key);
      return true;
    });
}

async function getActiveAtpSports(): Promise<SportMapping[]> {
  if (activeAtpCache && activeAtpCache.expiresAt > Date.now()) return activeAtpCache.sports;
  try {
    const response = await fetch(`${ODDS_API_BASE}/sports/?apiKey=${API_KEY}`);
    if (!response.ok) {
      console.error(`ATP SPORT DISCOVERY ERROR: status=${response.status}`);
      return [];
    }
    const data = await response.json().catch(() => []) as OddsApiSport[];
    const sports = (Array.isArray(data) ? data : [])
      .filter((sport) => sport?.active !== false && !sport?.has_outrights && sport?.key?.startsWith("tennis_atp_"))
      .map((sport) => ({ key: sport.key, sport: "Tennis", icon: "\ud83c\udfbe", hints: [] }))
      .slice(0, 4);
    activeAtpCache = { expiresAt: Date.now() + 10 * 60 * 1000, sports };
    return sports;
  } catch (err) {
    console.error("ATP SPORT DISCOVERY ERROR:", err instanceof Error ? err.message : "Unknown discovery error");
    return [];
  }
}

async function expandDynamicSports(sports: SportMapping[]): Promise<SportMapping[]> {
  const expanded: SportMapping[] = [];
  for (const sport of sports) {
    if (sport.key === ATP_SPORT_KEY) expanded.push(...await getActiveAtpSports());
    else expanded.push(sport);
  }
  const seen = new Set<string>();
  return expanded.filter((sport) => {
    if (seen.has(sport.key)) return false;
    seen.add(sport.key);
    return true;
  });
}

function hasExplicitSoccerCompetition(text: string): boolean {
  return /\b(premier league|epl|champions league|ucl|europa|conference league|fa cup|efl cup|carabao|serie a|coppa italia|la liga|copa del rey|bundesliga|ligue 1|eredivisie|primeira liga|friendly|friendlies)\b/i.test(text);
}

function getRelatedPlayerSports(classified: SportMapping, text: string): SportMapping[] {
  if (!classified.key.startsWith("soccer") || hasExplicitSoccerCompetition(text)) return [classified];
  const relatedKeys = [classified.key, "soccer_uefa_champs_league", "soccer_uefa_europa_league", "soccer_uefa_europa_conference_league", "soccer_club_friendlies"];
  if (classified.key === "soccer_epl") relatedKeys.push("soccer_england_fa_cup", "soccer_england_efl_cup");
  if (classified.key === "soccer_italy_serie_a") relatedKeys.push("soccer_italy_coppa_italia");
  if (classified.key === "soccer_spain_la_liga") relatedKeys.push("soccer_spain_copa_del_rey");
  return [...new Set(relatedKeys)].map(getSportMetadata);
}

async function getSportsForPrediction(text: string, region: string, interpretation: QueryInterpretation | null): Promise<SportMapping[]> {
  const llmSportKey = interpretation?.sport_key;
  if (llmSportKey) {
    const classified = SPORT_MAP.find((sport) => sport.key === llmSportKey);
    if (classified) {
      const sports = interpretation?.intent === "player_prop" ? getRelatedPlayerSports(classified, text) : [classified];
      return expandDynamicSports(sports);
    }
  }
  const hintMatches = getHintMatchedSports(text);
  return expandDynamicSports(hintMatches.length > 0 ? hintMatches : getSportsForRegion(region));
}

const TEAM_ALIASES: Record<string, string[]> = {
  "manchester united": ["man utd", "man united"],
  "manchester city": ["man city"],
  "tottenham hotspur": ["spurs", "tottenham"],
  "real madrid": ["real"],
  "barcelona": ["barca"],
  "paris saint germain": ["psg", "paris saint-germain"],
  "bayern munich": ["bayern"],
  "juventus": ["juve"],
  "new england patriots": ["pats", "patriots"],
  "kansas city chiefs": ["chiefs"],
  "buffalo bills": ["bills"],
  "dallas cowboys": ["cowboys"],
  "philadelphia eagles": ["eagles"],
  "green bay packers": ["packers"],
  "san francisco 49ers": ["49ers"],
  "baltimore ravens": ["ravens"],
  "cincinnati bengals": ["bengals"],
  "detroit lions": ["lions"],
  "new york jets": ["jets"],
  "miami dolphins": ["dolphins"],
  "seattle seahawks": ["seahawks", "seattle"],
  "atlanta falcons": ["falcons", "atlanta"],
  "los angeles rams": ["rams"],
  "pittsburgh steelers": ["steelers"],
  "indianapolis colts": ["colts"],
  "houston texans": ["texans"],
  "carolina panthers": ["panthers"],
  "chicago bears": ["bears"],
  "tampa bay buccaneers": ["buccaneers", "bucs"],
  "jacksonville jaguars": ["jaguars"],
  "cleveland browns": ["browns"],
  "new orleans saints": ["saints"],
  "tennessee titans": ["titans"],
  "minnesota vikings": ["vikings"],
  "los angeles chargers": ["chargers"],
  "las vegas raiders": ["raiders"],
  "denver broncos": ["broncos"],
  "washington commanders": ["commanders"],
  "arizona cardinals": ["cardinals"],
  "new york yankees": ["yankees"],
  "boston red sox": ["red sox"],
  "los angeles dodgers": ["dodgers"],
  "san diego padres": ["padres"],
  "houston astros": ["astros"],
  "atlanta braves": ["braves", "atlanta"],
  "chicago cubs": ["cubs"],
  "new york mets": ["mets"],
  "philadelphia phillies": ["phillies"],
  "milwaukee brewers": ["brewers"],
  "pittsburgh pirates": ["pirates"],
  "st louis cardinals": ["cardinals"],
  "cincinnati reds": ["reds"],
  "san francisco giants": ["giants"],
  "colorado rockies": ["rockies"],
  "arizona diamondbacks": ["diamondbacks", "dbacks"],
  "tampa bay rays": ["rays"],
  "minnesota twins": ["twins"],
  "chicago white sox": ["white sox"],
  "cleveland guardians": ["guardians"],
  "detroit tigers": ["tigers"],
  "kansas city royals": ["royals"],
  "los angeles angels": ["angels"],
  "oakland athletics": ["athletics", "a's"],
  "seattle mariners": ["mariners", "seattle"],
  "texas rangers": ["rangers"],
  "washington nationals": ["nationals"],
  "baltimore orioles": ["orioles"],
  "toronto blue jays": ["blue jays"],
  "miami marlins": ["marlins"],
  "los angeles lakers": ["lakers"],
  "boston celtics": ["celtics"],
  "golden state warriors": ["warriors"],
  "chicago bulls": ["bulls"],
  "new york knicks": ["knicks"],
  "la clippers": ["clippers"],
  "denver nuggets": ["nuggets"],
  "milwaukee bucks": ["bucks"],
  "miami heat": ["heat"],
  "phoenix suns": ["suns"],
  "philadelphia 76ers": ["76ers", "sixers"],
  "dallas mavericks": ["mavericks"],
  "houston rockets": ["rockets"],
  "san antonio spurs": ["spurs"],
  "new orleans pelicans": ["pelicans"],
  "memphis grizzlies": ["grizzlies"],
  "oklahoma city thunder": ["thunder"],
  "minnesota timberwolves": ["timberwolves"],
  "sacramento kings": ["kings"],
  "orlando magic": ["magic"],
  "charlotte hornets": ["hornets"],
  "indiana pacers": ["pacers"],
  "cleveland cavaliers": ["cavaliers"],
  "detroit pistons": ["pistons"],
  "toronto raptors": ["raptors"],
  "brooklyn nets": ["nets"],
  "atlanta hawks": ["hawks", "atlanta"],
  "utah jazz": ["jazz"],
  "portland trail blazers": ["trail blazers"],
  "washington wizards": ["wizards"],
  "new york rangers": ["rangers"],
  "boston bruins": ["bruins"],
  "toronto maple leafs": ["maple leafs"],
  "edmonton oilers": ["oilers"],
  "colorado avalanche": ["avalanche"],
  "pittsburgh penguins": ["penguins"],
  "florida panthers": ["panthers"],
  "dallas stars": ["stars"],
  "new jersey devils": ["devils"],
  "new york islanders": ["islanders"],
  "seattle kraken": ["kraken"],
  "buffalo sabres": ["sabres"],
  "montreal canadiens": ["canadiens"],
  "ottawa senators": ["senators"],
  "winnipeg jets": ["jets"],
  "calgary flames": ["flames"],
  "vancouver canucks": ["canucks"],
  "san jose sharks": ["sharks"],
  "los angeles kings": ["kings"],
  "anaheim ducks": ["ducks"],
  "arizona coyotes": ["coyotes"],
  "minnesota wild": ["wild"],
  "nashville predators": ["predators"],
  "chicago blackhawks": ["blackhawks"],
  "detroit red wings": ["red wings"],
  "columbus blue jackets": ["blue jackets"],
  "philadelphia flyers": ["flyers"],
  "washington capitals": ["capitals"],
  "carolina hurricanes": ["hurricanes"],
  "tampa bay lightning": ["lightning"],
  "vegas golden knights": ["golden knights", "knights"],
};

const SEARCH_STOPWORDS = new Set([
  "a", "an", "and", "at", "away", "bet", "both", "by", "draw", "first", "for", "game", "goal", "goals", "home", "in", "match", "moneyline", "of", "on", "or", "over", "player", "points", "score", "scorer", "the", "to", "under", "win", "with", "yards",
]);
const ENTITY_SUFFIXES = new Set(["afc", "bc", "cf", "fc", "hc", "sc"]);

function normalizeSearchValue(value: string): string {
  return (value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshteinSimilarity(left: string, right: string): number {
  if (left === right) return 1;
  if (!left || !right) return 0;
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  const current = new Array<number>(right.length + 1);
  for (let i = 1; i <= left.length; i += 1) {
    current[0] = i;
    for (let j = 1; j <= right.length; j += 1) {
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + (left[i - 1] === right[j - 1] ? 0 : 1),
      );
    }
    for (let j = 0; j <= right.length; j += 1) previous[j] = current[j];
  }
  return 1 - previous[right.length] / Math.max(left.length, right.length);
}

function getEntityNames(entity: string): string[] {
  const normalizedEntity = normalizeSearchValue(entity);
  const names = new Set<string>([normalizedEntity]);
  for (const [canonical, aliases] of Object.entries(TEAM_ALIASES)) {
    const normalizedCanonical = normalizeSearchValue(canonical);
    const normalizedAliases = aliases.map(normalizeSearchValue);
    if (normalizedEntity === normalizedCanonical || normalizedAliases.includes(normalizedEntity)) {
      names.add(normalizedCanonical);
      normalizedAliases.forEach((alias) => names.add(alias));
    }
  }
  return [...names].filter(Boolean);
}

function entitySimilarity(text: string, entity: string): number {
  const normalizedText = normalizeSearchValue(text);
  if (!normalizedText || !entity) return 0;
  const queryTokens = normalizedText.split(" ").filter((token) => token.length > 1 && !SEARCH_STOPWORDS.has(token));
  let best = 0;

  for (const name of getEntityNames(entity)) {
    if (` ${normalizedText} `.includes(` ${name} `)) return 1;
    const entityTokens = name.split(" ").filter((token) => token.length > 1 && !ENTITY_SUFFIXES.has(token));
    if (entityTokens.length === 0 || queryTokens.length === 0) continue;
    const tokenScores = entityTokens.map((entityToken) => Math.max(
      ...queryTokens.map((queryToken) => {
        if (entityToken === queryToken) return 1;
        if (Math.min(entityToken.length, queryToken.length) < 4) return 0;
        return levenshteinSimilarity(entityToken, queryToken);
      }),
    ));
    const strongScores = tokenScores.filter((score) => score >= 0.78);
    const coverage = strongScores.length / entityTokens.length;
    const average = strongScores.length > 0 ? strongScores.reduce((sum, score) => sum + score, 0) / entityTokens.length : 0;
    const singleDistinctiveToken = entityTokens.length > 1 && strongScores.some((score) => score >= 0.88) ? 0.84 : 0;
    best = Math.max(best, coverage >= 0.6 ? average : singleDistinctiveToken);
  }
  return best;
}

function namesReferToSameEntity(left: string, right: string): boolean {
  return Math.max(entitySimilarity(left, right), entitySimilarity(right, left)) >= 0.82;
}

interface PlayerSearchHint {
  participant: string;
  aliases: string[];
  team: string;
  sportKey: string;
}

// Resilience only: these hints locate a live event when the LLM is unavailable.
// They never supply fixtures, markets, operators, or prices; every hint is validated against The Odds API.
const PLAYER_SEARCH_HINTS: PlayerSearchHint[] = [
  { participant: "Bukayo Saka", aliases: ["saka", "bukayo saka"], team: "Arsenal", sportKey: "soccer_epl" },
  { participant: "Viktor Gyökeres", aliases: ["gyokeres", "gyökeres", "viktor gyokeres", "viktor gyökeres"], team: "Arsenal", sportKey: "soccer_epl" },
  { participant: "Erling Haaland", aliases: ["haaland", "erling haaland"], team: "Manchester City", sportKey: "soccer_epl" },
  { participant: "Mohamed Salah", aliases: ["salah", "mo salah", "mohamed salah"], team: "Liverpool", sportKey: "soccer_epl" },
  { participant: "Cole Palmer", aliases: ["palmer", "cole palmer"], team: "Chelsea", sportKey: "soccer_epl" },
  { participant: "Kylian Mbappe", aliases: ["mbappe", "kylian mbappe"], team: "Real Madrid", sportKey: "soccer_spain_la_liga" },
  { participant: "LeBron James", aliases: ["lebron", "lebron james"], team: "Los Angeles Lakers", sportKey: "basketball_nba" },
  { participant: "Stephen Curry", aliases: ["curry", "steph curry", "stephen curry"], team: "Golden State Warriors", sportKey: "basketball_nba" },
  { participant: "Nikola Jokic", aliases: ["jokic", "nikola jokic"], team: "Denver Nuggets", sportKey: "basketball_nba" },
  { participant: "Patrick Mahomes", aliases: ["mahomes", "patrick mahomes"], team: "Kansas City Chiefs", sportKey: "americanfootball_nfl" },
  { participant: "Josh Allen", aliases: ["josh allen"], team: "Buffalo Bills", sportKey: "americanfootball_nfl" },
  { participant: "Lamar Jackson", aliases: ["lamar", "lamar jackson"], team: "Baltimore Ravens", sportKey: "americanfootball_nfl" },
  { participant: "Shohei Ohtani", aliases: ["ohtani", "shohei ohtani"], team: "Los Angeles Dodgers", sportKey: "baseball_mlb" },
  { participant: "Aaron Judge", aliases: ["judge", "aaron judge"], team: "New York Yankees", sportKey: "baseball_mlb" },
  { participant: "Juan Soto", aliases: ["soto", "juan soto"], team: "New York Mets", sportKey: "baseball_mlb" },
  { participant: "Connor McDavid", aliases: ["mcdavid", "connor mcdavid"], team: "Edmonton Oilers", sportKey: "icehockey_nhl" },
  { participant: "Auston Matthews", aliases: ["matthews", "auston matthews"], team: "Toronto Maple Leafs", sportKey: "icehockey_nhl" },
  { participant: "Nathan MacKinnon", aliases: ["mackinnon", "nathan mackinnon"], team: "Colorado Avalanche", sportKey: "icehockey_nhl" },
];

function getPlayerSearchHint(prediction: string): PlayerSearchHint | null {
  const participantText = extractPlayerParticipantText(prediction);
  return participantText ? findUnambiguousPlayerHint(participantText, PLAYER_SEARCH_HINTS) : null;
}

function applyValidatedPlayerRoutingHint(
  interpretation: QueryInterpretation,
  prediction: string,
): QueryInterpretation {
  if (interpretation.intent !== "player_prop") return interpretation;
  const hint = getPlayerSearchHint(prediction);
  if (!hint) return interpretation;
  return {
    ...interpretation,
    participant: hint.participant,
    team_hint: hint.team,
    sport_key: hint.sportKey,
    confidence: Math.max(interpretation.confidence, 0.82),
  };
}

function titleCaseName(value: string): string {
  return normalizeSearchValue(value).replace(/\b\w/g, (character) => character.toUpperCase());
}

function inferQueryWithoutLlm(prediction: string, region: string): QueryInterpretation | null {
  const normalized = normalizeSearchValue(prediction);
  if (!normalized) return null;

  let sportKey = region === "us" ? "basketball_nba" : "soccer_epl";
  let marketKey: QueryMarketKey = "unknown";
  let outcome: QueryOutcome = "unspecified";
  let point = -1;
  const thresholdMatch = normalized.match(/\b(\d+(?:\.\d+)?)\s*(?:plus)?\b/);
  const threshold = thresholdMatch ? Number.parseFloat(thresholdMatch[1]) : null;

  if (/\b(home run|homer|hr|go deep)\b/.test(normalized)) { sportKey = "baseball_mlb"; marketKey = "batter_home_runs"; outcome = "over"; point = 0.5; }
  else if (/\b(strikeouts?|ks)\b/.test(normalized)) { sportKey = "baseball_mlb"; marketKey = "pitcher_strikeouts"; outcome = "over"; }
  else if (/\bhits?\b/.test(normalized) && threshold !== null) { sportKey = "baseball_mlb"; marketKey = "batter_hits"; outcome = "over"; }
  else if (/\b(rush(?:ing)? yards?)\b/.test(normalized)) { sportKey = "americanfootball_nfl"; marketKey = "player_rush_yds"; outcome = "over"; }
  else if (/\b(pass(?:ing)? yards?|yds?)\b/.test(normalized)) { sportKey = "americanfootball_nfl"; marketKey = "player_pass_yds"; outcome = "over"; }
  else if (/\b(receptions?|catches)\b/.test(normalized)) { sportKey = "americanfootball_nfl"; marketKey = "player_receptions"; outcome = "over"; }
  else if (/\b(first td|first touchdown)\b/.test(normalized)) { sportKey = "americanfootball_nfl"; marketKey = "player_1st_td"; outcome = "score"; }
  else if (/\b(td|touchdown)\b/.test(normalized)) { sportKey = "americanfootball_nfl"; marketKey = "player_anytime_td"; outcome = "score"; }
  else if (/\brebounds?\b/.test(normalized)) { sportKey = "basketball_nba"; marketKey = "player_rebounds"; outcome = "over"; }
  else if (/\bassists?\b/.test(normalized)) { sportKey = "basketball_nba"; marketKey = "player_assists"; outcome = "over"; }
  else if (/\b(threes?|3 pointers?|3pt)\b/.test(normalized)) { sportKey = "basketball_nba"; marketKey = "player_threes"; outcome = "over"; }
  else if (/\b(points?|pts)\b/.test(normalized)) { sportKey = "basketball_nba"; marketKey = "player_points"; outcome = "over"; }
  else if (/\b(first goal|first scorer|score first)\b/.test(normalized)) { marketKey = "player_goal_scorer_first"; outcome = "score"; }
  else if (/\b((?:to\s+)?scor\w*|anytime(?:\s+goal)?|goal ?scor\w*)\b/.test(normalized)) { marketKey = "player_goal_scorer_anytime"; outcome = "score"; }
  else if (/\b(shots? on target|sot)\b/.test(normalized)) { marketKey = "player_shots_on_target"; outcome = "over"; }
  else return null;

  if (threshold !== null && point < 0 && outcome === "over") point = Math.max(0.5, threshold - 0.5);

  const participantText = extractPlayerParticipantText(prediction);
  if (!participantText) return null;

  const matchedHint = findUnambiguousPlayerHint(participantText, PLAYER_SEARCH_HINTS);

  const participant = matchedHint?.participant ?? titleCaseName(participantText);
  const teamHint = matchedHint?.team ?? "";
  if (matchedHint) sportKey = matchedHint.sportKey;
  if (sportKey === "icehockey_nhl" && (marketKey === "player_goal_scorer_anytime" || marketKey === "player_goal_scorer_first")) {
    marketKey = "player_goals";
    outcome = "over";
    point = point >= 0 ? point : 0.5;
  }

  return {
    sport_key: sportKey,
    intent: "player_prop",
    corrected_query: `${participant} ${normalized.slice(participantText.length).trim()}`.trim(),
    participant,
    team_hint: teamHint,
    opponent_hint: "",
    market_key: marketKey,
    outcome,
    point,
    confidence: matchedHint ? 0.76 : 0.52,
  };
}

interface OddsApiOutcome { name: string; description?: string; price: number; point?: number; link?: string; sid?: string | number | null; }
interface OddsApiMarket { key: string; outcomes: OddsApiOutcome[]; description?: string; link?: string; sid?: string | number | null; }
interface OddsApiBookmaker { key: string; title: string; link?: string; sid?: string | number | null; markets: OddsApiMarket[]; }
interface OddsApiEventOdds { id: string; sport_key: string; commence_time: string; home_team: string; away_team: string; bookmakers: OddsApiBookmaker[]; }
interface OddsApiEventMarketIndex { bookmakers?: Array<{ markets?: Array<{ key?: string }> }>; }

const eventMarketKeysCache = new Map<string, { expiresAt: number; keys: string[] }>();
const eventOddsCache = new Map<string, { expiresAt: number; event: OddsApiEventOdds }>();
const sportEventsCache = new Map<string, { expiresAt: number; events: OddsApiEventOdds[] }>();

interface Leg { id: string; selection: string; market: string; marketApiKey?: string; point?: number; outcomeName?: string; odds: number; result: string; features: string[]; prevOdds?: number; }
interface MarketOption { market: string; label: string; outcomes: { name: string; price: number; point?: number }[]; apiKey?: string; }
interface OperatorOffer { key: string; name: string; available: boolean; combinedOdds: number | null; deepLink: string; missingLegs: string[]; }
interface CandidateFixture { eventId: string; match: string; sportKey: string; sport: string; sportIcon: string; competition: string; kickoff: string; }
interface BookmakerOutcome { name: string; description?: string; price: number; point?: number; link?: string; sid?: string | number | null; }
interface BookmakerMarket { key: string; outcomes: BookmakerOutcome[]; link?: string; sid?: string | number | null; }
interface BookmakerOdds { key: string; name: string; markets: BookmakerMarket[]; link?: string; sid?: string | number | null; }
interface SlipResponse {
  match: string; sport: string; sportIcon: string; competition: string; kickoff: string; isSingleMatch: boolean;
  legs: Leg[]; totalOdds: number; stake: number; potentialReturn: number; probability: number;
  variance: "Low" | "Moderate" | "High"; safetyMessage: string; operators: OperatorOffer[]; systemNotices: string[];
  source: "live" | "fixture-markets" | "disambiguation"; marketOptions?: MarketOption[];
  bookmakerOdds?: BookmakerOdds[]; candidateFixtures?: CandidateFixture[]; eventId?: string; sportKey?: string;
}

const OPERATOR_NAMES: Record<string, string> = {
  paddypower: "Paddy Power", skybet: "Sky Bet", betfair_sb_uk: "Betfair", betfair_ex_uk: "Betfair Exchange",
  fanduel: "FanDuel", draftkings: "DraftKings", codere_it: "Codere", unibet_it: "Unibet",
  betfair_ex_eu: "Betfair Exchange", williamhill: "William Hill", coral: "Coral", "ladbrokes_uk": "Ladbrokes", betvictor: "BetVictor",
};

const REGION_BOOKMAKERS: Record<string, { regions: string; bookmakers: string[] }> = {
  uk: { regions: "uk", bookmakers: ["paddypower", "skybet", "betfair_sb_uk", "betfair_ex_uk", "williamhill", "coral", "ladbrokes_uk", "betvictor"] },
  us: { regions: "us", bookmakers: ["fanduel", "draftkings"] },
  it: { regions: "eu", bookmakers: ["codere_it", "unibet_it", "betfair_ex_eu"] },
};

const UNLISTED_NOTICE = "System Notice: Live odds for this specific matchup are currently unlisted or undergoing line updates by licensed operators. Please try selecting another active fixture.";

function getBookmakerSportPath(sportKey: string): string {
  if (sportKey.startsWith("americanfootball")) return "american-football";
  if (sportKey.startsWith("basketball")) return "basketball";
  if (sportKey.startsWith("baseball")) return "baseball";
  if (sportKey.startsWith("icehockey")) return "ice-hockey";
  if (sportKey.startsWith("tennis")) return "tennis";
  return "football";
}

function buildDeepLink(operatorKey: string, eventId: string, sportKey: string, region?: string): string {
  const sportPath = getBookmakerSportPath(sportKey);
  const encodedEventId = encodeURIComponent(eventId);
  switch (operatorKey) {
    case "paddypower": return `https://www.paddypower.com/${sportPath}?eventId=${encodedEventId}`;
    case "skybet": return `https://www.skybet.com/${sportPath}?eventId=${encodedEventId}`;
    case "betfair_sb_uk": return region === "it" ? `https://www.betfair.it/sport/${sportPath}/event?eventId=${encodedEventId}` : `https://www.betfair.com/sport/${sportPath}/event?eventId=${encodedEventId}`;
    case "betfair_ex_uk": return `https://www.betfair.com/exchange/plus/${sportPath}/event?eventId=${encodedEventId}`;
    case "fanduel": return `https://sportsbook.fanduel.com/navigation/${sportPath}?event=${encodedEventId}`;
    case "draftkings": return `https://sportsbook.draftkings.com/sitesearch?search=${encodedEventId}`;
    case "betfair_ex_eu": return `https://www.betfair.it/exchange/plus/${sportPath}/event?eventId=${encodedEventId}`;
    case "williamhill": return `https://www.williamhill.com/${sportPath}?eventId=${encodedEventId}`;
    case "coral": return `https://www.coral.co.uk/${sportPath}?eventId=${encodedEventId}`;
    case "ladbrokes_uk": return `https://www.ladbrokes.com/${sportPath}?eventId=${encodedEventId}`;
    case "betvictor": return `https://www.betvictor.com/${sportPath}?eventId=${encodedEventId}`;
    default: return "";
  }
}

function appendSourceIds(
  link: string,
  ids: { eventSid?: string | number | null; marketSid?: string | number | null; selectionSid?: string | number | null },
): string {
  if (!link) return "";
  try {
    const url = new URL(link);
    if (ids.eventSid != null && !url.searchParams.has("eventId")) url.searchParams.set("eventId", String(ids.eventSid));
    if (ids.marketSid != null && !url.searchParams.has("marketId")) url.searchParams.set("marketId", String(ids.marketSid));
    if (ids.selectionSid != null && !url.searchParams.has("selectionId") && !url.searchParams.has("outcomeId")) {
      url.searchParams.set("selectionId", String(ids.selectionSid));
    }
    return url.toString();
  } catch {
    return link;
  }
}

function findBookmakerSelection(
  bookmaker: OddsApiBookmaker,
  leg: Leg,
): { market: OddsApiMarket; outcome: OddsApiOutcome } | null {
  const exactMarketKey = leg.marketApiKey;
  const compatibleKeys = exactMarketKey
    ? Object.values(MARKET_LABEL_TO_API_KEYS).filter((keys) => keys.includes(exactMarketKey)).flat()
    : resolveMarketApiKeys(leg.market);
  const allowedMarketKeys = [...new Set(exactMarketKey ? [exactMarketKey, ...compatibleKeys] : compatibleKeys)];
  const requestedOutcome = normalizeSearchValue(leg.outcomeName ?? "");
  let bestMatch: { market: OddsApiMarket; outcome: OddsApiOutcome; score: number } | null = null;

  for (const market of bookmaker.markets ?? []) {
    if (allowedMarketKeys.length > 0 && !allowedMarketKeys.includes(market.key)) continue;
    for (const outcome of market.outcomes ?? []) {
      if (!outcome?.name || !outcome?.price || outcome.price <= 0) continue;
      const pointDistance = leg.point !== undefined && outcome.point !== undefined ? Math.abs(outcome.point - leg.point) : 0;
      if (leg.point !== undefined && (outcome.point === undefined || pointDistance > 0.51)) continue;
      if (requestedOutcome && requestedOutcome !== "unspecified" && requestedOutcome !== "score") {
        const offeredOutcome = normalizeSearchValue(outcome.name);
        if (offeredOutcome !== requestedOutcome && !offeredOutcome.startsWith(`${requestedOutcome} `)) continue;
      }
      const candidateNames = [outcome.name, outcome.description]
        .filter((value): value is string => Boolean(value))
        .map((value) => Math.max(entitySimilarity(leg.selection, value), entitySimilarity(value, leg.selection)));
      const nameScore = Math.max(0, ...candidateNames);
      if (nameScore < 0.82) continue;
      const score = nameScore * 100 + (market.key === exactMarketKey ? 20 : 10) + (leg.point !== undefined ? Math.max(0, 10 - pointDistance * 10) : 0);
      if (!bestMatch || score > bestMatch.score) bestMatch = { market, outcome, score };
    }
  }
  return bestMatch ? { market: bestMatch.market, outcome: bestMatch.outcome } : null;
}

function getNativeBookmakerLink(bookmaker: OddsApiBookmaker | undefined, legs: Leg[]): string | null {
  if (!bookmaker) return null;
  if (legs.length === 1) {
    const selection = findBookmakerSelection(bookmaker, legs[0]);
    const market = selection?.market;
    const outcome = selection?.outcome;
    const deepestLink = outcome?.link ?? market?.link ?? bookmaker.link;
    if (deepestLink) return appendSourceIds(deepestLink, { eventSid: bookmaker.sid, marketSid: market?.sid, selectionSid: outcome?.sid });
  }
  const eventLink = bookmaker.link ?? (bookmaker.markets ?? []).find((market) => market?.link)?.link;
  return eventLink ? appendSourceIds(eventLink, { eventSid: bookmaker.sid }) : null;
}

function detectFeatures(selection: string, market: string, operatorKey: string): string[] {
  const features: string[] = [];
  const lower = (selection + " " + market).toLowerCase();
  if (operatorKey === "paddypower" && (lower.includes("player") || lower.includes("props") || lower.includes("anytime") || lower.includes("score"))) { features.push("super_sub"); }
  return features;
}

function resolveAlias(name: string): string {
  const lower = normalizeSearchValue(name);
  for (const [canonical, aliases] of Object.entries(TEAM_ALIASES)) {
    if (lower === normalizeSearchValue(canonical)) return normalizeSearchValue(canonical);
    if ((aliases || []).some((a) => lower === normalizeSearchValue(a))) return normalizeSearchValue(canonical);
  }
  return lower;
}

function textMatchesTeam(text: string, teamName: string): boolean {
  return Boolean(teamName) && entitySimilarity(text, teamName) >= 0.82;
}

function unwrapOdds(data: unknown): OddsApiEventOdds[] {
  if (Array.isArray(data)) return data as OddsApiEventOdds[];
  const obj = data as { data?: OddsApiEventOdds[] };
  if (obj?.data && Array.isArray(obj.data)) return obj.data;
  return [];
}

function americanToDecimal(american: number): number {
  if (!american || american === 0) return 0;
  if (american > 0) return 1 + american / 100;
  return 1 + 100 / Math.abs(american);
}

function convertOddsToDecimal(events: OddsApiEventOdds[]): OddsApiEventOdds[] {
  for (const event of events) { for (const bookmaker of event.bookmakers ?? []) { for (const market of bookmaker.markets ?? []) { for (const outcome of market.outcomes ?? []) { if (typeof outcome.price === "number" && outcome.price !== 0) { outcome.price = americanToDecimal(outcome.price); } } } } }
  return events;
}

function isFixtureOnlyPrompt(text: string, event: OddsApiEventOdds): boolean {
  if (!event?.home_team || !event?.away_team) return false;
  const hasOutcome = /\b(to win|to beat|moneyline|\bml\b|match odds|1x2|h2h|over|under|btts|both teams to score|goal goal|\bgg\b|anytime|to score|shots on target|points|yards|td|touchdown|spread|handicap|asian handicap|draw|\bdnb\b|draw no bet|double chance|win or draw|goals|correct score|to qualify|to nil|clean sheet|corners|cards|first half|second half|\bh1\b|\bh2\b|ht\/ft|half time|full time|overtime|\bot\b|run line|puck line|total points|total goals|player|\bpts\b|rebounds|assists|blocks|steals|threes|3.?point|field goals|free throw|home runs|\bhr\b|hits|\brbis?\b|strikeouts|\bks?\b|saves|shots on goal|blocked shots|power play|\bpp\b|first basket|first goal|first td|anytime td|anytime goal|double double|triple double|passing|rushing|receptions|reception|sacks|tackles|interceptions|\bint\b|field goal|kicking|pat|extra point)\b/i.test(text);
  return !hasOutcome;
}

interface RequestedLeg { selection: string; market: string; marketApiKey?: string; point?: number; outcomeName?: string; }

function normalizeMarket(market: string): string {
  const lower = market.toLowerCase();
  if (lower === "moneyline" || lower === "match odds" || lower === "match result (1x2)" || lower === "1x2") { return "Match Result (1X2)"; }
  return market;
}

const MARKET_LABEL_TO_API_KEYS: Record<string, string[]> = {
  "Match Result (1X2)": ["h2h", "h2h_3_way"],
  "Moneyline": ["h2h"], "Match Winner": ["h2h"],
  "Over/Under Total Goals": ["totals", "alternate_totals"], "Total Points": ["totals", "alternate_totals"],
  "Both Teams to Score": ["btts", "btts_yes_no"], "BTTS": ["btts", "btts_yes_no"], "BTTS 1st Half": ["btts_h1"],
  "Draw No Bet": ["draw_no_bet"], "Double Chance": ["double_chance", "double_chance_h1"],
  "Correct Score": ["correct_score", "correct_score_h1"], "To Qualify": ["to_qualify"], "Win to Nil": ["win_to_nil"],
  "Spread": ["spreads", "alternate_spreads"], "Run Line": ["spreads", "alternate_spreads"], "Puck Line": ["spreads", "alternate_spreads"],
  "Alt Spread": ["alternate_spreads"], "Alt Total Points": ["alternate_totals"], "Alt Over/Under Goals": ["alternate_totals"],
  "Anytime Goalscorer": ["player_goal_scorer_anytime", "player_anytime_goal", "player_goals"],
  "First Goalscorer": ["player_goal_scorer_first", "player_first_goal"],
  "Player Shots on Target": ["player_shots_on_target"],
  "Player Points": ["player_points", "player_points_alternate"],
  "Player Rebounds": ["player_rebounds", "player_rebounds_alternate"],
  "Player Assists": ["player_assists", "player_assists_alternate"],
  "Player 3-Pointers": ["player_threes", "player_threes_alternate"],
  "Player Pass Yards": ["player_pass_yds"], "Player Rush Yards": ["player_rush_yds"],
  "Player Receptions": ["player_receptions"],
  "Anytime TD": ["player_anytime_td", "player_tds_over"], "First TD": ["player_1st_td"],
  "Player Home Runs": ["batter_home_runs", "batter_home_runs_alternate"],
  "Player Hits": ["batter_hits", "batter_hits_alternate"],
  "Pitcher Strikeouts": ["pitcher_strikeouts", "pitcher_strikeouts_alternate"],
  "Player Goals": ["player_goals", "player_goals_alternate"],
  "Anytime Goal Scorer": ["player_goal_scorer_anytime", "player_goals"],
};

const PLAYER_MARKET_LABELS: Record<string, string> = {
  player_goal_scorer_anytime: "Anytime Goalscorer",
  player_goal_scorer_first: "First Goalscorer",
  player_shots_on_target: "Player Shots on Target",
  player_points: "Player Points",
  player_rebounds: "Player Rebounds",
  player_assists: "Player Assists",
  player_threes: "Player 3-Pointers",
  player_pass_yds: "Player Pass Yards",
  player_rush_yds: "Player Rush Yards",
  player_receptions: "Player Receptions",
  player_anytime_td: "Anytime TD",
  player_1st_td: "First TD",
  batter_home_runs: "Player Home Runs",
  batter_hits: "Player Hits",
  pitcher_strikeouts: "Pitcher Strikeouts",
  player_goals: "Player Goals",
};
const PLAYER_MARKET_KEYS = new Set(Object.keys(PLAYER_MARKET_LABELS));

function isPlayerMarketKey(marketKey: string): boolean {
  return PLAYER_MARKET_KEYS.has(marketKey) || marketKey.startsWith("player_") || marketKey.startsWith("batter_") || marketKey.startsWith("pitcher_");
}

function getPlayerRequestedLeg(interpretation: QueryInterpretation | null): RequestedLeg | null {
  if (!interpretation || interpretation.intent !== "player_prop" || interpretation.confidence < 0.45 || !interpretation.participant || !PLAYER_MARKET_KEYS.has(interpretation.market_key)) return null;
  let point = interpretation.point >= 0 ? interpretation.point : undefined;
  let outcomeName = interpretation.outcome === "over" ? "Over" : interpretation.outcome === "under" ? "Under" : interpretation.outcome === "yes" ? "Yes" : interpretation.outcome === "no" ? "No" : undefined;
  if ((interpretation.market_key === "batter_home_runs" || interpretation.market_key === "player_goals") && interpretation.outcome === "score") {
    outcomeName = "Over";
    point = point ?? 0.5;
  }
  return { selection: interpretation.participant, market: PLAYER_MARKET_LABELS[interpretation.market_key], marketApiKey: interpretation.market_key, point, outcomeName };
}

function resolveMarketApiKeys(marketLabel: string): string[] { return MARKET_LABEL_TO_API_KEYS[marketLabel] ?? []; }

function getRequestedMarketKeys(requestedLegs: RequestedLeg[], selectedMarket?: string): string[] {
  const keys = selectedMarket
    ? [selectedMarket]
    : requestedLegs.flatMap((leg) => leg.marketApiKey ? [leg.marketApiKey] : resolveMarketApiKeys(leg.market));
  return [...new Set(keys.filter((key): key is string => Boolean(key)))];
}

function eventHasMarket(event: OddsApiEventOdds, marketKey: string): boolean {
  return (event.bookmakers ?? []).some((bookmaker) =>
    (bookmaker.markets ?? []).some((market) => market.key === marketKey)
  );
}

function getEventEndpointMarkets(
  event: OddsApiEventOdds,
  requestedMarketKeys: string[],
  availableMarketKeys: string[],
): string[] {
  const supportedKeys = availableMarketKeys.length > 0 ? availableMarketKeys : requestedMarketKeys;
  return [...new Set(supportedKeys)]
    .filter((marketKey) => !eventHasMarket(event, marketKey));
}

function parseRequestedLegs(text: string, event: OddsApiEventOdds, interpretation: QueryInterpretation | null = null): RequestedLeg[] {
  const legs: RequestedLeg[] = [];
  const seen = new Set<string>();
  if (!event?.home_team || !event?.away_team) return legs;
  const addLeg = (selection: string, market: string, marketApiKey?: string, point?: number, outcomeName?: string) => {
    const normalized = normalizeMarket(market);
    const key = `${normalizeSearchValue(selection)}|${normalized.toLowerCase()}|${point ?? ""}|${normalizeSearchValue(outcomeName ?? "")}`;
    const duplicateEntity = legs.some((leg) =>
      (leg.marketApiKey ?? leg.market) === (marketApiKey ?? normalized) &&
      namesReferToSameEntity(leg.selection, selection) &&
      Math.abs((leg.point ?? -1) - (point ?? -1)) < 0.001 &&
      normalizeSearchValue(leg.outcomeName ?? "") === normalizeSearchValue(outcomeName ?? "")
    );
    if (!seen.has(key) && !duplicateEntity) { seen.add(key); legs.push({ selection, market: normalized, marketApiKey, point, outcomeName }); }
  };

  const interpretedPlayerLeg = getPlayerRequestedLeg(interpretation);
  if (interpretedPlayerLeg) addLeg(interpretedPlayerLeg.selection, interpretedPlayerLeg.market, interpretedPlayerLeg.marketApiKey, interpretedPlayerLeg.point, interpretedPlayerLeg.outcomeName);

  const csMatch = text.match(/\b(\d{1,2})\s*[-:]\s*(\d{1,2})\b/);
  if (csMatch && /\b(correct score|score|result|prediction)\b/i.test(text)) { addLeg(`${csMatch[1]}-${csMatch[2]}`, "Correct Score", "correct_score"); }
  if (/\b(to qualify|qualify|advance|go through)\b/i.test(text)) {
    if (textMatchesTeam(text, event.home_team)) { addLeg(event.home_team, "To Qualify", "to_qualify"); }
    else if (textMatchesTeam(text, event.away_team)) { addLeg(event.away_team, "To Qualify", "to_qualify"); }
  }
  if (/\b(win to nil|to nil|clean sheet|not to concede)\b/i.test(text)) {
    if (textMatchesTeam(text, event.home_team)) { addLeg(event.home_team, "Win to Nil", "win_to_nil"); }
    else if (textMatchesTeam(text, event.away_team)) { addLeg(event.away_team, "Win to Nil", "win_to_nil"); }
  }
  if (/\b(btts|both teams to score|goal goal|\bgg\b|both score)\b/i.test(text)) {
    const bttsYes = !/\b(no|not|won't|wont)\b/i.test(text);
    addLeg(bttsYes ? "Yes" : "No", "BTTS", "btts", undefined, bttsYes ? "Yes" : "No");
  }
  if (/\b(btts.*(1st half|first half|h1|halftime)|both teams to score.*(1st half|first half|h1))\b/i.test(text)) { addLeg("Yes", "BTTS 1st Half", "btts_h1"); }
  if (/\b(dnb|draw no bet)\b/i.test(text)) {
    if (textMatchesTeam(text, event.home_team)) { addLeg(event.home_team, "Draw No Bet", "draw_no_bet"); }
    else if (textMatchesTeam(text, event.away_team)) { addLeg(event.away_team, "Draw No Bet", "draw_no_bet"); }
  }
  if (/\b(double chance|win or draw|or draw|1x|12|x2)\b/i.test(text)) {
    const homeMatched = textMatchesTeam(text, event.home_team);
    const awayMatched = textMatchesTeam(text, event.away_team);
    if (/\b(draw|\bx\b)\b/i.test(text) && !homeMatched && !awayMatched) { addLeg("Draw", "Double Chance", "double_chance"); }
    else if (homeMatched && awayMatched) { addLeg(`${event.home_team} or Draw`, "Double Chance", "double_chance"); }
    else if (homeMatched) { addLeg(`${event.home_team} or Draw`, "Double Chance", "double_chance"); }
    else if (awayMatched) { addLeg(`${event.away_team} or Draw`, "Double Chance", "double_chance"); }
  }
  const ouMatch = text.match(/(?:over|under|o\/u|ou)\s*(\d+\.?\d*)\s*(?:goals?|points?|pts?)?/i);
  if (ouMatch) {
    const isOver = !/\bunder\b/i.test(text.substring(text.indexOf(ouMatch[0]), text.indexOf(ouMatch[0]) + 10));
    const line = parseFloat(ouMatch[1]);
    const isSoccer = (event.sport_key ?? "").startsWith("soccer");
    addLeg(`${isOver ? "Over" : "Under"} ${line} ${isSoccer ? "Goals" : "Points"}`, isSoccer ? "Over/Under Total Goals" : "Total Points", "totals", line, isOver ? "Over" : "Under");
  } else if (/\b(over|under)\s+(\d+\.?\d*)\b/i.test(text)) {
    const m = text.match(/(?:over|under)\s+(\d+\.?\d*)/i);
    if (m?.[1]) { const line = parseFloat(m[1]); const isSoccer = (event.sport_key ?? "").startsWith("soccer"); const isUnder = /\bunder\b/i.test(m[0]); addLeg(`${isUnder ? "Under" : "Over"} ${line} ${isSoccer ? "Goals" : "Points"}`, isSoccer ? "Over/Under Total Goals" : "Total Points", "totals", line, isUnder ? "Under" : "Over"); }
  }
  const spreadMatch = text.match(/([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\s*([+-])\s*(\d+\.?\d*)/);
  if (spreadMatch?.[1] && spreadMatch?.[3]) {
    const team = spreadMatch[1]; const sign = spreadMatch[2]; const lineVal = parseFloat(spreadMatch[3]);
    const point = sign === "-" ? -lineVal : lineVal; const line = `${sign}${lineVal}`;
    if (textMatchesTeam(team, event.home_team)) { addLeg(`${event.home_team} ${line}`, "Spread", "spreads", point); }
    else if (textMatchesTeam(team, event.away_team)) { addLeg(`${event.away_team} ${line}`, "Spread", "spreads", point); }
  }
  const scorerMatch = text.match(/(\b[A-Z][a-z'-]+(?:\s+[A-Z][a-z'-]+){0,2}\b)\s+(?:to score|score|anytime|anytime scorer|goalscorer|goal scorer)/i);
  if (scorerMatch?.[1] && (event.sport_key ?? "").startsWith("soccer")) { addLeg(scorerMatch[1], "Anytime Goalscorer", "player_goal_scorer_anytime"); }
  const firstScorerMatch = text.match(/(\b[A-Z][a-z'-]+(?:\s+[A-Z][a-z'-]+){0,2}\b)\s+(?:first goal|first scorer|first goalscorer|to score first)/i);
  if (firstScorerMatch?.[1]) { addLeg(firstScorerMatch[1], "First Goalscorer", "player_goal_scorer_first"); }
  const sotMatch = text.match(/(\b[A-Z][a-z'-]+(?:\s+[A-Z][a-z'-]+){0,2}\b)\s+(?:shots on target|shot on target|sot)/i);
  if (sotMatch?.[1]) { addLeg(sotMatch[1], "Player Shots on Target", "player_shots_on_target"); }
  const pointsMatch = text.match(/(\b[A-Z][a-z'-]+(?:\s+[A-Z][a-z'-]+){0,2}\b)\s+(\d+)\+?\s*(?:points|pts)/i);
  if (pointsMatch?.[1] && pointsMatch?.[2]) { addLeg(pointsMatch[1], "Player Points", "player_points", parseFloat(pointsMatch[2]) - 0.5, "Over"); }
  const reboundsMatch = text.match(/(\b[A-Z][a-z'-]+(?:\s+[A-Z][a-z'-]+){0,2}\b)\s+(\d+)\+?\s*(?:rebounds|reb)/i);
  if (reboundsMatch?.[1] && reboundsMatch?.[2]) { addLeg(reboundsMatch[1], "Player Rebounds", "player_rebounds", parseFloat(reboundsMatch[2]) - 0.5, "Over"); }
  const assistsMatch = text.match(/(\b[A-Z][a-z'-]+(?:\s+[A-Z][a-z'-]+){0,2}\b)\s+(\d+)\+?\s*(?:assists|ast)/i);
  if (assistsMatch?.[1] && assistsMatch?.[2]) { addLeg(assistsMatch[1], "Player Assists", "player_assists", parseFloat(assistsMatch[2]) - 0.5, "Over"); }
  const threesMatch = text.match(/(\b[A-Z][a-z'-]+(?:\s+[A-Z][a-z'-]+){0,2}\b)\s+(\d+)\+?\s*(?:threes|3.?point|3pt|three pointers)/i);
  if (threesMatch?.[1] && threesMatch?.[2]) { addLeg(threesMatch[1], "Player 3-Pointers", "player_threes", parseFloat(threesMatch[2]) - 0.5, "Over"); }
  const yardsMatch = text.match(/(\b[A-Z][a-z'-]+(?:\s+[A-Z][a-z'-]+){0,2}\b)\s+(\d+)\+?\s*(?:pass yards|passing yards|yards)/i);
  if (yardsMatch?.[1] && yardsMatch?.[2]) { addLeg(yardsMatch[1], "Player Pass Yards", "player_pass_yds", parseFloat(yardsMatch[2]) - 0.5, "Over"); }
  const rushYardsMatch = text.match(/(\b[A-Z][a-z'-]+(?:\s+[A-Z][a-z'-]+){0,2}\b)\s+(\d+)\+?\s*(?:rush yards|rushing yards)/i);
  if (rushYardsMatch?.[1] && rushYardsMatch?.[2]) { addLeg(rushYardsMatch[1], "Player Rush Yards", "player_rush_yds", parseFloat(rushYardsMatch[2]) - 0.5, "Over"); }
  const receptionsMatch = text.match(/(\b[A-Z][a-z'-]+(?:\s+[A-Z][a-z'-]+){0,2}\b)\s+(\d+)\+?\s*(?:receptions|catches|rec)/i);
  if (receptionsMatch?.[1] && receptionsMatch?.[2]) { addLeg(receptionsMatch[1], "Player Receptions", "player_receptions", parseFloat(receptionsMatch[2]) - 0.5, "Over"); }
  const tdMatch = text.match(/(\b[A-Z][a-z'-]+(?:\s+[A-Z][a-z'-]+){0,2}\b)\s+anytime\s+(?:td|touchdown)/i);
  if (tdMatch?.[1]) { addLeg(tdMatch[1], "Anytime TD", "player_anytime_td"); }
  const firstTdMatch = text.match(/(\b[A-Z][a-z'-]+(?:\s+[A-Z][a-z'-]+){0,2}\b)\s+(?:first td|first touchdown|to score first)/i);
  if (firstTdMatch?.[1]) { addLeg(firstTdMatch[1], "First TD", "player_1st_td"); }
  const hrMatch = text.match(/(\b[A-Z][a-z'-]+(?:\s+[A-Z][a-z'-]+){0,2}\b)\s+(?:home run|hr|homer|to hit a home run|to go deep)/i);
  if (hrMatch?.[1]) { addLeg(hrMatch[1], "Player Home Runs", "batter_home_runs", 0.5, "Over"); }
  const hitsMatch = text.match(/(\b[A-Z][a-z'-]+(?:\s+[A-Z][a-z'-]+){0,2}\b)\s+(\d+)\+?\s*(?:hits)/i);
  if (hitsMatch?.[1] && hitsMatch?.[2]) { addLeg(hitsMatch[1], "Player Hits", "batter_hits", parseFloat(hitsMatch[2]) - 0.5, "Over"); }
  const ksMatch = text.match(/(\b[A-Z][a-z'-]+(?:\s+[A-Z][a-z'-]+){0,2}\b)\s+(\d+)\+?\s*(?:strikeouts|ks|k's)/i);
  if (ksMatch?.[1] && ksMatch?.[2]) { addLeg(ksMatch[1], "Pitcher Strikeouts", "pitcher_strikeouts", parseFloat(ksMatch[2]) - 0.5, "Over"); }
  const nhlGoalsMatch = text.match(/(\b[A-Z][a-z'-]+(?:\s+[A-Z][a-z'-]+){0,2}\b)\s+(?:to score|anytime goal|goal scorer|goals)/i);
  if (nhlGoalsMatch?.[1] && (event.sport_key ?? "").startsWith("icehockey")) { addLeg(nhlGoalsMatch[1], "Player Goals", "player_goals", 0.5, "Over"); }

  const hasDNBorDC = legs.some((l) => l.market === "Draw No Bet" || l.market === "Double Chance");
  const hasCorrectScore = legs.some((l) => l.market === "Correct Score");
  const hasToQualify = legs.some((l) => l.market === "To Qualify");
  const asksForMatchResult = /\b(ml|moneyline|to win|to beat|match odds|1x2|h2h)\b/i.test(text);
  if (!hasDNBorDC && !hasCorrectScore && !hasToQualify && asksForMatchResult) {
    const homeMatched = textMatchesTeam(text, event.home_team);
    const awayMatched = textMatchesTeam(text, event.away_team);
    if (homeMatched && !awayMatched) { addLeg(event.home_team, "Match Result (1X2)", "h2h"); }
    else if (awayMatched && !homeMatched) { addLeg(event.away_team, "Match Result (1X2)", "h2h"); }
    else if (homeMatched && awayMatched) {
      const winTeam = text.match(/([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\s+to\s+(?:win|beat)/i);
      if (winTeam?.[1]) { if (textMatchesTeam(winTeam[1], event.home_team)) { addLeg(event.home_team, "Match Result (1X2)", "h2h"); } else { addLeg(event.away_team, "Match Result (1X2)", "h2h"); } }
      else { addLeg(event.home_team, "Match Result (1X2)", "h2h"); }
    } else if (/\b(ml|moneyline|to win|to beat)\b/i.test(text)) { addLeg(event.home_team, "Match Result (1X2)", "h2h"); }
  }
  return legs;
}

function marketKeyToLabel(key: string, sportKey: string): string {
  const sk = (sportKey ?? "").toLowerCase();
  const isSoccer = sk.startsWith("soccer"); const isTennis = sk.startsWith("tennis");
  const isUS = sk.startsWith("basketball") || sk.startsWith("americanfootball") || sk.startsWith("baseball") || sk.startsWith("icehockey");
  const isBaseball = sk.startsWith("baseball"); const isHockey = sk.startsWith("icehockey");
  switch (key) {
    case "h2h": return isUS ? "Moneyline" : isTennis ? "Match Winner" : "Match Result (1X2)";
    case "spreads": return isBaseball ? "Run Line" : isHockey ? "Puck Line" : "Spread";
    case "totals": return isSoccer ? "Over/Under Total Goals" : "Total Points";
    case "btts": case "btts_yes_no": return "Both Teams to Score";
    case "draw_no_bet": return "Draw No Bet";
    case "double_chance": return "Double Chance";
    case "alternate_h2h": return isUS ? "Alt Moneyline" : "Alt Match Result";
    case "alternate_spreads": return isBaseball ? "Alt Run Line" : isHockey ? "Alt Puck Line" : "Alt Spread";
    case "alternate_totals": return isSoccer ? "Alt Over/Under Goals" : "Alt Total Points";
    default: return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }
}

function buildMarketOptions(eventOdds: OddsApiEventOdds, sportKey: string): MarketOption[] {
  const options: MarketOption[] = []; const seen = new Set<string>();
  const sk = (sportKey ?? "").toLowerCase(); const isSoccer = sk.startsWith("soccer");
  const skipKeys = new Set<string>(isSoccer ? ["h2h_3_way"] : []);
  for (const bookmaker of eventOdds.bookmakers ?? []) {
    for (const market of bookmaker?.markets ?? []) {
      if (!market?.key) continue; if (skipKeys.has(market.key)) continue; if (seen.has(market.key)) continue;
      if ((market.outcomes ?? []).length === 0) continue; seen.add(market.key);
      options.push({ market: marketKeyToLabel(market.key, sportKey), label: marketKeyToLabel(market.key, sportKey), apiKey: market.key, outcomes: (market.outcomes ?? []).map((o) => ({ name: o.name, price: o.price, point: o.point })) });
    }
  }
  return options;
}

function buildBookmakerOdds(eventOdds: OddsApiEventOdds): BookmakerOdds[] {
  const result: BookmakerOdds[] = [];
  for (const bookmaker of eventOdds.bookmakers ?? []) {
    if (!bookmaker?.key) continue; const markets: BookmakerMarket[] = [];
    for (const market of bookmaker.markets ?? []) {
      if (!market?.key) continue; const outcomes: BookmakerOutcome[] = [];
      for (const o of market.outcomes ?? []) { if (!o?.name || !o?.price || o.price <= 0) continue; outcomes.push({ name: o.name, description: o.description, price: o.price, point: o.point, link: o.link, sid: o.sid }); }
      if (outcomes.length > 0) { markets.push({ key: market.key, outcomes, link: market.link, sid: market.sid }); }
    }
    if (markets.length > 0) { result.push({ key: bookmaker.key, name: OPERATOR_NAMES[bookmaker.key] ?? bookmaker.title ?? bookmaker.key, markets, link: bookmaker.link, sid: bookmaker.sid }); }
  }
  return result;
}

function noOddsFoundResponse(message = "No odds found for this prediction.", code = "no_odds"): Response {
  return new Response(
    JSON.stringify({ error: message, code }),
    { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
}

async function fetchSportEvents(sportKey: string): Promise<OddsApiEventOdds[]> {
  const cached = sportEventsCache.get(sportKey);
  if (cached && cached.expiresAt > Date.now()) return cached.events;
  if (cached) sportEventsCache.delete(sportKey);

  try {
    const query = new URLSearchParams({ apiKey: API_KEY });
    const response = await fetch(`${ODDS_API_BASE}/sports/${encodeURIComponent(sportKey)}/events/?${query.toString()}`);
    if (!response.ok) {
      console.error(`EVENT DISCOVERY ERROR: ${sportKey} returned status ${response.status}`);
      return [];
    }
    const data = await response.json().catch(() => []);
    const events = unwrapOdds(data).map((event) => ({ ...event, bookmakers: Array.isArray(event.bookmakers) ? event.bookmakers : [] }));
    sportEventsCache.set(sportKey, { expiresAt: Date.now() + EVENT_MARKET_CACHE_TTL_MS, events });
    return events;
  } catch (err) {
    console.error(`EVENT DISCOVERY ERROR: ${sportKey}`, err);
    return [];
  }
}

async function fetchSportOdds(sportKey: string, region: string, bookmakers: string): Promise<OddsApiEventOdds[]> {
  const baseUrl = `${ODDS_API_BASE}/sports/${sportKey}/odds/?apiKey=${API_KEY}&regions=${region}&oddsFormat=american&includeLinks=true&includeSids=true&bookmakers=${bookmakers}`;
  const tryFetch = async (markets: string): Promise<OddsApiEventOdds[] | null> => {
    try {
      const res = await fetch(`${baseUrl}&markets=${markets}`);
      if (!res.ok) { console.error(`ODDS FETCH ERROR: ${sportKey} markets=${markets} returned status ${res.status}`); return null; }
      const data = await res.json().catch((e) => { console.error(`ODDS FETCH ERROR: ${sportKey} JSON parse failed`, e); return []; });
      return convertOddsToDecimal(unwrapOdds(data));
    } catch (err) { console.error(`ODDS FETCH ERROR: ${sportKey} fetch failed`, err); return null; }
  };
  const sk = sportKey.toLowerCase();
  const isSoccer = sk.startsWith("soccer");
  const isUS = sk.startsWith("basketball") || sk.startsWith("americanfootball") || sk.startsWith("baseball") || sk.startsWith("icehockey");
  if (isSoccer) { return (await tryFetch("h2h,totals")) ?? (await tryFetch("h2h")) ?? []; }
  if (isUS) { return (await tryFetch("h2h,spreads,totals")) ?? (await tryFetch("h2h,spreads")) ?? (await tryFetch("h2h,totals")) ?? (await tryFetch("h2h")) ?? []; }
  return (await tryFetch("h2h,totals,spreads")) ?? (await tryFetch("h2h,totals")) ?? (await tryFetch("h2h")) ?? [];
}

function buildInterpretedSearchText(prediction: string, interpretation: QueryInterpretation | null): string {
  const corrected = interpretation?.corrected_query?.trim();
  return corrected && normalizeSearchValue(corrected) !== normalizeSearchValue(prediction) ? `${prediction}. ${corrected}` : prediction;
}

function scoreFixtureMatch(text: string, event: OddsApiEventOdds, interpretation: QueryInterpretation | null): number {
  if (!event?.home_team || !event?.away_team) return 0;
  const homeScore = entitySimilarity(text, event.home_team);
  const awayScore = entitySimilarity(text, event.away_team);
  let score = (homeScore >= 0.82 ? homeScore * 100 : 0) + (awayScore >= 0.82 ? awayScore * 100 : 0);

  if (interpretation?.team_hint) {
    const hintScore = Math.max(entitySimilarity(interpretation.team_hint, event.home_team), entitySimilarity(interpretation.team_hint, event.away_team));
    if (hintScore >= 0.82) score += 180 * hintScore;
  }
  if (interpretation?.opponent_hint) {
    const opponentScore = Math.max(entitySimilarity(interpretation.opponent_hint, event.home_team), entitySimilarity(interpretation.opponent_hint, event.away_team));
    if (opponentScore >= 0.82) score += 140 * opponentScore;
  }
  if (interpretation?.participant && event.sport_key?.startsWith("tennis")) {
    const participantScore = Math.max(entitySimilarity(interpretation.participant, event.home_team), entitySimilarity(interpretation.participant, event.away_team));
    if (participantScore >= 0.82) score += 180 * participantScore;
  }
  return score;
}

interface CandidateResult { eventOdds: OddsApiEventOdds; sport: SportMapping; score: number; }

async function fetchAndFindCandidates(
  text: string,
  region: string,
  bookmakers: string,
  sportsToSearch: SportMapping[],
  interpretation: QueryInterpretation | null,
  eventsOnly = false,
): Promise<CandidateResult[]> {
  const fetchResults = await Promise.all((sportsToSearch ?? []).map(async (sport) => ({
    sport,
    events: eventsOnly ? await fetchSportEvents(sport.key) : await fetchSportOdds(sport.key, region, bookmakers),
  })));
  const candidates: CandidateResult[] = [];
  for (const { sport, events } of fetchResults) {
    for (const event of events ?? []) {
      if (!event?.home_team || !event?.away_team) continue;
      const score = scoreFixtureMatch(text, event, interpretation);
      if (score > 0) { const sportMeta: SportMapping = sport ?? getSportMetadata(event.sport_key); candidates.push({ eventOdds: event, sport: sportMeta, score }); }
    }
  }
  candidates.sort((a, b) => { if (b.score !== a.score) return b.score - a.score; const aTime = new Date(a.eventOdds.commence_time).getTime() || 0; const bTime = new Date(b.eventOdds.commence_time).getTime() || 0; return aTime - bTime; });
  return candidates;
}

function mergeBookmakers(base: OddsApiEventOdds, extra: OddsApiEventOdds): void {
  for (const extraBm of extra.bookmakers ?? []) {
    const baseBm = (base.bookmakers ?? []).find((b) => b.key === extraBm.key);
    if (!baseBm) { base.bookmakers.push(extraBm); continue; }
    for (const extraMarket of extraBm.markets ?? []) {
      if (!(baseBm.markets ?? []).some((m) => m.key === extraMarket.key)) {
        baseBm.markets.push(extraMarket);
      }
    }
  }
}

function getEventDataCacheKey(eventId: string, sportKey: string, region: string, bookmakers: string): string {
  return `${sportKey}|${eventId}|${region}|${bookmakers}`;
}

async function fetchAvailableEventMarketKeys(
  eventId: string,
  sportKey: string,
  region: string,
  bookmakers: string,
): Promise<string[]> {
  const cacheKey = getEventDataCacheKey(eventId, sportKey, region, bookmakers);
  const cached = eventMarketKeysCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return [...cached.keys];
  if (cached) eventMarketKeysCache.delete(cacheKey);

  const query = new URLSearchParams({ apiKey: API_KEY, regions: region });
  if (bookmakers) query.set("bookmakers", bookmakers);
  const url = `${ODDS_API_BASE}/sports/${encodeURIComponent(sportKey)}/events/${encodeURIComponent(eventId)}/markets?${query.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`EVENT MARKETS ERROR: ${sportKey} event=${eventId} status=${response.status}`);
      return [];
    }

    const data = await response.json() as OddsApiEventMarketIndex;
    const seen = new Set<string>();
    const marketKeys: string[] = [];
    for (const bookmaker of data?.bookmakers ?? []) {
      for (const market of bookmaker?.markets ?? []) {
        const key = market?.key?.trim();
        if (!key || seen.has(key)) continue;
        seen.add(key);
        marketKeys.push(key);
      }
    }

    eventMarketKeysCache.set(cacheKey, {
      expiresAt: Date.now() + EVENT_MARKET_CACHE_TTL_MS,
      keys: marketKeys,
    });
    return marketKeys;
  } catch (err) {
    console.error(`EVENT MARKETS ERROR: ${sportKey} event=${eventId}`, err);
    return [];
  }
}

async function fetchEventOdds(eventId: string, sportKey: string, region: string, bookmakers: string, markets: string[]): Promise<OddsApiEventOdds | null> {
  const requestedMarkets = [...new Set(markets.filter(Boolean))];
  if (requestedMarkets.length === 0) return null;

  const cacheKey = `${getEventDataCacheKey(eventId, sportKey, region, bookmakers)}|${[...requestedMarkets].sort().join(",")}`;
  const cached = eventOddsCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.event;
  if (cached) eventOddsCache.delete(cacheKey);

  const query = new URLSearchParams({
    apiKey: API_KEY,
    regions: region,
    oddsFormat: "american",
    includeLinks: "true",
    includeSids: "true",
    markets: requestedMarkets.join(","),
  });
  if (bookmakers) query.set("bookmakers", bookmakers);

  const url = `${ODDS_API_BASE}/sports/${encodeURIComponent(sportKey)}/events/${encodeURIComponent(eventId)}/odds/?${query.toString()}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`EVENT ODDS ERROR: ${sportKey} event=${eventId} markets=${requestedMarkets.join(",")} status=${response.status}`);
      return null;
    }
    const data = await response.json();
    if (!data || data.id !== eventId) return null;
    const event = convertOddsToDecimal([data])[0] ?? null;
    if (event) {
      eventOddsCache.set(cacheKey, {
        expiresAt: Date.now() + EVENT_MARKET_CACHE_TTL_MS,
        event,
      });
    }
    return event;
  } catch (err) {
    console.error(`EVENT ODDS ERROR: ${sportKey} event=${eventId} markets=${requestedMarkets.join(",")}`, err);
    return null;
  }
}

async function findPlayerEventByMarket(
  sportsToSearch: SportMapping[],
  interpretation: QueryInterpretation | null,
  region: string,
  bookmakers: string,
): Promise<CandidateResult | null> {
  const requested = getPlayerRequestedLeg(interpretation);
  if (!requested?.marketApiKey || !interpretation) return null;

  const discovered = await Promise.all((sportsToSearch ?? []).map(async (sport) => ({ sport, events: await fetchSportEvents(sport.key) })));
  const rankedEvents = discovered
    .flatMap(({ sport, events }) => (events ?? []).map((event) => {
      const teamScore = interpretation.team_hint
        ? Math.max(entitySimilarity(interpretation.team_hint, event.home_team), entitySimilarity(interpretation.team_hint, event.away_team))
        : 0;
      return { sport, event, teamScore };
    }))
    .sort((left, right) => {
      if (right.teamScore !== left.teamScore) return right.teamScore - left.teamScore;
      return (new Date(left.event.commence_time).getTime() || 0) - (new Date(right.event.commence_time).getTime() || 0);
    })
    .slice(0, PLAYER_EVENT_SCAN_LIMIT);

  const lookupLeg: Leg = {
    id: "player-event-lookup",
    selection: requested.selection,
    market: requested.market,
    marketApiKey: requested.marketApiKey,
    point: requested.point,
    outcomeName: requested.outcomeName,
    odds: 0,
    result: "Pending",
    features: [],
  };

  for (let index = 0; index < rankedEvents.length; index += 4) {
    const batch = rankedEvents.slice(index, index + 4);
    const matches = await Promise.all(batch.map(async ({ sport, event, teamScore }) => {
      const enriched = await fetchEventOdds(event.id, sport.key, region, bookmakers, [requested.marketApiKey!]);
      if (!enriched?.bookmakers?.length) return null;
      const hasPlayer = enriched.bookmakers.some((bookmaker) => Boolean(findBookmakerSelection(bookmaker, lookupLeg)));
      return hasPlayer ? { eventOdds: enriched, sport, score: 100 + teamScore * 180 } satisfies CandidateResult : null;
    }));
    const match = matches.find((candidate): candidate is CandidateResult => Boolean(candidate));
    if (match) return match;
  }
  return null;
}

async function fetchSpecificEvent(eventId: string, sportKey: string, region: string, bookmakers: string): Promise<{ eventOdds: OddsApiEventOdds; sport: SportMapping } | null> {
  const sportMeta = getSportMetadata(sportKey);
  const events = await fetchSportOdds(sportKey, region, bookmakers);
  const found = (events ?? []).find((e) => e?.id === eventId);
  if (!found) return null;
  return { eventOdds: found, sport: sportMeta };
}

function buildCandidateFixture(event: OddsApiEventOdds, sport: SportMapping): CandidateFixture {
  const kickoffDate = new Date(event.commence_time);
  const kickoff = kickoffDate.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  const competition = (sport.key ?? "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return { eventId: event.id, match: `${event.home_team} vs ${event.away_team}`, sportKey: sport.key, sport: sport.sport, sportIcon: sport.icon, competition, kickoff };
}

function buildOperatorOffers(eventOdds: OddsApiEventOdds, legs: Leg[], cfg: { regions: string; bookmakers: string[] }, eventId: string, sportKey: string, region: string): OperatorOffer[] {
  const operators: OperatorOffer[] = [];
  for (const bookmakerKey of cfg.bookmakers ?? []) {
    const bookmaker = (eventOdds.bookmakers ?? []).find((b) => b?.key === bookmakerKey);
    const operatorName = OPERATOR_NAMES[bookmakerKey] ?? bookmakerKey;
    const sourceEventId = bookmaker?.sid != null ? String(bookmaker.sid) : eventId;
    const fallbackDeepLink = buildDeepLink(bookmakerKey, sourceEventId, sportKey, region);
    if (!bookmaker) {
      operators.push({ key: bookmakerKey, name: operatorName, available: false, combinedOdds: null, deepLink: fallbackDeepLink, missingLegs: legs.map((l) => l.selection) }); continue;
    }
    const nativeLink = getNativeBookmakerLink(bookmaker, legs);
    const deepLink = nativeLink ?? fallbackDeepLink;
    const legOdds: number[] = []; const missingLegs: string[] = [];
    for (const leg of legs) {
      const selection = findBookmakerSelection(bookmaker, leg);
      if (selection) legOdds.push(selection.outcome.price);
      else missingLegs.push(leg.selection);
    }
    if (missingLegs.length === 0 && legOdds.length === legs.length) { operators.push({ key: bookmakerKey, name: operatorName, available: true, combinedOdds: legOdds.reduce((acc, o) => acc * o, 1), deepLink, missingLegs: [] }); }
    else { operators.push({ key: bookmakerKey, name: operatorName, available: false, combinedOdds: null, deepLink, missingLegs }); }
  }
  return operators;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") { return new Response(null, { status: 200, headers: corsHeaders }); }
  try {
    if (!API_KEY) {
      return new Response(JSON.stringify({ error: "Odds service is not configured." }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const body = await req.json().catch(() => ({})) as { prediction?: string; region?: string; oddsFormat?: string; eventId?: string; sportKey?: string; market?: string; };
    const prediction = body?.prediction ?? "";
    const region = (body?.region ?? "uk").toLowerCase();
    const selectedEventId = body?.eventId; const selectedSportKey = body?.sportKey; const selectedMarket = body?.market;
    if (!prediction && !selectedEventId) { return new Response(JSON.stringify({ error: "Prediction text is required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }); }
    const interpretationResult = prediction && !selectedMarket
      ? await interpretQueryWithLlm(prediction, region)
      : { interpretation: null, errorCode: null } satisfies QueryInterpretationResult;
    const interpretation = interpretationResult.interpretation
      ? applyValidatedPlayerRoutingHint(interpretationResult.interpretation, prediction)
      : (prediction ? inferQueryWithoutLlm(prediction, region) : null);
    const text = buildInterpretedSearchText(prediction, interpretation).toLowerCase().trim();
    const cfg = REGION_BOOKMAKERS[region] ?? REGION_BOOKMAKERS.uk;
    const bookmakerQuery = (cfg.bookmakers || []).join(",");
    let matchedEvent: OddsApiEventOdds | null = null; let matchedSport: SportMapping | null = null;
    if (selectedEventId && selectedSportKey) { const specific = await fetchSpecificEvent(selectedEventId, selectedSportKey, cfg.regions, bookmakerQuery); if (specific) { matchedEvent = specific.eventOdds; matchedSport = specific.sport; } }
    if (!matchedEvent) {
      if (!prediction) { return noOddsFoundResponse(); }
      const sportsToSearch = await getSportsForPrediction(text, region, interpretation);
      if (sportsToSearch.length === 0) { return noOddsFoundResponse(); }
      const playerSearch = interpretation?.intent === "player_prop";
      const candidates = await fetchAndFindCandidates(text, cfg.regions, bookmakerQuery, sportsToSearch, interpretation, playerSearch);
      if (candidates.length === 0 && playerSearch) {
        const playerMarketMatch = await findPlayerEventByMarket(sportsToSearch, interpretation, cfg.regions, bookmakerQuery);
        if (playerMarketMatch) candidates.push(playerMarketMatch);
      }
      if (candidates.length === 0) {
        const code = interpretation ? `no_event_match_${interpretation.intent}` : interpretationResult.errorCode ?? "query_interpretation_unavailable";
        return noOddsFoundResponse(playerSearch ? "No active fixture with that player market was found. Try adding the team or opponent." : "No odds found for this prediction.", code);
      }
      const bestCandidate = candidates[0];
      const secondCandidate = candidates[1];
      const hasClearLead = !secondCandidate || bestCandidate.score - secondCandidate.score >= 60;
      const canUseNextPlayerFixture = playerSearch && bestCandidate.score >= 100;
      if (candidates.length === 1 || hasClearLead || canUseNextPlayerFixture) {
        matchedEvent = bestCandidate.eventOdds;
        matchedSport = bestCandidate.sport;
      } else {
        const candidateFixtures: CandidateFixture[] = candidates.slice(0, 6).map((c) => buildCandidateFixture(c.eventOdds, c.sport));
        const disambiguationSlip: SlipResponse = { match: "Select Matching Fixture", sport: candidates[0].sport.sport, sportIcon: candidates[0].sport.icon, competition: "", kickoff: "", isSingleMatch: false, legs: [], totalOdds: 0, stake: 0, potentialReturn: 0, probability: 0, variance: "Low", safetyMessage: "", operators: [], systemNotices: [], source: "disambiguation", candidateFixtures };
        return new Response(JSON.stringify(disambiguationSlip), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }
    if (!matchedEvent || !matchedSport) { return noOddsFoundResponse(); }
    const hasInterpretedMarket = Boolean(interpretation && interpretation.intent !== "fixture" && interpretation.market_key !== "unknown");
    const fixtureOnly = !hasInterpretedMarket && isFixtureOnlyPrompt(text, matchedEvent);
    const requestedLegs = fixtureOnly || selectedMarket ? [] : parseRequestedLegs(text, matchedEvent, interpretation);
    const requestedMarketKeys = getRequestedMarketKeys(requestedLegs, selectedMarket);
    const availableEventMarketKeys = await fetchAvailableEventMarketKeys(
      matchedEvent.id,
      matchedSport.key,
      cfg.regions,
      bookmakerQuery,
    );
    const eventEndpointMarkets = getEventEndpointMarkets(
      matchedEvent,
      requestedMarketKeys,
      availableEventMarketKeys,
    );

    if (eventEndpointMarkets.length > 0) {
      const enriched = await fetchEventOdds(
        matchedEvent.id,
        matchedSport.key,
        cfg.regions,
        bookmakerQuery,
        eventEndpointMarkets,
      );
      if (enriched?.bookmakers?.length) mergeBookmakers(matchedEvent, enriched);
    }

    if (!matchedEvent.bookmakers || !Array.isArray(matchedEvent.bookmakers) || matchedEvent.bookmakers.length === 0) { return noOddsFoundResponse("No priced markets are currently available for this fixture.", "no_priced_markets"); }
    const interpretedPlayerRequest = getPlayerRequestedLeg(interpretation);
    const interpretedPlayerSelectionAvailable = interpretedPlayerRequest ? matchedEvent.bookmakers.some((bookmaker) => Boolean(findBookmakerSelection(bookmaker, {
      id: "interpreted-player-availability",
      selection: interpretedPlayerRequest.selection,
      market: interpretedPlayerRequest.market,
      marketApiKey: interpretedPlayerRequest.marketApiKey,
      point: interpretedPlayerRequest.point,
      outcomeName: interpretedPlayerRequest.outcomeName,
      odds: 0,
      result: "Pending",
      features: [],
    }))) : true;
    const showPlayerMarketFallback = Boolean(interpretedPlayerRequest && !interpretedPlayerSelectionAvailable);
    const kickoffDate = new Date(matchedEvent.commence_time);
    const kickoff = kickoffDate.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
    const competition = (matchedSport.key ?? "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    if (fixtureOnly || selectedMarket || showPlayerMarketFallback) {
      const marketOptions = buildMarketOptions(matchedEvent, matchedSport.key);
      const bookmakerOdds = buildBookmakerOdds(matchedEvent);
      let defaultLeg: Leg | null = null;
      if (selectedMarket) {
        for (const bookmaker of matchedEvent.bookmakers ?? []) { for (const market of bookmaker?.markets ?? []) { if (market.key === selectedMarket) { for (const outcome of market?.outcomes ?? []) { if (outcome?.price && outcome.price > 0) { defaultLeg = { id: "leg-1", selection: outcome.name, market: market.key === "h2h" ? "Match Result (1X2)" : market.key === "btts" ? "BTTS" : market.key === "totals" ? "Over/Under Total Goals" : market.key, marketApiKey: market.key, odds: outcome.price, result: "Pending", features: detectFeatures(outcome.name, market.key, bookmaker.key) }; break; } } if (defaultLeg) break; } } if (defaultLeg) break; }
      }
      if (selectedMarket && !defaultLeg) { return noOddsFoundResponse(); }
      if (!selectedMarket && !defaultLeg) { const h2hBookmaker = (matchedEvent.bookmakers ?? []).find((b) => (b?.markets ?? []).some((m) => m?.key === "h2h")); if (h2hBookmaker) { const h2h = (h2hBookmaker.markets ?? []).find((m) => m?.key === "h2h"); if (h2h && (h2h.outcomes ?? []).length > 0) { const homeOutcome = (h2h.outcomes ?? []).find((o) => o?.name === matchedEvent.home_team) ?? h2h.outcomes[0]; if (homeOutcome?.price && homeOutcome.price > 0) { defaultLeg = { id: "leg-1", selection: homeOutcome.name, market: "Match Result (1X2)", marketApiKey: "h2h", odds: homeOutcome.price, result: "Pending", features: detectFeatures(homeOutcome.name, "h2h", h2hBookmaker.key) }; } } } }
      if (!selectedMarket && !defaultLeg) { for (const bookmaker of matchedEvent.bookmakers ?? []) { for (const market of bookmaker?.markets ?? []) { for (const outcome of market?.outcomes ?? []) { if (outcome?.price && outcome.price > 0) { defaultLeg = { id: "leg-1", selection: outcome.name, market: market.key === "h2h" ? "Match Result (1X2)" : market.key, marketApiKey: market.key, odds: outcome.price, result: "Pending", features: detectFeatures(outcome.name, market.key, bookmaker.key) }; break; } } if (defaultLeg) break; } if (defaultLeg) break; } }
      const legs = defaultLeg ? [defaultLeg] : [];
      if (legs.length === 0) { return noOddsFoundResponse(); }
      const _isUS = matchedSport.key.startsWith("basketball") || matchedSport.key.startsWith("americanfootball") || matchedSport.key.startsWith("baseball") || matchedSport.key.startsWith("icehockey");
      const _h2hLabel = _isUS ? "Moneyline" : matchedSport.key.startsWith("tennis") ? "Match Winner" : "Match Result (1X2)";
      const _totalsLabel = matchedSport.key.startsWith("soccer") ? "Over/Under Total Goals" : "Total Points";
      for (const leg of legs) { if (leg.market === "Match Result (1X2)") leg.market = _h2hLabel; else if (leg.market === "Over/Under Total Goals" && !matchedSport.key.startsWith("soccer")) leg.market = _totalsLabel; }
      const operators = buildOperatorOffers(matchedEvent, legs, cfg, matchedEvent.id, matchedSport.key, region);
      const totalOdds = legs.length > 0 ? legs.reduce((acc, leg) => acc * leg.odds, 1) : 0;
      const probability = totalOdds > 0 ? Math.round((1 / totalOdds) * 100) : 0;
      const variance: SlipResponse["variance"] = totalOdds < 2 ? "Low" : totalOdds < 5 ? "Moderate" : "High";
      const safetyMessage = variance === "Low" ? "Low variance selection. Within typical risk thresholds." : variance === "Moderate" ? "Moderate variance selection. Please review your deposit limits." : "High variance selection. Consider reducing your stake.";
      const systemNotices: string[] = [];
      if (showPlayerMarketFallback && interpretedPlayerRequest) { systemNotices.push(`System Notice: ${interpretedPlayerRequest.market} odds for ${interpretedPlayerRequest.selection} are not currently listed for this fixture. Showing all available match markets instead.`); }
      if (region === "it") { systemNotices.push("Avviso di Sistema: La normativa ADM vieta termini promozionali. Presentazione dei soli dati di quota neutrali."); }

      const slip: SlipResponse = { match: `${matchedEvent.home_team} vs ${matchedEvent.away_team}`, sport: matchedSport.sport, sportIcon: matchedSport.icon, competition, kickoff, isSingleMatch: true, legs, totalOdds, stake: 0, potentialReturn: 0, probability, variance, safetyMessage, operators, systemNotices, source: "fixture-markets", marketOptions, bookmakerOdds, eventId: matchedEvent.id, sportKey: matchedSport.key };
      return new Response(JSON.stringify(slip), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const legs: Leg[] = []; const systemNotices: string[] = []; let hasMissingLeg = false;
    if (text.includes("high school") || text.includes("youth") || text.includes("under 18") || text.includes("u18")) { systemNotices.push("System Notice: Regulatory rules prohibit sports betting on high school sports, youth academy events, and under-18 competitions."); }
    if ((text.includes("college") || text.includes("ncaa")) && (text.includes("props") || text.includes("player")) && region === "us") { systemNotices.push("System Notice: State regulations prohibit betting on college athlete player props in NY, MA, OH, MD, VT, and TN."); }
    if ((text.includes("college") || text.includes("ncaa")) && (text.includes("new york") || text.includes("new jersey") || text.includes("nj") || text.includes("ny")) && region === "us") { systemNotices.push("System Notice: State regulations prohibit betting on in-state college teams in NY, NJ, MA, CT, IL, and VA."); }
    if (region === "it") { systemNotices.push("Avviso di Sistema: La normativa ADM vieta termini promozionali. Presentazione dei soli dati di quota neutrali."); }
    for (const requested of requestedLegs) {
      let bestMatch: { leg: Leg; operatorKey: string } | null = null; let anyOperatorHasIt = false;
      for (const bookmaker of matchedEvent.bookmakers ?? []) {
        const selection = findBookmakerSelection(bookmaker, {
          id: "lookup",
          selection: requested.selection,
          market: requested.market,
          marketApiKey: requested.marketApiKey,
          point: requested.point,
          outcomeName: requested.outcomeName,
          odds: 0,
          result: "Pending",
          features: [],
        });
        if (!selection) continue;
        anyOperatorHasIt = true;
        if (!bestMatch || selection.outcome.price > bestMatch.leg.odds) {
          const features = detectFeatures(requested.selection, selection.market.key, bookmaker.key);
          const resolvedSelection = isPlayerMarketKey(selection.market.key)
            ? resolveCanonicalPlayerSelection(selection.outcome, requested.selection)
            : requested.selection;
          bestMatch = {
            leg: { id: `leg-${legs.length + 1}`, selection: resolvedSelection, market: requested.market, marketApiKey: selection.market.key, point: requested.point, outcomeName: requested.outcomeName, odds: selection.outcome.price, result: "Pending", features },
            operatorKey: bookmaker.key,
          };
        }
      }
      if (bestMatch) { legs.push(bestMatch.leg); } else { hasMissingLeg = true; if (!anyOperatorHasIt) { systemNotices.push(`System Notice: The requested market "${requested.selection}" is currently unavailable or unlisted by operators for this fixture. Please select an active market line.`); } }
    }
    if (hasMissingLeg || legs.length === 0 || legs.length !== requestedLegs.length) { return noOddsFoundResponse("The requested selection is not currently listed for this fixture.", "requested_selection_unavailable"); }
    const _isUSLive = matchedSport.key.startsWith("basketball") || matchedSport.key.startsWith("americanfootball") || matchedSport.key.startsWith("baseball") || matchedSport.key.startsWith("icehockey");
    const _h2hLabelLive = _isUSLive ? "Moneyline" : matchedSport.key.startsWith("tennis") ? "Match Winner" : "Match Result (1X2)";
    const _totalsLabelLive = matchedSport.key.startsWith("soccer") ? "Over/Under Total Goals" : "Total Points";
    for (const leg of legs) { if (leg.market === "Match Result (1X2)") leg.market = _h2hLabelLive; else if (leg.market === "Over/Under Total Goals" && !matchedSport.key.startsWith("soccer")) leg.market = _totalsLabelLive; }
    const totalOdds = legs.reduce((acc, leg) => acc * leg.odds, 1);
    const probability = Math.round((1 / totalOdds) * 100);
    const variance: SlipResponse["variance"] = totalOdds < 2 ? "Low" : totalOdds < 5 ? "Moderate" : "High";
    const safetyMessage = variance === "Low" ? "Low variance selection. Within typical risk thresholds." : variance === "Moderate" ? "Moderate variance selection. Please review your deposit limits." : "High variance selection. Consider reducing your stake.";
    const bookmakerOddsLive = buildBookmakerOdds(matchedEvent);
    const operators = buildOperatorOffers(matchedEvent, legs, cfg, matchedEvent.id, matchedSport.key, region);
    const anyAvailable = (operators || []).some((o) => o?.available);
    if (!anyAvailable) { systemNotices.push(UNLISTED_NOTICE); }
    const slip: SlipResponse = { match: `${matchedEvent.home_team} vs ${matchedEvent.away_team}`, sport: matchedSport.sport, sportIcon: matchedSport.icon, competition, kickoff, isSingleMatch: true, legs, totalOdds, stake: 0, potentialReturn: 0, probability, variance, safetyMessage, operators, systemNotices, source: "live", bookmakerOdds: bookmakerOddsLive, eventId: matchedEvent.id, sportKey: matchedSport.key };
    return new Response(JSON.stringify(slip), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error("ODDS FETCH ERROR:", err);
    return new Response(JSON.stringify({ error: UNLISTED_NOTICE }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
