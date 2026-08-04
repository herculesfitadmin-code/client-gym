import React, { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Award, ChevronRight } from "lucide-react";
import { LearnMoreModal, ModalContent } from "./LearnMoreModal";

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

export interface CoachesStackedCardsSectionProps {
  coaches?: CoachItem[];
}

export const gymCoaches: CoachItem[] = [
  {
    id: "coach-1",
    cardNumber: "01",
    totalCards: "04",
    title: "GIRISH",
    subtitle: "Founder & Head Coach",
    meta: "19+ YEARS EXP • FOUNDER",
    desc: "Dedicated athlete first, coach second, businessman last. Building Hercules out of genuine passion to guide everyday members through biomechanics, heavy lifting, and athletic discipline.",
    tags: ["Heavyweight Champ", "1-on-1 Mentorship", "Biomechanical Form"],
    image: "/transformations/girish_after.png",
  },
  {
    id: "coach-2",
    cardNumber: "02",
    totalCards: "04",
    title: "PRIYA SHARMA",
    subtitle: "Women's Fitness & Fat Loss",
    meta: "8+ YEARS EXP • SENIOR COACH",
    desc: "Specialising in women's strength training, body recomposition, post-natal recovery, and functional fat loss circuits in a comfortable, supportive environment.",
    tags: ["Women's Fitness", "Fat Loss", "Habit Coaching"],
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "coach-3",
    cardNumber: "03",
    totalCards: "04",
    title: "KUMAR SWAMY",
    subtitle: "Powerlifting & Form Coach",
    meta: "10+ YEARS EXP • STRENGTH COACH",
    desc: "Master of squat, bench, and deadlift biomechanics. Focuses on safe joint loading, posture alignment, and maximum strength output for athletes of all levels.",
    tags: ["Powerlifting", "Form Correction", "Joint Safety"],
    image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "coach-4",
    cardNumber: "04",
    totalCards: "04",
    title: "ARJUN DESHMUKH",
    subtitle: "Physiology & Active Recovery",
    meta: "6+ YEARS EXP • PHYSIO COACH",
    desc: "Combines functional movement screening with high-intensity interval conditioning to improve VO₂ max, cardiovascular longevity, and daily stamina.",
    tags: ["Active Recovery", "VO2 Max Boost", "Stamina"],
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
  },
];

export const CoachesStackedCardsSection: React.FC<CoachesStackedCardsSectionProps> = ({
  coaches: propCoaches,
}) => {
  const displayCoaches = propCoaches && propCoaches.length > 0 ? propCoaches : gymCoaches;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [modalData, setModalData] = useState<ModalContent | null>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 380;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="trainers"
      style={{
        padding: "7rem 2rem",
        background: "#080808",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* Header Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "3rem",
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
                ATHLETE MENTORSHIP ROSTER
              </span>
            </div>
            <h2
              style={{
                fontFamily: '"Big Shoulders Display", Impact, sans-serif',
                fontWeight: 900,
                fontSize: "clamp(2.4rem, 5vw, 4.2rem)",
                textTransform: "uppercase",
                lineHeight: 0.92,
                color: "#FFFFFF",
                letterSpacing: "0.02em",
              }}
            >
              LEARN FROM <span style={{ color: LIME }}>PROVEN ATHLETES</span>
            </h2>
          </div>

          {/* Navigation Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => handleScroll("left")}
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = LIME;
                el.style.color = "#080808";
                el.style.borderColor = LIME;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "rgba(255, 255, 255, 0.04)";
                el.style.color = "#FFFFFF";
                el.style.borderColor = "rgba(255, 255, 255, 0.12)";
              }}
              aria-label="Scroll Left"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={() => handleScroll("right")}
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = LIME;
                el.style.color = "#080808";
                el.style.borderColor = LIME;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "rgba(255, 255, 255, 0.04)";
                el.style.color = "#FFFFFF";
                el.style.borderColor = "rgba(255, 255, 255, 0.12)";
              }}
              aria-label="Scroll Right"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel Track */}
        <div
          ref={scrollContainerRef}
          style={{
            display: "flex",
            gap: 20,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            paddingBottom: "1.5rem",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {displayCoaches.map((coach, index) => (
            <div
              key={coach.id || index}
              style={{
                flex: "0 0 310px",
                scrollSnapAlign: "start",
                background: "rgba(16, 16, 20, 0.95)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 20,
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 16px 36px rgba(0,0,0,0.6)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(216, 255, 62, 0.35)";
                el.style.transform = "translateY(-4px)";
                el.style.boxShadow = "0 24px 50px rgba(0,0,0,0.8), 0 0 25px rgba(216, 255, 62, 0.1)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(255, 255, 255, 0.08)";
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "0 16px 36px rgba(0,0,0,0.6)";
              }}
            >
              <div>
                {/* Photo Box */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: 240,
                    borderRadius: 14,
                    overflow: "hidden",
                    marginBottom: "1.25rem",
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
                      objectPosition: "top center",
                    }}
                  />
                  {/* Top Badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      background: LIME,
                      color: "#080808",
                      fontFamily: '"JetBrains Mono", monospace',
                      fontWeight: 800,
                      fontSize: 9.5,
                      padding: "4px 10px",
                      borderRadius: 20,
                      letterSpacing: "0.1em",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    <Award size={11} /> {coach.meta}
                  </div>
                </div>

                {/* Coach Name */}
                <h3
                  style={{
                    fontFamily: '"Big Shoulders Display", Impact, sans-serif',
                    fontWeight: 900,
                    fontSize: "1.6rem",
                    textTransform: "uppercase",
                    lineHeight: 1,
                    color: "#FFFFFF",
                    letterSpacing: "0.02em",
                    marginBottom: "0.3rem",
                  }}
                >
                  {coach.title}
                </h3>

                {/* Subtitle / Specialty 1-Liner */}
                <div
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 11,
                    color: LIME,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: "1.25rem",
                    fontWeight: 700,
                  }}
                >
                  {coach.subtitle}
                </div>
              </div>

              <div>
                {/* 2-3 Focus Specialty Tags */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                    marginBottom: "1.25rem",
                    paddingTop: "0.85rem",
                    borderTop: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  {coach.tags.slice(0, 3).map((tag, i) => (
                    <div
                      key={i}
                      style={{
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: 10.5,
                        fontWeight: 600,
                        color: "#E4E4E7",
                        background: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        padding: "4px 10px",
                        borderRadius: 20,
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <span
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: "50%",
                          background: LIME,
                          display: "inline-block",
                        }}
                      />
                      {tag}
                    </div>
                  ))}
                </div>

                {/* Clean Apple-style Learn More Button */}
                <div>
                  <button
                    onClick={() =>
                      setModalData({
                        badge: coach.meta,
                        title: coach.title,
                        subtitle: coach.subtitle,
                        fullDescription: coach.desc,
                        keyPoints: coach.tags,
                      })
                    }
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: 11,
                      fontWeight: 800,
                      color: "#080808",
                      background: LIME,
                      border: "none",
                      padding: "10px 18px",
                      borderRadius: 6,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      width: "100%",
                      justifyContent: "center",
                      letterSpacing: "0.12em",
                      transition: "opacity 0.2s",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.88")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                  >
                    Learn More <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learn More Pop-up Modal */}
      <LearnMoreModal isOpen={!!modalData} onClose={() => setModalData(null)} data={modalData} />
    </section>
  );
};
