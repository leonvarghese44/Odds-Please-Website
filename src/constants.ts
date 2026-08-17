export type Region = 'UK' | 'US' | 'IT';
export type Language = 'ENG' | 'ITA';
export type OddsFormat = 'fractional' | 'decimal' | 'american';

export interface Leg {
  id: string;
  selection: string;
  market: string;
  marketApiKey?: string;
  point?: number;
  odds: number;
  result: string;
  features: string[];
  prevOdds?: number;
}

export interface OperatorOffer {
  key: string;
  name: string;
  available: boolean;
  combinedOdds: number | null;
  deepLink: string;
  missingLegs: string[];
}

export interface MarketOption {
  market: string;
  label: string;
  outcomes: { name: string; price: number; point?: number }[];
  apiKey?: string;
}

export interface BookmakerOutcome {
  name: string;
  price: number;
  point?: number;
  link?: string;
}

export interface BookmakerMarket {
  key: string;
  outcomes: BookmakerOutcome[];
  link?: string;
}

export interface BookmakerOdds {
  key: string;
  name: string;
  markets: BookmakerMarket[];
  link?: string;
}

export interface CandidateFixture {
  eventId: string;
  match: string;
  sportKey: string;
  sport: string;
  sportIcon: string;
  competition: string;
  kickoff: string;
}

export interface BetSlip {
  match: string;
  sport: string;
  sportIcon: string;
  competition: string;
  kickoff: string;
  isSingleMatch: boolean;
  legs: Leg[];
  totalOdds: number;
  stake: number;
  potentialReturn: number;
  probability: number;
  variance: 'Low' | 'Moderate' | 'High';
  safetyMessage: string;
  operators: OperatorOffer[];
  systemNotices: string[];
  source: 'live' | 'fixture-markets' | 'disambiguation';
  marketOptions?: MarketOption[];
  bookmakerOdds?: BookmakerOdds[];
  candidateFixtures?: CandidateFixture[];
  eventId?: string;
  sportKey?: string;
}

export interface ExamplePrompt {
  label: string;
  text: string;
  emoji: string;
}

export interface LivePill {
  label: string;
  text: string;
  emoji: string;
  live?: boolean;
  score?: string;
  time?: string;
}

export interface SportMeta {
  key: string;
  icon: string;
  label: string;
}

export const SPORT_ICONS: Record<string, SportMeta> = {
  soccer: { key: 'soccer', icon: '⚽', label: 'Soccer' },
  basketball: { key: 'basketball', icon: '🏀', label: 'Basketball' },
  football: { key: 'football', icon: '🏈', label: 'Football' },
  tennis: { key: 'tennis', icon: '🎾', label: 'Tennis' },
  motorsport: { key: 'motorsport', icon: '🏎️', label: 'Motorsport' },
  rugby: { key: 'rugby', icon: '🏉', label: 'Rugby' },
  baseball: { key: 'baseball', icon: '⚾', label: 'Baseball' },
  hockey: { key: 'hockey', icon: '🏒', label: 'Hockey' },
};

export interface FeatureMeta {
  badge: Record<Region, string>;
  emoji: string;
  modalTitle: string;
  modalText: string;
  operators: string[];
  regions: Region[];
}

export const FLUTTER_FEATURES: Record<string, FeatureMeta> = {
  super_sub: {
    badge: { UK: 'Super Sub', US: 'Super Sub', IT: 'Super Sub' },
    emoji: '🔄',
    modalTitle: 'Super Sub T&Cs',
    modalText: 'If your selected player is substituted, your bet transfers to the player replacing them.',
    operators: ['paddypower'],
    regions: ['UK'],
  },
};

export const OPERATOR_NAMES: Record<string, string> = {
  paddypower: 'Paddy Power',
  skybet: 'Sky Bet',
  betfair_sb_uk: 'Betfair',
  betfair_ex_uk: 'Betfair Exchange',
  pokerstars: 'PokerStars',
  fanduel: 'FanDuel',
  sisal: 'Sisal',
  snai: 'SNAI',
  betfair_ex_eu: 'Betfair Exchange',
  betfair_sb_eu: 'Betfair',
};

export const OPERATOR_DEEPLINK_BASE: Record<string, string> = {
  paddypower: 'https://www.paddypower.com',
  skybet: 'https://www.skybet.com',
  betfair_sb_uk: 'https://www.betfair.com/sport/football',
  betfair_ex_uk: 'https://www.betfair.com/exchange',
  pokerstars: 'https://www.pokerstars.it/sports',
  fanduel: 'https://www.fanduel.com',
  sisal: 'https://www.sisal.it',
  snai: 'https://www.snai.it',
  betfair_ex_eu: 'https://www.betfair.it/exchange',
  betfair_sb_eu: 'https://www.betfair.it/sport/football',
  betfair_sb_uk_it: 'https://www.betfair.it/sport/football',
};

export interface DialectStrings {
  cta: string;
  loading: string;
  heroTitle: string;
  heroSubtitle: string;
  quickPrompts: string;
  yourPrediction: string;
  transferSlip: string;
  operatorComparison: string;
  redirectTo: string;
  privacy: string;
  terms: string;
  responsibleGambling: string;
  liveBadge: string;
  marketOptions: string;
  market1x2: string;
  marketBtts: string;
  marketOu: string;
  drawLabel: string;
  transferCta: string;
  transferCtaOperator: (name: string) => string;
  bestPrice: string;
  fluctuationDisclaimer: string;
  footerDisclaimer: string;
  copyright: string;
  restrictedMarket: string;
  seniorFixtures: string;
  premierLeague: string;
  serieA: string;
  nflPro: string;
  liveFreshness: string;
  extraValue: (delta: string) => string;
  stakeLabel: string;
  transferOverlay: string;
  navProtection: string;
  navProtectionShort: string;
  underageTitle: string;
  parentalControls: string;
  complianceTitle: string;
  termsTitle: string;
  privacyTitle: string;
  responsibleTitle: string;
}

export const DIALECT: Record<Region, Record<Language, DialectStrings>> = {
  UK: {
    ENG: {
      cta: 'What are the odds?',
      loading: 'Scanning live feeds...',
      heroTitle: "<span class='text-white block whitespace-nowrap sm:inline'>Instant odds.</span> <span class='text-emerald-400 block whitespace-nowrap sm:inline'>Instant edge.</span>",
      heroSubtitle: 'You name the bet. We find the best odds.',
      quickPrompts: 'Live fixtures:',
      yourPrediction: '',
      transferSlip: 'Place Bet',
      operatorComparison: 'Brand Comparison',
      redirectTo:
        'Odds are subject to fluctuation and are finalised on the operator portal. OddsPlease does not process bets directly.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      responsibleGambling: 'Safer Gambling',
      liveBadge: 'LIVE ODDS',
      marketOptions: 'Match Market Options',
      market1x2: 'Match Result (1X2)',
      marketBtts: 'Both Teams to Score',
      marketOu: 'Over/Under 2.5 Goals',
      drawLabel: 'Draw',
      transferCta: 'Transfer Slip',
      transferCtaOperator: (name) => `Transfer Slip to ${name}`,
      bestPrice: 'BEST PRICE',
      fluctuationDisclaimer:
        'Odds are subject to fluctuation and are finalised on the operator portal. OddsPlease does not process bets directly.',
      footerDisclaimer:
        'OddsPlease is an independent comparison interface and does not accept or process bets. All bets are placed directly with licensed bookmakers. Any bet settlement queries or customer disputes must be raised directly with the respective brand. Odds are provided for informational purposes only.',
      copyright: '© 2026 OddsPlease Limited. All rights reserved.',
      restrictedMarket:
        'Market Restricted: In accordance with UKGC regulations, betting markets on youth/under-18 competitions are not offered.',
      seniorFixtures: 'View Senior Fixtures',
      premierLeague: 'Premier League',
      serieA: 'Serie A',
      nflPro: 'NFL Pro Leagues',
      liveFreshness: 'Updated live',
      extraValue: (delta) => `+${delta} extra payout vs lowest operator`,
      stakeLabel: 'Stake',
      transferOverlay: 'Transferring to operator...',
      navProtection: 'Safer Gambling',
      navProtectionShort: 'Safer',
      underageTitle: 'Underage Gambling Prevention Notice',
      parentalControls: 'Parental Control Tools',
      complianceTitle: 'Safer Gambling & Player Protection Hub',
      termsTitle: 'Terms of Service',
      privacyTitle: 'Privacy Policy',
      responsibleTitle: 'Safer Gambling',
    },
    ITA: {
      cta: 'Ottieni le quote',
      loading: 'Scansione feed live...',
      heroTitle: "<span class='text-white block whitespace-nowrap'>Quote immediate.</span> <span class='text-emerald-400 block whitespace-nowrap'>Vantaggio immediato.</span>",
      heroSubtitle: 'Scegli la scommessa. Troviamo le migliori quote.',
      quickPrompts: 'Partite live:',
      yourPrediction: 'Il Tuo Pronostico',
      transferSlip: 'Trasferisci Schedina',
      operatorComparison: 'Confronto Brand',
      redirectTo:
        'Le quote sono soggette a variazione e vengono confermate sul sito dell\'operatore. OddsPlease non raccoglie scommesse.',
      privacy: 'Informativa sulla Privacy',
      terms: 'Termini e Condizioni',
      responsibleGambling: 'Gioco Responsabile',
      liveBadge: 'QUOTE LIVE',
      marketOptions: 'Opzioni di Mercato',
      market1x2: 'Esito Finale (1X2)',
      marketBtts: 'Gol / No Gol',
      marketOu: 'Under / Over 2.5',
      drawLabel: 'Pareggio',
      transferCta: 'Trasferisci Schedina',
      transferCtaOperator: (name) => `Trasferisci Schedina su ${name}`,
      bestPrice: 'MIGLIOR QUOTA',
      fluctuationDisclaimer:
        'Le quote sono soggette a variazione e vengono confermate sul sito dell\'operatore. OddsPlease non raccoglie scommesse.',
      footerDisclaimer:
        'OddsPlease è un\'interfaccia di confronto indipendente e non raccoglie né gestisce scommesse. Tutte le scommesse vengono piazzate direttamente sui siti degli operatori autorizzati. Eventuali reclami o controversie devono essere rivolti direttamente all\'operatore di riferimento.',
      copyright: '© 2026 OddsPlease Limited · Motore di confronto quote indipendente · Non affiliato a nessun operatore',
      restrictedMarket:
        'Mercato Limitato: In ottemperanza ai regolamenti ADM, i mercati relativi a competizioni giovanili non sono disponibili.',
      seniorFixtures: 'Visualizza Partite Senior',
      premierLeague: 'Premier League',
      serieA: 'Serie A',
      nflPro: 'Lega NFL Pro',
      liveFreshness: 'Aggiornato live',
      extraValue: (delta) => `+${delta} vincita extra rispetto al minimo`,
      stakeLabel: 'Puntata',
      transferOverlay: 'Trasferimento all\'operatore...',
      navProtection: 'Gioco Responsabile',
      navProtectionShort: 'Gioco',
      underageTitle: 'Avviso sul Divieto di Gioco ai Minori',
      parentalControls: 'Strumenti di Controllo Genitoriale',
      complianceTitle: 'Conformità e Protezione del Giocatore',
      termsTitle: 'Termini e Condizioni di Servizio',
      privacyTitle: 'Informativa sulla Privacy',
      responsibleTitle: 'Gioco Responsabile',
    },
  },
  US: {
    ENG: {
      cta: 'What are the odds?',
      loading: 'Scanning live feeds...',
      heroTitle: "<span class='text-white block whitespace-nowrap sm:inline'>Instant odds.</span> <span class='text-emerald-400 block whitespace-nowrap sm:inline'>Instant edge.</span>",
      heroSubtitle: 'You name the wager. We find the best lines.',
      quickPrompts: 'Live games:',
      yourPrediction: 'Your Prediction',
      transferSlip: 'Transfer Slip',
      operatorComparison: 'Sportsbook Comparison',
      redirectTo:
        'Odds are subject to fluctuation and are finalized on the sportsbook portal. OddsPlease does not process bets directly.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      responsibleGambling: 'Responsible Gaming',
      liveBadge: 'LIVE ODDS',
      marketOptions: 'Game Market Options',
      market1x2: 'Moneyline',
      marketBtts: 'Both Teams to Score',
      marketOu: 'Over/Under',
      drawLabel: 'Draw',
      transferCta: 'Transfer Slip',
      transferCtaOperator: (name) => `Transfer Slip to ${name}`,
      bestPrice: 'BEST PRICE',
      fluctuationDisclaimer:
        'Odds are subject to fluctuation and are finalized on the sportsbook portal. OddsPlease does not process bets directly.',
      footerDisclaimer:
        'OddsPlease is an independent comparison interface and does not accept or process bets. All bets are placed directly with licensed sportsbooks. Any bet settlement queries or customer disputes must be raised directly with the respective sportsbook. Odds are provided for informational purposes only.',
      copyright: '© 2026 OddsPlease Media Limited. All rights reserved.',
      restrictedMarket:
        'Market Restricted: In accordance with state gaming regulations, high school sports and restricted college prop markets are unavailable.',
      seniorFixtures: 'View Pro Leagues',
      premierLeague: 'Premier League',
      serieA: 'Serie A',
      nflPro: 'NFL Pro Leagues',
      liveFreshness: 'Updated live',
      extraValue: (delta) => `+${delta} extra payout vs lowest sportsbook`,
      stakeLabel: 'Stake',
      transferOverlay: 'Transferring to sportsbook...',
      navProtection: 'Responsible Gaming',
      navProtectionShort: 'Gaming',
      underageTitle: 'Underage Gambling Prevention Notice',
      parentalControls: 'Parental Control Tools',
      complianceTitle: 'Responsible Gaming & Player Protection Hub',
      termsTitle: 'Terms of Service',
      privacyTitle: 'Privacy Policy',
      responsibleTitle: 'Responsible Gaming',
    },
    ITA: {
      cta: 'Ottieni le quote',
      loading: 'Scansione feed live...',
      heroTitle: "<span class='text-white block whitespace-nowrap'>Quote immediate.</span> <span class='text-emerald-400 block whitespace-nowrap'>Vantaggio immediato.</span>",
      heroSubtitle: 'Scegli la scommessa. Troviamo le migliori quote.',
      quickPrompts: 'Partite live:',
      yourPrediction: 'Il Tuo Pronostico',
      transferSlip: 'Trasferisci Schedina',
      operatorComparison: 'Confronto Brand',
      redirectTo:
        'Le quote sono soggette a variazione e vengono confermate sul sito dell\'operatore. OddsPlease non raccoglie scommesse.',
      privacy: 'Informativa sulla Privacy',
      terms: 'Termini e Condizioni',
      responsibleGambling: 'Gioco Responsabile',
      liveBadge: 'QUOTE LIVE',
      marketOptions: 'Opzioni di Mercato',
      market1x2: 'Esito Finale (1X2)',
      marketBtts: 'Gol / No Gol',
      marketOu: 'Under / Over 2.5',
      drawLabel: 'Pareggio',
      transferCta: 'Trasferisci Schedina',
      transferCtaOperator: (name) => `Trasferisci Schedina su ${name}`,
      bestPrice: 'MIGLIOR QUOTA',
      fluctuationDisclaimer:
        'Le quote sono soggette a variazione e vengono confermate sul sito dell\'operatore. OddsPlease non raccoglie scommesse.',
      footerDisclaimer:
        'OddsPlease è un\'interfaccia di confronto indipendente e non raccoglie né gestisce scommesse. Tutte le scommesse vengono piazzate direttamente sui siti degli operatori autorizzati. Eventuali reclami o controversie devono essere rivolti direttamente all\'operatore di riferimento.',
      copyright: 'OddsPlease © 2026 · Motore di confronto quote indipendente · Non affiliato a nessun operatore',
      restrictedMarket:
        'Mercato Limitato: In ottemperanza ai regolamenti ADM, i mercati relativi a competizioni giovanili non sono disponibili.',
      seniorFixtures: 'Visualizza Partite Senior',
      premierLeague: 'Premier League',
      serieA: 'Serie A',
      nflPro: 'Lega NFL Pro',
      liveFreshness: 'Aggiornato live',
      extraValue: (delta) => `+${delta} vincita extra rispetto al minimo`,
      stakeLabel: 'Puntata',
      transferOverlay: 'Trasferimento all\'operatore...',
      navProtection: 'Gioco Responsabile',
      navProtectionShort: 'Gioco',
      underageTitle: 'Avviso sul Divieto di Gioco ai Minori',
      parentalControls: 'Strumenti di Controllo Genitoriale',
      complianceTitle: 'Conformità e Protezione del Giocatore',
      termsTitle: 'Termini e Condizioni di Servizio',
      privacyTitle: 'Informativa sulla Privacy',
      responsibleTitle: 'Gioco Responsabile',
    },
  },
  IT: {
    ENG: {
      cta: 'What are the odds?',
      loading: 'Scanning live feeds...',
      heroTitle: "<span class='text-white block whitespace-nowrap sm:inline'>Instant odds.</span> <span class='text-emerald-400 block whitespace-nowrap sm:inline'>Instant edge.</span>",
      heroSubtitle: 'You name the bet. We find the best odds.',
      quickPrompts: 'Live fixtures:',
      yourPrediction: 'Your Prediction',
      transferSlip: 'Transfer Slip',
      operatorComparison: 'Operator Comparison',
      redirectTo:
        'Odds are subject to fluctuation and are finalized on the operator portal. OddsPlease does not process bets directly.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      responsibleGambling: 'Responsible Gambling',
      liveBadge: 'LIVE ODDS',
      marketOptions: 'Match Market Options',
      market1x2: 'Match Result (1X2)',
      marketBtts: 'Both Teams to Score',
      marketOu: 'Over/Under 2.5 Goals',
      drawLabel: 'Draw',
      transferCta: 'Transfer Slip',
      transferCtaOperator: (name) => `Transfer Slip to ${name}`,
      bestPrice: 'BEST PRICE',
      fluctuationDisclaimer:
        'Odds are subject to fluctuation and are finalized on the operator portal. OddsPlease does not process bets directly.',
      footerDisclaimer:
        'OddsPlease is an independent comparison interface and does not accept or process bets. All bets are placed directly with licensed Italian operators. Any bet settlement queries or customer disputes must be raised directly with the respective operator. Odds are provided for informational purposes only.',
      copyright: '© 2026 OddsPlease Media Limited. All rights reserved.',
      restrictedMarket:
        'Market Restricted: In accordance with ADM regulations, betting markets on youth/under-18 competitions are not offered.',
      seniorFixtures: 'View Senior Fixtures',
      premierLeague: 'Premier League',
      serieA: 'Serie A',
      nflPro: 'NFL Pro Leagues',
      liveFreshness: 'Updated live',
      extraValue: (delta) => `+${delta} extra payout vs lowest operator`,
      stakeLabel: 'Stake',
      transferOverlay: 'Transferring to operator...',
      navProtection: 'Responsible Gambling',
      navProtectionShort: 'RG',
      underageTitle: 'Underage Gambling Prevention Notice',
      parentalControls: 'Parental Control Tools',
      complianceTitle: 'Responsible Gambling & Player Protection Hub',
      termsTitle: 'Terms of Service',
      privacyTitle: 'Privacy Policy',
      responsibleTitle: 'Responsible Gambling',
    },
    ITA: {
      cta: 'Ottieni le quote',
      loading: 'Scansione feed live...',
      heroTitle: "<span class='text-white block whitespace-nowrap'>Quote immediate.</span> <span class='text-emerald-400 block whitespace-nowrap'>Vantaggio immediato.</span>",
      heroSubtitle: 'Scegli la scommessa. Troviamo le migliori quote.',
      quickPrompts: 'Partite live:',
      yourPrediction: 'Il Tuo Pronostico',
      transferSlip: 'Trasferisci Schedina',
      operatorComparison: 'Confronto Brand',
      redirectTo:
        'Le quote sono soggette a variazione e vengono confermate sul sito dell\'operatore. OddsPlease non raccoglie scommesse.',
      privacy: 'Informativa sulla Privacy',
      terms: 'Termini e Condizioni',
      responsibleGambling: 'Gioco Responsabile',
      liveBadge: 'QUOTE LIVE',
      marketOptions: 'Opzioni di Mercato',
      market1x2: 'Esito Finale (1X2)',
      marketBtts: 'Gol / No Gol',
      marketOu: 'Under / Over 2.5',
      drawLabel: 'Pareggio',
      transferCta: 'Trasferisci Schedina',
      transferCtaOperator: (name) => `Trasferisci Schedina su ${name}`,
      bestPrice: 'MIGLIOR QUOTA',
      fluctuationDisclaimer:
        'Le quote sono soggette a variazione e vengono confermate sul sito dell\'operatore. OddsPlease non raccoglie scommesse.',
      footerDisclaimer:
        'OddsPlease è un\'interfaccia di confronto indipendente e non raccoglie né gestisce scommesse. Tutte le scommesse vengono piazzate direttamente sui siti degli operatori autorizzati. Eventuali reclami o controversie devono essere rivolti direttamente all\'operatore di riferimento.',
      copyright: 'OddsPlease © 2026 · Motore di confronto quote indipendente · Non affiliato a nessun operatore',
      restrictedMarket:
        'Mercato Limitato: In ottemperanza ai regolamenti ADM, i mercati relativi a competizioni giovanili non sono disponibili.',
      seniorFixtures: 'Visualizza Partite Senior',
      premierLeague: 'Premier League',
      serieA: 'Serie A',
      nflPro: 'Lega NFL Pro',
      liveFreshness: 'Aggiornato live',
      extraValue: (delta) => `+${delta} vincita extra rispetto al minimo`,
      stakeLabel: 'Puntata',
      transferOverlay: 'Trasferimento all\'operatore...',
      navProtection: 'Gioco Responsabile',
      navProtectionShort: 'Gioco',
      underageTitle: 'Avviso sul Divieto di Gioco ai Minori',
      parentalControls: 'Strumenti di Controllo Genitoriale',
      complianceTitle: 'Conformità e Protezione del Giocatore',
      termsTitle: 'Termini e Condizioni di Servizio',
      privacyTitle: 'Informativa sulla Privacy',
      responsibleTitle: 'Gioco Responsabile',
    },
  },
};

export interface RegionConfig {
  label: string;
  flag: string;
  oddsApiRegion: string;
  bookmakers: string[];
  defaultOddsFormat: OddsFormat;
  defaultLanguage: Language;
  ageBadge: string;
  ageSubtext?: string;
  statutoryText: string;
  helplineLabel: string;
  complianceRoute: string;
  placeholder: string;
  pills: LivePill[];
  betFormatSingle: string;
  betFormatMulti: string;
  legCountLabel: (n: number) => string;
  restrictedStates?: string[];
  currency: string;
  currencySymbol: string;
  stakePresets: number[];
  defaultStake: number;
  rgBadge: string;
  rgCopy: string;
  rgLink: string;
  trustBadges: { label: string; url: string }[];
}

export const REGION_CONFIG: Record<Region, RegionConfig> = {
  UK: {
    label: 'UK',
    flag: '🇬🇧',
    oddsApiRegion: 'uk',
    bookmakers: ['paddypower', 'skybet', 'betfair_sb_uk', 'betfair_ex_uk'],
    defaultOddsFormat: 'fractional',
    defaultLanguage: 'ENG',
    ageBadge: '18+',
    statutoryText: 'Take time to think. Please gamble responsibly.',
    helplineLabel: 'National Gambling Helpline: 0808 8020 133',
    complianceRoute: '/safer-gambling',
    placeholder: 'Arsenal to beat Coventry and Over 1.5 Total Goals',
    pills: [],
    betFormatSingle: 'BET BUILDER',
    betFormatMulti: 'ACCUMULATOR',
    legCountLabel: (n) => (n === 1 ? '1 LEG' : `${n} LEGS`),
    currency: 'GBP',
    currencySymbol: '£',
    stakePresets: [5, 10, 20, 50],
    defaultStake: 10,
    rgBadge: '18+',
    rgCopy: '18+ Only. BeGambleAware.org. Please gamble responsibly. For free, confidential support, call 0808 8020 133.',
    rgLink: 'https://www.begambleaware.org',
    trustBadges: [
      { label: 'GAMSTOP', url: 'https://www.gamstop.co.uk' },
      { label: 'GamCare', url: 'https://www.gamcare.org.uk' },
      { label: 'BeGambleAware', url: 'https://www.begambleaware.org' },
      { label: 'Gambling Commission', url: 'https://www.gamblingcommission.gov.uk' },
    ],
  },
  US: {
    label: 'US',
    flag: '🇺🇸',
    oddsApiRegion: 'us',
    bookmakers: ['fanduel', 'draftkings'],
    defaultOddsFormat: 'american',
    defaultLanguage: 'ENG',
    ageBadge: '21+',
    ageSubtext: '18+ in WY, NH, RI, MT, DC',
    statutoryText: 'Gambling Problem? Call 1-800-GAMBLER.',
    helplineLabel: '1-800-GAMBLER',
    complianceRoute: '/responsible-gaming',
    placeholder: 'Chiefs moneyline, Mahomes 250+ pass yards, Kelce anytime TD',
    pills: [],
    betFormatSingle: 'SAME GAME PARLAY',
    betFormatMulti: 'PARLAY',
    legCountLabel: (n) => (n === 1 ? '1 LEG' : `${n} LEGS`),
    restrictedStates: ['MA', 'NY', 'PA', 'TN', 'IA', 'CT', 'VT', 'RI'],
    currency: 'USD',
    currencySymbol: '$',
    stakePresets: [10, 25, 50, 100],
    defaultStake: 25,
    rgBadge: '21+',
    rgCopy: '21+ (18+ in WY, NH, RI, MT, DC). Gambling Problem? Call 1-800-GAMBLER or visit ncpgambling.org. NY: Call 1-877-8-HOPENY or text HOPENY (467369). MA: Call 1-800-327-5050.',
    rgLink: 'https://www.800gambler.org',
    trustBadges: [
      { label: 'NCPG', url: 'https://www.ncpgambling.org' },
      { label: '1-800-GAMBLER', url: 'https://www.1800gambler.net' },
      { label: 'ICRG', url: 'https://www.icrg.org' },
    ],
  },
  IT: {
    label: 'IT',
    flag: '🇮🇹',
    oddsApiRegion: 'eu',
    bookmakers: ['sisal', 'snai', 'pokerstars', 'betfair_sb_uk', 'betfair_ex_eu'],
    defaultOddsFormat: 'decimal',
    defaultLanguage: 'ITA',
    ageBadge: '18+',
    statutoryText: 'Il gioco d\u2019azzardo può causare dipendenza patologica. Gioca responsabile.',
    helplineLabel: 'Telefono Verde Nazionale (TVNGA): 800 558822',
    complianceRoute: '/gioco-responsabile',
    placeholder: 'Inserisci evento, squadra o mercato',
    pills: [],
    betFormatSingle: 'STESSO EVENTO',
    betFormatMulti: 'MULTIPLA',
    legCountLabel: (n) => (n === 1 ? '1 SELEZIONE' : `${n} SELEZIONI`),
    currency: 'EUR',
    currencySymbol: '€',
    stakePresets: [5, 10, 20, 50],
    defaultStake: 10,
    rgBadge: '18+',
    rgCopy: 'Il gioco d\'azzardo può causare dipendenza patologica. Consulta le probabilità di vincita su adm.gov.it. Telefono Verde ISS: 800 55 88 22.',
    rgLink: 'https://www.adm.gov.it',
    trustBadges: [
      { label: 'ADM', url: 'https://www.adm.gov.it' },
      { label: 'Autoesclusione (RUA)', url: 'https://www.adm.gov.it/portale/autoesclusione-dal-gioco-a-distanza-giochi' },
      { label: 'Probabilità di Vincita', url: 'https://www.adm.gov.it/portale/giochi/probabilita-di-vincita' },
    ],
  },
};

export const US_STATE_HELPLINES: { state: string; number: string; text?: string }[] = [
  { state: 'National', number: '1-800-GAMBLER' },
  { state: 'NY', number: '1-877-8-HOPENY', text: 'text HOPENY 467369' },
  { state: 'MA', number: '1-800-327-5050' },
  { state: 'OH', number: '1-800-589-9966' },
  { state: 'CT', number: '1-888-789-7777' },
  { state: 'IN', number: '1-800-9-WITH-IT' },
  { state: 'VA', number: '1-888-532-3500' },
  { state: 'MI', number: '1-800-270-7117' },
];

export const US_VEP_STATES: { state: string; name: string; board: string; url: string }[] = [
  { state: 'AZ', name: 'Arizona', board: 'ADG', url: 'https:// Racing.az.gov' },
  { state: 'CO', name: 'Colorado', board: 'MGC', url: 'https://www.colorado.gov/pacific/enforcement/self-exclusion' },
  { state: 'CT', name: 'Connecticut', board: 'CPGC', url: 'https://portal.ct.gov/CPGC' },
  { state: 'DC', name: 'District of Columbia', board: 'OSLGC', url: 'https://oslgc.dc.gov' },
  { state: 'IL', name: 'Illinois', board: 'IGB', url: 'https://www.igb.illinois.gov' },
  { state: 'IN', name: 'Indiana', board: 'IIOC', url: 'https://www.in.gov/igc' },
  { state: 'IA', name: 'Iowa', board: 'IRGC', url: 'https://www.iowaracing.gov' },
  { state: 'KS', name: 'Kansas', board: 'KRGC', url: 'https://www.ksgambling.com' },
  { state: 'KY', name: 'Kentucky', board: 'KHRC', url: 'https://www.khrc.ky.gov' },
  { state: 'LA', name: 'Louisiana', board: 'LGCB', url: 'https://www.lgcb.org' },
  { state: 'MD', name: 'Maryland', board: 'MLGCA', url: 'https://www.mdgaming.com' },
  { state: 'MA', name: 'Massachusetts', board: 'MGC', url: 'https://massgaming.com/about/voluntary-self-exclusion/' },
  { state: 'MI', name: 'Michigan', board: 'MGCB', url: 'https://www.michigan.gov/mgcb' },
  { state: 'NV', name: 'Nevada', board: 'NGCB', url: 'https://gaming.nv.gov' },
  { state: 'NJ', name: 'New Jersey', board: 'DGE', url: 'https://www.njportal.com/dge/selfexclusion' },
  { state: 'NY', name: 'New York', board: 'NYGC', url: 'https://gaming.ny.gov/voluntary-self-exclusion' },
  { state: 'NC', name: 'North Carolina', board: 'NCLC', url: 'https://www.nclottery.com' },
  { state: 'OH', name: 'Ohio', board: 'OCCC', url: 'https://timeoutohio.com' },
  { state: 'PA', name: 'Pennsylvania', board: 'PGCB', url: 'https://gamingcontrolboard.pa.gov' },
  { state: 'TN', name: 'Tennessee', board: 'TEL', url: 'https://www.tn.gov/education/educator-preparation' },
  { state: 'VA', name: 'Virginia', board: 'VSLC', url: 'https://www.vasportsbetting.com' },
  { state: 'WV', name: 'West Virginia', board: 'WVLT', url: 'https://www.wvlottery.com' },
  { state: 'WY', name: 'Wyoming', board: 'WGC', url: 'https://gaming.wyo.gov' },
];

export const BLOCKING_TOOLS: { name: string; type: string; url: string }[] = [
  { name: 'BetBlocker', type: '100% Free Charity software', url: 'https://betblocker.org' },
  { name: 'Gamban', type: 'Paid / Free trial', url: 'https://gamban.com' },
  { name: 'GamBlock', type: 'Paid', url: 'https://www.gamblock.com' },
  { name: 'Net Nanny', type: 'Parental control / Paid', url: 'https://www.netnanny.com' },
];

export const UK_ACCOUNT_TOOLS: { icon: string; name: string; desc: string }[] = [
  { icon: '💳', name: 'Deposit Limits (Gross Deposit Cap)', desc: 'Restricts cumulative cash transferred into an account over daily, weekly, or monthly periods.' },
  { icon: '📉', name: 'Net Loss Limits', desc: 'Caps losses calculated after factoring in returns and withdrawals (Net Spend = Deposits - Withdrawals).' },
  { icon: '🛑', name: 'Gross Loss Limits', desc: 'Caps absolute monetary spend or total stakes placed within a given period.' },
  { icon: '⏸️', name: 'Time-Outs (Take a Break)', desc: 'Short-term cooling-off periods (24 hours to 6 weeks).' },
  { icon: '⏱️', name: 'Internal Self-Exclusion', desc: 'Long-term exclusion from an individual operator\'s portal (6 months to 5 years).' },
  { icon: '⌛', name: 'Reality Checks & Session Timers', desc: 'Automated pop-ups displaying total time active, money staked, and overall profit/loss.' },
  { icon: '📊', name: 'Profit & Loss Trackers', desc: 'Account dashboards displaying net spend over 7, 30, or 365 days.' },
  { icon: '🎯', name: 'Stake Limits & Product Blocks', desc: 'Restricts maximum stake on single bets or disables specific gaming categories.' },
];

export const IT_ACCOUNT_TOOLS: { icon: string; name: string; desc: string }[] = [
  { icon: '💳', name: 'Limiti di Deposito Obbligatori', desc: 'Limiti di deposito settimanali o mensili imposti per legge.' },
  { icon: '📉', name: 'Limiti di Spesa e Perdita', desc: 'Limiti sulla spesa e sulle perdite entro periodi definiti.' },
  { icon: '⏸️', name: 'Pausa Temporanea (Timeout)', desc: 'Sospensione temporanea dal gioco per un periodo breve.' },
  { icon: '⏱️', name: 'Autoesclusione Singolo Concessionario', desc: 'Autoesclusione da un singolo operatore per periodi lunghi.' },
  { icon: '⌛', name: 'Reality Check', desc: 'Promemoria automatici sul tempo di gioco e spesa totale.' },
  { icon: '📊', name: 'Riepilogo Storico del Conto', desc: 'Dashboard con storico del conto e net spend.' },
];

export const US_ACCOUNT_TOOLS: { icon: string; name: string; desc: string }[] = [
  { icon: '💳', name: 'Deposit Limits', desc: 'Caps on total deposits over daily, weekly, or monthly periods.' },
  { icon: '🎯', name: 'Wager Limits (Spending Caps)', desc: 'Restricts total amount wagered within a given period.' },
  { icon: '📉', name: 'Net & Gross Loss Limits', desc: 'Caps on net and absolute losses within a defined timeframe.' },
  { icon: '⏸️', name: 'Cool-Off Periods', desc: 'Short-term breaks from 3 to 30 days.' },
  { icon: '⌛', name: 'Session Timers', desc: 'Automated pop-ups showing time spent and net profit/loss.' },
  { icon: '⏱️', name: 'Account Exclusion', desc: 'Long-term self-exclusion from an operator\'s platform.' },
];

export const TEAM_ALIASES: Record<string, string[]> = {
  'man utd': ['manchester united', 'man united', 'man utd'],
  'man city': ['manchester city', 'man city'],
  'spurs': ['tottenham hotspur', 'tottenham', 'spurs'],
  'juve': ['juventus', 'juve'],
  'pats': ['new england patriots', 'patriots', 'pats'],
  'real': ['real madrid', 'real'],
  'barca': ['barcelona', 'barca'],
  'psg': ['paris saint germain', 'paris saint-germain', 'psg'],
  'bayern': ['bayern munich', 'bayern'],
};

export const FALLBACK_PILLS: Record<Region, LivePill[]> = {
  UK: [
    { label: 'Premier League', text: 'Premier League', emoji: '⚽' },
    { label: 'Champions League', text: 'Champions League', emoji: '⚽' },
    { label: 'Tennis ATP', text: 'Tennis ATP', emoji: '🎾' },
    { label: 'Rugby Super League', text: 'Rugby Super League', emoji: '🏉' },
  ],
  US: [
    { label: 'NFL', text: 'NFL', emoji: '🏈' },
    { label: 'NBA', text: 'NBA', emoji: '🏀' },
    { label: 'MLB', text: 'MLB', emoji: '⚾' },
    { label: 'NHL', text: 'NHL', emoji: '🏒' },
  ],
  IT: [
    { label: 'Serie A', text: 'Serie A', emoji: '⚽' },
    { label: 'Champions League', text: 'Champions League', emoji: '⚽' },
    { label: 'Tennis ATP', text: 'Tennis ATP', emoji: '🎾' },
    { label: 'Formula 1', text: 'Formula 1', emoji: '🏎️' },
  ],
};
