import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import type { EpisodeData } from '../types';

interface Props {
  episode: EpisodeData;
}

export default function EpisodeCard({ episode }: Props) {
  const episodeNum = episode.episode || episode.subtitle || 'Special';
  const targetSlug = episode.slug;

  return (
    <Link
      to={`/watch/${targetSlug}`}
      className="group flex gap-3 p-3 rounded-xl bg-dark-700/30 border border-white/5 hover:bg-dark-700/60 hover:border-primary/20 transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className="relative w-28 md:w-40 aspect-video rounded-lg overflow-hidden flex-shrink-0 bg-dark-600">
        {episode.thumbnail ? (
          <img
            src={episode.thumbnail}
            alt={episode.subtitle}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Play className="w-8 h-8 text-muted" />
          </div>
        )}
        {/* Play overlay */}
        <div className="absolute inset-0 bg-dark-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center">
            <Play className="w-5 h-5 text-white ml-0.5" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors line-clamp-1">
          Episode {episodeNum}
        </h4>
        <p className="text-xs text-text-secondary mt-1 line-clamp-2">
          {episode.subtitle}
        </p>
        {episode.date && (
          <p className="text-[11px] text-muted mt-2">
            {new Date(episode.date).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        )}
      </div>

      {/* Arrow */}
      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <Play className="w-4 h-4 text-primary" />
      </div>
    </Link>
  );
}
