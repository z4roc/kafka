"use client";

import { useState } from "react";
import { RegistrationForm } from "@/components/registration-form";
import { OnboardingFlow } from "@/components/onboarding-flow";
import type { User } from "firebase/auth";

export default function RegisterPage() {
  const [user, setUser] = useState<User | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegistrationSuccess = (user: User, needsOnboarding: boolean) => {
    setUser(user);
    setNeedsOnboarding(needsOnboarding);
  };

  if (user && needsOnboarding) {
    return <OnboardingFlow user={user} />;
  }

  if (user && !needsOnboarding) {
    // Redirect to dashboard or show success message
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-green-600">Welcome back!</h1>
          <p className="text-gray-600">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <RegistrationForm
      onSuccess={handleRegistrationSuccess}
      isLoading={isLoading}
      setIsLoading={setIsLoading}
    />
  );
}
