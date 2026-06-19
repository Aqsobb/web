import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Film, AlertCircle } from 'lucide-react';
import { animeApi } from '../api/animeApi';
import type { EpisodeData, VideoSourceResponse } from '../types';
import VideoPlayer from '../components/VideoPlayer';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import CommentSection from '../components/comments/CommentSection';
import AdBanner from '../components/AdBanner';

export default function EpisodePage() {
  const { slug } = useParams<{ slug: string }>();
  const [episode, setEpisode] = useState<EpisodeData | null>(null);
  const [videoSource, setVideoSource] = useState<VideoSourceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEpisode = async () => {
    if (!slug) return;
    try {
      setLoading(true);
      setError(null);
      const [epData, vidData] = await Promise.all([
        animeApi.getEpisode(slug),
        animeApi.getVideoSource(slug),
      ]);
      setEpisode(epData.result);
      setVideoSource(vidData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load episode');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEpisode();
    window.scrollTo(0, 0);
  }, [slug]);

  const videoUrl = videoSource ? animeApi.extractVideoUrl(videoSource) : '';

  // Try to derive anime slug from episode slug using common patterns
  const deriveAnimeSlug = (episodeSlug: string): string | null => {
    // Common patterns: anime-slug-episode-1, anime-slug-eps-1, anime_slug_1
    const patterns = [
      /^(.*?)-episode-\d+$/i,
      /^(.*?)-eps-\d+$/i,
      /^(.*?)-ep-\d+$/i,
      /^(.*?)-\d+$/,
    ];
    for (const pattern of patterns) {
      const match = episodeSlug.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const animeSlug = slug ? deriveAnimeSlug(slug) : null;

  if (loading) return <LoadingSpinner text="Loading episode..." size="lg" />;
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorState message={error} onRetry={fetchEpisode} />
      </div>
    );

  const episodeNum = episode?.episode || episode?.subtitle || 'Unknown';

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Back navigation */}
        <div className="mb-6">
          {animeSlug ? (
            <Link
              to={`/anime/${animeSlug}`}
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Anime
            </Link>
          ) : (
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Home
            </Link>
          )}
        </div>

        <div className="grid lg:grid-cols-[1fr_350px] gap-8">
          {/* Video Player */}
          <div>
            <VideoPlayer url={videoUrl} title={`Episode ${episodeNum}`} />

            {/* Episode info */}
            <div className="mt-6 glass-effect rounded-xl p-5">
              <h1 className="text-xl font-bold text-text-primary">
                Episode {episodeNum}
              </h1>
              {episode?.subtitle && (
                <p className="text-text-secondary text-sm mt-1">{episode.subtitle}</p>
              )}
              {episode?.date && (
                <p className="text-muted text-xs mt-2">
                  Released: {new Date(episode.date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              )}
            </div>

            {/* Video source info */}
            {videoSource?.result?.source && (
              <div className="mt-3 glass-effect rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Film className="w-4 h-4 text-muted" />
                  <span>Source: </span>
                  <span className="text-primary">{videoSource.result.source}</span>
                </div>
              </div>
            )}

            {/* No video url message */}
            {!videoUrl && (
              <div className="mt-6 flex flex-col items-center justify-center py-12 glass-effect rounded-xl">
                <AlertCircle className="w-12 h-12 text-muted mb-3" />
                <h3 className="text-text-primary font-semibold">No Video Available</h3>
                <p className="text-text-secondary text-sm mt-1 text-center max-w-md">
                  The video source for this episode could not be loaded. This could be due to region restrictions or the source being unavailable.
                </p>
              </div>
            )}
          </div>

          {/* Comments Section (mobile) */}
          <div className="lg:hidden">
            <AdBanner position="in-content" />
            {animeSlug && (
              <div className="mt-4">
                <CommentSection animeSlug={animeSlug} episodeSlug={slug} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="glass-effect rounded-xl p-4">
              <h3 className="text-sm font-semibold text-text-primary mb-3">Episode Info</h3>
              <div className="space-y-2 text-sm">
                {episode?.episode && (
                  <div className="flex justify-between">
                    <span className="text-muted">Episode</span>
                    <span className="text-text-secondary">{episode.episode}</span>
                  </div>
                )}
                {episode?.date && (
                  <div className="flex justify-between">
                    <span className="text-muted">Release</span>
                    <span className="text-text-secondary">
                      {new Date(episode.date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                )}
                {episode?.subtitle && (
                  <div className="flex justify-between">
                    <span className="text-muted">Title</span>
                    <span className="text-text-secondary text-right max-w-[200px]">
                      {episode.subtitle}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Direct link */}
            {videoUrl && (
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-dark-700/50 border border-white/10 text-text-secondary hover:text-text-primary hover:border-white/20 transition-all text-sm"
              >
                Open Video Direct Link
              </a>
            )}
          </div>
        </div>

        {/* Comments Section (desktop) */}
        <div className="hidden lg:block mt-8">
          <AdBanner position="bottom" />
          {animeSlug && (
            <div className="mt-4">
              <CommentSection animeSlug={animeSlug} episodeSlug={slug} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
