import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Film, LogIn, User, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setIsSearchOpen(false);
    setShowUserMenu(false);
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-dark-900/95 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/20'
        : 'bg-dark-900/80 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-gradient">Ani</span>
              <span className="text-text-primary">Stream</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Home</Link>
            <Link to="/genres" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Genres</Link>
            <Link to="/search" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">All Anime</Link>

            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search anime..." className="w-48 pl-10 pr-4 py-2 bg-dark-700/50 border border-white/5 rounded-full text-sm text-text-primary placeholder-muted focus:outline-none focus:border-primary/50 focus:bg-dark-700 transition-all" />
            </form>

            {/* Auth */}
            {user ? (
              <div className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-dark-700/50 transition-all">
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-primary">{user.displayName?.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="text-sm text-text-secondary">{user.displayName}</span>
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 glass-effect rounded-xl p-2 shadow-2xl z-20">
                      {isAdmin && (
                        <Link to="/admin" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-dark-700/50 transition-all">
                          <Shield className="w-4 h-4" /> Admin Panel
                        </Link>
                      )}
                      <button onClick={logout} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 w-full transition-all">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary transition-colors">
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile buttons */}
          <div className="flex items-center gap-2 md:hidden">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 text-text-secondary hover:text-text-primary transition-colors">
              <Search className="w-5 h-5" />
            </button>
            {user ? (
              <Link to={isAdmin ? '/admin' : '/login'} className="p-2 text-text-secondary hover:text-text-primary transition-colors">
                {isAdmin ? <Shield className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </Link>
            ) : (
              <Link to="/login" className="p-2 text-text-secondary hover:text-text-primary transition-colors">
                <LogIn className="w-5 h-5" />
              </Link>
            )}
            <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 text-text-secondary hover:text-text-primary transition-colors">
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {isSearchOpen && (
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search anime..." className="w-full pl-10 pr-4 py-2.5 bg-dark-700/50 border border-white/5 rounded-xl text-sm text-text-primary placeholder-muted focus:outline-none focus:border-primary/50 transition-all" autoFocus />
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {isMobileOpen && (
          <div className="md:hidden pb-4 border-t border-white/5 pt-4">
            <div className="flex flex-col gap-1">
              <Link to="/" className="px-4 py-2.5 text-text-secondary hover:text-text-primary hover:bg-dark-700/50 rounded-lg transition-all">Home</Link>
              <Link to="/genres" className="px-4 py-2.5 text-text-secondary hover:text-text-primary hover:bg-dark-700/50 rounded-lg transition-all">Genres</Link>
              <Link to="/search" className="px-4 py-2.5 text-text-secondary hover:text-text-primary hover:bg-dark-700/50 rounded-lg transition-all">All Anime</Link>
              {user && isAdmin && (
                <Link to="/admin" className="px-4 py-2.5 text-primary hover:bg-primary/10 rounded-lg transition-all font-medium">Admin Panel</Link>
              )}
              {user ? (
                <button onClick={logout} className="px-4 py-2.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-all text-left">
                  Logout ({user.displayName})
                </button>
              ) : (
                <Link to="/login" className="px-4 py-2.5 text-primary hover:bg-primary/10 rounded-lg transition-all">Login</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
