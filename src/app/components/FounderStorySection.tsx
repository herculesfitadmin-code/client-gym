import React, { useRef, useEffect } from "react";
import { ShieldCheck, Trophy, UserCheck, Target } from "lucide-react";
import { FounderData } from "../adminStore";
import defaultGirishAfter from "../../../public/transformations/girish_after.png";

const LIME = "#D8FF3E";

const DF: React.CSSProperties = {
  fontFamily: '"Big Shoulders Display", Impact, sans-serif',
  fontWeight: 900,
};

const MF: React.CSSProperties = {
  fontFamily: '"JetBrains Mono", monospace',
};

const BF: React.CSSProperties = {
  fontFamily: '"DM Sans", sans-serif',
};

interface FounderStorySectionProps {
  founderData?: FounderData;
}

// Decorative curvy SVG background lines (inspired by landonorris.com)
const CurvyBackgroundLines: React.FC = () => (
  <svg
    viewBox="0 0 1440 900"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: 0,
      opacity: 0.045,
    }}
    preserveAspectRatio="none"
  >
    {/* Primary flowing curves */}
    <path
      d="M-100 200 C200 100, 400 350, 720 280 S1100 180, 1540 320"
      stroke="white"
      strokeWidth="1.2"
      fill="none"
    />
    <path
      d="M-80 320 C180 220, 380 480, 700 400 S1080 290, 1540 450"
      stroke="white"
      strokeWidth="0.8"
      fill="none"
    />
    <path
      d="M-120 480 C220 380, 420 600, 740 520 S1120 420, 1560 580"
      stroke="white"
      strokeWidth="1.0"
      fill="none"
    />
    <path
      d="M-60 140 C260 60, 500 280, 780 200 S1140 100, 1560 240"
      stroke="white"
      strokeWidth="0.6"
      fill="none"
    />
    <path
      d="M-140 600 C160 500, 360 720, 680 640 S1060 540, 1520 700"
      stroke="white"
      strokeWidth="0.9"
      fill="none"
    />
    <path
      d="M-90 720 C200 620, 400 840, 720 760 S1100 660, 1560 820"
      stroke="white"
      strokeWidth="0.7"
      fill="none"
    />
    {/* Secondary subtle waves */}
    <path
      d="M-50 50 C300 -20, 550 200, 820 120 S1180 30, 1560 160"
      stroke="white"
      strokeWidth="0.5"
      fill="none"
    />
    <path
      d="M-100 850 C200 750, 450 900, 750 830 S1100 740, 1560 870"
      stroke="white"
      strokeWidth="0.5"
      fill="none"
    />
  </svg>
);

export const FounderStorySection: React.FC<FounderStorySectionProps> = ({ founderData }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const displayImage = founderData?.image || defaultGirishAfter;
  const displayMediaType = founderData?.mediaType || "video";
  const displayVideoUrl =
    founderData?.videoUrl ||
    "https://assets.mixkit.co/videos/preview/mixkit-man-doing-exercises-with-dumbbells-in-a-gym-42617-large.mp4";

  const displayAuthor = "Mr. Girish Shapurkar";
  const displaySubtext = "19+ YEARS OF REAL ATHLETIC EXPERIENCE — FOUNDER & HEAD COACH";

  // Auto-play video on scroll
  useEffect(() => {
    if (displayMediaType !== "video") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (videoRef.current) {
            if (entry.isIntersecting) {
              videoRef.current.play().catch(() => {});
            } else {
              videoRef.current.pause();
            }
          }
        });
      },
      { threshold: 0.25 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [displayMediaType, displayVideoUrl]);

  // Sales principles — sentences only, no tags
  const principles = [
    {
      icon: <ShieldCheck size={26} color={LIME} />,
      text: "100% PERSONAL GUIDANCE & FORM CORRECTION ON EVERY LIFT",
    },
    {
      icon: <Trophy size={26} color={LIME} />,
      text: "NO STARVATION DIETS — PRACTICAL REAL-FOOD RESULTS",
    },
    {
      icon: <UserCheck size={26} color={LIME} />,
      text: "ZERO INTIMIDATION — A WELCOMING PLACE BUILT FOR EVERYDAY PEOPLE",
    },
    {
      icon: <Target size={26} color={LIME} />,
      text: "DIRECT ACCESS TO A 19+ YRS ATHLETE & CERTIFIED CHAMPION COACH",
    },
  ];

  return (
    <section
      id="head-coach"
      aria-label="Head Coach Section — Mr. Girish Shapurkar"
      style={{
        padding: "5rem 2rem",
        background: "#080808",
        position: "relative",
        overflow: "hidden",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Curvy background decorative lines (only this section) */}
      <CurvyBackgroundLines />

      {/* Ambient background glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 80% 30%, rgba(216,255,62,0.04) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1360, margin: "0 auto", position: "relative", zIndex: 2 }}>
        {/* Section Header */}
        <div style={{ marginBottom: "3rem" }}>
          <h2
            style={{
              ...DF,
              fontSize: "clamp(2.5rem, 5.5vw, 4.8rem)",
              lineHeight: 0.95,
              textTransform: "uppercase",
              color: "#FFFFFF",
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            YOU DON&apos;T NEED TO BE FIT <br />
            <span style={{ color: LIME }}>BEFORE YOU JOIN</span>
          </h2>
        </div>

        {/* Founder Bio & Sales Principles Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "3rem",
            alignItems: "center",
          }}
        >
          {/* LARGER 9:16 Vertical Portrait Media Container */}
          <div
            ref={containerRef}
            style={{ position: "relative", width: "100%", maxWidth: 460, margin: "0 auto" }}
          >
            <div
              style={{
                position: "relative",
                borderRadius: 24,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.15)",
                background: "#08080C",
                boxShadow: "0 20px 50px rgba(0,0,0,0.95)",
                aspectRatio: "9 / 16",
                width: "100%",
                maxHeight: 720,
              }}
            >
              {displayMediaType === "video" && displayVideoUrl ? (
                <video
                  ref={videoRef}
                  src={displayVideoUrl}
                  playsInline
                  loop
                  muted
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <img
                  src={displayImage}
                  alt={`${displayAuthor} — Founder & Head Coach`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top center",
                    display: "block",
                  }}
                />
              )}

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, transparent 40%, rgba(8,8,10,0.95) 100%)",
                  pointerEvents: "none",
                }}
              />

              {/* Name Overlay */}
              <div
                style={{
                  position: "absolute",
                  bottom: 20,
                  left: 18,
                  right: 18,
                  background: "rgba(12, 12, 16, 0.85)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(216,255,62,0.3)",
                  borderRadius: 16,
                  padding: "16px 20px",
                  zIndex: 10,
                }}
              >
                <div style={{ ...DF, fontSize: 26, color: "#FFFFFF", letterSpacing: "0.02em" }}>
                  {displayAuthor}
                </div>
                <div
                  style={{
                    ...MF,
                    fontSize: 9.5,
                    color: LIME,
                    letterSpacing: "0.15em",
                    marginTop: 4,
                    fontWeight: 700,
                  }}
                >
                  {displaySubtext}
                </div>
              </div>
            </div>
          </div>

          {/* Sales Principles — sentences only, no tags */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.75rem",
              paddingLeft: "0.5rem",
            }}
          >
            {principles.map(({ icon, text }, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "6px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 50,
                    background: "rgba(216,255,62,0.1)",
                    border: "1px solid rgba(216,255,62,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </div>

                <div
                  style={{
                    ...DF,
                    fontSize: "clamp(1.2rem, 2.2vw, 1.8rem)",
                    color: "#FFFFFF",
                    letterSpacing: "0.03em",
                    lineHeight: 1.15,
                  }}
                >
                  {text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
