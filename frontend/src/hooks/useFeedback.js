import { useState } from "react";
import { submitSingleFeedback } from "../services/feedbackService";

export default function useFeedback(variants) {
  const [scores, setScores] = useState({});
  const [feedbackComment, setFeedbackComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  /* =========================
     Submit feedback
  ========================= */
  async function submitFeedback(setMsg) {
    if (variants.length === 0) {
      setMsg("No variants.");
      setStatus("error");
      return;
    }

    setSubmitting(true);
    setStatus(null);

    let success = 0;

    try {
      for (let i = 0; i < variants.length; i++) {
        const score = Math.max(0, Math.min(100, scores[variants[i]] ?? 100));

        try {
          await submitSingleFeedback({
            image: variants[i],
            label: `Variant ${i + 1}`,
            score,
            comment: feedbackComment,
          });

          success++;
        } catch (err) {
          console.warn("Single feedback failed", err);
        }
      }

      if (success === variants.length) {
        setStatus("success");
        setMsg("✅ Feedback submitted.");
        setFeedbackComment("");
      } else if (success > 0) {
        setStatus("partial");
        setMsg("⚠️ Partial success.");
      } else {
        setStatus("error");
        setMsg("❌ Submission failed.");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMsg("❌ Feedback error.");
    } finally {
      setSubmitting(false);
    }
  }

  return {
    scores,
    setScores,
    feedbackComment,
    setFeedbackComment,
    submitting,
    status,
    setStatus,
    submitFeedback,
  };
}