import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Star, List, AlertCircle } from 'lucide-react';
import { animeApi } from '../api/animeApi';
import type { AnimeDetail } from '../types';
import EpisodeCard from '../components/EpisodeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import CommentSection from '../components/comments/CommentSection';
import AdBanner from '../components/AdBanner';

export default function AnimeDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [detail, setDetail] = useState<AnimeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = async () => {
    if (!slug) return;
    try {
      setLoading(true);
      setError(null);
      const data = await animeApi.getDetail(slug);
      setDetail(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load anime details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) return <LoadingSpinner text="Loading anime details..." size="lg" />;
  if (error) return <ErrorState message={error} onRetry={fetchDetail} />;
  if (!detail) return <ErrorState message="Anime not found" />;

  const infoKeys = Object.keys(detail).filter(
    (k) => !['name', 'thumbnail', 'genre', 'rating', 'sinopsis', 'episode'].includes(k)
  );

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[50vh] md:h-[60vh]">
        <div className="absolute inset-0 bg-dark-900" />
        {detail.thumbnail && (
          <img
            src={detail.thumbnail}
            alt={detail.name}
            className="w-full h-full object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-40 relative z-10">
        <div className="grid md:grid-cols-[300px_1fr] gap-8">
          {/* Sidebar */}
          <div className="space-y-4">
            {/* Cover */}
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
              <img
                src={detail.thumbnail}
                alt={detail.name}
                className="w-full aspect-[3/4] object-cover"
              />
            </div>

            {/* Quick actions */}
            {detail.episode && detail.episode.length > 0 && (
              <Link
                to={`/watch/${detail.episode[0].slug}`}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold transition-all duration-300 shadow-lg shadow-primary/25"
              >
                <Play className="w-5 h-5" />
                Watch Episode 1
              </Link>
            )}

            {/* Metadata */}
            <div className="glass-effect rounded-xl p-4 space-y-3">
              {detail.rating && (
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-text-primary font-medium">{detail.rating}</span>
                </div>
              )}
              {infoKeys.map((key) => {
                const val = detail[key];
                if (!val || (Array.isArray(val) && val.length === 0)) return null;
                return (
                  <div key={key} className="flex items-start gap-2 text-sm">
                    <span className="text-muted capitalize min-w-[80px]">{key.replace(/_/g, ' ')}:</span>
                    <span className="text-text-secondary">
                      {Array.isArray(val) ? val.join(', ') : String(val)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Genres */}
            {detail.genre && detail.genre.length > 0 && (
              <div className="glass-effect rounded-xl p-4">
                <h3 className="text-sm font-semibold text-text-primary mb-3">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {detail.genre.map((g) => (
                    <Link
                      key={g}
                      to={`/genre/${g.toLowerCase().replace(/\s+/g, '-')}`}
                      className="px-3 py-1 rounded-lg bg-dark-700/50 border border-white/5 text-xs text-text-secondary hover:text-primary hover:border-primary/30 transition-all"
                    >
                      {g}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Title and info */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
                {detail.name}
              </h1>
              {detail.sinopsis?.title && (
                <h2 className="text-text-secondary text-base mt-1">{detail.sinopsis.title}</h2>
              )}
            </div>

            {/* Synopsis */}
            {detail.sinopsis?.paragraphs && detail.sinopsis.paragraphs.length > 0 && (
              <div className="glass-effect rounded-xl p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-3">Synopsis</h3>
                <div className="space-y-2">
                  {detail.sinopsis.paragraphs.map((p, i) => (
                    <p key={i} className="text-text-secondary text-sm leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Ads */}
            <AdBanner position="in-content" />

            {/* Comments */}
            <CommentSection animeSlug={slug || ''} />

            {/* Episodes */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <List className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-text-primary">
                  Episodes {detail.episode ? `(${detail.episode.length})` : ''}
                </h2>
              </div>

              {detail.episode && detail.episode.length > 0 ? (
                <div className="space-y-2">
                  {detail.episode.map((ep) => (
                    <EpisodeCard key={ep.slug} episode={ep} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 glass-effect rounded-xl">
                  <AlertCircle className="w-8 h-8 text-muted mb-2" />
                  <p className="text-text-secondary text-sm">No episodes available yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
