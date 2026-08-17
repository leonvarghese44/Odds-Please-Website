import { TrendingUp, Clock } from 'lucide-react';
import type { BetSlip, Region, Language } from '../constants';
import { REGION_CONFIG, getSportEmoji } from '../constants';

interface EventHeaderCardProps {
  slip: BetSlip;
  region: Region;
  language: Language;
}

export function EventHeaderCard({ slip, region }: EventHeaderCardProps) {
  const cfg = REGION_CONFIG[region];
  const isIT = region === 'IT';

  const betFormat = slip.legs.length === 1
    ? (isIT ? 'SINGOLA' : 'SINGLE BET')
    : slip.isSingleMatch
      ? cfg.betFormatSingle
      : cfg.betFormatMulti;

  const sportLabel = slip.sport.replace(/Soccer/gi, 'Football');
  const sportIcon = getSportEmoji(slip.sportKey);

  return (
    <div className="flex items-center justify-between gap-3 border-b border-zinc-800 bg-black px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-2xl">
          {sportIcon}
        </div>
        <div>
          <h2 className="font-sans text-base font-bold leading-tight tracking-[-0.02em] text-white">{slip.match}</h2>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs font-normal text-zinc-400">
            <span>{sportLabel} · {slip.competition}</span>
            <span className="text-zinc-700">•</span>
            <Clock className="h-3 w-3" />
            {slip.kickoff}
          </p>
        </div>
      </div>

      <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
          {cfg.legCountLabel(slip.legs.length)}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-zinc-800 bg-black px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
          <TrendingUp className="h-3 w-3" />
          {betFormat}
        </span>
      </div>
    </div>
  );
}
