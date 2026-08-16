import { useState } from 'react';
import { X, Search, Mail, Calendar, Check, Zap, LogOut, Save, ExternalLink, Bell, Plus, Sliders, Flame } from 'lucide-react';
import { useDemo } from '@/context/DemoContext';

interface AccountProfileModalProps {
  open: boolean;
  onClose: () => void;
}

const ALL_AVAILABLE_LEAGUES = [
  'Premier League', 'Championship', 'League One', 'League Two', 'Champions League', 'Europa League',
  'International Football', 'NFL', 'NBA', 'MLB', 'NHL', 'Formula 1', 'Grand Slams (Tennis)',
  'PGA Tour (Golf)', 'Boxing & MMA', 'IPL Cricket', 'Six Nations Rugby', 'Serie A',
];

const AVAILABLE_TEAMS = [
  'Manchester United', 'England', 'Arsenal', 'Liverpool', 'Real Madrid',
  'Barcelona', 'Kansas City Chiefs', 'LA Lakers', 'Ferrari F1', 'Juventus', 'Inter Milan',
];

export function AccountProfileModal({ open, onClose }: AccountProfileModalProps) {
  const {
    userName,
    email,
    dob,
    age,
    marketingAlerts,
    toggleMarketingAlerts,
    activeInterests,
    inactiveInterests,
    toggleInterest,
    logout,
    pushToast,
    currency,
    walletBalance,
    linkedOperators,
    primaryOperator,
    streakCount,
    incrementStreak,
  } = useDemo();

  const [leagueSearch, setLeagueSearch] = useState('');
  const [teamSearch, setTeamSearch] = useState('');
  const [followedTeams, setFollowedTeams] = useState<string[]>(['Manchester United', 'England']);
  const [autoAcceptOdds, setAutoAcceptOdds] = useState(true);
  const [defaultStake, setDefaultStake] = useState('10');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!open) return null;

  const toggleTeam = (team: string) => {
    setFollowedTeams((prev) =>
      prev.includes(team) ? prev.filter((t) => t !== team) : [...prev, team],
    );
  };

  const handleSave = () => {
    setSaveSuccess(true);
    pushToast('Preferences saved.', 'success');
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleLogout = () => {
    logout();
    pushToast('Logged out.', 'info');
    onClose();
  };

  const filteredLeagues = ALL_AVAILABLE_LEAGUES.filter((l) =>
    l.toLowerCase().includes(leagueSearch.toLowerCase()),
  );
  const filteredTeams = AVAILABLE_TEAMS.filter((t) =>
    t.toLowerCase().includes(teamSearch.toLowerCase()),
  );

  return (
    <>
      <div
        className="fixed inset-0 z-[90] bg-black/85 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 md:p-6 overflow-y-auto">
        <div className="w-full max-w-3xl my-auto rounded-3xl border border-[#FF8C00]/30 bg-zinc-950 shadow-[0_0_50px_rgba(255,140,0,0.1)] text-white overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-900 bg-zinc-950/90 px-6 py-5 backdrop-blur-sm md:px-8">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#FF8C00]/40 bg-[#FF8C00]/15 text-xs font-black text-[#FF8C00]">
                %C
              </span>
              <h2 className="font-display text-xl font-bold tracking-tight text-white md:text-2xl">
                Account &amp; <span className="text-[#FF8C00]">Odds Club Preferences</span>
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="max-h-[80vh] space-y-6 overflow-y-auto p-6 md:p-8">
            {/* Profile */}
            <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF8C00] text-2xl font-extrabold text-black shadow-lg">
                  {userName[0]}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{userName}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-zinc-500" /> {email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-zinc-500" /> {dob}{' '}
                      <span className="text-zinc-500">(Age {age})</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="shrink-0 rounded-xl border border-[#FF8C00]/30 bg-gradient-to-br from-zinc-900 to-zinc-950 p-3 text-right">
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Odds Club Status
                </div>
                <div className="text-sm font-extrabold text-[#FF8C00]">Platinum Member</div>
              </div>
            </div>

            {/* Streak Tracker */}
            <div className="flex items-center justify-between rounded-2xl border border-orange-500/20 bg-orange-500/5 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-2.5 text-orange-400">
                  <Flame className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Prediction Streak</div>
                  <div className="text-xs text-zinc-400">Log a prediction daily to keep your streak alive.</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-lg font-extrabold text-orange-400">{streakCount}/7</div>
                  <div className="text-[10px] text-zinc-500">Days to Reward</div>
                </div>
                <button
                  onClick={() => {
                    incrementStreak();
                    pushToast('Streak bonus activated!', 'success');
                  }}
                  className="rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 py-2 text-xs font-bold text-orange-300 transition hover:border-orange-500/50 hover:bg-orange-500/20 cursor-pointer"
                >
                  Log Today
                </button>
              </div>
            </div>

            {/* Betting Defaults */}
            <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
                <Sliders className="h-4 w-4 text-[#FF8C00]" />
                <span>Betting &amp; 1-Tap Defaults</span>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-zinc-400">
                    Default 1-Tap Stake ({currency})
                  </label>
                  <div className="flex items-center gap-2">
                    {['5', '10', '25', '50'].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setDefaultStake(amount)}
                        className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
                          defaultStake === amount
                            ? 'bg-[#FF8C00] text-black shadow-md'
                            : 'border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700'
                        }`}
                      >
                        {currency}{amount}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-3">
                  <div>
                    <div className="text-xs font-bold text-white">Auto-Accept Better Odds</div>
                    <div className="text-[10px] text-zinc-400">
                      Automatically accept higher odds on bet placement.
                    </div>
                  </div>
                  <button
                    onClick={() => setAutoAcceptOdds(!autoAcceptOdds)}
                    className={`relative h-5 w-10 rounded-full p-0.5 transition-colors ${
                      autoAcceptOdds ? 'bg-[#FF8C00]' : 'bg-zinc-800'
                    }`}
                  >
                    <div
                      className={`h-4 w-4 rounded-full bg-black transition-transform ${
                        autoAcceptOdds ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Followed Teams */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
                  <span className="text-[#FF8C00]">%C</span> My Followed Teams
                </label>
                <span className="text-xs text-zinc-500">{followedTeams.length} Selected</span>
              </div>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={teamSearch}
                  onChange={(e) => setTeamSearch(e.target.value)}
                  placeholder="Search teams..."
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 transition-colors focus:border-[#FF8C00] focus:outline-none"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {filteredTeams.map((team) => {
                  const isSelected = followedTeams.includes(team);
                  return (
                    <button
                      key={team}
                      onClick={() => toggleTeam(team)}
                      className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                        isSelected
                          ? 'border border-[#FF8C00] bg-[#FF8C00] text-black'
                          : 'border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700 hover:text-white'
                      }`}
                    >
                      <span>{team}</span>
                      {isSelected ? (
                        <Check className="h-3 w-3 text-black" />
                      ) : (
                        <span className="text-zinc-500">+</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sports & Leagues */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
                  <span className="text-[#FF8C00]">%C</span> My Sports &amp; Leagues
                </label>
                <span className="text-xs text-zinc-500">{activeInterests.length} Followed</span>
              </div>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={leagueSearch}
                  onChange={(e) => setLeagueSearch(e.target.value)}
                  placeholder="Search sports & leagues..."
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 transition-colors focus:border-[#FF8C00] focus:outline-none"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {activeInterests
                  .filter((i) => i.toLowerCase().includes(leagueSearch.toLowerCase()))
                  .map((interest) => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className="flex items-center gap-1.5 rounded-xl border border-[#FF8C00] bg-zinc-900 px-3 py-1.5 text-xs font-bold text-[#FF8C00] transition hover:bg-zinc-800"
                    >
                      <span>{interest}</span>
                      <Check className="h-3 w-3 text-[#FF8C00]" />
                    </button>
                  ))}
                {inactiveInterests
                  .filter((i) => i.toLowerCase().includes(leagueSearch.toLowerCase()))
                  .map((interest) => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs font-medium text-zinc-400 transition hover:border-zinc-700 hover:text-white"
                    >
                      <span>{interest}</span>
                      <span className="text-zinc-600">+</span>
                    </button>
                  ))}
              </div>
            </div>

            {/* Connected Bookmakers */}
            <div className="space-y-2 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                <span className="flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-[#63FF0E]" /> Connected Bookmakers ({linkedOperators.length} Linked)
                </span>
                <button className="flex items-center gap-1 text-[11px] font-bold text-[#FF8C00] hover:underline">
                  <Plus className="h-3 w-3" /> Link New Bookmaker
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 sm:grid-cols-3">
                {linkedOperators.map((op) => (
                  <div
                    key={op}
                    className={`rounded-xl border p-2.5 text-center text-xs font-bold text-white ${
                      op === primaryOperator ? 'border-[#63FF0E]/30 bg-[#63FF0E]/5' : 'border-zinc-800 bg-zinc-950'
                    }`}
                  >
                    {op}
                    {op === primaryOperator && (
                      <span className="block text-[10px] font-normal text-[#63FF0E]">
                        {currency}{walletBalance.toFixed(2)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Email Notifications */}
            <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-[#FF8C00]/30 bg-[#FF8C00]/10 p-2.5 text-[#FF8C00]">
                  <Bell className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Email Promotions &amp; Free Bet Alerts</div>
                  <div className="text-xs text-zinc-400">
                    Receive daily Odds Wheel boosts &amp; streak notifications.
                  </div>
                </div>
              </div>
              <button
                onClick={toggleMarketingAlerts}
                className={`relative h-6 w-12 rounded-full p-0.5 transition-colors ${
                  marketingAlerts ? 'bg-[#FF8C00]' : 'bg-zinc-800'
                }`}
              >
                <div
                  className={`h-5 w-5 rounded-full bg-black transition-transform ${
                    marketingAlerts ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Terms Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-900 pt-2 text-xs text-zinc-500">
              <div className="flex items-center gap-4">
                <a href="#" className="flex items-center gap-1 transition-colors hover:text-[#FF8C00]">
                  View Terms &amp; Conditions <ExternalLink className="h-3 w-3" />
                </a>
                <a href="#" className="transition-colors hover:text-[#FF8C00]">
                  Privacy Policy
                </a>
              </div>
              <span>Odds Club v2.4</span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-zinc-900 bg-zinc-950 p-5 sm:flex-row">
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-2.5 text-xs font-bold text-zinc-400 transition-colors hover:border-red-500/30 hover:text-red-400 sm:w-auto"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log Out</span>
            </button>
            <button
              onClick={handleSave}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF8C00] px-6 py-2.5 text-xs font-extrabold text-black transition-colors hover:bg-[#e07b00] sm:w-auto shadow-[0_0_15px_rgba(255,140,0,0.25)]"
            >
              <Save className="h-3.5 w-3.5 text-black" />
              <span>{saveSuccess ? 'Preferences Saved' : 'Save Preferences'}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
