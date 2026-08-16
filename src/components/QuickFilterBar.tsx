import { Activity, CircleDot, Goal, Radio, Trophy, Target } from 'lucide-react';

interface QuickFilter {
  label: string;
  key: string;
  icon: typeof Activity;
}

const QUICK_FILTERS: QuickFilter[] = [
  { label: 'Live & Upcoming', key: 'upcoming', icon: Radio },
  { label: 'EPL Premier League', key: 'soccer_epl', icon: Goal },
  { label: 'MLB Baseball', key: 'baseball_mlb', icon: CircleDot },
  { label: 'WTA Tennis', key: 'tennis_wta_washington_open', icon: Activity },
  { label: 'NBA Basketball', key: 'basketball_nba', icon: Target },
  { label: 'NFL Football', key: 'americanfootball_nfl', icon: Trophy },
];

interface QuickFilterBarProps {
  activeSport: string;
  onSelectSport: (key: string) => void;
}

export function QuickFilterBar({ activeSport, onSelectSport }: QuickFilterBarProps) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 sm:gap-2.5 md:overflow-visible">
      {QUICK_FILTERS.map((filter) => {
        const isActive = activeSport === filter.key;
        const Icon = filter.icon;
        return (
          <button
            key={filter.key}
            onClick={() => onSelectSport(filter.key)}
            className={`flex min-w-[148px] flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider transition-all duration-200 active:scale-[0.98] sm:min-w-0 ${
              isActive
                ? 'border-emerald-500 bg-emerald-500 text-ink-900 shadow-[0_0_12px_rgba(120,252,11,0.4)]'
                : 'border-surface-border bg-surface-elevated text-zinc-300 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400'
            }`}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span>{filter.label}</span>
          </button>
        );
      })}
    </div>
  );
}
