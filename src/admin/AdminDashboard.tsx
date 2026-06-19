import { useEffect, useState } from 'react';
import { Users, Ticket, Image, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI, redeemAPI, adsAPI } from '../lib/firebase';

export default function AdminDashboard() {
  const { user, isDemo } = useAuth();
  const [stats, setStats] = useState({ users: 0, codes: 0, ads: 0, activeAds: 0 });

  useEffect(() => {
    Promise.all([
      authAPI.getAllUsers(),
      redeemAPI.getAllCodes(),
      adsAPI.getAllAds(),
    ]).then(([users, codes, ads]) => {
      setStats({
        users: users.length,
        codes: codes.length,
        ads: ads.length,
        activeAds: ads.filter(a => a.active).length,
      });
    }).catch(() => {});
  }, []);

  const cards = [
    { label: 'Total Users', value: stats.users, icon: <Users className="w-5 h-5" />, color: 'from-blue-500 to-blue-600' },
    { label: 'Redeem Codes', value: stats.codes, icon: <Ticket className="w-5 h-5" />, color: 'from-green-500 to-green-600' },
    { label: 'Total Ads', value: stats.ads, icon: <Image className="w-5 h-5" />, color: 'from-purple-500 to-purple-600' },
    { label: 'Active Ads', value: stats.activeAds, icon: <Activity className="w-5 h-5" />, color: 'from-primary to-primary-dark' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary text-sm mt-0.5">
          Welcome back, {user?.displayName}
          {isDemo && <span className="ml-2 text-yellow-400">(Demo Mode)</span>}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(card => (
          <div key={card.label} className="glass-effect rounded-xl p-4">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
              {card.icon}
            </div>
            <p className="text-2xl font-bold text-text-primary">{card.value}</p>
            <p className="text-xs text-text-secondary mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="glass-effect rounded-xl p-5">
        <h2 className="font-semibold text-text-primary mb-3">Quick Actions</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <a href="/admin/users" className="p-3 rounded-xl bg-dark-700/30 border border-white/5 hover:bg-dark-700/50 transition-all text-sm text-text-secondary hover:text-text-primary">
            Manage Users
          </a>
          <a href="/admin/redeem" className="p-3 rounded-xl bg-dark-700/30 border border-white/5 hover:bg-dark-700/50 transition-all text-sm text-text-secondary hover:text-text-primary">
            Generate Codes
          </a>
          <a href="/admin/ads" className="p-3 rounded-xl bg-dark-700/30 border border-white/5 hover:bg-dark-700/50 transition-all text-sm text-text-secondary hover:text-text-primary">
            Manage Ads
          </a>
        </div>
      </div>

      {/* Info card */}
      <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10 text-sm text-text-secondary">
        <p className="font-medium text-text-primary mb-1">Admin Tips</p>
        <p>• Users can activate admin/vip roles via redeem codes</p>
        <p>• Ads support banner, sidebar, native, and popup types</p>
        <p>• Comments have 3 levels: Latest, Top (most liked), Global</p>
        {isDemo && <p className="text-yellow-400 mt-2">⚠️ Demo mode: configure Firebase VITE_ env vars for persistent data</p>}
      </div>
    </div>
  );
}
