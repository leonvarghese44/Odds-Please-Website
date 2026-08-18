import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ChevronDown, User, Zap, Globe } from 'lucide-react';
import { useDemo } from '@/context/DemoContext';
import { ConnectAccountModal } from './ConnectAccountModal';
import { AuthModal } from './AuthModal';
import { AccountProfileModal } from './AccountProfileModal';
import type { Region, Language, OddsFormat } from '@/constants';
import { REGION_CONFIG } from '@/constants';

interface HeaderNavProps {
  region: Region;
  language: Language;
  oddsFormat: OddsFormat;
  onRegionChange: (r: Region) => void;
  onLanguageChange: (l: Language) => void;
  onOddsFormatChange: (f: OddsFormat) => void;
}

export function HeaderNav({
  region,
  language,
  oddsFormat,
  onRegionChange,
  onLanguageChange,
  onOddsFormatChange,
}: HeaderNavProps) {
  const {
    isLoggedIn,
    userName,
    linkedOperators,
    primaryOperator,
    login,
  } = useDemo();

  const navigate = useNavigate();
  const cfg = REGION_CONFIG[region];

  const [walletOpen, setWalletOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [isFormatOpen, setIsFormatOpen] = useState(false);

  const regionRef = useRef<HTMLDivElement>(null);
  const formatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) setIsRegionOpen(false);
      if (formatRef.current && !formatRef.current.contains(e.target as Node)) setIsFormatOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const regions: { code: Region; flag: string; label: string; books: string }[] = [
    { code: 'UK', flag: '🇬🇧', label: 'UK (£)', books: 'Sky Bet, Betfair, Paddy Power' },
    { code: 'US', flag: '🇺🇸', label: 'US ($)', books: 'FanDuel, DraftKings' },
    { code: 'IT', flag: '🇮🇹', label: 'IT (€)', books: 'Codere, Unibet, Betfair' },
  ];

  const formats: { code: OddsFormat; label: string }[] = [
    { code: 'fractional', label: 'GB Fractional' },
    { code: 'decimal', label: 'EU Decimal' },
    { code: 'american', label: 'US American' },
  ];

  const currentRegion = regions.find((r) => r.code === region) || regions[0];
  const currentFormatLabel = formats.find((f) => f.code === oddsFormat)?.label || 'GB Fractional';

  const pillClass =
    'h-8 px-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg text-xs font-semibold text-zinc-300 transition-all flex items-center gap-2 cursor-pointer';

  return (
    <>
      <header className="sticky top-0 w-full h-14 px-4 sm:px-6 bg-zinc-950/90 border-b border-zinc-800/80 backdrop-blur-md flex items-center justify-between z-50">
        {/* LEFT: Brand + Safer Gambling */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105 select-none">
            <img
              src="/OPlogo.png"
              alt="OddsPlease"
              className="h-7 w-7 rounded-lg object-contain border border-zinc-800"
            />
            <div className="flex items-baseline font-display text-lg tracking-tight">
              <span className="font-bold text-white">Odds</span>
              <span className="font-normal text-emerald-500">Please</span>
            </div>
          </Link>

          <button
            onClick={() => navigate(cfg.complianceRoute)}
            className="hidden sm:flex h-8 px-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-all items-center gap-1.5 cursor-pointer"
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Safer Gambling</span>
          </button>
        </div>

        {/* RIGHT: Utility Button Group */}
        <div className="flex items-center gap-2">
          {/* Sky Bet Connection Indicator */}
          {isLoggedIn && (
            <button
              onClick={() => setWalletOpen(true)}
              className={`${pillClass} hidden lg:flex`}
            >
              <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
              <span>{primaryOperator} • {linkedOperators.length} Linked</span>
            </button>
          )}

          {/* Streak & Credits Pill */}
          {isLoggedIn && (
            <button
              className="h-8 px-3 bg-zinc-900 hover:bg-zinc-800 border border-amber-500/30 hover:border-amber-500/50 rounded-lg text-xs font-semibold text-amber-400 transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.1)] hidden md:flex"
            >
              <span>🔥 6-Day Streak</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-200">500 Odds Coins</span>
            </button>
          )}

          {/* Odds Wheel Button */}
          {isLoggedIn && (
            <button
              className="h-8 px-3 bg-zinc-900 hover:bg-zinc-800 border border-[#39FF14]/30 hover:border-[#39FF14]/60 rounded-lg text-xs font-semibold text-[#39FF14] transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(57,255,20,0.1)] hidden md:flex"
            >
              <span>🎡 Odds Wheel</span>
            </button>
          )}

          {/* Odds Format Selector */}
          <div className="relative" ref={formatRef}>
            <button
              onClick={() => {
                setIsFormatOpen(!isFormatOpen);
                setIsRegionOpen(false);
              }}
              className={pillClass}
            >
              <span>{currentFormatLabel}</span>
              <ChevronDown className={`h-3.5 w-3.5 text-zinc-400 transition-transform duration-200 ${isFormatOpen ? 'rotate-180' : ''}`} />
            </button>

            {isFormatOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-xl border border-zinc-800 bg-zinc-950 p-1 shadow-2xl z-50 animate-fade-in">
                {formats.map((f) => (
                  <button
                    key={f.code}
                    onClick={() => {
                      onOddsFormatChange(f.code);
                      setIsFormatOpen(false);
                    }}
                    className={`w-full rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors cursor-pointer ${
                      oddsFormat === f.code
                        ? 'bg-zinc-800 font-bold text-white'
                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auth / Profile */}
          {isLoggedIn ? (
            <button
              onClick={() => setProfileOpen(true)}
              className={pillClass}
            >
              <User className="h-3.5 w-3.5 text-zinc-400" />
              <span className="hidden md:inline">{userName} • Odds Club</span>
              <span className="md:hidden">{userName}</span>
            </button>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              className={pillClass}
            >
              <Zap className="h-3.5 w-3.5 text-[#FF8C00]" />
              <span className="hidden sm:inline">Join / Log In</span>
              <span className="sm:hidden">Join</span>
            </button>
          )}

          {/* Region Switcher */}
          <div className="relative" ref={regionRef}>
            <button
              onClick={() => {
                setIsRegionOpen(!isRegionOpen);
                setIsFormatOpen(false);
              }}
              title="Switch Demo Region"
              className={pillClass}
            >
              <Globe className="h-3.5 w-3.5 text-zinc-400" />
              <span className="font-bold">{currentRegion.flag} {currentRegion.code}</span>
              <ChevronDown className={`h-3 w-3 text-zinc-400 transition-transform duration-200 ${isRegionOpen ? 'rotate-180' : ''}`} />
            </button>

            {isRegionOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl border border-zinc-800 bg-zinc-950 p-1.5 shadow-2xl z-50 animate-fade-in">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  Select Demo Region
                </div>
                {regions.map((r) => (
                  <button
                    key={r.code}
                    onClick={() => {
                      onRegionChange(r.code);
                      setIsRegionOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg p-2 text-xs font-medium transition-colors cursor-pointer ${
                      region === r.code
                        ? 'bg-zinc-800 font-bold text-white'
                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{r.flag}</span>
                      <div className="text-left">
                        <div className="font-bold">{r.label}</div>
                        <div className="text-[10px] text-zinc-500">{r.books}</div>
                      </div>
                    </div>
                    {region === r.code && <span className="text-xs text-[#63FF0E]">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modals */}
      <ConnectAccountModal open={walletOpen} onClose={() => setWalletOpen(false)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onSuccessLogin={login} />
      <AccountProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}
