export type EntityAliasMap = Record<string, string[]>;

const SEARCH_STOPWORDS = new Set([
  "a", "an", "and", "at", "away", "bet", "both", "by", "draw", "first", "for", "game", "goal", "goals", "home", "in", "match", "moneyline", "of", "on", "or", "over", "player", "points", "score", "scorer", "the", "to", "under", "win", "with", "yards", "against", "versus", "vs",
]);
const ENTITY_SUFFIXES = new Set(["afc", "bc", "cf", "fc", "hc", "sc"]);
const GENERIC_TEAM_TOKENS = new Set(["athletic", "albion", "city", "club", "county", "rovers", "town", "united"]);

export function normalizeSearchValue(value: string): string {
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

function getEntityNames(entity: string, aliases: EntityAliasMap): string[] {
  const normalizedEntity = normalizeSearchValue(entity);
  const names = new Set<string>([normalizedEntity]);
  for (const [canonical, entityAliases] of Object.entries(aliases)) {
    const normalizedCanonical = normalizeSearchValue(canonical);
    const normalizedAliases = entityAliases.map(normalizeSearchValue);
    if (normalizedEntity === normalizedCanonical || normalizedAliases.includes(normalizedEntity)) {
      names.add(normalizedCanonical);
      normalizedAliases.forEach((alias) => names.add(alias));
    }
  }
  return [...names].filter(Boolean);
}

export function calculateEntitySimilarity(text: string, entity: string, aliases: EntityAliasMap = {}): number {
  const normalizedText = normalizeSearchValue(text);
  if (!normalizedText || !entity) return 0;
  const queryTokens = normalizedText.split(" ").filter((token) => token.length > 1 && !SEARCH_STOPWORDS.has(token));
  let best = 0;

  for (const name of getEntityNames(entity, aliases)) {
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
    const hasDistinctiveStrongToken = tokenScores.some((score, index) => score >= 0.84 && !GENERIC_TEAM_TOKENS.has(entityTokens[index]));
    const singleDistinctiveToken = entityTokens.length > 1 && hasDistinctiveStrongToken ? 0.84 : 0;
    best = Math.max(best, coverage >= 0.6 ? average : singleDistinctiveToken);
  }
  return best;
}

export function looksLikeFixtureQuery(text: string): boolean {
  return /\b(?:vs\.?|versus|against)\b/i.test(text);
}

interface FixtureIdentity {
  home_team: string;
  away_team: string;
  sport_key?: string;
}

interface FixtureInterpretationHints {
  team_hint?: string;
  opponent_hint?: string;
  participant?: string;
  validated_player_team_hint?: boolean;
}

export function scoreFixtureTextMatch(
  text: string,
  event: FixtureIdentity,
  interpretation: FixtureInterpretationHints | null,
  aliases: EntityAliasMap = {},
): number {
  if (!event?.home_team || !event?.away_team) return 0;
  const similarity = (value: string, entity: string) => calculateEntitySimilarity(value, entity, aliases);
  const homeScore = similarity(text, event.home_team);
  const awayScore = similarity(text, event.away_team);
  let score = (homeScore >= 0.82 ? homeScore * 100 : 0) + (awayScore >= 0.82 ? awayScore * 100 : 0);

  const addValidatedHint = (hint: string | undefined, weight: number, alreadyValidated = false) => {
    if (!hint || (!alreadyValidated && similarity(text, hint) < 0.78)) return;
    const hintScore = Math.max(similarity(hint, event.home_team), similarity(hint, event.away_team));
    if (hintScore >= 0.82) score += weight * hintScore;
  };

  addValidatedHint(interpretation?.team_hint, 180, interpretation?.validated_player_team_hint === true);
  addValidatedHint(interpretation?.opponent_hint, 140);
  if (interpretation?.participant && event.sport_key?.startsWith("tennis")) {
    addValidatedHint(interpretation.participant, 180);
  }
  return score;
}
