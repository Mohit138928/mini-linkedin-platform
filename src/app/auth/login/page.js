"use client";
import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { LoadingSpinner } from "@/components/LoadingComponents";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const checkUserProfileAndRedirect = async (firebaseUser) => {
    try {
      const response = await fetch(`/api/users/${firebaseUser.uid}`);

      if (response.ok) {
        const userData = await response.json();
        // console.log("User profile data:", userData);

        // Check if profile is complete - all required fields must be present
        const isProfileComplete = !!(
          userData.name &&
          userData.headline &&
          userData.profilePicture
        );

        if (isProfileComplete) {
          console.log("Profile is complete, redirecting to home");
          router.push("/");
        } else {
          console.log(
            "Profile is incomplete, redirecting to profile completion"
          );
          router.push("/profile/complete");
        }
      } else {
        // User doesn't exist in our database, redirect to profile completion
        console.log(
          "User not found in database, redirecting to profile completion"
        );
        router.push("/profile/complete");
      }
    } catch (error) {
      console.error("Error checking user profile:", error);
      // On error, redirect to profile completion to be safe
      router.push("/profile/complete");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Check profile completion and redirect accordingly
      await checkUserProfileAndRedirect(userCredential.user);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // For Google sign-in, try to create/update user profile first
      try {
        await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firebaseUid: user.uid,
            email: user.email,
            name: user.displayName || "",
            bio: user.bio || "",
          }),
        });
      } catch (profileError) {
        console.log("User profile creation/update response:", profileError);
      }

      // Check profile completion and redirect accordingly
      await checkUserProfileAndRedirect(user);
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        setLoading(false);
        return;
      } else if (error.code === "auth/cancelled-popup-request") {
        setLoading(false);
        return;
      } else {
        setError("Failed to sign in with Google. Please try again.");
        console.error("Google sign-in error:", error);
        setLoading(false);
      }
    }
  };

  if (user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full relative"
                disabled={loading}
              >
                {loading && (
                  <div className="absolute left-4">
                    <LoadingSpinner size="sm" variant="white" />
                  </div>
                )}
                {loading ? "Signing in..." : "Sign in"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full relative"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                {loading ? (
                  <LoadingSpinner
                    size="sm"
                    variant="default"
                    className="mr-2"
                  />
                ) : (
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                {loading ? "Signing in..." : "Continue with Google"}
              </Button>
              <div className="text-center">
                <span className="text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/auth/register"
                    className="text-blue-600 hover:text-blue-500"
                  >
                    Sign up
                  </Link>
                </span>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
