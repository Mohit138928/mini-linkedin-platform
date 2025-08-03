const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function POST(request) {
  try {
    const body = await request.json();

    const response = await fetch(
      `${API_BASE_URL}/users/complete-profile`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json(data, { status: response.status });
    }

    return Response.json(data);
  } catch (error) {
    console.error("Complete profile error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
