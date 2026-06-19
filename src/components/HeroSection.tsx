import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import type { AnimeCardData } from '../types';

interface Props {
  sections: {
    section: string;
    cards: AnimeCardData[];
  }[];
}

export default function HeroSection({ sections }: Props) {
  // Use first section's first card as hero
  const heroSection = sections.find((s) => s.cards.length > 0);
  const heroAnime = heroSection?.cards[0];
  const restCards = heroSection?.cards.slice(1, 5) || [];

  if (!heroAnime) return null;

  return (
    <section className="relative min-h-[80vh] flex items-end pb-8">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-dark-900" />
        {heroAnime.thumbnail && (
          <img
            src={heroAnime.thumbnail}
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 gradient-overlay" />
        <div className="absolute inset-0 gradient-overlay-right" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-5 gap-8 items-end">
          {/* Hero info */}
          <div className="md:col-span-3 space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
                {heroAnime.type}
              </span>
              {heroAnime.status && (
                <span className="px-3 py-1 rounded-full bg-white/5 text-text-secondary text-xs">
                  {heroAnime.status}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              {heroAnime.title}
            </h1>
            <p className="text-text-secondary text-base md:text-lg max-w-xl leading-relaxed">
              {heroAnime.headline}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Link
                to={`/anime/${heroAnime.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40"
              >
                <Play className="w-5 h-5" />
                Watch Now
              </Link>
              <Link
                to={`/anime/${heroAnime.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass-effect text-text-primary hover:bg-white/10 transition-all duration-300"
              >
                Details
              </Link>
            </div>
          </div>

          {/* Featured cards */}
          <div className="md:col-span-2 grid grid-cols-2 gap-3">
            {restCards.map((anime) => (
              <Link
                key={anime.slug}
                to={`/anime/${anime.slug}`}
                className="group relative aspect-[3/4] rounded-xl overflow-hidden card-hover"
              >
                <img
                  src={anime.thumbnail}
                  alt={anime.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center">
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="text-xs font-medium text-white line-clamp-1">
                    {anime.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
