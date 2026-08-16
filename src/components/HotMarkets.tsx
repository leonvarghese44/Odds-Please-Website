import { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import type { Region } from '@/constants';

export interface TickerItem {
  category: string;
  text: string;
  searchText: string;
}

export const ukTickerItems: TickerItem[] = [
  { category: '⚽ PLAYER PROP', text: 'Bukayo Saka 2+ Shots on Target', searchText: 'Bukayo Saka 2+ Shots on Target' },
  { category: '🔥 POPULAR', text: 'Declan Rice 1+ Foul Committed', searchText: 'Declan Rice 1+ Foul Committed' },
  { category: '⚽ MATCH RESULT', text: 'Arsenal to Win & Over 2.5 Goals', searchText: 'Arsenal to Win and Over 2.5 Goals' },
  { category: '⚽ PLAYER PROP', text: 'Kai Havertz Anytime Goalscorer', searchText: 'Kai Havertz Anytime Goalscorer' },
  { category: '⚽ PLAYER PROP', text: 'Bruno Fernandes 1+ Assist', searchText: 'Bruno Fernandes 1+ Assist' },
  { category: '⚽ PLAYER PROP', text: 'Kobbie Mainoo 2+ Tackles', searchText: 'Kobbie Mainoo 2+ Tackles' },
  { category: '⚽ MATCH RESULT', text: 'Man United to Win Both Halves', searchText: 'Man United to Win Both Halves' },
  { category: '🔥 POPULAR', text: 'Erling Haaland 2+ Goals', searchText: 'Erling Haaland 2+ Goals' },
  { category: '⚽ PLAYER PROP', text: 'Phil Foden Over 1.5 Shots on Target', searchText: 'Phil Foden Over 1.5 Shots on Target' },
  { category: '⚽ PLAYER PROP', text: 'Mohamed Salah Anytime Goalscorer', searchText: 'Mohamed Salah Anytime Goalscorer' },
  { category: '⚽ PLAYER PROP', text: 'Alexander Isak First Goalscorer', searchText: 'Alexander Isak First Goalscorer' },
  { category: '⚽ PLAYER PROP', text: 'Cole Palmer To Score or Assist', searchText: 'Cole Palmer To Score or Assist' },
  { category: '🎯 BUILDER', text: 'Son Heung-min Anytime Goalscorer & BTTS', searchText: 'Son Heung-min Anytime Goalscorer and BTTS' },
  { category: '⚽ PLAYER PROP', text: 'Ollie Watkins 2+ Shots on Target', searchText: 'Ollie Watkins 2+ Shots on Target' },
  { category: '🏆 UCL CHAMPIONS', text: 'Jude Bellingham Anytime Goalscorer', searchText: 'Jude Bellingham Anytime Goalscorer' },
  { category: '⚽ PLAYER PROP', text: 'Kylian Mbappé 3+ Shots on Target', searchText: 'Kylian Mbappe 3+ Shots on Target' },
  { category: '🔥 POPULAR', text: 'Harry Kane Over 1.5 Shots on Target', searchText: 'Harry Kane Over 1.5 Shots on Target' },
  { category: '🥊 BOXING', text: 'Heavyweight Main Event to End via KO/TKO', searchText: 'Heavyweight Main Event to End via KO/TKO' },
  { category: '🥋 UFC', text: 'Main Card Fight to Go the Distance (No)', searchText: 'Main Card Fight to Go the Distance No' },
  { category: '🎯 ACCA', text: 'Saturday Night Football 4-Fold Accumulator', searchText: 'Saturday Night Football 4-Fold Accumulator' },
];

export const usTickerItems: TickerItem[] = [
  { category: '🏈 NFL PROP', text: 'Patrick Mahomes Over 2.5 Passing Touchdowns', searchText: 'Patrick Mahomes Over 2.5 Passing Touchdowns' },
  { category: '🏈 NFL PROP', text: 'Travis Kelce Anytime Touchdown Scorer', searchText: 'Travis Kelce Anytime Touchdown Scorer' },
  { category: '🏈 NFL PROP', text: 'Josh Allen Over 35.5 Rushing Yards', searchText: 'Josh Allen Over 35.5 Rushing Yards' },
  { category: '🔥 SPREAD', text: 'Kansas City Chiefs -3.5 Spread', searchText: 'Kansas City Chiefs -3.5 Spread' },
  { category: '🏈 NFL PROP', text: 'Lamar Jackson 1+ Rushing Touchdown', searchText: 'Lamar Jackson 1+ Rushing Touchdown' },
  { category: '🏈 NFL PROP', text: 'CeeDee Lamb 80+ Receiving Yards', searchText: 'CeeDee Lamb 80+ Receiving Yards' },
  { category: '🏈 NFL PROP', text: 'Christian McCaffrey Over 100.5 Scrimmage Yards', searchText: 'Christian McCaffrey Over 100.5 Scrimmage Yards' },
  { category: '🏈 NFL PROP', text: 'Tyreek Hill 1+ Touchdown Scorer', searchText: 'Tyreek Hill 1+ Touchdown Scorer' },
  { category: '⚾ MLB PROP', text: 'Aaron Judge 1+ Home Runs Hit', searchText: 'Aaron Judge 1+ Home Runs Hit' },
  { category: '⚾ MLB PROP', text: 'Shohei Ohtani 2+ Total Bases', searchText: 'Shohei Ohtani 2+ Total Bases' },
  { category: '⚾ MLB PROP', text: 'Juan Soto Over 1.5 Hits + Runs + RBIs', searchText: 'Juan Soto Over 1.5 Hits Runs RBIs' },
  { category: '⚾ MLB PROP', text: 'Paul Skenes Over 7.5 Strikeouts', searchText: 'Paul Skenes Over 7.5 Strikeouts' },
  { category: '📈 MONEYLINE', text: 'Los Angeles Dodgers Moneyline', searchText: 'Los Angeles Dodgers Moneyline' },
  { category: '⚾ MLB PROP', text: 'Gunnar Henderson 1+ Stolen Base', searchText: 'Gunnar Henderson 1+ Stolen Base' },
  { category: '🏀 WNBA PROP', text: 'Breanna Stewart Over 21.5 Points', searchText: 'Breanna Stewart Over 21.5 Points' },
  { category: '🏀 WNBA PROP', text: 'A\u2019ja Wilson 10+ Rebounds & 2+ Blocks', searchText: 'Aja Wilson 10+ Rebounds and 2+ Blocks' },
  { category: '🏀 WNBA PROP', text: 'Caitlin Clark Over 8.5 Assists', searchText: 'Caitlin Clark Over 8.5 Assists' },
  { category: '🏀 WNBA PROP', text: 'Sabrina Ionescu 3+ Made Three-Pointers', searchText: 'Sabrina Ionescu 3+ Made Three-Pointers' },
  { category: '⚽ MLS PROP', text: 'Lionel Messi Anytime Goalscorer & Inter Miami Win', searchText: 'Lionel Messi Anytime Goalscorer and Inter Miami Win' },
  { category: '⛳ PGA TOUR', text: 'FedExCup Playoffs Winner Market', searchText: 'FedExCup Playoffs Winner Market' },
];

const IT_FALLBACK: TickerItem[] = [
  { category: '🏆 BIG GAME', text: 'Inter to win vs Milan', searchText: 'Inter to win vs Milan' },
  { category: '🔥 PLAYER PROP', text: 'Lautaro anytime goal vs Milan', searchText: 'Lautaro anytime goal vs Milan' },
  { category: '⚡ VALUE BOOST', text: 'Juve to win & BTTS vs Torino', searchText: 'Juventus to win and both teams to score vs Torino' },
  { category: '🏆 BIG GAME', text: 'Napoli to win vs Roma', searchText: 'Napoli to win vs Roma' },
  { category: '🔥 PLAYER PROP', text: 'Sinner to win match', searchText: 'Sinner to win match' },
  { category: '⚡ VALUE BOOST', text: 'Leclerc podium finish F1', searchText: 'Leclerc podium finish' },
];

function getItemsForRegion(region: Region): TickerItem[] {
  if (region === 'IT') return IT_FALLBACK;
  if (region === 'US') return usTickerItems;
  return ukTickerItems;
}

interface HotMarketsProps {
  region: Region;
  onItemClick: (searchText: string) => void;
  embedded?: boolean;
}

export function HotMarkets({ region, onItemClick, embedded = false }: HotMarketsProps) {
  const [items, setItems] = useState<TickerItem[]>([]);

  useEffect(() => {
    setItems(getItemsForRegion(region));
  }, [region]);

  const trackItems = items.length > 0 ? [...items, ...items] : [];

  if (items.length === 0) return null;

  return (
    <div className={embedded
      ? "relative w-full overflow-hidden"
      : "relative mt-4 overflow-hidden rounded-full border border-white/20 bg-zinc-950/90 py-2 px-1 shadow-[0_0_25px_rgba(255,255,255,0.12)] backdrop-blur-md transition-colors hover:border-white/30"
    }>
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-5 bg-gradient-to-r from-black via-black/90 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-5 bg-gradient-to-l from-black via-black/90 to-transparent" />
      <div className="overflow-hidden">
        <div className="flex w-max animate-marquee-scroll items-center gap-3 hover:[animation-play-state:paused]">
          {trackItems.map((item, idx) => (
            <button
              key={`${item.text}-${idx}`}
              onClick={() => onItemClick(item.searchText)}
              className="flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 transition-all hover:border-[#63FF0E]/50"
            >
              <span className="rounded bg-zinc-800/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-300">{item.category}</span>
              <span className="text-xs font-semibold tracking-tight text-white sm:text-sm">{item.text}</span>
              <TrendingUp className="h-3.5 w-3.5 flex-shrink-0 text-[#63FF0E] drop-shadow-[0_0_8px_rgba(99,255,14,0.4)]" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
