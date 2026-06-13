// src/services/feedbackService.js

import { request } from "./api";

export async function submitSingleFeedback(payload) {
  return await request("/api/reviews", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}