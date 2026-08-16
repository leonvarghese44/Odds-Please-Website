import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ODDS_API_BASE = "https://api.the-odds-api.com/v4";
const API_KEY = Deno.env.get("ODDS_API_KEY") ?? "ccb5cfa1c1d8909e7668399923bbec06";

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
  { key: "tennis_atp_singles", sport: "Tennis", icon: "\ud83c\udfbe", hints: ["tennis", "atp", "alcaraz", "carlos alcaraz", "djokovic", "novak djokovic", "sinner", "jannik sinner", "medvedev", "daniil medvedev", "federer", "roger federer", "nadal", "rafa nadal", "zverev", "alexander zverev", "wimbledon", "us open", "french open", "australian open", "tsitsipas", "rublev", "hurkacz", "ruud", "khachanov", "de minaur", "fritz", "shelton", "tiafoe", "paul"] },
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
  uk: ["soccer_epl", "soccer_efl_champ", "soccer_england_league1", "soccer_england_league2", "soccer_scotland_prem", "soccer_uefa_champs_league", "soccer_uefa_europa_league", "soccer_uefa_europa_conference_league", "soccer_england_efl_cup", "soccer_england_fa_cup", "soccer_spain_la_liga", "soccer_germany_bundesliga", "soccer_france_ligue_one", "soccer_germany_bundesliga2", "soccer_france_ligue2", "soccer_netherlands_eredivisie", "soccer_portugal_primeira_liga", "soccer_uefa_nations_league", "soccer_italy_serie_a", "soccer_italy_serie_b", "soccer_spain_segunda_division", "tennis_atp_singles", "rugby_league_super_league"],
  us: ["americanfootball_nfl", "basketball_nba", "baseball_mlb", "icehockey_nhl", "soccer_epl", "soccer_uefa_champs_league", "soccer_uefa_europa_league", "soccer_spain_la_liga", "soccer_germany_bundesliga", "soccer_france_ligue_one", "soccer_italy_serie_a", "soccer_uefa_nations_league", "tennis_atp_singles"],
  it: ["soccer_italy_serie_a", "soccer_italy_serie_b", "soccer_uefa_champs_league", "soccer_uefa_europa_league", "soccer_uefa_europa_conference_league", "soccer_italy_coppa_italia", "soccer_spain_la_liga", "soccer_germany_bundesliga", "soccer_france_ligue_one", "soccer_epl", "soccer_uefa_nations_league", "tennis_atp_singles", "motorsport_f1"],
};

function getSportsForRegion(region: string): SportMapping[] {
  const keys = REGION_SPORTS[region] ?? Object.values(REGION_SPORTS).flat();
  const keySet = new Set(keys);
  return SPORT_MAP.filter((s) => keySet.has(s.key));
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

interface OddsApiLink { rel?: string; href?: string; }
interface OddsApiOutcome { name: string; price: number; point?: number; link?: string; }
interface OddsApiMarket { key: string; outcomes: OddsApiOutcome[]; description?: string; link?: string; }
interface OddsApiBookmaker { key: string; title: string; link?: string; markets: OddsApiMarket[]; }
interface OddsApiEventOdds { id: string; sport_key: string; commence_time: string; home_team: string; away_team: string; bookmakers: OddsApiBookmaker[]; }

interface Leg { id: string; selection: string; market: string; marketApiKey?: string; point?: number; odds: number; result: string; features: string[]; prevOdds?: number; }
interface MarketOption { market: string; label: string; outcomes: { name: string; price: number; point?: number }[]; apiKey?: string; }
interface OperatorOffer { key: string; name: string; available: boolean; combinedOdds: number | null; deepLink: string; missingLegs: string[]; }
interface CandidateFixture { eventId: string; match: string; sportKey: string; sport: string; sportIcon: string; competition: string; kickoff: string; }
interface BookmakerOutcome { name: string; price: number; point?: number; link?: string; }
interface BookmakerMarket { key: string; outcomes: BookmakerOutcome[]; link?: string; }
interface BookmakerOdds { key: string; name: string; markets: BookmakerMarket[]; link?: string; }
interface SlipResponse {
  match: string; sport: string; sportIcon: string; competition: string; kickoff: string; isSingleMatch: boolean;
  legs: Leg[]; totalOdds: number; stake: number; potentialReturn: number; probability: number;
  variance: "Low" | "Moderate" | "High"; safetyMessage: string; operators: OperatorOffer[]; systemNotices: string[];
  source: "live" | "fallback" | "fixture-markets" | "disambiguation"; marketOptions?: MarketOption[];
  bookmakerOdds?: BookmakerOdds[]; candidateFixtures?: CandidateFixture[]; eventId?: string; sportKey?: string;
}

const OPERATOR_NAMES: Record<string, string> = {
  paddypower: "Paddy Power", skybet: "Sky Bet", betfair_sb_uk: "Betfair", betfair_ex_uk: "Betfair Exchange",
  pokerstars: "PokerStars", fanduel: "FanDuel", draftkings: "DraftKings", sisal: "Sisal", snai: "SNAI",
  betfair_ex_eu: "Betfair Exchange", williamhill: "William Hill", coral: "Coral", "ladbrokes_uk": "Ladbrokes", betvictor: "BetVictor",
};

const REGION_BOOKMAKERS: Record<string, { regions: string; bookmakers: string[] }> = {
  uk: { regions: "uk", bookmakers: ["paddypower", "skybet", "betfair_sb_uk", "betfair_ex_uk", "williamhill", "coral", "ladbrokes_uk", "betvictor"] },
  us: { regions: "us", bookmakers: ["fanduel", "draftkings"] },
  it: { regions: "eu", bookmakers: ["sisal", "snai", "pokerstars", "betfair_sb_uk", "betfair_ex_eu"] },
};

const UNLISTED_NOTICE = "System Notice: Live odds for this specific matchup are currently unlisted or undergoing line updates by licensed operators. Please try selecting another active fixture.";

function buildDeepLink(operatorKey: string, eventId: string, sportKey: string, region?: string): string {
  switch (operatorKey) {
    case "paddypower": return `https://www.paddypower.com/football?eventId=${eventId}`;
    case "skybet": return `https://www.skybet.com/football`;
    case "betfair_sb_uk": return region === "it" ? `https://www.betfair.it/sport/football/event?eventId=${eventId}` : `https://www.betfair.com/sport/football/event?eventId=${eventId}`;
    case "betfair_ex_uk": return `https://www.betfair.com/exchange/plus/football/event?eventId=${eventId}`;
    case "fanduel": return `https://sportsbook.fanduel.com/navigation/${sportKey}?event=${eventId}`;
    case "draftkings": return `https://sportsbook.draftkings.com/sitesearch?search=${eventId}`;
    case "sisal": return `https://www.sisal.it/scommesse-matchpoint/search?q=${eventId}`;
    case "snai": return `https://www.snai.it/sport/search?q=${eventId}`;
    case "pokerstars": return `https://www.pokerstars.it/sports/search?q=${eventId}`;
    case "betfair_ex_eu": return `https://www.betfair.it/exchange/plus/football/event?eventId=${eventId}`;
    case "williamhill": return `https://www.williamhill.com/football`;
    case "coral": return `https://www.coral.co.uk/football`;
    case "ladbrokes_uk": return `https://www.ladbrokes.com/football`;
    case "betvictor": return `https://www.betvictor.com/football`;
    default: return "#";
  }
}

function getNativeBookmakerLink(bookmaker: OddsApiBookmaker | undefined, _marketKey: string): string | null {
  if (!bookmaker) return null;
  for (const market of bookmaker.markets ?? []) { for (const outcome of market?.outcomes ?? []) { if (outcome?.link) return outcome.link; } }
  for (const market of bookmaker.markets ?? []) { if (market?.link) return market.link; }
  if (bookmaker.link) return bookmaker.link;
  return null;
}

function detectFeatures(selection: string, market: string, operatorKey: string): string[] {
  const features: string[] = [];
  const lower = (selection + " " + market).toLowerCase();
  if (operatorKey === "paddypower" && (lower.includes("player") || lower.includes("props") || lower.includes("anytime") || lower.includes("score"))) { features.push("super_sub"); }
  return features;
}

function resolveAlias(name: string): string {
  const lower = name.toLowerCase().trim();
  for (const [canonical, aliases] of Object.entries(TEAM_ALIASES)) {
    if (lower === canonical) return canonical;
    if ((aliases || []).some((a) => lower === a)) return canonical;
  }
  return lower;
}

function textMatchesTeam(text: string, teamName: string): boolean {
  if (!teamName) return false;
  const teamLower = teamName.toLowerCase();
  const resolved = resolveAlias(teamLower);
  if (text.includes(resolved)) return true;
  if (text.includes(teamLower)) return true;
  for (const [canonical, aliases] of Object.entries(TEAM_ALIASES)) {
    if (teamLower === canonical || (aliases || []).includes(teamLower)) {
      if (text.includes(canonical)) return true;
      if ((aliases || []).some((a) => text.includes(a))) return true;
    }
  }
  const words = (teamLower.split(/\s+/) || []).filter((w) => w.length > 2);
  return (words || []).some((w) => text.includes(w));
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

interface RequestedLeg { selection: string; market: string; marketApiKey?: string; point?: number; }

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

function resolveMarketApiKeys(marketLabel: string): string[] { return MARKET_LABEL_TO_API_KEYS[marketLabel] ?? []; }

function parseRequestedLegs(text: string, event: OddsApiEventOdds): RequestedLeg[] {
  const legs: RequestedLeg[] = [];
  const seen = new Set<string>();
  if (!event?.home_team || !event?.away_team) return legs;
  const addLeg = (selection: string, market: string, marketApiKey?: string, point?: number) => {
    const normalized = normalizeMarket(market);
    const key = `${selection.toLowerCase()}|${normalized.toLowerCase()}|${point ?? ""}`;
    if (!seen.has(key)) { seen.add(key); legs.push({ selection, market: normalized, marketApiKey, point }); }
  };

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
    addLeg(bttsYes ? "Yes" : "No", "BTTS", "btts");
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
    addLeg(`${isOver ? "Over" : "Under"} ${line} ${isSoccer ? "Goals" : "Points"}`, isSoccer ? "Over/Under Total Goals" : "Total Points", "totals", line);
  } else if (/\b(over|under)\s+(\d+\.?\d*)\b/i.test(text)) {
    const m = text.match(/(?:over|under)\s+(\d+\.?\d*)/i);
    if (m?.[1]) { const line = parseFloat(m[1]); const isSoccer = (event.sport_key ?? "").startsWith("soccer"); addLeg(`Over ${line} ${isSoccer ? "Goals" : "Points"}`, isSoccer ? "Over/Under Total Goals" : "Total Points", "totals", line); }
  }
  const spreadMatch = text.match(/([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\s*([+-])\s*(\d+\.?\d*)/);
  if (spreadMatch?.[1] && spreadMatch?.[3]) {
    const team = spreadMatch[1]; const sign = spreadMatch[2]; const lineVal = parseFloat(spreadMatch[3]);
    const point = sign === "-" ? -lineVal : lineVal; const line = `${sign}${lineVal}`;
    if (textMatchesTeam(team, event.home_team)) { addLeg(`${event.home_team} ${line}`, "Spread", "spreads", point); }
    else if (textMatchesTeam(team, event.away_team)) { addLeg(`${event.away_team} ${line}`, "Spread", "spreads", point); }
  }
  const scorerMatch = text.match(/(\b[A-Z][a-z]+\s[A-Z][a-z]+\b)\s+(?:to score|score|anytime|anytime scorer|goalscorer|goal scorer)/i);
  if (scorerMatch?.[1]) { addLeg(scorerMatch[1], "Anytime Goalscorer", "player_goal_scorer_anytime"); }
  const firstScorerMatch = text.match(/(\b[A-Z][a-z]+\s[A-Z][a-z]+\b)\s+(?:first goal|first scorer|first goalscorer|to score first)/i);
  if (firstScorerMatch?.[1]) { addLeg(firstScorerMatch[1], "First Goalscorer", "player_goal_scorer_first"); }
  const sotMatch = text.match(/(\b[A-Z][a-z]+\s[A-Z][a-z]+\b)\s+(?:shots on target|shot on target|sot)/i);
  if (sotMatch?.[1]) { addLeg(sotMatch[1], "Player Shots on Target", "player_shots_on_target"); }
  const pointsMatch = text.match(/(\b[A-Z][a-z]+\s[A-Z][a-z]+\b)\s+(\d+)\+?\s*(?:points|pts)/i);
  if (pointsMatch?.[1]) { addLeg(pointsMatch[1], "Player Points", "player_points"); }
  const reboundsMatch = text.match(/(\b[A-Z][a-z]+\s[A-Z][a-z]+\b)\s+(\d+)\+?\s*(?:rebounds|reb)/i);
  if (reboundsMatch?.[1]) { addLeg(reboundsMatch[1], "Player Rebounds", "player_rebounds"); }
  const assistsMatch = text.match(/(\b[A-Z][a-z]+\s[A-Z][a-z]+\b)\s+(\d+)\+?\s*(?:assists|ast)/i);
  if (assistsMatch?.[1]) { addLeg(assistsMatch[1], "Player Assists", "player_assists"); }
  const threesMatch = text.match(/(\b[A-Z][a-z]+\s[A-Z][a-z]+\b)\s+(\d+)\+?\s*(?:threes|3.?point|3pt|three pointers)/i);
  if (threesMatch?.[1]) { addLeg(threesMatch[1], "Player 3-Pointers", "player_threes"); }
  const yardsMatch = text.match(/(\b[A-Z][a-z]+\s[A-Z][a-z]+\b)\s+(\d+)\+?\s*(?:pass yards|passing yards|yards)/i);
  if (yardsMatch?.[1]) { addLeg(yardsMatch[1], "Player Pass Yards", "player_pass_yds"); }
  const rushYardsMatch = text.match(/(\b[A-Z][a-z]+\s[A-Z][a-z]+\b)\s+(\d+)\+?\s*(?:rush yards|rushing yards)/i);
  if (rushYardsMatch?.[1]) { addLeg(rushYardsMatch[1], "Player Rush Yards", "player_rush_yds"); }
  const receptionsMatch = text.match(/(\b[A-Z][a-z]+\s[A-Z][a-z]+\b)\s+(\d+)\+?\s*(?:receptions|catches|rec)/i);
  if (receptionsMatch?.[1]) { addLeg(receptionsMatch[1], "Player Receptions", "player_receptions"); }
  const tdMatch = text.match(/(\b[A-Z][a-z]+\s[A-Z][a-z]+\b)\s+anytime\s+(?:td|touchdown)/i);
  if (tdMatch?.[1]) { addLeg(tdMatch[1], "Anytime TD", "player_anytime_td"); }
  const firstTdMatch = text.match(/(\b[A-Z][a-z]+\s[A-Z][a-z]+\b)\s+(?:first td|first touchdown|to score first)/i);
  if (firstTdMatch?.[1]) { addLeg(firstTdMatch[1], "First TD", "player_1st_td"); }
  const hrMatch = text.match(/(\b[A-Z][a-z]+\s[A-Z][a-z]+\b)\s+(?:home run|hr|homer|to hit a home run|to go deep)/i);
  if (hrMatch?.[1]) { addLeg(hrMatch[1], "Player Home Runs", "batter_home_runs"); }
  const hitsMatch = text.match(/(\b[A-Z][a-z]+\s[A-Z][a-z]+\b)\s+(\d+)\+?\s*(?:hits)/i);
  if (hitsMatch?.[1]) { addLeg(hitsMatch[1], "Player Hits", "batter_hits"); }
  const ksMatch = text.match(/(\b[A-Z][a-z]+\s[A-Z][a-z]+\b)\s+(\d+)\+?\s*(?:strikeouts|ks|k's)/i);
  if (ksMatch?.[1]) { addLeg(ksMatch[1], "Pitcher Strikeouts", "pitcher_strikeouts"); }
  const nhlGoalsMatch = text.match(/(\b[A-Z][a-z]+\s[A-Z][a-z]+\b)\s+(?:to score|anytime goal|goal scorer|goals)/i);
  if (nhlGoalsMatch?.[1] && (event.sport_key ?? "").startsWith("icehockey")) { addLeg(nhlGoalsMatch[1], "Player Goals", "player_goals"); }
  const nhlAnytimeMatch = text.match(/(\b[A-Z][a-z]+\s[A-Z][a-z]+\b)\s+anytime\s+(?:goal|score)/i);
  if (nhlAnytimeMatch?.[1]) { addLeg(nhlAnytimeMatch[1], "Anytime Goal Scorer", "player_goal_scorer_anytime"); }

  const hasDNBorDC = legs.some((l) => l.market === "Draw No Bet" || l.market === "Double Chance");
  const hasCorrectScore = legs.some((l) => l.market === "Correct Score");
  const hasToQualify = legs.some((l) => l.market === "To Qualify");
  if (!hasDNBorDC && !hasCorrectScore && !hasToQualify) {
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
  if (legs.length === 0) { addLeg(event.home_team, "Match Result (1X2)", "h2h"); }
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
      for (const o of market.outcomes ?? []) { if (!o?.name || !o?.price || o.price <= 0) continue; outcomes.push({ name: o.name, price: o.price, point: o.point, link: o.link }); }
      if (outcomes.length > 0) { markets.push({ key: market.key, outcomes, link: market.link }); }
    }
    if (markets.length > 0) { result.push({ key: bookmaker.key, name: OPERATOR_NAMES[bookmaker.key] ?? bookmaker.title ?? bookmaker.key, markets, link: bookmaker.link }); }
  }
  return result;
}

const MARKET_ANCHORED_OPERATORS = new Set(["sisal", "snai", "pokerstars"]);

function marketAnchoredEstimate(realPrice: number, operatorKey: string): number {
  let hash = 0;
  for (let i = 0; i < operatorKey.length; i++) { hash = ((hash << 5) - hash + operatorKey.charCodeAt(i)) | 0; }
  const spread = ((Math.abs(hash) % 101) - 50) / 1000;
  return Math.max(1.01, Math.round((realPrice + spread) * 100) / 100);
}

function findBestOddsForSelection(eventOdds: OddsApiEventOdds, selection: string, marketKey?: string): number | null {
  let best: number | null = null;
  const selectionLower = selection.toLowerCase();
  const firstWord = selectionLower.split(" ")[0];
  for (const bookmaker of eventOdds.bookmakers ?? []) {
    for (const market of bookmaker?.markets ?? []) {
      if (marketKey && market.key !== marketKey) continue;
      for (const outcome of market?.outcomes ?? []) {
        if (!outcome?.name || !outcome?.price || outcome.price <= 0) continue;
        const outcomeLower = outcome.name.toLowerCase();
        if (outcomeLower === selectionLower || outcomeLower.includes(selectionLower) || selectionLower.includes(outcomeLower) || (market.key === "h2h" && (outcomeLower.includes(firstWord) || selectionLower.includes(outcomeLower.split(" ")[0])))) {
          if (best === null || outcome.price > best) { best = outcome.price; }
        }
      }
    }
  }
  return best;
}

function buildFallbackSlip(prediction: string, region: string): SlipResponse {
  const text = prediction.toLowerCase();
  let sport = "Soccer"; let icon = "\u26bd"; let competition = "Match Preview";
  for (const s of SPORT_MAP) { if ((s.hints || []).some((h) => text.includes(h))) { sport = s.sport; icon = s.icon; competition = s.key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()); break; } }
  const cfg = REGION_BOOKMAKERS[region] ?? REGION_BOOKMAKERS.uk;
  const operators: OperatorOffer[] = (cfg.bookmakers || []).map((key) => ({ key, name: OPERATOR_NAMES[key] ?? key, available: false, combinedOdds: null, deepLink: "#", missingLegs: [] }));
  return { match: "Match Preview", sport, sportIcon: icon, competition, kickoff: "Upcoming", isSingleMatch: true, legs: [], totalOdds: 0, stake: 0, potentialReturn: 0, probability: 0, variance: "Low", safetyMessage: "No live odds available for this fixture.", operators, systemNotices: [UNLISTED_NOTICE], source: "fallback" };
}

async function fetchSportOdds(sportKey: string, region: string, bookmakers: string): Promise<OddsApiEventOdds[]> {
  const baseUrl = `${ODDS_API_BASE}/sports/${sportKey}/odds/?apiKey=${API_KEY}&regions=${region}&oddsFormat=american&includeLinks=true&bookmakers=${bookmakers}`;
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

function scoreFixtureMatch(text: string, event: OddsApiEventOdds): number {
  if (!event?.home_team || !event?.away_team) return 0;
  const homeMatched = textMatchesTeam(text, event.home_team);
  const awayMatched = textMatchesTeam(text, event.away_team);
  if (homeMatched && awayMatched) return 2;
  if (homeMatched || awayMatched) return 1;
  return 0;
}

interface CandidateResult { eventOdds: OddsApiEventOdds; sport: SportMapping; score: number; }

async function fetchAndFindCandidates(text: string, region: string, bookmakers: string, sportsToSearch: SportMapping[]): Promise<CandidateResult[]> {
  const fetchResults = await Promise.all((sportsToSearch ?? []).map(async (sport) => ({ sport, events: await fetchSportOdds(sport.key, region, bookmakers) })));
  const candidates: CandidateResult[] = [];
  for (const { sport, events } of fetchResults) {
    for (const event of events ?? []) {
      if (!event?.home_team || !event?.away_team) continue;
      const score = scoreFixtureMatch(text, event);
      if (score > 0) { const sportMeta: SportMapping = sport ?? { key: event.sport_key, sport: "Soccer", icon: "\u26bd", hints: [] }; candidates.push({ eventOdds: event, sport: sportMeta, score }); }
    }
  }
  candidates.sort((a, b) => { if (b.score !== a.score) return b.score - a.score; const aTime = new Date(a.eventOdds.commence_time).getTime() || 0; const bTime = new Date(b.eventOdds.commence_time).getTime() || 0; return aTime - bTime; });
  return candidates;
}

function getMarketBatches(sportKey: string): string[][] {
  const sk = sportKey.toLowerCase();
  if (sk.startsWith("soccer")) return [
    ["h2h","totals","btts","draw_no_bet","double_chance","correct_score"],
    ["btts_h1","correct_score_h1","double_chance_h1","halftime_fulltime","to_qualify","team_totals"],
    ["corners_1x2","alternate_spreads_corners","alternate_totals_corners","alternate_spreads_cards","alternate_totals_cards","alternate_team_totals_corners"],
    ["alternate_spreads","alternate_totals","alternate_team_totals"],
  ];
  if (sk.startsWith("basketball")) return [
    ["h2h","spreads","totals","alternate_spreads","alternate_totals","alternate_team_totals","team_totals"],
    ["h2h_q1","h2h_q2","h2h_q3","h2h_q4","h2h_h1","h2h_h2","spreads_q1","spreads_q2","spreads_q3","spreads_q4","spreads_h1","spreads_h2"],
    ["totals_q1","totals_q2","totals_q3","totals_q4","totals_h1","totals_h2","team_totals_h1","team_totals_h2","team_totals_q1","team_totals_q2","team_totals_q3","team_totals_q4"],
    ["alternate_spreads_q1","alternate_spreads_q2","alternate_spreads_q3","alternate_spreads_q4","alternate_spreads_h1","alternate_spreads_h2","alternate_totals_q1","alternate_totals_q2","alternate_totals_q3","alternate_totals_q4","alternate_totals_h1","alternate_totals_h2"],
    ["alternate_team_totals_h1","alternate_team_totals_h2","alternate_team_totals_q1","alternate_team_totals_q2","alternate_team_totals_q3","alternate_team_totals_q4"],
    ["player_points","player_rebounds","player_assists","player_threes","player_blocks","player_steals","player_turnovers","player_points_rebounds_assists","player_points_rebounds","player_points_assists","player_rebounds_assists","player_blocks_steals"],
    ["player_field_goals","player_frees_made","player_frees_attempts","player_first_basket","player_first_team_basket","player_double_double","player_triple_double"],
    ["player_points_alternate","player_rebounds_alternate","player_assists_alternate","player_blocks_alternate","player_steals_alternate","player_turnovers_alternate","player_threes_alternate"],
  ];
  if (sk.startsWith("americanfootball_nfl") || sk.startsWith("americanfootball_ncaaf")) return [
    ["h2h","spreads","totals","alternate_spreads","alternate_totals","alternate_team_totals","team_totals"],
    ["h2h_q1","h2h_q2","h2h_q3","h2h_q4","h2h_h1","h2h_h2","h2h_3_way_q1","h2h_3_way_q2","h2h_3_way_q3","h2h_3_way_q4","h2h_3_way_h1","h2h_3_way_h2"],
    ["spreads_q1","spreads_q2","spreads_q3","spreads_q4","spreads_h1","spreads_h2","totals_q1","totals_q2","totals_q3","totals_q4","totals_h1","totals_h2"],
    ["alternate_spreads_q1","alternate_spreads_q2","alternate_spreads_q3","alternate_spreads_q4","alternate_spreads_h1","alternate_spreads_h2","alternate_totals_q1","alternate_totals_q2","alternate_totals_q3","alternate_totals_q4","alternate_totals_h1","alternate_totals_h2"],
    ["team_totals_h1","team_totals_h2","team_totals_q1","team_totals_q2","team_totals_q3","team_totals_q4"],
    ["player_pass_tds","player_pass_yds","player_pass_attempts","player_pass_completions","player_pass_interceptions","player_pass_longest_completion","player_pass_rush_yds","player_pass_rush_reception_tds","player_pass_rush_reception_yds"],
    ["player_rush_attempts","player_rush_yds","player_rush_tds","player_rush_longest","player_rush_reception_tds","player_rush_reception_yds","player_receptions","player_reception_yds","player_reception_tds","player_reception_longest"],
    ["player_assists","player_field_goals","player_kicking_points","player_pats","player_sacks","player_solo_tackles","player_tackles_assists","player_defensive_interceptions","player_tds_over","player_1st_td","player_anytime_td","player_last_td"],
  ];
  if (sk.startsWith("icehockey")) return [
    ["h2h","spreads","totals","alternate_spreads","alternate_totals"],
    ["h2h_p1","h2h_p2","h2h_p3","h2h_h1","h2h_h2","h2h_3_way_p1","h2h_3_way_p2","h2h_3_way_p3","spreads_p1","spreads_p2","spreads_p3","totals_p1","totals_p2","totals_p3"],
    ["alternate_spreads_p1","alternate_spreads_p2","alternate_spreads_p3","alternate_totals_p1","alternate_totals_p2","alternate_totals_p3"],
    ["player_points","player_assists","player_goals","player_shots_on_goal","player_blocked_shots","player_power_play_points","player_total_saves","player_goal_scorer_first","player_goal_scorer_last","player_goal_scorer_anytime"],
    ["player_points_alternate","player_assists_alternate","player_goals_alternate","player_shots_on_goal_alternate","player_blocked_shots_alternate","player_power_play_points_alternate","player_total_saves_alternate"],
  ];
  if (sk.startsWith("baseball")) return [
    ["h2h","spreads","totals","alternate_spreads","alternate_totals"],
    ["h2h_1st_1_innings","h2h_1st_3_innings","h2h_1st_5_innings","h2h_1st_7_innings","h2h_3_way_1st_1_innings","h2h_3_way_1st_3_innings","h2h_3_way_1st_5_innings","h2h_3_way_1st_7_innings"],
    ["spreads_1st_1_innings","spreads_1st_3_innings","spreads_1st_5_innings","spreads_1st_7_innings","totals_1st_1_innings","totals_1st_3_innings","totals_1st_5_innings","totals_1st_7_innings"],
    ["alternate_spreads_1st_1_innings","alternate_spreads_1st_3_innings","alternate_spreads_1st_5_innings","alternate_spreads_1st_7_innings","alternate_totals_1st_1_innings","alternate_totals_1st_3_innings","alternate_totals_1st_5_innings","alternate_totals_1st_7_innings"],
    ["batter_home_runs","batter_hits","batter_total_bases","batter_rbis","batter_runs_scored","batter_hits_runs_rbis","batter_singles","batter_doubles","batter_triples","batter_walks","batter_strikeouts","batter_stolen_bases","batter_first_home_run"],
    ["pitcher_strikeouts","pitcher_record_a_win","pitcher_hits_allowed","pitcher_walks","pitcher_earned_runs","pitcher_outs"],
    ["batter_total_bases_alternate","batter_home_runs_alternate","batter_hits_alternate","batter_rbis_alternate","batter_walks_alternate","batter_strikeouts_alternate","batter_runs_scored_alternate","batter_hits_runs_rbis_alternate","batter_singles_alternate","batter_doubles_alternate","batter_triples_alternate"],
    ["pitcher_hits_allowed_alternate","pitcher_walks_alternate","pitcher_earned_runs_alternate","pitcher_strikeouts_alternate","pitcher_outs_alternate"],
  ];
  if (sk.startsWith("tennis")) return [
    ["h2h","spreads","totals","alternate_spreads","alternate_totals","h2h_s1","h2h_s2","spreads_s1","totals_s1","alternate_totals_s1"],
  ];
  return [["h2h","totals","spreads","alternate_spreads","alternate_totals"]];
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

async function fetchEventOdds(eventId: string, sportKey: string, region: string, bookmakers: string): Promise<OddsApiEventOdds | null> {
  const batches = getMarketBatches(sportKey);

  const fetchBatch = async (markets: string[]): Promise<OddsApiEventOdds | null> => {
    // Use the main /odds/ endpoint with eventIds filter -- more reliable than the /events/{id}/odds/ endpoint
    const url = `${ODDS_API_BASE}/sports/${sportKey}/odds/?apiKey=${API_KEY}&regions=${region}&oddsFormat=american&includeLinks=true&bookmakers=${bookmakers}&markets=${markets.join(",")}&eventIds=${eventId}`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        // Fallback to per-event endpoint
        const fallbackUrl = `${ODDS_API_BASE}/sports/${sportKey}/events/${eventId}/odds/?apiKey=${API_KEY}&regions=${region}&oddsFormat=american&includeLinks=true&bookmakers=${bookmakers}&markets=${markets.join(",")}`;
        const fallbackRes = await fetch(fallbackUrl);
        if (!fallbackRes.ok) { console.error(`EVENT ODDS BATCH ERROR: ${sportKey} event=${eventId} status=${res.status}/${fallbackRes.status}`); return null; }
        const fallbackData = await fallbackRes.json();
        if (!fallbackData || !fallbackData.id) return null;
        return convertOddsToDecimal([fallbackData])[0] ?? null;
      }
      const data = await res.json();
      const arr = unwrapOdds(data);
      const match = arr.find((e: OddsApiEventOdds) => e.id === eventId);
      if (!match) return null;
      return convertOddsToDecimal([match])[0] ?? null;
    } catch (err) { console.error(`EVENT ODDS BATCH ERROR: ${sportKey} event=${eventId}`, err); return null; }
  };

  const first = await fetchBatch(batches[0]);
  if (!first) return null;

  if (batches.length > 1) {
    const rest = await Promise.all(batches.slice(1).map((b) => fetchBatch(b)));
    for (const extra of rest) { if (extra) mergeBookmakers(first, extra); }
  }

  return first;
}

async function fetchSpecificEvent(eventId: string, sportKey: string, region: string, bookmakers: string): Promise<{ eventOdds: OddsApiEventOdds; sport: SportMapping } | null> {
  const sportMeta = SPORT_MAP.find((s) => s.key === sportKey) ?? { key: sportKey, sport: "Soccer", icon: "\u26bd", hints: [] };
  const eventOdds = await fetchEventOdds(eventId, sportKey, region, bookmakers);
  if (eventOdds) return { eventOdds, sport: sportMeta };
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
    const fallbackDeepLink = buildDeepLink(bookmakerKey, eventId, sportKey, region);
    if (!bookmaker) {
      if (region === "it" && MARKET_ANCHORED_OPERATORS.has(bookmakerKey) && legs.length > 0) {
        const legOdds: number[] = []; let allAnchored = true;
        for (const leg of legs) { const bestReal = findBestOddsForSelection(eventOdds, leg.selection); if (bestReal !== null && bestReal > 0) { legOdds.push(marketAnchoredEstimate(bestReal, bookmakerKey)); } else { allAnchored = false; break; } }
        if (allAnchored && legOdds.length === legs.length) { operators.push({ key: bookmakerKey, name: operatorName, available: true, combinedOdds: legOdds.reduce((acc, o) => acc * o, 1), deepLink: fallbackDeepLink, missingLegs: [] }); continue; }
      }
      operators.push({ key: bookmakerKey, name: operatorName, available: false, combinedOdds: null, deepLink: fallbackDeepLink, missingLegs: legs.map((l) => l.selection) }); continue;
    }
    const nativeLink = region === "it" ? null : getNativeBookmakerLink(bookmaker, "h2h");
    const deepLink = nativeLink ?? fallbackDeepLink;
    const legOdds: number[] = []; const missingLegs: string[] = [];
    for (const leg of legs) {
      let found = false; const selectionLower = leg.selection.toLowerCase(); const firstWord = selectionLower.split(" ")[0];
      for (const market of bookmaker?.markets ?? []) {
        for (const outcome of market?.outcomes ?? []) {
          if (!outcome?.name || !outcome?.price || outcome.price <= 0) continue;
          const outcomeLower = outcome.name.toLowerCase();
          if (outcomeLower === selectionLower || outcomeLower.includes(selectionLower) || selectionLower.includes(outcomeLower) || (market.key === "h2h" && (outcomeLower.includes(firstWord) || selectionLower.includes(outcomeLower.split(" ")[0])))) { legOdds.push(outcome.price); found = true; break; }
        }
        if (found) break;
      }
      if (!found) { missingLegs.push(leg.selection); }
    }
    if (missingLegs.length === 0 && legOdds.length === legs.length) { operators.push({ key: bookmakerKey, name: operatorName, available: true, combinedOdds: legOdds.reduce((acc, o) => acc * o, 1), deepLink, missingLegs: [] }); }
    else { operators.push({ key: bookmakerKey, name: operatorName, available: false, combinedOdds: null, deepLink, missingLegs }); }
  }
  return operators;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") { return new Response(null, { status: 200, headers: corsHeaders }); }
  try {
    const body = await req.json().catch(() => ({})) as { prediction?: string; region?: string; oddsFormat?: string; eventId?: string; sportKey?: string; market?: string; };
    const prediction = body?.prediction ?? "";
    const region = (body?.region ?? "uk").toLowerCase();
    const selectedEventId = body?.eventId; const selectedSportKey = body?.sportKey; const selectedMarket = body?.market;
    if (!prediction && !selectedEventId) { return new Response(JSON.stringify({ error: "Prediction text is required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }); }
    const text = prediction.toLowerCase().trim();
    const cfg = REGION_BOOKMAKERS[region] ?? REGION_BOOKMAKERS.uk;
    const bookmakerQuery = (cfg.bookmakers || []).join(",");
    let matchedEvent: OddsApiEventOdds | null = null; let matchedSport: SportMapping | null = null;
    if (selectedEventId && selectedSportKey) { const specific = await fetchSpecificEvent(selectedEventId, selectedSportKey, cfg.regions, bookmakerQuery); if (specific) { matchedEvent = specific.eventOdds; matchedSport = specific.sport; } }
    if (!matchedEvent) {
      if (!prediction) { return new Response(JSON.stringify(buildFallbackSlip(prediction, region)), { headers: { ...corsHeaders, "Content-Type": "application/json" } }); }
      const candidateSports = SPORT_MAP.filter((s) => (s.hints || []).some((h) => text.includes(h)));
      const sportsToSearch = candidateSports.length > 0 ? candidateSports : getSportsForRegion(region);
      const candidates = await fetchAndFindCandidates(text, cfg.regions, bookmakerQuery, sportsToSearch);
      if (candidates.length === 0) { return new Response(JSON.stringify(buildFallbackSlip(prediction, region)), { headers: { ...corsHeaders, "Content-Type": "application/json" } }); }
      const dualTeamCandidates = candidates.filter((c) => c.score === 2);
      const singleTeamCandidates = candidates.filter((c) => c.score === 1);
      if (dualTeamCandidates.length === 1) { matchedEvent = dualTeamCandidates[0].eventOdds; matchedSport = dualTeamCandidates[0].sport; }
      else if (dualTeamCandidates.length === 0 && singleTeamCandidates.length === 1) { matchedEvent = singleTeamCandidates[0].eventOdds; matchedSport = singleTeamCandidates[0].sport; }
      else {
        const candidateFixtures: CandidateFixture[] = candidates.slice(0, 6).map((c) => buildCandidateFixture(c.eventOdds, c.sport));
        const disambiguationSlip: SlipResponse = { match: "Select Matching Fixture", sport: candidates[0].sport.sport, sportIcon: candidates[0].sport.icon, competition: "", kickoff: "", isSingleMatch: false, legs: [], totalOdds: 0, stake: 0, potentialReturn: 0, probability: 0, variance: "Low", safetyMessage: "", operators: [], systemNotices: [], source: "disambiguation", candidateFixtures };
        return new Response(JSON.stringify(disambiguationSlip), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }
    if (!matchedEvent || !matchedSport) { return new Response(JSON.stringify(buildFallbackSlip(prediction, region)), { headers: { ...corsHeaders, "Content-Type": "application/json" } }); }
    const enriched = await fetchEventOdds(matchedEvent.id, matchedSport.key, cfg.regions, bookmakerQuery);

    if (enriched && enriched.bookmakers && enriched.bookmakers.length > 0) { matchedEvent = enriched; }

    if (!matchedEvent.bookmakers || !Array.isArray(matchedEvent.bookmakers) || matchedEvent.bookmakers.length === 0) { return new Response(JSON.stringify(buildFallbackSlip(prediction, region)), { headers: { ...corsHeaders, "Content-Type": "application/json" } }); }
    const kickoffDate = new Date(matchedEvent.commence_time);
    const kickoff = kickoffDate.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
    const competition = (matchedSport.key ?? "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    if (isFixtureOnlyPrompt(text, matchedEvent) || selectedMarket) {
      const marketOptions = buildMarketOptions(matchedEvent, matchedSport.key);
      const bookmakerOdds = buildBookmakerOdds(matchedEvent);
      let defaultLeg: Leg | null = null;
      if (selectedMarket) {
        for (const bookmaker of matchedEvent.bookmakers ?? []) { for (const market of bookmaker?.markets ?? []) { if (market.key === selectedMarket) { for (const outcome of market?.outcomes ?? []) { if (outcome?.price && outcome.price > 0) { defaultLeg = { id: "leg-1", selection: outcome.name, market: market.key === "h2h" ? "Match Result (1X2)" : market.key === "btts" ? "BTTS" : market.key === "totals" ? "Over/Under Total Goals" : market.key, marketApiKey: market.key, odds: outcome.price, result: "Pending", features: detectFeatures(outcome.name, market.key, bookmaker.key) }; break; } } if (defaultLeg) break; } } if (defaultLeg) break; }
      }
      if (!defaultLeg) { const h2hBookmaker = (matchedEvent.bookmakers ?? []).find((b) => (b?.markets ?? []).some((m) => m?.key === "h2h")); if (h2hBookmaker) { const h2h = (h2hBookmaker.markets ?? []).find((m) => m?.key === "h2h"); if (h2h && (h2h.outcomes ?? []).length > 0) { const homeOutcome = (h2h.outcomes ?? []).find((o) => o?.name === matchedEvent.home_team) ?? h2h.outcomes[0]; if (homeOutcome?.price && homeOutcome.price > 0) { defaultLeg = { id: "leg-1", selection: homeOutcome.name, market: "Match Result (1X2)", marketApiKey: "h2h", odds: homeOutcome.price, result: "Pending", features: detectFeatures(homeOutcome.name, "h2h", h2hBookmaker.key) }; } } } }
      if (!defaultLeg) { for (const bookmaker of matchedEvent.bookmakers ?? []) { for (const market of bookmaker?.markets ?? []) { for (const outcome of market?.outcomes ?? []) { if (outcome?.price && outcome.price > 0) { defaultLeg = { id: "leg-1", selection: outcome.name, market: market.key === "h2h" ? "Match Result (1X2)" : market.key, marketApiKey: market.key, odds: outcome.price, result: "Pending", features: detectFeatures(outcome.name, market.key, bookmaker.key) }; break; } } if (defaultLeg) break; } if (defaultLeg) break; } }
      const legs = defaultLeg ? [defaultLeg] : [];
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
      if (region === "it") { systemNotices.push("Avviso di Sistema: La normativa ADM vieta termini promozionali. Presentazione dei soli dati di quota neutrali."); }

      const slip: SlipResponse = { match: `${matchedEvent.home_team} vs ${matchedEvent.away_team}`, sport: matchedSport.sport, sportIcon: matchedSport.icon, competition, kickoff, isSingleMatch: true, legs, totalOdds, stake: 0, potentialReturn: 0, probability, variance, safetyMessage, operators, systemNotices, source: "fixture-markets", marketOptions, bookmakerOdds, eventId: matchedEvent.id, sportKey: matchedSport.key };
      return new Response(JSON.stringify(slip), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const requestedLegs = parseRequestedLegs(text, matchedEvent);
    const legs: Leg[] = []; const systemNotices: string[] = [];
    if (text.includes("high school") || text.includes("youth") || text.includes("under 18") || text.includes("u18")) { systemNotices.push("System Notice: Regulatory rules prohibit sports betting on high school sports, youth academy events, and under-18 competitions."); }
    if ((text.includes("college") || text.includes("ncaa")) && (text.includes("props") || text.includes("player")) && region === "us") { systemNotices.push("System Notice: State regulations prohibit betting on college athlete player props in NY, MA, OH, MD, VT, and TN."); }
    if ((text.includes("college") || text.includes("ncaa")) && (text.includes("new york") || text.includes("new jersey") || text.includes("nj") || text.includes("ny")) && region === "us") { systemNotices.push("System Notice: State regulations prohibit betting on in-state college teams in NY, NJ, MA, CT, IL, and VA."); }
    if (region === "it") { systemNotices.push("Avviso di Sistema: La normativa ADM vieta termini promozionali. Presentazione dei soli dati di quota neutrali."); }
    for (const requested of requestedLegs) {
      let bestMatch: { leg: Leg; operatorKey: string } | null = null; let anyOperatorHasIt = false;
      const apiKeys = requested.marketApiKey ? [requested.marketApiKey] : resolveMarketApiKeys(requested.market);
      for (const bookmaker of matchedEvent.bookmakers ?? []) {
        for (const market of bookmaker?.markets ?? []) {
          if (apiKeys.length > 0 && !apiKeys.includes(market.key)) continue;
          for (const outcome of market?.outcomes ?? []) {
            if (!outcome?.name || !outcome?.price || outcome.price <= 0) continue;
            const outcomeLower = outcome.name.toLowerCase(); const requestedLower = requested.selection.toLowerCase();
            const nameMatches = outcomeLower === requestedLower || outcomeLower.includes(requestedLower) || requestedLower.includes(outcomeLower) || (market.key === "h2h" && (outcomeLower.includes(requestedLower.split(" ")[0]) || requestedLower.includes(outcomeLower.split(" ")[0])));
            if (!nameMatches) continue;
            if (requested.point !== undefined && outcome.point !== undefined) { if (Math.abs(outcome.point - requested.point) > 0.001) continue; }
            if (requested.point !== undefined && outcome.point === undefined) continue;
            anyOperatorHasIt = true;
            if (!bestMatch || outcome.price > bestMatch.leg.odds) { const features = detectFeatures(requested.selection, market.key, bookmaker.key); bestMatch = { leg: { id: `leg-${legs.length + 1}`, selection: requested.selection, market: requested.market, marketApiKey: market.key, point: requested.point, odds: outcome.price, result: "Pending", features }, operatorKey: bookmaker.key }; }
          }
        }
      }
      if (bestMatch) { legs.push(bestMatch.leg); } else if (!anyOperatorHasIt) { systemNotices.push(`System Notice: The requested market "${requested.selection}" is currently unavailable or unlisted by operators for this fixture. Please select an active market line.`); }
    }
    if (legs.length === 0) { const h2hBookmaker = (matchedEvent.bookmakers ?? []).find((b) => (b?.markets ?? []).some((m) => m?.key === "h2h")); if (h2hBookmaker) { const h2h = (h2hBookmaker.markets ?? []).find((m) => m?.key === "h2h"); if (h2h && (h2h.outcomes ?? []).length > 0) { const homeOutcome = (h2h.outcomes ?? []).find((o) => o?.name === matchedEvent.home_team) ?? h2h.outcomes[0]; if (homeOutcome?.price && homeOutcome.price > 0) { legs.push({ id: "leg-1", selection: homeOutcome.name, market: "Match Result (1X2)", odds: homeOutcome.price, result: "Pending", features: detectFeatures(homeOutcome.name, "h2h", h2hBookmaker.key) }); } } } }
    if (legs.length === 0) { for (const bookmaker of matchedEvent.bookmakers ?? []) { for (const market of bookmaker?.markets ?? []) { for (const outcome of market?.outcomes ?? []) { if (outcome?.price && outcome.price > 0) { legs.push({ id: "leg-1", selection: outcome.name, market: market.key === "h2h" ? "Match Result (1X2)" : market.key, odds: outcome.price, result: "Pending", features: detectFeatures(outcome.name, market.key, bookmaker.key) }); break; } } if (legs.length > 0) break; } if (legs.length > 0) break; } }
    if (legs.length === 0) { return new Response(JSON.stringify(buildFallbackSlip(prediction, region)), { headers: { ...corsHeaders, "Content-Type": "application/json" } }); }
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
