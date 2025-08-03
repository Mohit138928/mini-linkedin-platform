"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Textarea } from "@/components/Textarea";
import { LoadingSpinner } from "@/components/LoadingComponents";
import { Camera, Upload, X } from "lucide-react";
import Image from "next/image";

export default function ProfileCompletionPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    headline: "",
    bio: "",
    profilePicture: "",
  });

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Pre-fill with existing user data if available
    setFormData((prev) => ({
      ...prev,
      name: user.displayName || "",
    }));
  }, [user, router]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file before upload
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    setUploadingImage(true);
    setError("");

    try {
      console.log(
        "Starting upload for file:",
        file.name,
        "Size:",
        file.size,
        "Type:",
        file.type
      );

      const formDataObj = new FormData();
      formDataObj.append("profilePicture", file);

      console.log("Sending request to /api/upload/profile-picture");
      const response = await fetch("/api/upload/profile-picture", {
        method: "POST",
        body: formDataObj,
      });

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload failed with response:", errorText);

        // Try to parse as JSON, fallback to text
        let errorMessage = "Failed to upload image";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `Upload failed (${
            response.status
          }): ${errorText.substring(0, 100)}...`;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Upload successful:", data);

      setFormData((prev) => ({
        ...prev,
        profilePicture: data.url,
      }));
    } catch (error) {
      console.error("Upload error:", error);
      setError(error.message || "Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!formData.name.trim()) {
      setError("Full name is required");
      setLoading(false);
      return;
    }
    if (!formData.headline.trim()) {
      setError("Headline is required");
      setLoading(false);
      return;
    }
    if (!formData.bio.trim()) {
      setError("Bio is required");
      setLoading(false);
      return;
    }
    if (!formData.profilePicture) {
      setError("Profile picture is required");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/users/complete-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firebaseUid: user.uid,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to complete profile");
      }

      // Redirect to home page after successful profile completion
      router.push("/");
    } catch (error) {
      setError("Failed to complete profile. Please try again.");
      console.error("Profile completion error:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeProfilePicture = () => {
    setFormData((prev) => ({
      ...prev,
      profilePicture: "",
    }));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600">
            Let&apos;s set up your professional profile to get started
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {/* Profile Picture Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Profile Picture *
                </label>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {formData.profilePicture ? (
                      <div className="relative">
                        <Image
                          src={formData.profilePicture}
                          alt="Profile"
                          width={100}
                          height={100}
                          className="rounded-full object-cover border-4 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={removeProfilePicture}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300">
                        <Camera className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="profilePicture"
                      disabled={uploadingImage}
                    />
                    <label
                      htmlFor="profilePicture"
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploadingImage ? "Uploading..." : "Upload Photo"}
                    </label>
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name *
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              {/* Headline */}
              <div>
                <label
                  htmlFor="headline"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Professional Headline *
                </label>
                <Input
                  id="headline"
                  name="headline"
                  type="text"
                  value={formData.headline}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Software Engineer at Google"
                  maxLength={120}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.headline.length}/120 characters
                </p>
              </div>

              {/* Bio */}
              <div>
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  About You *
                </label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  required
                  placeholder="Tell us about your professional background, skills, and interests..."
                  rows={5}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.bio.length}/500 characters
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || uploadingImage}
              >
                {loading ? "Completing Profile..." : "Complete Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
