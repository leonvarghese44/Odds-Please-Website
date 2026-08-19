import assert from "node:assert/strict";
import test from "node:test";

import {
  extractPlayerParticipantText,
  findUnambiguousPlayerHint,
  playerNamesReferToSameEntity,
  resolveCanonicalPlayerSelection,
} from "../supabase/functions/analyze-prediction/player-resolution.ts";

test("extracts player names from terse and misspelled scoring searches", () => {
  assert.equal(extractPlayerParticipantText("gyokores score"), "gyokores");
  assert.equal(extractPlayerParticipantText("Gyökeres to score"), "gyokeres");
  assert.equal(extractPlayerParticipantText("please bet on gykores anytime goal"), "gykores");
});

test("accepts spelling corrections but rejects a different player", () => {
  assert.equal(playerNamesReferToSameEntity("gyokores", "Viktor Gyökeres"), true);
  assert.equal(playerNamesReferToSameEntity("gykores", "Viktor Gyökeres"), true);
  assert.equal(playerNamesReferToSameEntity("gyokores", "Noni Madueke"), false);
  assert.equal(playerNamesReferToSameEntity("John Smith", "Mike Smith"), false);
});

test("uses only an unambiguous player hint for routing", () => {
  const hints = [
    { participant: "Viktor Gyökeres", aliases: ["gyokeres", "viktor gyokeres"], team: "Arsenal" },
    { participant: "Noni Madueke", aliases: ["madueke", "noni madueke"], team: "Arsenal" },
  ];
  assert.equal(findUnambiguousPlayerHint("gykores", hints)?.participant, "Viktor Gyökeres");
  assert.equal(findUnambiguousPlayerHint("unknown player", hints), null);
});

test("uses the API player description instead of a misspelled query", () => {
  assert.equal(
    resolveCanonicalPlayerSelection({ name: "Yes", description: "Viktor Gyökeres" }, "Gyokores"),
    "Viktor Gyökeres",
  );
});

test("uses a player-valued outcome name when no description is present", () => {
  assert.equal(
    resolveCanonicalPlayerSelection({ name: "Viktor Gyökeres" }, "Gyokores"),
    "Viktor Gyökeres",
  );
});

test("does not replace the request with a generic outcome label", () => {
  assert.equal(resolveCanonicalPlayerSelection({ name: "Over" }, "Gyokores"), "Gyokores");
});
