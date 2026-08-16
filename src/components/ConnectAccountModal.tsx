import { Zap, Check, Crown, Plus, Link2, Unlink } from 'lucide-react';
import { Modal } from './Modal';
import { useDemo } from '@/context/DemoContext';

interface OperatorRow {
  name: string;
  region: string;
  currency: string;
  balance: number;
  connected: boolean;
  competitor?: boolean;
}

const OPERATOR_ROWS: OperatorRow[] = [
  { name: 'Sky Bet', region: 'UK', currency: '£', balance: 15.0, connected: true },
  { name: 'Betfair', region: 'UK', currency: '£', balance: 10.0, connected: true },
  { name: 'Paddy Power', region: 'UK/IE', currency: '£', balance: 5.0, connected: true },
  { name: 'Sisal', region: 'IT', currency: '€', balance: 0, connected: false },
  { name: 'Bet365', region: 'UK', currency: '£', balance: 0, connected: false, competitor: true },
  { name: 'William Hill', region: 'UK', currency: '£', balance: 0, connected: false, competitor: true },
];

interface ConnectAccountModalProps {
  open: boolean;
  onClose: () => void;
}

export function ConnectAccountModal({ open, onClose }: ConnectAccountModalProps) {
  const { linkedOperators, primaryOperator, setPrimaryOperator, toggleLinkedOperator, currency } = useDemo();

  return (
    <Modal open={open} onClose={onClose} title="FLUTTER UK CONNECTED WALLETS">
      <div className="space-y-4">
        <div className="flex items-start gap-2.5 rounded-xl border border-[#63FF0E]/20 bg-[#63FF0E]/5 px-4 py-3">
          <Zap className="mt-0.5 h-4 w-4 shrink-0 text-[#63FF0E]" />
          <p className="text-xs leading-relaxed text-zinc-400">
            Unified odds engine synced with your active Flutter UK accounts.
            Tap a connected brand to pin it as your primary operator.
          </p>
        </div>

        <div className="space-y-2.5">
          {OPERATOR_ROWS.map((row) => {
            const isLinked = linkedOperators.includes(row.name);
            const isPrimary = primaryOperator === row.name;
            const sym = row.currency || currency;

            return (
              <div
                key={row.name}
                className={`rounded-xl border p-3.5 transition-all ${
                  isPrimary
                    ? 'border-[#63FF0E]/60 bg-[#63FF0E]/10 shadow-[0_0_12px_rgba(99,255,14,0.12)]'
                    : isLinked
                      ? 'border-zinc-700 bg-zinc-900/60'
                      : 'border-zinc-800/60 bg-zinc-900/30'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-2.5 w-2.5 shrink-0 items-center justify-center rounded-full ${
                        isLinked ? 'bg-[#63FF0E] shadow-[0_0_6px_rgba(99,255,14,0.5)]' : 'bg-zinc-600'
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-white">{row.name}</p>
                        {row.competitor && (
                          <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                            Rival
                          </span>
                        )}
                        {isPrimary && (
                          <span className="inline-flex items-center gap-0.5 rounded bg-[#63FF0E]/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#63FF0E]">
                            <Crown className="h-2.5 w-2.5" />
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-[11px] text-zinc-500">
                        {row.region} · {isLinked ? `${sym}${row.balance.toFixed(2)}` : 'Available'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isLinked && !isPrimary && (
                      <button
                        onClick={() => setPrimaryOperator(row.name)}
                        className="rounded-lg border border-zinc-700 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-300 transition hover:border-[#63FF0E]/50 hover:text-[#63FF0E]"
                      >
                        Set Primary
                      </button>
                    )}
                    <button
                      onClick={() => toggleLinkedOperator(row.name)}
                      className={`flex h-6 w-11 items-center rounded-full border transition-all ${
                        isLinked
                          ? 'justify-end border-[#63FF0E]/40 bg-[#63FF0E]/20'
                          : 'justify-start border-zinc-700 bg-zinc-800'
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full transition-transform ${
                          isLinked ? 'bg-[#63FF0E] text-black' : 'bg-zinc-500'
                        }`}
                      >
                        {isLinked ? <Check className="h-2.5 w-2.5" /> : <Plus className="h-2.5 w-2.5" />}
                      </span>
                    </button>
                  </div>
                </div>

                {isLinked && (
                  <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider">
                    {isLinked ? (
                      <span className="inline-flex items-center gap-1 text-[#63FF0E]">
                        <Link2 className="h-3 w-3" />
                        Connected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-zinc-500">
                        <Unlink className="h-3 w-3" />
                        Disconnected
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-black/40 px-4 py-3">
          <span className="text-xs font-medium text-zinc-400">Linked Accounts</span>
          <span className="text-sm font-bold text-white">
            {linkedOperators.length} <span className="text-zinc-500">connected</span>
          </span>
        </div>
      </div>
    </Modal>
  );
}
