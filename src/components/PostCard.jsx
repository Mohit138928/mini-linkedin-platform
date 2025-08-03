"use client";
import Link from "next/link";
import { Card, CardContent } from "./Card";
import { Button } from "./Button";
import { Input } from "./Input";
import { MediaCarousel } from "./MediaCarousel";
import { formatDate, getInitials } from "@/lib/utils";
import { createPollingInterval, clearPollingInterval } from "@/lib/realtime";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  ThumbsUp,
  MessageCircle,
  Share,
  MoreHorizontal,
  Globe,
  Play,
  Download,
  Heart,
  Trash2,
  X,
  FileText,
  Image,
  Video,
  Send,
  Edit3,
  ChevronDown,
} from "lucide-react";

export function PostCard({
  post,
  isDetailView = false,
  onPostUpdate,
  enableRealtime = true,
}) {
  const [authorProfile, setAuthorProfile] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);
  const [shareCount, setShareCount] = useState(post.shareCount || 0);
  const [showComments, setShowComments] = useState(isDetailView);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState("");
  const [loadingComment, setLoadingComment] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content || "");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const pollingIntervalRef = useRef(null);
  const dropdownRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAuthorProfile = async () => {
      if (post.authorId) {
        try {
          const response = await fetch(`/api/users/${post.authorId}`);
          if (response.ok) {
            const userData = await response.json();
            setAuthorProfile(userData);
          }
        } catch (error) {
          console.error("Error fetching author profile:", error);
        }
      }
    };

    fetchAuthorProfile();
  }, [post.authorId]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const response = await fetch(`/api/users/${user.uid}`);
          if (response.ok) {
            const userData = await response.json();
            setUserProfile(userData);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  // Handle keyboard events for modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && showMediaModal) {
        closeMediaModal();
      }
    };

    if (showMediaModal) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [showMediaModal]);

  useEffect(() => {
    // Check if current user has liked this post
    if (post.likes && user) {
      const userLike = post.likes.find((like) => like.userId === user.uid);
      setLiked(!!userLike);
    }
  }, [post.likes, user]);

  // Real-time updates for likes and comments
  useEffect(() => {
    if (!enableRealtime || !post.postId || isDetailView) return;

    const handleRealtimeUpdate = (updatedPost) => {
      // Only update if there are actual changes
      if (
        updatedPost.likeCount !== likeCount ||
        updatedPost.commentCount !== commentCount ||
        updatedPost.shareCount !== shareCount
      ) {
        setLikeCount(updatedPost.likeCount || 0);
        setCommentCount(updatedPost.commentCount || 0);
        setShareCount(updatedPost.shareCount || 0);
        setComments(updatedPost.comments || []);

        // Update liked status for current user
        if (updatedPost.likes && user) {
          const userLike = updatedPost.likes.find(
            (like) => like.userId === user.uid
          );
          setLiked(!!userLike);
        }

        // Notify parent component
        if (onPostUpdate) {
          onPostUpdate(updatedPost);
        }
      }
    };

    // Start polling for updates every 15 seconds (less frequent to reduce server load)
    pollingIntervalRef.current = createPollingInterval(
      post.postId,
      handleRealtimeUpdate,
      15000
    );

    return () => {
      if (pollingIntervalRef.current) {
        clearPollingInterval(pollingIntervalRef.current);
      }
    };
  }, [
    post.postId,
    enableRealtime,
    isDetailView,
    user,
    onPostUpdate,
    likeCount,
    commentCount,
    shareCount,
  ]);

  const handleLike = async () => {
    if (!user || loadingLike || !post.postId) return;

    setLoadingLike(true);

    // Optimistic update
    const wasLiked = liked;
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));

    try {
      const response = await fetch(`/api/posts/${post.postId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          userName: user.displayName || user.email,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked);
        setLikeCount(data.likeCount);

        // Update the parent if in detail view
        if (onPostUpdate) {
          onPostUpdate((prev) => ({
            ...prev,
            likes: data.likes,
            likeCount: data.likeCount,
          }));
        }
      } else {
        // Revert optimistic update on error
        setLiked(wasLiked);
        setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1));
        console.error("Failed to toggle like");
      }
    } catch (error) {
      // Revert optimistic update on error
      setLiked(wasLiked);
      setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1));
      console.error("Error toggling like:", error);
    } finally {
      setLoadingLike(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user || !newComment.trim() || loadingComment || !post.postId) return;

    setLoadingComment(true);
    try {
      const response = await fetch(`/api/posts/${post.postId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment.trim(),
          authorId: user.uid,
          authorName: user.displayName || user.email,
          authorAvatar: userProfile?.profilePicture,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments((prev) => [...prev, data.comment]);
        setCommentCount(data.commentCount);
        setNewComment("");

        // Update the parent if in detail view
        if (onPostUpdate) {
          onPostUpdate((prev) => ({
            ...prev,
            comments: [...prev.comments, data.comment],
            commentCount: data.commentCount,
          }));
        }
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoadingComment(false);
    }
  };

  const handleShare = async () => {
    if (!user || !post.postId) return;

    try {
      const response = await fetch(`/api/posts/${post.postId}/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          userName: user.displayName || user.email,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setShareCount(data.shareCount);

        // Copy share URL to clipboard
        const shareUrl = `${window.location.origin}/post/${post.postId}`;

        if (navigator.share) {
          // Use native sharing if available
          await navigator.share({
            title: `Post by ${post.authorName}`,
            text: post.content.substring(0, 100) + "...",
            url: shareUrl,
          });
        } else {
          // Fallback to copying to clipboard
          await navigator.clipboard.writeText(shareUrl);
          alert("Post URL copied to clipboard!");
        }

        // Update the parent if in detail view
        if (onPostUpdate) {
          onPostUpdate((prev) => ({
            ...prev,
            shareCount: data.shareCount,
          }));
        }
      } else {
        console.error("Share failed");
      }
    } catch (error) {
      console.error("Error sharing post:", error);
      // Fallback: just copy URL
      const shareUrl = `${window.location.origin}/post/${post.postId}`;
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Post URL copied to clipboard!");
      } catch (clipboardError) {
        console.error("Clipboard access denied");
      }
    }
  };

  const deleteComment = async (commentId) => {
    if (!user || !post.postId) return;

    try {
      const response = await fetch(
        `/api/posts/${post.postId}/comment/${commentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.uid,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentId)
        );
        setCommentCount(data.commentCount);

        if (onPostUpdate) {
          onPostUpdate((prev) => ({
            ...prev,
            comments: prev.comments.filter(
              (comment) => comment._id !== commentId
            ),
            commentCount: data.commentCount,
          }));
        }
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleDeletePost = async () => {
    if (!user || !post.postId || loadingDelete) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone."
    );

    if (!confirmDelete) return;

    setLoadingDelete(true);

    try {
      const response = await fetch(`/api/posts/${post.postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
        }),
      });

      if (response.ok) {
        // If we have a callback to update the parent component
        if (onPostUpdate) {
          onPostUpdate(null); // Signal that post was deleted
        } else {
          // Fallback: refresh the page if no callback is provided
          window.location.reload();
        }
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to delete post. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    } finally {
      setLoadingDelete(false);
      setShowDropdown(false);
    }
  };

  const handleEditPost = async () => {
    if (!user || !post.postId || loadingEdit || !editContent.trim()) return;

    setLoadingEdit(true);

    try {
      const response = await fetch(`/api/posts/${post.postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          content: editContent.trim(),
        }),
      });

      if (response.ok) {
        const updatedPost = await response.json();

        // Update local state
        if (onPostUpdate) {
          onPostUpdate((prev) => ({
            ...prev,
            content: updatedPost.content,
            updatedAt: updatedPost.updatedAt,
          }));
        }

        setIsEditing(false);
        setShowDropdown(false);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to update post. Please try again.");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post. Please try again.");
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(post.content || "");
    setShowDropdown(false);
  };

  // Check if current user is the post author
  const isPostOwner = user && user.uid === post.authorId;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const openMediaModal = (mediaItem) => {
    setSelectedMedia(mediaItem);
    setShowMediaModal(true);
  };

  const closeMediaModal = () => {
    setShowMediaModal(false);
    setSelectedMedia(null);
  };

  const getAuthorAvatar = () => {
    if (authorProfile?.profilePicture) {
      return (
        <Link href={`/profile/${post.authorId}`}>
          <img
            src={authorProfile.profilePicture}
            alt="Profile"
            className="h-12 w-12 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
          />
        </Link>
      );
    }

    return (
      <Link href={`/profile/${post.authorId}`}>
        <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-lg cursor-pointer hover:ring-2 hover:ring-blue-600 transition-all">
          {getInitials(post.authorName)}
        </div>
      </Link>
    );
  };

  const getUserAvatar = () => {
    if (userProfile?.profilePicture) {
      return (
        <img
          src={userProfile.profilePicture}
          alt="Your profile"
          className="h-8 w-8 rounded-full object-cover"
        />
      );
    }

    return (
      <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
        {getInitials(user?.displayName || user?.email || "User")}
      </div>
    );
  };

  const getDocumentIcon = (fileName) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return <FileText className="h-6 w-6 text-red-600" />;
      case "doc":
      case "docx":
        return <FileText className="h-6 w-6 text-blue-600" />;
      case "xls":
      case "xlsx":
        return <FileText className="h-6 w-6 text-green-600" />;
      case "ppt":
      case "pptx":
        return <FileText className="h-6 w-6 text-orange-600" />;
      case "txt":
        return <FileText className="h-6 w-6 text-gray-600" />;
      default:
        return <FileText className="h-6 w-6 text-blue-600" />;
    }
  };

  return (
    <Card className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-4 pb-3">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">{getAuthorAvatar()}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <Link href={`/profile/${post.authorId}`}>
                    <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors">
                      {authorProfile?.firstName && authorProfile?.lastName
                        ? `${authorProfile.firstName} ${authorProfile.lastName}`
                        : post.authorName}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500">
                    {authorProfile?.headline || "Professional"}
                  </p>
                  <div className="flex items-center text-xs text-gray-400 mt-1">
                    {post.postId ? (
                      <Link
                        href={`/post/${post.postId}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        <span>{formatDate(post.createdAt)}</span>
                      </Link>
                    ) : (
                      <span>{formatDate(post.createdAt)}</span>
                    )}
                    {post.updatedAt && post.updatedAt !== post.createdAt && (
                      <>
                        <span className="mx-1">•</span>
                        <span className="text-gray-500">edited</span>
                      </>
                    )}
                    <span className="mx-1">•</span>
                    <Globe className="h-3 w-3 mr-1" />
                    {enableRealtime && !isDetailView && (
                      <>
                        <span className="mx-1">•</span>
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-green-400 mr-1" />
                          <span className="text-xs">Live</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {/* Dropdown Menu for Post Actions */}
                {isPostOwner && (
                  <div className="relative" ref={dropdownRef}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>

                    {showDropdown && (
                      <div className="absolute right-0 top-8 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50 sm:z-10">
                        <button
                          onClick={() => {
                            setIsEditing(true);
                            setShowDropdown(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Edit3 className="h-4 w-4 mr-3" />
                          Edit post
                        </button>
                        <button
                          onClick={handleDeletePost}
                          disabled={loadingDelete}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4 mr-3" />
                          {loadingDelete ? "Deleting..." : "Delete post"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-3">
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    handleCancelEdit();
                  } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    if (editContent.trim() && !loadingEdit) {
                      handleEditPost();
                    }
                  }
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                placeholder="What's on your mind?"
                autoFocus
              />
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  Press Ctrl+Enter to save, Esc to cancel
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    disabled={loadingEdit}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleEditPost}
                    disabled={loadingEdit || !editContent.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loadingEdit ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
              {post.content}
            </p>
          )}
        </div>

        {/* Media - Using MediaCarousel */}
        {post.media && post.media.length > 0 && (
          <div className="px-4 pb-3">
            <MediaCarousel
              media={post.media}
              onMediaClick={openMediaModal}
              className="rounded-lg overflow-hidden"
            />
          </div>
        )}

        {/* Engagement Stats */}
        <div className="px-4 py-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-600 rounded-full flex items-center justify-center mr-1">
                  <ThumbsUp className="h-2 w-2 sm:h-3 sm:w-3 text-white" />
                </div>
                <span className="text-xs sm:text-sm">{likeCount} likes</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => setShowComments(!showComments)}
                className="hover:text-blue-600 cursor-pointer text-xs sm:text-sm"
              >
                {commentCount} comments
              </button>
              <span className="hover:text-blue-600 cursor-pointer text-xs sm:text-sm">
                {shareCount} shares
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 py-2 border-t border-gray-100">
          <div className="flex items-center justify-around">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={loadingLike || !user}
              className={`flex-1 flex items-center justify-center space-x-1 sm:space-x-2 py-3 rounded-none ${
                liked
                  ? "text-blue-600 hover:bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <ThumbsUp
                className={`h-4 w-4 sm:h-5 sm:w-5 ${
                  liked ? "fill-current" : ""
                }`}
              />
              <span className="font-medium text-sm sm:text-base">Like</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="flex-1 flex items-center justify-center space-x-1 sm:space-x-2 py-3 text-gray-600 hover:bg-gray-50 rounded-none"
            >
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="font-medium text-sm sm:text-base">Comment</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              disabled={!user}
              className="flex-1 flex items-center justify-center space-x-1 sm:space-x-2 py-3 text-gray-600 hover:bg-gray-50 rounded-none relative"
            >
              <Share className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="font-medium text-sm sm:text-base">Share</span>
            </Button>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="px-4 pb-4 border-t border-gray-100">
            {/* Comment Form */}
            {user && (
              <form onSubmit={handleComment} className="mt-4 mb-4">
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">{getUserAvatar()}</div>
                  <div className="flex-1 relative">
                    <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 focus-within:bg-white focus-within:ring-0 focus-within:border-transparent transition-all">
                      <Input
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 bg-transparent border-none outline-none ring-0 focus:ring-0 focus:border-none shadow-none px-0"
                        disabled={loadingComment}
                      />
                      {newComment.trim() && (
                        <Button
                          type="submit"
                          size="sm"
                          disabled={loadingComment}
                          className="ml-2 bg-blue-600 hover:bg-blue-700 rounded-full h-8 w-8 p-0 flex items-center justify-center"
                        >
                          {loadingComment ? (
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment._id} className="flex space-x-3">
                  <div className="flex-shrink-0">
                    {comment.authorAvatar ? (
                      <img
                        src={comment.authorAvatar}
                        alt={comment.authorName}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center text-white text-sm font-medium">
                        {getInitials(comment.authorName)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {comment.authorName}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {formatDate(comment.createdAt)}
                          </span>
                          {user &&
                            (comment.authorId === user.uid ||
                              post.authorId === user.uid) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteComment(comment._id)}
                                className="h-6 w-6 p-0 text-gray-400 hover:text-red-600"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-800">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Full-Screen Media Modal */}
        {showMediaModal && selectedMedia && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
            onClick={closeMediaModal}
          >
            <div className="relative max-w-full max-h-full p-4">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={closeMediaModal}
                className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full h-10 w-10 p-0"
              >
                <X className="h-6 w-6" />
              </Button>

              {/* Media Content */}
              <div
                className="flex items-center justify-center max-w-screen-lg max-h-screen"
                onClick={(e) => e.stopPropagation()}
              >
                {selectedMedia.type === "image" && (
                  <div className="relative">
                    <img
                      src={selectedMedia.url}
                      alt={selectedMedia.name}
                      className="max-w-full max-h-[90vh] object-contain rounded-lg"
                    />
                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg">
                      <p className="text-sm font-medium">
                        {selectedMedia.name}
                      </p>
                    </div>
                  </div>
                )}

                {selectedMedia.type === "video" && (
                  <div className="relative">
                    <video
                      src={selectedMedia.url}
                      className="max-w-full max-h-[90vh] object-contain rounded-lg"
                      controls
                      autoPlay
                    />
                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg">
                      <p className="text-sm font-medium">
                        {selectedMedia.name}
                      </p>
                    </div>
                  </div>
                )}

                {selectedMedia.type === "document" && (
                  <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        {getDocumentIcon(selectedMedia.name)}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {selectedMedia.name}
                      </h3>
                      {selectedMedia.size && (
                        <p className="text-sm text-gray-500 mb-4">
                          Size: {(selectedMedia.size / 1024).toFixed(1)} KB
                        </p>
                      )}
                    </div>

                    {/* PDF Preview */}
                    {selectedMedia.name.toLowerCase().endsWith(".pdf") ? (
                      <div className="mb-4">
                        <iframe
                          src={selectedMedia.url}
                          className="w-full h-96 border border-gray-300 rounded-lg"
                          title={selectedMedia.name}
                        />
                      </div>
                    ) : (
                      <div className="text-center text-gray-600 mb-4">
                        <p>Preview not available for this file type.</p>
                        <p>Click "Open Document" to view in a new tab.</p>
                      </div>
                    )}

                    <div className="flex space-x-3 justify-center">
                      <Button
                        onClick={() => window.open(selectedMedia.url, "_blank")}
                        className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Open Document</span>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = selectedMedia.url;
                          link.download = selectedMedia.name;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="flex items-center space-x-2"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
