import { useState, useCallback, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { PredictionInput } from '@/components/PredictionInput';
import { BetSlipCard } from '@/components/BetSlipCard';
import { RestrictedMarketNotice } from '@/components/RestrictedMarketNotice';
import { SignedOutHeroBanner } from '@/components/SignedOutHeroBanner';
import { AuthModal } from '@/components/AuthModal';
import { useDemo } from '@/context/DemoContext';
import { DIALECT, REGION_CONFIG, getSportEmoji, type BetSlip, type Region, type Language, type OddsFormat, type LivePill, type CandidateFixture } from '@/constants';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

function normalizeLivePill(value: unknown): LivePill | null {
  if (!value || typeof value !== 'object') return null;
  const pill = value as Partial<LivePill>;
  if (typeof pill.label !== 'string' || typeof pill.text !== 'string') return null;

  const eventId = typeof pill.eventId === 'string' ? pill.eventId : undefined;
  const sportKey = typeof pill.sportKey === 'string' ? pill.sportKey : undefined;
  const backendEmoji = typeof pill.emoji === 'string' && pill.emoji.trim() ? pill.emoji : '🏆';
  return {
    label: pill.label,
    text: pill.text,
    emoji: sportKey ? getSportEmoji(sportKey) : backendEmoji,
    eventId,
    sportKey,
    live: pill.live,
    score: pill.score,
    time: pill.time,
  };
}

interface AppProps {
  region: Region;
  language: Language;
  oddsFormat: OddsFormat;
  onOddsFormatChange: (format: OddsFormat) => void;
}

export default function App({ region, language, oddsFormat, onOddsFormatChange }: AppProps) {
  const strings = DIALECT[region][language];
  const { isLoggedIn, login } = useDemo();
  const [prompt, setPrompt] = useState('');
  const [slip, setSlip] = useState<BetSlip | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quickPrompts, setQuickPrompts] = useState<LivePill[]>([]);
  const [selectedFixture, setSelectedFixture] = useState<{ eventId: string; sportKey: string } | null>(null);
  const [authOpen, setAuthOpen] = useState(false);

  const fetchLivePills = useCallback(async (signal?: AbortSignal) => {
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/live-fixtures?region=${REGION_CONFIG[region].oddsApiRegion}`, {
        headers: { Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
        signal,
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data?.pills && Array.isArray(data.pills)) {
        const normalizedPills = (data.pills as unknown[])
          .map(normalizeLivePill)
          .filter((pill): pill is LivePill => pill !== null);
        setQuickPrompts(normalizedPills);
      }
    } catch {
      // silent fail — pills are non-critical
    }
  }, [region]);

  // Fetch live pills on mount and whenever the selected region changes.
  useEffect(() => {
    const controller = new AbortController();
    setQuickPrompts([]);
    fetchLivePills(controller.signal);
    return () => controller.abort();
  }, [fetchLivePills]);

  const analyze = useCallback(async (predictionText?: string, fixture?: { eventId: string; sportKey: string } | null, market?: string) => {
    const text = predictionText ?? prompt;
    if (!text.trim() && !fixture) return;

    setLoading(true);
    setError(null);
    setSlip(null);
    if (!fixture) setSelectedFixture(null);

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/analyze-prediction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          prediction: text,
          region: REGION_CONFIG[region].oddsApiRegion,
          oddsFormat,
          eventId: fixture?.eventId,
          sportKey: fixture?.sportKey,
          market,
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        if (res.status === 404) {
          throw new Error(errBody?.error || 'No odds found for this prediction.');
        }
        throw new Error(errBody?.error || `Request failed: ${res.status}`);
      }

      const data = await res.json().catch(() => null) as BetSlip | null;
      const hasResults = data?.source === 'disambiguation'
        ? Boolean(data.candidateFixtures?.length)
        : Boolean(data?.legs?.length);

      if (!data || !hasResults) {
        throw new Error('No odds found for this prediction.');
      }

      if (data.source !== 'disambiguation' && data.eventId && data.sportKey) {
        setSelectedFixture({ eventId: data.eventId, sportKey: data.sportKey });
      } else if (data.source === 'disambiguation') {
        setSelectedFixture(null);
      }
      setSlip(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to analyze prediction';
      setError(msg);
      setSlip(null);
    } finally {
      setLoading(false);
    }
  }, [prompt, region, oddsFormat]);

  const handlePillClick = useCallback((pill: LivePill) => {
    setPrompt(pill.text);
    const fixture = pill.eventId && pill.sportKey
      ? { eventId: pill.eventId, sportKey: pill.sportKey }
      : null;
    setSelectedFixture(fixture);
    analyze(fixture ? '' : pill.text, fixture);
  }, [analyze]);

  const handleSelectFixture = useCallback((candidate: CandidateFixture) => {
    setSelectedFixture({ eventId: candidate.eventId, sportKey: candidate.sportKey });
    analyze(prompt, { eventId: candidate.eventId, sportKey: candidate.sportKey });
  }, [analyze, prompt]);

  const handleSelectMarket = useCallback((marketKey: string) => {
    if (selectedFixture) {
      analyze(prompt, selectedFixture, marketKey);
    }
  }, [analyze, prompt, selectedFixture]);

  return (
    <div className="space-y-6">
      {/* Signed-out hero banner */}
      {!isLoggedIn && <SignedOutHeroBanner region={region} onOpenAuthModal={() => setAuthOpen(true)} />}

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onSuccessLogin={login} />

      {/* Hero */}
      <div className="mx-auto max-w-4xl space-y-4 text-center">
        <h1 className="text-4xl font-display font-black leading-[1.1] tracking-tight sm:text-5xl md:text-6xl" dangerouslySetInnerHTML={{ __html: strings.heroTitle }} />
        <p className="mx-auto max-w-lg text-sm font-normal text-center text-zinc-400 sm:text-base">{strings.heroSubtitle}</p>
      </div>

      {/* Prediction Input */}
      <PredictionInput
        region={region}
        language={language}
        prompt={prompt}
        onPromptChange={setPrompt}
        onAnalyze={() => analyze()}
        onPillClick={handlePillClick}
        onHotMarketClick={(text) => { setPrompt(text); analyze(text); }}
        loading={loading}
        quickPrompts={quickPrompts}
      />

      {/* Restricted market notice — only shows for restricted search terms */}
      {/(u18|u21|youth|academy|under 18|under-18)/i.test(prompt) && (
        <RestrictedMarketNotice region={region} language={language} onAlternative={(text) => { setPrompt(text); analyze(text); }} />
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 animate-fade-in">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
          <div>
            <p className="text-sm font-semibold text-red-300">Analysis failed</p>
            <p className="text-xs text-red-200/80">{error}</p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && !slip && (
        <div className="flex flex-col items-center justify-center gap-4 py-16 animate-fade-in">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
          <p className="text-sm font-medium text-zinc-400">{strings.loading}</p>
        </div>
      )}

      {/* Bet Slip */}
      {slip && !loading && (
        <BetSlipCard
          slip={slip}
          region={region}
          language={language}
          oddsFormat={oddsFormat}
          onOddsFormatChange={onOddsFormatChange}
          onSelectFixture={handleSelectFixture}
          onSelectMarket={handleSelectMarket}
        />
      )}
    </div>
  );
}
