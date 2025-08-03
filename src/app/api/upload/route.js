const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function POST(request) {
  try {
    console.log("Frontend upload API route hit");
    const formData = await request.formData();
    console.log("Formdata received, forwarding to backend...");

    // Forward the request to the backend server
    const backendResponse = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    // Check if the response is HTML (error page) instead of JSON
    const contentType = backendResponse.headers.get("content-type");
    console.log("Backend response status:", backendResponse.status);
    console.log("Backend response content-type:", contentType);

    if (!backendResponse.ok) {
      let errorMessage = "Upload failed";

      if (contentType && contentType.includes("application/json")) {
        try {
          const errorData = await backendResponse.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          console.error("Error parsing backend error response:", parseError);
        }
      } else {
        // If it's HTML, it's likely a server error page
        const htmlError = await backendResponse.text();
        console.error("Backend returned HTML instead of JSON:", htmlError);
        errorMessage = `Backend server error (${backendResponse.status})`;
      }

      return Response.json(
        { message: errorMessage },
        { status: backendResponse.status }
      );
    }

    if (contentType && contentType.includes("application/json")) {
      const data = await backendResponse.json();
      return Response.json(data);
    } else {
      throw new Error("Backend did not return JSON response");
    }
  } catch (error) {
    console.error("Upload error:", error);

    // More specific error messages
    if (error.code === "ECONNREFUSED") {
      return Response.json(
        {
          message:
            "Backend server is not running. Please start the backend server.",
        },
        { status: 503 }
      );
    }

    return Response.json(
      {
        message: error.message || "An error occurred during upload",
      },
      { status: 500 }
    );
  }
}
