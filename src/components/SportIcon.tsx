import {
  Dribbble,
  Circle,
  Disc,
  Target,
  CircleDot,
  Flag,
  Swords,
  Gauge,
  Crown,
  Gamepad2,
  Tv,
  Clapperboard,
  Music,
  Landmark,
  TrendingUp,
  Zap,
} from 'lucide-react';

const svgProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: '#63FF0E',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className: 'w-5 h-5',
};

function getIcon(sportKey: string): JSX.Element {
  const key = sportKey.toLowerCase().trim();
  const prefix = key.split('_')[0];

  if (prefix === 'soccer')
    return (
      <svg {...svgProps}>
        <circle cx="12" cy="12" r="9" />
        <path d="m12 7 2.5 2 1.5 3-2 2.5h-4l-2-2.5 1.5-3Z" />
        <path d="M12 3v4M14.5 9 19 8M16 12l4 2M14 14.5l2 4.5M10 14.5l-2 4.5M8 12l-4 2M9.5 9 5 8M12 21v-4" />
      </svg>
    );

  if (prefix === 'americanfootball')
    return (
      <svg {...svgProps}>
        <path
          d="M4 12C4 6.5 7.5 3 13 3c4.5 0 8 3.5 8 9s-3.5 9-8 9c-5.5 0-9-3.5-9-9z"
          transform="rotate(-45 12 12)"
        />
        <path d="M8 16l8-8M10 11l3 3M11 9l3 3M12 13l2 2" />
      </svg>
    );

  if (prefix === 'rugby')
    return (
      <svg {...svgProps}>
        <ellipse cx="12" cy="12" rx="10" ry="6" transform="rotate(-45 12 12)" />
        <path d="M5 19c7-2 11-6 14-14M8 20c5-3 9-7 11-13" />
      </svg>
    );

  if (prefix === 'basketball') return <Dribbble className="w-5 h-5 text-[#63FF0E]" />;
  if (prefix === 'baseball') return <Circle className="w-5 h-5 text-[#63FF0E]" />;
  if (prefix === 'icehockey') return <Disc className="w-5 h-5 text-[#63FF0E]" />;
  if (prefix === 'tennis') return <Circle className="w-5 h-5 text-[#63FF0E]" />;
  if (prefix === 'darts') return <Target className="w-5 h-5 text-[#63FF0E]" />;
  if (prefix === 'snooker') return <CircleDot className="w-5 h-5 text-[#63FF0E]" />;
  if (prefix === 'golf') return <Flag className="w-5 h-5 text-[#63FF0E]" />;
  if (prefix === 'mma' || prefix === 'boxing') return <Swords className="w-5 h-5 text-[#63FF0E]" />;
  if (prefix === 'motorsport' || prefix === 'formula1' || prefix === 'formula_1')
    return <Gauge className="w-5 h-5 text-[#63FF0E]" />;
  if (prefix === 'horse' || prefix === 'horse_racing') return <Crown className="w-5 h-5 text-[#63FF0E]" />;
  if (prefix === 'cricket') return <CircleDot className="w-5 h-5 text-[#63FF0E]" />;
  if (prefix === 'esports' || prefix === 'csgo' || prefix === 'lol' || prefix === 'dota2')
    return <Gamepad2 className="w-5 h-5 text-[#63FF0E]" />;
  if (prefix === 'tv' || prefix === 'entertainment') return <Tv className="w-5 h-5 text-[#63FF0E]" />;
  if (prefix === 'awards' || prefix === 'oscars') return <Clapperboard className="w-5 h-5 text-[#63FF0E]" />;
  if (prefix === 'eurovision' || prefix === 'music') return <Music className="w-5 h-5 text-[#63FF0E]" />;
  if (prefix === 'politics' || prefix === 'elections') return <Landmark className="w-5 h-5 text-[#63FF0E]" />;
  if (prefix === 'financials' || prefix === 'crypto') return <TrendingUp className="w-5 h-5 text-[#63FF0E]" />;

  return <Zap className="w-5 h-5 text-[#63FF0E]" />;
}

export const SportIcon = ({ sportKey }: { sportKey: string }) => (
  <div className="w-10 h-10 rounded-xl bg-[#63FF0E]/10 border border-[#63FF0E]/25 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(99,255,14,0.15)]">
    {getIcon(sportKey)}
  </div>
);
