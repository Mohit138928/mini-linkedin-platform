"use client";
import { useState, useEffect } from "react";
import { PostCard } from "./PostCard";
import { CreatePost } from "./CreatePost";

export function PostFeed({ userId = null }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const url = userId ? `/api/posts?userId=${userId}` : "/api/posts";
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse"
          >
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                <div className="space-y-2 mt-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!userId && <CreatePost onPostCreated={fetchPosts} />}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center text-gray-500 py-8 bg-white rounded-lg border border-gray-200">
            {userId
              ? "No posts yet."
              : "No posts to show. Be the first to post!"}
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onPostUpdate={(updatedPost) => {
                if (updatedPost === null) {
                  // Post was deleted
                  setPosts((prevPosts) =>
                    prevPosts.filter((p) => p._id !== post._id)
                  );
                } else if (typeof updatedPost === "function") {
                  // Post was updated
                  setPosts((prevPosts) =>
                    prevPosts.map((p) =>
                      p._id === post._id ? { ...p, ...updatedPost(p) } : p
                    )
                  );
                } else {
                  // Direct post update
                  setPosts((prevPosts) =>
                    prevPosts.map((p) =>
                      p._id === post._id ? { ...p, ...updatedPost } : p
                    )
                  );
                }
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
