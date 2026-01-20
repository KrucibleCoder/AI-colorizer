import { useMemo, useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE = "http://127.0.0.1:8000";

export default function App() {
  const [file, setFile] = useState(null);
  const [mode, setMode] = useState("enhance");
  const [originalUrl, setOriginalUrl] = useState("");
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const selectedFileName = useMemo(() => file?.name || "No file selected", [file]);

  async function handleUpload() {
    if (!file) {
      setMsg("Please select an image first.");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(`${API_BASE}/api/upload?mode=${mode}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setOriginalUrl(`${API_BASE}${res.data.original}`);
      setVariants(res.data.variants.map((v) => `${API_BASE}${v}`));
      setMsg(`✅ Done! Generated 3 variants (${mode}).`);
    } catch (err) {
      console.error(err);
      setMsg("❌ Upload failed. Check backend is running.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteAll() {
    setLoading(true);
    try {
      await axios.delete(`${API_BASE}/api/delete_all`);
      setOriginalUrl("");
      setVariants([]);
      setFile(null);
      setMsg("🧹 Cleared uploads + outputs.");
    } catch (err) {
      console.error(err);
      setMsg("❌ Delete failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <h1 className="title">AI Image Colorizer</h1>
          <p className="subtitle">
            Upload a photo, choose a preset, preview variants, download what you like.
          </p>
        </div>

        <div className="chip">
          <span className="dot" />
          <span>Local API</span>
        </div>
      </header>

      <main className="grid">
        {/* Left: Controls */}
        <section className="card">
          <h2 className="cardTitle">Workspace</h2>

          <div className="controlGroup">
            <label className="label">Upload image</label>

            <label className="fileBox">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                disabled={loading}
              />
              <div className="fileBoxInner">
                <div className="fileIcon">📷</div>
                <div className="fileText">
                  <div className="fileName">{selectedFileName}</div>
                  <div className="fileHint">PNG, JPG, JPEG, WEBP</div>
                </div>
              </div>
            </label>
          </div>

          <div className="controlGroup">
            <label className="label">Mode</label>
            <select
              className="select"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              disabled={loading}
            >
              <option value="enhance">Enhance Only</option>
              <option value="colorize">Colorize Only</option>
              <option value="both">Enhance + Colorize</option>
            </select>
          </div>

          <div className="actions">
            <button className="btn btnPrimary" onClick={handleUpload} disabled={loading}>
              {loading ? (
                <span className="btnRow">
                  <span className="spinner" />
                  Processing...
                </span>
              ) : (
                "Generate Variants"
              )}
            </button>

            <button className="btn btnDanger" onClick={handleDeleteAll} disabled={loading}>
              Delete All
            </button>
          </div>

          {msg && <div className="message">{msg}</div>}

          <div className="tips">
            <div className="tipTitle">Tips</div>
            <ul>
              <li>Try old photos with low contrast for best “wow”.</li>
              <li>Use “Both” for enhanced color + sharpness.</li>
              <li>Hit “Delete All” to clear server storage.</li>
            </ul>
          </div>
        </section>

        {/* Right: Previews */}
        <section className="card">
          <div className="cardHeaderRow">
            <h2 className="cardTitle">Preview</h2>
            <span className="muted">{variants.length ? "Results ready" : "Waiting for upload"}</span>
          </div>

          {!originalUrl && (
            <div className="empty">
              <div className="emptyIcon">🖼️</div>
              <div className="emptyTitle">No image yet</div>
              <div className="emptyText">Upload an image and generate variants to preview them here.</div>
            </div>
          )}

          {originalUrl && (
            <>
              <div className="previewBlock">
                <div className="previewHeader">
                  <span className="badge">Original</span>
                  <a className="link" href={originalUrl} target="_blank" rel="noreferrer">
                    Open full
                  </a>
                </div>
                <img className="image" src={originalUrl} alt="original" />
              </div>

              <div className="variantsHeader">
                <h3 className="variantsTitle">Variants</h3>
              </div>

              <div className="variantsGrid">
                {variants.map((url, idx) => (
                  <div key={url} className="variantCard">
                    <div className="variantTop">
                      <span className="badge">Variant {idx + 1}</span>
                      <div className="variantLinks">
                        <a className="link" href={url} target="_blank" rel="noreferrer">
                          Open
                        </a>
                        <a className="link" href={url} download>
                          Download
                        </a>
                      </div>
                    </div>

                    <img className="image" src={url} alt={`variant-${idx + 1}`} />
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      <footer className="footer">
        <span>Built with FastAPI + React</span>
        <span className="muted">MVP UI polish pass</span>
      </footer>
    </div>
  );
}
