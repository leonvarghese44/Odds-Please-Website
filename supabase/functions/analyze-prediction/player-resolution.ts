interface PlayerOutcomeIdentity {
  name?: string;
  description?: string;
}

interface PlayerIdentityHint {
  aliases: string[];
}

const GENERIC_PLAYER_OUTCOME_NAMES = new Set(["yes", "no", "over", "under", "score"]);

function normalizePlayerIdentity(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshteinSimilarity(left: string, right: string): number {
  if (left === right) return 1;
  if (!left || !right) return 0;
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  const current = new Array<number>(right.length + 1);
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    current[0] = leftIndex;
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      current[rightIndex] = Math.min(
        current[rightIndex - 1] + 1,
        previous[rightIndex] + 1,
        previous[rightIndex - 1] + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1),
      );
    }
    for (let rightIndex = 0; rightIndex <= right.length; rightIndex += 1) previous[rightIndex] = current[rightIndex];
  }
  return 1 - previous[right.length] / Math.max(left.length, right.length);
}

export function extractPlayerParticipantText(prediction: string): string {
  const normalized = normalizePlayerIdentity(prediction)
    .replace(/^\s*(?:(?:try|please|bet|back|pick)\s+)+(?:on\s+)?/, "");
  if (!normalized) return "";
  return normalized
    .split(/\s+(?:\d+(?:\.\d+)?\s*(?:plus)?|(?:to\s+)?scor\w*|anytime(?:\s+goal)?|first\s+goal|first\s+scorer|shots?\s+on\s+target|points?|pts|rebounds?|assists?|threes?|3\s*pointers?|3pt|pass(?:ing)?\s+yards?|yds?|rush(?:ing)?\s+yards?|receptions?|catches|td|touchdown|home\s+run|homer|hr|hits?|strikeouts?|ks)\b/)[0]
    .trim();
}

export function playerNameSimilarity(enteredName: string, interpretedName: string): number {
  const enteredTokens = normalizePlayerIdentity(enteredName).split(" ").filter((token) => token.length > 1);
  const interpretedTokens = normalizePlayerIdentity(interpretedName).split(" ").filter((token) => token.length > 1);
  if (enteredTokens.length === 0 || interpretedTokens.length === 0) return 0;

  const tokenScores = enteredTokens.map((enteredToken) => Math.max(
    ...interpretedTokens.map((interpretedToken) => {
      if (enteredToken === interpretedToken) return 1;
      if (Math.min(enteredToken.length, interpretedToken.length) < 4) return 0;
      return levenshteinSimilarity(enteredToken, interpretedToken);
    }),
  ));
  if (enteredTokens.length === 1) return tokenScores[0];

  const average = tokenScores.reduce((sum, score) => sum + score, 0) / enteredTokens.length;
  const enteredFirstName = enteredTokens[0];
  const interpretedFirstName = interpretedTokens[0];
  const plausibleNickname = enteredFirstName.length <= 3 || enteredFirstName[0] === interpretedFirstName[0];
  const distinctiveSurnameMatch = plausibleNickname && tokenScores.some((score) => score >= 0.88);
  return distinctiveSurnameMatch ? Math.max(0.84, average) : average;
}

export function playerNamesReferToSameEntity(enteredName: string, interpretedName: string): boolean {
  return playerNameSimilarity(enteredName, interpretedName) >= 0.72;
}

export function findUnambiguousPlayerHint<T extends PlayerIdentityHint>(
  enteredName: string,
  hints: T[],
): T | null {
  let bestHint: T | null = null;
  let bestScore = 0;
  let secondScore = 0;

  for (const hint of hints) {
    const score = Math.max(0, ...hint.aliases.map((alias) => playerNameSimilarity(enteredName, alias)));
    if (score > bestScore) {
      secondScore = bestScore;
      bestScore = score;
      bestHint = hint;
    } else if (score > secondScore) {
      secondScore = score;
    }
  }

  return bestScore >= 0.72 && bestScore - secondScore >= 0.08 ? bestHint : null;
}

export function resolveCanonicalPlayerSelection(
  outcome: PlayerOutcomeIdentity,
  requestedSelection: string,
): string {
  const description = outcome.description?.trim();
  if (description && !GENERIC_PLAYER_OUTCOME_NAMES.has(normalizePlayerIdentity(description))) return description;

  const outcomeName = outcome.name?.trim();
  if (outcomeName && !GENERIC_PLAYER_OUTCOME_NAMES.has(normalizePlayerIdentity(outcomeName))) return outcomeName;

  return requestedSelection;
}
