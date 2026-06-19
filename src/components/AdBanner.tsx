import { useEffect, useState } from 'react';
import { adsAPI } from '../lib/firebase';
import type { AdPlacement } from '../types';
import { X } from 'lucide-react';

interface Props {
  position: AdPlacement['position'];
  className?: string;
}

export default function AdBanner({ position, className = '' }: Props) {
  const [ads, setAds] = useState<AdPlacement[]>([]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    adsAPI.getAds(position).then(setAds).catch(() => {});
  }, [position]);

  if (ads.length === 0 || dismissed) return null;

  const ad = ads[0];
  const sizeClasses: Record<string, string> = {
    'top': 'w-full max-h-24',
    'bottom': 'w-full max-h-24',
    'side-left': 'w-48',
    'side-right': 'w-48',
    'in-content': 'w-full max-h-32',
  };

  return (
    <div className={`relative ${sizeClasses[position] || 'w-full'} ${className}`}>
      <a
        href={ad.linkUrl || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-xl overflow-hidden hover:opacity-90 transition-opacity border border-white/5"
      >
        <img
          src={ad.imageUrl}
          alt={ad.title}
          className="w-full h-full object-cover"
        />
      </a>
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-1 right-1 p-1 rounded-full bg-dark-900/60 backdrop-blur-sm text-text-secondary hover:text-text-primary transition-all"
      >
        <X className="w-3 h-3" />
      </button>
      <span className="absolute bottom-1 left-1 text-[9px] px-1.5 py-0.5 rounded bg-dark-900/60 text-muted uppercase tracking-wider">
        Ad
      </span>
    </div>
  );
}
