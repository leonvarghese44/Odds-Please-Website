import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ChevronDown } from 'lucide-react';
import type { Region, Language } from '@/constants';
import { REGION_CONFIG, DIALECT, US_VEP_STATES } from '@/constants';

interface FooterProps {
  region: Region;
  language: Language;
  onAgeBadgeClick: () => void;
  showRGCard: boolean;
}

interface Helpline {
  label: string;
  value: string;
  subtext?: string;
}

const REGION_HELPLINES: Record<Region, Helpline[]> = {
  UK: [
    { label: 'National Gambling Helpline', value: '0808 8020 133' },
  ],
  US: [
    { label: 'National', value: '1-800-GAMBLER', subtext: 'or text 800GAM' },
    { label: 'NY', value: '1-877-8-HOPENY', subtext: 'or text HOPENY (467369)' },
    { label: 'MA', value: '1-800-327-5050', subtext: 'or text GAMB to 800327' },
    { label: 'OH', value: '1-800-589-9966' },
    { label: 'CT', value: '1-888-789-7777' },
    { label: 'IN', value: '1-800-9-WITH-IT' },
    { label: 'VA', value: '1-888-532-3500' },
    { label: 'MI', value: '1-800-270-7117' },
  ],
  IT: [
    { label: 'Telefono Verde ISS', value: '800 558 822' },
    { label: 'GiocaResponsabile', value: '800 151 000' },
  ],
};

const HUB_LINK_TEXT: Record<Region, string> = {
  UK: 'Learn more about safer gambling here',
  US: 'Learn more about responsible gaming here',
  IT: 'Scopri di più sul gioco responsabile qui',
};

function SelfExclusionDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-[11px] font-medium text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800/60 hover:text-zinc-100"
      >
        State Voluntary Self-Exclusion
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute bottom-full left-0 z-50 mb-2 max-h-64 w-56 overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-950 p-1.5 shadow-2xl">
          {US_VEP_STATES.map((s) => (
            <a
              key={s.state}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-[11px] font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-zinc-100"
            >
              <span>{s.state} — {s.name}</span>
              <ExternalLink className="h-3 w-3 flex-shrink-0 opacity-40" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export function Footer({ region, language, onAgeBadgeClick, showRGCard }: FooterProps) {
  const cfg = REGION_CONFIG[region];
  const strings = DIALECT[region][language];
  const helplines = REGION_HELPLINES[region];
  const hubLinkText = HUB_LINK_TEXT[region];

  const isUS = region === 'US';

  return (
    <footer className="bg-black pt-8 pb-6 text-zinc-500">
      <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">

        {/* Unified RG Card — only on core pages */}
        {showRGCard && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8">
          {/* Warning row: age badge + statutory text + hub link */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <button
                onClick={onAgeBadgeClick}
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border border-red-800 bg-red-950/50 text-lg font-bold text-white transition hover:bg-red-900/60"
              >
                {cfg.ageBadge}
              </button>
              <div className="pt-0.5">
                <p className="text-sm font-bold tracking-[-0.02em] text-zinc-100">
                  {cfg.statutoryText}
                </p>
                {cfg.ageSubtext && (
                  <p className="mt-1 text-xs font-medium text-zinc-400">{cfg.ageSubtext}</p>
                )}
                <Link
                  to={cfg.complianceRoute}
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-500/80 transition hover:text-emerald-400"
                >
                  {hubLinkText}
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Helplines — clean layout, no dividers */}
          <div className="mt-6">
            <div className={`flex flex-wrap gap-x-8 gap-y-4 ${isUS ? 'sm:grid sm:grid-cols-4 sm:gap-x-6 sm:gap-y-4' : ''}`}>
              {helplines.map((h) => (
                <div key={h.label} className="flex flex-col">
                  <span className="text-[11px] font-medium text-zinc-400">{h.label}</span>
                  <span className="text-[13px] font-semibold tabular-nums text-zinc-100">{h.value}</span>
                  {h.subtext && (
                    <span className="text-[11px] font-normal text-zinc-400">{h.subtext}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Link pills + US self-exclusion dropdown */}
          <div className="mt-8 flex flex-wrap items-center gap-2">
            {cfg.trustBadges.map((b) => (
              <a
                key={b.label}
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-[11px] font-medium text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800/60 hover:text-zinc-100"
              >
                {b.label}
                <ExternalLink className="h-3 w-3 opacity-40" />
              </a>
            ))}
            {isUS && <SelfExclusionDropdown />}
          </div>
        </div>
        )}

        {/* Bottom section: nav + disclaimer on left, logo + copyright on right */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          {/* Left: nav links + disclaimer */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-400">
              <Link to="/privacy" className="transition hover:text-emerald-400">
                {strings.privacy}
              </Link>
              <span className="text-zinc-700">•</span>
              <Link to="/terms" className="transition hover:text-emerald-400">
                {strings.terms}
              </Link>
              <span className="text-zinc-700">•</span>
              <Link to={cfg.complianceRoute} className="transition hover:text-emerald-400">
                {strings.responsibleGambling}
              </Link>
              <span className="text-zinc-700">•</span>
              <Link to="/careers" className="transition hover:text-emerald-400">
                Careers
              </Link>
              <span className="text-zinc-700">•</span>
              <Link to="/partnerships" className="transition hover:text-emerald-400">
                Partnerships
              </Link>
            </div>
            <p className="max-w-2xl text-xs font-normal leading-relaxed text-zinc-500">
              {strings.footerDisclaimer}
            </p>
          </div>

          {/* Right: logo + copyright */}
          <div className="flex flex-col items-start gap-2 md:items-end">
            <Link
              to="/"
              className="inline-flex items-baseline font-display tracking-tight text-4xl sm:text-5xl transition-transform hover:scale-[1.02] select-none"
            >
              <span className="font-bold text-white">Odds</span>
              <span className="font-normal text-emerald-500">Please</span>
              <span className="font-normal text-emerald-500 text-xl sm:text-2xl ml-0.5 opacity-90">.com</span>
            </Link>
            <div className="space-y-0.5 md:text-right">
              <p className="text-xs font-medium text-zinc-400">{strings.copyright}</p>
              <p className="text-[10px] text-zinc-500">
                OddsPlease Limited (Company No. 17368851) • Registered in England & Wales
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
