"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./Button";
import { Input } from "./Input";
import { getInitials } from "@/lib/utils";
import { SearchResults } from "./SearchResults";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Search,
  Home,
  Users,
  Briefcase,
  MessageSquare,
  Bell,
  Menu,
  X,
  LogOut,
  User,
  Settings,
  ChevronDown,
  Plus,
} from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();
  const [currentProfile, setCurrentProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  // Add search-related states
  const [searchResults, setSearchResults] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [messageCount, setMessageCount] = useState(2);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null); // Add search ref

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const fetchCurrentProfile = async () => {
      if (user) {
        try {
          const response = await fetch(`/api/users/${user.uid}`);
          if (response.ok) {
            const userData = await response.json();
            setCurrentProfile(userData);
          }
        } catch (error) {
          console.error("Error fetching current profile:", error);
        }
      }
    };

    fetchCurrentProfile();
  }, [user]);

  // Add search functionality
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchQuery.trim().length < 2) {
        setSearchResults(null);
        setShowSearchResults(false);
        setSearchLoading(false);
        return;
      }

      setSearchLoading(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(debouncedSearchQuery)}`
        );
        if (response.ok) {
          const results = await response.json();
          setSearchResults(results);
          setShowSearchResults(true);
        }
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults(null);
      } finally {
        setSearchLoading(false);
      }
    };

    performSearch();
  }, [debouncedSearchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
      // Add search results close functionality
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    if (isProfileDropdownOpen || showSearchResults) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileDropdownOpen, showSearchResults]);

  // Close mobile menu when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Add escape key handler for search
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowSearchResults(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileDropdownOpen(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Add search handlers
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Show loading state immediately if user is typing
    if (value.trim().length >= 2) {
      setSearchLoading(true);
    }
  };

  const handleSearchFocus = () => {
    if (searchQuery.trim().length >= 2 && searchResults) {
      setShowSearchResults(true);
    }
  };

  const closeSearchResults = () => {
    setShowSearchResults(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const navItems = [
    { icon: Home, label: "Home", href: "/", active: true },
    { icon: Users, label: "My Network", href: "/network" },
    { icon: Briefcase, label: "Jobs", href: "/jobs" },
    {
      icon: MessageSquare,
      label: "Messaging",
      href: "/messages",
      count: messageCount,
    },
    {
      icon: Bell,
      label: "Notifications",
      href: "/notifications",
      count: notificationCount,
      hasBlinking: true,
    },
  ];

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <span className="hidden sm:block font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                  Mini LinkedIn
                </span>
              </Link>
            </div>

            {/* Search Bar - Desktop & Mobile with added functionality */}
            <div
              className="flex-1 max-w-2xl mx-4 lg:mx-8 relative"
              ref={searchRef}
            >
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search
                    className={`h-5 w-5 transition-colors duration-200 ${
                      searchLoading
                        ? "text-blue-500 animate-pulse"
                        : "text-gray-400 group-focus-within:text-blue-500"
                    }`}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Search for people, jobs, companies..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onFocus={handleSearchFocus}
                  className="block w-full pl-12 pr-12 py-3 bg-gray-50 border-0 rounded-full text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg text-black"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Search Results */}
              <SearchResults
                results={searchResults}
                isVisible={showSearchResults}
                onClose={closeSearchResults}
                searchQuery={searchQuery}
                loading={searchLoading}
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {user && (
                <>
                  {/* Navigation Items */}
                  {navItems.map((item) => (
                    <Link key={item.label} href={item.href}>
                      <div
                        className={`relative group rounded-lg transition-all duration-200 hover:bg-gray-50 ${
                          item.active ? "bg-blue-50" : ""
                        }`}
                      >
                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-black hover:bg-gray-100"
                          >
                            <div className="relative">
                              <item.icon
                                className={`h-4 w-4 mr-2 ${
                                  item.active
                                    ? "text-blue-600"
                                    : "text-gray-600 group-hover:text-gray-900"
                                } transition-colors duration-200`}
                              />

                              {item.count > 0 && (
                                <div className="absolute -top-1 -right-0 flex items-center justify-center">
                                  {/* Static Badge */}
                                  <span className="relative bg-red-500 text-white text-[10px] rounded-full h-4 min-w-[16px] px-[2px] flex items-center justify-center font-bold z-10">
                                    {item.count > 99 ? "99+" : item.count}
                                  </span>

                                  {/* Blinking Dot */}
                                  {item.hasBlinking && (
                                    <>
                                      <span className="absolute h-4 w-4 rounded-full animate-ping bg-red-400 opacity-75"></span>
                                      <span className="absolute h-4 w-4 rounded-full animate-pulse bg-red-500"></span>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>

                            <span
                              className={`text-xs font-medium ${
                                item.active
                                  ? "text-blue-600"
                                  : "text-gray-600 group-hover:text-gray-900"
                              } transition-colors duration-200`}
                            >
                              {item.label}
                            </span>
                          </Button>
                        </div>
                      </div>
                    </Link>
                  ))}

                  {/* Profile Dropdown */}
                  <div className="relative ml-3" ref={dropdownRef}>
                    <button
                      onClick={toggleProfileDropdown}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-blue-300 transition-colors duration-200">
                        {currentProfile?.profilePicture ? (
                          <img
                            src={currentProfile.profilePicture}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                            {getInitials(
                              currentProfile?.name ||
                                user?.displayName ||
                                user?.email ||
                                "U"
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900 transition-colors duration-200">
                          Me
                        </span>
                        <ChevronDown className="h-3 w-3 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                      </div>
                    </button>

                    {/* Profile Dropdown Menu */}
                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-3 z-50 animate-in fade-in duration-200">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                              {currentProfile?.profilePicture ? (
                                <img
                                  src={currentProfile.profilePicture}
                                  alt="Profile"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                                  {getInitials(
                                    currentProfile?.name ||
                                      user?.displayName ||
                                      user?.email ||
                                      "U"
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-lg font-semibold text-gray-900 truncate">
                                {currentProfile?.name ||
                                  user?.displayName ||
                                  "User"}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {currentProfile?.headline || "Professional"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="py-2">
                          <Link href={`/profile/${user.uid}`}>
                            <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">
                              <User className="h-5 w-5 mr-3" />
                              View Profile
                            </button>
                          </Link>
                          <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">
                            <Settings className="h-5 w-5 mr-3" />
                            Settings & Privacy
                          </button>
                        </div>

                        <div className="border-t border-gray-100 py-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
                          >
                            <LogOut className="h-5 w-5 mr-3" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {!user && (
                <div className="flex items-center space-x-3">
                  <Link href="/auth/login">
                    <Button
                      variant="ghost"
                      className="font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-full transition-all duration-200"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl">
                      Join now
                    </Button>
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu Content */}
          <div className="fixed inset-y-0 right-0 flex flex-col w-full max-w-sm bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Menu Content */}
            <div className="flex-1 overflow-y-auto">
              {user ? (
                <>
                  {/* Profile Section */}
                  <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-white shadow-lg">
                        {currentProfile?.profilePicture ? (
                          <img
                            src={currentProfile.profilePicture}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                            {getInitials(
                              currentProfile?.name ||
                                user?.displayName ||
                                user?.email ||
                                "U"
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-semibold text-gray-900 truncate">
                          {currentProfile?.name || user?.displayName || "User"}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {currentProfile?.headline || "Professional"}
                        </p>
                        <Link href={`/profile/${user.uid}`}>
                          <span className="text-sm text-blue-600 font-medium hover:text-blue-700 cursor-pointer">
                            View Profile
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Items */}
                  <div className="py-4">
                    {navItems.map((item, index) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-all duration-200">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <item.icon
                                className={`h-6 w-6 ${
                                  item.active
                                    ? "text-blue-600"
                                    : "text-gray-600"
                                }`}
                              />

                              {/* Notification Badge */}
                              {item.count > 0 && (
                                <div className="absolute -top-1 -right-1 flex items-center justify-center">
                                  {/* Static Badge */}
                                  <span className="relative bg-red-500 text-white text-[10px] rounded-full h-4 w-4 min-w-[16px] px-[2px] flex items-center justify-center font-semibold z-10">
                                    {item.count > 99 ? "99+" : item.count}
                                  </span>

                                  {/* Blinking Dot */}
                                  {item.hasBlinking && (
                                    <>
                                      <span className="absolute h-3 w-3 rounded-full animate-ping bg-red-400 opacity-75"></span>
                                      <span className="absolute h-3 w-3 rounded-full animate-pulse bg-red-500"></span>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                            <span
                              className={`text-base font-medium ${
                                item.active ? "text-blue-600" : "text-gray-900"
                              }`}
                            >
                              {item.label}
                            </span>
                          </div>
                          {item.active && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Additional Menu Items */}
                  <div className="py-4 border-t border-gray-200">
                    <button className="flex items-center w-full px-6 py-4 text-base font-medium text-gray-900 hover:bg-gray-50 transition-all duration-200">
                      <Settings className="h-6 w-6 text-gray-600 mr-4" />
                      Settings & Privacy
                    </button>

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full px-6 py-4 text-base font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
                    >
                      <LogOut className="h-6 w-6 mr-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-6 space-y-4">
                  <Link href="/auth/login">
                    <Button
                      variant="ghost"
                      className="w-full justify-center font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 py-3 rounded-xl"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button
                      className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Join now
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
