import { isFirebaseConfigured, getFirebaseConfig } from './config';
import type { UserProfile, RedeemCode, AdPlacement, CommentData, WebsiteSettings } from '../types';

// ============================================================
// DEMO DATA — used when Firebase is not configured
// ============================================================
let _demoMode = !isFirebaseConfigured();

export function isDemoMode() {
  return _demoMode;
}

// Firebase instances (lazy loaded)
let _auth: any = null;
let _db: any = null;
let _firebaseApp: any = null;

async function getFirebase() {
  const { initializeApp } = await import('firebase/app');
  const { getAuth } = await import('firebase/auth');
  const { getFirestore, enableIndexedDbPersistence } = await import('firebase/firestore');

  if (!_firebaseApp) {
    _firebaseApp = initializeApp(getFirebaseConfig());
  }
  if (!_auth) {
    _auth = getAuth(_firebaseApp);
  }
  if (!_db) {
    _db = getFirestore(_firebaseApp);
    try {
      await enableIndexedDbPersistence(_db);
    } catch { /* offline persistence already enabled */ }
  }
  return { auth: _auth, db: _db, app: _firebaseApp };
}

// ============================================================
// DEMO STORE — in-memory database for demo mode
// ============================================================
const demoStore = {
  users: new Map<string, UserProfile>(),
  comments: [] as CommentData[],
  redeemCodes: [] as RedeemCode[],
  ads: [] as AdPlacement[],
  settings: {
    siteName: 'AniStream',
    description: 'Free Anime Streaming Platform',
    logoUrl: '',
    primaryColor: '#ff6b35',
    allowRegistration: true,
    defaultRole: 'user',
  } as WebsiteSettings,
};

// Seed demo data
function seedDemoData() {
  const adminUser: UserProfile = {
    uid: 'demo-admin',
    email: 'admin@anistream.demo',
    displayName: 'Admin Demo',
    role: 'admin',
    photoURL: '',
    createdAt: Date.now(),
    redeemCodesUsed: [],
  };
  demoStore.users.set(adminUser.uid, adminUser);

  const demoUser: UserProfile = {
    uid: 'demo-user',
    email: 'user@anistream.demo',
    displayName: 'User Demo',
    role: 'user',
    photoURL: '',
    createdAt: Date.now(),
    redeemCodesUsed: [],
  };
  demoStore.users.set(demoUser.uid, demoUser);

  // Demo redeem codes
  demoStore.redeemCodes.push({
    id: 'demo-code-1',
    code: 'ADMIN2024',
    role: 'admin',
    maxUses: 10,
    usedBy: [],
    createdBy: 'demo-admin',
    createdAt: Date.now(),
  });
  demoStore.redeemCodes.push({
    id: 'demo-code-2',
    code: 'VIP2024',
    role: 'vip',
    maxUses: 50,
    usedBy: [],
    createdBy: 'demo-admin',
    createdAt: Date.now(),
  });

  // Demo ads
  demoStore.ads.push({
    id: 'ad-1',
    title: 'Demo Banner Ad',
    type: 'banner',
    position: 'top',
    imageUrl: 'https://via.placeholder.com/728x90/ff6b35/ffffff?text=Demo+Ad',
    linkUrl: '#',
    active: true,
    createdAt: Date.now(),
  });

  // Demo comments
  demoStore.comments.push({
    id: 'c1',
    animeSlug: 'demo-anime',
    episodeSlug: '',
    userId: 'demo-user',
    userName: 'User Demo',
    userPhoto: '',
    text: 'Anime keren banget! Recommended! 🔥',
    level: 'global',
    likes: 12,
    replies: [],
    createdAt: Date.now() - 3600000,
    parentId: null,
  });
  demoStore.comments.push({
    id: 'c2',
    animeSlug: 'demo-anime',
    episodeSlug: '',
    userId: 'demo-admin',
    userName: 'Admin Demo',
    userPhoto: '',
    text: 'Setuju! Episodenya mantep semua.',
    level: 'global',
    likes: 5,
    replies: [],
    createdAt: Date.now() - 1800000,
    parentId: null,
  });
}

seedDemoData();

// ============================================================
// AUTH API
// ============================================================
export const authAPI = {
  async login(email: string, password: string) {
    if (_demoMode) return demoLogin(email, password);
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    const { auth } = await getFirebase();
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  },

  async register(email: string, password: string, displayName: string) {
    if (_demoMode) {
      const uid = 'demo-' + Date.now();
      const user: UserProfile = {
        uid,
        email,
        displayName,
        role: 'user',
        photoURL: '',
        createdAt: Date.now(),
        redeemCodesUsed: [],
      };
      demoStore.users.set(uid, user);
      return user;
    }
    const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
    const { doc, setDoc } = await import('firebase/firestore');
    const { auth, db } = await getFirebase();
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    const profile: UserProfile = {
      uid: cred.user.uid,
      email: cred.user.email || email,
      displayName,
      role: 'user',
      photoURL: '',
      createdAt: Date.now(),
      redeemCodesUsed: [],
    };
    await setDoc(doc(db, 'users', cred.user.uid), profile);
    return profile;
  },

  async logout() {
    if (_demoMode) {
      _currentDemoUser = null;
      return;
    }
    const { signOut } = await import('firebase/auth');
    const { auth } = await getFirebase();
    await signOut(auth);
  },

  _listenerPromise: null as Promise<UserProfile | null> | null,

  async getCurrentUser(): Promise<UserProfile | null> {
    if (_demoMode) return _currentDemoUser;
    // Return cached promise to avoid creating multiple listeners
    if (this._listenerPromise) return this._listenerPromise;
    try {
      const { onAuthStateChanged } = await import('firebase/auth');
      const { doc, getDoc } = await import('firebase/firestore');
      const { auth, db } = await getFirebase();
      this._listenerPromise = new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          unsubscribe(); // Unsubscribe immediately after first callback
          if (user) {
            const snap = await getDoc(doc(db, 'users', user.uid));
            resolve(snap.exists() ? (snap.data() as UserProfile) : null);
          } else {
            resolve(null);
          }
        });
      });
      return this._listenerPromise;
    } catch {
      return null;
    }
  },

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    if (_demoMode) return demoStore.users.get(uid) || null;
    const { doc, getDoc } = await import('firebase/firestore');
    const { db } = await getFirebase();
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? (snap.data() as UserProfile) : null;
  },

  async updateUserRole(uid: string, role: UserProfile['role']) {
    if (_demoMode) {
      const u = demoStore.users.get(uid);
      if (u) { u.role = role; }
      return;
    }
    const { doc, updateDoc } = await import('firebase/firestore');
    const { db } = await getFirebase();
    await updateDoc(doc(db, 'users', uid), { role });
  },

  async getAllUsers(): Promise<UserProfile[]> {
    if (_demoMode) return Array.from(demoStore.users.values());
    const { collection, getDocs } = await import('firebase/firestore');
    const { db } = await getFirebase();
    const snap = await getDocs(collection(db, 'users'));
    return snap.docs.map(d => d.data() as UserProfile);
  },

  async deleteUser(uid: string) {
    if (_demoMode) { demoStore.users.delete(uid); return; }
    const { doc, deleteDoc } = await import('firebase/firestore');
    const { db } = await getFirebase();
    await deleteDoc(doc(db, 'users', uid));
  },
};

let _currentDemoUser: UserProfile | null = null;
export function setDemoUser(user: UserProfile | null) { _currentDemoUser = user; }

function demoLogin(email: string, _password: string) {
  const user = Array.from(demoStore.users.values()).find(u => u.email === email);
  if (!user) throw new Error('User not found');
  _currentDemoUser = user;
  return { uid: user.uid, email: user.email } as any;
}

// ============================================================
// COMMENTS API
// ============================================================
export const commentsAPI = {
  async getComments(animeSlug: string, episodeSlug?: string, level?: string): Promise<CommentData[]> {
    if (_demoMode) {
      let filtered = demoStore.comments.filter(c => c.animeSlug === animeSlug);
      if (episodeSlug) filtered = filtered.filter(c => !c.episodeSlug || c.episodeSlug === episodeSlug);
      if (level === 'top') return filtered.sort((a, b) => b.likes - a.likes);
      if (level === 'global') return filtered;
      return filtered.sort((a, b) => b.createdAt - a.createdAt);
    }
    const { collection, query, where, orderBy, getDocs } = await import('firebase/firestore');
    const { db } = await getFirebase();
    const q = query(
      collection(db, 'comments'),
      where('animeSlug', '==', animeSlug),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as CommentData);
  },

  async addComment(comment: Omit<CommentData, 'id' | 'createdAt'>) {
    const full: CommentData = {
      ...comment,
      id: _demoMode ? 'c' + Date.now() : '',
      createdAt: Date.now(),
      likes: 0,
      replies: [],
    };
    if (_demoMode) {
      demoStore.comments.push(full);
      return full;
    }
    const { collection, addDoc } = await import('firebase/firestore');
    const { db } = await getFirebase();
    const ref = await addDoc(collection(db, 'comments'), full);
    return { ...full, id: ref.id };
  },

  async likeComment(commentId: string) {
    if (_demoMode) {
      const c = demoStore.comments.find(c => c.id === commentId);
      if (c) c.likes++;
      return;
    }
    const { doc, updateDoc, increment } = await import('firebase/firestore');
    const { db } = await getFirebase();
    await updateDoc(doc(db, 'comments', commentId), { likes: increment(1) });
  },

  async deleteComment(commentId: string) {
    if (_demoMode) {
      const idx = demoStore.comments.findIndex(c => c.id === commentId);
      if (idx > -1) demoStore.comments.splice(idx, 1);
      return;
    }
    const { doc, deleteDoc } = await import('firebase/firestore');
    const { db } = await getFirebase();
    await deleteDoc(doc(db, 'comments', commentId));
  },
};

// ============================================================
// REDEEM CODES API
// ============================================================
export const redeemAPI = {
  async redeemCode(code: string, userId: string): Promise<{ success: boolean; role?: string; message: string }> {
    if (_demoMode) {
      const found = demoStore.redeemCodes.find(c => c.code === code);
      if (!found) return { success: false, message: 'Invalid code' };
      if (found.usedBy.length >= found.maxUses) return { success: false, message: 'Code has reached max uses' };
      if (found.usedBy.includes(userId)) return { success: false, message: 'You already used this code' };
      found.usedBy.push(userId);
      const u = demoStore.users.get(userId);
      if (u) u.role = found.role as UserProfile['role'];
      return { success: true, role: found.role, message: `You are now ${found.role}!` };
    }
    const { collection, query, where, getDocs, doc, updateDoc } = await import('firebase/firestore');
    const { db } = await getFirebase();
    const q = query(collection(db, 'redeemCodes'), where('code', '==', code));
    const snap = await getDocs(q);
    if (snap.empty) return { success: false, message: 'Invalid code' };
    const data = snap.docs[0].data() as RedeemCode;
    if (data.usedBy.length >= data.maxUses) return { success: false, message: 'Code expired' };
    if (data.usedBy.includes(userId)) return { success: false, message: 'Already used' };
    const newUsedBy = [...data.usedBy, userId];
    await updateDoc(doc(db, 'redeemCodes', snap.docs[0].id), { usedBy: newUsedBy });
    await updateDoc(doc(db, 'users', userId), { role: data.role, redeemCodesUsed: [code] });
    return { success: true, role: data.role, message: `Redeemed! Role: ${data.role}` };
  },

  async generateCode(code: string, role: string, maxUses: number, createdBy: string) {
    const entry: RedeemCode = {
      id: _demoMode ? 'rc-' + Date.now() : '',
      code,
      role,
      maxUses,
      usedBy: [],
      createdBy,
      createdAt: Date.now(),
    };
    if (_demoMode) { demoStore.redeemCodes.push(entry); return entry; }
    const { collection, addDoc } = await import('firebase/firestore');
    const { db } = await getFirebase();
    const ref = await addDoc(collection(db, 'redeemCodes'), entry);
    return { ...entry, id: ref.id };
  },

  async getAllCodes(): Promise<RedeemCode[]> {
    if (_demoMode) return demoStore.redeemCodes;
    const { collection, getDocs } = await import('firebase/firestore');
    const { db } = await getFirebase();
    const snap = await getDocs(collection(db, 'redeemCodes'));
    return snap.docs.map(d => d.data() as RedeemCode);
  },

  async deleteCode(codeId: string) {
    if (_demoMode) {
      const idx = demoStore.redeemCodes.findIndex(c => c.id === codeId);
      if (idx > -1) demoStore.redeemCodes.splice(idx, 1);
      return;
    }
    const { doc, deleteDoc } = await import('firebase/firestore');
    const { db } = await getFirebase();
    await deleteDoc(doc(db, 'redeemCodes', codeId));
  },
};

// ============================================================
// ADS API
// ============================================================
export const adsAPI = {
  async getAds(position?: string): Promise<AdPlacement[]> {
    if (_demoMode) {
      let ads = demoStore.ads.filter(a => a.active);
      if (position) ads = ads.filter(a => a.position === position);
      return ads;
    }
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    const { db } = await getFirebase();
    const q = position
      ? query(collection(db, 'ads'), where('active', '==', true), where('position', '==', position))
      : query(collection(db, 'ads'), where('active', '==', true));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as AdPlacement);
  },

  async getAllAds(): Promise<AdPlacement[]> {
    if (_demoMode) return demoStore.ads;
    const { collection, getDocs } = await import('firebase/firestore');
    const { db } = await getFirebase();
    const snap = await getDocs(collection(db, 'ads'));
    return snap.docs.map(d => d.data() as AdPlacement);
  },

  async addAd(ad: Omit<AdPlacement, 'id' | 'createdAt'>) {
    const full: AdPlacement = { ...ad, id: _demoMode ? 'ad-' + Date.now() : '', createdAt: Date.now() };
    if (_demoMode) { demoStore.ads.push(full); return full; }
    const { collection, addDoc } = await import('firebase/firestore');
    const { db } = await getFirebase();
    const ref = await addDoc(collection(db, 'ads'), full);
    return { ...full, id: ref.id };
  },

  async updateAd(adId: string, updates: Partial<AdPlacement>) {
    if (_demoMode) {
      const ad = demoStore.ads.find(a => a.id === adId);
      if (ad) Object.assign(ad, updates);
      return;
    }
    const { doc, updateDoc } = await import('firebase/firestore');
    const { db } = await getFirebase();
    await updateDoc(doc(db, 'ads', adId), updates);
  },

  async deleteAd(adId: string) {
    if (_demoMode) {
      const idx = demoStore.ads.findIndex(a => a.id === adId);
      if (idx > -1) demoStore.ads.splice(idx, 1);
      return;
    }
    const { doc, deleteDoc } = await import('firebase/firestore');
    const { db } = await getFirebase();
    await deleteDoc(doc(db, 'ads', adId));
  },
};

// ============================================================
// SETTINGS API
// ============================================================
export const settingsAPI = {
  async getSettings(): Promise<WebsiteSettings> {
    if (_demoMode) return demoStore.settings;
    try {
      const { doc, getDoc } = await import('firebase/firestore');
      const { db } = await getFirebase();
      const snap = await getDoc(doc(db, 'settings', 'main'));
      return snap.exists() ? (snap.data() as WebsiteSettings) : demoStore.settings;
    } catch { return demoStore.settings; }
  },

  async updateSettings(updates: Partial<WebsiteSettings>) {
    if (_demoMode) { Object.assign(demoStore.settings, updates); return; }
    const { doc, setDoc } = await import('firebase/firestore');
    const { db } = await getFirebase();
    await setDoc(doc(db, 'settings', 'main'), updates, { merge: true });
  },
};
