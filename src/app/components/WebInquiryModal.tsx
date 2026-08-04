import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle2, Shield, ArrowRight, MessageCircle, AlertTriangle } from "lucide-react";
import { PricingPlan, CoachItem, AdminSiteData, recordEnquiryLead, defaultSiteData } from "../adminStore";

const LIME = "#D8FF3E";

const gymRules = [
  { icon: "👕", rule: "Sleeveless T-shirts are not allowed inside the workout floor." },
  { icon: "👟", rule: "Please carry a separate pair of clean workout shoes." },
  { icon: "🥾", rule: "Outside shoes are strictly not allowed inside the workout area." },
  { icon: "🤝", rule: "Maintain discipline and respect fellow members & coaches." },
  { icon: "🧹", rule: "Keep the gym clean and re-rack all weights/equipment after use." },
  { icon: "🏋️", rule: "Follow all exercise and form instructions given by the trainers." },
  { icon: "⏰", rule: "Choose only one fixed training slot — Morning or Evening." },
];

interface WebInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: PricingPlan | null;
  siteData?: AdminSiteData;
  onUpdateSiteData?: (updated: AdminSiteData) => void;
}

export const WebInquiryModal: React.FC<WebInquiryModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
  siteData,
  onUpdateSiteData,
}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [slot, setSlot] = useState("Morning (6:00 AM - 10:30 AM)");
  const [goal, setGoal] = useState("Muscle Building & Strength");
  const [preferredCoach, setPreferredCoach] = useState("No Specific Coach (General Guidance)");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !selectedPlan) return null;

  // Standard vs Web Exclusive 25% Off Price
  const standardPrice = selectedPlan.price;
  const webOfferPrice = Math.round(standardPrice * 0.75); // 25% off
  const savingsAmount = standardPrice - webOfferPrice;

  const activeSiteData = siteData || defaultSiteData;
  const coachesList = activeSiteData.coaches || defaultSiteData.coaches;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    recordEnquiryLead(
      {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        goal: goal,
        preferredCoach: preferredCoach,
        planName: selectedPlan.name,
      },
      activeSiteData,
      onUpdateSiteData
    );

    setSubmitted(true);
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Coach Girish! I submitted an inquiry on the website to claim the 25% Web Discount.\n\n` +
      `📌 *Plan*: ${selectedPlan.name}\n` +
      `🏷️ *Standard Price*: ₹${standardPrice.toLocaleString()}\n` +
      `⚡ *Website Offer Price*: ₹${webOfferPrice.toLocaleString()} (Saved ₹${savingsAmount.toLocaleString()})\n` +
      `👤 *Name*: ${name}\n` +
      `📞 *Phone*: ${phone}\n` +
      (email ? `📧 *Email*: ${email}\n` : "") +
      `⏰ *Preferred Slot*: ${slot}\n` +
      `🎯 *Fitness Goal*: ${goal}\n` +
      `🏋️ *Personal Trainer Coach Choice*: ${preferredCoach}\n\n` +
      `I have read & agreed to the Official Gym Rules.`
    );
    window.open(`https://wa.me/919900897907?text=${text}`, "_blank");
    handleResetAndClose();
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setName("");
    setPhone("");
    onClose();
  };

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
          padding: "1rem",
          background: "rgba(0, 0, 0, 0.85)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
        }}
        onClick={handleResetAndClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: submitted ? 620 : 520,
            background: "#0F0F12",
            border: "1px solid rgba(216, 255, 62, 0.35)",
            borderRadius: 20,
            padding: "2rem",
            boxShadow: "0 24px 60px rgba(0, 0, 0, 0.95), 0 0 50px rgba(216, 255, 62, 0.15)",
            position: "relative",
            color: "#FFFFFF",
            maxHeight: "90vh",
            overflowY: "auto",
            transition: "max-width 0.3s ease",
          }}
          data-lenis-prevent="true"
        >
          {/* Close Button */}
          <button
            onClick={handleResetAndClose}
            style={{
              position: "absolute",
              top: 18,
              right: 18,
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "#A1A1AA",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "#FFF";
              el.style.background = "rgba(255, 255, 255, 0.15)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "#A1A1AA";
              el.style.background = "rgba(255, 255, 255, 0.06)";
            }}
          >
            <X size={16} />
          </button>

          {!submitted ? (
            <>
              {/* Top Badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: LIME,
                  color: "#080808",
                  fontFamily: '"JetBrains Mono", monospace',
                  fontWeight: 800,
                  fontSize: 10,
                  padding: "5px 12px",
                  borderRadius: 20,
                  letterSpacing: "0.1em",
                  marginBottom: "1rem",
                }}
              >
                ⚡ WEBSITE EXCLUSIVE • FLAT 25% OFF
              </div>

              {/* Title */}
              <h2
                style={{
                  fontFamily: '"Big Shoulders Display", Impact, sans-serif',
                  fontSize: "1.9rem",
                  fontWeight: 900,
                  letterSpacing: "0.02em",
                  color: "#FFFFFF",
                  margin: "0 0 0.25rem",
                  lineHeight: 1.1,
                  textTransform: "uppercase",
                }}
              >
                CLAIM 25% OFF MEMBERSHIP
              </h2>
              <p
                style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 13,
                  color: "#A1A1AA",
                  margin: "0 0 1.25rem",
                  lineHeight: 1.5,
                }}
              >
                Submit your inquiry below to lock in your 25% website discount directly with Coach Girish.
              </p>

              {/* Plan & Pricing Summary Box */}
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(216, 255, 62, 0.25)",
                  borderRadius: 12,
                  padding: "1rem 1.25rem",
                  marginBottom: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: 10,
                      color: LIME,
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      marginBottom: 2,
                    }}
                  >
                    {selectedPlan.name}
                  </div>
                  <div style={{ fontSize: 12, color: "#71717A", textDecoration: "line-through" }}>
                    Standard Price: ₹{standardPrice.toLocaleString()}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontFamily: '"Big Shoulders Display", Impact, sans-serif',
                      fontSize: "2rem",
                      fontWeight: 900,
                      color: LIME,
                      lineHeight: 1,
                    }}
                  >
                    ₹{webOfferPrice.toLocaleString()}/-
                  </div>
                  <div
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: 9,
                      color: "#FF3E3E",
                      fontWeight: 700,
                    }}
                  >
                    YOU SAVE ₹{savingsAmount.toLocaleString()} (25% OFF)
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#E4E4E7",
                      letterSpacing: "0.1em",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    YOUR FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      background: "#18181B",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: 8,
                      color: "#FFFFFF",
                      fontSize: 14,
                      outline: "none",
                      boxSizing: "border-box",
                      fontFamily: '"DM Sans", sans-serif',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = LIME)}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.12)")}
                  />
                </div>

                <div>
                  <label
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#E4E4E7",
                      letterSpacing: "0.1em",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    PHONE / WHATSAPP NUMBER *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      background: "#18181B",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: 8,
                      color: "#FFFFFF",
                      fontSize: 14,
                      outline: "none",
                      boxSizing: "border-box",
                      fontFamily: '"DM Sans", sans-serif',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = LIME)}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.12)")}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: 9.5,
                        fontWeight: 700,
                        color: "#E4E4E7",
                        letterSpacing: "0.1em",
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      PREFERRED SLOT
                    </label>
                    <select
                      value={slot}
                      onChange={(e) => setSlot(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "11px 10px",
                        background: "#18181B",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        borderRadius: 8,
                        color: "#FFFFFF",
                        fontSize: 12,
                        outline: "none",
                        boxSizing: "border-box",
                        fontFamily: '"DM Sans", sans-serif',
                      }}
                    >
                      <option>Morning (6:00 AM - 10:30 AM)</option>
                      <option>Evening (4:30 PM - 9:30 PM)</option>
                    </select>
                  </div>

                  <div>
                    <label
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: 9.5,
                        fontWeight: 700,
                        color: "#E4E4E7",
                        letterSpacing: "0.1em",
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      MAIN GOAL
                    </label>
                    <select
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "11px 10px",
                        background: "#18181B",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        borderRadius: 8,
                        color: "#FFFFFF",
                        fontSize: 12,
                        outline: "none",
                        boxSizing: "border-box",
                        fontFamily: '"DM Sans", sans-serif',
                      }}
                    >
                      <option>Muscle Building & Strength</option>
                      <option>Fat Loss & Toning</option>
                      <option>General Fitness & Stamina</option>
                      <option>1-on-1 Athlete Mentorship</option>
                    </select>
                  </div>
                </div>

                {/* Personal Training Coach Choice (Optional) */}
                <div>
                  <label
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: 9.5,
                      fontWeight: 700,
                      color: LIME,
                      letterSpacing: "0.1em",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    PERSONAL TRAINING COACH CHOICE (OPTIONAL)
                  </label>
                  <select
                    value={preferredCoach}
                    onChange={(e) => setPreferredCoach(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "11px 10px",
                      background: "#18181B",
                      border: "1px solid rgba(216, 255, 62, 0.3)",
                      borderRadius: 8,
                      color: LIME,
                      fontSize: 12,
                      fontWeight: 600,
                      outline: "none",
                      boxSizing: "border-box",
                      fontFamily: '"DM Sans", sans-serif',
                    }}
                  >
                    <option value="No Specific Coach (General Guidance)">
                      🏋️ Any Certified Coach (General Guidance)
                    </option>
                    {coachesList.map((c) => {
                      const coachName = c.title || (c as any).name || "Coach";
                      const coachSpecialty = c.subtitle || (c as any).role || "Certified Trainer";
                      const coachMeta = c.meta || (c as any).experience || "";
                      return (
                        <option key={c.id} value={`Coach ${coachName} (${coachSpecialty})`}>
                          ⭐ Coach {coachName} — {coachSpecialty} {coachMeta ? `[${coachMeta}]` : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  style={{
                    marginTop: "0.5rem",
                    width: "100%",
                    padding: "14px",
                    background: LIME,
                    color: "#080808",
                    fontFamily: '"JetBrains Mono", monospace',
                    fontWeight: 900,
                    fontSize: 12.5,
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    letterSpacing: "0.12em",
                    boxShadow: "0 6px 20px rgba(216, 255, 62, 0.35)",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  CLAIM 25% OFF — GET IT FOR ₹{webOfferPrice.toLocaleString()} <ArrowRight size={16} />
                </button>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    color: "#71717A",
                    fontSize: 11,
                    fontFamily: '"DM Sans", sans-serif',
                    marginTop: 4,
                  }}
                >
                  <Shield size={12} color={LIME} /> Direct confirmation with Coach Girish. Zero hidden fees.
                </div>
              </form>
            </>
          ) : (
            /* 📜 STEP 2 POPUP: OFFICIAL GYM RULES & CODE OF CONDUCT */
            <div>
              {/* Success Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "rgba(216, 255, 62, 0.08)",
                  border: "1px solid rgba(216, 255, 62, 0.25)",
                  padding: "12px 16px",
                  borderRadius: 12,
                  marginBottom: "1.5rem",
                }}
              >
                <CheckCircle2 size={24} color={LIME} style={{ flexShrink: 0 }} />
                <div>
                  <div
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: 11,
                      fontWeight: 800,
                      color: LIME,
                      letterSpacing: "0.1em",
                    }}
                  >
                    INQUIRY SUBMITTED • 25% DISCOUNT RESERVED
                  </div>
                  <div style={{ fontSize: 12, color: "#CCCCCC" }}>
                    Locked <strong style={{ color: "#FFF" }}>{selectedPlan.name}</strong> at <strong style={{ color: LIME }}>₹{webOfferPrice.toLocaleString()}</strong> for {name}.
                  </div>
                </div>
              </div>

              {/* Title & Banner */}
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <div
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 9.5,
                    color: "#FF3E3E",
                    letterSpacing: "0.25em",
                    marginBottom: 4,
                    fontWeight: 800,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <AlertTriangle size={12} color="#FF3E3E" /> GYM CODE OF CONDUCT & DISCIPLINE POLICY
                </div>
                <h2
                  style={{
                    fontFamily: '"Big Shoulders Display", Impact, sans-serif',
                    fontSize: "2.2rem",
                    fontWeight: 900,
                    color: "#FFFFFF",
                    margin: 0,
                    letterSpacing: "0.02em",
                    lineHeight: 1,
                  }}
                >
                  OFFICIAL HERCULES GYM RULES
                </h2>
                <p style={{ fontSize: 13, color: "#A1A1AA", margin: "6px 0 0" }}>
                  Please review & acknowledge our official gym rules before visiting the floor:
                </p>
              </div>

              {/* Rules List Grid */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  marginBottom: "1.75rem",
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: 14,
                  padding: "1.25rem",
                  maxHeight: "320px",
                  overflowY: "auto",
                }}
              >
                {gymRules.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      padding: "10px 14px",
                      borderRadius: 8,
                    }}
                  >
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ fontSize: 13, color: "#E4E4E7", lineHeight: 1.4, fontWeight: 500 }}>
                      {item.rule}
                    </span>
                  </div>
                ))}

                <div
                  style={{
                    textAlign: "center",
                    marginTop: 6,
                    paddingTop: 10,
                    borderTop: "1px dashed rgba(216, 255, 62, 0.25)",
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 10,
                    fontWeight: 800,
                    color: LIME,
                    letterSpacing: "0.2em",
                  }}
                >
                  TRAIN HARD • STAY DISCIPLINED • BE FIT
                </div>
              </div>

              {/* WhatsApp Action Button */}
              <button
                onClick={handleOpenWhatsApp}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "#25D366",
                  color: "#000000",
                  fontFamily: '"JetBrains Mono", monospace',
                  fontWeight: 900,
                  fontSize: 12.5,
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  letterSpacing: "0.1em",
                  boxShadow: "0 6px 20px rgba(37, 211, 102, 0.35)",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <MessageCircle size={18} fill="#000" color="#25D366" /> CHAT WITH COACH GIRISH ON WHATSAPP <ArrowRight size={16} />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
