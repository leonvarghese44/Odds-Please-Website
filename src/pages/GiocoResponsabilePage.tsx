import { Phone } from 'lucide-react';
import { PageLayout, InfoCard, ExternalLink } from '../components/PageLayout';
import { BLOCKING_TOOLS, IT_ACCOUNT_TOOLS, DIALECT } from '../constants';
import type { Region, Language } from '../constants';

interface GiocoResponsabilePageProps {
  region: Region;
  language: Language;
}

export function GiocoResponsabilePage({ region, language }: GiocoResponsabilePageProps) {
  const strings = DIALECT[region][language];
  return (
    <PageLayout
      title={strings.complianceTitle}
      subtitle="Risorse e strumenti per un gioco sicuro e responsabile."
      badgeText="Gioco Responsabile Hub"
    >
      <InfoCard>
        <h2 className="mb-3 text-base font-bold tracking-[-0.02em] text-white">Mandato ADM & Probabilità di Vincita</h2>
        <p className="mb-3 text-sm text-zinc-400">
          Il gioco d'azzardo può causare dipendenza patologica. Gioca con moderazione.
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-900/40 px-3 py-2">
            <span className="text-sm font-semibold text-zinc-200">ADM Portale Principale</span>
            <ExternalLink href="https://www.adm.gov.it">Visita ↗</ExternalLink>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-900/40 px-3 py-2">
            <span className="text-sm font-semibold text-zinc-200">Probabilità di Vincita Ufficiali</span>
            <ExternalLink href="https://www.adm.gov.it/portale/giochi/probabilita-di-vincita">Visita ↗</ExternalLink>
          </div>
        </div>
      </InfoCard>

      <InfoCard>
        <h2 className="mb-2 text-base font-bold tracking-[-0.02em] text-white">Registro Unico delle Autoesclusioni (RUA)</h2>
        <p className="text-sm text-zinc-400">
          Il Registro Unico delle Autoesclusioni (RUA) ti permette di escluderti dal gioco a distanza
          in Italia. L'accesso richiede autenticazione tramite SPID o CIE.{' '}
          <ExternalLink href="https://www.adm.gov.it/portale/autoesclusione-dal-gioco-a-distanza-giochi">
            Accedi al RUA ↗
          </ExternalLink>
        </p>
      </InfoCard>

      <InfoCard>
        <h2 className="mb-3 text-base font-bold tracking-[-0.02em] text-white">📱 Software di Blocco Dispositivi</h2>
        <div className="space-y-2">
          {BLOCKING_TOOLS.map((tool) => (
            <div key={tool.name} className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-900/40 px-3 py-2">
              <div>
                <span className="text-sm font-semibold text-zinc-200">{tool.name}</span>
                <span className="ml-2 text-xs text-zinc-500">{tool.type}</span>
              </div>
              <ExternalLink href={tool.url}>Visita ↗</ExternalLink>
            </div>
          ))}
        </div>
      </InfoCard>

      <InfoCard>
        <h2 className="mb-3 text-base font-bold tracking-[-0.02em] text-white">🛡️ Strumenti di Tutela del Giocatore sui Portali ADM</h2>
        <div className="space-y-3">
          {IT_ACCOUNT_TOOLS.map((tool) => (
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
            <span className="font-semibold text-zinc-400">Avviso di Sistema:</span> Gli strumenti
            di tutela e i limiti disponibili variano per singolo concessionario ADM. Verifica i
            limiti attivi direttamente nelle impostazioni del tuo conto di gioco.
          </p>
        </div>
      </InfoCard>

      <InfoCard>
        <h2 className="mb-3 text-base font-bold tracking-[-0.02em] text-white">Supporto e Assistenza</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-900/40 px-3 py-2">
            <div>
              <span className="text-sm font-semibold text-zinc-200">GiocaResponsabile</span>
              <span className="ml-2 text-xs text-zinc-500">800 921121</span>
            </div>
            <ExternalLink href="https://www.giocaresponsabile.it">Visita ↗</ExternalLink>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-900/40 px-3 py-2">
            <div>
              <span className="text-sm font-semibold text-zinc-200">Servizi SerD ASL</span>
              <span className="ml-2 text-xs text-zinc-500">Servizi territoriali</span>
            </div>
          </div>
        </div>
      </InfoCard>

      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20">
            <Phone className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Telefono Verde Nazionale (TVNGA)</p>
            <p className="text-lg font-medium text-zinc-400">Chiama gratuitamente l'800 558822</p>
            <p className="text-xs text-zinc-400">Servizio anonimo e gratuito</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
