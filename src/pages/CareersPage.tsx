import { Briefcase, Mail, ArrowRight, Filter, Users } from 'lucide-react';
import { PageLayout, InfoCard } from '@/components/PageLayout';

export function CareersPage() {
  return (
    <PageLayout
      title="Join Our Global Team"
      subtitle="We are building the next-generation natural language odds discovery engine for global sports betting markets."
      badgeText="Careers at OddsPlease"
    >
      {/* Filters */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:flex-row">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Filter className="h-4 w-4 text-emerald-500" />
          <span className="font-bold text-white">Filter Openings:</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-300 outline-none focus:border-emerald-500">
            <option>All Locations (London HQ, New York, Remote)</option>
            <option>London, UK (HQ)</option>
            <option>New York, USA</option>
            <option>Remote (Worldwide)</option>
          </select>
          <select className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-300 outline-none focus:border-emerald-500">
            <option>All Departments</option>
            <option>Engineering & AI</option>
            <option>Product & Data</option>
            <option>Commercial & Legal</option>
          </select>
        </div>
      </div>

      {/* Vacancy status */}
      <div className="glow-emerald-card space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-xl text-emerald-400">
          <Briefcase className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold tracking-[-0.02em] text-white">No Active Vacancies Currently Open</h3>
          <p className="mx-auto max-w-md text-xs leading-relaxed text-zinc-400">
            We are currently in a stealth growth phase and evaluating top-tier engineering and business talent for future expansion.
          </p>
        </div>
        <div className="pt-2">
          <a
            href="mailto:careers@oddsplease.com"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-xs font-bold text-black shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
          >
            <span>Send CV to careers@oddsplease.com</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Future talent */}
      <InfoCard>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Future Talent Pool</span>
          <span className="text-[10px] text-zinc-500">London / Remote</span>
        </div>
        <h4 className="mb-2 text-base font-bold tracking-[-0.02em] text-white">Full-Stack Engineers & LLM Search Specialists</h4>
        <p className="text-xs leading-relaxed text-zinc-400">
          If you specialize in high-throughput odds parsing, natural language intent routing, or sports betting technology architectures, we want to hear from you.
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
          <Users className="h-4 w-4 text-emerald-500" />
          <span>Reach out anytime — we review every CV personally.</span>
        </div>
      </InfoCard>
    </PageLayout>
  );
}
