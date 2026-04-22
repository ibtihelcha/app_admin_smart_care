import type { User } from 'firebase/auth';
import type { UpdateData, DocumentData } from 'firebase/firestore';

import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useMemo, useState, useEffect, useContext, createContext } from 'react';
import {
  updateEmail,
  updatePassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';

import { db, auth } from 'src/lib/firebase';

type UserProfile = {
  id: string;
  role?: string;
  email?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  [key: string]: unknown;
};

type AuthContextValue = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateAdminProfile: (data: Record<string, unknown>) => Promise<void>;
  updateOwnCredentials: (email?: string, password?: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function getProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as UserProfile;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (!auth.currentUser) {
      setProfile(null);
      return;
    }
    const nextProfile = await getProfile(auth.currentUser.uid);
    setProfile(nextProfile);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const nextProfile = await getProfile(nextUser.uid);
      setProfile(nextProfile);
      setLoading(false);
    });

    return unsub;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      isAdmin: profile?.role === 'admin',
      signIn: async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
        const nextProfile = await getProfile(auth.currentUser!.uid);
        if (!nextProfile || nextProfile.role !== 'admin') {
          await firebaseSignOut(auth);
          throw new Error('Acces refuse: ce compte ne possede pas le role admin.');
        }
        setProfile(nextProfile);
      },
      signOut: async () => {
        await firebaseSignOut(auth);
      },
      refreshProfile,
      updateAdminProfile: async (data: Record<string, unknown>) => {
        if (!auth.currentUser) throw new Error('Utilisateur non authentifie.');
        await updateDoc(doc(db, 'users', auth.currentUser.uid), data as UpdateData<DocumentData>);
        await refreshProfile();
      },
      updateOwnCredentials: async (email?: string, password?: string) => {
        if (!auth.currentUser) throw new Error('Utilisateur non authentifie.');
        if (email && email !== auth.currentUser.email) {
          await updateEmail(auth.currentUser, email);
        }
        if (password) {
          await updatePassword(auth.currentUser, password);
        }
      },
    }),
    [loading, profile, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth doit etre utilise dans AuthProvider');
  return context;
}
