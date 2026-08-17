import { useEffect, useRef } from 'react';
import { Loader2, Search } from 'lucide-react';
import type { Region, Language, LivePill } from '@/constants';
import { REGION_CONFIG, DIALECT } from '@/constants';
import { HotMarkets } from '@/components/HotMarkets';

interface PredictionInputProps {
  region: Region;
  language: Language;
  prompt: string;
  onPromptChange: (text: string) => void;
  onAnalyze: () => void;
  onPillClick: (pill: LivePill) => void;
  onHotMarketClick: (searchText: string) => void;
  loading: boolean;
  quickPrompts: LivePill[];
}

export function PredictionInput({
  region,
  language,
  prompt,
  onPromptChange,
  onAnalyze,
  onPillClick,
  onHotMarketClick,
  loading,
  quickPrompts,
}: PredictionInputProps) {
  const cfg = REGION_CONFIG[region];
  const strings = DIALECT[region][language];
  const pills = quickPrompts ?? [];
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleLivePillClick = (pill: LivePill) => {
    onPillClick(pill);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  return (
    <div className="mx-auto mt-8 w-full max-w-4xl">
      {/* Search card */}
      <div className="space-y-6 rounded-2xl border border-emerald-500/20 bg-black p-8 pt-20 shadow-[0_0_30px_rgba(99,255,14,0.08)]">
        <div className="mb-10 flex items-center justify-center bg-transparent">
          <img
            src="/OPlogo.png"
            alt="OddsPlease"
            className="h-28 w-auto rounded-lg object-contain bg-transparent"
          />
        </div>

        <div className="mx-auto w-full max-w-2xl space-y-6">
          <div className="relative flex items-center">
            <Search className="pointer-events-none absolute left-4 text-zinc-500" size={18} />
            <input
              ref={inputRef}
              type="text"
              autoFocus
              value={prompt}
              onChange={(e) => onPromptChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') onAnalyze(); }}
              placeholder={cfg.placeholder}
              className="w-full rounded-xl bg-transparent py-4 pl-11 pr-4 text-sm font-sans text-zinc-100 caret-[#63FF0E] outline-none transition placeholder-zinc-600 focus:ring-1 focus:ring-emerald-500/40 md:text-base"
            />
          </div>

          <button
            onClick={onAnalyze}
            disabled={loading || !prompt.trim()}
            className="group w-full rounded-xl bg-emerald-500 py-4 px-6 text-base font-bold text-black shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                {strings.loading}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                {strings.cta}
                <svg className="w-5 h-5 fill-current transition-transform duration-300 ease-in-out group-hover:translate-x-1 group-hover:-translate-y-1" viewBox="0 0 24 24"><path d="M5 19L14 10V15H17V5H7V8H12L3 17L5 19Z" /></svg>
              </span>
            )}
          </button>

          <div className="mt-8 flex items-center justify-center text-xs text-zinc-500">
            <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#63FF0E] shadow-[0_0_8px_rgba(99,255,14,0.8)]" />
            <span>
              {region === 'IT'
                ? 'Analizzando i feed live per le migliori quote'
                : region === 'US'
                  ? 'Scanning live feeds for the best lines'
                  : 'Scanning live feeds for the best odds'}
            </span>
          </div>

          <div className="w-full overflow-x-auto scrollbar-none flex items-center gap-2.5 py-3 px-2 mt-4 border-t border-zinc-800/60">
            <HotMarkets
              region={region}
              onItemClick={onHotMarketClick}
              livePills={pills}
              onLivePillClick={handleLivePillClick}
              embedded
            />
          </div>
        </div>
      </div>
    </div>
  );
}
