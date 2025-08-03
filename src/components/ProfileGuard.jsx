"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export function useProfileGuard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      if (!user || loading) return;

      try {
        const response = await fetch(`/api/users/${user.uid}`);

        if (response.ok) {
          const userData = await response.json();
          console.log("ProfileGuard - User data:", userData);

          // Check if profile is complete - all required fields must be present
          const isComplete = !!(
            userData.name &&
            userData.headline &&
            userData.profilePicture &&
            userData.isProfileComplete === true
          );

          console.log("ProfileGuard - Profile complete:", isComplete);
          setProfileComplete(isComplete);

          if (!isComplete) {
            console.log("ProfileGuard - Redirecting to profile completion");
            router.push("/profile/complete");
          }
        } else {
          console.log(
            "ProfileGuard - User not found, redirecting to profile completion"
          );
          router.push("/profile/complete");
        }
      } catch (error) {
        console.error("ProfileGuard - Error checking profile:", error);
        router.push("/profile/complete");
      } finally {
        setProfileLoading(false);
      }
    };

    if (user && !loading) {
      checkProfile();
    } else if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  return { profileLoading, profileComplete };
}

export function ProfileGuard({ children }) {
  const { profileLoading, profileComplete, user } = useProfileGuard();

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  if (!profileComplete) {
    return null; // Will redirect to profile completion
  }

  return children;
}
