import { ShieldCheck, ExternalLink } from 'lucide-react';
import type { Region } from '../constants';
import { REGION_CONFIG } from '../constants';

export function ResponsibleGamblingNotice({ region }: { region: Region }) {
  const cfg = REGION_CONFIG[region];
  return (
    <div className="mt-4 px-5">
      <div className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-800/40 px-4 py-3.5">
        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white text-red-600 font-bold border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.12)] text-sm">
          {cfg.rgBadge}
        </span>
        <div className="flex-1">
          <p className="text-xs leading-relaxed text-zinc-400">{cfg.rgCopy}</p>
          <a
            href={cfg.rgLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-emerald-400 hover:text-emerald-300"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            {region === 'IT' ? 'Visita il sito' : 'Learn more'}
            <ExternalLink className="h-3 w-3 opacity-50" />
          </a>
        </div>
      </div>
    </div>
  );
}
