// src/services/api.js

const API_BASE = "http://127.0.0.1:8000";

async function request(url, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${url}`, options);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    // Try JSON, fallback to blob
    const contentType = res.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      return await res.json();
    }

    return await res.blob();
  } catch (err) {
    console.error("API error:", err);
    throw err;
  }
}

export { request, API_BASE };