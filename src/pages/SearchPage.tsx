import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { animeApi } from '../api/animeApi';
import type { AnimeCardData } from '../types';
import AnimeCard from '../components/AnimeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(query);
  const [results, setResults] = useState<AnimeCardData[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const doSearch = async (q: string) => {
    if (!q.trim()) return;
    try {
      setLoading(true);
      setError(null);
      const data = await animeApi.search(q);
      setResults(data.results || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      doSearch(query);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchParams({ q: inputValue.trim() });
    }
  };

  const clearSearch = () => {
    setInputValue('');
    setSearchParams({});
    setResults([]);
    setTotal(0);
  };

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Search Header */}
        <div className="mb-8">
          <form onSubmit={handleSubmit} className="relative max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search anime..."
                className="w-full pl-12 pr-12 py-3.5 bg-dark-700/50 border border-white/10 rounded-2xl text-text-primary placeholder-muted focus:outline-none focus:border-primary/50 focus:bg-dark-700 transition-all text-base"
                autoFocus
              />
              {inputValue && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-text-primary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Results */}
        {loading && <LoadingSpinner text="Searching..." size="lg" />}

        {error && <ErrorState message={error} onRetry={() => doSearch(query)} />}

        {!loading && !error && query && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Search className="w-16 h-16 text-muted mb-4" />
            <h3 className="text-text-primary font-semibold text-lg">No Results Found</h3>
            <p className="text-text-secondary text-sm mt-1">
              No anime found for "{query}"
            </p>
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <>
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-xl font-bold text-text-primary">
                Search Results
              </h2>
              <span className="text-sm text-muted">
                ({total} result{total !== 1 ? 's' : ''})
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {results.map((anime) => (
                <AnimeCard key={anime.slug} anime={anime} />
              ))}
            </div>
          </>
        )}

        {!query && !loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Search className="w-16 h-16 text-muted mb-4" />
            <h3 className="text-text-primary font-semibold text-lg">Search Anime</h3>
            <p className="text-text-secondary text-sm mt-1">
              Type in the search bar above to find your favorite anime
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
