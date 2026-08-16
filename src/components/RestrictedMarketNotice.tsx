import { Ban, ArrowRight } from 'lucide-react';
import type { Region, Language } from '../constants';
import { DIALECT } from '../constants';

interface RestrictedMarketNoticeProps {
  region: Region;
  language: Language;
  onAlternative?: (text: string) => void;
}

export function RestrictedMarketNotice({ region, language, onAlternative }: RestrictedMarketNoticeProps) {
  const strings = DIALECT[region][language];
  const alternatives = [
    { label: strings.seniorFixtures, text: 'Premier League' },
    { label: strings.premierLeague, text: 'Premier League' },
    { label: strings.serieA, text: 'Serie A' },
    { label: strings.nflPro, text: 'NFL' },
  ];

  return (
    <div className="mt-8 animate-fade-up">
      <div className="overflow-hidden rounded-2xl border border-amber-500/30 bg-amber-500/5 shadow-2xl shadow-black/50">
        <div className="px-5 py-4 border-b border-amber-500/20">
          <div className="flex items-center gap-2.5">
            <Ban className="h-5 w-5 text-amber-400" />
            <h2 className="text-base font-bold text-amber-300">
              {region === 'IT' ? 'Mercato Limitato' : 'Market Restricted'}
            </h2>
          </div>
        </div>
        <div className="px-5 py-5">
          <p className="text-sm leading-relaxed text-zinc-300">{strings.restrictedMarket}</p>
          <div className="mt-5">
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              {region === 'IT' ? 'Alternative disponibili' : 'Available alternatives'}
            </p>
            <div className="flex flex-wrap gap-2.5">
              {alternatives.map((alt) => (
                <button
                  key={alt.label}
                  onClick={() => onAlternative?.(alt.text)}
                  className="group inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-all hover:border-emerald-500/50 hover:bg-emerald-500/5 hover:text-emerald-400 active:scale-95"
                >
                  {alt.label}
                  <ArrowRight className="h-3.5 w-3.5 text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
