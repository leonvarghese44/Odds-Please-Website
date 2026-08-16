import { useState, useEffect, useRef } from 'react';
import { Loader2, Crown, Lock, ArrowUpRight, Repeat, Info, Filter, Check, Ban } from 'lucide-react';

interface OperatorOdds {
  name: string;
  logo: string;
  odds: string;
  decimalOdds: number;
  deepLink: string;
  isBest: boolean;
  safeSub?: boolean;
  superSub?: boolean;
  linked?: boolean;
  available: boolean;
}

const QUERY_PATTERNS = /sam smith|smith to score|cardiff|wrexham/i;

const OPERATORS: OperatorOdds[] = [
  { name: 'Sky Bet', logo: '/operators/skybet.png', odds: '2/1', decimalOdds: 3.00, deepLink: 'https://skybet.com/football/english-sky-bet-championship/cardiff-v-wrexham/e-35760342?tab=player', isBest: true, superSub: true, linked: true, available: true },
  { name: 'Paddy Power', logo: '/operators/paddypower.png', odds: '21/10', decimalOdds: 3.10, deepLink: 'https://www.paddypower.com', isBest: false, superSub: true, available: true },
  { name: 'Betfair', logo: '/operators/betfair_sb_uk.png', odds: '21/10', decimalOdds: 3.10, deepLink: 'https://www.betfair.com/sport/football', isBest: false, safeSub: true, available: true },
  { name: 'Betfair Exchange', logo: '/operators/betfair_ex_uk.png', odds: 'N/A', decimalOdds: 0, deepLink: 'https://www.betfair.com/exchange', isBest: false, available: false },
];

const SKYBET_MARKET_URL = "https://skybet.com/football/sky-bet-championship/cardiff-v-wrexham";

const SIMILAR_PROPS = [
  { label: 'ANYTIME GOALSCORER', active: true },
  { label: 'FIRST GOALSCORER', active: false },
  { label: 'TO SCORE OR ASSIST', active: false },
  { label: 'TO SCORE A BRACE', active: false },
  { label: 'TO SCORE A HAT-TRICK', active: false },
];

type Phase = 'idle' | 'loading' | 'results';

interface SearchTerminalProps {
  query: string;
  trigger: number;
  onPhaseChange?: (phase: Phase) => void;
}

const STAKE_PRESETS = [5, 10, 20, 50, 100];
const AVAILABLE_OPERATORS = OPERATORS.filter((o) => o.available);
const LOWEST_DECIMAL = Math.min(...AVAILABLE_OPERATORS.map((o) => o.decimalOdds));

export function SearchTerminal({ query, trigger, onPhaseChange }: SearchTerminalProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [stake, setStake] = useState<number | string>(50);
  const [filterOpen, setFilterOpen] = useState(false);
  const [hiddenBrands, setHiddenBrands] = useState<Set<string>>(new Set());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const minStake = 5;
  const maxStake = 100;
  const sliderPercentage = ((Number(stake || 10) - minStake) / (maxStake - minStake)) * 100;
  const numericStake = Number(stake) || 0;
  const bestDecimal = Math.max(...AVAILABLE_OPERATORS.map((o) => o.decimalOdds));
  const potentialReturn = numericStake * bestDecimal;
  const netProfit = potentialReturn - numericStake;
  const lowestReturn = numericStake * LOWEST_DECIMAL;

  useEffect(() => {
    setPhase('idle');
  }, [query]);

  useEffect(() => {
    onPhaseChange?.(phase);
  }, [phase, onPhaseChange]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (trigger === 0) return;
    if (!QUERY_PATTERNS.test(query.trim())) {
      setPhase('idle');
      return;
    }

    setPhase('loading');

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setPhase('results');
    }, 1500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [trigger, query]);

  const toggleBrand = (name: string) => {
    setHiddenBrands((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  if (phase === 'idle') return null;

  if (phase === 'loading') {
    return (
      <div className="mx-auto w-full max-w-2xl flex flex-col items-center justify-center gap-4 py-12 animate-fade-in">
        <div className="relative">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
          </span>
        </div>
        <p className="text-sm font-medium text-zinc-400">Scanning live feeds for the best odds...</p>
        <div className="flex items-center gap-2 mt-1">
          {['Sky Bet', 'Paddy Power', 'Betfair', 'Betfair Exchange'].map((name, i) => (
            <span
              key={name}
              className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            >
              {name}
              {i < 3 && <span className="ml-2 text-zinc-800">/</span>}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full !max-w-6xl animate-fade-in">
      {/* Unified premium terminal card */}
      <div className="w-full !max-w-6xl mx-auto px-8 py-6 rounded-2xl bg-black border border-emerald-500/30 shadow-[0_0_20px_rgba(57,255,20,0.15)]">
        {/* Header stack */}
        <div className="flex flex-col items-center justify-center gap-3 py-3 mb-4">
          {/* Match context */}
          <p className="text-zinc-400 font-black text-xs uppercase tracking-wider text-center mb-1">
            Football &bull; Sky Bet Championship &bull; 17 Aug, 20:00 BST
          </p>

          {/* Team matchup */}
          <div className="flex items-center justify-center gap-3 text-3xl sm:text-4xl font-black tracking-wider uppercase text-white mb-1">
            <span>CARDIFF</span>
            <span className="inline-block w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: '#00529B', boxShadow: '0 0 8px rgba(0,82,155,0.5)' }} />
            <span className="text-zinc-600 font-normal">&mdash;</span>
            <span className="inline-block w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: '#E00000', boxShadow: '0 0 8px rgba(224,0,0,0.5)' }} />
            <span>WREXHAM</span>
          </div>
        </div>

        {/* Best Odds & Implied Probability & Stake summary */}
        <div className="flex flex-col gap-2.5 w-full max-w-sm mx-auto mt-3">
          <div className="flex items-center gap-2 text-left whitespace-nowrap">
            <span className="text-white font-black text-base sm:text-lg uppercase tracking-wider">Selected Bet:</span>
            <span className="text-[#39FF14] font-black text-base sm:text-lg uppercase tracking-wider">Sam Smith To Score</span>
          </div>
          <div className="flex items-center gap-2 text-left whitespace-nowrap">
            <span className="text-white font-black text-base sm:text-lg uppercase tracking-wider">Best Odds:</span>
            <span className="text-emerald-400 font-black text-base sm:text-lg">9/4 (3.25)</span>
          </div>
          <div className="flex items-center gap-3 text-left whitespace-nowrap">
            <span className="text-white font-black text-base sm:text-lg uppercase tracking-wider">Implied Probability:</span>
            <span className="text-emerald-400 font-black text-base sm:text-lg">30.8%</span>
            <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="w-[30.8%] h-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] rounded-full transition-all duration-500" />
            </div>
          </div>
          <div className="flex items-center gap-3 text-left whitespace-nowrap">
            <span className="text-white font-black text-base sm:text-lg uppercase tracking-wider">Enter Stake:</span>
            <div className="flex items-center bg-zinc-950 border border-emerald-500/40 rounded-lg px-3 py-1.5 focus-within:border-[#39FF14] transition-all max-w-[110px]">
              <span className="text-[#39FF14] font-black text-base">&pound;</span>
              <input
                type="number"
                min={1}
                max={1000}
                value={stake}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") {
                    setStake("");
                  } else {
                    const parsed = parseInt(val, 10);
                    if (!isNaN(parsed)) setStake(parsed);
                  }
                }}
                onBlur={() => {
                  if (stake === "" || Number(stake) <= 0) setStake(50);
                }}
                className="bg-transparent text-[#39FF14] font-black text-base w-12 outline-none text-left ml-1 caret-[#39FF14] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>
        </div>

        {/* Stake calculator */}
        <div className="w-full max-w-sm mx-auto mt-4 mb-5">
          <div className="w-full my-2">
            <input
              type="range"
              min={minStake}
              max={maxStake}
              step={5}
              value={stake === "" ? 50 : stake}
              onChange={(e) => setStake(Number(e.target.value))}
              style={{ background: `linear-gradient(to right, #ffffff calc(${sliderPercentage}% + ${(0.5 - sliderPercentage / 100) * 24}px), #27272a calc(${sliderPercentage}% + ${(0.5 - sliderPercentage / 100) * 24}px))` }}
              className="slider-arrow-thumb w-full cursor-pointer h-1.5 rounded-full appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6"
            />
          </div>
          <div className="flex items-center justify-center gap-3 mt-3">
            {STAKE_PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => setStake(preset)}
                className={
                  stake === preset
                    ? 'bg-[#39FF14] text-black font-black text-xs px-5 py-1.5 rounded-full border border-[#39FF14] shadow-[0_0_12px_rgba(57,255,20,0.3)] transition-all cursor-pointer'
                    : 'bg-zinc-900 text-white font-black text-xs px-5 py-1.5 rounded-full border border-zinc-800/80 transition-all cursor-pointer hover:border-[#39FF14] hover:text-[#39FF14] hover:shadow-[0_0_10px_rgba(57,255,20,0.2)]'
                }
              >
                &pound;{preset}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 sm:gap-8 my-4 text-center">
            <div className="flex flex-col items-center">
              <span className="text-white font-black text-sm sm:text-base uppercase tracking-wider block">Total Return</span>
              <span className="text-white font-black text-3xl sm:text-4xl">&pound;{potentialReturn.toFixed(2)}</span>
            </div>
            <div className="h-6 w-px bg-zinc-800" />
            <div className="flex flex-col items-center">
              <span className="text-[#39FF14] font-black text-sm sm:text-base uppercase tracking-wider block">Total Profit</span>
              <span className="text-[#39FF14] font-black text-3xl sm:text-4xl">&pound;{netProfit.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Similar player props section */}
        <div>
          <span className="text-zinc-400 font-black text-xs uppercase tracking-widest mb-3 block">
            SIMILAR PLAYER PROPS FOR SAM SMITH
          </span>
          <div className="flex items-center justify-between gap-3 w-full my-6">
            {SIMILAR_PROPS.map((prop) => (
              <span
                key={prop.label}
                className={
                  prop.active
                    ? 'bg-[#39FF14] text-black font-black rounded-full px-3.5 py-1.5 text-xs uppercase tracking-wider shadow-[0_0_12px_rgba(57,255,20,0.3)] transition-all cursor-pointer flex-1 text-center whitespace-nowrap'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800/80 rounded-full px-3.5 py-1.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex-1 text-center whitespace-nowrap'
                }
              >
                {prop.label}
              </span>
            ))}
          </div>
        </div>

        {/* Market disclaimer line */}
        <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-medium my-4 px-2">
          <Info className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0" />
          <span>
            Settlement based on 90 minutes of play &amp; stoppage time. Selected market excludes own goals. <span className="text-zinc-600 italic">Further bookmaker terms may apply.</span>
          </span>
        </div>

        {/* Bookmaker Comparison Rows with Filter */}
        <div>
          {/* Filter Bookmakers dropdown */}
          <div className="relative flex justify-end mb-3" ref={filterRef}>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition-all hover:border-zinc-700 hover:text-white cursor-pointer"
            >
              <Filter className="h-3.5 w-3.5" />
              <span>Filter Bookmakers</span>
              <span className="text-[10px] text-zinc-500">({OPERATORS.length - hiddenBrands.size}/{OPERATORS.length})</span>
            </button>

            {filterOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-zinc-800 bg-zinc-950 p-2 shadow-2xl z-50 animate-fade-in">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  Toggle Bookmakers
                </div>
                {OPERATORS.map((op) => (
                  <button
                    key={op.name}
                    onClick={() => toggleBrand(op.name)}
                    className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-xs font-medium transition-colors cursor-pointer hover:bg-zinc-900"
                  >
                    <div className="flex items-center gap-2">
                      <img src={op.logo} alt={op.name} className="h-5 w-5 object-contain" />
                      <span className={hiddenBrands.has(op.name) ? 'text-zinc-500' : 'text-white'}>{op.name}</span>
                      {!op.available && <span className="text-[9px] text-zinc-600 uppercase">N/A</span>}
                    </div>
                    <span className={`flex h-4 w-4 items-center justify-center rounded border ${hiddenBrands.has(op.name) ? 'border-zinc-700 bg-zinc-900' : 'border-[#39FF14] bg-[#39FF14]/20'}`}>
                      {!hiddenBrands.has(op.name) && <Check className="h-3 w-3 text-[#39FF14]" />}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Operator rows */}
          {OPERATORS.filter((op) => !hiddenBrands.has(op.name)).map((op) => {
            const isSkyBet = op.name === 'Sky Bet';
            const linkUrl = isSkyBet ? SKYBET_MARKET_URL : op.deepLink;

            if (!op.available) {
              return (
                <div
                  key={op.name}
                  className="bg-zinc-950/30 border border-zinc-800/50 border-l-4 border-l-zinc-700 rounded-xl p-4 my-2.5 flex items-center gap-4 sm:gap-5 opacity-50"
                >
                  <img
                    src={op.logo}
                    alt={op.name}
                    className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 object-contain drop-shadow-md grayscale"
                  />
                  <div className="flex flex-col gap-1.5 flex-grow">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-lg font-black text-zinc-500 tracking-wide">{op.name}</span>
                      <span className="text-zinc-600 font-black text-xl ml-1 mr-2 tracking-tight">N/A</span>
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900/80 border border-zinc-800 text-zinc-500 text-xs font-semibold rounded-md">
                        <Ban className="w-3.5 h-3.5 text-zinc-600" />
                        Not Available
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs">
                      <span className="text-zinc-600 font-medium">Odds currently unavailable for this market</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="bg-zinc-800 text-zinc-500 font-black text-sm px-6 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap cursor-not-allowed">
                      Unavailable
                    </span>
                  </div>
                </div>
              );
            }

            const rowReturn = numericStake * op.decimalOdds;
            const rowProfit = rowReturn - numericStake;
            const savingsVsLowest = rowReturn - lowestReturn;

            const placeBet = isSkyBet ? (
              <button
                onClick={(e) => { e.stopPropagation(); window.open(linkUrl, '_blank', 'noopener,noreferrer'); }}
                className="bg-[#39FF14] text-black font-black text-sm px-6 py-2.5 rounded-xl hover:bg-emerald-400 shadow-[0_0_12px_rgba(57,255,20,0.3)] transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                Place Bet
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </button>
            ) : (
              <span className="bg-[#39FF14] text-black font-black text-sm px-6 py-2.5 rounded-xl hover:bg-emerald-400 shadow-[0_0_12px_rgba(57,255,20,0.3)] transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap">
                Place Bet
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </span>
            );

            const rowInner = (
              <>
                <img
                  src={op.logo}
                  alt={op.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 object-contain drop-shadow-md"
                />
                <div className="flex flex-col gap-1.5 flex-grow">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-lg font-black text-white tracking-wide">{op.name}</span>
                    <span className={op.isBest ? 'text-[#39FF14] font-black text-xl ml-1 mr-2 tracking-tight' : 'text-white font-black text-xl ml-1 mr-2 tracking-tight'}>{op.odds}</span>
                    <div className="flex items-center gap-3 ml-2">
                      {op.isBest && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900/80 border border-zinc-800 text-zinc-300 text-xs font-semibold rounded-md">
                          <Crown className="w-3.5 h-3.5 text-[#39FF14]" />
                          Best Price
                        </span>
                      )}
                      {op.superSub && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900/80 border border-zinc-800 text-zinc-300 text-xs font-semibold rounded-md">
                          <Repeat className="w-3.5 h-3.5 text-amber-400" />
                          Super Sub
                        </span>
                      )}
                      {op.linked && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900/80 border border-zinc-800 text-zinc-300 text-xs font-semibold rounded-md">
                          <Lock className="w-3.5 h-3.5 text-cyan-400" />
                          Linked
                        </span>
                      )}
                      {op.safeSub && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900/80 border border-zinc-800 text-zinc-300 text-xs font-semibold rounded-md">
                          <Repeat className="w-3.5 h-3.5 text-amber-400" />
                          SafeSub
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs">
                    <span className="text-zinc-200 font-bold">&pound;{rowReturn.toFixed(2)} <span className="text-zinc-400 font-normal">return</span></span>
                    <span className="text-zinc-700">&bull;</span>
                    <span className="text-[#39FF14] font-bold">&pound;{rowProfit.toFixed(2)} <span className="text-emerald-400/80 font-normal">profit</span></span>
                    {savingsVsLowest > 0.001 && (
                      <span className="text-[11px] font-bold text-[#39FF14] bg-[#39FF14]/10 border border-[#39FF14]/30 px-2 py-0.5 rounded shadow-[0_0_10px_rgba(57,255,20,0.1)] ml-1">
                        +&pound;{savingsVsLowest.toFixed(2)} vs lowest
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {placeBet}
                </div>
              </>
            );

            if (isSkyBet) {
              return (
                <div
                  key={op.name}
                  onClick={() => window.open(linkUrl, '_blank', 'noopener,noreferrer')}
                  className="bg-zinc-950/60 border border-zinc-800 border-l-4 border-l-[#39FF14] rounded-xl p-4 my-2.5 flex items-center gap-4 sm:gap-5 cursor-pointer transition-all hover:bg-zinc-900/80 hover:border-[#39FF14] hover:shadow-[0_0_20px_rgba(57,255,20,0.25)] group"
                >
                  {rowInner}
                </div>
              );
            }

            return (
              <a
                key={op.name}
                href={op.deepLink}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  op.isBest
                    ? 'bg-zinc-950/80 border-2 border-[#39FF14] rounded-xl p-4 my-2.5 shadow-[0_0_15px_rgba(57,255,20,0.15)] flex items-center gap-4 sm:gap-5 cursor-pointer group'
                    : 'bg-zinc-950/60 border border-zinc-800 border-l-4 border-l-[#39FF14] rounded-xl p-4 my-2.5 flex items-center gap-4 sm:gap-5 transition-all hover:bg-zinc-900/80 cursor-pointer group'
                }
              >
                {rowInner}
              </a>
            );
          })}
        </div>

        {/* Bottom Transfer CTA */}
        <button className="w-full bg-[#39FF14] hover:bg-emerald-400 text-black font-black text-base py-3.5 rounded-xl mt-4 shadow-[0_0_20px_rgba(57,255,20,0.25)] transition-all flex items-center justify-center gap-2 cursor-pointer group">
          Transfer Slip to Sky Bet
          <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <ArrowUpRight className="w-5 h-5" />
          </span>
        </button>

      </div>
    </div>
  );
}
