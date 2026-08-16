import { Info } from 'lucide-react';
import { useState } from 'react';
import { Modal } from './Modal';
import { FLUTTER_FEATURES } from '../constants';
import type { Region } from '../constants';

interface FeatureBadgeProps {
  featureKey: string;
  region: Region;
}

export function FeatureBadge({ featureKey, region }: FeatureBadgeProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const feature = FLUTTER_FEATURES[featureKey];
  if (!feature) return null;
  if (!feature.regions.includes(region)) return null;

  const badgeText = feature.badge[region];

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setModalOpen(true);
        }}
        className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 transition-all hover:bg-emerald-500/20"
      >
        <span>{feature.emoji}</span>
        <span>{badgeText}</span>
        <Info className="h-3 w-3 opacity-60" />
      </button>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={feature.modalTitle}>
        <p className="text-sm text-zinc-300">{feature.modalText}</p>
        <p className="mt-3 text-xs text-zinc-500">
          Available on: {feature.operators.map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(', ')}
        </p>
      </Modal>
    </>
  );
}
