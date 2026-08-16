import { Phone } from 'lucide-react';
import { PageLayout, InfoCard, ExternalLink } from '../components/PageLayout';
import { BLOCKING_TOOLS, UK_ACCOUNT_TOOLS, DIALECT } from '../constants';
import type { Region, Language } from '../constants';

interface SaferGamblingPageProps {
  region: Region;
  language: Language;
}

export function SaferGamblingPage({ region, language }: SaferGamblingPageProps) {
  const strings = DIALECT[region][language];
  return (
    <PageLayout
      title={strings.complianceTitle}
      subtitle="At OddsPlease, we are committed to providing a safe and responsible betting experience. Below you will find tools and resources to help you manage your play."
      badgeText="Safer Gambling Hub"
    >
      <InfoCard>
        <h2 className="mb-2 text-base font-bold tracking-[-0.02em] text-white">📊 GamCare Self-Assessment</h2>
        <p className="text-sm text-zinc-400">
          If you are concerned about your gambling habits, take the{' '}
          <ExternalLink href="https://www.gamcare.org.uk/self-assessment">
            GamCare self-assessment quiz
          </ExternalLink>{' '}
          to better understand your relationship with betting.
        </p>
      </InfoCard>

      <InfoCard>
        <h2 className="mb-2 text-base font-bold tracking-[-0.02em] text-white">🛑 GAMSTOP</h2>
        <p className="text-sm text-zinc-400">
          Registering with <ExternalLink href="https://www.gamstop.co.uk">GAMSTOP</ExternalLink> will
          prevent you from logging into or creating new accounts with all online gambling companies
          licensed in Great Britain. It is a free service.
        </p>
      </InfoCard>

      <InfoCard>
        <h2 className="mb-2 text-base font-bold tracking-[-0.02em] text-white">💬 BeGambleAware</h2>
        <p className="text-sm text-zinc-400">
          For free, confidential help and advice, visit{' '}
          <ExternalLink href="https://www.begambleaware.org">BeGambleAware</ExternalLink>.
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
        <h2 className="mb-3 text-base font-bold tracking-[-0.02em] text-white">🛡️ Account Protection & In-App Player Tools</h2>
        <div className="space-y-3">
          {UK_ACCOUNT_TOOLS.map((tool) => (
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
            <span className="font-semibold text-zinc-400">ℹ️ System Notice:</span> Safer gambling
            tools, available limit types, and account controls vary by individual licensed operator
            portal. Please verify active limits directly within your operator account settings.
          </p>
        </div>
      </InfoCard>

      <InfoCard>
        <h2 className="mb-3 text-base font-bold tracking-[-0.02em] text-white">💳 Debt Support</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-900/40 px-3 py-2">
            <div>
              <span className="text-sm font-semibold text-zinc-200">StepChange</span>
              <span className="ml-2 text-xs text-zinc-500">0800 138 1111</span>
            </div>
            <ExternalLink href="https://www.stepchange.org">Visit ↗</ExternalLink>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-900/40 px-3 py-2">
            <div>
              <span className="text-sm font-semibold text-zinc-200">National Debtline</span>
              <span className="ml-2 text-xs text-zinc-500">0808 808 4000</span>
            </div>
            <ExternalLink href="https://www.nationaldebtline.org">Visit ↗</ExternalLink>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-900/40 px-3 py-2">
            <div>
              <span className="text-sm font-semibold text-zinc-200">PayPlan</span>
              <span className="ml-2 text-xs text-zinc-500">0800 280 2816</span>
            </div>
            <ExternalLink href="https://www.payplan.com">Visit ↗</ExternalLink>
          </div>
        </div>
      </InfoCard>

      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20">
            <Phone className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">GamCare National Gambling Helpline</p>
            <p className="text-lg font-medium text-zinc-400">Call free on 0808 8020 133</p>
            <p className="text-xs text-zinc-400">Available 24/7</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
