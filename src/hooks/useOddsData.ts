import { useState, useEffect, useCallback } from 'react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const CACHE_TTL = 3 * 60 * 1000;

export interface Outcome {
  name: string;
  description?: string;
  price: number;
  point?: number;
  link?: string;
  sid?: string | number | null;
}

export interface Market {
  key: string;
  last_update: number | string;
  outcomes: Outcome[];
  link?: string;
  sid?: string | number | null;
}

export interface Bookmaker {
  key: string;
  title: string;
  last_update: number | string;
  markets: Market[];
  link?: string;
  sid?: string | number | null;
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
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        throw new Error('Supabase is not configured.');
      }
      const markets = sportKey.startsWith('soccer')
        ? 'h2h,totals,btts'
        : sportKey === 'upcoming'
          ? 'h2h'
          : 'h2h,spreads,totals';
      const query = new URLSearchParams({
        sportKey,
        regions: region,
        markets,
        oddsFormat: 'decimal',
      });
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/odds-proxy?${query.toString()}`,
        { headers: { Authorization: `Bearer ${SUPABASE_ANON_KEY}` } },
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
        setData([]);
        setError('No odds found for this sport.');
      } else {
        sessionStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), payload: result }));
        setData(result);
      }

      setLoading(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown fetch error';
      console.error('[OddsPlease] Fetch error:', msg);
      setError(msg);
      setData([]);
      setLoading(false);
    }
  }, [sportKey, region]);

  useEffect(() => {
    fetchOdds(false);
  }, [fetchOdds]);

  const refreshData = () => fetchOdds(true);

  return { data, loading, error, quotaRemaining, refreshData };
}
