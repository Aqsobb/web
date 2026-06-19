import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, Film } from 'lucide-react';
import type { AnimeCardData } from '../types';

interface Props {
  anime: AnimeCardData;
  variant?: 'default' | 'compact';
}

export default function AnimeCard({ anime, variant = 'default' }: Props) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      to={`/anime/${anime.slug}`}
      className="group block card-hover"
    >
      <div className="relative overflow-hidden rounded-xl bg-dark-700">
        {/* Thumbnail */}
        <div className={`relative overflow-hidden ${variant === 'compact' ? 'aspect-[3/4]' : 'aspect-[2/3]'}`}>
          {imgError || !anime.thumbnail ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-dark-600 to-dark-700">
              <Film className="w-10 h-10 text-dark-500" />
            </div>
          ) : (
            <img
              src={anime.thumbnail}
              alt={anime.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Play button on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
            <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-lg shadow-primary/30">
              <Play className="w-6 h-6 text-white ml-0.5" />
            </div>
          </div>

          {/* Type badge */}
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-dark-900/80 backdrop-blur-sm text-[10px] font-semibold text-primary uppercase tracking-wider">
            {anime.type || 'Anime'}
          </div>

          {/* Status badge */}
          {anime.status && (
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-dark-900/80 backdrop-blur-sm text-[10px] font-medium text-text-secondary">
              {anime.status}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="text-sm font-semibold text-text-primary line-clamp-1 group-hover:text-primary transition-colors">
            {anime.title}
          </h3>
          <p className="text-xs text-text-secondary mt-1 line-clamp-1">
            {anime.headline}
          </p>
          {anime.eps !== null && anime.eps !== undefined && (
            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-muted">
              <Clock className="w-3 h-3" />
              <span>{anime.eps} eps</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
