// ===== ANIME API TYPES =====
export interface AnimeCardData {
  title: string;
  type: string;
  headline: string;
  thumbnail: string;
  slug: string;
  status?: string;
  eps?: number | null;
}

export interface HomeSection {
  section: string;
  cards: AnimeCardData[];
}

export interface HomeResponse {
  results: HomeSection[];
  page: number;
  total: number;
  source: string;
}

export interface EpisodeData {
  slug: string;
  subtitle: string;
  date: string;
  episode: string | null;
  thumbnail: string;
}

export interface AnimeDetail {
  name: string;
  thumbnail: string;
  genre: string[];
  rating: string;
  sinopsis: {
    paragraphs: string[];
    title: string;
  };
  episode: EpisodeData[];
  [key: string]: unknown;
}

export interface AnimeDetailResponse {
  result: AnimeDetail;
  source: string;
}

export interface SearchResponse {
  results: AnimeCardData[];
  query: string;
  total: number;
  source: string;
}

export interface GenresResponse {
  genres: string[];
  total: number;
}

export interface GenreAnimeResponse {
  results: AnimeCardData[];
  slug: string;
  page: number;
  total: number;
}

export interface VideoSourceResponse {
  result: {
    url?: string;
    link?: string;
    source?: string;
    player?: string;
    [key: string]: unknown;
  };
  source: string;
}

// ===== FIREBASE / APP TYPES =====
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'user' | 'admin' | 'vip' | 'moderator';
  photoURL: string;
  createdAt: number;
  redeemCodesUsed: string[];
}

export interface CommentData {
  id: string;
  animeSlug: string;
  episodeSlug: string;
  userId: string;
  userName: string;
  userPhoto: string;
  text: string;
  level: 'top' | 'global' | 'local';
  likes: number;
  replies: CommentData[];
  createdAt: number;
  parentId: string | null;
}

export interface RedeemCode {
  id: string;
  code: string;
  role: string;
  maxUses: number;
  usedBy: string[];
  createdBy: string;
  createdAt: number;
}

export interface AdPlacement {
  id: string;
  title: string;
  type: 'banner' | 'sidebar' | 'native' | 'popup';
  position: 'top' | 'bottom' | 'side-left' | 'side-right' | 'in-content';
  imageUrl: string;
  linkUrl: string;
  active: boolean;
  createdAt: number;
}

export interface WebsiteSettings {
  siteName: string;
  description: string;
  logoUrl: string;
  primaryColor: string;
  allowRegistration: boolean;
  defaultRole: string;
}
