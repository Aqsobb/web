import { Link } from 'react-router-dom';
import { Film, Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                <Film className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold">
                <span className="text-gradient">Ani</span>
                <span className="text-text-primary">Stream</span>
              </span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed max-w-sm">
              Free anime streaming platform. Watch the latest anime episodes with
              Indonesian subtitles. Powered by Anichin API.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">Navigation</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-text-secondary hover:text-primary transition-colors">Home</Link>
              <Link to="/genres" className="text-sm text-text-secondary hover:text-primary transition-colors">Genres</Link>
              <Link to="/anime" className="text-sm text-text-secondary hover:text-primary transition-colors">All Anime</Link>
            </div>
          </div>

          {/* Source */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">Source</h4>
            <div className="flex flex-col gap-2">
              <a
                href="https://github.com/asmindev/anichin-api"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Anichin API
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} AniStream. This site is for educational purposes only.
          </p>
          <p className="text-xs text-muted flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400" /> for anime fans
          </p>
        </div>
      </div>
    </footer>
  );
}
