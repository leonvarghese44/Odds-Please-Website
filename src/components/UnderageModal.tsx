import { X, ShieldAlert } from 'lucide-react';
import type { Region, Language } from '@/constants';
import { DIALECT, BLOCKING_TOOLS } from '@/constants';

interface UnderageModalProps {
  open: boolean;
  onClose: () => void;
  region: Region;
  language: Language;
}

export function UnderageModal({ open, onClose, region, language }: UnderageModalProps) {
  if (!open) return null;
  const strings = DIALECT[region][language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg space-y-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 text-zinc-400 transition hover:text-white">
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
          <ShieldAlert className="h-6 w-6 text-red-400" />
          <h3 className="text-lg font-bold text-white">{strings.underageTitle}</h3>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-xs leading-relaxed text-red-300">
          <ShieldAlert className="h-4 w-4 flex-shrink-0 text-red-400" />
          <p>
            {region === 'IT'
              ? 'Il gioco d\u2019azzardo da parte di minori \u00e8 un reato. Le scommesse per conto di un minore (scommesse proxy) e la condivisione delle credenziali del proprio conto di gioco con soggetti sotto i 18 anni sono strettamente vietate e illegali. OddsPlease applica rigidi controlli di verifica dell\u2019identit\u00e0 e dell\u2019et\u00e0 tramite gli operatori licenziatari prima che qualsiasi scommessa possa essere elaborata.'
              : region === 'US'
                ? 'Underage gambling is unlawful and strictly prohibited under state and federal law. Legal age is 21+ (18+ in DC, KY, WY, MT, NH, RI). Placing wagers on behalf of a minor (proxy wagering) or sharing account credentials is strictly illegal.'
                : 'Underage gambling is a criminal offence. Placing bets on behalf of a minor or sharing account credentials with individuals under 18 is strictly prohibited and unlawful. OddsPlease enforces strict identity and age verification checks through licensed operators before any bet can be processed.'}
          </p>
        </div>

        <div className="space-y-2">
          <span className="block text-xs font-bold text-zinc-300">{strings.parentalControls}</span>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {BLOCKING_TOOLS.map((tool) => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-center text-xs font-medium text-zinc-300 transition hover:bg-zinc-800"
              >
                {tool.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
