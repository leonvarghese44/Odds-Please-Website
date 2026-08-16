import { Bolt, ShieldCheck, Network, Handshake, ArrowRight } from 'lucide-react';
import { PageLayout, InfoCard } from '@/components/PageLayout';

const pillars = [
  {
    icon: Bolt,
    title: 'High-Intent Traffic',
    desc: 'Bypassing traditional dropdown navigation fatigue to deliver qualified users directly to target match pages and betslips.',
  },
  {
    icon: ShieldCheck,
    title: '100% Regulated',
    desc: 'Built for strict compliance with US state gaming boards, UK Gambling Commission (UKGC), and Italian ADM standards.',
  },
  {
    icon: Network,
    title: 'Deep-Link Integration',
    desc: 'Custom API deep-linking support for seamless betslip transfer directly into sportsbook mobile apps.',
  },
];

export function PartnershipsPage() {
  return (
    <PageLayout
      title="Partner With OddsPlease"
      subtitle="Converting natural language bettor search intent into direct, high-value operator referrals across regulated US, UK, and European sports markets."
      badgeText="Operator & Commercial Partnerships"
    >
      {/* Value pillars */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {pillars.map((p) => (
          <div key={p.title} className="space-y-2 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-lg text-emerald-400">
              <p.icon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">{p.title}</h3>
            <p className="text-xs leading-relaxed text-zinc-400">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Contact card */}
      <div className="glow-emerald-card space-y-4 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-zinc-900 via-zinc-900 to-emerald-950/40 p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/20 text-lg font-bold text-emerald-400">
            %
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">List Your Sportsbook or Feed</h3>
            <p className="text-xs text-zinc-400">For operator listings, affiliate network integration, or media inquiries.</p>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-zinc-300">
          We work with licensed sportsbooks, media publishers, and affiliate networks globally. Reach out directly to our commercial partnerships team:
        </p>

        <div className="pt-2">
          <a
            href="mailto:partnerships@oddsplease.com"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-xs font-bold text-black shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 sm:text-sm"
          >
            <Handshake className="h-4 w-4" />
            <span>Contact Partnerships: partnerships@oddsplease.com</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </PageLayout>
  );
}
