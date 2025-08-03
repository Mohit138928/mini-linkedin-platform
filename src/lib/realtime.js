// Real-time updates using Server-Sent Events
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function createEventSource(postId, onUpdate) {
  if (typeof window === "undefined") return null;

  const eventSource = new EventSource(`${API_BASE_URL}/posts/${postId}/events`);

  eventSource.onmessage = function (event) {
    try {
      const data = JSON.parse(event.data);
      onUpdate(data);
    } catch (error) {
      console.error("Error parsing SSE data:", error);
    }
  };

  eventSource.onerror = function (error) {
    console.error("SSE connection error:", error);
  };

  return eventSource;
}

export function closeEventSource(eventSource) {
  if (eventSource) {
    eventSource.close();
  }
}

// Polling fallback for real-time updates
export function createPollingInterval(postId, onUpdate, interval = 5000) {
  const pollPost = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`);
      if (response.ok) {
        const post = await response.json();
        onUpdate(post);
      }
    } catch (error) {
      console.error("Polling error:", error);
    }
  };

  const intervalId = setInterval(pollPost, interval);
  return intervalId;
}

export function clearPollingInterval(intervalId) {
  if (intervalId) {
    clearInterval(intervalId);
  }
}
