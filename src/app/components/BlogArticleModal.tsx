import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, User, ArrowRight, BookOpen } from "lucide-react";
import { BlogPost } from "../adminStore";

const LIME = "#D8FF3E";

const DF: React.CSSProperties = {
  fontFamily: '"Big Shoulders Display", Impact, sans-serif',
  fontWeight: 900,
};

const MF: React.CSSProperties = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Plus Jakarta Sans", "Inter", sans-serif',
};

interface BlogArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  blog: BlogPost | null;
}

export const BlogArticleModal: React.FC<BlogArticleModalProps> = ({ isOpen, onClose, blog }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !blog) return null;

  const paragraphs = blog.content.split("\n\n").filter(Boolean);

  return (
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem",
          background: "rgba(4, 4, 6, 0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: 720,
            maxHeight: "85vh",
            background: "#0E0E12",
            border: "1px solid rgba(216, 255, 62, 0.3)",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.95), 0 0 40px rgba(216, 255, 62, 0.12)",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "1.75rem 2rem 1.25rem",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              background: "rgba(18, 18, 24, 0.95)",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  ...MF,
                  fontSize: 9.5,
                  color: LIME,
                  background: "rgba(216, 255, 62, 0.08)",
                  border: "1px solid rgba(216, 255, 62, 0.25)",
                  padding: "4px 10px",
                  borderRadius: 4,
                  letterSpacing: "0.15em",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                <BookOpen size={12} /> {blog.category || "FITNESS GUIDE"} • KALABURAGI
              </div>

              <h2
                style={{
                  ...DF,
                  fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
                  color: "#FFFFFF",
                  lineHeight: 1.1,
                  margin: "0 0 8px",
                  letterSpacing: "0.02em",
                }}
              >
                {blog.title}
              </h2>

              {blog.subtitle && (
                <p style={{ color: "#A1A1AA", fontSize: 13.5, margin: "0 0 10px", lineHeight: 1.5 }}>
                  {blog.subtitle}
                </p>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 6 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6, ...MF, fontSize: 10, color: "#888" }}>
                  <User size={12} color={LIME} /> {blog.author || "Coach Girish"}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, ...MF, fontSize: 10, color: "#888" }}>
                  <Calendar size={12} color={LIME} /> {blog.date || "August 2024"}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "50%",
                width: 34,
                height: 34,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#CCCCCC",
                cursor: "pointer",
                flexShrink: 0,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.background = LIME;
                el.style.color = "#080808";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.background = "rgba(255, 255, 255, 0.06)";
                el.style.color = "#CCCCCC";
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Article Body Content */}
          <div
            style={{
              padding: "2rem",
              overflowY: "auto",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {paragraphs.map((p, i) => (
              <p
                key={i}
                style={{
                  color: "#D4D4D8",
                  fontSize: 14.5,
                  lineHeight: 1.85,
                  margin: 0,
                  whiteSpace: "pre-line",
                }}
              >
                {p}
              </p>
            ))}
          </div>

          {/* Footer CTA */}
          <div
            style={{
              padding: "1.25rem 2rem",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              background: "rgba(14, 14, 18, 0.95)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ ...MF, fontSize: 10, color: "#888" }}>
              HERCULES FITNESS CENTRE — KALABURAGI
            </div>
            <a
              href="#membership"
              onClick={onClose}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: LIME,
                color: "#080808",
                padding: "10px 20px",
                borderRadius: 6,
                ...MF,
                fontSize: 10.5,
                fontWeight: 800,
                letterSpacing: "0.12em",
                textDecoration: "none",
                boxShadow: "0 4px 15px rgba(216, 255, 62, 0.3)",
              }}
            >
              CLAIM 25% OFF MEMBERSHIP <ArrowRight size={13} />
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
