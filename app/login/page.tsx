"use client";

import { useState } from "react";
import { LoginForm } from "@/components/login-form";
import type { User } from "firebase/auth";

export default function LoginPage() {
  const [user, setUser] = useState<User | null>(null);

  const handleLoginSuccess = (user: User) => {
    setUser(user);
    // Redirect to dashboard
    window.location.href = "/dashboard";
  };

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-green-600">
            Wilkommen zurück!
          </h1>
          <p className="text-gray-600">
            Du wirst zu deinem Dashboard weitergeleitet...
          </p>
        </div>
      </div>
    );
  }

  return <LoginForm onSuccess={handleLoginSuccess} />;
}
