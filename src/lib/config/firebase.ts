// Firebase web configuration for Pick O Pick (project: pickopick-e520e).
//
// The console config is stored as a base64 blob and decoded at load time so it
// does not sit in the bundle as obvious plain text.
//
// Honest note: this is obfuscation, NOT encryption — anything shipped to the
// browser can be recovered. That is safe *by design* for Firebase web apps:
// the apiKey only identifies the project to Google, and real access control
// comes from the Firebase console (Authentication providers, Authorized
// domains, Firestore/Storage security rules). Keep those configured properly.

const ENCODED_FIREBASE_CONFIG =
  "eyJhcGlLZXkiOiJBSXphU3lCSzdYQjg2VTUtaDlQN2g2WmRlMW9tOVVpT2hUbE1CZ28iLCJhdXRoRG9tYWluIjoicGlja29waWNrLWU1MjBlLmZpcmViYXNlYXBwLmNvbSIsInByb2plY3RJZCI6InBpY2tvcGljay1lNTIwZSIsInN0b3JhZ2VCdWNrZXQiOiJwaWNrb3BpY2stZTUyMGUuZmlyZWJhc2VzdG9yYWdlLmFwcCIsIm1lc3NhZ2luZ1NlbmRlcklkIjoiOTM2NTQ3MTAwMzkyIiwiYXBwSWQiOiIxOjkzNjU0NzEwMDM5Mjp3ZWI6MDg2MTQ4MDgyMGM3N2NkYTcwNGI1ZCIsIm1lYXN1cmVtZW50SWQiOiJHLUVYNEJOQjJQTUgifQ==";

export function getFirebaseConfig() {
  try {
    const decoded = JSON.parse(atob(ENCODED_FIREBASE_CONFIG));
    const required = ["apiKey", "authDomain", "projectId", "appId"] as const;
    for (const key of required) {
      if (!decoded[key]) {
        throw new Error(`Missing "${key}"`);
      }
    }
    return decoded as {
      apiKey: string;
      authDomain: string;
      projectId: string;
      storageBucket: string;
      messagingSenderId: string;
      appId: string;
      measurementId?: string;
    };
  } catch (error) {
    throw new Error(
      `Firebase config could not be loaded: ${error instanceof Error ? error.message : error}`,
    );
  }
}

export const firebaseConfig = getFirebaseConfig();

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

export const firebaseApp: FirebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

// Analytics only works in supported browser environments — never let it break
// the app (it is a no-op on the server and in some webviews).
void isSupported()
  .then((supported) => {
    if (supported) getAnalytics(firebaseApp);
  })
  .catch(() => {});
