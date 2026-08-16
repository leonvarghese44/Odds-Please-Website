import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Lock, AlertCircle, ExternalLink, Check, Crown } from 'lucide-react';
import type { OperatorOffer, OddsFormat, Region, Language } from '../constants';
import { DIALECT } from '../constants';
import { formatOdds } from '../utils/odds';

interface OperatorCardProps {
  operator: OperatorOffer;
  oddsFormat: OddsFormat;
  region: Region;
  language: Language;
  bestOdds: number;
  onTransfer: (operator: OperatorOffer) => void;
  priceShift?: 'up' | 'down' | null;
}

function OperatorLogo({ operatorKey, name }: { operatorKey: string; name: string }) {
  const [imgFailed, setImgFailed] = useState(false);
  const safeKey = (operatorKey || '').toLowerCase();

  useEffect(() => {
    setImgFailed(false);
  }, [safeKey]);

  const logos: Record<string, { bg: string; text: string; label: string }> = {
    paddypower: { bg: '#0a5c36', text: '#fff', label: 'PP' },
    skybet: { bg: '#0a2d6e', text: '#fff', label: 'SB' },
    betfair_sb_uk: { bg: '#ffb800', text: '#1a1a1a', label: 'BF' },
    betfair_ex_uk: { bg: '#ffb800', text: '#1a1a1a', label: 'BFx' },
    betfair_sb_eu: { bg: '#ffb800', text: '#1a1a1a', label: 'BF' },
    betfair_ex_eu: { bg: '#ffb800', text: '#1a1a1a', label: 'BFx' },
    pokerstars: { bg: '#1a1a2e', text: '#c41e3a', label: 'PS' },
    fanduel: { bg: '#1493c4', text: '#fff', label: 'FD' },
    draftkings: { bg: '#1a4d2e', text: '#fff', label: 'DK' },
    sisal: { bg: '#003d7a', text: '#fff', label: 'SI' },
    snai: { bg: '#0066cc', text: '#fff', label: 'SN' },
    betvictor: { bg: '#002855', text: '#fff', label: 'BV' },
    coral: { bg: '#002b49', text: '#fff', label: 'Cor' },
    williamhill: { bg: '#0c2340', text: '#f5b112', label: 'WH' },
    ladbrokes: { bg: '#ee3124', text: '#fff', label: 'Lad' },
    ladbrokes_uk: { bg: '#ee3124', text: '#fff', label: 'Lad' },
  };

  if (!imgFailed) {
    return (
      <img
        src={`/operators/${safeKey}.png`}
        alt={name}
        className="h-8 w-8 rounded-lg object-contain bg-white border border-zinc-800"
        onError={() => setImgFailed(true)}
      />
    );
  }

  const logo = logos[safeKey] ?? { bg: '#ee3124', text: '#fff', label: name.charAt(0).toUpperCase() };
  return (
    <div
      className="flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-bold tracking-tight"
      style={{ backgroundColor: logo.bg, color: logo.text }}
    >
      {logo.label}
    </div>
  );
}

export function OperatorCard({
  operator,
  oddsFormat,
  region,
  language,
  bestOdds,
  onTransfer,
  priceShift,
}: OperatorCardProps) {
  const strings = DIALECT[region][language];
  const [showTooltip, setShowTooltip] = useState(false);

  if (!operator.available) {
    return (
      <div
        className="relative rounded-xl border border-zinc-800 bg-black/30 p-4"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="opacity-40 grayscale">
              <OperatorLogo operatorKey={operator.key} name={operator.name} />
            </div>
            <span className="text-sm font-semibold text-zinc-500">{operator.name}</span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            <Lock className="h-2.5 w-2.5" />
            {region === 'IT' ? 'Quota Non Disponibile' : 'Odds Unlisted'}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-zinc-600">—</span>
          <button
            disabled
            className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg bg-black px-3.5 py-2 text-xs font-bold text-zinc-600 opacity-50"
          >
            <Lock className="h-3.5 w-3.5" />
            {region === 'IT' ? 'Schedina Non Disponibile' : 'Slip Unavailable'}
          </button>
        </div>
        {showTooltip && (
          <div className="absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-zinc-700 bg-black px-3 py-2 text-xs text-zinc-300 shadow-xl">
            {region === 'IT' ? 'Nessuna quota live disponibile per questa partita da questo operatore.' : 'No live odds available for this fixture from this operator.'}
          </div>
        )}
      </div>
    );
  }

  const isBest = operator.combinedOdds !== null && operator.combinedOdds >= bestOdds;
  const shiftIcon =
    priceShift === 'up' ? (
      <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
    ) : priceShift === 'down' ? (
      <ArrowDownRight className="h-3.5 w-3.5 text-red-400" />
    ) : null;

  return (
    <div
      className={`rounded-xl border p-4 transition-all ${
        isBest
          ? 'border-amber-400/80 bg-amber-400/5 shadow-[0_0_12px_rgba(251,191,36,0.15)]'
          : 'border-zinc-700 bg-black/40'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <OperatorLogo operatorKey={operator.key} name={operator.name} />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-white">{operator.name}</span>
              {isBest && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide">
                  <Crown className="h-2.5 w-2.5" />
                  {strings.bestPrice}
                </span>
              )}
            </div>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="text-lg font-bold tabular-nums text-zinc-100">
                {formatOdds(operator.combinedOdds ?? 0, oddsFormat)}
              </span>
              {shiftIcon}
            </div>
          </div>
        </div>

        <button
          onClick={() => onTransfer(operator)}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-semibold transition-all active:scale-95 ${
            isBest
              ? 'bg-amber-400 text-ink-900 hover:bg-amber-300'
              : 'bg-emerald-500 text-ink-900 hover:bg-emerald-500'
          }`}
        >
          <Lock className="h-3.5 w-3.5" />
          {strings.transferSlip}
          <ExternalLink className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

export function PriceShiftNotice() {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      System Notice: Odds updated prior to transfer.
    </div>
  );
}

export function TransferConfirmation({ operatorName }: { operatorName: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
      <Check className="h-4 w-4 flex-shrink-0" />
      Redirecting to {operatorName}... Review and confirm your bet on the operator portal.
    </div>
  );
}