// Firebase client SDK setup. Keys come from .env.local (see .env.example).
import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, initializeFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

/**
 * App Check (anti-spam): every Firestore/Storage request carries an invisible reCAPTCHA token (a
 * score-based key from Google Cloud → reCAPTCHA) proving it came from your real site, not a script.
 * Turn on "Enforce" in Firebase → App Check once it works.
 */
const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
let appCheckStarted = false;

function startAppCheck(instance: FirebaseApp) {
  if (appCheckStarted || typeof window === "undefined" || !recaptchaSiteKey) return;
  appCheckStarted = true;
  if (process.env.NODE_ENV === "development") {
    // On localhost the SDK prints a debug token in the console. Register it under
    // Firebase → App Check → Apps → ⋮ → Manage debug tokens (or set NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN).
    (self as unknown as { FIREBASE_APPCHECK_DEBUG_TOKEN?: string | boolean }).FIREBASE_APPCHECK_DEBUG_TOKEN =
      process.env.NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN || true;
  }
  try {
    initializeAppCheck(instance, { provider: new ReCaptchaEnterpriseProvider(recaptchaSiteKey), isTokenAutoRefreshEnabled: true });
  } catch {
    // already initialised (hot reload)
  }
}

// Services are created lazily so pages still build and prerender before keys are added.
function app(): FirebaseApp {
  if (!isFirebaseConfigured) {
    throw new Error(
      "Firebase isn’t configured yet. Copy .env.example to .env.local, add your project keys and restart the dev server.",
    );
  }
  const instance = getApps()[0] ?? initializeApp(firebaseConfig);
  startAppCheck(instance); // must run before Firestore/Storage are used
  return instance;
}

let db: Firestore | undefined;

export const auth = (): Auth => getAuth(app());

export const firestore = (): Firestore => {
  if (!db) {
    try {
      // Drops `undefined` fields (e.g. an optional phone number) instead of throwing.
      db = initializeFirestore(app(), { ignoreUndefinedProperties: true });
    } catch {
      db = getFirestore(app()); // already initialised (hot reload)
    }
  }
  return db;
};

export const storage = (): FirebaseStorage => getStorage(app());
