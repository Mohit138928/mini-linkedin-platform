"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "./Card";
import { Button } from "./Button";
import { getInitials } from "@/lib/utils";
import {
  Users,
  FileText,
  Search,
  X,
  MessageSquare,
  Heart,
  User,
  Clock,
} from "lucide-react";

export function SearchResults({
  results,
  isVisible,
  onClose,
  searchQuery,
  loading,
}) {
  if (!isVisible && !loading) return null;

  const hasResults =
    results && (results.users?.length > 0 || results.posts?.length > 0);

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

  return (
    <AnimatePresence>
      {(isVisible || loading) && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 right-0 mt-2 z-50"
        >
          <Card className="shadow-xl border border-gray-200 bg-white/95 backdrop-blur-sm max-h-96 overflow-hidden">
            <CardContent className="p-0">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {loading ? "Searching..." : `Results for "${searchQuery}"`}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-6 w-6 p-0 hover:bg-gray-200 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">
                    Searching for users and posts...
                  </p>
                </div>
              ) : !hasResults ? (
                <div className="p-8 text-center">
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">
                    No results found for "{searchQuery}"
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Try searching for different names or keywords
                  </p>
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto">
                  {/* Users Section */}
                  {results.users?.length > 0 && (
                    <div className="p-2">
                      <div className="flex items-center gap-2 px-3 py-2 mb-2 bg-blue-50 rounded-lg">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-semibold text-blue-700">
                          People
                        </span>
                        <span className="text-xs text-blue-500 ml-auto">
                          {results.users.length} found
                        </span>
                      </div>
                      {results.users.map((user, index) => (
                        <motion.div
                          key={user.firebaseUid || user._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            href={`/profile/${user.firebaseUid}`}
                            onClick={onClose}
                          >
                            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-all duration-200 cursor-pointer group border border-transparent hover:border-blue-200">
                              {user.profilePicture ? (
                                <img
                                  src={user.profilePicture}
                                  alt={user.name}
                                  className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200 group-hover:ring-blue-300 transition-all duration-200"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm ring-2 ring-gray-200 group-hover:ring-blue-300 transition-all duration-200">
                                  {getInitials(user.name)}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors duration-200">
                                  {user.name}
                                </p>
                                <p className="text-sm text-gray-500 truncate">
                                  {user.headline || user.bio || "Professional"}
                                </p>
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <User className="h-4 w-4 text-blue-500" />
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Posts Section */}
                  {results.posts?.length > 0 && (
                    <div className="p-2 border-t border-gray-100">
                      <div className="flex items-center gap-2 px-3 py-2 mb-2 bg-green-50 rounded-lg">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-700">
                          Posts
                        </span>
                        <span className="text-xs text-green-500 ml-auto">
                          {results.posts.length} found
                        </span>
                      </div>
                      {results.posts.map((post, index) => (
                        <motion.div
                          key={post.postId || post._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 + 0.1 }}
                        >
                          <Link href={`/post/${post.postId}`} onClick={onClose}>
                            <div className="p-3 rounded-lg hover:bg-green-50 transition-all duration-200 cursor-pointer group border border-transparent hover:border-green-200">
                              <div className="flex items-start gap-3">
                                {post.authorProfilePicture ? (
                                  <img
                                    src={post.authorProfilePicture}
                                    alt={post.authorName}
                                    className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-gray-200 group-hover:ring-green-300 transition-all duration-200"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0 ring-2 ring-gray-200 group-hover:ring-green-300 transition-all duration-200">
                                    {getInitials(post.authorName)}
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="text-sm font-medium text-gray-700 group-hover:text-green-700 transition-colors duration-200">
                                      {post.authorName}
                                    </p>
                                    <Clock className="h-3 w-3 text-gray-400" />
                                    <p className="text-xs text-gray-400">
                                      {formatTimeAgo(post.timestamp)}
                                    </p>
                                  </div>
                                  <p className="text-sm text-gray-900 line-clamp-2 group-hover:text-gray-700 transition-colors duration-200">
                                    {post.content}
                                  </p>
                                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <Heart className="h-3 w-3" />
                                      {post.likeCount || 0}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <MessageSquare className="h-3 w-3" />
                                      {post.commentCount || 0}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* View All Results Link */}
                  {hasResults && (
                    <div className="p-3 border-t border-gray-100 bg-gray-50">
                      <Link
                        href={`/search?q=${encodeURIComponent(searchQuery)}`}
                        onClick={onClose}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-center hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                        >
                          <Search className="h-4 w-4 mr-2" />
                          View all results ({results.total})
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
