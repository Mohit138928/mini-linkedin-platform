"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "./Card";
import { Button } from "./Button";
import { Textarea } from "./Textarea";
import {
  Send,
  Image,
  Video,
  FileText,
  Calendar,
  MoreHorizontal,
  X,
} from "lucide-react";

export function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const { user } = useAuth();

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

  useEffect(() => {
    // Cleanup function to reset scroll when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setLoading(true);
    try {
      // Prepare media data for backend
      const mediaData = selectedMedia.map((item) => ({
        type: item.type,
        url: item.url,
        name: item.name,
        publicId: item.publicId,
        size: item.size,
        resourceType: item.resourceType,
      }));

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content.trim(),
          authorId: user.uid,
          authorName: user.displayName || user.email,
          media: mediaData,
        }),
      });

      if (response.ok) {
        setContent("");
        setSelectedMedia([]);
        setShowModal(false);
        onPostCreated?.();
      } else {
        const errorData = await response.json();
        console.error("Post creation failed:", errorData);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMediaSelect = async (type) => {
    const input = document.createElement("input");
    input.type = "file";

    if (type === "image") {
      input.accept = "image/*";
    } else if (type === "video") {
      input.accept = "video/*";
    } else if (type === "document") {
      input.accept = ".pdf,.doc,.docx,.txt";
    }

    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          const mediaItem = {
            type,
            id: Date.now() + Math.random(),
            url: data.url,
            name: data.fileName || file.name,
            publicId: data.publicId,
            size: data.fileSize || file.size,
            resourceType: data.resourceType,
          };
          setSelectedMedia([...selectedMedia, mediaItem]);
        } else {
          const errorData = await response.json();
          console.error("Upload failed:", errorData.message || "Unknown error");
          alert("Upload failed: " + (errorData.message || "Unknown error"));
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Error uploading file: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    input.click();
  };

  const openModal = () => {
    setShowModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setShowModal(false);
    setContent("");
    setSelectedMedia([]);
    document.body.style.overflow = "unset";
  };

  const removeMedia = (id) => {
    setSelectedMedia(selectedMedia.filter((item) => item.id !== id));
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserAvatar = () => {
    if (userProfile?.profilePicture) {
      return (
        <img
          src={userProfile.profilePicture}
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover"
        />
      );
    }

    return (
      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
        {getInitials(user?.displayName || user?.email)}
      </div>
    );
  };

  if (!user) return null;

  return (
    <>
      {/* Main Create Post Card */}
      <Card className="mb-6 bg-white">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            {getUserAvatar()}
            <div
              className="flex-1 border border-gray-300 rounded-full px-4 py-3 text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={openModal}
            >
              What do you want to talk about?
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={openModal}
              className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:bg-gray-100 flex-1 justify-center px-2 sm:px-4"
            >
              <Image className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <span className="hidden sm:inline text-sm">Photo</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={openModal}
              className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:bg-gray-100 flex-1 justify-center px-2 sm:px-4"
            >
              <Video className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              <span className="hidden sm:inline text-sm">Video</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={openModal}
              className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:bg-gray-100 flex-1 justify-center px-2 sm:px-4"
            >
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
              <span className="hidden sm:inline text-sm">Document</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={openModal}
              className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:bg-gray-100 flex-1 justify-center px-2 sm:px-4"
            >
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              <span className="hidden sm:inline text-sm">Event</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                {getUserAvatar()}
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {userProfile?.firstName && userProfile?.lastName
                      ? `${userProfile.firstName} ${userProfile.lastName}`
                      : user?.displayName || user?.email}
                  </h3>
                  <p className="text-sm text-gray-500">Post to anyone</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeModal}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-600" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-4 max-h-96 overflow-y-auto">
              <Textarea
                placeholder="What do you want to talk about?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="border-none resize-none focus:ring-0 p-0 text-lg placeholder-gray-500 min-h-[120px] active:ring-0 text-black"
                rows={5}
              />

              {/* Selected Media Preview */}
              {selectedMedia.length > 0 && (
                <div className="mt-4 space-y-2">
                  {selectedMedia.map((item) => (
                    <div
                      key={item.url}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        {item.type === "image" && (
                          <>
                            <Image className="h-5 w-5 text-green-600" />
                            {item.url && (
                              <img
                                src={item.url}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                          </>
                        )}
                        {item.type === "video" && (
                          <Video className="h-5 w-5 text-red-600" />
                        )}
                        {item.type === "document" && (
                          <FileText className="h-5 w-5 text-blue-600" />
                        )}
                        {item.type === "event" && (
                          <Calendar className="h-5 w-5 text-purple-600" />
                        )}
                        <div className="flex-1">
                          <span className="text-sm text-gray-700 block">
                            {item.name}
                          </span>
                          {item.size && (
                            <span className="text-xs text-gray-500">
                              {(item.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeMedia(item.url)}
                        className="h-6 w-6 p-0 hover:bg-gray-200"
                      >
                        <X className="h-4 w-4 text-gray-600" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200">
              {/* Media Options */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">Add to your post</span>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMediaSelect("image")}
                    disabled={loading}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                  >
                    <Image className="h-5 w-5 text-blue-600" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMediaSelect("video")}
                    disabled={loading}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                  >
                    <Video className="h-5 w-5 text-green-600" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMediaSelect("document")}
                    disabled={loading}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                  >
                    <FileText className="h-5 w-5 text-orange-600" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMediaSelect("event")}
                    disabled={loading}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                  >
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </Button>
                </div>
              </div>

              {/* Post Button */}
              <Button
                onClick={handleSubmit}
                disabled={!content.trim() || loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300"
              >
                {loading ? "Uploading..." : "Post"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
