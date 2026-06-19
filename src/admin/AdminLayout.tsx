import { Link, useLocation, Outlet, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, Ticket, Image, Settings, LogOut, Shield, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, exact: true },
  { path: '/admin/users', label: 'Users', icon: <Users className="w-4 h-4" /> },
  { path: '/admin/redeem', label: 'Redeem Codes', icon: <Ticket className="w-4 h-4" /> },
  { path: '/admin/ads', label: 'Ads', icon: <Image className="w-4 h-4" /> },
  { path: '/admin/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
];

export default function AdminLayout() {
  const { user, loading, isAdmin, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen pt-16 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-dark-800/80 border-r border-white/5 hidden md:block flex-shrink-0">
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-text-primary">Admin Panel</span>
          </div>
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map(item => {
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-text-secondary hover:text-text-primary hover:bg-dark-700/50'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
          <div className="border-t border-white/5 my-2" />
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-dark-700/50 transition-all"
          >
            <Home className="w-4 h-4" />
            Back to Site
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 w-full transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-dark-800/95 backdrop-blur-xl border-t border-white/5">
        <div className="flex justify-around p-2">
          {navItems.slice(0, 4).map(item => {
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                  isActive ? 'text-primary' : 'text-text-secondary'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
        <Outlet />
      </main>
    </div>
  );
}
