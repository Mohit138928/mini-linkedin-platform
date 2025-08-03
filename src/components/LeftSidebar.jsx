"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "./Card";
import { Button } from "./Button";
import {
  User,
  Eye,
  BarChart3,
  Bookmark,
  Users,
  Mail,
  Calendar,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export function LeftSidebar() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    profileViews: 0,
    postImpressions: 0,
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      // Generate some random stats for demo
      setStats({
        profileViews: Math.floor(Math.random() * 100) + 50,
        postImpressions: Math.floor(Math.random() * 500) + 200,
      });
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/users/${user.uid}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
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

  if (!user || !profile) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Profile Card */}
      <Card className="overflow-hidden">
        <div className="h-16 bg-black"></div>
        <CardContent className="p-6 -mt-8">
          <div className="text-center">
            <div className="relative inline-block mb-4">
              {profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt={profile.name}
                  className="w-16 h-16 rounded-full border-4 border-white object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full border-4 border-white bg-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                  {getInitials(profile.name)}
                </div>
              )}
            </div>
            <Link href={`/profile/${user.uid}`} className="hover:underline">
              <h3 className="font-semibold text-gray-900 mb-1">
                {profile.name}
              </h3>
            </Link>
            {profile.headline && (
              <p className="text-sm text-gray-600 mb-4">{profile.headline}</p>
            )}
          </div>

          <div className="border-t pt-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                Profile viewers
              </span>
              <span className="font-semibold text-blue-600">
                {stats.profileViews}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Post impressions
              </span>
              <span className="font-semibold text-blue-600">
                {stats.postImpressions}
              </span>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-sm text-gray-600 hover:bg-gray-50 p-2"
            >
              <Bookmark className="h-4 w-4 mr-3" />
              Saved items
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links Card */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Recent</h4>
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-sm text-gray-600 hover:bg-gray-50 p-2"
            >
              <Users className="h-4 w-4 mr-3" />
              Groups
              <ChevronRight className="h-4 w-4 ml-auto" />
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm text-gray-600 hover:bg-gray-50 p-2"
            >
              <Mail className="h-4 w-4 mr-3" />
              Newsletters
              <ChevronRight className="h-4 w-4 ml-auto" />
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm text-gray-600 hover:bg-gray-50 p-2"
            >
              <Calendar className="h-4 w-4 mr-3" />
              Events
              <ChevronRight className="h-4 w-4 ml-auto" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Discover More Card */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Discover</h4>
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-sm text-blue-600 hover:bg-blue-50 p-2"
            >
              # JavaScript
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm text-blue-600 hover:bg-blue-50 p-2"
            >
              # React
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm text-blue-600 hover:bg-blue-50 p-2"
            >
              # WebDevelopment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
