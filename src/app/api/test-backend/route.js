const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}`);

    if (!response.ok) {
      return Response.json(
        {
          message: "Backend server not reachable",
          status: response.status,
        },
        { status: 500 }
      );
    }

    const data = await response.json();
    return Response.json({
      message: "Backend server is running",
      backend: data,
    });
  } catch (error) {
    return Response.json(
      {
        message: "Failed to connect to backend server",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
