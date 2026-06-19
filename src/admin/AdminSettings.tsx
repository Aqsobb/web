import { useEffect, useState } from 'react';
import { settingsAPI, isDemoMode } from '../lib/firebase';
import type { WebsiteSettings } from '../types';
import { Save } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState<WebsiteSettings>({
    siteName: 'AniStream',
    description: 'Free Anime Streaming',
    logoUrl: '',
    primaryColor: '#ff6b35',
    allowRegistration: true,
    defaultRole: 'user',
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const isDemo = isDemoMode();

  useEffect(() => {
    settingsAPI.getSettings().then(data => {
      setSettings(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await settingsAPI.updateSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-text-primary mb-6">Website Settings</h1>

      <form onSubmit={handleSave} className="glass-effect rounded-xl p-6 space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm text-text-secondary mb-1">Site Name</label>
          <input type="text" value={settings.siteName} onChange={e => setSettings(p => ({ ...p, siteName: e.target.value }))}
            className="w-full bg-dark-700/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary/50" />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1">Description</label>
          <textarea value={settings.description} onChange={e => setSettings(p => ({ ...p, description: e.target.value }))} rows={2}
            className="w-full bg-dark-700/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary/50" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-text-secondary mb-1">Logo URL</label>
            <input type="url" value={settings.logoUrl} onChange={e => setSettings(p => ({ ...p, logoUrl: e.target.value }))}
              className="w-full bg-dark-700/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary/50" />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Primary Color</label>
            <div className="flex gap-2">
              <input type="color" value={settings.primaryColor} onChange={e => setSettings(p => ({ ...p, primaryColor: e.target.value }))}
                className="w-10 h-10 rounded-lg bg-dark-700 border border-white/5 cursor-pointer" />
              <input type="text" value={settings.primaryColor} onChange={e => setSettings(p => ({ ...p, primaryColor: e.target.value }))}
                className="flex-1 bg-dark-700/50 border border-white/5 rounded-xl px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-primary/50" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-text-secondary mb-1">Default Role</label>
            <select value={settings.defaultRole} onChange={e => setSettings(p => ({ ...p, defaultRole: e.target.value }))}
              className="w-full bg-dark-700/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-text-primary">
              <option value="user">User</option>
              <option value="vip">VIP</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={settings.allowRegistration}
                onChange={e => setSettings(p => ({ ...p, allowRegistration: e.target.checked }))}
                className="w-4 h-4 rounded border-white/5 bg-dark-700 text-primary focus:ring-primary" />
              <span className="text-sm text-text-secondary">Allow Registration</span>
            </label>
          </div>
        </div>

        {isDemo && (
          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs">
            🔧 Demo Mode: Settings are stored in memory. Configure Firebase to persist.
          </div>
        )}

        <button type="submit" className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-medium transition-all">
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
