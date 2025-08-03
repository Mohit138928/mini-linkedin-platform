import { NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    // console.log("Frontend search API called with query:", query);
    // console.log("Backend URL:", API_BASE_URL);

    if (!query || query.trim().length < 2) {
      //   console.log("Query too short, returning empty results");
      return NextResponse.json({
        users: [],
        posts: [],
        total: 0,
      });
    }

    let users = [];
    let posts = [];

    // Search users
    try {
      const usersUrl = `${API_BASE_URL}/users/search?q=${encodeURIComponent(
        query
      )}`;
      //   console.log("Searching users at:", usersUrl);

      const usersResponse = await fetch(usersUrl);
      //   console.log("Users response status:", usersResponse.status);

      if (usersResponse.ok) {
        users = await usersResponse.json();
        console.log(
          "Found users:",
          users.length,
          users.map((u) => u.name || u._id)
        );
      } else {
        const errorText = await usersResponse.text();
        console.log("Users search failed:", errorText);
      }
    } catch (error) {
      console.error("Error searching users:", error);
    }

    // Search posts
    try {
      const postsUrl = `${API_BASE_URL}/posts/search?q=${encodeURIComponent(
        query
      )}`;
      //console.log("Searching posts at:", postsUrl);

      const postsResponse = await fetch(postsUrl);
      console.log("Posts response status:", postsResponse.status);

      if (postsResponse.ok) {
        posts = await postsResponse.json();
        console.log("Found posts:", posts.length);
      } else {
        const errorText = await postsResponse.text();
        console.log("Posts search failed:", errorText);
      }
    } catch (error) {
      console.error("Error searching posts:", error);
    }

    const results = {
      users: users.slice(0, 5),
      posts: posts.slice(0, 3),
      total: users.length + posts.length,
    };

    console.log("✅ Final search results:", {
      userCount: results.users.length,
      postCount: results.posts.length,
      total: results.total,
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to perform search", users: [], posts: [], total: 0 },
      { status: 500 }
    );
  }
}
