import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  AdminSiteData,
  PricingPlan,
  AdminUser,
  FounderData,
  BlogPost,
  EnquiryLead,
  defaultSiteData,
  fetchCloudSiteData,
  pushToCloud,
  DEFAULT_CLOUD_DB_URL,
} from "../adminStore";
import {
  FirebaseConfig,
  loadFirebaseConfig,
  saveFirebaseConfig,
  fetchFirebaseSiteData,
  pushToFirebase,
} from "../firebaseConfig";
import { uploadMediaFileToFirebase } from "../../lib/firebase";
import { CoachItem } from "./CoachesStackedCards";
import { HerculesLogo } from "./HerculesLogo";
import {
  LogOut, Plus, Trash2, Edit3, Check, Eye, EyeOff,
  ShieldCheck, UserPlus, UserX, ChevronRight, Sparkles,
  UploadCloud, BookOpen, Scale, FileText, Copy,
  Download, Send, Database, Home, DollarSign, Users,
  Image, Bell, Phone, Settings, BarChart2, X, Menu,
  Save, ArrowLeft, RefreshCw, AlertTriangle, Star,
  MessageSquare, Tag, Zap, Globe, Lock, Shield, KeyRound,
} from "lucide-react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const ACCENT = "#D8FF3E";
const BG = "#0A0A0B";
const SURFACE = "#111113";
const SURFACE2 = "#18181C";
const BORDER = "rgba(255,255,255,0.07)";
const TEXT = "#FFFFFF";
const MUTED = "#71717A";
const MF: React.CSSProperties = { fontFamily: '"JetBrains Mono", monospace' };
const DF: React.CSSProperties = { fontFamily: '"Big Shoulders Display", Impact, sans-serif', fontWeight: 900 };
const SF: React.CSSProperties = { fontFamily: '"DM Sans", sans-serif' };

// ─── TOAST SYSTEM ─────────────────────────────────────────────────────────────
type ToastType = "success" | "error" | "info";
interface Toast { id: number; message: string; type: ToastType; }

function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const show = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);
  return { toasts, show };
}

function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 999999,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        alignItems: "center",
        pointerEvents: "none",
      }}
    >
      {toasts.map((t) => {
        const isSuccess = t.type === "success";
        const isError = t.type === "error";
        const accentColor = isSuccess ? "#D8FF3E" : isError ? "#FF3E3E" : "#3EFFD8";

        return (
          <div
            key={t.id}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(16, 16, 20, 0.92)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              border: `1px solid ${isError ? "rgba(255,62,62,0.4)" : "rgba(255,255,255,0.14)"}`,
              borderRadius: 50,
              padding: "10px 22px",
              boxShadow: isSuccess
                ? "0 20px 50px rgba(0,0,0,0.8), 0 0 25px rgba(216,255,62,0.2)"
                : isError
                ? "0 20px 50px rgba(0,0,0,0.8), 0 0 25px rgba(255,62,62,0.2)"
                : "0 20px 50px rgba(0,0,0,0.8)",
              animation: "applePillIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
              whiteSpace: "nowrap",
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: accentColor,
                boxShadow: `0 0 10px ${accentColor}`,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                ...MF,
                fontSize: 10.5,
                fontWeight: 700,
                color: "#FFFFFF",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              {t.message}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── SHARED UI COMPONENTS ─────────────────────────────────────────────────────
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ ...MF, fontSize: 10, color: MUTED, letterSpacing: "0.18em" }}>{label}</label>
      {children}
      {hint && <span style={{ ...SF, fontSize: 11, color: MUTED, opacity: 0.7 }}>{hint}</span>}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text", multiline, rows }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; multiline?: boolean; rows?: number;
}) {
  const s: React.CSSProperties = {
    background: SURFACE, border: `1px solid ${BORDER}`, color: TEXT,
    padding: "11px 14px", borderRadius: 8, ...SF, fontSize: 13, outline: "none",
    width: "100%", boxSizing: "border-box", transition: "border-color 0.2s", resize: "vertical",
  };
  if (multiline) return (
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      rows={rows || 4} style={s}
      onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor = `${ACCENT}60`}
      onBlur={e => (e.target as HTMLTextAreaElement).style.borderColor = BORDER} />
  );
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={s}
      onFocus={e => (e.target as HTMLInputElement).style.borderColor = `${ACCENT}60`}
      onBlur={e => (e.target as HTMLInputElement).style.borderColor = BORDER} />
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button onClick={() => onChange(!checked)} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
      <div style={{ width: 44, height: 24, borderRadius: 12, background: checked ? ACCENT : SURFACE2, border: `1px solid ${checked ? ACCENT : BORDER}`, position: "relative", transition: "all 0.2s", flexShrink: 0 }}>
        <div style={{ position: "absolute", top: 2, left: checked ? 22 : 2, width: 18, height: 18, borderRadius: "50%", background: checked ? "#080808" : MUTED, transition: "left 0.2s" }} />
      </div>
      <span style={{ ...SF, fontSize: 13, color: checked ? TEXT : MUTED }}>{label}</span>
    </button>
  );
}

function Btn({ children, onClick, variant = "primary", small, disabled, danger }: {
  children: React.ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "ghost";
  small?: boolean; disabled?: boolean; danger?: boolean;
}) {
  const bg = danger ? "rgba(255,62,62,0.12)" : variant === "primary" ? ACCENT : variant === "secondary" ? SURFACE2 : "transparent";
  const color = danger ? "#FF3E3E" : variant === "primary" ? "#080808" : TEXT;
  const border = danger ? "1px solid rgba(255,62,62,0.3)" : variant === "secondary" ? `1px solid ${BORDER}` : "none";
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: bg, color, border, borderRadius: 8, cursor: disabled ? "not-allowed" : "pointer",
      padding: small ? "7px 14px" : "11px 20px", ...SF, fontSize: small ? 12 : 13, fontWeight: 600,
      display: "inline-flex", alignItems: "center", gap: 6, opacity: disabled ? 0.5 : 1,
      transition: "all 0.2s", whiteSpace: "nowrap",
    }}>
      {children}
    </button>
  );
}

function MediaUploader({
  value,
  onChange,
  type = "any",
  label,
  hint,
}: {
  value: string;
  onChange: (url: string) => void;
  type?: "image" | "video" | "any";
  label?: string;
  hint?: string;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadMediaFileToFirebase(file);
      if (url) {
        onChange(url);
      }
    } catch (err) {
      console.error("Error uploading file to Firebase Storage:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const acceptTypes =
    type === "video" ? "video/*" : type === "image" ? "image/*" : "image/*,video/*";

  const isVideo =
    type === "video" ||
    (value && (value.startsWith("data:video") || value.endsWith(".mp4") || value.endsWith(".webm")));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ ...MF, fontSize: 10, color: MUTED, letterSpacing: "0.18em" }}>{label}</label>}

      <input
        type="file"
        ref={fileInputRef}
        accept={acceptTypes}
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${isDragging ? ACCENT : BORDER}`,
          background: isDragging ? `${ACCENT}12` : SURFACE2,
          borderRadius: 10,
          padding: "16px",
          textAlign: "center",
          cursor: isUploading ? "wait" : "pointer",
          transition: "all 0.2s ease",
          position: "relative",
        }}
      >
        {isUploading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "12px 0" }}>
            <RefreshCw size={24} color={ACCENT} style={{ animation: "spin 1s linear infinite" }} />
            <span style={{ ...MF, fontSize: 11, color: ACCENT, letterSpacing: "0.15em" }}>
              UPLOADING TO FIREBASE STORAGE...
            </span>
          </div>
        ) : value ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            {isVideo ? (
              <video src={value} controls style={{ maxHeight: 140, maxWidth: "100%", borderRadius: 6 }} />
            ) : (
              <img src={value} alt="Preview" style={{ maxHeight: 140, maxWidth: "100%", borderRadius: 6, objectFit: "cover" }} />
            )}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: TEXT, padding: "6px 14px", borderRadius: 6, ...SF, fontSize: 11, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                <UploadCloud size={13} /> Change File
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onChange(""); }}
                style={{ background: "rgba(255,62,62,0.12)", border: "1px solid rgba(255,62,62,0.3)", color: "#FF3E3E", padding: "6px 14px", borderRadius: 6, ...SF, fontSize: 11, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                <Trash2 size={13} /> Remove
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "12px 0" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${ACCENT}15`, border: `1px solid ${ACCENT}30`, display: "flex", alignItems: "center", justifyContent: "center", color: ACCENT }}>
              <UploadCloud size={20} />
            </div>
            <div>
              <div style={{ ...SF, fontSize: 13, fontWeight: 600, color: TEXT }}>
                Drag & drop {type === "video" ? "video" : type === "image" ? "image" : "media file"} here
              </div>
              <div style={{ ...SF, fontSize: 11, color: MUTED, marginTop: 2 }}>
                or click to browse files on your device
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
        {hint && <span style={{ ...SF, fontSize: 11, color: MUTED, opacity: 0.7 }}>{hint}</span>}
        <button
          type="button"
          onClick={() => setShowUrlInput(s => !s)}
          style={{ background: "none", border: "none", color: ACCENT, ...SF, fontSize: 11, cursor: "pointer", textDecoration: "underline", marginLeft: "auto" }}
        >
          {showUrlInput ? "Hide URL input" : "Or paste URL manually"}
        </button>
      </div>

      {showUrlInput && (
        <div style={{ marginTop: 6 }}>
          <Input value={value} onChange={onChange} placeholder="https://... or /filename.mp4" />
        </div>
      )}
    </div>
  );
}

function SectionHead({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ ...DF, fontSize: 26, letterSpacing: "0.04em", margin: 0, color: TEXT }}>{title}</h2>
      {subtitle && <p style={{ ...SF, fontSize: 14, color: MUTED, margin: "6px 0 0" }}>{subtitle}</p>}
    </div>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 24px", ...style }}>
      {children}
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color?: string }) {
  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color || ACCENT}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ ...DF, fontSize: 22, color: color || ACCENT, lineHeight: 1 }}>{value}</div>
        <div style={{ ...MF, fontSize: 9, color: MUTED, letterSpacing: "0.15em", marginTop: 4 }}>{label}</div>
      </div>
    </div>
  );
}

// ─── NAV ITEM DEFINITION ─────────────────────────────────────────────────────
type PageId = "dashboard" | "homepage" | "pricing" | "coaches" | "media" | "offers" | "blog" | "contact" | "admins" | "enquiries" | "developer";
interface NavItem { id: PageId; label: string; icon: React.ReactNode; dev?: boolean; }

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard",  label: "Dashboard",       icon: <BarChart2 size={16} /> },
  { id: "homepage",   label: "Homepage",         icon: <Home size={16} /> },
  { id: "pricing",    label: "Pricing & Plans",  icon: <DollarSign size={16} /> },
  { id: "coaches",    label: "Coaches",          icon: <Users size={16} /> },
  { id: "media",      label: "Media & Gallery",  icon: <Image size={16} /> },
  { id: "offers",     label: "Offers & Deals",   icon: <Tag size={16} /> },
  { id: "blog",       label: "Articles & Blog",  icon: <BookOpen size={16} /> },
  { id: "contact",    label: "Contact Info",     icon: <Phone size={16} /> },
  { id: "admins",     label: "Admins",           icon: <Shield size={16} /> },
  { id: "enquiries",  label: "Enquiries CRM",    icon: <MessageSquare size={16} /> },
  { id: "developer",  label: "Developer",        icon: <Settings size={16} />, dev: true },
];

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
interface AdminControlPanelProps {
  isOpen: boolean;
  onClose: () => void;
  siteData: AdminSiteData;
  onSaveData: (data: AdminSiteData) => Promise<{ success: boolean; error?: string }> | void;
  onResetData: () => void;
  onLogout: () => void;
  currentUserEmail?: string;
}

export const AdminControlPanel: React.FC<AdminControlPanelProps> = ({
  isOpen, onClose, siteData, onSaveData, onResetData, onLogout, currentUserEmail = "admin@gym.com",
}) => {
  const [activePage, setActivePage] = useState<PageId>("dashboard");
  const [draft, setDraft] = useState<AdminSiteData>(siteData);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toasts, show: showToast } = useToast();

  const updateDraft = useCallback(<K extends keyof AdminSiteData>(key: K, value: AdminSiteData[K]) => {
    setDraft(d => ({ ...d, [key]: value }));
  }, []);

  const save = useCallback(async () => {
    showToast("SAVING TO FIRESTORE...", "info");
    const res = await onSaveData(draft);
    if (res && res.success) {
      showToast("FIRESTORE SYNCED", "success");
    } else if (res && !res.success) {
      showToast(
        res.error && res.error.includes("permissions")
          ? "PERMISSION DENIED — PUBLISH FIRESTORE RULES"
          : `FIRESTORE ERROR — ${res.error || "SAVE FAILED"}`,
        "error"
      );
    } else {
      showToast("CHANGES SAVED LOCALLY", "info");
    }
  }, [draft, onSaveData, showToast]);

  if (!isOpen) return null;

  return (
    <div
      data-lenis-prevent
      style={{ position: "fixed", inset: 0, zIndex: 99000, display: "flex", background: BG, height: "100dvh", overflow: "hidden" }}
    >
      <ToastContainer toasts={toasts} />

      {/* ═══ SIDEBAR ══════════════════════════════════════════════════════ */}
      {/* Desktop sidebar always visible; mobile it's an overlay */}
      <div
        className={`hf-admin-sidebar ${sidebarOpen ? "open" : ""}`}
        style={{
          width: 260,
          flexShrink: 0,
          background: SURFACE,
          borderRight: `1px solid ${BORDER}`,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
          zIndex: 100000,
        }}
      >
        {/* Logo */}
        <div style={{ padding: "20px 20px 16px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 10 }}>
          <HerculesLogo size={32} />
          <div>
            <div style={{ ...DF, fontSize: 14, letterSpacing: "0.1em" }}>HERCULES</div>
            <div style={{ ...MF, fontSize: 7, color: MUTED, letterSpacing: "0.3em" }}>ADMIN PANEL</div>
          </div>
          <button onClick={onClose} className="hf-admin-close-x" style={{ marginLeft: "auto", background: "none", border: "none", color: MUTED, cursor: "pointer", padding: 4 }}>
            <X size={16} />
          </button>
        </div>

        {/* User badge */}
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ background: `${ACCENT}10`, border: `1px solid ${ACCENT}25`, borderRadius: 8, padding: "8px 12px" }}>
            <div style={{ ...MF, fontSize: 9, color: ACCENT, letterSpacing: "0.15em" }}>LOGGED IN AS</div>
            <div style={{ ...SF, fontSize: 12, color: TEXT, marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentUserEmail}</div>
          </div>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "12px 0", WebkitOverflowScrolling: "touch" }}>
          {NAV_ITEMS.filter(n => !n.dev).map(item => (
            <NavBtn key={item.id} item={item} active={activePage === item.id} onClick={() => { setActivePage(item.id); setSidebarOpen(false); }} />
          ))}

          {/* Developer section divider */}
          <div style={{ margin: "16px 16px 8px", borderTop: `1px solid ${BORDER}` }} />
          <div style={{ ...MF, fontSize: 8, color: "#FF3E3E", letterSpacing: "0.2em", padding: "0 16px 6px" }}>⚠️ DEVELOPER</div>
          {NAV_ITEMS.filter(n => n.dev).map(item => (
            <NavBtn key={item.id} item={item} active={activePage === item.id} onClick={() => { setActivePage(item.id); setSidebarOpen(false); }} dev />
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${BORDER}` }}>
          <button onClick={() => { onLogout(); }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", background: "none", border: `1px solid rgba(255,62,62,0.2)`, borderRadius: 8, padding: "10px 14px", color: "#FF3E3E", cursor: "pointer", ...SF, fontSize: 13, fontWeight: 600 }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      {/* ═══ MOBILE OVERLAY BACKDROP ══════════════════════════════════════ */}
      {sidebarOpen && (
        <div
          className="hf-admin-overlay"
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            zIndex: 99998,
            cursor: "pointer",
          }}
        />
      )}

      {/* ═══ MAIN CONTENT ═════════════════════════════════════════════════ */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0, overflow: "hidden" }}>

        {/* Top bar */}
        <div style={{ height: 56, background: SURFACE, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 12, flexShrink: 0, zIndex: 1 }}>
          <button className="hf-admin-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", color: TEXT, cursor: "pointer", display: "none", padding: 4 }}>
            <Menu size={20} />
          </button>
          <div style={{ ...SF, fontSize: 14, color: MUTED, display: "flex", alignItems: "center" }}>
            {NAV_ITEMS.find(n => n.id === activePage)?.icon}
          </div>
          <div style={{ ...SF, fontSize: 14, fontWeight: 600, color: TEXT }}>
            {NAV_ITEMS.find(n => n.id === activePage)?.label}
          </div>

          {/* Save button */}
          <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
            <Btn onClick={save} variant="primary" small>
              <Save size={13} /> Save Changes
            </Btn>
            <button onClick={onClose} style={{ background: "none", border: `1px solid ${BORDER}`, color: MUTED, borderRadius: 6, padding: "6px 10px", cursor: "pointer", display: "flex", alignItems: "center" }}>
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 28px 48px" }}>
          <PageRouter
            page={activePage}
            draft={draft}
            updateDraft={updateDraft}
            showToast={showToast}
            onResetData={onResetData}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hf-admin-sidebar {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            bottom: 0 !important;
            height: 100dvh !important;
            z-index: 100000 !important;
            transform: ${sidebarOpen ? "translateX(0)" : "translateX(-100%)"} !important;
            width: 280px !important;
            max-width: 85vw !important;
            box-shadow: 10px 0 40px rgba(0,0,0,0.8) !important;
          }
          .hf-admin-menu-btn { display: inline-flex !important; }
          .hf-admin-close-x { display: inline-flex !important; }
          .hf-admin-overlay { display: block !important; }
        }
        @media (min-width: 769px) {
          .hf-admin-sidebar {
            transform: none !important;
            z-index: 10 !important;
          }
          .hf-admin-menu-btn { display: none !important; }
          .hf-admin-close-x { display: none !important; }
          .hf-admin-overlay { display: none !important; }
        }
        .hf-admin-sidebar { transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1) !important; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes applePillIn {
          from { opacity: 0; transform: translateY(-14px) scale(0.92); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .hf-admin-nav-item { min-height: 44px; }
        .hf-admin-nav-item:hover { background: rgba(255,255,255,0.04) !important; }
      `}</style>
    </div>
  );
};

// ─── NAV BUTTON ───────────────────────────────────────────────────────────────
function NavBtn({ item, active, onClick, dev }: { item: NavItem; active: boolean; onClick: () => void; dev?: boolean }) {
  return (
    <button onClick={onClick} className="hf-admin-nav-item" style={{
      display: "flex", alignItems: "center", gap: 10, width: "100%",
      background: active ? `${dev ? "#FF3E3E" : ACCENT}12` : "none",
      border: "none", padding: "10px 16px", cursor: "pointer",
      borderLeft: active ? `3px solid ${dev ? "#FF3E3E" : ACCENT}` : "3px solid transparent",
      color: active ? (dev ? "#FF3E3E" : ACCENT) : MUTED,
      ...SF, fontSize: 13, fontWeight: active ? 600 : 400, textAlign: "left",
      transition: "all 0.15s",
    }}>
      {item.icon}
      {item.label}
    </button>
  );
}

// ─── PAGE ROUTER ──────────────────────────────────────────────────────────────
interface PageProps {
  page: PageId;
  draft: AdminSiteData;
  updateDraft: <K extends keyof AdminSiteData>(key: K, value: AdminSiteData[K]) => void;
  showToast: (msg: string, type?: ToastType) => void;
  onResetData: () => void;
}

function PageRouter({ page, draft, updateDraft, showToast, onResetData }: PageProps) {
  switch (page) {
    case "dashboard":  return <DashboardPage draft={draft} showToast={showToast} />;
    case "homepage":   return <HomepagePage draft={draft} updateDraft={updateDraft} />;
    case "pricing":    return <PricingPage draft={draft} updateDraft={updateDraft} showToast={showToast} />;
    case "coaches":    return <CoachesPage draft={draft} updateDraft={updateDraft} showToast={showToast} />;
    case "media":      return <MediaPage draft={draft} updateDraft={updateDraft} showToast={showToast} />;
    case "offers":     return <OffersPage draft={draft} updateDraft={updateDraft} />;
    case "blog":       return <BlogPage draft={draft} updateDraft={updateDraft} showToast={showToast} />;
    case "contact":    return <ContactPage draft={draft} updateDraft={updateDraft} />;
    case "admins":     return <AdminsPage draft={draft} updateDraft={updateDraft} showToast={showToast} />;
    case "enquiries":  return <EnquiriesPage draft={draft} showToast={showToast} />;
    case "developer":  return <DeveloperPage draft={draft} updateDraft={updateDraft} showToast={showToast} onResetData={onResetData} />;
    default:           return <DashboardPage draft={draft} showToast={showToast} />;
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE: DASHBOARD
// ═════════════════════════════════════════════════════════════════════════════
function DashboardPage({ draft, showToast }: { draft: AdminSiteData; showToast: (m: string, t?: ToastType) => void }) {
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "success" | "error">("idle");
  const [lastSync, setLastSync] = useState<string | null>(null);

  const handlePush = async () => {
    setSyncing(true);
    setSyncStatus("idle");
    try {
      const ok = await pushToCloud(draft);
      setSyncStatus(ok ? "success" : "error");
      if (ok) {
        setLastSync(new Date().toLocaleTimeString());
        showToast("Pushed to cloud successfully!", "success");
      } else showToast("Cloud push failed. Check Developer settings.", "error");
    } catch { setSyncStatus("error"); showToast("Network error during push.", "error"); }
    setSyncing(false);
  };

  const handlePull = async () => {
    setSyncing(true);
    try {
      const data = await fetchCloudSiteData(draft.cloudDbEndpointUrl);
      if (data) {
        showToast("Pulled latest data from cloud!", "success");
        setLastSync(new Date().toLocaleTimeString());
      } else showToast("No cloud data found.", "info");
    } catch { showToast("Pull failed.", "error"); }
    setSyncing(false);
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <SectionHead title="DASHBOARD" subtitle="Overview of your gym website and quick actions." />

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 28 }}>
        <StatCard icon={<Users size={18} color={ACCENT} />} label="COACHES" value={draft.coaches?.length || 0} />
        <StatCard icon={<DollarSign size={18} color="#3EFFD8" />} label="PRICING PLANS" value={draft.plans?.length || 0} color="#3EFFD8" />
        <StatCard icon={<MessageSquare size={18} color="#A83EFF" />} label="ENQUIRIES" value={draft.enquiries?.length || 0} color="#A83EFF" />
        <StatCard icon={<BookOpen size={18} color="#3E82FF" />} label="BLOG POSTS" value={draft.blogs?.length || 0} color="#3E82FF" />
      </div>

      {/* Cloud sync card */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14, marginBottom: 16 }}>
          <div>
            <div style={{ ...DF, fontSize: 16, letterSpacing: "0.06em" }}>☁️ CLOUD DATABASE SYNC</div>
            <div style={{ ...SF, fontSize: 12, color: MUTED, marginTop: 4 }}>
              {syncStatus === "success" ? `✅ Last synced: ${lastSync}` : syncStatus === "error" ? "❌ Last sync failed" : "Firebase Firestore + JSONBlob backup"}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Btn onClick={handlePull} variant="secondary" small disabled={syncing}>
              <RefreshCw size={13} /> Pull Latest
            </Btn>
            <Btn onClick={handlePush} small disabled={syncing}>
              <UploadCloud size={13} /> {syncing ? "Syncing…" : "Push to Cloud"}
            </Btn>
          </div>
        </div>
        <div style={{ background: `${ACCENT}08`, border: `1px solid ${ACCENT}20`, borderRadius: 8, padding: "10px 14px", display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }} />
          <span style={{ ...MF, fontSize: 10, color: ACCENT, letterSpacing: "0.12em" }}>FIREBASE FIRESTORE ACTIVE</span>
          <span style={{ ...SF, fontSize: 11, color: MUTED, marginLeft: 8 }}>JSONBlob fallback enabled</span>
        </div>
      </Card>

      {/* Hero preview */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ ...MF, fontSize: 10, color: ACCENT, letterSpacing: "0.18em", marginBottom: 12 }}>CURRENT HEADLINE</div>
        <div style={{ ...DF, fontSize: 28, letterSpacing: "0.04em" }}>{draft?.tagline?.headlineMain || defaultSiteData.tagline.headlineMain}</div>
        <div style={{ ...DF, fontSize: 28, color: ACCENT }}>{draft?.tagline?.headlineHighlight || defaultSiteData.tagline.headlineHighlight}</div>
        <div style={{ ...SF, fontSize: 13, color: MUTED, marginTop: 8 }}>{draft?.tagline?.subtitle || defaultSiteData.tagline.subtitle}</div>
      </Card>

      {/* Offer status */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ ...MF, fontSize: 10, color: (draft?.offer?.enabled ?? true) ? ACCENT : MUTED, letterSpacing: "0.18em" }}>
              {(draft?.offer?.enabled ?? true) ? "🔥 OFFER ACTIVE" : "OFFER INACTIVE"}
            </div>
            <div style={{ ...SF, fontSize: 13, color: TEXT, marginTop: 4 }}>{draft?.offer?.announcementText || defaultSiteData.offer.announcementText}</div>
          </div>
          <div style={{ ...DF, fontSize: 22, color: ACCENT }}>{(draft?.offer?.discountPercentage ?? 25) > 0 ? `${draft?.offer?.discountPercentage ?? 25}% OFF` : "No discount"}</div>
        </div>
      </Card>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE: HOMEPAGE
// ═════════════════════════════════════════════════════════════════════════════
function HomepagePage({ draft, updateDraft }: { draft: AdminSiteData; updateDraft: any }) {
  const t = { ...defaultSiteData.tagline, ...(draft?.tagline || {}) };
  const setT = (k: string, v: any) => updateDraft("tagline", { ...t, [k]: v });

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <SectionHead title="HOMEPAGE CONTENT" subtitle="Edit the hero section, headline, and key metrics." />

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <Card>
          <div style={{ ...MF, fontSize: 10, color: ACCENT, letterSpacing: "0.18em", marginBottom: 16 }}>HERO HEADLINE</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="MAIN HEADLINE LINE 1">
              <Input value={t.headlineMain} onChange={v => setT("headlineMain", v)} placeholder="BUILD STRENGTH," />
            </Field>
            <Field label="HEADLINE HIGHLIGHT (ACCENT COLOR)">
              <Input value={t.headlineHighlight} onChange={v => setT("headlineHighlight", v)} placeholder="CONQUER LIFE." />
            </Field>
            <Field label="SUBTITLE / TAGLINE">
              <Input value={t.subtitle} onChange={v => setT("subtitle", v)} placeholder="Tagline text..." multiline rows={3} />
            </Field>
          </div>
        </Card>

        <Card>
          <div style={{ ...MF, fontSize: 10, color: ACCENT, letterSpacing: "0.18em", marginBottom: 16 }}>HERO VIDEO</div>
          <MediaUploader
            label="HERO VIDEO FILE"
            type="video"
            value={t.heroVideoUrl || ""}
            onChange={v => setT("heroVideoUrl", v)}
            hint="Drag & drop hero video file or click to select from device"
          />
        </Card>

        <Card>
          <div style={{ ...MF, fontSize: 10, color: ACCENT, letterSpacing: "0.18em", marginBottom: 16 }}>HERO STATS (3 shown at bottom of hero)</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(t.heroMetrics || defaultSiteData.tagline.heroMetrics!).map((m, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label={`METRIC ${i+1} VALUE`}>
                  <Input value={m.value} onChange={v => {
                    const ms = [...(t.heroMetrics || defaultSiteData.tagline.heroMetrics!)];
                    ms[i] = { ...ms[i], value: v };
                    updateDraft("tagline", { ...t, heroMetrics: ms });
                  }} placeholder="250+" />
                </Field>
                <Field label="LABEL">
                  <Input value={m.label} onChange={v => {
                    const ms = [...(t.heroMetrics || defaultSiteData.tagline.heroMetrics!)];
                    ms[i] = { ...ms[i], label: v };
                    updateDraft("tagline", { ...t, heroMetrics: ms });
                  }} placeholder="MEMBERS" />
                </Field>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE: PRICING
// ═════════════════════════════════════════════════════════════════════════════
function PricingPage({ draft, updateDraft, showToast }: { draft: AdminSiteData; updateDraft: any; showToast: any }) {
  const [editing, setEditing] = useState<number | null>(null);
  const [newPlan, setNewPlan] = useState(false);
  const plans = draft.plans;

  const emptyPlan = (): PricingPlan => ({
    id: `plan-${Date.now()}`, name: "", price: 0, period: "PER MONTH",
    badge: null, offerTag: "⚡ GET 25% OFF VIA WEBSITE", popular: false, features: [""],
  });

  const [form, setForm] = useState<PricingPlan>(emptyPlan());

  const savePlan = () => {
    if (!form.name.trim()) { showToast("Plan name is required.", "error"); return; }
    const updated = editing !== null
      ? plans.map((p, i) => i === editing ? form : p)
      : [...plans, form];
    updateDraft("plans", updated);
    showToast(editing !== null ? "Plan updated!" : "Plan added!", "success");
    setEditing(null); setNewPlan(false); setForm(emptyPlan());
  };

  const deletePlan = (i: number) => {
    updateDraft("plans", plans.filter((_, idx) => idx !== i));
    showToast("Plan deleted.", "info");
  };

  const startEdit = (i: number) => { setForm({ ...plans[i] }); setEditing(i); setNewPlan(true); };

  if (newPlan) return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button onClick={() => { setNewPlan(false); setEditing(null); setForm(emptyPlan()); }} style={{ background: "none", border: "none", color: MUTED, cursor: "pointer" }}><ArrowLeft size={18} /></button>
        <SectionHead title={editing !== null ? "EDIT PLAN" : "NEW PLAN"} subtitle="" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 600 }}>
        <Card>
          <div style={{ ...MF, fontSize: 10, color: ACCENT, letterSpacing: "0.18em", marginBottom: 16 }}>PLAN INFO</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="PLAN NAME"><Input value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="ELITE MENTOR" /></Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="PRICE (₹)"><Input value={String(form.price)} onChange={v => setForm(f => ({ ...f, price: Number(v) || 0 }))} type="number" /></Field>
              <Field label="PERIOD"><Input value={form.period || ""} onChange={v => setForm(f => ({ ...f, period: v }))} placeholder="PER MONTH" /></Field>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="OFFER PRICE (₹)" hint="Leave 0 to auto-calculate 25% off">
                <Input value={String(form.offerPrice || "")} onChange={v => setForm(f => ({ ...f, offerPrice: Number(v) || undefined }))} type="number" />
              </Field>
              <Field label="BADGE TEXT"><Input value={form.badge || ""} onChange={v => setForm(f => ({ ...f, badge: v || null }))} placeholder="MOST POPULAR" /></Field>
            </div>
            <Field label="OFFER TAG"><Input value={form.offerTag || ""} onChange={v => setForm(f => ({ ...f, offerTag: v }))} placeholder="⚡ GET 25% OFF VIA WEBSITE" /></Field>
            <Toggle checked={form.popular} onChange={v => setForm(f => ({ ...f, popular: v }))} label="Mark as Most Popular plan" />
          </div>
        </Card>

        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ ...MF, fontSize: 10, color: ACCENT, letterSpacing: "0.18em" }}>FEATURES LIST</div>
            <Btn small variant="secondary" onClick={() => setForm(f => ({ ...f, features: [...f.features, ""] }))}>
              <Plus size={12} /> Add Feature
            </Btn>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {form.features.map((feat, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Input value={feat} onChange={v => { const fs = [...form.features]; fs[i] = v; setForm(f => ({ ...f, features: fs })); }} placeholder={`Feature ${i+1}`} />
                <button onClick={() => setForm(f => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }))} style={{ background: "none", border: "none", color: "#FF3E3E", cursor: "pointer", padding: 4 }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ display: "flex", gap: 10 }}>
          <Btn onClick={savePlan}><Check size={14} /> {editing !== null ? "Update Plan" : "Add Plan"}</Btn>
          <Btn variant="secondary" onClick={() => { setNewPlan(false); setEditing(null); setForm(emptyPlan()); }}>Cancel</Btn>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <SectionHead title="PRICING & PLANS" subtitle={`${plans.length} plans configured`} />
        <Btn onClick={() => { setForm(emptyPlan()); setEditing(null); setNewPlan(true); }}><Plus size={14} /> Add Plan</Btn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {plans.map((plan, i) => (
          <div key={plan.id} style={{ background: SURFACE, border: `1px solid ${plan.popular ? ACCENT + "40" : BORDER}`, borderRadius: 12, padding: "18px 20px", position: "relative" }}>
            {plan.popular && <div style={{ ...MF, fontSize: 8, color: "#080808", background: ACCENT, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.12em", position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap" }}>★ POPULAR</div>}
            <div style={{ ...MF, fontSize: 10, color: plan.popular ? ACCENT : MUTED, letterSpacing: "0.15em", marginBottom: 8 }}>{plan.name}</div>
            <div style={{ ...DF, fontSize: 28, color: plan.popular ? ACCENT : TEXT }}>₹{plan.price.toLocaleString()}</div>
            <div style={{ ...SF, fontSize: 12, color: MUTED, marginBottom: 12 }}>{plan.period}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 16 }}>
              {plan.features.slice(0, 4).map((f, fi) => (
                <div key={fi} style={{ ...SF, fontSize: 12, color: MUTED, display: "flex", gap: 6, alignItems: "flex-start" }}>
                  <span style={{ color: ACCENT, fontSize: 10 }}>✓</span> {f}
                </div>
              ))}
              {plan.features.length > 4 && <div style={{ ...SF, fontSize: 11, color: MUTED }}>+{plan.features.length - 4} more...</div>}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn small variant="secondary" onClick={() => startEdit(i)}><Edit3 size={12} /> Edit</Btn>
              <Btn small danger onClick={() => deletePlan(i)}><Trash2 size={12} /> Delete</Btn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE: COACHES
// ═════════════════════════════════════════════════════════════════════════════
function CoachesPage({ draft, updateDraft, showToast }: { draft: AdminSiteData; updateDraft: any; showToast: any }) {
  const [editing, setEditing] = useState<number | null>(null);
  const coaches = draft.coaches || [];

  const emptyCoach = (): CoachItem => ({
    id: `coach-${Date.now()}`, name: "", role: "", bio: "", specialties: [], image: "",
    instagram: "", stats: [], tag: "",
  });

  const [form, setForm] = useState<CoachItem>(emptyCoach());
  const [showForm, setShowForm] = useState(false);

  const saveCoach = () => {
    if (!form.name.trim()) { showToast("Coach name is required.", "error"); return; }
    const updated = editing !== null
      ? coaches.map((c, i) => i === editing ? form : c)
      : [...coaches, form];
    updateDraft("coaches", updated);
    showToast(editing !== null ? "Coach updated!" : "Coach added!", "success");
    setEditing(null); setShowForm(false); setForm(emptyCoach());
  };

  const deleteCoach = (i: number) => {
    updateDraft("coaches", coaches.filter((_, idx) => idx !== i));
    showToast("Coach removed.", "info");
  };

  if (showForm) return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button onClick={() => { setShowForm(false); setEditing(null); }} style={{ background: "none", border: "none", color: MUTED, cursor: "pointer" }}><ArrowLeft size={18} /></button>
        <SectionHead title={editing !== null ? "EDIT COACH" : "ADD COACH"} subtitle="" />
      </div>
      <div style={{ maxWidth: 600, display: "flex", flexDirection: "column", gap: 16 }}>
        <Card>
          <div style={{ ...MF, fontSize: 10, color: ACCENT, letterSpacing: "0.18em", marginBottom: 16 }}>PROFILE</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="FULL NAME"><Input value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} /></Field>
              <Field label="ROLE / TITLE"><Input value={form.role} onChange={v => setForm(f => ({ ...f, role: v }))} placeholder="HEAD COACH" /></Field>
            </div>
            <Field label="BIO"><Input value={form.bio} onChange={v => setForm(f => ({ ...f, bio: v }))} multiline rows={3} /></Field>
            <MediaUploader
              label="COACH PROFILE PHOTO"
              type="image"
              value={form.image}
              onChange={v => setForm(f => ({ ...f, image: v }))}
              hint="Drag & drop profile photo or click to choose image from device"
            />
            <Field label="INSTAGRAM HANDLE"><Input value={form.instagram || ""} onChange={v => setForm(f => ({ ...f, instagram: v }))} placeholder="@handle" /></Field>
            <Field label="TAG (BADGE)"><Input value={form.tag || ""} onChange={v => setForm(f => ({ ...f, tag: v }))} placeholder="BODYBUILDING CHAMPION" /></Field>
          </div>
        </Card>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ ...MF, fontSize: 10, color: ACCENT, letterSpacing: "0.18em" }}>SPECIALTIES</div>
            <Btn small variant="secondary" onClick={() => setForm(f => ({ ...f, specialties: [...(f.specialties || []), ""] }))}>+ Add</Btn>
          </div>
          {(form.specialties || []).map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <Input value={s} onChange={v => { const ss = [...(form.specialties || [])]; ss[i] = v; setForm(f => ({ ...f, specialties: ss })); }} placeholder="e.g. Powerlifting" />
              <button onClick={() => setForm(f => ({ ...f, specialties: (f.specialties || []).filter((_, idx) => idx !== i) }))} style={{ background: "none", border: "none", color: "#FF3E3E", cursor: "pointer" }}><Trash2 size={14} /></button>
            </div>
          ))}
        </Card>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn onClick={saveCoach}><Check size={14} /> {editing !== null ? "Update Coach" : "Add Coach"}</Btn>
          <Btn variant="secondary" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</Btn>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <SectionHead title="COACHES" subtitle={`${coaches.length} coaches on roster`} />
        <Btn onClick={() => { setForm(emptyCoach()); setEditing(null); setShowForm(true); }}><Plus size={14} /> Add Coach</Btn>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {coaches.map((coach, i) => (
          <div key={coach.id} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            {coach.image && <img src={coach.image} alt={coach.name} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: `2px solid ${BORDER}` }} />}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...DF, fontSize: 16, letterSpacing: "0.06em" }}>{coach.name}</div>
              <div style={{ ...MF, fontSize: 9, color: ACCENT, letterSpacing: "0.15em", marginTop: 2 }}>{coach.role}</div>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <Btn small variant="secondary" onClick={() => { setForm({ ...coach }); setEditing(i); setShowForm(true); }}><Edit3 size={12} /> Edit</Btn>
              <Btn small danger onClick={() => deleteCoach(i)}><Trash2 size={12} /></Btn>
            </div>
          </div>
        ))}
        {coaches.length === 0 && <Card><div style={{ ...SF, fontSize: 14, color: MUTED, textAlign: "center", padding: "20px 0" }}>No coaches added yet.</div></Card>}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE: MEDIA
// ═════════════════════════════════════════════════════════════════════════════
function MediaPage({ draft, updateDraft, showToast }: { draft: AdminSiteData; updateDraft: any; showToast: any }) {
  const founder = { ...defaultSiteData.founder, ...(draft?.founder || {}) };

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <SectionHead title="MEDIA & GALLERY" subtitle="Manage founder story media and before/after images." />
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <Card>
          <div style={{ ...MF, fontSize: 10, color: ACCENT, letterSpacing: "0.18em", marginBottom: 16 }}>FOUNDER STORY MEDIA</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {["image", "video"].map(t => (
                <button key={t} onClick={() => updateDraft("founder", { ...founder, mediaType: t as "image" | "video" })}
                  style={{ padding: "8px 18px", borderRadius: 8, border: `1px solid ${founder.mediaType === t ? ACCENT : BORDER}`, background: founder.mediaType === t ? `${ACCENT}15` : SURFACE2, color: founder.mediaType === t ? ACCENT : MUTED, ...SF, fontSize: 13, cursor: "pointer" }}>
                  {t === "image" ? "📷 Image" : "🎬 Video"}
                </button>
              ))}
            </div>
            {founder.mediaType === "video"
              ? <MediaUploader label="FOUNDER VIDEO FILE" type="video" value={founder.videoUrl || ""} onChange={v => updateDraft("founder", { ...founder, videoUrl: v })} hint="Drag & drop video or click to select file" />
              : <MediaUploader label="FOUNDER IMAGE FILE" type="image" value={founder.image || ""} onChange={v => updateDraft("founder", { ...founder, image: v })} hint="Drag & drop photo or click to select file" />
            }
          </div>
        </Card>

        <Card>
          <div style={{ ...MF, fontSize: 10, color: ACCENT, letterSpacing: "0.18em", marginBottom: 16 }}>BEFORE / AFTER TRANSFORMATION</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <MediaUploader
              label="BEFORE IMAGE"
              type="image"
              value={founder.beforeImage || ""}
              onChange={v => updateDraft("founder", { ...founder, beforeImage: v })}
              hint="Drag & drop before photo"
            />
            <MediaUploader
              label="AFTER IMAGE"
              type="image"
              value={founder.afterImage || ""}
              onChange={v => updateDraft("founder", { ...founder, afterImage: v })}
              hint="Drag & drop after photo"
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
            {[{ url: founder.beforeImage, label: "BEFORE" }, { url: founder.afterImage, label: "AFTER" }].map(({ url, label }) => (
              url ? (
                <div key={label} style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${BORDER}`, position: "relative" }}>
                  <img src={url} alt={label} style={{ width: "100%", height: 180, objectFit: "cover", objectPosition: "top", display: "block" }} />
                  <div style={{ position: "absolute", top: 8, left: 8, ...MF, fontSize: 8, background: label === "AFTER" ? ACCENT : "rgba(8,8,8,0.85)", color: label === "AFTER" ? "#080808" : "#fff", padding: "3px 9px", borderRadius: 4, letterSpacing: "0.15em" }}>{label}</div>
                </div>
              ) : <div key={label} style={{ height: 180, borderRadius: 8, border: `1px dashed ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", color: MUTED, ...SF, fontSize: 12 }}>No {label} image</div>
            ))}
          </div>
        </Card>

        <Card>
          <div style={{ ...MF, fontSize: 10, color: ACCENT, letterSpacing: "0.18em", marginBottom: 16 }}>FOUNDER QUOTE</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Field label="QUOTE TEXT">
              <Input value={founder.quote || ""} onChange={v => updateDraft("founder", { ...founder, quote: v })} multiline rows={3} />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="QUOTE AUTHOR"><Input value={founder.quoteAuthor || ""} onChange={v => updateDraft("founder", { ...founder, quoteAuthor: v })} /></Field>
              <Field label="AUTHOR SUBTEXT"><Input value={founder.quoteSubtext || ""} onChange={v => updateDraft("founder", { ...founder, quoteSubtext: v })} /></Field>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE: OFFERS
// ═════════════════════════════════════════════════════════════════════════════
function OffersPage({ draft, updateDraft }: { draft: AdminSiteData; updateDraft: any }) {
  const offer = { ...defaultSiteData.offer, ...(draft?.offer || {}) };
  const setO = (k: string, v: any) => updateDraft("offer", { ...offer, [k]: v });

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <SectionHead title="OFFERS & DEALS" subtitle="Control the announcement banner shown to visitors." />
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <Card>
          <Toggle checked={offer.enabled} onChange={v => setO("enabled", v)} label="Show offer banner to visitors" />
        </Card>

        {offer.enabled && (
          <>
            <Card>
              <div style={{ ...MF, fontSize: 10, color: ACCENT, letterSpacing: "0.18em", marginBottom: 16 }}>BANNER CONTENT</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Field label="BADGE TEXT (e.g. SPECIAL OFFER)">
                  <Input value={offer.badgeText || ""} onChange={v => setO("badgeText", v)} />
                </Field>
                <Field label="ANNOUNCEMENT TEXT">
                  <Input value={offer.announcementText} onChange={v => setO("announcementText", v)} multiline rows={2} />
                </Field>
                <Field label="DISCOUNT PERCENTAGE (0 = no %)">
                  <Input value={String(offer.discountPercentage)} onChange={v => setO("discountPercentage", Number(v) || 0)} type="number" />
                </Field>
              </div>
            </Card>

            <Card style={{ border: `1px solid ${ACCENT}30` }}>
              <div style={{ ...MF, fontSize: 10, color: MUTED, letterSpacing: "0.12em", marginBottom: 12 }}>PREVIEW</div>
              <div style={{ background: "linear-gradient(135deg, rgba(216,255,62,0.12), rgba(13,13,16,0.95))", border: `2px solid ${ACCENT}`, borderRadius: 10, padding: "16px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ ...MF, fontSize: 9, background: ACCENT, color: "#080808", padding: "3px 8px", borderRadius: 4, letterSpacing: "0.1em", fontWeight: 800 }}>🔥 {offer.badgeText}</span>
                  {offer.discountPercentage > 0 && <span style={{ ...MF, fontSize: 10, color: ACCENT, fontWeight: 700 }}>{offer.discountPercentage}% OFF</span>}
                </div>
                <div style={{ ...SF, fontSize: 14, color: TEXT, fontWeight: 600 }}>{offer.announcementText}</div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE: BLOG
// ═════════════════════════════════════════════════════════════════════════════
function BlogPage({ draft, updateDraft, showToast }: { draft: AdminSiteData; updateDraft: any; showToast: any }) {
  const [editing, setEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const blogs = draft.blogs || [];

  const emptyBlog = (): BlogPost => ({ id: `blog-${Date.now()}`, title: "", subtitle: "", category: "", author: "", date: "", content: "" });
  const [form, setForm] = useState<BlogPost>(emptyBlog());

  const saveBlog = () => {
    if (!form.title.trim()) { showToast("Title is required.", "error"); return; }
    const updated = editing !== null ? blogs.map((b, i) => i === editing ? form : b) : [...blogs, form];
    updateDraft("blogs", updated);
    showToast("Blog saved!", "success");
    setEditing(null); setShowForm(false); setForm(emptyBlog());
  };

  if (showForm) return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button onClick={() => { setShowForm(false); setEditing(null); }} style={{ background: "none", border: "none", color: MUTED, cursor: "pointer" }}><ArrowLeft size={18} /></button>
        <SectionHead title={editing !== null ? "EDIT ARTICLE" : "NEW ARTICLE"} subtitle="" />
      </div>
      <div style={{ maxWidth: 680, display: "flex", flexDirection: "column", gap: 16 }}>
        <Card>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Field label="ARTICLE TITLE"><Input value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} /></Field>
            <Field label="SUBTITLE / DESCRIPTION"><Input value={form.subtitle || ""} onChange={v => setForm(f => ({ ...f, subtitle: v }))} /></Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="CATEGORY"><Input value={form.category || ""} onChange={v => setForm(f => ({ ...f, category: v }))} placeholder="NUTRITION" /></Field>
              <Field label="AUTHOR"><Input value={form.author || ""} onChange={v => setForm(f => ({ ...f, author: v }))} /></Field>
            </div>
            <Field label="DATE"><Input value={form.date || ""} onChange={v => setForm(f => ({ ...f, date: v }))} placeholder="January 2025" /></Field>
            <Field label="FULL CONTENT (Markdown or plain text)">
              <Input value={form.content} onChange={v => setForm(f => ({ ...f, content: v }))} multiline rows={10} />
            </Field>
          </div>
        </Card>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn onClick={saveBlog}><Check size={14} /> {editing !== null ? "Update" : "Publish"}</Btn>
          <Btn variant="secondary" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</Btn>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <SectionHead title="ARTICLES & BLOG" subtitle={`${blogs.length} articles published`} />
        <Btn onClick={() => { setForm(emptyBlog()); setEditing(null); setShowForm(true); }}><Plus size={14} /> New Article</Btn>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {blogs.map((b, i) => (
          <div key={b.id} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...SF, fontSize: 14, fontWeight: 600, color: TEXT }}>{b.title}</div>
              {b.category && <div style={{ ...MF, fontSize: 9, color: ACCENT, letterSpacing: "0.12em", marginTop: 3 }}>{b.category}</div>}
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <Btn small variant="secondary" onClick={() => { setForm({ ...b }); setEditing(i); setShowForm(true); }}><Edit3 size={12} /></Btn>
              <Btn small danger onClick={() => { updateDraft("blogs", blogs.filter((_, idx) => idx !== i)); showToast("Article deleted.", "info"); }}><Trash2 size={12} /></Btn>
            </div>
          </div>
        ))}
        {blogs.length === 0 && <Card><div style={{ ...SF, fontSize: 14, color: MUTED, textAlign: "center", padding: "20px 0" }}>No articles published yet.</div></Card>}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE: CONTACT
// ═════════════════════════════════════════════════════════════════════════════
function ContactPage({ draft, updateDraft }: { draft: AdminSiteData; updateDraft: any }) {
  const policies = draft.policies || defaultSiteData.policies;

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <SectionHead title="CONTACT INFO" subtitle="Business details shown on website." />
      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 680 }}>
        <Card>
          <div style={{ ...MF, fontSize: 10, color: ACCENT, letterSpacing: "0.18em", marginBottom: 16 }}>ADMIN USERS</div>
          {(draft.admins || []).map((admin, i) => (
            <div key={admin.id} style={{ background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "12px 14px", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={{ ...SF, fontSize: 13, color: TEXT }}>{admin.email}</div>
                <div style={{ ...MF, fontSize: 9, color: MUTED, letterSpacing: "0.12em", marginTop: 2 }}>{admin.role}</div>
              </div>
              {draft.admins.length > 1 && (
                <button onClick={() => updateDraft("admins", draft.admins.filter((_, idx) => idx !== i))} style={{ background: "none", border: "none", color: "#FF3E3E", cursor: "pointer" }}>
                  <UserX size={14} />
                </button>
              )}
            </div>
          ))}
        </Card>

        <Card>
          <div style={{ ...MF, fontSize: 10, color: ACCENT, letterSpacing: "0.18em", marginBottom: 16 }}>LEGAL POLICIES</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Field label="PRIVACY POLICY">
              <Input value={policies.privacyPolicy || ""} onChange={v => updateDraft("policies", { ...policies, privacyPolicy: v })} multiline rows={6} />
            </Field>
            <Field label="TERMS & CONDITIONS">
              <Input value={policies.termsAndConditions || ""} onChange={v => updateDraft("policies", { ...policies, termsAndConditions: v })} multiline rows={6} />
            </Field>
            <Field label="REFUND POLICY">
              <Input value={policies.refundPolicy || ""} onChange={v => updateDraft("policies", { ...policies, refundPolicy: v })} multiline rows={4} />
            </Field>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE: ENQUIRIES CRM
// ═════════════════════════════════════════════════════════════════════════════
function EnquiriesPage({ draft, showToast }: { draft: AdminSiteData; showToast: any }) {
  const enquiries: EnquiryLead[] = draft.enquiries || [];
  const [filter, setFilter] = useState("");

  const filtered = enquiries.filter(e =>
    !filter || e.name.toLowerCase().includes(filter.toLowerCase()) || e.phone.includes(filter)
  );

  const copyToCSV = () => {
    const csv = ["Name,Phone,Email,Goal,Coach,Plan,Date", ...enquiries.map(e =>
      `"${e.name}","${e.phone}","${e.email || ""}","${e.goal}","${e.preferredCoach || ""}","${e.planName || ""}","${e.submittedAt}"`
    )].join("\n");
    navigator.clipboard.writeText(csv);
    showToast("Copied as CSV!", "success");
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <SectionHead title="ENQUIRIES CRM" subtitle={`${enquiries.length} leads captured`} />
        <Btn small variant="secondary" onClick={copyToCSV}><Copy size={13} /> Export CSV</Btn>
      </div>

      {enquiries.length === 0 ? (
        <Card><div style={{ ...SF, fontSize: 14, color: MUTED, textAlign: "center", padding: "32px 0" }}>No enquiries yet. When visitors submit the consultation form, leads appear here.</div></Card>
      ) : (
        <>
          <div style={{ marginBottom: 14 }}>
            <Input value={filter} onChange={setFilter} placeholder="Search by name or phone..." />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((e, i) => (
              <div key={e.id || i} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "16px 20px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
                  <div>
                    <div style={{ ...DF, fontSize: 16, letterSpacing: "0.04em" }}>{e.name}</div>
                    <div style={{ ...SF, fontSize: 12, color: MUTED, marginTop: 3 }}>
                      📞 {e.phone} {e.email && `· ✉️ ${e.email}`}
                    </div>
                  </div>
                  <div style={{ ...MF, fontSize: 9, color: MUTED, letterSpacing: "0.1em" }}>
                    {new Date(e.submittedAt).toLocaleDateString("en-IN")}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {e.goal && <span style={{ ...MF, fontSize: 9, color: ACCENT, border: `1px solid ${ACCENT}30`, padding: "3px 8px", borderRadius: 20, letterSpacing: "0.1em" }}>{e.goal}</span>}
                  {e.planName && <span style={{ ...MF, fontSize: 9, color: "#3EFFD8", border: "1px solid rgba(62,255,216,0.3)", padding: "3px 8px", borderRadius: 20, letterSpacing: "0.1em" }}>{e.planName}</span>}
                  {e.preferredCoach && <span style={{ ...MF, fontSize: 9, color: MUTED, border: `1px solid ${BORDER}`, padding: "3px 8px", borderRadius: 20, letterSpacing: "0.1em" }}>Coach: {e.preferredCoach}</span>}
                </div>
                <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <a href={`https://wa.me/91${e.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.25)", color: "#25D366", padding: "6px 12px", borderRadius: 6, textDecoration: "none", ...SF, fontSize: 12, fontWeight: 600 }}>
                    <MessageSquare size={12} /> WhatsApp
                  </a>
                  <a href={`tel:${e.phone}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: SURFACE2, border: `1px solid ${BORDER}`, color: TEXT, padding: "6px 12px", borderRadius: 6, textDecoration: "none", ...SF, fontSize: 12 }}>
                    <Phone size={12} /> Call
                  </a>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE: DEVELOPER SETTINGS
// ═════════════════════════════════════════════════════════════════════════════
function DeveloperPage({ draft, updateDraft, showToast, onResetData }: { draft: AdminSiteData; updateDraft: any; showToast: any; onResetData: () => void }) {
  const [syncing, setSyncing] = useState(false);
  const [fbConfig, setFbConfig] = useState<FirebaseConfig>(loadFirebaseConfig());
  const [fbStatus, setFbStatus] = useState<"idle" | "success" | "error">("idle");
  const [confirmReset, setConfirmReset] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const handleSaveFbConfig = () => {
    saveFirebaseConfig(fbConfig);
    showToast("Firebase configuration saved!", "success");
  };

  const testFirebase = async () => {
    if (!fbConfig.projectId || !fbConfig.apiKey) {
      showToast("Please enter Firebase Project ID and API Key first.", "info");
      return;
    }
    setSyncing(true);
    setFbStatus("idle");
    try {
      saveFirebaseConfig(fbConfig);
      const ok = await pushToFirebase(draft, fbConfig);
      setFbStatus(ok ? "success" : "error");
      showToast(ok ? "Firebase Firestore push successful!" : "Firebase push failed. Check credentials or Firestore rules.", ok ? "success" : "error");
    } catch {
      setFbStatus("error");
      showToast("Firebase connection error.", "error");
    }
    setSyncing(false);
  };

  const handlePullFirebase = async () => {
    if (!fbConfig.projectId || !fbConfig.apiKey) {
      showToast("Please enter Firebase Project ID and API Key first.", "info");
      return;
    }
    setSyncing(true);
    try {
      saveFirebaseConfig(fbConfig);
      const data = await fetchFirebaseSiteData(fbConfig);
      if (data) showToast("Pulled data from Firebase Firestore!", "success");
      else showToast("No data in Firebase Firestore yet or access denied.", "info");
    } catch { showToast("Pull from Firebase failed.", "error"); }
    setSyncing(false);
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ border: "1px solid rgba(255,193,7,0.3)", borderRadius: 12, padding: "16px 20px", marginBottom: 24, display: "flex", gap: 12, alignItems: "center", background: "rgba(255,193,7,0.05)" }}>
        <AlertTriangle size={18} color="#FFC107" />
        <span style={{ ...SF, fontSize: 13, color: "#FFE082" }}>Developer zone — changes here update Firebase database credentials and live cloud sync.</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Firebase Firestore */}
        <Card style={{ border: "1px solid rgba(255,193,7,0.25)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <Database size={16} color="#FFC107" />
            <div style={{ ...DF, fontSize: 16, letterSpacing: "0.06em", color: "#FFC107" }}>FIREBASE FIRESTORE DATABASE</div>
            <div style={{ marginLeft: "auto", ...MF, fontSize: 9, padding: "3px 9px", borderRadius: 20, background: fbStatus === "success" ? "rgba(216,255,62,0.15)" : fbStatus === "error" ? "rgba(255,62,62,0.15)" : SURFACE2, color: fbStatus === "success" ? ACCENT : fbStatus === "error" ? "#FF3E3E" : MUTED, border: `1px solid ${fbStatus === "success" ? ACCENT + "40" : fbStatus === "error" ? "#FF3E3E40" : BORDER}`, letterSpacing: "0.1em" }}>
              {fbStatus === "success" ? "✅ CONNECTED" : fbStatus === "error" ? "❌ FAILED" : fbConfig.projectId ? "⬤ READY TO CONNECT" : "⚠️ NEED CONFIG"}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
            <Field label="FIREBASE PROJECT ID" hint="Your Google Firebase Project ID (e.g. hercules-fitness-app)">
              <Input value={fbConfig.projectId} onChange={v => setFbConfig(c => ({ ...c, projectId: v }))} placeholder="hercules-fitness-app" />
            </Field>

            <Field label="FIREBASE API KEY" hint="Web API Key from Firebase Project Settings">
              <div style={{ display: "flex", gap: 8 }}>
                <Input value={showKey ? fbConfig.apiKey : fbConfig.apiKey ? "••••••••••••••••••••••••" : ""} onChange={v => setFbConfig(c => ({ ...c, apiKey: v }))} type={showKey ? "text" : "password"} placeholder="AIzaSy..." />
                <button onClick={() => setShowKey(s => !s)} style={{ background: SURFACE2, border: `1px solid ${BORDER}`, color: MUTED, borderRadius: 8, padding: "0 12px", cursor: "pointer" }}>
                  {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="AUTH DOMAIN (OPTIONAL)">
                <Input value={fbConfig.authDomain} onChange={v => setFbConfig(c => ({ ...c, authDomain: v }))} placeholder="hercules-fitness.firebaseapp.com" />
              </Field>
              <Field label="STORAGE BUCKET (OPTIONAL)">
                <Input value={fbConfig.storageBucket} onChange={v => setFbConfig(c => ({ ...c, storageBucket: v }))} placeholder="hercules-fitness.appspot.com" />
              </Field>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="FIRESTORE COLLECTION">
                <Input value={fbConfig.firestoreCollection || "site_data"} onChange={v => setFbConfig(c => ({ ...c, firestoreCollection: v }))} placeholder="site_data" />
              </Field>
              <Field label="FIRESTORE DOCUMENT ID">
                <Input value={fbConfig.firestoreDocumentId || "global_config"} onChange={v => setFbConfig(c => ({ ...c, firestoreDocumentId: v }))} placeholder="global_config" />
              </Field>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
            <Btn small onClick={handleSaveFbConfig} variant="secondary"><Save size={12} /> Save Config</Btn>
            <Btn small onClick={testFirebase} disabled={syncing}><Send size={12} /> {syncing ? "Testing…" : "Push to Firebase"}</Btn>
            <Btn small variant="secondary" onClick={handlePullFirebase} disabled={syncing}><Download size={12} /> Pull from Firebase</Btn>
          </div>
        </Card>

        {/* JSONBlob backup */}
        <Card>
          <div style={{ ...MF, fontSize: 10, color: ACCENT, letterSpacing: "0.18em", marginBottom: 14 }}>☁️ JSONBLOB BACKUP DATABASE</div>
          <Field label="CLOUD DATABASE ENDPOINT URL" hint="This is the fallback if Firebase is unavailable.">
            <Input value={draft.cloudDbEndpointUrl || DEFAULT_CLOUD_DB_URL} onChange={v => updateDraft("cloudDbEndpointUrl", v)} />
          </Field>
          <div style={{ marginTop: 10 }}>
            <Btn small variant="secondary" onClick={async () => {
              setSyncing(true);
              const ok = await pushToCloud(draft, draft.cloudDbEndpointUrl);
              showToast(ok ? "Pushed to JSONBlob!" : "JSONBlob push failed.", ok ? "success" : "error");
              setSyncing(false);
            }} disabled={syncing}>
              <UploadCloud size={12} /> Push to JSONBlob
            </Btn>
          </div>
        </Card>

        {/* Google Sheets Webhook */}
        <Card>
          <div style={{ ...MF, fontSize: 10, color: ACCENT, letterSpacing: "0.18em", marginBottom: 14 }}>📊 GOOGLE SHEETS WEBHOOK</div>
          <Field label="WEBHOOK URL (from Google Apps Script)" hint="Enquiries are sent here when a lead is captured.">
            <Input value={draft.googleSheetWebhookUrl || ""} onChange={v => updateDraft("googleSheetWebhookUrl", v)} placeholder="https://script.google.com/macros/..." />
          </Field>
        </Card>

        {/* Reset */}
        <Card style={{ border: "1px solid rgba(255,62,62,0.25)" }}>
          <div style={{ ...MF, fontSize: 10, color: "#FF3E3E", letterSpacing: "0.18em", marginBottom: 14 }}>⚠️ DANGER ZONE</div>
          {!confirmReset ? (
            <Btn danger onClick={() => setConfirmReset(true)}><AlertTriangle size={13} /> Reset All Site Data to Defaults</Btn>
          ) : (
            <div>
              <div style={{ ...SF, fontSize: 13, color: "#FF7777", marginBottom: 14 }}>This will reset ALL content (plans, coaches, blogs, settings) to factory defaults. Are you absolutely sure?</div>
              <div style={{ display: "flex", gap: 10 }}>
                <Btn danger onClick={() => { onResetData(); showToast("Site data reset to defaults.", "info"); setConfirmReset(false); }}>
                  <Check size={13} /> Yes, Reset Everything
                </Btn>
                <Btn variant="secondary" onClick={() => setConfirmReset(false)}>Cancel</Btn>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE: ADMINS MANAGEMENT
// ═════════════════════════════════════════════════════════════════════════════
function AdminsPage({ draft, updateDraft, showToast }: { draft: AdminSiteData; updateDraft: any; showToast: any }) {
  const admins: AdminUser[] = draft.admins || [];
  const [showAdd, setShowAdd] = useState(false);
  const [showPwd, setShowPwd] = useState<Record<string, boolean>>({});
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("admin");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const addAdmin = () => {
    if (!newEmail.trim()) { showToast("Email is required.", "error"); return; }
    if (!newPassword.trim() || newPassword.length < 6) { showToast("Password must be at least 6 characters.", "error"); return; }
    if (admins.find(a => a.email.toLowerCase() === newEmail.toLowerCase())) {
      showToast("An admin with that email already exists.", "error"); return;
    }
    const newAdmin: AdminUser = {
      id: `admin-${Date.now()}`,
      email: newEmail.trim().toLowerCase(),
      password: newPassword,
      role: newRole,
      addedAt: new Date().toISOString(),
    };
    updateDraft("admins", [...admins, newAdmin]);
    showToast(`Admin ${newEmail} added!`, "success");
    setNewEmail(""); setNewPassword(""); setNewRole("admin"); setShowAdd(false);
  };

  const removeAdmin = (id: string) => {
    if (admins.length <= 1) { showToast("Cannot remove the last admin account.", "error"); return; }
    updateDraft("admins", admins.filter(a => a.id !== id));
    showToast("Admin removed.", "info");
    setConfirmDelete(null);
  };

  const roleColors: Record<string, string> = {
    "super-admin": "#A83EFF",
    "admin": ACCENT,
    "editor": "#3EFFD8",
    "viewer": MUTED,
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <SectionHead title="ADMINS" subtitle="Manage who can access the admin panel." />

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
        <StatCard icon={<Shield size={16} color={ACCENT} />} label="TOTAL ADMINS" value={admins.length} />
        <StatCard icon={<ShieldCheck size={16} color="#A83EFF" />} label="SUPER ADMINS" value={admins.filter(a => a.role === "super-admin").length} color="#A83EFF" />
        <StatCard icon={<Users size={16} color="#3EFFD8" />} label="EDITORS" value={admins.filter(a => a.role === "editor").length} color="#3EFFD8" />
      </div>

      {/* Add Admin button */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <Btn onClick={() => setShowAdd(s => !s)}>
          <UserPlus size={14} /> {showAdd ? "Cancel" : "Add New Admin"}
        </Btn>
      </div>

      {/* Add Admin form */}
      {showAdd && (
        <Card style={{ marginBottom: 20, border: `1px solid ${ACCENT}30` }}>
          <div style={{ ...MF, fontSize: 10, color: ACCENT, letterSpacing: "0.18em", marginBottom: 16 }}>NEW ADMIN DETAILS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="EMAIL ADDRESS">
                <Input value={newEmail} onChange={setNewEmail} placeholder="name@example.com" type="email" />
              </Field>
              <Field label="ROLE">
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value)}
                  style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: TEXT, padding: "11px 14px", borderRadius: 8, ...SF, fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box", cursor: "pointer" }}
                >
                  <option value="super-admin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </Field>
            </div>
            <Field label="PASSWORD" hint="Minimum 6 characters">
              <Input value={newPassword} onChange={setNewPassword} type="password" placeholder="Set a secure password" />
            </Field>

            <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
              <Btn onClick={addAdmin}><UserPlus size={13} /> Add Admin</Btn>
              <Btn variant="secondary" onClick={() => { setShowAdd(false); setNewEmail(""); setNewPassword(""); }}>Cancel</Btn>
            </div>
          </div>
        </Card>
      )}

      {/* Admins list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {admins.map((admin, i) => (
          <div key={admin.id} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "16px 20px", transition: "border-color 0.2s" }}>
            {confirmDelete === admin.id ? (
              /* Confirm delete state */
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ ...SF, fontSize: 13, color: "#FF7777" }}>
                  Remove <strong>{admin.email}</strong>? This cannot be undone.
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn small danger onClick={() => removeAdmin(admin.id)}><Check size={12} /> Yes, Remove</Btn>
                  <Btn small variant="secondary" onClick={() => setConfirmDelete(null)}>Cancel</Btn>
                </div>
              </div>
            ) : (
              /* Normal state */
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                {/* Avatar */}
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${roleColors[admin.role] || ACCENT}18`, border: `2px solid ${roleColors[admin.role] || ACCENT}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Shield size={16} color={roleColors[admin.role] || ACCENT} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...SF, fontSize: 14, fontWeight: 600, color: TEXT, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{admin.email}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                    <span style={{
                      ...MF, fontSize: 8.5, letterSpacing: "0.14em",
                      color: roleColors[admin.role] || ACCENT,
                      background: `${roleColors[admin.role] || ACCENT}15`,
                      border: `1px solid ${roleColors[admin.role] || ACCENT}35`,
                      padding: "2px 8px", borderRadius: 20,
                    }}>{admin.role.toUpperCase()}</span>
                    {admin.addedAt && (
                      <span style={{ ...SF, fontSize: 11, color: MUTED }}>
                        Added {new Date(admin.addedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    )}
                  </div>
                </div>

                {/* Password reveal */}
                <button
                  onClick={() => setShowPwd(s => ({ ...s, [admin.id]: !s[admin.id] }))}
                  title={showPwd[admin.id] ? "Hide password" : "Show password"}
                  style={{ background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "7px 12px", color: MUTED, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, ...SF, fontSize: 12 }}
                >
                  {showPwd[admin.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                  {showPwd[admin.id] ? <span style={{ ...MF, fontSize: 11, color: TEXT, letterSpacing: "0.08em" }}>{admin.password}</span> : <span>Password</span>}
                </button>

                {/* Remove button — disabled for last admin */}
                <button
                  onClick={() => setConfirmDelete(admin.id)}
                  disabled={admins.length <= 1}
                  title={admins.length <= 1 ? "Cannot remove the last admin" : "Remove admin"}
                  style={{ background: admins.length <= 1 ? "transparent" : "rgba(255,62,62,0.08)", border: `1px solid ${admins.length <= 1 ? BORDER : "rgba(255,62,62,0.25)"}`, borderRadius: 8, padding: "7px 10px", color: admins.length <= 1 ? MUTED : "#FF3E3E", cursor: admins.length <= 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", opacity: admins.length <= 1 ? 0.4 : 1 }}
                >
                  <UserX size={14} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Help note */}
      <div style={{ marginTop: 20, background: `${ACCENT}08`, border: `1px solid ${ACCENT}20`, borderRadius: 10, padding: "14px 16px", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <ShieldCheck size={16} color={ACCENT} style={{ flexShrink: 0, marginTop: 1 }} />
        <div style={{ ...SF, fontSize: 12, color: MUTED, lineHeight: 1.7 }}>
          <strong style={{ color: TEXT }}>Role permissions:</strong> Super Admin has full access including Developer settings.
          Admin can edit all content. Editor can change text and media. Viewer can only view data.
          <br />Changes are saved when you click <strong style={{ color: ACCENT }}>Save Changes</strong> at the top.
        </div>
      </div>
    </div>
  );
}
