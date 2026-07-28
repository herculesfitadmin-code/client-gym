import React, { useRef } from "react";
import { ArrowLeft, ArrowRight, Award } from "lucide-react";

const LIME = "#D8FF3E";

export interface CoachItem {
  id: string;
  cardNumber: string;
  totalCards: string;
  title: string;
  subtitle: string;
  meta: string;
  desc: string;
  tags: string[];
  image: string;
}

export const gymCoaches: CoachItem[] = [
  {
    id: "coach-1",
    cardNumber: "01",
    totalCards: "04",
    title: "HEAD COACH & FOUNDER",
    subtitle: "Strength & Conditioning Specialist",
    meta: "10+ YEARS EXPERIENCE",
    desc: "Pioneer of heavy compound strength training in Kalaburagi. Specialized in power building, structural physique transformation, and custom macro periodization.",
    tags: ["Strength & Power", "Conditioning", "Form & Technique", "1-on-1 Coaching"],
    image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "coach-2",
    cardNumber: "02",
    totalCards: "04",
    title: "PERSONAL TRAINING SPECIALIST",
    subtitle: "Body Recomposition & Fat Loss",
    meta: "CERTIFIED MASTER COACH",
    desc: "Focusing on rapid body recomposition, biomechanics, and personalized workout routines designed to maximize fat loss while preserving lean athletic muscle mass.",
    tags: ["Body Recomp", "Biomechanics", "Fat Loss", "Personalized Plan"],
    image: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "coach-3",
    cardNumber: "03",
    totalCards: "04",
    title: "ATHLETIC PERFORMANCE COACH",
    subtitle: "Functional Fitness & Agility",
    meta: "SENIOR TRAINER",
    desc: "Specializing in athletic mobility, core stability, free weight mechanics, and progressive overload tracking to maximize athletic performance.",
    tags: ["Athletic Performance", "Mobility", "Hypertrophy", "Recovery"],
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "coach-4",
    cardNumber: "04",
    totalCards: "04",
    title: "NUTRITION & DISCIPLINE COACH",
    subtitle: "Macro Guidance & Periodization",
    meta: "CERTIFIED NUTRITIONIST",
    desc: "Guiding members with science-backed diet strategies, meal preparation frameworks, and mental discipline needed for sustainable long-term results.",
    tags: ["Nutrition Plan", "Macro Guidance", "Discipline", "Lifestyle"],
    image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1200&auto=format&fit=crop",
  },
];

export const CoachesStackedCardsSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -460 : 460;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section
      id="trainers"
      style={{
        padding: "8rem 2rem",
        background: "#09090A",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* Header Row with Title and Horizontal Navigation Controls */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "3.5rem",
            flexWrap: "wrap",
            gap: "2rem",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: "0.75rem",
              }}
            >
              <div style={{ width: 28, height: 2, background: LIME }} />
              <span
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 11,
                  fontWeight: 700,
                  color: LIME,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                }}
              >
                EXPERT COACHING & TEAM
              </span>
            </div>
            <h2
              style={{
                fontFamily: '"Big Shoulders Display", Impact, sans-serif',
                fontWeight: 900,
                fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)",
                textTransform: "uppercase",
                lineHeight: 0.92,
                color: "#FFFFFF",
                letterSpacing: "0.02em",
              }}
            >
              MEET THE <span style={{ color: LIME }}>COACHES</span>
            </h2>
          </div>

          {/* Navigation Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => handleScroll("left")}
              aria-label="Previous Coach"
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "rgba(18, 18, 22, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = LIME;
                el.style.color = LIME;
                el.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(255, 255, 255, 0.12)";
                el.style.color = "#FFFFFF";
                el.style.transform = "scale(1)";
              }}
            >
              <ArrowLeft size={18} />
            </button>

            <button
              onClick={() => handleScroll("right")}
              aria-label="Next Coach"
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "rgba(18, 18, 22, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = LIME;
                el.style.color = LIME;
                el.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(255, 255, 255, 0.12)";
                el.style.color = "#FFFFFF";
                el.style.transform = "scale(1)";
              }}
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Track */}
        <div
          ref={scrollRef}
          style={{
            display: "flex",
            gap: 24,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            paddingBottom: "2rem",
            paddingTop: "0.5rem",
          }}
          className="hf-horizontal-coaches-track"
        >
          {gymCoaches.map((coach) => (
            <div
              key={coach.id}
              style={{
                width: "clamp(320px, 80vw, 440px)",
                minWidth: "clamp(320px, 80vw, 440px)",
                flexShrink: 0,
                scrollSnapAlign: "start",
                background: "rgba(18, 18, 22, 0.94)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 24,
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
                boxSizing: "border-box",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = `${LIME}55`;
                el.style.transform = "translateY(-6px)";
                el.style.boxShadow = `0 30px 60px rgba(0,0,0,0.85), 0 0 25px ${LIME}15`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(255, 255, 255, 0.08)";
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "0 20px 40px rgba(0,0,0,0.6)";
              }}
            >
              <div>
                {/* Image Box */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: 260,
                    borderRadius: 16,
                    overflow: "hidden",
                    marginBottom: "1.5rem",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "#0D0D10",
                  }}
                >
                  <img
                    src={coach.image}
                    alt={coach.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      display: "block",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(14,14,16,0.9) 0%, transparent 60%)",
                    }}
                  />

                  {/* Top Badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: 14,
                      left: 14,
                      background: LIME,
                      color: "#080808",
                      fontFamily: '"JetBrains Mono", monospace',
                      fontWeight: 800,
                      fontSize: 10,
                      padding: "4px 12px",
                      borderRadius: 20,
                      letterSpacing: "0.1em",
                      boxShadow: "0 2px 10px rgba(216, 255, 62, 0.3)",
                    }}
                  >
                    CARD {coach.cardNumber} / {coach.totalCards}
                  </div>
                </div>

                {/* Subtitle / Meta */}
                <div
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 10,
                    color: "#A1A1AA",
                    letterSpacing: "0.15em",
                    marginBottom: 6,
                    textTransform: "uppercase",
                  }}
                >
                  {coach.meta}
                </div>

                {/* Coach Title */}
                <h3
                  style={{
                    fontFamily: '"Big Shoulders Display", Impact, sans-serif',
                    fontWeight: 900,
                    fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)",
                    textTransform: "uppercase",
                    lineHeight: 0.95,
                    color: "#FFFFFF",
                    letterSpacing: "0.02em",
                    marginBottom: 8,
                  }}
                >
                  {coach.title}
                </h3>

                {/* Subtitle Highlight */}
                <div
                  style={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontWeight: 700,
                    fontSize: 13,
                    color: LIME,
                    marginBottom: "1rem",
                  }}
                >
                  {coach.subtitle}
                </div>

                {/* Description */}
                <p
                  style={{
                    fontFamily: '"DM Sans", sans-serif',
                    color: "#B3B3B3",
                    fontSize: 13,
                    lineHeight: 1.65,
                    marginBottom: "1.5rem",
                  }}
                >
                  {coach.desc}
                </p>
              </div>

              {/* Bottom Tags */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  paddingTop: "1rem",
                  borderTop: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {coach.tags.map((tag, i) => (
                  <div
                    key={i}
                    style={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#E4E4E7",
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      padding: "5px 12px",
                      borderRadius: 30,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: LIME,
                        display: "inline-block",
                      }}
                    />
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
