'use client';

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

/**
 * Firebase web client. Reads config from NEXT_PUBLIC_* env vars at build time
 * (Next.js inlines these into the static bundle). Default project is
 * `ticket-helper-dbc0e` — the same project the desktop and cloud products
 * already authenticate against, so a forum login carries over.
 *
 * If `NEXT_PUBLIC_FIREBASE_API_KEY` is missing the helpers throw a friendly
 * error rather than the cryptic `auth/invalid-api-key`. UI code should call
 * `isFirebaseConfigured()` first and render a setup-required state when
 * false, so unconfigured deployments don't crash mid-page.
 */
const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'ticket-helper-dbc0e',
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;

export function isFirebaseConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.appId);
}

class FirebaseNotConfiguredError extends Error {
  constructor() {
    super('Firebase is not configured. Copy .env.local.example to .env.local and fill in NEXT_PUBLIC_FIREBASE_* values from Firebase Console → Project Settings → Web app.');
    this.name = 'FirebaseNotConfiguredError';
  }
}

export function firebaseApp(): FirebaseApp {
  if (_app) return _app;
  if (!isFirebaseConfigured()) throw new FirebaseNotConfiguredError();
  _app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return _app;
}

export function firebaseAuth(): Auth {
  if (_auth) return _auth;
  _auth = getAuth(firebaseApp());
  return _auth;
}

export function firestore(): Firestore {
  if (_db) return _db;
  _db = getFirestore(firebaseApp());
  return _db;
}
