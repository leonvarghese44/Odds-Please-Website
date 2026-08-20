import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateEntitySimilarity,
  looksLikeFixtureQuery,
  scoreFixtureTextMatch,
} from "../supabase/functions/analyze-prediction/fixture-resolution.ts";

test("does not treat a generic team suffix as a fixture match", () => {
  assert.ok(calculateEntitySimilarity("Arsenal vs Coventry City", "Leicester City") < 0.82);
  assert.equal(calculateEntitySimilarity("City", "Manchester City"), 0);
});

test("still accepts exact and typo-tolerant distinctive team names", () => {
  assert.equal(calculateEntitySimilarity("Arsenal vs Coventry City", "Coventry City"), 1);
  assert.ok(calculateEntitySimilarity("Covntry", "Coventry City") >= 0.82);
  assert.ok(calculateEntitySimilarity("Arsnal", "Arsenal") >= 0.82);
});

test("ranks the explicitly named fixture above an unrelated City fixture", () => {
  const query = "Arsenal vs Coventry City";
  const correct = scoreFixtureTextMatch(query, {
    home_team: "Arsenal",
    away_team: "Coventry City",
    sport_key: "soccer_epl",
  }, null);
  const wrong = scoreFixtureTextMatch(query, {
    home_team: "Leicester City",
    away_team: "Burton Albion",
    sport_key: "soccer_england_league1",
  }, null);

  assert.equal(correct, 200);
  assert.equal(wrong, 0);
});

test("rejects LLM team hints that are unsupported by the original query", () => {
  const score = scoreFixtureTextMatch(
    "Arsenal vs Coventry City",
    { home_team: "Leicester City", away_team: "Burton Albion", sport_key: "soccer_england_league1" },
    { team_hint: "Leicester City", opponent_hint: "Burton Albion" },
  );
  assert.equal(score, 0);
});

test("recognizes explicit fixture syntax", () => {
  assert.equal(looksLikeFixtureQuery("Arsenal vs Coventry City"), true);
  assert.equal(looksLikeFixtureQuery("Arsenal against Coventry City"), true);
  assert.equal(looksLikeFixtureQuery("Arsenal moneyline"), false);
});
