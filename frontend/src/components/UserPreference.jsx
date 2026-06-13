const API_BASE = "http://127.0.0.1:8000";

export default function UserPreference() {
  return (
    <div className="reviewPanel">
      <h2 className="reviewTitle">User Preference</h2>
      <p className="reviewSubtitle">
        Aggregated feedback from sentiment analysis
      </p>

      <div className="reviewGlass">
        <div className="reviewGraphWrapper">
          <img
            src={`${API_BASE}/api/reviews/summary`}
            alt="User Preference graph"
          />
        </div>
      </div>

      <p className="reviewNote">
        This graph updates automatically as users submit feedback.
      </p>
    </div>
  );
}