import { useState } from 'react';
import type { Region, OddsFormat, OperatorOffer } from '@/constants';
import { REGION_CONFIG } from '@/constants';
import { formatOdds } from '@/utils/odds';

interface StakeSelectorProps {
  region: Region;
  oddsFormat: OddsFormat;
  operators: OperatorOffer[];
  totalOdds: number;
  onStakeChange: (stake: number) => void;
  operatorOptions?: { key: string; name: string }[];
  selectedOperatorKey?: string;
  onOperatorChange?: (operatorKey: string) => void;
  isBestPriceSelected?: boolean;
}

export function StakeSelector({
  region,
  oddsFormat,
  operators,
  totalOdds,
  onStakeChange,
  operatorOptions = [],
  selectedOperatorKey,
  onOperatorChange,
  isBestPriceSelected = true,
}: StakeSelectorProps) {
  const cfg = REGION_CONFIG[region];
  const [stake, setStake] = useState(cfg.defaultStake);
  const sym = cfg.currencySymbol;

  const bestOp = operators.find((o) => o.available && o.combinedOdds);
  const bestOdds = totalOdds || bestOp?.combinedOdds || 0;
  const potentialReturn = (stake * bestOdds).toFixed(2);
  const selectedOperatorName = operatorOptions.find((operator) => operator.key === selectedOperatorKey)?.name ?? bestOp?.name;
  const oddsLabel = isBestPriceSelected
    ? region === 'IT' ? 'Miglior Quota' : 'Best Market Odds'
    : region === 'IT' ? 'Quota Selezionata' : 'Selected Odds';

  const handleStakeChange = (val: number) => {
    setStake(val);
    onStakeChange(val);
  };

  return (
    <div className="space-y-5 border-b border-zinc-800/60 px-5 py-5">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <div>
          <span className="block text-xs font-medium text-zinc-400">
            {region === 'IT' ? 'Puntata Selezionata' : 'Selected Wager'}
          </span>
          {operatorOptions.length > 1 && selectedOperatorKey && onOperatorChange ? (
            <select
              aria-label="Selected wager bookmaker"
              value={selectedOperatorKey}
              onChange={(event) => onOperatorChange(event.target.value)}
              className="block max-w-[220px] cursor-pointer bg-transparent text-lg font-bold text-white outline-none"
            >
              {operatorOptions.map((operator) => (
                <option key={operator.key} value={operator.key} className="bg-zinc-950 text-white">
                  {operator.name}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-lg font-bold text-white">
              {selectedOperatorName ?? (region === 'IT' ? 'Miglior Quota' : 'Best Market Odds')}
            </span>
          )}
        </div>
        <div className="text-right">
          <span className="block text-xs font-medium text-zinc-400">
            {oddsLabel}
          </span>
          <span className="text-2xl font-bold tabular-nums text-emerald-400">
            {bestOdds > 0 ? formatOdds(bestOdds, oddsFormat) : '\u2014'}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            {region === 'IT' ? 'Puntata' : 'Enter Stake'}
          </label>
          <div className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-black px-3 py-1.5 text-sm font-bold">
            <span className="tabular-nums text-zinc-400">{sym}</span>
            <input
              type="number"
              value={stake === 0 ? '' : stake}
              onChange={(e) => {
                const parsed = parseInt(e.target.value, 10);
                handleStakeChange(Number.isNaN(parsed) ? 0 : Math.max(0, parsed));
              }}
              className="w-16 bg-transparent text-right tabular-nums font-bold text-emerald-400 outline-none"
              min={0}
              step={1}
              placeholder="0"
            />
          </div>
        </div>

        <input
          type="range"
          min={5}
          max={Math.max(250, cfg.stakePresets[cfg.stakePresets.length - 1] ?? 250)}
          step={5}
          value={stake}
          onChange={(e) => handleStakeChange(parseInt(e.target.value, 10))}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg border border-zinc-800 bg-zinc-950"
        />

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {cfg.stakePresets.map((preset) => (
            <button
              key={preset}
              onClick={() => handleStakeChange(preset)}
              className={`rounded-lg border px-3.5 py-1.5 text-xs font-bold transition-all active:scale-95 ${
                stake === preset
                  ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-400'
                  : 'border-zinc-800 bg-black text-zinc-300 hover:border-emerald-500/50'
              }`}
            >
              {sym}
              {preset}
            </button>
          ))}
        </div>
      </div>

      {bestOdds > 0 && stake > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-black/60 px-4 py-3">
          <span className="text-xs font-medium text-zinc-400">
            {region === 'IT' ? 'Vincita Potenziale' : 'Potential Return'}
          </span>
          <span className="text-lg font-bold tabular-nums text-white">
            {sym}{potentialReturn}
          </span>
        </div>
      )}
    </div>
  );
}
