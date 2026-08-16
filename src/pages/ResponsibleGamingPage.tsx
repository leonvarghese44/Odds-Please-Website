import { Phone } from 'lucide-react';
import { PageLayout, InfoCard, ExternalLink } from '../components/PageLayout';
import { BLOCKING_TOOLS, US_ACCOUNT_TOOLS, DIALECT } from '../constants';
import { StateVepSelector } from '../components/StateVepSelector';
import type { Region, Language } from '../constants';

interface ResponsibleGamingPageProps {
  region: Region;
  language: Language;
}

export function ResponsibleGamingPage({ region, language }: ResponsibleGamingPageProps) {
  const strings = DIALECT[region][language];
  return (
    <PageLayout
      title={strings.complianceTitle}
      subtitle="OddsPlease promotes safe and responsible gaming. If you or someone you know has a gambling problem, help is available 24/7."
      badgeText="Responsible Gaming Hub"
    >
      <InfoCard>
        <h2 className="mb-2 text-base font-bold tracking-[-0.02em] text-white">National Council on Problem Gambling</h2>
        <p className="text-sm text-zinc-400">
          The National Council on Problem Gambling operates the National Problem Gambling Helpline
          Network. It is completely confidential and free. Visit{' '}
          <ExternalLink href="https://www.ncpgambling.org">NCPG</ExternalLink> or{' '}
          <ExternalLink href="https://www.1800gambler.net">1-800-GAMBLER</ExternalLink>.
        </p>
      </InfoCard>

      <InfoCard>
        <h2 className="mb-3 text-base font-bold tracking-[-0.02em] text-white">📱 Device Blocking Software</h2>
        <div className="space-y-2">
          {BLOCKING_TOOLS.map((tool) => (
            <div key={tool.name} className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-900/40 px-3 py-2">
              <div>
                <span className="text-sm font-semibold text-zinc-200">{tool.name}</span>
                <span className="ml-2 text-xs text-zinc-500">{tool.type}</span>
              </div>
              <ExternalLink href={tool.url}>Visit ↗</ExternalLink>
            </div>
          ))}
        </div>
      </InfoCard>

      <InfoCard>
        <h2 className="mb-3 text-base font-bold tracking-[-0.02em] text-white">🛡️ In-App Player Tools</h2>
        <div className="space-y-3">
          {US_ACCOUNT_TOOLS.map((tool) => (
            <div key={tool.name} className="flex items-start gap-3">
              <span className="text-lg">{tool.icon}</span>
              <div>
                <p className="text-sm font-semibold text-zinc-200">{tool.name}</p>
                <p className="text-xs text-zinc-400">{tool.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-lg border border-zinc-700 bg-zinc-900/40 px-3 py-2.5">
          <p className="text-xs text-zinc-500">
            <span className="font-semibold text-zinc-400">ℹ️ System Notice:</span> Available
            tools and account controls vary by US operator and state. Please verify active limits
            directly within your operator account settings.
          </p>
        </div>
      </InfoCard>

      <InfoCard>
        <h2 className="mb-3 text-base font-bold tracking-[-0.02em] text-white">🏛️ State Voluntary Exclusion Program (VEP)</h2>
        <p className="mb-3 text-sm text-zinc-400">
          Select your state to access the official gaming board self-exclusion portal.
        </p>
        <StateVepSelector />
      </InfoCard>

      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20">
            <Phone className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">National Problem Gambling Helpline</p>
            <p className="text-lg font-medium text-zinc-400">Call or text 1-800-GAMBLER (1-800-426-2537)</p>
            <p className="text-xs text-zinc-400">Confidential & free · 24/7</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
