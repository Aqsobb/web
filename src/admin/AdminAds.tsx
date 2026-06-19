import { useEffect, useState } from 'react';
import { adsAPI } from '../lib/firebase';
import type { AdPlacement } from '../types';
import { Plus, Trash2, RefreshCw, Eye, EyeOff } from 'lucide-react';

export default function AdminAds() {
  const [ads, setAds] = useState<AdPlacement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', type: 'banner' as AdPlacement['type'],
    position: 'top' as AdPlacement['position'],
    imageUrl: '', linkUrl: '',
  });

  const loadAds = async () => {
    try {
      setLoading(true);
      const data = await adsAPI.getAllAds();
      setAds(data);
    } catch (err) {
      console.error('Failed to load ads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAds(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await adsAPI.addAd({ ...form, active: true });
    setShowForm(false);
    setForm({ title: '', type: 'banner', position: 'top', imageUrl: '', linkUrl: '' });
    await loadAds();
  };

  const handleToggle = async (ad: AdPlacement) => {
    await adsAPI.updateAd(ad.id, { active: !ad.active });
    setAds(prev => prev.map(a => a.id === ad.id ? { ...a, active: !a.active } : a));
  };

  const handleDelete = async (adId: string) => {
    if (!confirm('Delete this ad?')) return;
    await adsAPI.deleteAd(adId);
    setAds(prev => prev.filter(a => a.id !== adId));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-text-primary">Ads Management</h1>
        <div className="flex gap-2">
          <button onClick={loadAds} className="p-2 rounded-lg hover:bg-dark-700/50 text-text-secondary transition-all">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Ad
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="glass-effect rounded-xl p-4 mb-6 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-text-secondary mb-1">Title</label>
              <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                className="w-full bg-dark-700/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary/50" required />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-text-secondary mb-1">Type</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as any }))}
                  className="w-full bg-dark-700/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-text-primary">
                  <option value="banner">Banner</option>
                  <option value="sidebar">Sidebar</option>
                  <option value="native">Native</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-1">Position</label>
                <select value={form.position} onChange={e => setForm(p => ({ ...p, position: e.target.value as any }))}
                  className="w-full bg-dark-700/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-text-primary">
                  <option value="top">Top</option>
                  <option value="bottom">Bottom</option>
                  <option value="side-left">Side Left</option>
                  <option value="side-right">Side Right</option>
                  <option value="in-content">In Content</option>
                </select>
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-text-secondary mb-1">Image URL</label>
              <input type="url" value={form.imageUrl} onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))}
                className="w-full bg-dark-700/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary/50" required />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">Link URL</label>
              <input type="url" value={form.linkUrl} onChange={e => setForm(p => ({ ...p, linkUrl: e.target.value }))}
                className="w-full bg-dark-700/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary/50" required />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all">Add Ad</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg bg-dark-700/50 text-text-secondary text-sm hover:bg-dark-700 transition-all">Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-2">
          {ads.map(ad => (
            <div key={ad.id} className="glass-effect rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {ad.imageUrl && (
                  <img src={ad.imageUrl} alt={ad.title} className="w-16 h-10 rounded-lg object-cover bg-dark-700" />
                )}
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">{ad.title}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-dark-600 text-text-secondary uppercase">{ad.type}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-dark-600 text-text-secondary">{ad.position}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${ad.active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {ad.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => handleToggle(ad)} className="p-1.5 rounded-lg hover:bg-dark-700/50 text-text-secondary hover:text-primary transition-all">
                  {ad.active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => handleDelete(ad.id)} className="p-1.5 rounded-lg hover:bg-dark-700/50 text-text-secondary hover:text-red-400 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          {ads.length === 0 && (
            <div className="text-center py-8 text-text-secondary text-sm">No ads yet</div>
          )}
        </div>
      )}
    </div>
  );
}
