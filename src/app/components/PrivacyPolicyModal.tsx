import React, { useEffect } from "react";
import { X, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
              <ShieldCheck size={22} />
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
                PRIVACY POLICY
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
                EFFECTIVE DATE: AUGUST 4, 2026
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
            lineHeight: 1.7,
            fontFamily: "sans-serif",
          }}
        >
          <p style={{ marginTop: 0, fontSize: "1.03125rem", color: "#f4f4f5", fontWeight: 500 }}>
            At <strong>Hercules Fitness</strong>, we value your privacy and are committed to protecting the personal information you share with us.
          </p>

          <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#d8ff3e", marginTop: 28, marginBottom: 10 }}>
            1. Information We Collect
          </h3>
          <p style={{ margin: "0 0 10px" }}>When you use our website or fill out our enquiry form, we may collect:</p>
          <ul style={{ margin: "0 0 16px", paddingLeft: 24, color: "#a1a1aa" }}>
            <li>Full Name</li>
            <li>Phone Number</li>
            <li>Email Address (if provided)</li>
            <li>Fitness goals or enquiry details</li>
            <li>Any other information you voluntarily submit</li>
          </ul>
          <p style={{ margin: 0 }}>
            We may also collect basic technical information such as your IP address, browser type, and device information to improve our website.
          </p>

          <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#d8ff3e", marginTop: 28, marginBottom: 10 }}>
            2. How We Use Your Information
          </h3>
          <p style={{ margin: "0 0 10px" }}>We use your information to:</p>
          <ul style={{ margin: "0 0 16px", paddingLeft: 24, color: "#a1a1aa" }}>
            <li>Respond to your enquiries</li>
            <li>Contact you regarding memberships, offers, or fitness programs</li>
            <li>Schedule consultations or gym visits</li>
            <li>Improve our services and website experience</li>
            <li>Send important updates related to your enquiry</li>
          </ul>
          <p style={{ margin: 0 }}>
            We do <strong>not</strong> sell or rent your personal information to third parties.
          </p>

          <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#d8ff3e", marginTop: 28, marginBottom: 10 }}>
            3. Information Sharing
          </h3>
          <p style={{ margin: "0 0 10px" }}>We may share your information only:</p>
          <ul style={{ margin: "0 0 16px", paddingLeft: 24, color: "#a1a1aa" }}>
            <li>With trusted service providers who help us operate our website or communication systems.</li>
            <li>When required by law or legal authorities.</li>
            <li>To protect our legal rights or prevent fraud.</li>
          </ul>

          <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#d8ff3e", marginTop: 28, marginBottom: 10 }}>
            4. Data Security
          </h3>
          <p style={{ margin: 0 }}>
            We take reasonable measures to protect your personal information from unauthorized access, misuse, or disclosure. While no online system is completely secure, we strive to use industry-standard security practices.
          </p>

          <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#d8ff3e", marginTop: 28, marginBottom: 10 }}>
            5. Cookies
          </h3>
          <p style={{ margin: 0 }}>
            Our website may use cookies or similar technologies to improve user experience, analyze website traffic, and enhance website performance. You may disable cookies through your browser settings if you prefer.
          </p>

          <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#d8ff3e", marginTop: 28, marginBottom: 10 }}>
            6. Third-Party Services
          </h3>
          <p style={{ margin: 0 }}>
            Our website may use third-party tools such as Google Maps, Google Analytics, Meta Pixel, or similar services to improve website functionality and marketing performance. These services may collect information according to their own privacy policies.
          </p>

          <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#d8ff3e", marginTop: 28, marginBottom: 10 }}>
            7. Your Rights
          </h3>
          <p style={{ margin: "0 0 10px" }}>You may request to:</p>
          <ul style={{ margin: "0 0 16px", paddingLeft: 24, color: "#a1a1aa" }}>
            <li>Access the personal information we hold about you.</li>
            <li>Correct inaccurate information.</li>
            <li>Delete your personal information, where legally permitted.</li>
            <li>Withdraw consent for future communications.</li>
          </ul>
          <p style={{ margin: 0 }}>To make any request, please contact us using the details below.</p>

          <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#d8ff3e", marginTop: 28, marginBottom: 10 }}>
            8. Contact Us
          </h3>
          <p style={{ margin: "0 0 16px" }}>
            If you have any questions about this Privacy Policy or how your information is handled, please contact us:
          </p>
          <div
            style={{
              background: "#121215",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 10,
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ fontWeight: 700, color: "#ffffff", fontSize: "1rem" }}>Hercules Fitness</div>
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

          <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#d8ff3e", marginTop: 28, marginBottom: 10 }}>
            9. Changes to This Privacy Policy
          </h3>
          <p style={{ margin: "0 0 20px" }}>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.
          </p>

          <div
            style={{
              background: "rgba(216, 255, 62, 0.06)",
              borderLeft: "4px solid #d8ff3e",
              padding: "14px 18px",
              borderRadius: "0 8px 8px 0",
              fontSize: "0.875rem",
              color: "#e4e4e7",
              fontStyle: "italic",
            }}
          >
            By using this website or submitting the enquiry form, you agree to the terms of this Privacy Policy.
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
            I UNDERSTAND & CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
