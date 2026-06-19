import { useState, useEffect } from 'react';
import { MessageCircle, TrendingUp, Globe, Clock, Send, ThumbsUp, Trash2, LogIn } from 'lucide-react';
import { commentsAPI } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import type { CommentData } from '../../types';

type CommentLevel = 'top' | 'global' | 'latest';

interface Props {
  animeSlug: string;
  episodeSlug?: string;
}

export default function CommentSection({ animeSlug, episodeSlug }: Props) {
  const { user, loading: authLoading } = useAuth();
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState<CommentLevel>('latest');
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await commentsAPI.getComments(animeSlug, episodeSlug, level);
      setComments(data);
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [animeSlug, episodeSlug, level]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;
    setSubmitting(true);
    try {
      await commentsAPI.addComment({
        animeSlug,
        episodeSlug: episodeSlug || '',
        userId: user.uid,
        userName: user.displayName,
        userPhoto: user.photoURL,
        text: newComment.trim(),
        level: 'global',
        parentId: null,
        replies: [],
        likes: 0,
      });
      setNewComment('');
      await loadComments();
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId: string) => {
    await commentsAPI.likeComment(commentId);
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, likes: c.likes + 1 } : c));
  };

  const handleDelete = async (commentId: string) => {
    await commentsAPI.deleteComment(commentId);
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  const levels = [
    { key: 'latest' as const, label: 'Latest', icon: <Clock className="w-3.5 h-3.5" /> },
    { key: 'top' as const, label: 'Top', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { key: 'global' as const, label: 'Global', icon: <Globe className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="glass-effect rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-text-primary">Comments</h3>
          <span className="text-xs text-muted">({comments.length})</span>
        </div>

        {/* Level filter */}
        <div className="flex gap-1 bg-dark-700/50 rounded-lg p-1">
          {levels.map(l => (
            <button
              key={l.key}
              onClick={() => setLevel(l.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                level === l.key
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {l.icon}
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Comment input */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary">
                {user.displayName?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows={2}
                className="w-full bg-dark-700/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder-muted focus:outline-none focus:border-primary/50 resize-none transition-all"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted">
                  {user.displayName}
                </span>
                <button
                  type="submit"
                  disabled={!newComment.trim() || submitting}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : !authLoading ? (
        <div className="mb-6 p-4 rounded-xl bg-dark-700/30 border border-white/5 text-center">
          <p className="text-text-secondary text-sm mb-2">Login to leave a comment</p>
          <a
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            <LogIn className="w-3.5 h-3.5" />
            Login / Register
          </a>
        </div>
      ) : null}

      {/* Comments list */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <MessageCircle className="w-8 h-8 text-muted mx-auto mb-2" />
          <p className="text-text-secondary text-sm">No comments yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="group flex gap-3 p-3 rounded-xl bg-dark-700/20 border border-white/5 hover:bg-dark-700/40 transition-all">
              <div className="w-8 h-8 rounded-full bg-dark-600 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-primary">
                  {c.userName?.charAt(0).toUpperCase() || '?'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-text-primary">{c.userName}</span>
                  <span className="text-[10px] text-muted">
                    {new Date(c.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </span>
                  {c.level && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary uppercase">
                      {c.level}
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-secondary">{c.text}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => handleLike(c.id)}
                    className="flex items-center gap-1 text-[11px] text-muted hover:text-primary transition-colors"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    {c.likes}
                  </button>
                  {(user?.role === 'admin' || user?.uid === c.userId) && (
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="flex items-center gap-1 text-[11px] text-muted hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
