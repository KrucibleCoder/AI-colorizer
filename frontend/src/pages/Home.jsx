import { useEffect } from "react";

import Workspace from "../components/Workspace";
import Preview from "../components/Preview";
import Downloads from "../components/Downloads";
import Feedback from "../components/Feedback";
import Carousel from "../components/Carousel";
import UserPreference from "../components/UserPreference";

import useImageProcessor from "../hooks/useImageProcessor";
import useFeedback from "../hooks/useFeedback";

export default function Home() {
  const img = useImageProcessor();
  const fb = useFeedback(img.variants);

  /* cleanup on refresh */
  useEffect(() => {
    const cleanup = () => {
      navigator.sendBeacon("http://127.0.0.1:8000/api/delete_all");
    };

    window.addEventListener("beforeunload", cleanup);
    return () => window.removeEventListener("beforeunload", cleanup);
  }, []);

  

  return (
    <div className="page">
      <header className="topbar">
        <h1 className="title">AI Image Colorizer</h1>
      </header>

      <main className="grid">
        <Workspace
          {...img}
          setScores={fb.setScores}
          setFeedbackStatus={fb.setStatus}
          setFeedbackComment={fb.setFeedbackComment}
        />

        <Preview
          originalUrl={img.originalUrl}
          variants={img.variants}
          loading={img.loading}
        />
      </main>
      
      {(img.loading || img.variants.length > 0) && (
        <section className="comparisonAndReviews">
          <Downloads
            variants={img.variants}
            loading={img.loading}
            downloadProgress={img.downloadProgress}
            forceDownload={img.forceDownload}
          />
      
          <Feedback
            variants={img.variants}
            scores={fb.scores}
            setScores={fb.setScores}
            feedbackComment={fb.feedbackComment}
            setFeedbackComment={fb.setFeedbackComment}
            submitting={fb.submitting}
            status={fb.status}
            submitAllFeedback={() => fb.submitFeedback(img.setMsg)}
          />
        </section>
      )}
      
      <section className="comparisonAndReviews">
        <Carousel />
        <UserPreference />
      </section>
    </div>
  );
}