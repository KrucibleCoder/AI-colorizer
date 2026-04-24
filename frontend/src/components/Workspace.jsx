import { useMemo } from "react";

export default function Workspace({
  file,
  setFile,
  mode,
  setMode,
  loading,
  uploadImage,
  deleteAll,
  setMsg,
  setDownloadProgress,
  setScores,
  setFeedbackStatus,
  setFeedbackComment,
}) {
  const selectedFileName = useMemo(
    () => file?.name || "No file selected",
    [file]
  );

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
            setMsg("");
            setFeedbackStatus?.(null);
            setDownloadProgress({});
            setFeedbackComment?.("");
            setScores?.({});
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
          onClick={() =>
            uploadImage(setScores, setFeedbackStatus, setFeedbackComment)
          }
          disabled={loading}
        >
          {loading ? "Processing..." : "Generate Variants"}
        </button>

        <button
          className="btn btnDanger"
          onClick={() =>
            deleteAll(setScores, setFeedbackComment, setFeedbackStatus)
          }
        >
          Delete All
        </button>
      </div>
    </section>
  );
}