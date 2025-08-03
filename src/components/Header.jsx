"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/Button";
import { PageTransitionLoader } from "@/components/PageTransitionLoader";
import { Home, LogOut, Menu, X } from "lucide-react";

export function Header() {
  const { user, logout, userProfile } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  // Fetch user profile data if not available from context
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user && !userProfile) {
        try {
          const response = await fetch(`/api/users/${user.uid}`);
          if (response.ok) {
            const userData = await response.json();
            setProfileData(userData);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else if (userProfile) {
        setProfileData(userProfile);
      }
    };

    fetchUserProfile();
  }, [user, userProfile]);

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    );
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (pathname !== "/") {
      setIsLoading(true);
      router.push("/");
      // Simulate loading time
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  // Use profileData from state or userProfile from context
  const currentProfile = profileData || userProfile;

  return (
    <>
      <PageTransitionLoader isLoading={isLoading} />
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link
                href="/"
                onClick={handleLogoClick}
                className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                MiniLinkedIn
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <Link href="/">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-black hover:bg-gray-100"
                    >
                      <Home className="h-4 w-4 mr-2 text-black" />
                      Home
                    </Button>
                  </Link>

                  {/* Profile Image */}
                  <Link
                    href={`/profile/${user.uid}`}
                    className="flex items-center"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-colors cursor-pointer">
                      {currentProfile?.profilePicture ? (
                        <img
                          src={currentProfile.profilePicture}
                          alt={currentProfile.name || "Profile"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.log(
                              "Profile image failed to load:",
                              currentProfile.profilePicture
                            );
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                          {getInitials(
                            currentProfile?.name ||
                              user?.displayName ||
                              user?.email ||
                              "U"
                          )}
                        </div>
                      )}
                    </div>
                  </Link>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 mr-2 text-red-600" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm" className="text-black">
                      Join now
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </>
              )}
            </nav>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center space-x-2">
              {user && (
                <>
                  {/* Mobile Profile Image */}
                  <Link
                    href={`/profile/${user.uid}`}
                    className="flex items-center"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-colors cursor-pointer">
                      {currentProfile?.profilePicture ? (
                        <img
                          src={currentProfile.profilePicture}
                          alt="Profile"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                          {getInitials(
                            currentProfile?.name ||
                              user?.displayName ||
                              user?.email ||
                              "U"
                          )}
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Mobile Menu Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMobileMenu}
                    className="p-2 text-black"
                  >
                    {isMobileMenuOpen ? (
                      <X className="h-5 w-5" />
                    ) : (
                      <Menu className="h-5 w-5" />
                    )}
                  </Button>
                </>
              )}

              {!user && (
                <div className="flex items-center space-x-2">
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm" className="text-black">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && user && (
            <div className="md:hidden border-t border-gray-200 bg-white absolute left-0 right-0 top-16 shadow-lg z-40">
              <div className="px-4 py-2 space-y-2">
                <Link href="/" onClick={closeMobileMenu}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-black hover:bg-gray-100"
                  >
                    <Home className="h-4 w-4 mr-2 text-black" />
                    Home
                  </Button>
                </Link>

                <Link href={`/profile/${user.uid}`} onClick={closeMobileMenu}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-black hover:bg-gray-100"
                  >
                    <div className="w-4 h-4 rounded-full overflow-hidden border border-gray-300 mr-2">
                      {currentProfile?.profilePicture ? (
                        <img
                          src={currentProfile.profilePicture}
                          alt="Profile"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                          {getInitials(
                            currentProfile?.name ||
                              user?.displayName ||
                              user?.email ||
                              "U"
                          )}
                        </div>
                      )}
                    </div>
                    Profile
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
