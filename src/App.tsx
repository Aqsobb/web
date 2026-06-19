import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AnimeDetailPage from './pages/AnimeDetailPage';
import EpisodePage from './pages/EpisodePage';
import SearchPage from './pages/SearchPage';
import GenreBrowsePage from './pages/GenreBrowsePage';
import LoginPage from './pages/LoginPage';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminUsers from './admin/AdminUsers';
import AdminRedeemCodes from './admin/AdminRedeemCodes';
import AdminAds from './admin/AdminAds';
import AdminSettings from './admin/AdminSettings';
import { isDemoMode } from './lib/firebase';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gradient">404</h1>
        <p className="text-text-secondary mt-4">Page not found</p>
        <a
          href="/"
          className="inline-block mt-6 px-6 py-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all text-sm"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}

export default function App() {
  const isDemo = isDemoMode();

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          {/* Demo mode banner */}
          {isDemo && (
            <div className="fixed top-0 left-0 right-0 z-[60] bg-yellow-500/10 backdrop-blur-xl border-b border-yellow-500/20 text-center py-1.5">
              <p className="text-xs text-yellow-400">
                🔧 Demo Mode — Configure <code className="bg-dark-700 px-1 rounded">VITE_FIREBASE_*</code> env vars for persistent data
              </p>
            </div>
          )}

          <Navbar />
          <main className={`flex-1 ${isDemo ? 'pt-[72px]' : ''}`}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/anime" element={<SearchPage />} />
              <Route path="/anime/:slug" element={<AnimeDetailPage />} />
              <Route path="/watch/:slug" element={<EpisodePage />} />
              <Route path="/genres" element={<GenreBrowsePage />} />
              <Route path="/genre/:slug" element={<GenreBrowsePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<LoginPage />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="redeem" element={<AdminRedeemCodes />} />
                <Route path="ads" element={<AdminAds />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
