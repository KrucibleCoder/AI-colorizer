import { useState } from "react";
import {
  uploadImage as uploadService,
  deleteAllImages,
  downloadImage,
} from "../services/imageService";

export default function useImageProcessor() {
  const [file, setFile] = useState(null);
  const [mode, setMode] = useState("enhance");
  const [originalUrl, setOriginalUrl] = useState("");
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({});
  const [msg, setMsg] = useState("");

  /* =========================
     Helpers
  ========================= */
  function initScoresForVariants(vars, setScores) {
    const s = {};
    vars.forEach((v) => {
      s[v] = 100;
    });
    setScores(s);
  }

  /* =========================
     Upload
  ========================= */
  async function uploadImage(setScores, setFeedbackStatus, setFeedbackComment) {
    if (!file) {
      setMsg("Please select an image first.");
      setFeedbackStatus?.("error");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMsg("File too large.");
      setFeedbackStatus?.("error");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const data = await uploadService(file, mode);

      // IMPORTANT: attach backend base URL if needed
      const original = data.original.startsWith("http")
        ? data.original
        : `http://127.0.0.1:8000${data.original}`;

      const variantsFull = data.variants.map((v) =>
        v.startsWith("http") ? v : `http://127.0.0.1:8000${v}`
      );

      setOriginalUrl(original);
      setVariants(variantsFull);

      setDownloadProgress({});
      initScoresForVariants(variantsFull, setScores);

      setMsg("✅ Variants generated.");
      setFeedbackComment?.("");
      setFeedbackStatus?.("success");
    } catch (err) {
      console.error(err);
      setMsg("❌ Upload failed.");
      setFeedbackStatus?.("error");
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     Delete
  ========================= */
  async function deleteAll(setScores, setFeedbackComment, setFeedbackStatus) {
    try {
      await deleteAllImages();

      setFile(null);
      setOriginalUrl("");
      setVariants([]);
      setDownloadProgress({});
      setScores?.({});
      setFeedbackComment?.("");
      setFeedbackStatus?.(null);

      setMsg("🧹 Cleared.");
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to clear.");
      setFeedbackStatus?.("error");
    }
  }

  /* =========================
     Download
  ========================= */
  async function forceDownload(url, filename) {
    try {
      const blob = await downloadImage(url);

      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      setMsg("❌ Download failed.");
    }
  }

  

  return {
    file,
    setFile,
    mode,
    setMode,
    originalUrl,
    variants,
    loading,
    msg,
    downloadProgress,
    setDownloadProgress,
    setMsg,

    uploadImage,
    deleteAll,
    forceDownload,
  };
}