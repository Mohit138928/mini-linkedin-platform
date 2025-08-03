"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { PostCard } from "@/components/PostCard";
import { Card, CardContent } from "@/components/Card";
import { ArrowLeft, Share, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function PostPage({ params }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${params.postId}`);

        if (response.ok) {
          const postData = await response.json();
          setPost(postData);

          // Update page title and meta tags for SEO
          if (postData) {
            document.title = `${postData.authorName}'s Post - Mini LinkedIn`;

            // Update meta description
            const metaDescription = document.querySelector(
              'meta[name="description"]'
            );
            if (metaDescription) {
              metaDescription.setAttribute(
                "content",
                `${postData.content.substring(0, 150)}... - Shared by ${
                  postData.authorName
                } on Mini LinkedIn Platform`
              );
            } else {
              const meta = document.createElement("meta");
              meta.name = "description";
              meta.content = `${postData.content.substring(
                0,
                150
              )}... - Shared by ${
                postData.authorName
              } on Mini LinkedIn Platform`;
              document.head.appendChild(meta);
            }

            // Add Open Graph tags for social sharing
            const addOrUpdateMetaTag = (property, content) => {
              let meta = document.querySelector(`meta[property="${property}"]`);
              if (meta) {
                meta.setAttribute("content", content);
              } else {
                meta = document.createElement("meta");
                meta.setAttribute("property", property);
                meta.setAttribute("content", content);
                document.head.appendChild(meta);
              }
            };

            addOrUpdateMetaTag(
              "og:title",
              `${postData.authorName}'s Post - Mini LinkedIn`
            );
            addOrUpdateMetaTag(
              "og:description",
              postData.content.substring(0, 200)
            );
            addOrUpdateMetaTag(
              "og:url",
              `${window.location.origin}/post/${postData.postId}`
            );
            addOrUpdateMetaTag("og:type", "article");
            if (
              postData.media &&
              postData.media.length > 0 &&
              postData.media[0].type === "image"
            ) {
              addOrUpdateMetaTag("og:image", postData.media[0].url);
            }
          }
        } else {
          setError("Post not found");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    if (params.postId) {
      fetchPost();
    }
  }, [params.postId]);

  const handleShare = async () => {
    if (!post || !user) return;

    try {
      const currentUrl = window.location.href;

      if (navigator.share) {
        await navigator.share({
          title: `Post by ${post.authorName}`,
          text: post.content.substring(0, 100) + "...",
          url: currentUrl,
        });
      } else {
        await navigator.clipboard.writeText(currentUrl);
        alert("Post URL copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleSend = () => {
    if (!post) return;

    const currentUrl = window.location.href;
    const subject = `Check out this post by ${post.authorName}`;
    const body = `${post.content}\n\nView the full post: ${currentUrl}`;

    window.location.href = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Post Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              {error ||
                "The post you're looking for doesn't exist or has been removed."}
            </p>
            <Link href="/feed">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Feed
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center space-x-2 text-black"
            >
              <Share className="h-4 w-4 text-black" />
              <span>Share</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSend}
              className="flex items-center space-x-2 text-black"
            >
              <Send className="h-4 w-4 text-black" />
              <span>Send</span>
            </Button>
          </div>
        </div>

        {/* Post */}
        <PostCard post={post} isDetailView={true} onPostUpdate={setPost} />
      </div>
    </div>
  );
}
