import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  badgeText?: string;
  children: ReactNode;
}

export function PageLayout({ title, subtitle, badgeText = 'Compliance & Player Protection', children }: PageLayoutProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 transition hover:text-emerald-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to OddsPlease
      </Link>

      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">{badgeText}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-zinc-400">{subtitle}</p>}
      </div>

      <div className="space-y-4">{children}</div>
    </div>
  );
}

export function InfoCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6">
      {children}
    </div>
  );
}

export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold text-emerald-400 underline decoration-emerald-400/30 underline-offset-2 transition hover:text-emerald-300"
    >
      {children}
    </a>
  );
}
