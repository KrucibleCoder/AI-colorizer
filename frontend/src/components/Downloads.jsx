const VARIANT_LABELS = ["Natural", "Vivid", "Warm"];

export default function Downloads({
  variants,
  loading,
  downloadProgress,
  forceDownloadWithProgress,
  downloadAllAsZip,
}) {
  const SKELETON_COUNT = 3;

  return (
    <section className="comparisonCarousel">
      <h2 className="carouselTitle">Downloads</h2>

      <div className="downloadGrid">
        {loading
          ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div key={i} className="downloadCard skeleton-card">
                <div className="downloadTop">
                  <div className="skeleton skeleton-button" />
                </div>
                <div className="thumbWrapper">
                  <div className="skeleton skeleton-thumb" />
                </div>
              </div>
            ))
          : variants.map((url, idx) => {
              const progress = downloadProgress[url];
              const label = VARIANT_LABELS[idx] || `Variant ${idx + 1}`;

              return (
                <div key={url} className="downloadCard">
                  <div className="downloadTop">
                    <button
                      className="btnSmall"
                      onClick={() =>
                        forceDownloadWithProgress(url, `${label}.jpg`)
                      }
                    >
                      Download
                    </button>
                  </div>

                  <div className="thumbWrapper">
                    <img className="thumb" src={url} alt={label} />

                    {progress !== undefined && progress < 100 && (
                      <div className="progressOverlay">
                        <div
                          className="progressFill"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="downloadLabel">{label}</div>
                </div>
              );
            })}
      </div>

      {!loading && variants.length > 0 && (
        <div style={{ marginTop: 12, textAlign: "center" }}>
          <button
            className="btn btnPrimary btnSmall"
            onClick={downloadAllAsZip}
          >
            Download All as ZIP
          </button>
        </div>
      )}
    </section>
  );
}