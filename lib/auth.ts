import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/hooks/auth_hook";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

async function logout() {
  if (!auth.currentUser) return;
  const { setUser } = useAuthStore();

  try {
    await signOut(auth);
    setUser(null); // Clear user state in the store
  } catch (error: any) {
    console.error("Sign out failed:", error.message);
  }
}

async function login(email: string, password: string) {
  if (auth.currentUser) return;

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("User signed in successfully");
  } catch (error: any) {
    console.error("Sign in failed:", error.message);
  }
}

export { logout, login };
