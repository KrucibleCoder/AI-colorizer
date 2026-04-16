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
      fetch("http://127.0.0.1:8000/api/delete_all", {
        method: "DELETE",
        keepalive: true,
      });
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

      <section className="comparisonAndReviews">
        <Downloads
          variants={img.variants}
          loading={img.loading}
          downloadProgress={img.downloadProgress}
          forceDownloadWithProgress={img.forceDownload}
        />

        <Feedback
          variants={img.variants}
          {...fb}
          submitAllFeedback={() => fb.submitFeedback(img.setMsg)}
        />
      </section>

      <section className="comparisonAndReviews">
        <Carousel />
        <UserPreference />
      </section>
    </div>
  );
}