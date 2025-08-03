"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { getInitials } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Users,
  FileText,
  Filter,
  SortAsc,
  User,
  MessageSquare,
  Heart,
  Clock,
  ArrowLeft,
  Loader2,
  Grid,
  List,
} from "lucide-react";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("list");
  const [sortBy, setSortBy] = useState("relevance");

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (query) => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`
      );
      if (response.ok) {
        const results = await response.json();
        setSearchResults(results);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery);
      // Update URL without page refresh
      window.history.pushState(
        {},
        "",
        `/search?q=${encodeURIComponent(searchQuery)}`
      );
    }
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "";
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInMs = now - postTime;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) return `${diffInDays}d ago`;
    if (diffInHours > 0) return `${diffInHours}h ago`;
    return "Just now";
  };

  const getFilteredResults = () => {
    if (!searchResults) return { users: [], posts: [] };

    switch (activeTab) {
      case "people":
        return { users: searchResults.users || [], posts: [] };
      case "posts":
        return { users: [], posts: searchResults.posts || [] };
      default:
        return searchResults;
    }
  };

  const filteredResults = getFilteredResults();
  const totalResults =
    (filteredResults.users?.length || 0) + (filteredResults.posts?.length || 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Search Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>

            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for people, posts, companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 text-base rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </form>
          </div>

          {/* Results Summary */}
          {searchResults && !loading && (
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  Search Results
                </h1>
                <p className="text-gray-600">
                  {totalResults} result{totalResults !== 1 ? "s" : ""} for
                  &quot;{initialQuery || searchQuery}&quot;
                </p>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-none border-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-none border-0"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex items-center gap-1 border-b border-gray-200">
            {[
              { key: "all", label: "All", count: totalResults },
              {
                key: "people",
                label: "People",
                count: searchResults?.users?.length || 0,
              },
              {
                key: "posts",
                label: "Posts",
                count: searchResults?.posts?.length || 0,
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600">Searching...</p>
          </div>
        )}

        {/* No Results */}
        {!loading && searchResults && totalResults === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No results found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or browse all content
              </p>
              <Link href="/">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Back to Feed
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {!loading && searchResults && totalResults > 0 && (
          <div className="space-y-6">
            {/* People Results */}
            {filteredResults.users?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    People
                  </h2>
                  <span className="text-sm text-gray-500">
                    ({filteredResults.users.length} found)
                  </span>
                </div>

                <div
                  className={`grid gap-4 ${
                    viewMode === "grid"
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1"
                  }`}
                >
                  {filteredResults.users.map((user, index) => (
                    <motion.div
                      key={user.firebaseUid || user._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-gray-300">
                        <CardContent className="p-6">
                          <Link href={`/profile/${user.firebaseUid}`}>
                            <div className="flex items-center gap-4 group cursor-pointer">
                              {user.profilePicture ? (
                                <img
                                  src={user.profilePicture}
                                  alt={user.name}
                                  className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-200 group-hover:ring-blue-300 transition-all duration-200"
                                />
                              ) : (
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold ring-2 ring-gray-200 group-hover:ring-blue-300 transition-all duration-200">
                                  {getInitials(user.name)}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors duration-200">
                                  {user.name}
                                </h3>
                                <p className="text-sm text-gray-500 truncate">
                                  {user.headline || user.bio || "Professional"}
                                </p>
                                <div className="flex items-center gap-4 mt-2">
                                  <Button
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                  >
                                    Connect
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-gray-300"
                                  >
                                    Message
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Posts Results */}
            {filteredResults.posts?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-green-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Posts</h2>
                  <span className="text-sm text-gray-500">
                    ({filteredResults.posts.length} found)
                  </span>
                </div>

                <div className="space-y-4">
                  {filteredResults.posts.map((post, index) => (
                    <motion.div
                      key={post.postId || post._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-gray-300">
                        <CardContent className="p-6">
                          <Link href={`/post/${post.postId}`}>
                            <div className="group cursor-pointer">
                              <div className="flex items-start gap-4 mb-4">
                                {post.authorProfilePicture ? (
                                  <img
                                    src={post.authorProfilePicture}
                                    alt={post.authorName}
                                    className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200 group-hover:ring-green-300 transition-all duration-200"
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold ring-2 ring-gray-200 group-hover:ring-green-300 transition-all duration-200">
                                    {getInitials(post.authorName)}
                                  </div>
                                )}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors duration-200">
                                      {post.authorName}
                                    </h3>
                                    <Clock className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-500">
                                      {formatTimeAgo(post.timestamp)}
                                    </span>
                                  </div>
                                  <p className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors duration-200">
                                    {post.content}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2 text-gray-500">
                                  <Heart className="h-4 w-4" />
                                  <span className="text-sm">
                                    {post.likeCount || 0} likes
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-500">
                                  <MessageSquare className="h-4 w-4" />
                                  <span className="text-sm">
                                    {post.commentCount || 0} comments
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Initial State */}
        {!searchResults && !loading && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Start your search
              </h3>
              <p className="text-gray-600">
                Enter keywords to find people, posts, and opportunities
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
