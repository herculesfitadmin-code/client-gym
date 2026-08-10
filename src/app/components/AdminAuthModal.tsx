import React, { useState } from "react";
import { ShieldCheck, Lock, Mail, Eye, EyeOff, X, KeyRound } from "lucide-react";
import { loadSiteData, AdminSiteData } from "../adminStore";
import { fetchFirebaseSiteData } from "../firebaseConfig";
import { HerculesLogo } from "./HerculesLogo";

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (authenticatedEmail: string) => void;
  siteData?: AdminSiteData;
}

const LIME = "#D8FF3E";

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  siteData,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Both Email ID and Password are required to access Admin Console.");
      setIsSubmitting(false);
      return;
    }

    // 1. Gather all admin accounts from live state, local storage, and Firestore
    let adminList = siteData?.admins || [];

    // 2. Fetch directly from Cloud Firestore if needed
    if (!adminList || adminList.length === 0) {
      try {
        const remoteData = await fetchFirebaseSiteData();
        if (remoteData && Array.isArray(remoteData.admins)) {
          adminList = remoteData.admins;
        }
      } catch (err) {
        console.warn("Auth Firestore fetch notice:", err);
      }
    }

    // 3. Fallback to localStorage
    if (!adminList || adminList.length === 0) {
      const localData = loadSiteData();
      adminList = localData?.admins || [];
    }

    const matchedAdmin = adminList.find(
      (a) =>
        a.email.trim().toLowerCase() === trimmedEmail &&
        a.password.trim() === trimmedPassword
    );

    // Default emergency owner credentials fallback
    const isValidDefault =
      (trimmedEmail === "abcd@gmail.com" || trimmedEmail === "girish@herculesfitness.in") &&
      trimmedPassword === "abcd1234";

    if (matchedAdmin || isValidDefault) {
      setIsSubmitting(false);
      const loggedEmail = matchedAdmin ? matchedAdmin.email : trimmedEmail;
      setEmail("");
      setPassword("");
      setError(null);
      onSuccess(loggedEmail);
    } else {
      setError("Invalid Email ID or Password. Access denied.");
      setIsSubmitting(false);
    }
  };

  return (
    <div
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
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "#0d0d0e",
          border: "1px solid rgba(216, 255, 62, 0.25)",
          borderRadius: 12,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(216, 255, 62, 0.08)",
          overflow: "hidden",
          position: "relative",
          animation: "adminModalFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.75rem 2rem 1.25rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(180deg, rgba(216, 255, 62, 0.04) 0%, transparent 100%)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <HerculesLogo size={42} />
            <div>
              <h3
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.5rem",
                  letterSpacing: "0.08em",
                  color: "#fff",
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                ADMIN AUTHENTICATION
              </h3>
              <p
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 10,
                  color: "#888",
                  letterSpacing: "0.15em",
                  margin: "4px 0 0",
                }}
              >
                OWNER ACCESS PORTAL
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#888",
              cursor: "pointer",
              padding: 4,
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: "1.75rem 2rem 2rem" }}>
          {error && (
            <div
              style={{
                padding: "0.75rem 1rem",
                borderRadius: 6,
                background: "rgba(255, 59, 48, 0.12)",
                border: "1px solid rgba(255, 59, 48, 0.3)",
                color: "#ff6b6b",
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Lock size={14} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <div style={{ marginBottom: "1.25rem" }}>
            <label
              style={{
                display: "block",
                fontFamily: "'Space Mono', monospace",
                fontSize: 10,
                color: LIME,
                letterSpacing: "0.2em",
                marginBottom: 8,
                textTransform: "uppercase",
              }}
            >
              EMAIL ID / ADMIN ID
            </label>
            <div style={{ position: "relative" }}>
              <Mail
                size={16}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#666",
                }}
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="abcd@gmail.com"
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 42px",
                  background: "#141416",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: 6,
                  color: "#fff",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 13,
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = LIME)}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.1)")}
              />
            </div>
          </div>

          <div style={{ marginBottom: "1.75rem" }}>
            <label
              style={{
                display: "block",
                fontFamily: "'Space Mono', monospace",
                fontSize: 10,
                color: LIME,
                letterSpacing: "0.2em",
                marginBottom: 8,
                textTransform: "uppercase",
              }}
            >
              PASSWORD
            </label>
            <div style={{ position: "relative" }}>
              <KeyRound
                size={16}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#666",
                }}
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="abcd1234"
                style={{
                  width: "100%",
                  padding: "12px 44px 12px 42px",
                  background: "#141416",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: 6,
                  color: "#fff",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 13,
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = LIME)}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.1)")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#666",
                  cursor: "pointer",
                  padding: 4,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "14px",
              background: LIME,
              color: "#080808",
              border: "none",
              borderRadius: 6,
              fontFamily: "'Space Mono', monospace",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.2em",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              transition: "transform 0.15s, opacity 0.15s",
              opacity: isSubmitting ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) e.currentTarget.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) e.currentTarget.style.opacity = "1";
            }}
          >
            {isSubmitting ? "AUTHENTICATING..." : "VERIFY & ENTER ADMIN PANEL"}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes adminModalFadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};
