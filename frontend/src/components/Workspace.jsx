import { useMemo } from "react";

const API_BASE = "http://127.0.0.1:8000";

export default function Workspace({
  file,
  setFile,
  mode,
  setMode,
  loading,
  setLoading,
  setOriginalUrl,
  setVariants,
  setMsg,
  setFeedbackStatus,
  setDownloadProgress,
  setFeedbackComment,
  setScores,
  initScoresForVariants,
}) {
  const selectedFileName = useMemo(
    () => file?.name || "No file selected",
    [file]
  );

  async function handleUpload() {
    if (loading) return;

    if (!file) {
      setMsg("Please select an image first.");
      setFeedbackStatus("error");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMsg("File too large. Please upload an image under 10MB.");
      setFeedbackStatus("error");
      return;
    }

    setLoading(true);
    setMsg("");
    setFeedbackStatus(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_BASE}/api/upload?mode=${mode}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      setOriginalUrl(`${API_BASE}${data.original}`);
      const vs = data.variants.map((v) => `${API_BASE}${v}`);
      setVariants(vs);

      setDownloadProgress({});
      initScoresForVariants(vs);

      setMsg(`✅ Generated results using "${mode}" mode.`);
      setFeedbackComment("");
    } catch (err) {
      console.error(err);
      setMsg("❌ Upload failed. Check backend.");
      setFeedbackStatus("error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteAll() {
    const confirmed = window.confirm(
      "Are you sure you want to delete all generated images?\n\nThis action cannot be undone."
    );
    if (!confirmed) return;

    setLoading(true);

    try {
      await fetch(`${API_BASE}/api/delete_all`, {
        method: "DELETE",
      });

      setOriginalUrl("");
      setVariants([]);
      setFile(null);
      setDownloadProgress({});
      setScores({});
      setFeedbackComment("");
      setFeedbackStatus(null);
      setMsg("🧹 All generated images were deleted.");
    } catch (err) {
      console.error(err);
      setMsg("❌ Delete failed.");
      setFeedbackStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card">
      <h2 className="cardTitle">Workspace</h2>

      <label className="fileBox">
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          disabled={loading}
          onChange={(e) => {
            setFile(e.target.files?.[0] || null);
            setOriginalUrl("");
            setVariants([]);
            setMsg("");
            setFeedbackStatus(null);
            setDownloadProgress({});
            setFeedbackComment("");
            setScores({});
          }}
        />
        <div className="fileBoxInner">
          <div className="fileIcon">📷</div>
          <div className="fileText">
            <div className="fileName">{selectedFileName}</div>
            <div className="fileHint">PNG, JPG, WEBP</div>
          </div>
        </div>
      </label>

      <div className="controlGroup">
        <label className="label">Mode</label>
        <select
          className="select"
          value={mode}
          disabled={loading}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="enhance">Enhance Only</option>
          <option value="colorize">Colorize Only</option>
          <option value="both">Enhance + Colorize</option>
        </select>
      </div>

      <div className="actions">
        <button
          className="btn btnPrimary"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Processing..." : "Generate Variants"}
        </button>

        <button
          className="btn btnDanger"
          onClick={handleDeleteAll}
        >
          Delete All
        </button>
      </div>
    </section>
  );
}