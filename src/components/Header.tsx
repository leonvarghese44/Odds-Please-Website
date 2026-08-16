import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Region, Language, OddsFormat } from '@/constants';
import { HeaderNav } from './HeaderNav';

interface HeaderProps {
  region: Region;
  language: Language;
  oddsFormat: OddsFormat;
  onRegionChange: (r: Region) => void;
  onLanguageChange: (l: Language) => void;
  onOddsFormatChange: (f: OddsFormat) => void;
  minimal?: boolean;
}

export function Header({
  region,
  language,
  oddsFormat,
  onRegionChange,
  onLanguageChange,
  onOddsFormatChange,
  minimal = false,
}: HeaderProps) {
  if (minimal) {
    return (
      <header className="sticky top-0 z-50 w-full h-14 px-4 sm:px-6 bg-zinc-950/90 border-b border-zinc-800/80 backdrop-blur-md flex items-center justify-between">
        <div className="mx-auto flex max-w-7xl items-center justify-between w-full">
          <Link to="/" className="flex items-center gap-3 transition-transform hover:scale-105 select-none">
            <img
              src="/OPlogo.png"
              alt="OddsPlease Icon"
              className="h-14 w-auto sm:h-11 sm:w-11 rounded-xl object-contain border border-zinc-800"
            />
            <div className="flex items-baseline font-display text-2xl sm:text-3xl tracking-tight mt-1">
              <span className="font-bold text-white">Odds</span>
              <span className="font-normal text-emerald-500">Please</span>
            </div>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 transition hover:text-emerald-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Link>
        </div>
      </header>
    );
  }

  return (
    <HeaderNav
      region={region}
      language={language}
      oddsFormat={oddsFormat}
      onRegionChange={onRegionChange}
      onLanguageChange={onLanguageChange}
      onOddsFormatChange={onOddsFormatChange}
    />
  );
}
