import { useState, useEffect, useMemo } from 'react';
import { Wifi, AlertCircle, ArrowRight, ArrowUpRight, Layers, Trophy, Clock, Loader2, Crown, Eye, EyeOff, SlidersHorizontal, CircleDot, Dribbble, Circle, Disc, Target, Flag, Swords, Gauge, Shield, Gamepad2, Tv, Clapperboard, Music, Landmark, TrendingUp, Zap } from 'lucide-react';
import type { BetSlip, Region, Language, OddsFormat, OperatorOffer, CandidateFixture, BookmakerOdds } from '../constants';
import { REGION_CONFIG, DIALECT } from '../constants';
import { formatOdds } from '../utils/odds';
import { EventHeaderCard } from './EventHeaderCard';
import { FeatureBadge } from './FeatureBadge';
import { ResponsibleGamblingNotice } from './ResponsibleGamblingNotice';
import { StakeSelector } from './StakeSelector';

const LEAGUE_NAME_MAP: Record<string, string> = {
  soccer_epl: 'Premier League',
  soccer_uefa_champs_league: 'Champions League',
  soccer_uefa_europa_league: 'Europa League',
  soccer_italy_serie_a: 'Serie A',
  soccer_spain_la_liga: 'La Liga',
  soccer_germany_bundesliga: 'Bundesliga',
  soccer_france_ligue_one: 'Ligue 1',
  soccer_usa_mls: 'MLS',
  soccer_fa_cup: 'FA Cup',
  soccer_efl_champ: 'EFL Championship',
  americanfootball_nfl: 'NFL',
  americanfootball_ncaaf: 'NCAAF',
  basketball_nba: 'NBA',
  basketball_ncaab: 'NCAAB',
  baseball_mlb: 'MLB',
  icehockey_nhl: 'NHL',
  mma_mixed_martial_arts: 'UFC / MMA',
  tennis_atp: 'ATP / WTA Tennis',
  tennis_wta: 'ATP / WTA Tennis',
  boxing_boxing: 'Boxing',
  darts_pdc: 'PDC Darts',
  snooker_world_championship: 'World Snooker Championship',
  golf_pga: 'PGA Tour',
  golf_european_tour: 'European Tour',
  motorsport_f1: 'Formula 1',
  motorsport_moto_gp: 'MotoGP',
  motorsport_nascar: 'NASCAR',
  horse_racing_uk: 'UK Horse Racing',
  horse_racing_us: 'US Horse Racing',
  cricket_test: 'Test Cricket',
  cricket_odi: 'ODI Cricket',
  cricket_t20: 'T20 Cricket',
  rugby_union: 'Rugby Union',
  rugby_league: 'Rugby League',
  esports_csgo: 'CS:GO',
  esports_lol: 'League of Legends',
  esports_dota2: 'Dota 2',
  tv_specials_uk: 'UK TV Specials',
  entertainment_oscars: 'The Academy Awards',
  politics_us_presidential: 'US Presidential Election',
  politics_uk_general: 'UK General Election',
  eurovision_song_contest: 'Eurovision Song Contest',
  music_eurovision: 'Eurovision Song Contest',
  financials_crypto: 'Crypto Markets',
  financials_stock: 'Stock Markets',
};

export function formatLeagueName(sportKey: string): string {
  const key = sportKey.toLowerCase().trim();
  return LEAGUE_NAME_MAP[key] ?? sportKey.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getCategoryIcon(sportKey: string): JSX.Element {
  const key = sportKey.toLowerCase().trim();
  const prefix = key.split('_')[0];
  const svgProps = { viewBox: '0 0 24 24', fill: 'none', stroke: '#63FF0E', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, className: 'w-5 h-5' };
  if (prefix === 'soccer') return (
    <svg {...svgProps}><circle cx="12" cy="12" r="9" /><path d="m12 7 2.5 2 1.5 3-2 2.5h-4l-2-2.5 1.5-3Z" /><path d="M12 3v4M14.5 9 19 8M16 12l4 2M14 14.5l2 4.5M10 14.5l-2 4.5M8 12l-4 2M9.5 9 5 8M12 21v-4" /></svg>
  );
  if (prefix === 'americanfootball') return (
    <svg {...svgProps}><path d="M4 12C4 6.5 7.5 3 13 3c4.5 0 8 3.5 8 9s-3.5 9-8 9c-5.5 0-9-3.5-9-9z" transform="rotate(-45 12 12)" /><path d="M8 16l8-8M10 11l3 3M11 9l3 3M12 13l2 2" /></svg>
  );
  if (prefix === 'rugby') return (
    <svg {...svgProps}><ellipse cx="12" cy="12" rx="10" ry="6" transform="rotate(-45 12 12)" /><path d="M5 19c7-2 11-6 14-14M8 20c5-3 9-7 11-13" /></svg>
  );
  if (prefix === 'basketball') return <Dribbble className="w-5 h-5 text-[#63FF0E]" />;
  if (prefix === 'baseball') return <Circle className="w-5 h-5 text-[#63FF0E]" />;
  if (prefix === 'icehockey') return <Disc className="w-5 h-5 text-[#63FF0E]" />;
  if (prefix === 'tennis') return <Circle className="w-5 h-5 text-[#63FF0E]" />;
  if (prefix === 'darts') return <Target className="w-5 h-5 text-[#63FF0E]" />;
  if (prefix === 'snooker') return <CircleDot className="w-5 h-5 text-[#63FF0E]" />;
  if (prefix === 'golf') return <Flag className="w-5 h-5 text-[#63FF0E]" />;
  if (prefix === 'mma' || prefix === 'boxing') return <Swords className="w-5 h-5 text-[#63FF0E]" />;
  if (prefix === 'motorsport' || prefix === 'formula1' || prefix === 'formula_1') return <Gauge className="w-5 h-5 text-[#63FF0E]" />;
  if (prefix === 'horse' || prefix === 'horse_racing') return <Crown className="w-5 h-5 text-[#63FF0E]" />;
  if (prefix === 'cricket') return <CircleDot className="w-5 h-5 text-[#63FF0E]" />;
  if (prefix === 'esports' || prefix === 'csgo' || prefix === 'lol' || prefix === 'dota2') return <Gamepad2 className="w-5 h-5 text-[#63FF0E]" />;
  if (prefix === 'tv' || prefix === 'entertainment') return <Tv className="w-5 h-5 text-[#63FF0E]" />;
  if (prefix === 'awards' || prefix === 'oscars') return <Clapperboard className="w-5 h-5 text-[#63FF0E]" />;
  if (prefix === 'eurovision' || prefix === 'music') return <Music className="w-5 h-5 text-[#63FF0E]" />;
  if (prefix === 'politics' || prefix === 'elections') return <Landmark className="w-5 h-5 text-[#63FF0E]" />;
  if (prefix === 'financials' || prefix === 'crypto') return <TrendingUp className="w-5 h-5 text-[#63FF0E]" />;
  return <Zap className="w-5 h-5 text-[#63FF0E]" />;
}

function getLocalizedSportName(sportKey: string, region: Region): string {
  const key = sportKey.toLowerCase().trim();
  const prefix = key.split('_')[0];
  if (region === 'IT') {
    if (prefix === 'soccer') return 'Calcio';
    if (prefix === 'basketball') return 'Pallacanestro';
    if (prefix === 'americanfootball') return 'Football Americano';
    if (prefix === 'baseball') return 'Baseball';
    if (prefix === 'icehockey') return 'Hockey su Ghiaccio';
    if (prefix === 'tennis') return 'Tennis';
    if (prefix === 'mma') return 'MMA';
    if (prefix === 'boxing') return 'Pugilato';
    return sportKey.replace(/_/g, ' ');
  }
  if (region === 'US') {
    if (prefix === 'soccer') return 'Soccer';
    if (prefix === 'basketball') return 'Basketball';
    if (prefix === 'americanfootball') return 'Football';
    if (prefix === 'baseball') return 'Baseball';
    if (prefix === 'icehockey') return 'Hockey';
    if (prefix === 'tennis') return 'Tennis';
    if (prefix === 'mma') return 'MMA';
    if (prefix === 'boxing') return 'Boxing';
    return sportKey.replace(/_/g, ' ');
  }
  if (prefix === 'soccer') return 'Football';
  if (prefix === 'basketball') return 'Basketball';
  if (prefix === 'americanfootball') return 'American Football';
  if (prefix === 'baseball') return 'Baseball';
  if (prefix === 'icehockey') return 'Ice Hockey';
  if (prefix === 'tennis') return 'Tennis';
  if (prefix === 'mma') return 'MMA';
  if (prefix === 'boxing') return 'Boxing';
  return sportKey.replace(/_/g, ' ');
}

function getLocalizedDisambiguationStrings(region: Region): { title: string; sport: string } {
  if (region === 'IT') {
    return { title: 'Seleziona Partita', sport: 'Calcio' };
  }
  if (region === 'US') {
    return { title: 'Select Game', sport: 'Soccer' };
  }
  return { title: 'Select Match', sport: 'Football' };
}

interface BetSlipCardProps {
  slip: BetSlip;
  region: Region;
  language: Language;
  oddsFormat: OddsFormat;
  onOddsFormatChange: (format: OddsFormat) => void;
  onSelectFixture?: (candidate: CandidateFixture) => void;
  onSelectMarket?: (marketKey: string) => void;
}

function detectSportKey(slip: BetSlip): string {
  return (slip.sportKey ?? '').toLowerCase();
}

const MARKET_LABELS: Record<string, (slip: BetSlip, strings: typeof DIALECT[Region][Language]) => string> = {
  h2h: (slip, strings) => {
    const sk = detectSportKey(slip);
    const isUS = sk.startsWith('basketball') || sk.startsWith('americanfootball') || sk.startsWith('baseball') || sk.startsWith('icehockey');
    const isTennis = sk.startsWith('tennis');
    return isUS ? 'Moneyline' : isTennis ? 'Match Winner' : strings.market1x2;
  },
  spreads: (slip) => {
    const sk = detectSportKey(slip);
    return sk.startsWith('baseball') ? 'Run Line' : sk.startsWith('icehockey') ? 'Puck Line' : 'Spread';
  },
  totals: (slip, strings) => {
    const sk = detectSportKey(slip);
    return sk.startsWith('soccer') ? strings.marketOu : 'Total Points';
  },
  btts: (_slip, strings) => strings.marketBtts,
  btts_yes_no: (_slip, strings) => strings.marketBtts,
  btts_h1: (_slip, strings) => `BTTS 1st Half`,
  draw_no_bet: () => 'Draw No Bet',
  double_chance: () => 'Double Chance',
  double_chance_h1: () => 'Double Chance 1st Half',
  correct_score: () => 'Correct Score',
  correct_score_h1: () => 'Correct Score 1st Half',
  halftime_fulltime: () => 'Half/Full Time',
  to_qualify: () => 'To Qualify',
  corners_1x2: () => 'Corners 1X2',
  alternate_spreads_corners: () => 'Handicap Corners',
  alternate_totals_corners: () => 'Total Corners',
  alternate_team_totals_corners: () => 'Team Corners',
  alternate_spreads_cards: () => 'Handicap Cards',
  alternate_totals_cards: () => 'Total Cards',
  h2h_3_way: () => '3 Way Result',
  alternate_h2h: (slip, strings) => {
    const sk = detectSportKey(slip);
    const isUS = sk.startsWith('basketball') || sk.startsWith('americanfootball') || sk.startsWith('baseball') || sk.startsWith('icehockey');
    return isUS ? 'Alt Moneyline' : 'Alt Match Result';
  },
  alternate_spreads: (slip) => {
    const sk = detectSportKey(slip);
    return sk.startsWith('baseball') ? 'Alt Run Line' : sk.startsWith('icehockey') ? 'Alt Puck Line' : 'Alt Spread';
  },
  alternate_totals: (slip, strings) => {
    const sk = detectSportKey(slip);
    return sk.startsWith('soccer') ? `Alt ${strings.marketOu}` : 'Alt Total Points';
  },
  team_totals: () => 'Team Totals',
  alternate_team_totals: () => 'Alt Team Totals',
  h2h_q1: () => 'Moneyline Q1', h2h_q2: () => 'Moneyline Q2', h2h_q3: () => 'Moneyline Q3', h2h_q4: () => 'Moneyline Q4',
  h2h_h1: () => 'Moneyline 1st Half', h2h_h2: () => 'Moneyline 2nd Half',
  h2h_p1: () => 'Moneyline P1', h2h_p2: () => 'Moneyline P2', h2h_p3: () => 'Moneyline P3',
  h2h_3_way_q1: () => '3 Way Q1', h2h_3_way_q2: () => '3 Way Q2', h2h_3_way_q3: () => '3 Way Q3', h2h_3_way_q4: () => '3 Way Q4',
  h2h_3_way_h1: () => '3 Way 1st Half', h2h_3_way_h2: () => '3 Way 2nd Half',
  h2h_3_way_p1: () => '3 Way P1', h2h_3_way_p2: () => '3 Way P2', h2h_3_way_p3: () => '3 Way P3',
  spreads_q1: () => 'Spread Q1', spreads_q2: () => 'Spread Q2', spreads_q3: () => 'Spread Q3', spreads_q4: () => 'Spread Q4',
  spreads_h1: () => 'Spread 1st Half', spreads_h2: () => 'Spread 2nd Half',
  spreads_p1: () => 'Spread P1', spreads_p2: () => 'Spread P2', spreads_p3: () => 'Spread P3',
  totals_q1: () => 'O/U Q1', totals_q2: () => 'O/U Q2', totals_q3: () => 'O/U Q3', totals_q4: () => 'O/U Q4',
  totals_h1: () => 'O/U 1st Half', totals_h2: () => 'O/U 2nd Half',
  totals_p1: () => 'O/U P1', totals_p2: () => 'O/U P2', totals_p3: () => 'O/U P3',
  alternate_spreads_q1: () => 'Alt Spread Q1', alternate_spreads_q2: () => 'Alt Spread Q2',
  alternate_spreads_q3: () => 'Alt Spread Q3', alternate_spreads_q4: () => 'Alt Spread Q4',
  alternate_spreads_h1: () => 'Alt Spread 1st Half', alternate_spreads_h2: () => 'Alt Spread 2nd Half',
  alternate_spreads_p1: () => 'Alt Spread P1', alternate_spreads_p2: () => 'Alt Spread P2', alternate_spreads_p3: () => 'Alt Spread P3',
  alternate_totals_q1: () => 'Alt O/U Q1', alternate_totals_q2: () => 'Alt O/U Q2',
  alternate_totals_q3: () => 'Alt O/U Q3', alternate_totals_q4: () => 'Alt O/U Q4',
  alternate_totals_h1: () => 'Alt O/U 1st Half', alternate_totals_h2: () => 'Alt O/U 2nd Half',
  alternate_totals_p1: () => 'Alt O/U P1', alternate_totals_p2: () => 'Alt O/U P2', alternate_totals_p3: () => 'Alt O/U P3',
  team_totals_h1: () => 'Team Totals 1st Half', team_totals_h2: () => 'Team Totals 2nd Half',
  team_totals_q1: () => 'Team Totals Q1', team_totals_q2: () => 'Team Totals Q2',
  team_totals_q3: () => 'Team Totals Q3', team_totals_q4: () => 'Team Totals Q4',
  team_totals_p1: () => 'Team Totals P1', team_totals_p2: () => 'Team Totals P2', team_totals_p3: () => 'Team Totals P3',
  alternate_team_totals_h1: () => 'Alt Team Totals 1st Half', alternate_team_totals_h2: () => 'Alt Team Totals 2nd Half',
  alternate_team_totals_q1: () => 'Alt Team Totals Q1', alternate_team_totals_q2: () => 'Alt Team Totals Q2',
  alternate_team_totals_q3: () => 'Alt Team Totals Q3', alternate_team_totals_q4: () => 'Alt Team Totals Q4',
  alternate_team_totals_p1: () => 'Alt Team Totals P1', alternate_team_totals_p2: () => 'Alt Team Totals P2',
  alternate_team_totals_p3: () => 'Alt Team Totals P3',
  h2h_1st_1_innings: () => 'ML 1st Inning', h2h_1st_3_innings: () => 'ML 1st 3 Innings',
  h2h_1st_5_innings: () => 'ML 1st 5 Innings', h2h_1st_7_innings: () => 'ML 1st 7 Innings',
  h2h_3_way_1st_1_innings: () => '3 Way 1st Inning', h2h_3_way_1st_3_innings: () => '3 Way 1st 3 Inn',
  h2h_3_way_1st_5_innings: () => '3 Way 1st 5 Inn', h2h_3_way_1st_7_innings: () => '3 Way 1st 7 Inn',
  spreads_1st_1_innings: () => 'Spread 1st Inning', spreads_1st_3_innings: () => 'Spread 1st 3 Inn',
  spreads_1st_5_innings: () => 'Spread 1st 5 Inn', spreads_1st_7_innings: () => 'Spread 1st 7 Inn',
  totals_1st_1_innings: () => 'O/U 1st Inning', totals_1st_3_innings: () => 'O/U 1st 3 Inn',
  totals_1st_5_innings: () => 'O/U 1st 5 Inn', totals_1st_7_innings: () => 'O/U 1st 7 Inn',
  alternate_spreads_1st_1_innings: () => 'Alt Spread 1st Inning', alternate_spreads_1st_3_innings: () => 'Alt Spread 1st 3 Inn',
  alternate_spreads_1st_5_innings: () => 'Alt Spread 1st 5 Inn', alternate_spreads_1st_7_innings: () => 'Alt Spread 1st 7 Inn',
  alternate_totals_1st_1_innings: () => 'Alt O/U 1st Inning', alternate_totals_1st_3_innings: () => 'Alt O/U 1st 3 Inn',
  alternate_totals_1st_5_innings: () => 'Alt O/U 1st 5 Inn', alternate_totals_1st_7_innings: () => 'Alt O/U 1st 7 Inn',
  h2h_s1: () => 'Match Winner Set 1', h2h_s2: () => 'Match Winner Set 2',
  spreads_s1: () => 'Spread Set 1', totals_s1: () => 'O/U Set 1',
  alternate_totals_s1: () => 'Alt O/U Set 1',
  player_pass_tds: () => 'Pass TDs', player_pass_yds: () => 'Pass Yards',
  player_pass_attempts: () => 'Pass Attempts', player_pass_completions: () => 'Pass Completions',
  player_pass_interceptions: () => 'Pass Interceptions', player_pass_longest_completion: () => 'Longest Pass',
  player_pass_rush_yds: () => 'Pass+Rush Yards', player_pass_rush_reception_tds: () => 'Pass+Rush+Rec TDs',
  player_pass_rush_reception_yds: () => 'Pass+Rush+Rec Yards',
  player_rush_attempts: () => 'Rush Attempts', player_rush_yds: () => 'Rush Yards',
  player_rush_tds: () => 'Rush TDs', player_rush_longest: () => 'Longest Rush',
  player_rush_reception_tds: () => 'Rush+Rec TDs', player_rush_reception_yds: () => 'Rush+Rec Yards',
  player_receptions: () => 'Receptions', player_reception_yds: () => 'Reception Yards',
  player_reception_tds: () => 'Reception TDs', player_reception_longest: () => 'Longest Reception',
  player_assists: () => 'Assists', player_field_goals: () => 'Field Goals',
  player_kicking_points: () => 'Kicking Points', player_pats: () => 'PATs',
  player_sacks: () => 'Sacks', player_solo_tackles: () => 'Solo Tackles',
  player_tackles_assists: () => 'Tackles+Assists', player_defensive_interceptions: () => 'Def INTs',
  player_tds_over: () => 'TDs Over', player_1st_td: () => '1st TD Scorer',
  player_anytime_td: () => 'Anytime TD Scorer', player_last_td: () => 'Last TD Scorer',
  player_points: () => 'Points', player_rebounds: () => 'Rebounds',
  player_threes: () => '3-Pointers', player_blocks: () => 'Blocks', player_steals: () => 'Steals',
  player_turnovers: () => 'Turnovers', player_points_rebounds_assists: () => 'Pts+Reb+Ast',
  player_points_rebounds: () => 'Pts+Reb', player_points_assists: () => 'Pts+Ast',
  player_rebounds_assists: () => 'Reb+Ast', player_blocks_steals: () => 'Blk+Stl',
  player_frees_made: () => 'Free Throws Made',
  player_frees_attempts: () => 'Free Throw Attempts',
  player_first_basket: () => 'First Basket', player_first_team_basket: () => 'First Team Basket',
  player_double_double: () => 'Double Double', player_triple_double: () => 'Triple Double',
  player_points_alternate: () => 'Alt Points', player_rebounds_alternate: () => 'Alt Rebounds',
  player_assists_alternate: () => 'Alt Assists', player_blocks_alternate: () => 'Alt Blocks',
  player_steals_alternate: () => 'Alt Steals', player_turnovers_alternate: () => 'Alt Turnovers',
  player_threes_alternate: () => 'Alt 3-Pointers',
  player_goals: () => 'Goals', player_shots_on_goal: () => 'Shots on Goal',
  player_blocked_shots: () => 'Blocked Shots', player_power_play_points: () => 'PP Points',
  player_total_saves: () => 'Total Saves',
  player_goal_scorer_first: () => 'First Goal Scorer', player_goal_scorer_last: () => 'Last Goal Scorer',
  player_goal_scorer_anytime: () => 'Anytime Goal Scorer',
  player_points_alternate_nhl: () => 'Alt Points',
  player_assists_alternate_nhl: () => 'Alt Assists', player_goals_alternate: () => 'Alt Goals',
  player_shots_on_goal_alternate: () => 'Alt Shots', player_blocked_shots_alternate: () => 'Alt Blocked Shots',
  player_power_play_points_alternate: () => 'Alt PP Points', player_total_saves_alternate: () => 'Alt Saves',
  batter_home_runs: () => 'Home Runs', batter_hits: () => 'Hits',
  batter_total_bases: () => 'Total Bases', batter_rbis: () => 'RBIs',
  batter_runs_scored: () => 'Runs Scored', batter_hits_runs_rbis: () => 'Hits+Runs+RBIs',
  batter_singles: () => 'Singles', batter_doubles: () => 'Doubles',
  batter_triples: () => 'Triples', batter_walks: () => 'Walks',
  batter_strikeouts: () => 'Strikeouts', batter_stolen_bases: () => 'Stolen Bases',
  batter_first_home_run: () => 'First HR',
  pitcher_strikeouts: () => 'Pitcher Ks', pitcher_record_a_win: () => 'Pitcher Win',
  pitcher_hits_allowed: () => 'Hits Allowed', pitcher_walks: () => 'Pitcher Walks',
  pitcher_earned_runs: () => 'Earned Runs', pitcher_outs: () => 'Pitcher Outs',
  batter_total_bases_alternate: () => 'Alt Total Bases', batter_home_runs_alternate: () => 'Alt Home Runs',
  batter_hits_alternate: () => 'Alt Hits', batter_rbis_alternate: () => 'Alt RBIs',
  batter_walks_alternate: () => 'Alt Walks', batter_strikeouts_alternate: () => 'Alt Strikeouts',
  batter_runs_scored_alternate: () => 'Alt Runs', batter_hits_runs_rbis_alternate: () => 'Alt H+R+RBI',
  batter_singles_alternate: () => 'Alt Singles', batter_doubles_alternate: () => 'Alt Doubles',
  batter_triples_alternate: () => 'Alt Triples',
  pitcher_hits_allowed_alternate: () => 'Alt Hits Allowed', pitcher_walks_alternate: () => 'Alt Pitcher Walks',
  pitcher_earned_runs_alternate: () => 'Alt Earned Runs', pitcher_strikeouts_alternate: () => 'Alt Pitcher Ks',
  pitcher_outs_alternate: () => 'Alt Pitcher Outs',
  player_pass_tds_alternate: () => 'Alt Pass TDs', player_pass_yds_alternate: () => 'Alt Pass Yards',
  player_pass_attempts_alternate: () => 'Alt Pass Attempts', player_pass_completions_alternate: () => 'Alt Pass Completions',
  player_pass_interceptions_alternate: () => 'Alt Pass INTs', player_pass_longest_completion_alternate: () => 'Alt Longest Pass',
  player_pass_rush_yds_alternate: () => 'Alt Pass+Rush Yds',
  player_pass_rush_reception_tds_alternate: () => 'Alt Pass+Rush+Rec TDs',
  player_pass_rush_reception_yds_alternate: () => 'Alt Pass+Rush+Rec Yds',
  player_rush_attempts_alternate: () => 'Alt Rush Attempts', player_rush_yds_alternate: () => 'Alt Rush Yards',
  player_rush_tds_alternate: () => 'Alt Rush TDs', player_rush_longest_alternate: () => 'Alt Longest Rush',
  player_rush_reception_tds_alternate: () => 'Alt Rush+Rec TDs', player_rush_reception_yds_alternate: () => 'Alt Rush+Rec Yds',
  player_receptions_alternate: () => 'Alt Receptions', player_reception_yds_alternate: () => 'Alt Rec Yards',
  player_reception_tds_alternate: () => 'Alt Rec TDs', player_reception_longest_alternate: () => 'Alt Longest Rec',
  player_field_goals_alternate: () => 'Alt Field Goals',
  player_kicking_points_alternate: () => 'Alt Kicking Points', player_pats_alternate: () => 'Alt PATs',
  player_sacks_alternate: () => 'Alt Sacks', player_solo_tackles_alternate: () => 'Alt Solo Tackles',
  player_tackles_assists_alternate: () => 'Alt Tackles+Assists',
};

const DUPLICATE_MARKETS: Record<string, Set<string>> = {
  soccer: new Set(['h2h_3_way']),
};

function buildMarketPills(slip: BetSlip, strings: typeof DIALECT[Region][Language], bookmakerOdds: BookmakerOdds[]): { key: string; label: string; apiKey: string }[] {
  const seen = new Set<string>();
  const pills: { key: string; label: string; apiKey: string }[] = [];
  const sk = detectSportKey(slip);
  const sportPrefix = sk.split('_')[0];
  const dupes = DUPLICATE_MARKETS[sportPrefix] ?? new Set<string>();
  for (const bm of bookmakerOdds) {
    for (const market of bm.markets) {
      if (seen.has(market.key)) continue;
      if (market.key.includes('lay')) continue;
      if (dupes.has(market.key)) continue;
      seen.add(market.key);
      const labelFn = MARKET_LABELS[market.key];
      const label = labelFn ? labelFn(slip, strings) : market.key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      pills.push({ key: market.key, label, apiKey: market.key });
    }
  }
  return pills;
}

function getOutcomesForMarket(marketKey: string, bookmakerOdds: BookmakerOdds[]): string[] {
  const seen = new Set<string>();
  const outcomes: string[] = [];
  for (const bm of bookmakerOdds) {
    const market = bm.markets.find((m) => m.key === marketKey);
    if (!market) continue;
    for (const o of market.outcomes) {
      const displayName = o.point !== undefined ? `${o.name} ${o.point}` : o.name;
      if (!seen.has(displayName)) {
        seen.add(displayName);
        outcomes.push(displayName);
      }
    }
  }
  return outcomes;
}

function findOutcomePrice(
  bookmaker: BookmakerOdds,
  marketKey: string,
  outcomeName: string,
): { price: number; link?: string } | null {
  const market = bookmaker.markets.find((m) => m.key === marketKey);
  if (!market) return null;
  let outcome = market.outcomes.find((o) => {
    const displayName = o.point !== undefined ? `${o.name} ${o.point}` : o.name;
    return displayName === outcomeName;
  });
  if (!outcome) {
    outcome = market.outcomes.find((o) => o.name === outcomeName);
  }
  if (!outcome) return null;
  return { price: outcome.price, link: outcome.link };
}

function resolveDeepLink(
  bookmaker: BookmakerOdds,
  marketKey: string,
  outcomeName: string,
  fallbackLink: string,
): string {
  const market = bookmaker.markets.find((m) => m.key === marketKey);
  const outcome = market?.outcomes.find((o) => {
    const displayName = o.point !== undefined ? `${o.name} ${o.point}` : o.name;
    return displayName === outcomeName || o.name === outcomeName;
  });
  if (outcome?.link) return outcome.link;
  if (market?.link) return market.link;
  if (bookmaker.link) return bookmaker.link;
  return fallbackLink;
}

export function BetSlipCard({ slip, region, language, oddsFormat, onOddsFormatChange, onSelectFixture, onSelectMarket }: BetSlipCardProps) {
  const cfg = REGION_CONFIG[region];
  const strings = DIALECT[region][language];
  const [priceShifts] = useState<Record<string, 'up' | 'down'>>({});
  const [transferring, setTransferring] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [activeMarket, setActiveMarket] = useState<string>('h2h');
  const [selectedOutcome, setSelectedOutcome] = useState<string>('');
  const [stake, setStake] = useState(cfg.defaultStake);
  const [hiddenBooks, setHiddenBooks] = useState<Set<string>>(new Set());
  const [showBookFilter, setShowBookFilter] = useState(false);

  const bookmakerOdds = slip.bookmakerOdds ?? [];
  const marketPills = buildMarketPills(slip, strings, bookmakerOdds);
  const availableMarketKeys = marketPills.map((p) => p.apiKey);
  const hasBookmakerOdds = bookmakerOdds.length > 0;
  const isDisambiguation = slip.source === 'disambiguation' && (slip.candidateFixtures || []).length > 0;
  const containerClass = isDisambiguation
    ? 'relative overflow-hidden rounded-2xl border border-[#63FF0E]/30 bg-zinc-950/90 p-5 sm:p-6 shadow-[0_0_25px_rgba(99,255,14,0.08)] backdrop-blur-md animate-fade-up'
    : 'relative overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-2xl shadow-black/50 animate-fade-up';

  useEffect(() => {
    if (!hasBookmakerOdds || marketPills.length === 0) return;
    const legApiKey = slip.legs[0]?.marketApiKey;
    if (legApiKey && availableMarketKeys.includes(legApiKey)) {
      setActiveMarket(legApiKey);
    } else {
      setActiveMarket(marketPills[0].apiKey);
    }
  }, [slip.id, hasBookmakerOdds]);

  useEffect(() => {
    if (!hasBookmakerOdds) return;
    const outcomes = getOutcomesForMarket(activeMarket, bookmakerOdds);
    if (outcomes.length === 0) {
      setSelectedOutcome('');
      return;
    }
    const legSelection = slip.legs[0]?.selection;
    const legPoint = slip.legs[0]?.point;
    let preferred: string | undefined;
    if (legSelection) {
      if (legPoint !== undefined) {
        preferred = outcomes.find((name) =>
          name.toLowerCase().includes(legSelection.toLowerCase()) && name.includes(String(legPoint)),
        );
      } else {
        preferred = outcomes.find((name) => name === legSelection || name.toLowerCase() === legSelection.toLowerCase());
      }
      if (!preferred) {
        preferred = outcomes.find((name) =>
          name.toLowerCase().includes(legSelection.toLowerCase()) ||
          legSelection.toLowerCase().includes(name.toLowerCase()),
        );
      }
    }
    if (!preferred) {
      preferred = outcomes.find((name) =>
        bookmakerOdds.some((bm) => findOutcomePrice(bm, activeMarket, name)),
      );
    }
    setSelectedOutcome(preferred ?? outcomes[0]);
  }, [activeMarket, slip, hasBookmakerOdds, bookmakerOdds]);

  const brandComparison = useMemo(() => {
    if (!hasBookmakerOdds || !selectedOutcome) return [];
    return bookmakerOdds
      .filter((bm) => !hiddenBooks.has(bm.key))
      .map((bm) => {
        const result = findOutcomePrice(bm, activeMarket, selectedOutcome);
        return {
          key: bm.key,
          name: bm.name,
          price: result?.price ?? null,
          deepLink: resolveDeepLink(bm, activeMarket, selectedOutcome, bm.link ?? ''),
        };
      })
      .sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
  }, [bookmakerOdds, activeMarket, selectedOutcome, hasBookmakerOdds, hiddenBooks]);

  const bestBrand = brandComparison.find((b) => b.price !== null);
  const bestPrice = bestBrand?.price ?? 0;
  const totalOdds = bestPrice;
  const prob = totalOdds > 0 ? (1 / totalOdds) * 100 : 0;
  const hasOdds = totalOdds > 0;
  const sym = cfg.currencySymbol;
  const bestReturn = stake * totalOdds;

  const availableOperators = (slip.operators || []).filter((o) => o.available && o.combinedOdds && !hiddenBooks.has(o.key));
  const sortedOps = [...availableOperators].sort((a, b) => (b.combinedOdds ?? 0) - (a.combinedOdds ?? 0));
  const bestOp = sortedOps[0];
  const lowestOp = sortedOps[sortedOps.length - 1];
  const serverBestOdds = bestOp?.combinedOdds ?? 0;
  const serverProb = slip.totalOdds > 0 ? slip.probability : 0;
  const serverHasOdds = slip.totalOdds > 0;
  const lowestReturn = stake * (lowestOp?.combinedOdds ?? 0);
  const delta = bestReturn - lowestReturn;

  const visibleNotices = (slip.systemNotices || []).filter((notice) => {
    if (notice.includes('currently unlisted') && availableOperators.length > 0) return false;
    return true;
  });

  const handleTransfer = (deepLink: string, name: string) => {
    setTransferring(name);
    setShowOverlay(true);
    const summary = `${selectedOutcome || slip.legs.map((l) => l.selection).join(' | ')} @ ${bestPrice || serverBestOdds}`;
    try { navigator.clipboard?.writeText(summary); } catch { /* noop */ }
    setTimeout(() => {
      window.open(deepLink, '_blank', 'noopener,noreferrer');
      setShowOverlay(false);
      setTimeout(() => setTransferring(null), 2000);
    }, 1200);
  };

  const handleServerTransfer = (operator: OperatorOffer) => {
    setTransferring(operator.name);
    setShowOverlay(true);
    const summary = slip.legs.map((l) => `${l.selection} @ ${l.odds}`).join(' | ');
    try { navigator.clipboard?.writeText(summary); } catch { /* noop */ }
    setTimeout(() => {
      window.open(operator.deepLink, '_blank', 'noopener,noreferrer');
      setShowOverlay(false);
      setTimeout(() => setTransferring(null), 2000);
    }, 1200);
  };

  const outcomeNames = getOutcomesForMarket(activeMarket, bookmakerOdds);
  const activeMarketLabel = marketPills.find((p) => p.key === activeMarket)?.label ?? activeMarket;

  return (
    <div className={containerClass}>
      {!isDisambiguation && <EventHeaderCard slip={slip} region={region} language={language} />}

      {showOverlay && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-ink-900/90 backdrop-blur-sm animate-fade-in">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
          <p className="text-sm font-medium text-zinc-300">{strings.transferOverlay}</p>
        </div>
      )}

      {isDisambiguation && (() => {
        const ds = getLocalizedDisambiguationStrings(region);
        const sportName = getLocalizedSportName(slip.candidateFixtures?.[0]?.sportKey ?? slip.sportKey ?? 'soccer', region);
        return (
          <div>
            <div className="mb-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#63FF0E]/70">{sportName}</p>
              <p className="text-white font-bold text-lg sm:text-xl tracking-tight">{ds.title}</p>
            </div>
            <div>
              {(slip.candidateFixtures || []).map((fixture) => (
                <button
                  key={fixture.eventId}
                  onClick={() => onSelectFixture?.(fixture)}
                  className="group flex items-center justify-between rounded-xl border border-zinc-800/80 hover:border-[#63FF0E]/50 bg-zinc-900/40 hover:bg-zinc-900/80 transition-all p-3.5 cursor-pointer mb-2.5 w-full text-left"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="w-10 h-10 rounded-xl bg-[#63FF0E]/10 border border-[#63FF0E]/25 text-[#63FF0E] flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(99,255,14,0.15)]">
                      {getCategoryIcon(fixture.sportKey)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">
                        {fixture.match}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-zinc-500">
                        <span className="inline-flex items-center">
                          <Trophy className="w-3.5 h-3.5 text-zinc-500 inline mr-1" />
                          {formatLeagueName(fixture.sportKey)}
                        </span>
                        {fixture.kickoff && (
                          <span className="inline-flex items-center">
                            <Clock className="w-3.5 h-3.5 text-zinc-500 inline mr-1" />
                            {fixture.kickoff}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="text-[#63FF0E] w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        );
      })()}

      {!isDisambiguation && (<>
      <div className="flex items-center justify-between gap-3 border-b border-zinc-800/60 px-5 py-3">
        <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
          <Wifi className="h-3 w-3" />
          {strings.liveBadge}
        </span>
        {region !== 'IT' && (
          <div className="flex items-center gap-1 rounded-full border border-zinc-800 bg-black p-0.5">
            {(region === 'UK' ? (['fractional', 'decimal'] as OddsFormat[]) : (['american', 'decimal'] as OddsFormat[])).map((fmt) => (
              <button
                key={fmt}
                onClick={() => onOddsFormatChange(fmt)}
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase transition-all ${
                  oddsFormat === fmt ? 'bg-emerald-500 text-ink-900' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {fmt === 'fractional' ? 'Frac' : fmt === 'decimal' ? 'Dec' : 'US'}
              </button>
            ))}
          </div>
        )}
      </div>

      {hasBookmakerOdds && (
        <div className="px-5 py-4 border-b border-zinc-800/60">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="h-4 w-4 text-emerald-500" />
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{strings.marketOptions}</p>
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
            {marketPills.map((pill) => {
              const hasMarket = bookmakerOdds.some((bm) => bm.markets.some((m) => m.key === pill.apiKey));
              const isActive = activeMarket === pill.key;
              return (
                <button
                  key={pill.key}
                  onClick={() => setActiveMarket(pill.key)}
                  disabled={!hasMarket}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-[13px] font-semibold uppercase tracking-wide transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 ${
                    isActive
                      ? 'border-emerald-500 bg-emerald-500 text-black'
                      : 'border-zinc-800 bg-black text-zinc-300 hover:border-emerald-500/50 hover:text-emerald-400'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
          {outcomeNames.length > 0 && (
            <div className="mb-4">
              <p className="mb-1.5 text-xs font-medium text-zinc-500">
                {region === 'IT' ? 'Selezione' : 'Selection'}
              </p>
              <div className="flex flex-wrap gap-2">
                {outcomeNames.map((name) => {
                  const hasPrice = bookmakerOdds.some((bm) => findOutcomePrice(bm, activeMarket, name));
                  const isSelected = selectedOutcome === name;
                  const displayName = name === 'Draw' ? strings.drawLabel : name;
                  return (
                    <button
                      key={name}
                      onClick={() => setSelectedOutcome(name)}
                      disabled={!hasPrice}
                      className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-[13px] font-semibold transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 ${
                        isSelected
                          ? 'border-emerald-500/60 bg-emerald-500/20 text-emerald-300'
                          : 'border-zinc-800 bg-black text-zinc-400 hover:border-emerald-500/50 hover:text-white'
                      }`}
                    >
                      {displayName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {slip.legs.length > 0 && (
        <div className="px-5 py-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            {slip.legs.length === 1 ? 'SINGLE BET' : `${cfg.legCountLabel(slip.legs.length)} · ${slip.isSingleMatch ? cfg.betFormatSingle : cfg.betFormatMulti}`}
          </p>
          <div className="space-y-2.5">
            {slip.legs.map((leg, i) => {
              const liveSelection = hasBookmakerOdds && selectedOutcome ? (selectedOutcome === 'Draw' ? strings.drawLabel : selectedOutcome) : leg.selection;
              const liveMarket = hasBookmakerOdds ? activeMarketLabel : leg.market;
              const liveOdds = hasBookmakerOdds && hasOdds ? totalOdds : leg.odds;
              return (
                <div
                  key={leg.id}
                  className="flex items-center justify-between rounded-xl border border-zinc-800 bg-black/40 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400 border border-emerald-500/40">
                      {i + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-zinc-100">{liveSelection}</p>
                        {leg.features?.map((f) => (
                          <FeatureBadge key={f} featureKey={f} region={region} />
                        ))}
                      </div>
                      <p className="text-xs text-zinc-500">{liveMarket}</p>
                    </div>
                  </div>
                  <span className="rounded-lg bg-zinc-800/60 px-3 py-1.5 text-sm font-bold tabular-nums text-zinc-200 border border-zinc-700">
                    {formatOdds(liveOdds, oddsFormat)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mx-5 flex items-center justify-between rounded-xl border border-emerald-500/40 bg-emerald-950/30 px-4 py-3.5 glow-emerald-card">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            {region === 'IT' ? 'Quota Totale' : 'Total Odds'}
          </p>
          <p className="mt-0.5 text-2xl font-bold tabular-nums text-white">
            {hasOdds ? formatOdds(totalOdds, oddsFormat) : serverHasOdds ? formatOdds(slip.totalOdds, oddsFormat) : '—'}
          </p>
        </div>
        <div
          className="w-28 h-2.5 rounded-full overflow-hidden border border-zinc-700/50"
          style={{ backgroundColor: hasOdds || serverHasOdds ? 'rgba(39,39,42,0.8)' : 'rgba(39,39,42,0.4)' }}
        >
          <div
            className={`h-full transition-all duration-500 ease-out ${hasOdds || serverHasOdds ? 'bg-emerald-500 shadow-[0_0_8px_rgba(120,252,11,0.4)]' : ''}`}
            style={{ width: hasOdds ? `${prob}%` : serverHasOdds ? `${serverProb}%` : '0%' }}
          />
        </div>
      </div>

      {hasBookmakerOdds ? (
        <StakeSelector
          region={region}
          oddsFormat={oddsFormat}
          operators={slip.operators}
          totalOdds={totalOdds}
          onStakeChange={setStake}
        />
      ) : availableOperators.length > 0 ? (
        <StakeSelector
          region={region}
          oddsFormat={oddsFormat}
          operators={slip.operators}
          totalOdds={slip.totalOdds}
          onStakeChange={setStake}
        />
      ) : null}

      {hasBookmakerOdds && brandComparison.length > 0 && (
        <div className="mt-5 px-5">
          <div className="mb-3 flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">{strings.operatorComparison}</span>
            <button
              onClick={() => setShowBookFilter((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                showBookFilter || hiddenBooks.size > 0
                  ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400'
                  : 'bg-zinc-800/60 border border-zinc-700/50 text-zinc-400 hover:text-zinc-300 hover:border-zinc-600'
              }`}
            >
              <SlidersHorizontal className="h-3 w-3" />
              Filter{hiddenBooks.size > 0 && ` (${hiddenBooks.size})`}
            </button>
          </div>
          {showBookFilter && (
            <div className="mb-4 rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 animate-fade-up">
              <div className="flex flex-wrap gap-2">
                {bookmakerOdds.map((bm) => {
                  const isHidden = hiddenBooks.has(bm.key);
                  return (
                    <button
                      key={bm.key}
                      onClick={() => {
                        setHiddenBooks((prev) => {
                          const next = new Set(prev);
                          if (next.has(bm.key)) next.delete(bm.key);
                          else if (next.size < bookmakerOdds.length - 1) next.add(bm.key);
                          return next;
                        });
                      }}
                      className={`group inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                        isHidden
                          ? 'bg-zinc-800/40 border border-zinc-700/40 text-zinc-500 hover:text-zinc-400'
                          : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                      }`}
                    >
                      {isHidden ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      {bm.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <div className="space-y-2.5">
            {bestBrand && bestBrand.price !== null && (
              <div className="rounded-2xl border-2 border-emerald-500/80 bg-black p-5 glow-emerald-card">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <OperatorLogo operatorKey={bestBrand.key} name={bestBrand.name} />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-white">{bestBrand.name}</span>
                        <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                          <Crown className="h-2.5 w-2.5" />
                          {strings.bestPrice}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-3">
                        <span className="text-lg font-bold tabular-nums text-emerald-400">
                          {formatOdds(bestBrand.price, oddsFormat)}
                        </span>
                        <span className="text-xs text-zinc-400 font-medium">
                          {region === 'IT' ? 'Vincita' : 'Return'}: <span className="text-white font-bold">{sym}{(stake * bestBrand.price).toFixed(2)}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleTransfer(bestBrand.deepLink, bestBrand.name)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-xs font-bold text-black shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 active:scale-95 sm:text-sm"
                  >
                    {strings.transferSlip}
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}

            <ResponsibleGamblingNotice region={region} />

            {brandComparison
              .filter((b) => b !== bestBrand)
              .map((brand) => {
                const shift = priceShifts[brand.key];
                const hasPrice = brand.price !== null;
                return (
                  <div
                    key={brand.key}
                    className={`rounded-xl border p-4 transition ${hasPrice ? 'border-zinc-800 bg-black hover:border-zinc-700' : 'border-zinc-800/50 bg-black/20 opacity-50'}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <OperatorLogo operatorKey={brand.key} name={brand.name} />
                        <div>
                          <span className="text-sm font-semibold text-white block">{brand.name}</span>
                          <div className="mt-0.5 flex items-center gap-1.5">
                            <span className="text-sm font-bold tabular-nums text-zinc-300">
                              {hasPrice ? formatOdds(brand.price!, oddsFormat) : '-'}
                            </span>
                            {shift && (
                              <span className={`text-xs font-bold ${shift === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                                {shift === 'up' ? '↑' : '↓'}
                              </span>
                            )}
                            <span className="text-xs text-zinc-400">
                              {region === 'IT' ? 'Vincita' : 'Return'}: {hasPrice ? `${sym}${(stake * brand.price!).toFixed(2)}` : '-'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => hasPrice && handleTransfer(brand.deepLink, brand.name)}
                        disabled={!hasPrice}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-800 px-4 py-2.5 text-xs font-bold text-zinc-300 border border-zinc-700 transition hover:bg-zinc-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {strings.transferSlip}
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {!hasBookmakerOdds && sortedOps.length > 0 && (
        <div className="mt-5 px-5">
          <div className="space-y-2.5">
            {bestOp && (
              <div className="rounded-2xl border-2 border-emerald-500/80 bg-black p-5 glow-emerald-card">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <OperatorLogo operatorKey={bestOp.key} name={bestOp.name} />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-white">{bestOp.name}</span>
                        <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                          <Crown className="h-2.5 w-2.5" />
                          {strings.bestPrice}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-3">
                        <span className="text-lg font-bold tabular-nums text-emerald-400">
                          {formatOdds(bestOp.combinedOdds ?? 0, oddsFormat)}
                        </span>
                        <span className="text-xs text-zinc-400 font-medium">
                          {region === 'IT' ? 'Vincita' : 'Return'}: <span className="text-white font-bold">{sym}{(stake * (bestOp.combinedOdds ?? 0)).toFixed(2)}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleServerTransfer(bestOp)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-xs font-bold text-black shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 active:scale-95 sm:text-sm"
                  >
                    {strings.transferSlip}
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}
            <ResponsibleGamblingNotice region={region} />
          </div>
        </div>
      )}

      {(hasBookmakerOdds ? brandComparison.length > 0 : availableOperators.length > 0) && (
        <div className="p-5 pt-4">
          <button
            onClick={() => bestBrand && handleTransfer(bestBrand.deepLink, bestBrand.name)}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-4 text-base font-bold text-black shadow-xl shadow-emerald-500/20 transition hover:bg-emerald-400 active:scale-[0.99] sm:text-lg"
          >
            {strings.transferCtaOperator(bestBrand?.name ?? bestOp?.name ?? 'Operator')}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      )}
      </>)}
    </div>
  );
}

// SMART LOGO COMPONENT
function OperatorLogo({ operatorKey, name }: { operatorKey: string; name: string }) {
  const [imgFailed, setImgFailed] = useState(false);
  const safeKey = (operatorKey || '').toLowerCase();

  useEffect(() => {
    setImgFailed(false);
  }, [safeKey]);

  const logos: Record<string, { bg: string; text: string; label: string }> = {
    paddypower: { bg: '#0a5c36', text: '#fff', label: 'PP' },
    skybet: { bg: '#0a2d6e', text: '#fff', label: 'SB' },
    betfair_sb_uk: { bg: '#ffb800', text: '#1a1a1a', label: 'BF' },
    betfair_ex_uk: { bg: '#ffb800', text: '#1a1a1a', label: 'BFx' },
    betfair_sb_eu: { bg: '#ffb800', text: '#1a1a1a', label: 'BF' },
    betfair_ex_eu: { bg: '#ffb800', text: '#1a1a1a', label: 'BFx' },
    pokerstars: { bg: '#1a1a2e', text: '#c41e3a', label: 'PS' },
    fanduel: { bg: '#1493c4', text: '#fff', label: 'FD' },
    draftkings: { bg: '#1a4d2e', text: '#fff', label: 'DK' },
    sisal: { bg: '#003d7a', text: '#fff', label: 'SI' },
    snai: { bg: '#0066cc', text: '#fff', label: 'SN' },
    betvictor: { bg: '#002855', text: '#fff', label: 'BV' },
    coral: { bg: '#002b49', text: '#fff', label: 'Cor' },
    williamhill: { bg: '#0c2340', text: '#f5b112', label: 'WH' },
    ladbrokes: { bg: '#ee3124', text: '#fff', label: 'Lad' },
    ladbrokes_uk: { bg: '#ee3124', text: '#fff', label: 'Lad' },
  };

  if (!imgFailed) {
    return (
      <img
        src={`/operators/${safeKey}.png`}
        alt={name}
        className="flex h-10 w-10 items-center justify-center rounded-xl object-contain bg-white border border-zinc-700/50"
        onError={() => setImgFailed(true)}
      />
    );
  }

  const logo = logos[safeKey] ?? { bg: '#ee3124', text: '#fff', label: name.charAt(0).toUpperCase() };
  return (
    <div
      className="flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold tracking-tight border border-zinc-700/50"
      style={{ backgroundColor: logo.bg, color: logo.text }}
    >
      {logo.label}
    </div>
  );
}