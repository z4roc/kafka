import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/hooks/auth_hook";
import { signOut } from "firebase/auth";

async function logout() {
  if (!auth.currentUser) return;
  const { setUser } = useAuthStore();

  try {
    await signOut(auth);
    setUser(null); // Clear user state in the store
    console.log("User signed out successfully");
  } catch (error: any) {
    console.error("Sign out failed:", error.message);
  }
}

export { logout };
