import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

const LIME = "#D8FF3E";

const DF: React.CSSProperties = {
  fontFamily: '"Big Shoulders Display", Impact, sans-serif',
  fontWeight: 900,
};

const MF: React.CSSProperties = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Plus Jakarta Sans", "Inter", sans-serif',
};

export interface ModalContent {
  badge?: string;
  title: string;
  subtitle?: string;
  fullDescription: string;
  keyPoints?: string[];
  ctaText?: string;
  ctaHref?: string;
}

interface LearnMoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ModalContent | null;
}

export const LearnMoreModal: React.FC<LearnMoreModalProps> = ({ isOpen, onClose, data }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !data) return null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem",
          background: "rgba(0, 0, 0, 0.85)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
        }}
        onClick={onClose}
        data-lenis-prevent="true"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 620,
            maxHeight: "88vh",
            overflowY: "auto",
            background: "#0D0D11",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: 20,
            padding: "clamp(1.75rem, 4vw, 2.75rem)",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.95)",
            color: "#FFFFFF",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 50,
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#E4E4E7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = LIME;
              el.style.color = "#080808";
              el.style.borderColor = LIME;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "rgba(255, 255, 255, 0.08)";
              el.style.color = "#E4E4E7";
              el.style.borderColor = "rgba(255, 255, 255, 0.15)";
            }}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>

          {/* Header container with right margin to ensure zero overlap with close button */}
          <div style={{ paddingRight: 44 }}>
            {/* Badge */}
            {data.badge && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 12px",
                  background: "rgba(216,255,62,0.08)",
                  border: "1px solid rgba(216,255,62,0.25)",
                  borderRadius: 20,
                  ...MF,
                  fontSize: 9,
                  color: LIME,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  marginBottom: "1rem",
                }}
              >
                <Sparkles size={12} /> {data.badge}
              </div>
            )}

            {/* Title */}
            <h3
              style={{
                ...DF,
                fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                lineHeight: 1,
                textTransform: "uppercase",
                color: "#FFFFFF",
                marginBottom: data.subtitle ? "0.5rem" : "1.25rem",
              }}
            >
              {data.title}
            </h3>

            {/* Subtitle */}
            {data.subtitle && (
              <div
                style={{
                  ...MF,
                  fontSize: 11,
                  color: LIME,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: "1.5rem",
                }}
              >
                {data.subtitle}
              </div>
            )}
          </div>

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: "rgba(255, 255, 255, 0.1)",
              marginBottom: "1.5rem",
            }}
          />

          {/* Main Description Text */}
          <div
            style={{
              color: "#D4D4D8",
              fontSize: 14.5,
              lineHeight: 1.75,
              marginBottom: "1.75rem",
              whiteSpace: "pre-line",
            }}
          >
            {data.fullDescription}
          </div>

          {/* Key Points / Bullets */}
          {data.keyPoints && data.keyPoints.length > 0 && (
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 12,
                padding: "1.25rem 1.5rem",
                marginBottom: "2rem",
              }}
            >
              <div
                style={{
                  ...MF,
                  fontSize: 10,
                  color: LIME,
                  letterSpacing: "0.15em",
                  marginBottom: 12,
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                KEY TAKEAWAYS & WHAT TO EXPECT
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {data.keyPoints.map((point, index) => (
                  <div key={index} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <CheckCircle2 size={16} color={LIME} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ color: "#E4E4E7", fontSize: 13.5, lineHeight: 1.5 }}>
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              paddingTop: "1rem",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <a
              href={data.ctaHref || "#membership"}
              onClick={onClose}
              style={{
                ...MF,
                fontSize: 11,
                fontWeight: 800,
                background: LIME,
                color: "#080808",
                padding: "12px 24px",
                borderRadius: 6,
                textDecoration: "none",
                letterSpacing: "0.12em",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.88")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
            >
              {data.ctaText && data.ctaText !== "GET STARTED WITH COACH GIRISH" ? data.ctaText : "GET STARTED"} <ArrowRight size={13} />
            </a>

            <button
              onClick={onClose}
              style={{
                ...MF,
                fontSize: 11,
                color: "#A1A1AA",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "8px 12px",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#FFF")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#A1A1AA")}
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
