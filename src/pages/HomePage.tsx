import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, Clock, List, Compass } from 'lucide-react';
import { animeApi } from '../api/animeApi';
import type { HomeSection as HomeSectionType } from '../types';
import AnimeCard from '../components/AnimeCard';
import HeroSection from '../components/HeroSection';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';

const sectionIcons: Record<string, React.ReactNode> = {
  'latest': <Clock className="w-5 h-5" />,
  'trending': <TrendingUp className="w-5 h-5" />,
  'ongoing': <Sparkles className="w-5 h-5" />,
  'popular': <TrendingUp className="w-5 h-5" />,
};

export default function HomePage() {
  const [sections, setSections] = useState<HomeSectionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHome = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await animeApi.getHome();
      setSections(data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load homepage');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHome();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading anime..." size="lg" />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorState message={error} onRetry={fetchHome} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection sections={sections} />

      {/* Quick genre navigation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 mb-12">
        <div className="glass-effect rounded-2xl p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Compass className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-text-primary">Quick Browse</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Action', 'Romance', 'Comedy', 'Fantasy', 'Horror', 'Slice of Life', 'School', 'Adventure', 'Drama', 'Sci-Fi'].map(
              (genre) => (
                <Link
                  key={genre}
                  to={`/genre/${genre.toLowerCase().replace(/\s+/g, '-')}`}
                  className="px-3 py-1.5 rounded-lg bg-dark-700/50 border border-white/5 text-xs font-medium text-text-secondary hover:text-primary hover:border-primary/30 hover:bg-dark-700/80 transition-all duration-200"
                >
                  {genre}
                </Link>
              )
            )}
            <Link
              to="/genres"
              className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs font-medium text-primary hover:bg-primary/20 transition-all"
            >
              View All
            </Link>
          </div>
        </div>
      </section>

      {/* Dynamic Sections */}
      {sections.map((section, idx) => (
        <section key={idx} className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                {sectionIcons[section.section?.toLowerCase()] || <List className="w-4 h-4 text-primary" />}
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-text-primary">
                {section.section || 'Anime'}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {section.cards?.slice(0, 12).map((anime) => (
              <AnimeCard key={anime.slug} anime={anime} />
            ))}
          </div>
        </section>
      ))}

      {/* Empty state */}
      {sections.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-dark-700 flex items-center justify-center mb-4">
            <List className="w-10 h-10 text-muted" />
          </div>
          <h3 className="text-text-primary font-semibold text-lg">No Content Available</h3>
          <p className="text-text-secondary text-sm mt-1">
            Make sure the API server is running
          </p>
        </div>
      )}
    </div>
  );
}
