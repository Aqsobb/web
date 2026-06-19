import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Compass, ChevronRight } from 'lucide-react';
import { animeApi } from '../api/animeApi';
import type { AnimeCardData } from '../types';
import AnimeCard from '../components/AnimeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';

export default function GenreBrowsePage() {
  const { slug } = useParams<{ slug: string }>();

  if (slug) {
    return <GenreDetail slug={slug} />;
  }

  return <GenreList />;
}

function GenreList() {
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGenres = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await animeApi.getGenres();
      setGenres(data.genres || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load genres');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  if (loading) return <LoadingSpinner text="Loading genres..." size="lg" />;
  if (error) return <ErrorState message={error} onRetry={fetchGenres} />;

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Compass className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Browse Genres</h1>
            <p className="text-text-secondary text-sm mt-0.5">
              Explore anime by genre
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {genres.map((genre) => {
            const genreSlug = genre.toLowerCase().replace(/\s+/g, '-');
            return (
              <Link
                key={genre}
                to={`/genre/${genreSlug}`}
                className="group glass-effect rounded-xl p-4 hover:bg-dark-700/60 hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
                    {genre}
                  </h3>
                  <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function GenreDetail({ slug }: { slug: string }) {
  const [animeList, setAnimeList] = useState<AnimeCardData[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGenre = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await animeApi.getGenreAnime(slug);
      setAnimeList(data.results || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load genre');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenre();
    window.scrollTo(0, 0);
  }, [slug]);

  const genreName = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-text-secondary mb-6">
          <Link to="/genres" className="hover:text-primary transition-colors">
            Genres
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-text-primary font-medium">{genreName}</span>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Compass className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary">{genreName}</h1>
            {total > 0 && (
              <p className="text-text-secondary text-sm mt-0.5">{total} titles</p>
            )}
          </div>
        </div>

        {loading && <LoadingSpinner text="Loading anime..." size="lg" />}
        {error && <ErrorState message={error} onRetry={fetchGenre} />}

        {!loading && !error && animeList.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Compass className="w-16 h-16 text-muted mb-4" />
            <h3 className="text-text-primary font-semibold text-lg">No Anime Found</h3>
            <p className="text-text-secondary text-sm mt-1">
              No anime in this genre yet
            </p>
          </div>
        )}

        {!loading && !error && animeList.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {animeList.map((anime) => (
              <AnimeCard key={anime.slug} anime={anime} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
