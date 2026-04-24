
export default function Preview({ originalUrl, variants, loading }) {
  console.log("Preview variants:", variants);
  return (
    
    <section className="card">
      <h2 className="cardTitle">Preview</h2>

      {/* Empty */}
      {!originalUrl && variants.length === 0 && !loading && (
        <div className="empty">
          <div className="emptyIcon">🖼️</div>
          <div className="emptyTitle">No image yet</div>
          <div className="emptyText">
            Upload an image and generate variants to preview them here.
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="empty">
          <div className="emptyIcon">⏳</div>
          <div className="emptyTitle">Processing image…</div>
        </div>
      )}

      {/* Original */}
      {originalUrl && (
        <div className="previewBlock">
          <span className="badge">Original</span>
          <img className="image" src={originalUrl} alt="Original" />
        </div>
      )}

      {/* ✅ VARIANTS (THIS WAS MISSING) */}
      {variants.length > 0 && (
        <div className="variantsGrid">
          {variants.map((url, idx) => (
            <div key={url} className="previewBlock">
              <span className="badge">Variant {idx + 1}</span>
              <img src={url} className="image" alt={`Variant ${idx + 1}`} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}