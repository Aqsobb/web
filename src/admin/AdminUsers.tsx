import { useEffect, useState } from 'react';
import { authAPI } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import type { UserProfile } from '../types';
import { Search, Trash2, UserCog, RefreshCw } from 'lucide-react';

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<UserProfile['role']>('user');

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await authAPI.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleRoleChange = async (uid: string) => {
    await authAPI.updateUserRole(uid, newRole);
    setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role: newRole } : u));
    setEditingRole(null);
  };

  const handleDelete = async (uid: string) => {
    if (!confirm('Delete this user?')) return;
    await authAPI.deleteUser(uid);
    setUsers(prev => prev.filter(u => u.uid !== uid));
  };

  const filtered = users.filter(u =>
    u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const roleColors: Record<string, string> = {
    admin: 'bg-red-500/10 text-red-400',
    vip: 'bg-purple-500/10 text-purple-400',
    moderator: 'bg-blue-500/10 text-blue-400',
    user: 'bg-dark-500/50 text-text-secondary',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-text-primary">Users</h1>
        <button onClick={loadUsers} className="p-2 rounded-lg hover:bg-dark-700/50 text-text-secondary transition-all">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-10 pr-4 py-2.5 bg-dark-700/50 border border-white/5 rounded-xl text-sm text-text-primary focus:outline-none focus:border-primary/50 transition-all"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="glass-effect rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left p-3 text-text-secondary font-medium">User</th>
                  <th className="text-left p-3 text-text-secondary font-medium">Email</th>
                  <th className="text-left p-3 text-text-secondary font-medium">Role</th>
                  <th className="text-left p-3 text-text-secondary font-medium">Joined</th>
                  <th className="text-right p-3 text-text-secondary font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.uid} className="border-b border-white/5 hover:bg-dark-700/30 transition-all">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-primary">
                            {u.displayName?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-text-primary font-medium">{u.displayName}</span>
                      </div>
                    </td>
                    <td className="p-3 text-text-secondary">{u.email}</td>
                    <td className="p-3">
                      {editingRole === u.uid ? (
                        <div className="flex gap-1">
                          <select
                            value={newRole}
                            onChange={e => setNewRole(e.target.value as UserProfile['role'])}
                            className="bg-dark-700 border border-white/5 rounded px-2 py-1 text-xs text-text-primary"
                          >
                            <option value="user">User</option>
                            <option value="vip">VIP</option>
                            <option value="moderator">Mod</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button
                            onClick={() => handleRoleChange(u.uid)}
                            className="px-2 py-1 rounded bg-primary text-white text-xs"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${roleColors[u.role] || roleColors.user}`}>
                          {u.role}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-text-secondary text-xs">
                      {new Date(u.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => { setEditingRole(u.uid); setNewRole(u.role); }}
                          className="p-1.5 rounded-lg hover:bg-dark-700/50 text-text-secondary hover:text-primary transition-all"
                        >
                          <UserCog className="w-3.5 h-3.5" />
                        </button>
                        {u.uid !== currentUser?.uid && (
                          <button
                            onClick={() => handleDelete(u.uid)}
                            className="p-1.5 rounded-lg hover:bg-dark-700/50 text-text-secondary hover:text-red-400 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-8 text-text-secondary text-sm">No users found</div>
          )}
        </div>
      )}
    </div>
  );
}
