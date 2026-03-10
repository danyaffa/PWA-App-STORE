import React, { useEffect, useState } from "react";
import { APP_NAME } from "../lib/appConfig.js";

const DEFAULT_IOS_REVIEW_URL =
  import.meta.env.VITE_IOS_REVIEW_URL ||
  "https://apps.apple.com/app/idYOUR_APP_ID?action=write-review";

const DEFAULT_ANDROID_REVIEW_URL =
  import.meta.env.VITE_ANDROID_REVIEW_URL ||
  "https://play.google.com/store/apps/details?id=your.package.name&reviewId=0";

/* ── inline styles ─────────────────────────────────────────── */

const pillStyle = {
  position: "fixed",
  bottom: 24,
  right: 24,
  zIndex: 40,
  background: "#ffffff",
  color: "#0f172a",
  padding: "8px 16px",
  borderRadius: 999,
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
  fontWeight: 600,
  fontSize: 14,
  display: "flex",
  alignItems: "center",
  gap: 6,
  cursor: "pointer",
  border: "1px solid #e2e8f0",
  maxWidth: "calc(100vw - 220px)",
};

const basePanelStyle = {
  background: "#1e293b",
  color: "#f9fafb",
  borderRadius: 16,
  boxShadow: "0 25px 50px rgba(15, 23, 42, 0.5)",
  width: 360,
  maxWidth: "100%",
  padding: 20,
};

const floatingPanelStyle = {
  position: "fixed",
  bottom: 90,
  right: 24,
  zIndex: 200,
};

const embeddedPanelStyle = {
  position: "relative",
  margin: "0 auto",
  width: "100%",
  maxWidth: 520,
};

const closeButtonStyle = {
  position: "absolute",
  top: 10,
  right: 10,
  background: "transparent",
  border: "none",
  color: "#9ca3af",
  cursor: "pointer",
  fontSize: 16,
};

const starRowStyle = {
  display: "flex",
  gap: 8,
  margin: "8px 0 12px 0",
};

const starButtonStyle = {
  width: 32,
  height: 32,
  borderRadius: 999,
  border: "1px solid #4b5563",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 18,
  cursor: "pointer",
  background: "#0f172a",
  color: "#fbbf24",
};

const textareaStyle = {
  width: "100%",
  minHeight: 90,
  borderRadius: 10,
  border: "1px solid #4b5563",
  background: "#0f172a",
  color: "#f9fafb",
  padding: "8px 10px",
  fontSize: 14,
  resize: "vertical",
};

const submitButtonStyle = {
  width: "100%",
  marginTop: 10,
  borderRadius: 999,
  border: "none",
  padding: "10px 14px",
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
  background:
    "linear-gradient(135deg, rgba(94,234,212,1), rgba(129,140,248,1))",
  color: "#0f172a",
};

const subtleTextStyle = {
  fontSize: 11,
  color: "#9ca3af",
  marginTop: 8,
  lineHeight: 1.4,
};

const badgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontSize: 12,
  padding: "3px 8px",
  borderRadius: 999,
  background: "rgba(15, 23, 42, 0.75)",
  color: "#e5e7eb",
  border: "1px solid rgba(75, 85, 99, 0.8)",
};

const statsRowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: 10,
  gap: 8,
  flexWrap: "wrap",
};

/* ── helpers ───────────────────────────────────────────────── */

function Star({ filled, size = 18 }) {
  return (
    <span
      style={{
        color: filled ? "#facc15" : "#4b5563",
        fontSize: size,
        lineHeight: 1,
      }}
    >
      ★
    </span>
  );
}

/* ── main component ────────────────────────────────────────── */

export default function ReviewWidget({
  appName,
  appStoreUrl,
  variant = "floating",
  defaultOpen = false,
}) {
  const initialState =
    variant === "embedded" && defaultOpen ? "open" : "idle";

  const [widgetState, setWidgetState] = useState(initialState);
  const [rating, setRating] = useState(null);
  const [hoverRating, setHoverRating] = useState(null);
  const [comment, setComment] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [reviewCount, setReviewCount] = useState(null);
  const [averageRating, setAverageRating] = useState(null);

  const effectiveAppName = appName || APP_NAME;
  const iosReviewUrl = appStoreUrl || DEFAULT_IOS_REVIEW_URL;
  const androidReviewUrl = DEFAULT_ANDROID_REVIEW_URL;

  useEffect(() => {
    let isMounted = true;

    async function fetchStats() {
      try {
        const res = await fetch("/api/review-stats");
        if (!res.ok) return;
        const data = await res.json();
        if (!isMounted) return;
        if (data?.success) {
          setReviewCount(data.count ?? null);
          setAverageRating(
            typeof data.average === "number" ? data.average : null
          );
        }
      } catch {
        // silent
      }
    }

    fetchStats();
    const interval = setInterval(fetchStats, 60_000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const openWidget = () => {
    setWidgetState(hasSubmitted ? "thankyou" : "open");
  };

  const closeWidget = () => {
    if (variant === "embedded") return;
    setWidgetState("idle");
  };

  const openStoreReviewPage = () => {
    if (typeof window === "undefined") return;
    const ua = window.navigator.userAgent || "";
    let targetUrl = iosReviewUrl;
    if (/Android/i.test(ua)) targetUrl = androidReviewUrl;
    else if (/iPhone|iPad|iPod/i.test(ua)) targetUrl = iosReviewUrl;
    window.open(targetUrl, "_blank");
  };

  const handleSubmit = async () => {
    if (!rating) {
      alert("Please choose a star rating first.");
      return;
    }

    setWidgetState("submitting");

    try {
      const res = await fetch("/api/review-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          text: comment,
          email: "",
          appName: effectiveAppName,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit feedback");

      setHasSubmitted(true);
      setWidgetState("thankyou");

      if (rating >= 4) setTimeout(() => openStoreReviewPage(), 4000);
    } catch {
      alert("Sorry, something went wrong. Please try again later.");
      setWidgetState("open");
    }
  };

  /* ── sub-renders ───────────────────────────────────────── */

  const renderFloatingButton = () => {
    if (variant !== "floating") return null;
    if (widgetState === "open" || widgetState === "submitting") return null;

    return (
      <button type="button" style={pillStyle} onClick={openWidget}>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 999,
            background:
              "radial-gradient(circle at 30% 30%, #a5b4fc, #22d3ee)",
            boxShadow: "0 0 0 4px rgba(56,189,248,0.4)",
          }}
        />
        <span>How is {effectiveAppName} working for you?</span>
      </button>
    );
  };

  const renderStars = () => {
    const current = hoverRating ?? rating;
    return (
      <div style={starRowStyle}>
        {[1, 2, 3, 4, 5].map((value) => {
          const filled = current != null && current >= value;
          return (
            <button
              key={value}
              type="button"
              style={starButtonStyle}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(null)}
              onClick={() => setRating(value)}
            >
              <Star filled={filled} />
            </button>
          );
        })}
      </div>
    );
  };

  const renderStatsRow = () => {
    const showBadges = reviewCount != null || averageRating != null;
    if (!showBadges) return null;

    return (
      <div style={statsRowStyle}>
        {averageRating != null && (
          <div style={badgeStyle}>
            <Star filled size={16} />
            <span>
              {averageRating.toFixed(1)} / 5 · {effectiveAppName}
            </span>
          </div>
        )}
        {reviewCount != null && reviewCount > 0 && (
          <div style={badgeStyle}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                backgroundColor: "#4ade80",
              }}
            />
            <span>{reviewCount} reviews logged</span>
          </div>
        )}
      </div>
    );
  };

  const renderPanel = () => {
    const visible = variant === "embedded" ? true : widgetState !== "idle";
    if (!visible) return null;

    const isSubmitting = widgetState === "submitting";
    const isThankYou = widgetState === "thankyou";
    const outerStyle =
      variant === "floating" ? floatingPanelStyle : embeddedPanelStyle;

    return (
      <div style={outerStyle}>
        <div style={{ ...basePanelStyle, position: "relative" }}>
          <button
            type="button"
            style={closeButtonStyle}
            onClick={closeWidget}
            aria-label="Close review widget"
          >
            ✕
          </button>

          {isThankYou ? (
            <>
              <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>
                Thank you for your feedback!
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.5 }}>
                We really appreciate you taking the time to share your
                experience with {effectiveAppName}. Your feedback helps us
                prioritise new features and improvements.
              </div>
              <div style={subtleTextStyle}>
                If you left a public review in the app store, thank you for
                supporting us.
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>
                How is {effectiveAppName} working for you?
              </div>
              <div
                style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 4 }}
              >
                Choose a star rating, then optionally tell us what&apos;s
                working well and what could be better.
              </div>

              {renderStars()}
              {renderStatsRow()}

              <textarea
                style={textareaStyle}
                placeholder="What do you like? What could be improved?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={isSubmitting}
              />

              <button
                type="button"
                style={{
                  ...submitButtonStyle,
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? "default" : "pointer",
                }}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit feedback"}
              </button>

              <div style={subtleTextStyle}>
                We may use your feedback (without personal details) to improve{" "}
                {effectiveAppName}.
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {renderFloatingButton()}
      {renderPanel()}
    </>
  );
}
