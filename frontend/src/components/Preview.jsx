export default function Preview({ originalUrl, variants, loading }) {
  return (
    <section className="card">
      <h2 className="cardTitle">Preview</h2>

      {!originalUrl && variants.length === 0 && !loading && (
        <div className="empty">
          <div className="emptyIcon">🖼️</div>
          <div className="emptyTitle">No image yet</div>
          <div className="emptyText">
            Upload an image and generate variants to preview them here.
          </div>
        </div>
      )}

      {loading && (
        <div className="empty">
          <div className="emptyIcon">⏳</div>
          <div className="emptyTitle">Processing image…</div>
        </div>
      )}

      {originalUrl && (
        <div className="previewBlock">
          <span className="badge">Original</span>
          <img className="image" src={originalUrl} alt="Original" />
        </div>
      )}
    </section>
  );
}