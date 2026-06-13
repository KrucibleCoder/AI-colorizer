const VARIANT_LABELS = ["Natural", "Vivid", "Warm"];

export default function Feedback({
  variants,
  loading,
  scores,
  setScores,
  feedbackComment,
  setFeedbackComment,
  submittingFeedback,
  submitAllFeedback,
  initScoresForVariants,
  setFeedbackStatus,
  setMsg,
}) {
  const SKELETON_COUNT = 3;

  return (
    <section className="comparisonCarousel">
      <h2 className="carouselTitle">Reviews</h2>

      <div className="feedbackGrid">
        {loading
          ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div key={i} className="feedbackRow skeleton-card">
                <div className="skeleton skeleton-line short" />
                <div className="skeleton skeleton-line" />
              </div>
            ))
          : variants.map((url, idx) => {
              const label = VARIANT_LABELS[idx] || `Variant ${idx + 1}`;
              const value = scores[url] ?? 100;

              return (
                <div key={url} className="feedbackRow">
                  <div className="feedbackLabel">{label}</div>

                  <div className="feedbackSliderRow">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={value}
                      onChange={(e) =>
                        setScores((s) => ({
                          ...s,
                          [url]: Number(e.target.value),
                        }))
                      }
                    />
                    <div className="sliderValue">{value}%</div>
                  </div>
                </div>
              );
            })}
      </div>

      {!loading && (
        <div style={{ marginTop: 12 }}>
          <textarea
            className="feedbackTextarea"
            placeholder="Optional feedback..."
            value={feedbackComment}
            onChange={(e) => setFeedbackComment(e.target.value)}
          />

          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
            <button
              className="btn btnPrimary"
              onClick={submitAllFeedback}
              disabled={submittingFeedback}
            >
              {submittingFeedback ? "Submitting..." : "Submit Feedback"}
            </button>

            <button
              className="btn"
              onClick={() => {
                setFeedbackComment("");
                setScores({});
                initScoresForVariants(variants);
                setFeedbackStatus(null);
                setMsg("");
              }}
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </section>
  );
}