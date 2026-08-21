import React, { useState, useRef, useEffect } from "react";
import { CertificateModal, CertificateData } from "./CertificateModal";

const LIME = "#D8FF3E";

const DF: React.CSSProperties = {
  fontFamily: '"Big Shoulders Display", Impact, sans-serif',
  fontWeight: 900,
};

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
  category: string;
  image: string;
  details: CertificateData;
}

export const certificatesList: CertificateItem[] = [
  {
    id: "cert-1",
    title: "Shafi Sami Bodybuilding & Men's Physique Championship",
    issuer: "Merit Certificate & Gold Medal",
    year: "2023",
    category: "MEN'S PHYSIQUE & BODYBUILDING",
    image: "/certificates/real_cert_1.png",
    details: {
      coachName: "Mr. Girish Shapurkar",
      coachTitle: "Founder & Head Coach",
      certificateTitle: "SHAFI SAMI BODYBUILDING CHAMPIONSHIP 2023",
      issuer: "Shafi Sami Fitness & Sports Association",
      issueYear: "2023 — GOLD MEDALIST",
      certId: "HERC-CERT-2023-01",
      skillsVerified: [
        "1st Place Gold Medal Winner",
        "Men's Physique Category Champion",
        "Peak Conditioning & Stage Muscle Mass",
        "Natural Bodybuilding Biomechanics",
      ],
      description:
        "Official Gold Medal Merit Certificate awarded to Mr. Girish Shapurkar at the Shafi Sami Bodybuilding & Men's Physique Championship 2023 for outstanding physique presentation and athletic excellence.",
      sealText: "GOLD MEDALIST",
    },
  },
  {
    id: "cert-2",
    title: "Karnataka Shbee State Level Bodybuilding Championship",
    issuer: "Certificate of Merit & State Medal",
    year: "2023",
    category: "STATE LEVEL CHAMPIONSHIP",
    image: "/certificates/real_cert_2.png",
    details: {
      coachName: "Mr. Girish Shapurkar",
      coachTitle: "Founder & Head Coach",
      certificateTitle: "KARNATAKA SHBEE 2023 STATE CHAMPIONSHIP",
      issuer: "Karnataka State Bodybuilding Federation",
      issueYear: "2023 — STATE LEVEL MERIT",
      certId: "HERC-CERT-2023-02",
      skillsVerified: [
        "State Level Podium Finish",
        "Heavyweight Class Muscle Symmetry",
        "Posing & Athletic Presentation",
        "Advanced Hypertrophy Programming",
      ],
      description:
        "Certificate of Merit presented to Mr. Girish Shapurkar for achieving top honors in the Karnataka Shbee 2023 Open State Level Bodybuilding Competition.",
      sealText: "STATE MERIT",
    },
  },
  {
    id: "cert-3",
    title: "Certified Personal Trainer & Babu's Classic 2024",
    issuer: "IFBB & Integrated Fitness Sports Institute",
    year: "2024",
    category: "INTERNATIONAL COACHING ACCREDITATION",
    image: "/certificates/real_cert_3.png",
    details: {
      coachName: "Mr. Girish Shapurkar",
      coachTitle: "Founder & Head Coach",
      certificateTitle: "MASTER TRAINER & NUTRITION SPECIALIST",
      issuer: "Integrated Fitness & Sports Institute (IFSI)",
      issueYear: "2024 — CERTIFIED MASTER COACH",
      certId: "HERC-CERT-2024-03",
      skillsVerified: [
        "Certified Personal Fitness Trainer",
        "Advanced Posture Correction & Joint Safety",
        "Metabolic Rate & Fat Loss Science",
        "Injury-Free Heavy Lifting Form",
      ],
      description:
        "Official Certified Personal Trainer credentials for Coach Girish, verifying specialized expertise in biomechanics, muscle hypertrophy, structural loading, and injury prevention.",
      sealText: "VERIFIED MASTER",
    },
  },
  {
    id: "cert-4",
    title: "Karnataka Amateur Bodybuilders Association Open State",
    issuer: "Certificate of Participation & State Honor",
    year: "2023",
    category: "AMATEUR STATE CHAMPIONSHIP",
    image: "/certificates/real_cert_4.png",
    details: {
      coachName: "Mr. Girish Shapurkar",
      coachTitle: "Founder & Head Coach",
      certificateTitle: "KABA OPEN STATE BODYBUILDING 2023",
      issuer: "Karnataka Amateur Bodybuilders Association",
      issueYear: "2023 — STATE DELEGATE",
      certId: "HERC-CERT-2023-04",
      skillsVerified: [
        "KABA State Championship Qualifier",
        "Peak Muscle Hardness & Vascularity",
        "Strict Natural Training Discipline",
      ],
      description:
        "Official KABA Certificate honoring Mr. Girish Shapurkar for demonstrating elite physical conditioning and sportsmanship at the Open State Championship.",
      sealText: "KABA VERIFIED",
    },
  },
  {
    id: "cert-5",
    title: "District Level Bodybuilding Championship & Mir Classic",
    issuer: "Certificate of Merit & Trophy",
    year: "2022",
    category: "DISTRICT CHAMPIONSHIP",
    image: "/certificates/real_cert_5.png",
    details: {
      coachName: "Mr. Girish Shapurkar",
      coachTitle: "Founder & Head Coach",
      certificateTitle: "MIR CLASSIC DISTRICT CHAMPIONSHIP 2022",
      issuer: "District Bodybuilding & Fitness Association",
      issueYear: "2022 — DISTRICT WINNER",
      certId: "HERC-CERT-2022-05",
      skillsVerified: [
        "District Champion Overall Winner",
        "19+ Years Athletic Progression",
        "Discipline & Consistency Mentorship",
      ],
      description:
        "Merit award presented to Coach Girish Shapurkar at the Mir Classic District Level Championship, celebrating years of dedication to natural strength and body composition.",
      sealText: "CHAMPION",
    },
  },
];

// Each card's fanned-out position for Desktop
const getFannedTransform = (
  index: number,
  total: number,
  hoveredIndex: number | null,
  isFanned: boolean
) => {
  const center = Math.floor(total / 2);
  const offset = index - center; // -2, -1, 0, 1, 2

  if (!isFanned) {
    return {
      translateX: offset * 4,
      translateY: Math.abs(offset) * 3,
      rotate: offset * 0.8,
      scale: 1 - Math.abs(offset) * 0.02,
      zIndex: total - Math.abs(offset),
    };
  }

  const spreadX = offset * 195;
  const spreadY = Math.abs(offset) * 18;
  const rotation = offset * 7.5;
  let scale = 1 - Math.abs(offset) * 0.04;
  let zIndex = total - Math.abs(offset);
  let extraX = 0;
  let extraY = 0;
  let extraScale = 0;

  if (hoveredIndex !== null) {
    if (index === hoveredIndex) {
      extraY = -22;
      extraScale = 0.06;
      zIndex = total + 10;
    } else {
      const distFromHovered = index - hoveredIndex;
      if (distFromHovered !== 0) {
        const pushDirection = distFromHovered > 0 ? 1 : -1;
        const pushAmount = Math.max(0, 30 - Math.abs(distFromHovered) * 8);
        extraX = pushDirection * pushAmount;
      }
    }
  }

  return {
    translateX: spreadX + extraX,
    translateY: spreadY + extraY,
    rotate: rotation,
    scale: scale + extraScale,
    zIndex,
  };
};

export const AthleteCertificateCarouselSection: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isFanned, setIsFanned] = useState(false);
  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const mobileTrackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsFanned(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const total = certificatesList.length;

  return (
    <section
      ref={sectionRef}
      id="athlete-certificates"
      aria-label="You Are Being Trained Under An Athlete"
      style={{
        padding: "6rem 1.5rem 5rem",
        background: "linear-gradient(180deg, #080808 0%, #0D0D12 50%, #080808 100%)",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Subtle radial glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80vw",
          height: "60vh",
          background:
            "radial-gradient(circle, rgba(216,255,62,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1360,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Title — clean, centered */}
        <div
          style={{
            textAlign: "center",
            maxWidth: 850,
            margin: "0 auto 3.5rem",
          }}
        >
          <h2
            style={{
              ...DF,
              fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
              lineHeight: 0.95,
              textTransform: "uppercase",
              color: "#FFFFFF",
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            YOU ARE BEING TRAINED UNDER <br />
            <span style={{ color: LIME }}>AN ATHLETE</span>
          </h2>
        </div>

        {/* DESKTOP VIEW: Fanned Card Stack */}
        <div
          className="hf-desktop-cert-stack"
          style={{
            position: "relative",
            height: "clamp(380px, 52vh, 560px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          {certificatesList.map((cert, idx) => {
            const t = getFannedTransform(idx, total, hoveredIndex, isFanned);

            return (
              <div
                key={cert.id}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setSelectedCert(cert.details)}
                style={{
                  position: "absolute",
                  width: "clamp(200px, 22vw, 280px)",
                  transform: `translateX(${t.translateX}px) translateY(${t.translateY}px) rotate(${t.rotate}deg) scale(${t.scale})`,
                  zIndex: t.zIndex,
                  cursor: "pointer",
                  transition: isFanned
                    ? "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1)"
                    : "transform 1.1s cubic-bezier(0.22, 1, 0.36, 1)",
                  willChange: "transform",
                  transformOrigin: "center bottom",
                }}
              >
                <div
                  style={{
                    borderRadius: 18,
                    overflow: "hidden",
                    border:
                      hoveredIndex === idx
                        ? `2px solid ${LIME}`
                        : "1px solid rgba(255,255,255,0.12)",
                    background: "#0F0F14",
                    boxShadow:
                      hoveredIndex === idx
                        ? `0 30px 60px rgba(0,0,0,0.9), 0 0 40px rgba(216,255,62,0.25)`
                        : "0 15px 40px rgba(0,0,0,0.7)",
                    transition:
                      "border 0.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  <img
                    src={cert.image}
                    alt={cert.title}
                    draggable={false}
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                      objectFit: "cover",
                      userSelect: "none",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* MOBILE VIEW: Smooth Touch-Swipe Horizontal Track */}
        <div className="hf-mobile-cert-track-wrapper">
          <div
            ref={mobileTrackRef}
            data-lenis-prevent
            className="hf-mobile-cert-track"
            style={{
              display: "flex",
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              touchAction: "pan-x pan-y",
              WebkitOverflowScrolling: "touch",
              gap: "1.25rem",
              padding: "1rem 1.25rem 2rem",
              margin: "0 -1.5rem",
              scrollbarWidth: "none",
            }}
          >
            {certificatesList.map((cert) => (
              <div
                key={cert.id}
                onClick={() => setSelectedCert(cert.details)}
                style={{
                  flex: "0 0 78vw",
                  maxWidth: 310,
                  scrollSnapAlign: "center",
                  borderRadius: 18,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: "#0F0F14",
                  boxShadow: "0 15px 40px rgba(0,0,0,0.8)",
                  cursor: "pointer",
                }}
              >
                <img
                  src={cert.image}
                  alt={cert.title}
                  draggable={false}
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    objectFit: "cover",
                  }}
                />
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              marginTop: "0.5rem",
            }}
          >
            <button
              onClick={() => {
                if (mobileTrackRef.current) {
                  mobileTrackRef.current.scrollBy({ left: -260, behavior: "smooth" });
                }
              }}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(216,255,62,0.3)",
                color: LIME,
                borderRadius: 50,
                padding: "6px 14px",
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              ← PREV
            </button>

            <span
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 10,
                color: LIME,
                letterSpacing: "0.15em",
                opacity: 0.9,
              }}
            >
              SWIPE / TAP
            </span>

            <button
              onClick={() => {
                if (mobileTrackRef.current) {
                  mobileTrackRef.current.scrollBy({ left: 260, behavior: "smooth" });
                }
              }}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(216,255,62,0.3)",
                color: LIME,
                borderRadius: 50,
                padding: "6px 14px",
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              NEXT →
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .hf-mobile-cert-track-wrapper {
          display: none;
        }
        @media (max-width: 768px) {
          .hf-desktop-cert-stack {
            display: none !important;
          }
          .hf-mobile-cert-track-wrapper {
            display: block !important;
          }
          .hf-mobile-cert-track::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={!!selectedCert}
        onClose={() => setSelectedCert(null)}
        data={selectedCert}
      />
    </section>
  );
};
