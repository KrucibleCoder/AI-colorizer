// src/services/imageService.js

import { request, API_BASE } from "./api";

export async function uploadImage(file, mode) {
  const formData = new FormData();
  formData.append("file", file);

  const data = await request(`/api/upload?mode=${mode}`, {
    method: "POST",
    body: formData,
  });

  return {
    original: `${API_BASE}${data.original}`,
    variants: data.variants.map((v) => `${API_BASE}${v}`),
  };
}

export async function deleteAllImages() {
  return await request("/api/delete_all", {
    method: "DELETE",
  });
}

export async function downloadImage(url) {
  const res = await fetch(url);
  return await res.blob();
}