import type { OddsEvent } from '@/hooks/useOddsData';

export const DUMMY_ODDS: OddsEvent[] = [
  {
    id: 'dummy_1',
    sport_key: 'soccer_epl',
    sport_title: 'EPL Premier League',
    commence_time: new Date(Date.now() + 3600_000).toISOString(),
    home_team: 'Arsenal',
    away_team: 'Chelsea',
    bookmakers: [
      {
        key: 'paddypower',
        title: 'Paddy Power',
        last_update: Date.now(),
        markets: [
          {
            key: 'h2h',
            last_update: Date.now(),
            outcomes: [
              { name: 'Arsenal', price: 2.1 },
              { name: 'Chelsea', price: 3.4 },
              { name: 'Draw', price: 3.2 },
            ],
          },
        ],
      },
      {
        key: 'skybet',
        title: 'Sky Bet',
        last_update: Date.now(),
        markets: [
          {
            key: 'h2h',
            last_update: Date.now(),
            outcomes: [
              { name: 'Arsenal', price: 2.25 },
              { name: 'Chelsea', price: 3.5 },
              { name: 'Draw', price: 3.1 },
            ],
          },
        ],
      },
      {
        key: 'betfair_sb_uk',
        title: 'Betfair',
        last_update: Date.now(),
        markets: [
          {
            key: 'h2h',
            last_update: Date.now(),
            outcomes: [
              { name: 'Arsenal', price: 2.15 },
              { name: 'Chelsea', price: 3.6 },
              { name: 'Draw', price: 3.25 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'dummy_2',
    sport_key: 'basketball_nba',
    sport_title: 'NBA Basketball',
    commence_time: new Date(Date.now() + 7200_000).toISOString(),
    home_team: 'LA Lakers',
    away_team: 'Boston Celtics',
    bookmakers: [
      {
        key: 'fanduel',
        title: 'FanDuel',
        last_update: Date.now(),
        markets: [
          {
            key: 'h2h',
            last_update: Date.now(),
            outcomes: [
              { name: 'LA Lakers', price: 1.95 },
              { name: 'Boston Celtics', price: 1.85 },
            ],
          },
        ],
      },
      {
        key: 'skybet',
        title: 'Sky Bet',
        last_update: Date.now(),
        markets: [
          {
            key: 'h2h',
            last_update: Date.now(),
            outcomes: [
              { name: 'LA Lakers', price: 2.0 },
              { name: 'Boston Celtics', price: 1.8 },
            ],
          },
        ],
      },
    ],
  },
];
