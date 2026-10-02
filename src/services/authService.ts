import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseApp } from "../lib/config/firebase";

// Same shape the app already stores under localStorage "user" — Navbar,
// Orders, cart and profile all read these fields.
export interface PickUser {
  customerID?: string | number;
  id?: string | number;
  pickID?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  emailID?: string;
  [key: string]: unknown;
}

/**
 * Opens the Google sign-in popup, then syncs the Google account with the Pick
 * O Pick customer list (Supabase `customerList`):
 *  - existing user  -> their row is returned (same Pick ID / orders — nothing breaks)
 *  - first-time user -> the row + Pick ID are created server-side and the
 *                       welcome email is sent
 */
export async function signInWithGoogle(): Promise<PickUser> {
  const auth = getAuth(firebaseApp);
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  const credential = await signInWithPopup(auth, provider);

  const email = credential.user.email?.trim().toLowerCase();
  if (!email) {
    throw new Error("Your Google account does not share an email address.");
  }
  const name =
    credential.user.displayName || email.split("@")[0] || "Customer";

  const response = await fetch("/api/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      name,
      photoUrl: credential.user.photoURL || "",
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.user) {
    throw new Error(
      data.error || "Could not complete Google sign-in. Please try again.",
    );
  }

  return data.user as PickUser;
}
