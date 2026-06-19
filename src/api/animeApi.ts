import type {
  HomeResponse,
  AnimeDetailResponse,
  SearchResponse,
  GenresResponse,
  GenreAnimeResponse,
  VideoSourceResponse,
  EpisodeData,
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const USE_PROXY = import.meta.env.VITE_USE_PROXY === 'true';
const BASE = USE_PROXY ? '/api-proxy' : API_BASE;

async function fetchApi<T>(endpoint: string): Promise<T> {
  const url = `${BASE}${endpoint}`;
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText} for ${endpoint}`);
  }

  const data = await res.json();
  return data as T;
}

function extractVideoUrl(videoSource: VideoSourceResponse): string {
  const result = videoSource?.result || {};
  const r = result as Record<string, string | undefined>;
  // Try multiple possible field names the API might use
  return (
    r.url ||
    r.link ||
    r.source ||
    r.player ||
    r.embed ||
    r.file ||
    r.video ||
    r.hls ||
    r.mp4 ||
    ''
  );
}

export const animeApi = {
  getHome: (page = 1) =>
    fetchApi<HomeResponse>(`/?page=${page}`),

  search: (query: string) =>
    fetchApi<SearchResponse>(`/search/${encodeURIComponent(query)}`),

  getDetail: (slug: string) =>
    fetchApi<AnimeDetailResponse>(`/${encodeURIComponent(slug)}`),

  getGenres: () =>
    fetchApi<GenresResponse>('/genres'),

  getGenreAnime: (slug: string, page = 1) =>
    fetchApi<GenreAnimeResponse>(`/genre/${encodeURIComponent(slug)}?page=${page}`),

  getEpisode: (slug: string) =>
    fetchApi<{ result: EpisodeData; source: string }>(`/episode/${encodeURIComponent(slug)}`),

  getVideoSource: (slug: string) =>
    fetchApi<VideoSourceResponse>(`/video-source/${encodeURIComponent(slug)}`),

  getAnimeList: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetchApi<SearchResponse>(`/anime${query}`);
  },

  extractVideoUrl,
};
