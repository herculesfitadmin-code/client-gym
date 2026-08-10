import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Award, ShieldCheck, CheckCircle2, Sparkles, ExternalLink, Download, Share2 } from "lucide-react";

const LIME = "#D8FF3E";
const GOLD = "#FFD700";

const DF: React.CSSProperties = {
  fontFamily: '"Big Shoulders Display", Impact, sans-serif',
  fontWeight: 900,
};

const MF: React.CSSProperties = {
  fontFamily: '"JetBrains Mono", monospace',
};

export interface CertificateData {
  coachName: string;
  coachTitle: string;
  certificateTitle: string;
  issuer: string;
  issueYear: string;
  certId: string;
  skillsVerified: string[];
  description: string;
  sealText?: string;
}

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CertificateData | null;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ isOpen, onClose, data }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -12; // tilt up/down max 12deg
    const rotateY = ((x - centerX) / centerX) * 12; // tilt left/right max 12deg
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

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
          background: "rgba(0, 0, 0, 0.88)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
        }}
        onClick={onClose}
        data-lenis-prevent="true"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 720,
            maxHeight: "90vh",
            overflowY: "auto",
            background: "#08080A",
            border: "1px solid rgba(216, 255, 62, 0.3)",
            borderRadius: 24,
            padding: "clamp(1.5rem, 3.5vw, 2.5rem)",
            boxShadow:
              "0 30px 100px rgba(0, 0, 0, 0.95), 0 0 60px rgba(216, 255, 62, 0.12)",
            color: "#FFFFFF",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 10,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = LIME;
              e.currentTarget.style.color = "#000000";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
              e.currentTarget.style.color = "#FFFFFF";
            }}
            aria-label="Close certificate modal"
          >
            <X size={18} />
          </button>

          {/* Top Verification Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: "1.5rem",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                background: "rgba(216, 255, 62, 0.1)",
                border: "1px solid rgba(216, 255, 62, 0.3)",
                borderRadius: 20,
                color: LIME,
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.15em",
                ...MF,
              }}
            >
              <ShieldCheck size={14} color={LIME} /> OFFICIAL VERIFIED CERTIFICATION
            </span>
            <span
              style={{
                fontSize: "11px",
                color: "#A1A1AA",
                ...MF,
              }}
            >
              ID: {data.certId}
            </span>
          </div>

          {/* 3D Interactive Holographic Certificate Card */}
          <div
            style={{
              perspective: 1000,
              marginBottom: "2rem",
            }}
          >
            <motion.div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={handleMouseLeave}
              animate={{
                rotateX: tilt.x,
                rotateY: tilt.y,
                scale: isHovered ? 1.02 : 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{
                position: "relative",
                background: "linear-gradient(145deg, #111116 0%, #1a1a24 50%, #0c0c10 100%)",
                border: "2px solid rgba(255, 215, 0, 0.4)",
                borderRadius: 16,
                padding: "2.5rem 2rem",
                overflow: "hidden",
                boxShadow: isHovered
                  ? "0 20px 50px rgba(216, 255, 62, 0.25), 0 0 30px rgba(255, 215, 0, 0.3)"
                  : "0 10px 30px rgba(0,0,0,0.6)",
                cursor: "pointer",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Shimmer Light Reflection Overlay */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.35 }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.4) 45%, rgba(216,255,62,0.6) 50%, transparent 80%)",
                    pointerEvents: "none",
                  }}
                />
              )}

              {/* Decorative Corner Gold Trims */}
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  width: 20,
                  height: 20,
                  borderTop: "2px solid " + GOLD,
                  borderLeft: "2px solid " + GOLD,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  width: 20,
                  height: 20,
                  borderTop: "2px solid " + GOLD,
                  borderRight: "2px solid " + GOLD,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 12,
                  left: 12,
                  width: 20,
                  height: 20,
                  borderBottom: "2px solid " + GOLD,
                  borderLeft: "2px solid " + GOLD,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 12,
                  right: 12,
                  width: 20,
                  height: 20,
                  borderBottom: "2px solid " + GOLD,
                  borderRight: "2px solid " + GOLD,
                }}
              />

              {/* Certificate Watermark Icon */}
              <div
                style={{
                  position: "absolute",
                  right: -20,
                  bottom: -20,
                  opacity: 0.05,
                  pointerEvents: "none",
                }}
              >
                <Award size={260} color={GOLD} />
              </div>

              {/* Content Inside Certificate */}
              <div style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
                {/* Issuer Badge Header */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    color: GOLD,
                    fontSize: "12px",
                    fontWeight: 800,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    marginBottom: "0.75rem",
                    ...MF,
                  }}
                >
                  <Award size={16} /> CERTIFICATE OF ACCREDITATION
                </div>

                <h2
                  style={{
                    ...DF,
                    fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                    color: "#FFFFFF",
                    lineHeight: 1,
                    textTransform: "uppercase",
                    margin: "0 0 0.5rem",
                    letterSpacing: "0.02em",
                  }}
                >
                  {data.certificateTitle}
                </h2>

                <p style={{ color: LIME, fontSize: "14px", fontWeight: 700, margin: "0 0 1.5rem", ...MF }}>
                  ISSUED TO: {data.coachName} ({data.coachTitle})
                </p>

                {/* Golden Divider Line */}
                <div
                  style={{
                    width: 120,
                    height: 2,
                    background: "linear-gradient(90deg, transparent, " + GOLD + ", transparent)",
                    margin: "0 auto 1.5rem",
                  }}
                />

                <p
                  style={{
                    color: "#D4D4D8",
                    fontSize: "14px",
                    lineHeight: 1.6,
                    maxWidth: 500,
                    margin: "0 auto 1.5rem",
                  }}
                >
                  {data.description}
                </p>

                {/* Footer Stamp & Signatures inside Certificate */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "2rem",
                    paddingTop: "1.25rem",
                    borderTop: "1px dashed rgba(255, 215, 0, 0.25)",
                  }}
                >
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: "10px", color: "#A1A1AA", ...MF }}>ISSUING BODY</div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#FFFFFF" }}>{data.issuer}</div>
                  </div>

                  {/* Pulsating Hologram Stamp */}
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], rotate: [0, 2, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background: "radial-gradient(circle, #FFD700 0%, #D8FF3E 70%, #B8E600 100%)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
                      color: "#000000",
                      fontWeight: 900,
                      fontSize: "8px",
                      lineHeight: 1,
                      textAlign: "center",
                      border: "2px solid #FFFFFF",
                    }}
                  >
                    <Sparkles size={16} />
                    <span style={{ marginTop: 2, fontWeight: 900 }}>{data.sealText || "VERIFIED"}</span>
                  </motion.div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "10px", color: "#A1A1AA", ...MF }}>DATE OF ISSUE</div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: LIME, ...MF }}>{data.issueYear}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Verified Skills Grid */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h4
              style={{
                fontSize: "12px",
                color: "#A1A1AA",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: "0.75rem",
                ...MF,
              }}
            >
              Verified Competencies & Skills
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {data.skillsVerified.map((skill, idx) => (
                <span
                  key={idx}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 12px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: 8,
                    fontSize: "13px",
                    color: "#F4F4F5",
                  }}
                >
                  <CheckCircle2 size={14} color={LIME} /> {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              paddingTop: "1.25rem",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: LIME, fontSize: "12px", ...MF }}>
              <Sparkles size={14} /> Interactive 3D Hologram (Hover card to tilt)
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={onClose}
                style={{
                  padding: "10px 20px",
                  background: LIME,
                  color: "#080808",
                  border: "none",
                  borderRadius: 10,
                  fontSize: "13px",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <CheckCircle2 size={16} /> Close Preview
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
