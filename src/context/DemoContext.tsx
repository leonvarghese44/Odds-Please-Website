import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export interface ToastMessage {
  id: number;
  text: string;
  variant: 'success' | 'info';
}

export interface UserPreferences {
  defaultStake: string;
  autoAcceptOdds: boolean;
  followedTeams: string[];
  followedLeagues: string[];
  emailAlerts: boolean;
}

export interface DemoState {
  isLoggedIn: boolean;
  userName: string;
  email: string;
  dob: string;
  age: number;
  marketingAlerts: boolean;
  activeInterests: string[];
  inactiveInterests: string[];
  currency: string;
  walletBalance: number;
  streakCount: number;
  linkedOperators: string[];
  primaryOperator: string;
  flutterOnlyMode: boolean;
  preferences: UserPreferences;
}

const DEFAULT_STATE: DemoState = {
  isLoggedIn: false,
  userName: 'Leon',
  email: 'leon.flutter@oddsplease.com',
  dob: '14/05/1994',
  age: 32,
  marketingAlerts: true,
  activeInterests: ['Premier League', 'Champions League', 'NFL', 'Grand Slams'],
  inactiveInterests: ['NBA', 'Boxing & MMA', 'Formula 1'],
  currency: '£',
  walletBalance: 15.0,
  streakCount: 4,
  linkedOperators: ['Sky Bet', 'Betfair', 'Paddy Power'],
  primaryOperator: 'Sky Bet',
  flutterOnlyMode: true,
  preferences: {
    defaultStake: '10',
    autoAcceptOdds: true,
    followedTeams: ['Manchester United', 'England'],
    followedLeagues: ['Premier League', 'Championship', 'League One', 'League Two', 'Champions League', 'International Football'],
    emailAlerts: true,
  },
};

interface DemoContextValue extends DemoState {
  login: () => void;
  logout: () => void;
  setPrimaryOperator: (op: string) => void;
  setWalletBalance: (balance: number) => void;
  toggleLinkedOperator: (op: string) => void;
  setFlutterOnlyMode: (on: boolean) => void;
  incrementStreak: () => void;
  toggleMarketingAlerts: () => void;
  toggleInterest: (interest: string) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  toasts: ToastMessage[];
  pushToast: (text: string, variant?: 'success' | 'info') => void;
  dismissToast: (id: number) => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

const STORAGE_KEY = 'ss_demo_state';

function loadState(): DemoState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    // ignore
  }
  return DEFAULT_STATE;
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(loadState);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const pushToast = useCallback((text: string, variant: 'success' | 'info' = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, variant }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const login = () => setState((s) => ({ ...s, isLoggedIn: true }));
  const logout = () => setState((s) => ({ ...s, isLoggedIn: false }));

  const setPrimaryOperator = (op: string) =>
    setState((s) => ({ ...s, primaryOperator: op }));

  const setWalletBalance = (balance: number) =>
    setState((s) => ({ ...s, walletBalance: balance }));

  const toggleLinkedOperator = (op: string) =>
    setState((s) => {
      const has = s.linkedOperators.includes(op);
      const linkedOperators = has
        ? s.linkedOperators.filter((o) => o !== op)
        : [...s.linkedOperators, op];
      const primaryOperator = has && s.primaryOperator === op
        ? linkedOperators[0] ?? ''
        : s.primaryOperator;
      return { ...s, linkedOperators, primaryOperator };
    });

  const setFlutterOnlyMode = (on: boolean) =>
    setState((s) => ({ ...s, flutterOnlyMode: on }));

  const incrementStreak = () =>
    setState((s) => ({ ...s, streakCount: s.streakCount + 1 }));

  const toggleMarketingAlerts = () =>
    setState((s) => ({ ...s, marketingAlerts: !s.marketingAlerts }));

  const toggleInterest = (interest: string) =>
    setState((s) => {
      const inActive = s.activeInterests.includes(interest);
      if (inActive) {
        return {
          ...s,
          activeInterests: s.activeInterests.filter((i) => i !== interest),
          inactiveInterests: [...s.inactiveInterests, interest],
        };
      }
      return {
        ...s,
        inactiveInterests: s.inactiveInterests.filter((i) => i !== interest),
        activeInterests: [...s.activeInterests, interest],
      };
    });

  const updatePreferences = (prefs: Partial<UserPreferences>) =>
    setState((s) => ({ ...s, preferences: { ...s.preferences, ...prefs } }));

  return (
    <DemoContext.Provider
      value={{
        ...state,
        login,
        logout,
        setPrimaryOperator,
        setWalletBalance,
        toggleLinkedOperator,
        setFlutterOnlyMode,
        incrementStreak,
        toggleMarketingAlerts,
        toggleInterest,
        updatePreferences,
        toasts,
        pushToast,
        dismissToast,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo(): DemoContextValue {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used within DemoProvider');
  return ctx;
}
