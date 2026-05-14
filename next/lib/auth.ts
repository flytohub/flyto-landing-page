'use client';

import { useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { firebaseAuth, isFirebaseConfigured } from './firebase';
import type { Author } from './forum';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [configured] = useState(() => isFirebaseConfigured());

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(firebaseAuth(), (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, [configured]);

  return { user, loading, configured };
}

export function toAuthor(user: User): Author {
  return {
    user_id:     user.uid,
    user_email:  user.email ?? '',
    user_name:   user.displayName ?? (user.email?.split('@')[0] ?? 'User'),
    user_avatar: user.photoURL ?? undefined,
  };
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(firebaseAuth(), provider);
}

export async function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(firebaseAuth(), email, password);
}

export async function signUpWithEmail(email: string, password: string) {
  return createUserWithEmailAndPassword(firebaseAuth(), email, password);
}

export async function signOut() {
  return fbSignOut(firebaseAuth());
}

export function isAdminEmail(email: string | null | undefined): boolean {
  return email === 'admin@flyto2.com';
}
