import React from 'react';

interface SignedOutHeroBannerProps {
  region?: 'GB' | 'IT' | 'US' | string;
  onOpenAuthModal: () => void;
}

const FilledDiagonalArrow = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M6 18L18 6M18 6H9M18 6V15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const SignedOutHeroBanner: React.FC<SignedOutHeroBannerProps> = ({
  region = 'GB',
  onOpenAuthModal,
}) => {
  const localizedContent = {
    GB: {
      badge: '%C ODDS CLUB',
      titleFirst: 'Instant Sign-Up.',
      titleSecond: 'Instant Rewards.',
      subtext: 'Daily free spin bets + connect your Sky Bet, Paddy Power & Betfair accounts in one place.',
      ctaPrimary: 'Join Odds Club',
      ctaSecondary: 'Already a member?',
    },
    IT: {
      badge: '%C ODDS CLUB',
      titleFirst: 'Iscrizione Istantanea.',
      titleSecond: 'Premi Istantanei.',
      subtext: 'Spin giornalieri + collega Sisal, Betfair & Paddy Power in un solo posto.',
      ctaPrimary: 'Entra in Odds Club',
      ctaSecondary: 'Sei già iscritto?',
    },
    US: {
      badge: '%C ODDS CLUB',
      titleFirst: 'Instant Sign-Up.',
      titleSecond: 'Instant Rewards.',
      subtext: 'Daily free spin bets + connect your FanDuel & DraftKings accounts in one place.',
      ctaPrimary: 'Join Odds Club',
      ctaSecondary: 'Already a member?',
    },
  };

  const content = localizedContent[region as keyof typeof localizedContent] || localizedContent.GB;

  return (
    <div className="w-full mb-3 px-3.5 py-2 rounded-xl !bg-zinc-950 border border-[#FF8C00]/30 shadow-[0_0_15px_rgba(255,140,0,0.06)] flex flex-col sm:flex-row items-center justify-between gap-3 !text-white">
      {/* Left Group: Badge + Clean Heading + Short Subtext */}
      <div className="flex items-center gap-2.5 flex-wrap min-w-0">
        <span className="shrink-0 bg-[#FF8C00]/15 border border-[#FF8C00]/40 text-[#FF8C00] text-[10px] font-black px-2 py-0.5 rounded-md tracking-wider">
          {content.badge}
        </span>

        <h3 className="font-display text-xs sm:text-sm font-bold tracking-tight text-white whitespace-nowrap">
          {content.titleFirst} <span className="text-[#FF8C00]">{content.titleSecond}</span>
        </h3>

        <span className="hidden lg:inline text-zinc-600 text-xs">•</span>

        <p className="hidden md:inline text-zinc-300 text-xs font-medium truncate max-w-xl">
          {content.subtext}
        </p>
      </div>

      {/* Right Actions: Dual Consistent Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Secondary: Already a Member? */}
        <button
          onClick={onOpenAuthModal}
          className="group px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <span>{content.ctaSecondary}</span>
          <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">
            <FilledDiagonalArrow className="w-3 h-3 text-zinc-400 group-hover:text-white" />
          </span>
        </button>

        {/* Primary: Join Odds Club */}
        <button
          onClick={onOpenAuthModal}
          className="group px-3.5 py-1.5 rounded-lg bg-[#FF8C00] text-black font-bold text-xs flex items-center gap-1.5 hover:bg-[#e07b00] transition-colors cursor-pointer shadow-sm"
        >
          <span>{content.ctaPrimary}</span>
          <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">
            <FilledDiagonalArrow className="w-3 h-3 text-black" />
          </span>
        </button>
      </div>
    </div>
  );
};
