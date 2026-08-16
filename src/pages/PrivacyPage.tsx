import { PageLayout, InfoCard } from '../components/PageLayout';
import { DIALECT } from '../constants';
import type { Region, Language } from '../constants';

interface PrivacyPageProps {
  region: Region;
  language: Language;
}

export function PrivacyPage({ region, language }: PrivacyPageProps) {
  const strings = DIALECT[region][language];
  return (
    <PageLayout title={strings.privacyTitle} subtitle="How OddsPlease handles your data across UK, US, and IT jurisdictions.">
      <InfoCard>
        <h2 className="mb-2 text-base font-bold tracking-[-0.02em] text-white">1. Data Collection</h2>
        <p className="text-sm text-zinc-400">
          OddsPlease collects the text of your predictions solely to match them against live sports
          events and odds. Prediction text is sent to our analysis service and is not stored on our
          servers. All odds data is fetched in real time from The Odds API and is not cached. We
          collect zero personally identifiable information (PII).
        </p>
      </InfoCard>

      <InfoCard>
        <h2 className="mb-2 text-base font-bold tracking-[-0.02em] text-white">2. Local Storage</h2>
        <p className="text-sm text-zinc-400">
          OddsPlease uses browser local storage (localStorage) solely for region, language, and odds
          format preferences. No prediction text, account data, or PII is stored in your browser.
        </p>
      </InfoCard>

      <InfoCard>
        <h2 className="mb-2 text-base font-bold tracking-[-0.02em] text-white">3. Cookies</h2>
        <p className="text-zinc-400 text-sm">
          OddsPlease uses essential cookies to remember your region selection (UK, US, IT) and odds
          format preference. We do not use advertising or tracking cookies.
        </p>
      </InfoCard>

      <InfoCard>
        <h2 className="mb-2 text-base font-bold tracking-[-0.02em] text-white">4. Independent Odds Comparison</h2>
        <p className="text-sm text-zinc-400">
          OddsPlease is an independent comparison interface and does not accept or process direct
          monetary bets. All bets are placed directly on licensed operator portals. We do not share
          your prediction data with operators.
        </p>
      </InfoCard>

      <InfoCard>
        <h2 className="mb-2 text-base font-bold tracking-[-0.02em] text-white">5. Real-Time Price Movement Disclaimer</h2>
        <p className="text-sm text-zinc-400">
          Odds displayed on OddsPlease are fetched via live feeds for comparison purposes only. Odds
          fluctuate constantly and may change between analysis and operator portal transfer. Final
          odds confirmed on operator portals strictly govern your bet.
        </p>
      </InfoCard>

      <InfoCard>
        <h2 className="mb-2 text-base font-bold tracking-[-0.02em] text-white">6. Operator Handoff Boundary</h2>
        <p className="text-sm text-zinc-400">
          When you transfer a slip to an operator, you are redirected to the operator's portal.
          From that point onward, the operator's privacy policy governs your activity. OddsPlease has
          no access to data you share with operators post-redirect.
        </p>
      </InfoCard>

      <InfoCard>
        <h2 className="mb-2 text-base font-bold tracking-[-0.02em] text-white">7. Jurisdictional Compliance</h2>
        <p className="text-sm text-zinc-400">
          OddsPlease complies with GDPR (UK/EU) and CCPA (US) data protection regulations. Italian
          users are additionally protected under ADM data handling requirements. No account
          registration is required to use OddsPlease.
        </p>
      </InfoCard>

      <InfoCard>
        <h2 className="mb-2 text-base font-bold tracking-[-0.02em] text-white">8. Contact</h2>
        <p className="text-sm text-zinc-400">
          For privacy enquiries, contact us at support@oddsplease.com.
        </p>
      </InfoCard>
    </PageLayout>
  );
}
