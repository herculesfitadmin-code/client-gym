import React, { useState, useRef, useEffect } from "react";
import { Award, Heart, Target, UserCheck, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { FounderData } from "../adminStore";
import { LearnMoreModal, ModalContent } from "./LearnMoreModal";
import defaultGirishAfter from "../../../public/transformations/girish_after.png";

const LIME = "#D8FF3E";

const DF: React.CSSProperties = {
  fontFamily: '"Big Shoulders Display", Impact, sans-serif',
  fontWeight: 900,
};

const MF: React.CSSProperties = {
  fontFamily: '"JetBrains Mono", monospace',
};

const glass: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.03)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255, 255, 255, 0.07)",
  borderRadius: 12,
};

interface FounderStorySectionProps {
  founderData?: FounderData;
}

export const FounderStorySection: React.FC<FounderStorySectionProps> = ({ founderData }) => {
  const [modalData, setModalData] = useState<ModalContent | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const displayImage = founderData?.image || defaultGirishAfter;
  const displayMediaType = founderData?.mediaType || "video";
  const displayVideoUrl =
    founderData?.videoUrl ||
    "https://assets.mixkit.co/videos/preview/mixkit-man-doing-exercises-with-dumbbells-in-a-gym-42617-large.mp4";

  const displayAuthor = founderData?.quoteAuthor || "COACH GIRISH";
  const displaySubtext = founderData?.quoteSubtext || "19+ YEARS OF EXPERIENCE & DEDICATION";

  // IntersectionObserver to auto-play video on scroll when entering view
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

  return (
    <>
      <section
        id="founder-story"
        aria-label="Meet Your Head Coach section"
        style={{
          padding: "6rem 2rem",
          background: "#080808",
          position: "relative",
          overflow: "hidden",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
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

        <div style={{ maxWidth: 1360, margin: "0 auto" }}>
          {/* Section Header */}
          <div style={{ marginBottom: "2.5rem" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 14px",
                background: "rgba(216,255,62,0.08)",
                border: "1px solid rgba(216,255,62,0.22)",
                borderRadius: 20,
                ...MF,
                fontSize: 10,
                color: LIME,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              <Award size={13} /> MEET YOUR HEAD COACH
            </div>

            <h2
              style={{
                ...DF,
                fontSize: "clamp(2.2rem, 5vw, 4.2rem)",
                lineHeight: 0.95,
                textTransform: "uppercase",
                color: "#FFFFFF",
                margin: "0 0 0.75rem",
              }}
            >
              BUILD A STRONGER BODY WITH <br />
              <span style={{ color: LIME }}>THE RIGHT GUIDANCE</span>
            </h2>
            <p style={{ color: "#A1A1AA", fontSize: "15px", maxWidth: 600, lineHeight: 1.6, margin: 0 }}>
              Coach Girish started Hercules Fitness out of real passion. You don&apos;t need to be fit before you join.
            </p>
          </div>

          {/* Founder Bio Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "2.5rem",
              alignItems: "center",
              marginBottom: "4rem",
            }}
          >
            {/* 9:16 Vertical Portrait Media Container (Photo or Video) */}
            <div ref={containerRef} style={{ position: "relative", width: "100%", maxWidth: 360, margin: "0 auto" }}>
              <div
                style={{
                  position: "relative",
                  borderRadius: 20,
                  overflow: "hidden",
                  border: "1px solid rgba(216,255,62,0.35)",
                  background: "#08080C",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.9), 0 0 35px rgba(216,255,62,0.12)",
                  aspectRatio: "9 / 16",
                  width: "100%",
                  maxHeight: 580,
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

                <div
                  style={{
                    position: "absolute",
                    bottom: 18,
                    left: 16,
                    right: 16,
                    ...glass,
                    padding: "14px 16px",
                    background: "rgba(12, 12, 16, 0.88)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    zIndex: 10,
                  }}
                >
                  <div>
                    <div style={{ ...DF, fontSize: 22, color: "#FFFFFF" }}>{displayAuthor}</div>
                    <div style={{ ...MF, fontSize: 8.5, color: LIME, letterSpacing: "0.15em", marginTop: 2 }}>
                      {displaySubtext}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setModalData({
                        badge: "HEAD COACH PROFILE",
                        title: "MEET COACH GIRISH",
                        subtitle: "19+ YEARS LIFTING & ATHLETE MENTORSHIP",
                        fullDescription:
                          "Coach Girish is a 19-year heavyweight champion who built Hercules Fitness to create a real training sanctuary in Bidar/Kalaburagi.\n\nUnlike commercial gym owners focused purely on sales, Coach Girish spends every day on the gym floor correcting members' posture, teaching compound lifting safety, and guiding individuals step-by-step toward lifelong strength.",
                        keyPoints: [
                          "19+ Years of competitive lifting & practical coaching",
                          "Personal form correction on every major lift (Squats, Deadlifts, Presses)",
                          "Simple, practical nutrition plans tailored to everyday lifestyle",
                          "Encouraging environment where beginners feel supported",
                        ],
                      })
                    }
                    style={{
                      ...MF,
                      fontSize: 10,
                      color: LIME,
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      fontWeight: 700,
                    }}
                  >
                    Learn More <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Story Points with Apple-Style Learn More Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                {
                  icon: <UserCheck size={18} color={LIME} />,
                  title: "Personal Guidance For Everyone",
                  shortDesc: "Step-by-step guidance on how to perform every exercise safely without injury.",
                  modal: {
                    badge: "FOUNDER METHOD",
                    title: "Personal Guidance For Everyone",
                    subtitle: "Zero Intimidation • Beginners Welcome",
                    fullDescription:
                      "Whether it's your very first day in a gym or you're returning after years, Coach Girish ensures you never feel lost.\n\nFrom learning how to grip a barbell correctly to finding your comfortable squat depth, every exercise is broken down into simple, manageable steps so you build confidence fast.",
                    keyPoints: [
                      "Hands-on posture & form checks during your workout",
                      "Weight progression customized to your current strength level",
                      "Injury prevention techniques for lower back, knees, and shoulders",
                    ],
                  },
                },
                {
                  icon: <Target size={18} color={LIME} />,
                  title: "Simple Fitness That Works",
                  shortDesc: "No confusing diet trends. Just simple exercise plans and clear daily habits.",
                  modal: {
                    badge: "NO-GIMMICK FITNESS",
                    title: "Simple Fitness That Works",
                    subtitle: "Real Science • Sustainable Habits",
                    fullDescription:
                      "Most fitness programs fail because they ask everyday people to follow extreme, unsustainable diets.\n\nAt Hercules Fitness, we focus on simple home meals, protein awareness, and progressive workouts that fit naturally into your busy work or study routine.",
                    keyPoints: [
                      "No expensive supplements or starvation diets required",
                      "Balanced protein & meal guidance using everyday food",
                      "Workouts designed for 45-60 minutes maximum efficiency",
                    ],
                  },
                },
                {
                  icon: <Heart size={18} color={LIME} />,
                  title: "A Welcoming Place To Grow",
                  shortDesc: "A respectful, family-like environment where everyone focuses on daily self-improvement.",
                  modal: {
                    badge: "COMMUNITY CULTURE",
                    title: "A Welcoming Place To Grow",
                    subtitle: "Supportive • Respectful • Focused",
                    fullDescription:
                      "Hercules Fitness is built on mutual respect. Whether you're lifting 5kg or 150kg, every member is supported by coaches and peers alike.\n\nWe maintain clean platforms, high safety standards, and a warm atmosphere where anyone—college students, working women, or seniors—feels right at home.",
                    keyPoints: [
                      "Respectful environment for women and beginners",
                      "Clean equipment and organized platforms",
                      "Friendly atmosphere with supportive gym members",
                    ],
                  },
                },
              ].map(({ icon, title, shortDesc, modal }, idx) => (
                <div
                  key={idx}
                  style={{
                    ...glass,
                    padding: "16px 20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {icon}
                    <h4 style={{ color: "#FFF", fontSize: 15, fontWeight: 700, margin: 0 }}>
                      {title}
                    </h4>
                  </div>
                  <p style={{ color: "#A1A1AA", fontSize: 13, margin: 0, lineHeight: 1.5 }}>
                    {shortDesc}
                  </p>
                  <div>
                    <button
                      onClick={() => setModalData(modal)}
                      style={{
                        ...MF,
                        fontSize: 11,
                        color: LIME,
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontWeight: 700,
                        marginTop: 4,
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.textDecoration = "underline")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.textDecoration = "none")}
                    >
                      Learn More <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Learn More Modal */}
      <LearnMoreModal
        isOpen={!!modalData}
        onClose={() => setModalData(null)}
        content={modalData}
      />
    </>
  );
};
