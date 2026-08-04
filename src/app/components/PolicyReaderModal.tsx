import React, { useEffect } from "react";
import { X, ShieldCheck, FileText, RefreshCw, Mail, Phone, MapPin } from "lucide-react";
import { LegalPolicies } from "../adminStore";

interface PolicyReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  policyType: "privacy" | "terms" | "refunds" | null;
  policies: LegalPolicies;
}

export const PolicyReaderModal: React.FC<PolicyReaderModalProps> = ({
  isOpen,
  onClose,
  policyType,
  policies,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !policyType) return null;

  const getTitle = () => {
    switch (policyType) {
      case "privacy":
        return "PRIVACY POLICY";
      case "terms":
        return "TERMS & CONDITIONS";
      case "refunds":
        return "REFUND & CANCELLATION POLICY";
    }
  };

  const getIcon = () => {
    switch (policyType) {
      case "privacy":
        return <ShieldCheck size={22} />;
      case "terms":
        return <FileText size={22} />;
      case "refunds":
        return <RefreshCw size={22} />;
    }
  };

  const getContent = () => {
    switch (policyType) {
      case "privacy":
        return policies.privacyPolicy;
      case "terms":
        return policies.termsAndConditions;
      case "refunds":
        return policies.refundPolicy;
    }
  };

  const rawContent = getContent() || "";
  const lines = rawContent.split("\n");

  return (
    <div
      data-lenis-prevent="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0c0c0e",
          border: "1px solid rgba(216, 255, 62, 0.25)",
          borderRadius: 16,
          width: "100%",
          maxWidth: 780,
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(216, 255, 62, 0.08)",
          animation: "fadeIn 0.2s ease-out",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px 32px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(255, 255, 255, 0.02)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(216, 255, 62, 0.12)",
                border: "1px solid rgba(216, 255, 62, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#d8ff3e",
              }}
            >
              {getIcon()}
            </div>
            <div>
              <h2
                style={{
                  fontFamily: '"Big Shoulders Display", Impact, sans-serif',
                  fontWeight: 900,
                  fontSize: "1.5rem",
                  letterSpacing: "0.05em",
                  color: "#ffffff",
                  margin: 0,
                  textTransform: "uppercase",
                }}
              >
                {getTitle()}
              </h2>
              <p
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: "0.75rem",
                  color: "#d8ff3e",
                  margin: "2px 0 0",
                  letterSpacing: "0.05em",
                }}
              >
                HERCULES FITNESS — KALABURAGI
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "50%",
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#a1a1aa",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
              e.currentTarget.style.color = "#a1a1aa";
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div
          data-lenis-prevent="true"
          style={{
            padding: "32px",
            overflowY: "auto",
            color: "#d4d4d8",
            fontSize: "0.9375rem",
            lineHeight: 1.75,
            fontFamily: "sans-serif",
          }}
        >
          {lines.map((line, idx) => {
            const trimmed = line.trim();
            if (!trimmed) return <div key={idx} style={{ height: 12 }} />;
            if (trimmed.startsWith("# ")) {
              return (
                <h1 key={idx} style={{ fontSize: "1.375rem", fontWeight: 800, color: "#ffffff", margin: "0 0 16px" }}>
                  {trimmed.replace("# ", "")}
                </h1>
              );
            }
            if (trimmed.startsWith("## ")) {
              return (
                <h3 key={idx} style={{ fontSize: "1.125rem", fontWeight: 700, color: "#d8ff3e", marginTop: 24, marginBottom: 8 }}>
                  {trimmed.replace("## ", "")}
                </h3>
              );
            }
            if (trimmed.startsWith("* ")) {
              return (
                <div key={idx} style={{ paddingLeft: 16, marginBottom: 6, color: "#a1a1aa", display: "flex", gap: 8 }}>
                  <span style={{ color: "#d8ff3e" }}>•</span>
                  <span>{trimmed.replace("* ", "")}</span>
                </div>
              );
            }
            return (
              <p key={idx} style={{ margin: "0 0 12px", color: "#d4d4d8" }}>
                {trimmed}
              </p>
            );
          })}

          <div
            style={{
              marginTop: 32,
              background: "#121215",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 10,
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ fontWeight: 700, color: "#ffffff", fontSize: "1rem" }}>Hercules Fitness Kalaburagi</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.875rem", color: "#a1a1aa" }}>
              <MapPin size={16} color="#d8ff3e" />
              <span>2nd Floor, Sy #71/1A, Plot #18, New Jewargi Rd, above Ola Showroom, State Bank Colony, Kalaburagi, Karnataka 585102</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.875rem", color: "#a1a1aa" }}>
              <Phone size={16} color="#d8ff3e" />
              <span>+91 99008 97907</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.875rem", color: "#a1a1aa" }}>
              <Mail size={16} color="#d8ff3e" />
              <span>support@herculesfitness.in</span>
            </div>
          </div>
        </div>

        {/* Footer close CTA */}
        <div
          style={{
            padding: "16px 32px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            justifyContent: "flex-end",
            background: "rgba(255, 255, 255, 0.02)",
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "#d8ff3e",
              color: "#09090b",
              border: "none",
              borderRadius: 6,
              padding: "10px 24px",
              fontSize: "0.875rem",
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.05em",
            }}
          >
            CLOSE DOCUMENT
          </button>
        </div>
      </div>
    </div>
  );
};
