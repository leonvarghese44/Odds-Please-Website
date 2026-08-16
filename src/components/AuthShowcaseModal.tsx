import { useState, useEffect, useRef } from 'react';
import { Zap, Loader2, X } from 'lucide-react';
import { useDemo } from '@/context/DemoContext';

interface AuthShowcaseModalProps {
  open: boolean;
  onClose: () => void;
}

type SyncState = 'idle' | 'syncing' | 'done';

export function AuthShowcaseModal({ open, onClose }: AuthShowcaseModalProps) {
  const { login, pushToast } = useDemo();
  const [syncState, setSyncState] = useState<SyncState>('idle');
  const [syncStep, setSyncStep] = useState(0);
  const confettiRef = useRef<HTMLCanvasElement>(null);
  const syncTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const SYNC_STEPS = ['Sky Bet', 'Betfair', 'Paddy Power'];

  useEffect(() => {
    if (!open) {
      setSyncState('idle');
      setSyncStep(0);
      if (syncTimer.current) clearTimeout(syncTimer.current);
    }
  }, [open]);

  // Confetti burst
  const fireConfetti = () => {
    const canvas = confettiRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#63FF0E', '#52e000', '#a5ff5e', '#ffffff', '#fbbf24'];
    const particles = Array.from({ length: 80 }, () => ({
      x: canvas.width / 2,
      y: canvas.height / 2.5,
      vx: (Math.random() - 0.5) * 14,
      vy: Math.random() * -12 - 4,
      size: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vr: (Math.random() - 0.5) * 10,
      life: 1,
    }));

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35;
        p.rotation += p.vr;
        p.life -= 0.012;
        if (p.life > 0) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      });
      frame++;
      if (frame < 120) requestAnimationFrame(animate);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    animate();
  };

  const handleConnect = () => {
    setSyncState('syncing');
    setSyncStep(0);

    // Animate through each sync step over 1.5s
    SYNC_STEPS.forEach((_, i) => {
      syncTimer.current = setTimeout(() => setSyncStep(i), i * 500);
    });

    syncTimer.current = setTimeout(() => {
      setSyncStep(SYNC_STEPS.length);
      setSyncState('done');
      fireConfetti();
      pushToast('⚡ Welcome back, Leon! Sky Bet, Betfair & Paddy Power connected.', 'success');
      setTimeout(() => {
        login();
        onClose();
      }, 400);
    }, 1600);
  };

  if (!open) return null;

  return (
    <>
      <canvas
        ref={confettiRef}
        className="pointer-events-none fixed inset-0 z-[110]"
      />
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
        onClick={syncState === 'syncing' ? undefined : onClose}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        <div
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#63FF0E]/30 bg-zinc-950 shadow-2xl animate-fade-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            disabled={syncState === 'syncing'}
            className="absolute right-4 top-4 z-10 rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white disabled:opacity-30"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="px-6 pt-8 pb-6">
            {/* Header */}
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-[#63FF0E]/30 bg-[#63FF0E]/10 shadow-[0_0_12px_rgba(99,255,14,0.15)]">
                <Zap className="h-6 w-6 text-[#63FF0E]" />
              </div>
              <h2 className="text-xl font-bold text-white">Join Odds Club</h2>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                Your high-speed hub for best odds and daily betting rewards.
              </p>
            </div>

            {/* Feature Cards */}
            {syncState !== 'syncing' && (
              <div className="mb-6 space-y-2.5">
                {[
                  { icon: '🎡', title: 'The Odds Wheel', desc: 'Win instant boost tokens every morning.' },
                  { icon: '🔥', title: '£5 Free Bet Reward', desc: 'Log in and place a bet 7 days in a row.' },
                  { icon: '⚡', title: 'Linked Accounts', desc: 'Seamlessly connect Sky Bet, Betfair & Paddy Power.' },
                ].map((f) => (
                  <div
                    key={f.title}
                    className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3"
                  >
                    <span className="text-xl">{f.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{f.title}</p>
                      <p className="text-[11px] text-zinc-500">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Syncing Animation */}
            {syncState === 'syncing' && (
              <div className="mb-6 space-y-3 py-4">
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-[#63FF0E]" />
                  <p className="text-sm font-semibold text-zinc-300">Syncing Sky Bet • Betfair • Paddy Power</p>
                </div>
                <div className="space-y-2">
                  {SYNC_STEPS.map((step, i) => (
                    <div
                      key={step}
                      className={`flex items-center justify-between rounded-lg border px-4 py-2.5 transition-all ${
                        i <= syncStep
                          ? 'border-[#63FF0E]/40 bg-[#63FF0E]/10'
                          : 'border-zinc-800 bg-zinc-900/30'
                      }`}
                    >
                      <span className={`text-sm font-medium ${i <= syncStep ? 'text-white' : 'text-zinc-500'}`}>
                        {step}
                      </span>
                      {i <= syncStep ? (
                        <span className="h-2.5 w-2.5 rounded-full bg-[#63FF0E] shadow-[0_0_6px_rgba(99,255,14,0.6)]" />
                      ) : (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Button */}
            {syncState !== 'syncing' && (
              <button
                onClick={handleConnect}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#63FF0E] px-4 py-3 text-sm font-bold text-black transition hover:bg-[#52e000] shadow-[0_0_15px_rgba(99,255,14,0.3)]"
              >
                <Zap className="h-4 w-4" />
                1-Click Join / Log In as Leon
              </button>
            )}

            {syncState === 'done' && (
              <p className="mt-4 text-center text-xs font-semibold text-[#63FF0E]">
                Sync complete! Welcome aboard.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
