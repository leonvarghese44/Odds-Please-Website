import React, { useState } from 'react';
import { X, Search, Mail, Calendar, Check, Sliders, Bell, LogOut, Save, ExternalLink } from 'lucide-react';
import { useDemo } from '../context/DemoContext';

interface AccountPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  region?: 'GB' | 'US' | string;
  onLogout: () => void;
}

export const AccountPreferencesModal: React.FC<AccountPreferencesModalProps> = ({
  isOpen,
  onClose,
  region = 'GB',
  onLogout,
}) => {
  const { preferences, updatePreferences } = useDemo();

  const currency = region === 'US' ? '$' : '£';

  const allAvailableLeagues = [
    'Premier League', 'Championship', 'League One', 'League Two', 'Champions League', 'Europa League',
    'International Football', 'NFL', 'NBA', 'MLB', 'NHL', 'Formula 1', 'Grand Slams', 'Boxing & MMA'
  ];

  const availableTeams = [
    'Manchester United', 'England', 'Arsenal', 'Liverpool', 'Real Madrid', 
    'Barcelona', 'Kansas City Chiefs', 'LA Lakers', 'Ferrari F1'
  ];

  const [followedLeagues, setFollowedLeagues] = useState<string[]>(preferences.followedLeagues || []);
  const [followedTeams, setFollowedTeams] = useState<string[]>(preferences.followedTeams || []);
  const [emailAlerts, setEmailAlerts] = useState(preferences.emailAlerts);
  const [autoAcceptOdds, setAutoAcceptOdds] = useState(preferences.autoAcceptOdds);
  const [defaultStake, setDefaultStake] = useState(preferences.defaultStake || '10');

  const [leagueSearch, setLeagueSearch] = useState('');
  const [teamSearch, setTeamSearch] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const toggleLeague = (league: string) => {
    setFollowedLeagues(prev => 
      prev.includes(league) ? prev.filter(l => l !== league) : [...prev, league]
    );
  };

  const toggleTeam = (team: string) => {
    setFollowedTeams(prev => 
      prev.includes(team) ? prev.filter(t => t !== team) : [...prev, team]
    );
  };

  const handleSave = () => {
    updatePreferences({
      defaultStake,
      autoAcceptOdds,
      followedTeams,
      followedLeagues,
      emailAlerts
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const filteredLeagues = allAvailableLeagues.filter(l => 
    l.toLowerCase().includes(leagueSearch.toLowerCase())
  );

  const filteredTeams = availableTeams.filter(t => 
    t.toLowerCase().includes(teamSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-zinc-950 border border-[#FF8C00]/30 rounded-2xl shadow-[0_0_40px_rgba(255,140,0,0.1)] relative text-white flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-900 flex items-center justify-between bg-zinc-950 shrink-0 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-[#FF8C00]/15 border border-[#FF8C00]/40 text-[#FF8C00] flex items-center justify-center font-black text-xs">
              %C
            </span>
            <h2 className="font-display text-lg font-bold tracking-tight text-white">
              Account & <span className="text-[#FF8C00]">Odds Club Preferences</span>
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer">
            <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 overflow-y-auto custom-scrollbar">
          
          {/* Profile Header */}
          <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FF8C00] text-black font-extrabold text-xl flex items-center justify-center shrink-0">
              LF
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Leon Flutter</h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400 mt-1">
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-zinc-500"/> admin@oddsplease.com</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-zinc-500"/> 20/02/2005 <span className="text-zinc-500">(Age 21)</span></span>
              </div>
            </div>
          </div>

          {/* Betting Defaults */}
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-3">
            <div className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#FF8C00]"/>
              <span>Betting & 1-Tap Defaults</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5">Default Stake ({currency})</label>
                <div className="flex items-center gap-1.5">
                  {['5', '10', '25', '50'].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setDefaultStake(amount)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${defaultStake === amount ? 'bg-[#FF8C00] text-black' : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700'}`}
                    >
                      {currency}{amount}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                <div>
                  <div className="text-xs font-bold text-white">Auto-Accept Price Shifts</div>
                  <div className="text-[10px] text-zinc-400">Accept higher odds automatically.</div>
                </div>
                <button onClick={() => setAutoAcceptOdds(!autoAcceptOdds)} className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer p-0.5 ${autoAcceptOdds ? 'bg-[#FF8C00]' : 'bg-zinc-800'}`}>
                  <div className={`w-4 h-4 rounded-full bg-black transition-transform ${autoAcceptOdds ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Followed Teams */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5"><span className="text-[#FF8C00]">%C</span> My Followed Teams</label>
              <span className="text-[11px] text-zinc-500">{followedTeams.length} Selected</span>
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2"/>
              <input type="text" value={teamSearch} onChange={(e) => setTeamSearch(e.target.value)} placeholder="Search teams (e.g. Manchester United)..." className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF8C00] transition-colors" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {filteredTeams.map((team) => {
                const isSelected = followedTeams.includes(team);
                return (
                  <button key={team} onClick={() => toggleTeam(team)} className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${isSelected ? 'bg-[#FF8C00] text-black' : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'}`}>
                    <span>{team}</span>
                    {isSelected ? <Check className="w-3 h-3 text-black"/> : <span className="text-zinc-500">+</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Followed Leagues */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5"><span className="text-[#FF8C00]">%C</span> My Sports & Leagues</label>
              <span className="text-[11px] text-zinc-500">{followedLeagues.length} Followed</span>
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2"/>
              <input type="text" value={leagueSearch} onChange={(e) => setLeagueSearch(e.target.value)} placeholder="Search sports & leagues..." className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF8C00] transition-colors" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {filteredLeagues.map((league) => {
                const isSelected = followedLeagues.includes(league);
                return (
                  <button key={league} onClick={() => toggleLeague(league)} className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${isSelected ? 'bg-zinc-900 border border-[#FF8C00] text-[#FF8C00] font-bold' : 'bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'}`}>
                    <span>{league}</span>
                    {isSelected ? <Check className="w-3 h-3 text-[#FF8C00]"/> : <span className="text-zinc-500">+</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Email Notifications */}
          <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#FF8C00]/10 border border-[#FF8C00]/30 text-[#FF8C00]">
                <Bell className="w-3.5 h-3.5"/>
              </div>
              <div>
                <div className="text-xs font-bold text-white">Email Promotions & Free Bet Alerts</div>
                <div className="text-[10px] text-zinc-500">Receive daily boosts & streak notifications.</div>
              </div>
            </div>
            <button onClick={() => setEmailAlerts(!emailAlerts)} className={`w-11 h-5.5 rounded-full transition-colors relative cursor-pointer p-0.5 ${emailAlerts ? 'bg-[#FF8C00]' : 'bg-zinc-800'}`}>
              <div className={`w-4 h-4 rounded-full bg-black transition-transform ${emailAlerts ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Terms Footer */}
          <div className="flex flex-wrap items-center justify-between text-xs text-zinc-600 pt-1 border-t border-zinc-900 gap-2">
            <div className="flex items-center gap-3">
              <a href="#" className="hover:text-[#FF8C00] transition-colors flex items-center gap-1">
                View Terms & Conditions <ExternalLink className="w-3 h-3"/>
              </a>
              <a href="#" className="hover:text-[#FF8C00] transition-colors">
                Privacy Policy
              </a>
            </div>
            <span>Odds Club v2.4</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-900 bg-zinc-950 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0 rounded-b-2xl">
          <button onClick={onLogout} className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-400 hover:border-red-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
            <LogOut className="w-3.5 h-3.5"/>
            <span>Log Out</span>
          </button>
          <button onClick={handleSave} className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#FF8C00] text-black font-extrabold text-xs flex items-center justify-center gap-1.5 hover:bg-[#e07b00] transition-colors cursor-pointer shadow-[0_0_12px_rgba(255,140,0,0.2)]">
            <Save className="w-3.5 h-3.5 text-black"/>
            <span>{saveSuccess ? 'Preferences Saved' : 'Save Preferences'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
