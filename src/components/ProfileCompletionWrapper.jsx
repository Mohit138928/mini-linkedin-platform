"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

export function ProfileCompletionWrapper({ children }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [profileComplete, setProfileComplete] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pages that don't require profile completion
  const allowedPaths = ["/auth/login", "/auth/register", "/profile/complete"];

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Skip check for allowed paths
    if (allowedPaths.some((path) => pathname.startsWith(path))) {
      setLoading(false);
      return;
    }

    checkProfileCompletion();
  }, [user, pathname]);

  const checkProfileCompletion = async () => {
    try {
      const response = await fetch(`/api/users/${user.uid}`);
      if (response.ok) {
        const userData = await response.json();
        setProfileComplete(userData.isProfileComplete);

        // Redirect to profile completion if not complete
        if (!userData.isProfileComplete) {
          router.push("/profile/complete");
          return;
        }
      }
    } catch (error) {
      console.error("Error checking profile completion:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return children;
}
