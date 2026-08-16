import { useState, useEffect, useCallback } from 'react';
import { DUMMY_ODDS } from '@/data/dummyOdds';

const API_KEY = import.meta.env.VITE_ODDS_API_KEY || 'ccb5cfa1c1d8909e7668399923bbec06';
const BASE_URL = 'https://api.the-odds-api.com/v4/sports';
const CACHE_TTL = 3 * 60 * 1000;

export interface Outcome {
  name: string;
  price: number;
  link?: string;
}

export interface Market {
  key: string;
  last_update: number | string;
  outcomes: Outcome[];
  link?: string;
}

export interface Bookmaker {
  key: string;
  title: string;
  last_update: number | string;
  markets: Market[];
  link?: string;
}

export interface OddsEvent {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Bookmaker[];
}

export function useOddsData(sportKey = 'upcoming', region = 'uk') {
  const [data, setData] = useState<OddsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quotaRemaining, setQuotaRemaining] = useState<string | null>(null);

  const fetchOdds = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    const cacheKey = `op_cache_${sportKey}_${region}`;

    if (!forceRefresh) {
      const cachedItem = sessionStorage.getItem(cacheKey);
      if (cachedItem) {
        try {
          const { timestamp, payload } = JSON.parse(cachedItem);
          if (Date.now() - timestamp < CACHE_TTL && payload && payload.length > 0) {
            setData(payload);
            setLoading(false);
            return;
          }
        } catch {
          sessionStorage.removeItem(cacheKey);
        }
      }
    } else {
      sessionStorage.removeItem(cacheKey);
    }

    try {
      const response = await fetch(
        `${BASE_URL}/${sportKey}/odds/?apiKey=${API_KEY}&regions=${region}&markets=h2h,totals,btts&oddsFormat=decimal&includeLinks=true`,
      );

      if (!response.ok) {
        let detail = response.statusText;
        if (!detail) {
          try {
            const body = await response.json();
            detail = body?.message || body?.error || '';
          } catch {
            detail = '';
          }
        }
        throw new Error(`API Error: ${response.status} ${detail}`.trim());
      }

      const remaining = response.headers.get('x-requests-remaining');
      if (remaining) setQuotaRemaining(remaining);

      const result: OddsEvent[] = await response.json();

      if (!result || result.length === 0) {
        console.warn(`[OddsPlease] Empty live response for ${sportKey}.`);
        setData(DUMMY_ODDS);
      } else {
        sessionStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), payload: result }));
        setData(result);
      }

      setLoading(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown fetch error';
      console.error('[OddsPlease] Fetch error:', msg);
      setError(msg);
      setData(DUMMY_ODDS);
      setLoading(false);
    }
  }, [sportKey, region]);

  useEffect(() => {
    fetchOdds(false);
  }, [fetchOdds]);

  const refreshData = () => fetchOdds(true);

  return { data, loading, error, quotaRemaining, refreshData };
}
