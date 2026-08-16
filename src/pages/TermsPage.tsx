import { PageLayout, InfoCard } from '../components/PageLayout';
import { DIALECT } from '../constants';
import type { Region, Language } from '../constants';

interface TermsPageProps {
  region: Region;
  language: Language;
}

export function TermsPage({ region, language }: TermsPageProps) {
  const strings = DIALECT[region][language];
  return (
    <PageLayout title={strings.termsTitle} subtitle="The terms governing your use of OddsPlease across UK, US, and IT jurisdictions.">
      <InfoCard>
        <h2 className="mb-2 text-base font-bold tracking-[-0.02em] text-white">1. Independent Platform</h2>
        <p className="text-sm text-zinc-400">
          OddsPlease is an independent sports technology and odds comparison engine. OddsPlease does
          not accept or process direct monetary bets. All bets are placed directly on licensed
          operator portals. OddsPlease is not affiliated with, endorsed by, or sponsored by any
          operator.
        </p>
      </InfoCard>

      <InfoCard>
        <h2 className="mb-2 text-base font-bold tracking-[-0.02em] text-white">2. Odds Information & Price Movement</h2>
        <p className="text-sm text-zinc-400">
          Odds displayed on OddsPlease are fetched via live feeds for comparison purposes only. Odds
          fluctuate constantly and may change between analysis and operator portal transfer. Final
          odds confirmed on operator portals strictly govern your bet. OddsPlease does not guarantee
          the accuracy of odds data.
        </p>
      </InfoCard>

      <InfoCard>
        <h2 className="mb-2 text-base font-bold tracking-[-0.02em] text-white">3. Age Restriction</h2>
        <p className="text-sm text-zinc-400">
          OddsPlease is intended for users of legal gambling age only. UK: 18+. US: 21+ (18+ in DC,
          KY, WY, MT, NH, RI). IT: 18+. Underage gambling is a criminal offence.
        </p>
      </InfoCard>

      <InfoCard>
        <h2 className="mb-2 text-base font-bold tracking-[-0.02em] text-white">4. No Wager Processing</h2>
        <p className="text-sm text-zinc-400">
          OddsPlease does not process payments, deposits, or bets. When you transfer a slip to an
          operator, you are redirected to the operator's portal where you must manually review and
          confirm your bet. OddsPlease does not auto-execute bets.
        </p>
      </InfoCard>

      <InfoCard>
        <h2 className="mb-2 text-base font-bold tracking-[-0.02em] text-white">5. Operator Handoff Boundary</h2>
        <p className="text-sm text-zinc-400">
          When you transfer a slip to an operator, the operator's terms and privacy policy govern
          your activity from that point onward. OddsPlease is not responsible for operator portal
          functionality, odds changes, or bet outcomes.
        </p>
      </InfoCard>

      <InfoCard>
        <h2 className="mb-2 text-base font-bold tracking-[-0.02em] text-white">6. Responsible Gambling</h2>
        <p className="text-sm text-zinc-400">
          OddsPlease is committed to responsible gambling. We display regional compliance notices and
          provide links to support resources. If you or someone you know has a gambling problem,
          seek help immediately.
        </p>
      </InfoCard>

      <InfoCard>
        <h2 className="mb-2 text-base font-bold tracking-[-0.02em] text-white">7. Liability</h2>
        <p className="text-sm text-zinc-400">
          OddsPlease is not liable for any financial losses resulting from bets placed on operator
          portals. Users are solely responsible for their gambling activity.
        </p>
      </InfoCard>

      <InfoCard>
        <h2 className="mb-2 text-base font-bold tracking-[-0.02em] text-white">8. Jurisdictional Terms</h2>
        <p className="text-sm text-zinc-400">
          UK users: "offence", "licence", "bets/stakes" apply. US users: "offense", "license",
          "wagers" apply. IT users: Italian gaming regulations under ADM apply. All users must
          comply with their local jurisdiction's gambling laws.
        </p>
      </InfoCard>
    </PageLayout>
  );
}
