import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Clock, ChevronRight, CheckCircle2 } from "lucide-react";
import { LearnMoreModal, ModalContent } from "./LearnMoreModal";

const LIME = "#D8FF3E";
const RED = "#FF3E3E";
const CYAN = "#3EFFD8";
const MAGENTA = "#FF3ED8";
const BLUE = "#3E82FF";
const PURPLE = "#A83EFF";

export interface ProgramItem {
  id: string;
  cardNumber: string;
  totalCards: string;
  name: string;
  subtitle: string;
  meta: string;
  duration: string;
  difficulty: string;
  tag: string;
  color: string;
  desc: string;
  features: string[];
  image: string;
  equipment: string;
}

export const gymPrograms: ProgramItem[] = [
  {
    id: "program-1",
    cardNumber: "01",
    totalCards: "06",
    name: "ELITE STRENGTH & POWERBUILDING",
    subtitle: "Heavy Compound Training & Progressive Overload",
    meta: "60 MIN SESSION • ADVANCED LEVEL",
    duration: "60 MIN",
    difficulty: "ADVANCED",
    tag: "POWER",
    color: LIME,
    desc: "Pioneer of heavy compound strength training. Olympic lifting, powerlifting fundamentals, and progressive overload mastery for serious athletes chasing maximum raw output and structural strength.",
    features: ["Strength & Power", "Form & Technique", "Hypertrophy", "1-on-1 Coaching"],
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop",
    equipment: "Eleiko Competition Barbells & Calibrated Plates",
  },
  {
    id: "program-2",
    cardNumber: "02",
    totalCards: "06",
    name: "HIIT METABOLIC BURN",
    subtitle: "High-Intensity Interval & Caloric Expenditure",
    meta: "45 MIN SESSION • INTENSE LEVEL",
    duration: "45 MIN",
    difficulty: "INTENSE",
    tag: "BURN",
    color: RED,
    desc: "Engineered for maximum caloric expenditure, VO₂ max gains, and rapid metabolic conditioning. High-octane interval circuits designed to torch body fat while preserving lean muscle mass.",
    features: ["Caloric Expenditure", "VO2 Max Boost", "Heart Rate Tracking", "Conditioning"],
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop",
    equipment: "Kettlebells, Battle Ropes & Assault Bikes",
  },
  {
    id: "program-3",
    cardNumber: "03",
    totalCards: "06",
    name: "ATHLETIC COMBAT SPORTS",
    subtitle: "Functional Boxing & MMA Strike Conditioning",
    meta: "75 MIN SESSION • MODERATE TO INTENSE",
    duration: "75 MIN",
    difficulty: "MODERATE",
    tag: "FIGHT",
    color: CYAN,
    desc: "MMA striking, heavy bag fundamentals, footwork, and functional combat drills. Build total-body athletic explosive power, coordination, core stability, and mental toughness under pressure.",
    features: ["Heavy Bag Drills", "Agility & Speed", "Core Stability", "Combat Conditioning"],
    image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=1200&auto=format&fit=crop",
    equipment: "Leather Heavy Bags, Speed Bags & Sparring Cage",
  },
  {
    id: "program-4",
    cardNumber: "04",
    totalCards: "06",
    name: "BODY RECOMPOSITION",
    subtitle: "Macro Periodization & Structural Sculpting",
    meta: "55 MIN SESSION • ALL LEVELS",
    duration: "55 MIN",
    difficulty: "MODERATE",
    tag: "SCULPT",
    color: MAGENTA,
    desc: "Simultaneous fat loss and muscle hypertrophy through targeted mechanical tension, tempo protocols, personalized macro periodization, and continuous body composition tracking.",
    features: ["Muscle Gain", "Body Fat Reduction", "Macro Guidance", "Lifestyle & Discipline"],
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1200&auto=format&fit=crop",
    equipment: "Panatta Pin-Selected & Plate-Loaded Machines",
  },
  {
    id: "program-5",
    cardNumber: "05",
    totalCards: "06",
    name: "ENDURANCE & STAMINA GRIND",
    subtitle: "Lactate Threshold & Aerobic Capacity Base",
    meta: "90 MIN SESSION • GRUELING LEVEL",
    duration: "90 MIN",
    difficulty: "GRUELING",
    tag: "GRIND",
    color: LIME,
    desc: "Long-form cardio, SkiErg, Concept2 rowing, and lactate threshold conditioning for elite endurance athletes, hybrid competitors, and unyielding stamina development.",
    features: ["Athletic Performance", "Lactate Threshold", "Aerobic Capacity", "Stamina"],
    image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=1200&auto=format&fit=crop",
    equipment: "Concept2 Rowers, SkiErgs & Wattbikes",
  },
  {
    id: "program-6",
    cardNumber: "06",
    totalCards: "06",
    name: "RECOVERY & MOBILITY CLINIC",
    subtitle: "PNF Stretching, Foam Rolling & Fascia Release",
    meta: "40 MIN SESSION • ACTIVE RECOVERY",
    duration: "40 MIN",
    difficulty: "ACTIVE",
    tag: "HEAL",
    color: PURPLE,
    desc: "Structured mobility, active recovery, PNF stretching protocols, percussion therapy, and fascia release to prevent injury, improve joint range of motion, and accelerate recovery.",
    features: ["Joint Mobility", "PNF Stretching", "Fascia Release", "Active Recovery"],
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop",
    equipment: "Theragun Percussion, Mobility Racks & Foam Rollers",
  },
];

interface StackedCardProps {
  program: ProgramItem;
  index: number;
  totalCards: number;
  onLearnMore?: (data: ModalContent) => void;
}

const StackedProgramCard: React.FC<StackedCardProps> = ({ program, index, totalCards, onLearnMore }) => {
  // Sticky top offset: exposed top header bar (34px) per card as cards stack on top
  const stickyTop = 90 + index * 34;

  return (
    <div
      style={{
        position: "sticky",
        top: `${stickyTop}px`,
        marginBottom: index === totalCards - 1 ? 0 : "6rem",
        zIndex: index + 1,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        style={{
          background: "rgba(18, 18, 22, 0.96)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.09)",
          borderColor: `${program.color}45`,
          borderRadius: 28,
          boxShadow: `0 -12px 40px rgba(0,0,0,0.85), 0 30px 70px rgba(0,0,0,0.95), 0 0 30px ${program.color}20`,
          overflow: "hidden",
          height: 480, // Identical uniform height across all 6 program cards
          display: "flex",
          flexDirection: "column",
          transition: "border-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s ease",
        }}
        whileHover={{
          borderColor: `${program.color}75`,
          boxShadow: `0 -12px 40px rgba(0,0,0,0.9), 0 35px 80px rgba(0,0,0,0.95), 0 0 35px ${program.color}35`,
        }}
      >
        {/* Glow ambient background spot */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 360,
            height: 360,
            background: `radial-gradient(circle, ${program.color}22 0%, transparent 70%)`,
            pointerEvents: "none",
            filter: "blur(40px)",
          }}
        />

        <div className="hf-stacked-card-grid" style={{ height: "100%", boxSizing: "border-box" }}>
          {/* Left Column: Details */}
          <div className="hf-stacked-card-content" style={{ height: "100%", justifyContent: "space-between" }}>
            <div>
              {/* Header Badge Row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 11,
                    color: "#A1A1AA",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                >
                  {program.meta}
                </div>
              </div>

              {/* Program Title */}
              <h3
                style={{
                  fontFamily: '"Big Shoulders Display", Impact, sans-serif',
                  fontWeight: 900,
                  fontSize: "clamp(2rem, 3.6vw, 3rem)",
                  textTransform: "uppercase",
                  lineHeight: 0.95,
                  color: "#FFFFFF",
                  letterSpacing: "0.02em",
                  marginBottom: "0.4rem",
                }}
              >
                {program.name}
              </h3>

              {/* Subtitle Accent */}
              <div
                style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: 700,
                  fontSize: "clamp(0.95rem, 1.5vw, 1.15rem)",
                  color: program.color,
                  marginBottom: "1rem",
                }}
              >
                {program.subtitle}
              </div>
            </div>

            <div>
              {/* Bottom Pills / Highlights */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginBottom: "1.25rem",
                  paddingTop: "0.85rem",
                  borderTop: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {program.features.map((feat, i) => (
                  <div
                    key={i}
                    style={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#E4E4E7",
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      padding: "5px 13px",
                      borderRadius: 30,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: program.color,
                        display: "inline-block",
                      }}
                    />
                    {feat}
                  </div>
                ))}
              </div>

              {/* Action Bar */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <a
                  href="#membership"
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 11,
                    fontWeight: 800,
                    background: program.color,
                    color: "#080808",
                    padding: "12px 24px",
                    borderRadius: 4,
                    textDecoration: "none",
                    letterSpacing: "0.15em",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    transition: "all 0.25s ease",
                    boxShadow: `0 4px 20px ${program.color}30`,
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "translateY(-2px)";
                    el.style.opacity = "0.9";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "translateY(0)";
                    el.style.opacity = "1";
                  }}
                >
                  ENROLL IN PROGRAM <ArrowRight size={14} />
                </a>

                <button
                  onClick={() =>
                    onLearnMore?.({
                      badge: program.tag,
                      title: program.name,
                      subtitle: `${program.subtitle} • ${program.duration} • ${program.difficulty}`,
                      fullDescription: `${program.desc}\n\nEquipment Provided: ${program.equipment}`,
                      keyPoints: program.features,
                    })
                  }
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 11,
                    fontWeight: 700,
                    color: program.color,
                    background: "rgba(255, 255, 255, 0.05)",
                    border: `1px solid ${program.color}44`,
                    padding: "11px 20px",
                    borderRadius: 4,
                    cursor: "pointer",
                    letterSpacing: "0.15em",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = `${program.color}22`)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255, 255, 255, 0.05)")}
                >
                  Learn More <ChevronRight size={13} />
                </button>

                <div
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 10,
                    color: "#A1A1AA",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    letterSpacing: "0.1em",
                  }}
                >
                  <Clock size={12} style={{ color: program.color }} /> {program.duration} • {program.difficulty}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Image Container */}
          <div className="hf-stacked-card-media" style={{ height: "100%" }}>
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                borderRadius: 20,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "#0E0E10",
              }}
            >
              <img
                src={program.image}
                alt={program.name}
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
                  background: `linear-gradient(to top, rgba(14,14,16,0.92) 0%, transparent 60%)`,
                }}
              />

              {/* Equipment Overlay Pill */}
              <div
                style={{
                  position: "absolute",
                  bottom: 16,
                  left: 16,
                  right: 16,
                  background: "rgba(10, 10, 12, 0.75)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  padding: "10px 14px",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <CheckCircle2 size={15} style={{ color: program.color, flexShrink: 0 }} />
                <span
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 10,
                    color: "#D4D4D8",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {program.equipment}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const ProgramStackedCardsSection: React.FC = () => {
  const [modalData, setModalData] = useState<ModalContent | null>(null);

  return (
    <section
      id="programs"
      aria-label="Training programs and fitness systems section"
      style={{
        padding: "6rem 2rem 10rem",
        background: "#08080A",
        position: "relative",
        overflow: "visible",
      }}
    >
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        {/* Section Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "3rem",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: "0.5rem",
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
                ATHLETIC DISCIPLINES
              </span>
            </div>
            <h2
              style={{
                fontFamily: '"Big Shoulders Display", Impact, sans-serif',
                fontWeight: 900,
                fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)",
                textTransform: "uppercase",
                lineHeight: 0.92,
                color: "#FFFFFF",
                letterSpacing: "0.02em",
              }}
            >
              TRAIN WITH
              <br />
              <span style={{ color: LIME }}>ATHLETIC PURPOSE</span>
            </h2>
          </div>

          <div>
            <a
              href="#membership"
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 11,
                fontWeight: 700,
                color: LIME,
                background: "transparent",
                border: `1px solid ${LIME}55`,
                padding: "12px 24px",
                borderRadius: 40,
                textDecoration: "none",
                letterSpacing: "0.15em",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = LIME;
                el.style.color = "#080808";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "transparent";
                el.style.color = LIME;
              }}
            >
              EXPLORE ALL PROGRAMS <ArrowRight size={14} />
            </a>
          </div>
        </div>

        {/* Sticky Stacked Cards List */}
        <div>
          {gymPrograms.map((program, index) => (
            <StackedProgramCard
              key={program.id}
              program={program}
              index={index}
              totalCards={gymPrograms.length}
              onLearnMore={(data) => setModalData(data)}
            />
          ))}
        </div>
      </div>

      {/* Learn More Modal */}
      <LearnMoreModal isOpen={!!modalData} onClose={() => setModalData(null)} data={modalData} />
    </section>
  );
};
