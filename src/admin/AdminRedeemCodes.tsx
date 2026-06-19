import { useEffect, useState } from 'react';
import { redeemAPI } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import type { RedeemCode } from '../types';
import { Plus, Trash2, Copy, RefreshCw } from 'lucide-react';

export default function AdminRedeemCodes() {
  const { user } = useAuth();
  const [codes, setCodes] = useState<RedeemCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newRole, setNewRole] = useState('vip');
  const [maxUses, setMaxUses] = useState(10);

  const loadCodes = async () => {
    try {
      setLoading(true);
      const data = await redeemAPI.getAllCodes();
      setCodes(data);
    } catch (err) {
      console.error('Failed to load codes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCodes(); }, []);

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    setNewCode(result);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !user) return;
    await redeemAPI.generateCode(newCode.trim().toUpperCase(), newRole, maxUses, user.uid);
    setShowForm(false);
    setNewCode('');
    await loadCodes();
  };

  const handleDelete = async (codeId: string) => {
    if (!confirm('Delete this redeem code?')) return;
    await redeemAPI.deleteCode(codeId);
    setCodes(prev => prev.filter(c => c.id !== codeId));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-text-primary">Redeem Codes</h1>
        <div className="flex gap-2">
          <button onClick={loadCodes} className="p-2 rounded-lg hover:bg-dark-700/50 text-text-secondary transition-all">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => { setShowForm(!showForm); if (!showForm) generateCode(); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all"
          >
            <Plus className="w-4 h-4" />
            Generate
          </button>
        </div>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleCreate} className="glass-effect rounded-xl p-4 mb-6">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Generate New Code</h3>
          <div className="grid sm:grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-xs text-text-secondary mb-1">Code</label>
              <div className="flex gap-1">
                <input
                  type="text"
                  value={newCode}
                  onChange={e => setNewCode(e.target.value.toUpperCase())}
                  className="flex-1 bg-dark-700/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-text-primary font-mono uppercase focus:outline-none focus:border-primary/50"
                  required
                />
                <button type="button" onClick={generateCode} className="px-2 rounded-lg bg-dark-700/50 text-text-secondary hover:text-primary text-xs">
                  Random
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">Role</label>
              <select
                value={newRole}
                onChange={e => setNewRole(e.target.value)}
                className="w-full bg-dark-700/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary/50"
              >
                <option value="vip">VIP</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">Max Uses</label>
              <input
                type="number"
                value={maxUses}
                onChange={e => setMaxUses(Number(e.target.value))}
                min={1}
                max={999}
                className="w-full bg-dark-700/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all">
              Create Code
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg bg-dark-700/50 text-text-secondary text-sm hover:bg-dark-700 transition-all">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Codes list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-2">
          {codes.map(c => (
            <div key={c.id} className="glass-effect rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <code className="text-sm font-mono font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg">
                  {c.code}
                </code>
                <div className="text-xs text-text-secondary">
                  <span className={`px-2 py-0.5 rounded ${
                    c.role === 'admin' ? 'bg-red-500/10 text-red-400' : 'bg-purple-500/10 text-purple-400'
                  }`}>{c.role}</span>
                </div>
                <span className="text-xs text-text-secondary">
                  Used: {c.usedBy.length}/{c.maxUses}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => copyToClipboard(c.code)}
                  className="p-1.5 rounded-lg hover:bg-dark-700/50 text-text-secondary hover:text-primary transition-all"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-1.5 rounded-lg hover:bg-dark-700/50 text-text-secondary hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          {codes.length === 0 && (
            <div className="text-center py-8 text-text-secondary text-sm">No redeem codes yet</div>
          )}
        </div>
      )}
    </div>
  );
}
