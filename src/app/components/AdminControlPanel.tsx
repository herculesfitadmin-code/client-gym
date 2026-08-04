import React, { useState, useRef, useEffect } from "react";
import {
  AdminSiteData,
  SiteTagline,
  SiteOffer,
  PricingPlan,
  AdminUser,
  FounderData,
  BlogPost,
  LegalPolicies,
  EnquiryLead,
  defaultSiteData,
} from "../adminStore";
import { CoachItem } from "./CoachesStackedCards";
import { HerculesLogo } from "./HerculesLogo";
import {
  Save,
  LogOut,
  Type,
  Tag,
  DollarSign,
  Users,
  Plus,
  Trash2,
  Edit3,
  Check,
  Eye,
  EyeOff,
  ShieldCheck,
  UserPlus,
  UserX,
  KeyRound,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info,
  Sliders,
  UploadCloud,
  Upload,
  Award,
  Image,
  AlertTriangle,
  BookOpen,
  Scale,
  FileText,
  FileSpreadsheet,
  Copy,
  Download,
  Send,
  Database,
} from "lucide-react";

interface AdminControlPanelProps {
  isOpen: boolean;
  onClose: () => void;
  siteData: AdminSiteData;
  onSaveData: (data: AdminSiteData) => void;
  onResetData: () => void;
  onLogout: () => void;
  currentUserEmail?: string;
}

const ACCENT = "#D8FF3E";

export const AdminControlPanel: React.FC<AdminControlPanelProps> = ({
  isOpen,
  onClose,
  siteData,
  onSaveData,
  onResetData,
  onLogout,
  currentUserEmail = "abcd@gmail.com",
}) => {
  // Local draft state for editing before saving
  const [taglineDraft, setTaglineDraft] = useState<SiteTagline>(siteData.tagline);
  const [offerDraft, setOfferDraft] = useState<SiteOffer>(siteData.offer);
  const [plansDraft, setPlansDraft] = useState<PricingPlan[]>(siteData.plans);
  const [coachesDraft, setCoachesDraft] = useState<CoachItem[]>(siteData.coaches);
  const [adminsDraft, setAdminsDraft] = useState<AdminUser[]>(siteData.admins || []);
  const [founderDraft, setFounderDraft] = useState<FounderData>(siteData.founder || defaultSiteData.founder);
  const [blogsDraft, setBlogsDraft] = useState<BlogPost[]>(siteData.blogs || defaultSiteData.blogs);
  const [policiesDraft, setPoliciesDraft] = useState<LegalPolicies>(
    siteData.policies || defaultSiteData.policies
  );
  const [activePolicyTab, setActivePolicyTab] = useState<"privacy" | "terms" | "refunds">("privacy");
  const [webhookUrlDraft, setWebhookUrlDraft] = useState(siteData.googleSheetWebhookUrl || "");
  const [enquiriesDraft, setEnquiriesDraft] = useState<EnquiryLead[]>(siteData.enquiries || []);
  const [copyCodeToast, setCopyCodeToast] = useState(false);
  const [testWebhookStatus, setTestWebhookStatus] = useState<string | null>(null);

  // Section navigation state
  const [activeSection, setActiveSection] = useState<
    "all" | "enquiries" | "tagline" | "founder" | "offers" | "prices" | "coaches" | "blogs" | "policies" | "admins"
  >("all");

  // Blog article form state
  const [isAddingBlog, setIsAddingBlog] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [blogForm, setBlogForm] = useState<BlogPost>({
    id: "",
    title: "",
    subtitle: "",
    category: "GUIDE",
    author: "Coach Girish",
    date: "August 2024",
    content: "",
  });

  // Coach modal/inline form state
  const [isAddingCoach, setIsAddingCoach] = useState(false);
  const [editingCoachId, setEditingCoachId] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState(false);

  // Admin user form state
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState({
    email: "",
    password: "",
    role: "Co-Owner / Manager",
  });
  const [showAdminPass, setShowAdminPass] = useState<Record<string, boolean>>({});

  // Custom Confirmation / Alert Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText?: string;
    isDanger?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    isDanger: true,
    onConfirm: () => {},
  });

  // Coach form inputs
  const [coachForm, setCoachForm] = useState<{
    title: string;
    subtitle: string;
    meta: string;
    desc: string;
    tags: string;
    image: string;
  }>({
    title: "",
    subtitle: "",
    meta: "",
    desc: "",
    tags: "",
    image: "",
  });

  // Section refs for smooth navigation scrolling
  const enquiriesRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const founderRef = useRef<HTMLDivElement>(null);
  const offersRef = useRef<HTMLDivElement>(null);
  const pricesRef = useRef<HTMLDivElement>(null);
  const coachesRef = useRef<HTMLDivElement>(null);
  const blogsRef = useRef<HTMLDivElement>(null);
  const policiesRef = useRef<HTMLDivElement>(null);
  const adminsRef = useRef<HTMLDivElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroVideoFileInputRef = useRef<HTMLInputElement>(null);
  const founderFileInputRef = useRef<HTMLInputElement>(null);
  const founderVideoFileInputRef = useRef<HTMLInputElement>(null);
  const beforeFileInputRef = useRef<HTMLInputElement>(null);
  const afterFileInputRef = useRef<HTMLInputElement>(null);

  const [isDragActive, setIsDragActive] = useState(false);
  const [isHeroDragActive, setIsHeroDragActive] = useState(false);
  const [isFounderDragActive, setIsFounderDragActive] = useState(false);
  const [isBeforeDragActive, setIsBeforeDragActive] = useState(false);
  const [isAfterDragActive, setIsAfterDragActive] = useState(false);
  const [transSliderPos, setTransSliderPos] = useState(50);

  const handleHeroVideoFile = (file: File) => {
    if (!file.type.startsWith("video/")) {
      setConfirmModal({
        isOpen: true,
        title: "Invalid File Type",
        message: "Please drag or upload a valid video file (MP4, WEBM, MOV).",
        confirmText: "Got It",
        cancelText: "",
        isDanger: false,
        onConfirm: () => setConfirmModal((prev) => ({ ...prev, isOpen: false })),
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setTaglineDraft((prev) => ({ ...prev, heroVideoUrl: e.target!.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setConfirmModal({
        isOpen: true,
        title: "Invalid File Type",
        message: "Please drag or upload a valid image file (PNG, JPG, WEBP, or GIF).",
        confirmText: "Got It",
        cancelText: "",
        isDanger: false,
        onConfirm: () => setConfirmModal((prev) => ({ ...prev, isOpen: false })),
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setCoachForm((prev) => ({ ...prev, image: e.target!.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFounderImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setConfirmModal({
        isOpen: true,
        title: "Invalid File Type",
        message: "Please drag or upload a valid image file (PNG, JPG, WEBP, or GIF).",
        confirmText: "Got It",
        cancelText: "",
        isDanger: false,
        onConfirm: () => setConfirmModal((prev) => ({ ...prev, isOpen: false })),
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setFounderDraft((prev) => ({ ...prev, image: e.target!.result as string, mediaType: "image" }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFounderVideoFile = (file: File) => {
    if (!file.type.startsWith("video/")) {
      setConfirmModal({
        isOpen: true,
        title: "Invalid Video File",
        message: "Please drag or upload a valid video file (MP4, WEBM, MOV).",
        confirmText: "Got It",
        cancelText: "",
        isDanger: false,
        onConfirm: () => setConfirmModal((prev) => ({ ...prev, isOpen: false })),
      });
      return;
    }
    const url = URL.createObjectURL(file);
    setFounderDraft((prev) => ({ ...prev, videoUrl: url, mediaType: "video" }));
  };

  const handleBeforeImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setConfirmModal({
        isOpen: true,
        title: "Invalid File Type",
        message: "Please drag or upload a valid image file (PNG, JPG, WEBP, or GIF).",
        confirmText: "Got It",
        cancelText: "",
        isDanger: false,
        onConfirm: () => setConfirmModal((prev) => ({ ...prev, isOpen: false })),
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setFounderDraft((prev) => ({ ...prev, beforeImage: e.target!.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAfterImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setConfirmModal({
        isOpen: true,
        title: "Invalid File Type",
        message: "Please drag or upload a valid image file (PNG, JPG, WEBP, or GIF).",
        confirmText: "Got It",
        cancelText: "",
        isDanger: false,
        onConfirm: () => setConfirmModal((prev) => ({ ...prev, isOpen: false })),
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setFounderDraft((prev) => ({ ...prev, afterImage: e.target!.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Prevent background smooth scroll interference (Lenis) when Admin is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  const scrollToSection = (
    ref: React.RefObject<HTMLDivElement>,
    sectionName: "all" | "enquiries" | "tagline" | "founder" | "offers" | "prices" | "coaches" | "blogs" | "policies" | "admins"
  ) => {
    setActiveSection(sectionName);
    const container = document.querySelector('[data-admin-scroll="true"]');
    if (container) {
      container.scrollTop = 0;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  // Sync draft when siteData changes or panel opens
  useEffect(() => {
    if (isOpen) {
      setTaglineDraft(siteData.tagline);
      setOfferDraft(siteData.offer);
      setPlansDraft(siteData.plans);
      setCoachesDraft(siteData.coaches);
      setAdminsDraft(siteData.admins || []);
      setFounderDraft(siteData.founder || defaultSiteData.founder);
      setBlogsDraft(siteData.blogs || defaultSiteData.blogs);
      setPoliciesDraft(siteData.policies || defaultSiteData.policies);
      setWebhookUrlDraft(siteData.googleSheetWebhookUrl || "");
      setEnquiriesDraft(siteData.enquiries || []);
    }
  }, [isOpen, siteData]);

  if (!isOpen) return null;

  // Check if any changes have been made in the draft compared to active siteData
  const isDirty =
    JSON.stringify(taglineDraft) !== JSON.stringify(siteData.tagline) ||
    JSON.stringify(offerDraft) !== JSON.stringify(siteData.offer) ||
    JSON.stringify(plansDraft) !== JSON.stringify(siteData.plans) ||
    JSON.stringify(coachesDraft) !== JSON.stringify(siteData.coaches) ||
    JSON.stringify(adminsDraft) !== JSON.stringify(siteData.admins || []) ||
    JSON.stringify(founderDraft) !== JSON.stringify(siteData.founder || defaultSiteData.founder) ||
    JSON.stringify(blogsDraft) !== JSON.stringify(siteData.blogs || defaultSiteData.blogs) ||
    JSON.stringify(policiesDraft) !== JSON.stringify(siteData.policies || defaultSiteData.policies) ||
    webhookUrlDraft !== (siteData.googleSheetWebhookUrl || "") ||
    JSON.stringify(enquiriesDraft) !== JSON.stringify(siteData.enquiries || []);

  const handleSaveAll = () => {
    if (!isDirty) return;
    const updated: AdminSiteData = {
      tagline: taglineDraft,
      offer: offerDraft,
      plans: plansDraft,
      coaches: coachesDraft,
      admins: adminsDraft,
      founder: founderDraft,
      blogs: blogsDraft,
      policies: policiesDraft,
      googleSheetWebhookUrl: webhookUrlDraft,
      enquiries: enquiriesDraft,
    };
    onSaveData(updated);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  // Plan editing handlers
  const handleUpdatePlanPrice = (id: string, price: number) => {
    setPlansDraft((prev) =>
      prev.map((p) => (p.id === id ? { ...p, price: isNaN(price) ? 0 : price } : p))
    );
  };

  const handleUpdatePlanOfferPrice = (id: string, offerPrice: number) => {
    setPlansDraft((prev) =>
      prev.map((p) => (p.id === id ? { ...p, offerPrice: isNaN(offerPrice) ? 0 : offerPrice } : p))
    );
  };

  const handleUpdatePlanOfferTag = (id: string, offerTag: string) => {
    setPlansDraft((prev) => prev.map((p) => (p.id === id ? { ...p, offerTag } : p)));
  };

  const handleUpdatePlanOriginalPrice = (id: string, originalPrice: number) => {
    setPlansDraft((prev) =>
      prev.map((p) => (p.id === id ? { ...p, originalPrice: isNaN(originalPrice) ? 0 : originalPrice } : p))
    );
  };

  const handleUpdatePlanName = (id: string, name: string) => {
    setPlansDraft((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  };

  const handleUpdatePlanBadge = (id: string, badge: string) => {
    setPlansDraft((prev) =>
      prev.map((p) => (p.id === id ? { ...p, badge: badge.trim() === "" ? null : badge } : p))
    );
  };

  const handleUpdatePlanFeatures = (id: string, featuresStr: string) => {
    const list = featuresStr.split("\n").filter((f) => f.trim() !== "");
    setPlansDraft((prev) => prev.map((p) => (p.id === id ? { ...p, features: list } : p)));
  };

  // Coach handlers
  const handleOpenAddCoach = () => {
    setCoachForm({
      title: "",
      subtitle: "",
      meta: "SENIOR COACH",
      desc: "",
      tags: "Strength, Conditioning, Bodybuilding",
      image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=1200&auto=format&fit=crop",
    });
    setEditingCoachId(null);
    setIsAddingCoach(true);
  };

  const handleOpenEditCoach = (coach: CoachItem) => {
    setCoachForm({
      title: coach.title,
      subtitle: coach.subtitle,
      meta: coach.meta,
      desc: coach.desc,
      tags: coach.tags.join(", "),
      image: coach.image,
    });
    setEditingCoachId(coach.id);
    setIsAddingCoach(true);
  };

  const handleSaveCoach = () => {
    if (!coachForm.title.trim() || !coachForm.subtitle.trim()) {
      setConfirmModal({
        isOpen: true,
        title: "Required Fields Missing",
        message: "Please fill out both the Coach Name and Specialty Subtitle fields.",
        confirmText: "Got It",
        cancelText: "",
        isDanger: false,
        onConfirm: () => setConfirmModal((prev) => ({ ...prev, isOpen: false })),
      });
      return;
    }

    const tagArray = coachForm.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (editingCoachId) {
      setCoachesDraft((prev) =>
        prev.map((c) =>
          c.id === editingCoachId
            ? {
                ...c,
                title: coachForm.title.toUpperCase(),
                subtitle: coachForm.subtitle,
                meta: coachForm.meta.toUpperCase(),
                desc: coachForm.desc,
                tags: tagArray.length > 0 ? tagArray : ["Coaching", "Fitness"],
                image: coachForm.image || "https://images.unsplash.com/photo-1567013127542-490d757e51fc",
              }
            : c
        )
      );
    } else {
      const newId = `coach-${Date.now()}`;
      const count = coachesDraft.length + 1;
      const cardNum = count < 10 ? `0${count}` : `${count}`;
      const newCoach: CoachItem = {
        id: newId,
        cardNumber: cardNum,
        totalCards: `${count}`,
        title: coachForm.title.toUpperCase(),
        subtitle: coachForm.subtitle,
        meta: coachForm.meta.toUpperCase() || "NEW COACH",
        desc: coachForm.desc || "Dedicated fitness coach leading transformation programs at Hercules FITNESS.",
        tags: tagArray.length > 0 ? tagArray : ["Personal Training", "Fitness"],
        image: coachForm.image || "https://images.unsplash.com/photo-1567013127542-490d757e51fc",
      };
      setCoachesDraft((prev) => [...prev, newCoach]);
    }

    setIsAddingCoach(false);
    setEditingCoachId(null);
  };

  const handleDeleteCoach = (coachId: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Remove Trainer from Roster",
      message: `Are you sure you want to remove coach "${name}" from active trainers? This will update your landing page immediately.`,
      confirmText: "Remove Coach",
      cancelText: "Cancel",
      isDanger: true,
      onConfirm: () => {
        setCoachesDraft((prev) => prev.filter((c) => c.id !== coachId));
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Admin user handlers
  const handleCreateNewAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = newAdminForm.email.trim().toLowerCase();
    const cleanPassword = newAdminForm.password.trim();

    if (!cleanEmail || !cleanPassword) {
      setConfirmModal({
        isOpen: true,
        title: "Missing Admin Credentials",
        message: "Both Email ID and Password are required to register an Admin account.",
        confirmText: "Understood",
        cancelText: "",
        isDanger: false,
        onConfirm: () => setConfirmModal((prev) => ({ ...prev, isOpen: false })),
      });
      return;
    }

    if (adminsDraft.some((a) => a.email.toLowerCase() === cleanEmail)) {
      setConfirmModal({
        isOpen: true,
        title: "Account Exists",
        message: `An admin account with email "${cleanEmail}" is already registered.`,
        confirmText: "Understood",
        cancelText: "",
        isDanger: false,
        onConfirm: () => setConfirmModal((prev) => ({ ...prev, isOpen: false })),
      });
      return;
    }

    const newAdmin: AdminUser = {
      id: `admin-${Date.now()}`,
      email: cleanEmail,
      password: cleanPassword,
      role: newAdminForm.role || "Co-Owner",
      addedAt: new Date().toISOString().split("T")[0],
    };

    setAdminsDraft((prev) => [...prev, newAdmin]);
    setNewAdminForm({ email: "", password: "", role: "Co-Owner / Manager" });
    setIsAddingAdmin(false);
  };

  const handleDeleteAdmin = (adminId: string, email: string) => {
    if (email.toLowerCase() === "abcd@gmail.com") {
      setConfirmModal({
        isOpen: true,
        title: "Primary Owner Protected",
        message: "The primary Super Admin owner account (abcd@gmail.com) cannot be deleted.",
        confirmText: "Understood",
        cancelText: "",
        isDanger: false,
        onConfirm: () => setConfirmModal((prev) => ({ ...prev, isOpen: false })),
      });
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: "Revoke Admin Access",
      message: `Are you sure you want to revoke admin panel login access for "${email}"?`,
      confirmText: "Revoke Access",
      cancelText: "Cancel",
      isDanger: true,
      onConfirm: () => {
        setAdminsDraft((prev) => prev.filter((a) => a.id !== adminId));
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Blog handlers
  const handleOpenEditBlog = (blog: BlogPost) => {
    setEditingBlogId(blog.id);
    setBlogForm(blog);
    setIsAddingBlog(true);
  };

  const handleSaveBlogForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title.trim() || !blogForm.content.trim()) {
      setConfirmModal({
        isOpen: true,
        title: "Missing Required Fields",
        message: "Please enter both a Title/Question and the complete Blog Content.",
        confirmText: "Understood",
        cancelText: "",
        isDanger: false,
        onConfirm: () => setConfirmModal((prev) => ({ ...prev, isOpen: false })),
      });
      return;
    }

    if (editingBlogId) {
      setBlogsDraft((prev) =>
        prev.map((b) => (b.id === editingBlogId ? { ...blogForm, id: editingBlogId } : b))
      );
    } else {
      const newBlog: BlogPost = {
        ...blogForm,
        id: `blog-${Date.now()}`,
      };
      setBlogsDraft((prev) => [...prev, newBlog]);
    }

    setIsAddingBlog(false);
    setEditingBlogId(null);
    setBlogForm({
      id: "",
      title: "",
      subtitle: "",
      category: "GUIDE",
      author: "Coach Girish",
      date: "August 2024",
      content: "",
    });
  };

  const handleDeleteBlog = (id: string, title: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Blog Article",
      message: `Are you sure you want to delete "${title}"?`,
      confirmText: "Delete Article",
      cancelText: "Cancel",
      isDanger: true,
      onConfirm: () => {
        setBlogsDraft((prev) => prev.filter((b) => b.id !== id));
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const toggleShowPass = (id: string) => {
    setShowAdminPass((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div
      data-lenis-prevent="true"
      data-admin-scroll="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 999999,
        background: "#09090b",
        color: "#fafafa",
        overflowY: "scroll",
        overflowX: "hidden",
        WebkitOverflowScrolling: "touch",
        touchAction: "pan-y",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      {/* ═══════════════════════════════════════ HEADER */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: "rgba(18, 18, 20, 0.95)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "16px 32px",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          {/* Brand Info */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <HerculesLogo size={42} />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h1
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    margin: 0,
                    color: "#ffffff",
                  }}
                >
                  Hercules Control Panel
                </h1>
                <span
                  style={{
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    background: "rgba(216, 255, 62, 0.12)",
                    color: ACCENT,
                    padding: "2px 8px",
                    borderRadius: 4,
                    border: "1px solid rgba(216, 255, 62, 0.25)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Admin Mode
                </span>
              </div>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#a1a1aa",
                  margin: "2px 0 0",
                  fontWeight: 400,
                }}
              >
                Logged in as <span style={{ color: "#f4f4f5", fontWeight: 500 }}>{currentUserEmail}</span>
              </p>
            </div>
          </div>

          {/* Minimalist Navigation Pills */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#18181b",
              padding: "4px",
              borderRadius: 8,
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            {[
              { id: "all", label: "Overview", icon: Sliders, ref: taglineRef },
              { id: "enquiries", label: `Leads (${enquiriesDraft.length})`, icon: FileSpreadsheet, ref: enquiriesRef },
              { id: "tagline", label: "Tagline", icon: Type, ref: taglineRef },
              { id: "founder", label: "Founder Story", icon: Award, ref: founderRef },
              { id: "offers", label: "Offers", icon: Tag, ref: offersRef },
              { id: "prices", label: "Pricing", icon: DollarSign, ref: pricesRef },
              { id: "coaches", label: `Coaches (${coachesDraft.length})`, icon: Users, ref: coachesRef },
              { id: "blogs", label: `Blogs (${blogsDraft.length})`, icon: BookOpen, ref: blogsRef },
              { id: "policies", label: "Policies", icon: Scale, ref: policiesRef },
              { id: "admins", label: `Admins (${adminsDraft.length})`, icon: ShieldCheck, ref: adminsRef },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.ref, item.id as any)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 14px",
                    borderRadius: 6,
                    border: "none",
                    background: isActive ? "rgba(255, 255, 255, 0.1)" : "transparent",
                    color: isActive ? "#ffffff" : "#a1a1aa",
                    fontSize: "0.8125rem",
                    fontWeight: isActive ? 600 : 500,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <Icon size={14} style={{ color: isActive ? ACCENT : "#71717a" }} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={handleSaveAll}
              disabled={!isDirty}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: isDirty ? ACCENT : "rgba(255, 255, 255, 0.08)",
                color: isDirty ? "#09090b" : "#a1a1aa",
                border: isDirty ? "none" : "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: 6,
                padding: "10px 18px",
                fontSize: "0.8125rem",
                fontWeight: 600,
                cursor: isDirty ? "pointer" : "not-allowed",
                transition: "all 0.15s ease",
                opacity: isDirty ? 1 : 0.7,
                boxShadow: isDirty ? "0 2px 8px rgba(216, 255, 62, 0.2)" : "none",
              }}
            >
              {isDirty ? <Save size={15} /> : <Check size={15} style={{ color: ACCENT }} />}
              {isDirty ? "Save All Changes" : "All Changes Saved"}
            </button>

            <button
              onClick={onClose}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(255, 255, 255, 0.05)",
                color: "#e4e4e7",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 6,
                padding: "10px 16px",
                fontSize: "0.8125rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)")}
            >
              <ExternalLink size={14} />
              View Website
            </button>

            <button
              onClick={onLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(239, 68, 68, 0.08)",
                color: "#f87171",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                borderRadius: 6,
                padding: "10px 14px",
                fontSize: "0.8125rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Save Success Toast Banner */}
      {saveToast && (
        <div
          style={{
            position: "sticky",
            top: 75,
            zIndex: 999,
            background: ACCENT,
            color: "#09090b",
            padding: "12px 24px",
            fontSize: "0.8125rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          <Check size={16} />
          Changes saved successfully! Your website is now live with the updated content.
        </div>
      )}

      {/* ═══════════════════════════════════════ MAIN CONTENT */}
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 32px 100px" }}>

        {/* Dashboard Welcome Header */}
        <div style={{ marginBottom: "36px" }}>
          <h2
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#ffffff",
              margin: 0,
            }}
          >
            Website Content & Admin Settings
          </h2>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#a1a1aa",
              margin: "6px 0 0",
              lineHeight: 1.6,
            }}
          >
            Manage your landing page taglines, special discount offers, membership plans, active trainers, and admin access accounts.
          </p>
        </div>

        {/* Overview Metric Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              background: "#121215",
              border: "1px solid rgba(255, 255, 255, 0.07)",
              borderRadius: 10,
              padding: "20px 24px",
            }}
          >
            <div style={{ fontSize: "0.75rem", fontWeight: 500, color: "#71717a", marginBottom: 6 }}>
              Hero Headline
            </div>
            <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#ffffff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {taglineDraft.headlineMain} <span style={{ color: ACCENT }}>{taglineDraft.headlineHighlight}</span>
            </div>
          </div>

          <div
            style={{
              background: "#121215",
              border: "1px solid rgba(255, 255, 255, 0.07)",
              borderRadius: 10,
              padding: "20px 24px",
            }}
          >
            <div style={{ fontSize: "0.75rem", fontWeight: 500, color: "#71717a", marginBottom: 6 }}>
              Offer Announcement Bar
            </div>
            <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: offerDraft.enabled ? ACCENT : "#f87171" }}>
              {offerDraft.enabled ? `Active (${offerDraft.discountPercentage}% Discount)` : "Disabled"}
            </div>
          </div>

          <div
            style={{
              background: "#121215",
              border: "1px solid rgba(255, 255, 255, 0.07)",
              borderRadius: 10,
              padding: "20px 24px",
            }}
          >
            <div style={{ fontSize: "0.75rem", fontWeight: 500, color: "#71717a", marginBottom: 6 }}>
              Membership Plans
            </div>
            <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#ffffff" }}>
              {plansDraft.length} Plans (₹{Math.min(...plansDraft.map((p) => p.price)).toLocaleString()} – ₹{Math.max(...plansDraft.map((p) => p.price)).toLocaleString()}/mo)
            </div>
          </div>

          <div
            style={{
              background: "#121215",
              border: "1px solid rgba(255, 255, 255, 0.07)",
              borderRadius: 10,
              padding: "20px 24px",
            }}
          >
            <div style={{ fontSize: "0.75rem", fontWeight: 500, color: "#71717a", marginBottom: 6 }}>
              Coaches Roster
            </div>
            <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: ACCENT }}>
              {coachesDraft.length} Active Trainers
            </div>
          </div>

          <div
            style={{
              background: "#121215",
              border: "1px solid rgba(255, 255, 255, 0.07)",
              borderRadius: 10,
              padding: "20px 24px",
            }}
          >
            <div style={{ fontSize: "0.75rem", fontWeight: 500, color: "#71717a", marginBottom: 6 }}>
              Admin Accounts
            </div>
            <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#ffffff" }}>
              {adminsDraft.length} Users Registered
            </div>
          </div>
        </div>

        {(activeSection === "all" || activeSection === "enquiries") && (
          /* ═══════════════════════════════════════ SECTION: LEADS & GOOGLE SHEETS */
          <section
            ref={enquiriesRef}
            id="admin-enquiries"
            style={{
              background: "#121215",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 12,
              padding: "32px",
              marginBottom: "40px",
            }}
          >
            <div style={{ marginBottom: "24px", borderBottom: "1px solid rgba(255, 255, 255, 0.06)", paddingBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <FileSpreadsheet size={20} color={ACCENT} />
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#ffffff", margin: 0 }}>
                    Lead Enquiries & Google Sheets Backend ({enquiriesDraft.length})
                  </h3>
                </div>
                <p style={{ fontSize: "0.8125rem", color: "#a1a1aa", margin: 0 }}>
                  View all incoming consultation & website membership enquiries, connect your Google Sheet Webhook, or export lead data.
                </p>
              </div>

              {/* Quick Actions */}
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => {
                    const headers = ["ID", "Submitted At", "Full Name", "Phone", "Email", "Fitness Goal", "PT Coach Choice", "Plan"];
                    const rows = enquiriesDraft.map((l) => [
                      l.id,
                      `"${l.submittedAt}"`,
                      `"${l.name}"`,
                      `"${l.phone}"`,
                      `"${l.email || ""}"`,
                      `"${l.goal}"`,
                      `"${l.preferredCoach || "None"}"`,
                      `"${l.planName || "Free Consultation"}"`,
                    ]);
                    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
                    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", `Hercules_Fitness_Leads_${Date.now()}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  disabled={enquiriesDraft.length === 0}
                  style={{
                    background: enquiriesDraft.length > 0 ? "rgba(216, 255, 62, 0.12)" : "rgba(255, 255, 255, 0.04)",
                    color: enquiriesDraft.length > 0 ? ACCENT : "#71717a",
                    border: `1px solid ${enquiriesDraft.length > 0 ? "rgba(216, 255, 62, 0.3)" : "rgba(255, 255, 255, 0.08)"}`,
                    borderRadius: 6,
                    padding: "8px 14px",
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    cursor: enquiriesDraft.length > 0 ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Download size={14} /> Export CSV
                </button>
                {enquiriesDraft.length > 0 && (
                  <button
                    onClick={() => setEnquiriesDraft([])}
                    style={{
                      background: "rgba(239, 68, 68, 0.1)",
                      color: "#ef4444",
                      border: "1px solid rgba(239, 68, 68, 0.25)",
                      borderRadius: 6,
                      padding: "8px 14px",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Trash2 size={13} /> Clear Leads Log
                  </button>
                )}
              </div>
            </div>

            {/* Google Sheets Webhook Setup Card */}
            <div style={{ background: "#18181b", padding: 20, borderRadius: 10, border: "1px solid rgba(255, 255, 255, 0.08)", marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Database size={16} color={ACCENT} />
                  <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#ffffff" }}>
                    🔗 Google Sheets Webhook Integration (Google Apps Script)
                  </span>
                </div>
                {testWebhookStatus && (
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: ACCENT }}>
                    {testWebhookStatus}
                  </span>
                )}
              </div>

              <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                <input
                  type="url"
                  placeholder="Paste your Google Apps Script Web App URL here (e.g. https://script.google.com/macros/s/.../exec)"
                  value={webhookUrlDraft}
                  onChange={(e) => setWebhookUrlDraft(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    background: "#27272a",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: 6,
                    color: ACCENT,
                    fontSize: "0.8125rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  onClick={() => {
                    if (!webhookUrlDraft.trim()) {
                      setTestWebhookStatus("⚠️ Please enter a Webhook URL first.");
                      return;
                    }
                    setTestWebhookStatus("⏳ Sending test lead to Google Sheet...");
                    try {
                      fetch(webhookUrlDraft.trim(), {
                        method: "POST",
                        headers: { "Content-Type": "text/plain;charset=utf-8" },
                        body: JSON.stringify({
                          id: "test-lead",
                          name: "Test User (Hercules Website)",
                          phone: "+91 99008 97907",
                          email: "test@herculesfitness.in",
                          goal: "Fat Loss & Muscle Gain",
                          preferredCoach: "Coach Girish (19+ Yrs Exp)",
                          planName: "Test Webhook Verification",
                          submittedAt: new Date().toLocaleString(),
                        }),
                        mode: "no-cors",
                      })
                        .then(() => {
                          setTestWebhookStatus("✅ Test payload dispatched to Google Sheet!");
                          setTimeout(() => setTestWebhookStatus(null), 4000);
                        })
                        .catch(() => {
                          setTestWebhookStatus("⚠️ Webhook sent (no-cors mode)");
                          setTimeout(() => setTestWebhookStatus(null), 4000);
                        });
                    } catch (err) {
                      setTestWebhookStatus("⚠️ Dispatched test payload.");
                      setTimeout(() => setTestWebhookStatus(null), 4000);
                    }
                  }}
                  style={{
                    background: ACCENT,
                    color: "#09090b",
                    border: "none",
                    borderRadius: 6,
                    padding: "10px 18px",
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    whiteSpace: "nowrap",
                  }}
                >
                  <Send size={14} /> Test Webhook
                </button>
              </div>

              {/* Google Apps Script 1-Click Code Snippet */}
              <div style={{ background: "#09090b", borderRadius: 8, padding: 14, border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: "0.75rem", color: "#a1a1aa", fontWeight: 600 }}>
                    💡 How to connect Google Sheets (Google Apps Script Code):
                  </span>
                  <button
                    onClick={() => {
                      const code = `function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    data.submittedAt || new Date(),
    data.name,
    data.phone,
    data.email || '',
    data.goal,
    data.preferredCoach || 'None',
    data.planName || 'General Enquiry'
  ]);
  return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
}`;
                      navigator.clipboard.writeText(code);
                      setCopyCodeToast(true);
                      setTimeout(() => setCopyCodeToast(false), 2500);
                    }}
                    style={{
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "none",
                      color: copyCodeToast ? ACCENT : "#ffffff",
                      borderRadius: 4,
                      padding: "4px 10px",
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Copy size={12} /> {copyCodeToast ? "COPIED TO CLIPBOARD!" : "COPY APPS SCRIPT CODE"}
                  </button>
                </div>
                <pre style={{ margin: 0, fontSize: "0.75rem", color: "#d4d4d8", fontFamily: "monospace", overflowX: "auto" }}>
{`1. Open a Google Sheet -> Extensions -> Apps Script
2. Paste this code:
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([data.submittedAt, data.name, data.phone, data.email || '', data.goal, data.preferredCoach || 'None', data.planName || 'General']);
  return ContentService.createTextOutput("OK");
}
3. Click Deploy -> New deployment -> Select type: Web app
4. Set "Who has access" to "Anyone" -> Click Deploy -> Copy the Web App URL and paste above!`}
                </pre>
              </div>
            </div>

            {/* Enquiries Data Table */}
            {enquiriesDraft.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#71717a" }}>
                <FileSpreadsheet size={36} style={{ marginBottom: 8, opacity: 0.4 }} />
                <p style={{ margin: 0, fontSize: "0.9375rem" }}>No lead enquiries recorded yet.</p>
                <p style={{ margin: "4px 0 0", fontSize: "0.75rem" }}>
                  Whenever a visitor submits a Free Consultation or 25% Web Discount inquiry, it will appear here automatically.
                </p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem", textAlign: "left" }}>
                  <thead>
                    <tr style={{ background: "#18181b", color: "#a1a1aa", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
                      <th style={{ padding: "12px 14px", fontWeight: 700 }}>DATE & TIME</th>
                      <th style={{ padding: "12px 14px", fontWeight: 700 }}>FULL NAME</th>
                      <th style={{ padding: "12px 14px", fontWeight: 700 }}>PHONE NUMBER</th>
                      <th style={{ padding: "12px 14px", fontWeight: 700 }}>EMAIL ADDRESS</th>
                      <th style={{ padding: "12px 14px", fontWeight: 700 }}>FITNESS GOAL</th>
                      <th style={{ padding: "12px 14px", fontWeight: 700, color: ACCENT }}>PT COACH CHOICE</th>
                      <th style={{ padding: "12px 14px", fontWeight: 700 }}>SOURCE / PLAN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiriesDraft.map((lead) => (
                      <tr key={lead.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)", color: "#ffffff" }}>
                        <td style={{ padding: "12px 14px", color: "#a1a1aa", whiteSpace: "nowrap" }}>{lead.submittedAt}</td>
                        <td style={{ padding: "12px 14px", fontWeight: 700 }}>{lead.name}</td>
                        <td style={{ padding: "12px 14px", color: ACCENT, fontFamily: "monospace" }}>{lead.phone}</td>
                        <td style={{ padding: "12px 14px", color: "#d4d4d8" }}>{lead.email || "—"}</td>
                        <td style={{ padding: "12px 14px" }}>{lead.goal}</td>
                        <td style={{ padding: "12px 14px", color: ACCENT, fontWeight: 600 }}>{lead.preferredCoach || "Any Coach"}</td>
                        <td style={{ padding: "12px 14px", color: "#a1a1aa" }}>{lead.planName || "Free Consultation"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {(activeSection === "all" || activeSection === "tagline") && (
          /* ═══════════════════════════════════════ SECTION 1: TAGLINE & HERO BANNER */
          <section
            ref={taglineRef}
            id="admin-tagline"
            style={{
              background: "#121215",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 12,
              padding: "32px",
              marginBottom: "40px",
            }}
          >
          {/* Card Header */}
          <div style={{ marginBottom: "28px", borderBottom: "1px solid rgba(255, 255, 255, 0.06)", paddingBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <Type size={18} style={{ color: ACCENT }} />
              <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#ffffff", margin: 0 }}>
                1. Hero Banner Tagline & Headlines
              </h3>
            </div>
            <p style={{ fontSize: "0.8125rem", color: "#a1a1aa", margin: 0, lineHeight: 1.5 }}>
              Control the primary headline text and introduction paragraph shown at the top of your homepage.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
            {/* Form Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#e4e4e7", marginBottom: 6 }}>
                  Headline Line 1 (Primary Text)
                </label>
                <input
                  type="text"
                  value={taglineDraft.headlineMain}
                  onChange={(e) => setTaglineDraft({ ...taglineDraft, headlineMain: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    background: "#18181b",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: 6,
                    color: "#ffffff",
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <p style={{ fontSize: "0.75rem", color: "#a1a1aa", margin: "6px 0 0", lineHeight: 1.5 }}>
                  Main white headline text shown on the first line.
                </p>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#e4e4e7", marginBottom: 6 }}>
                  Headline Line 2 (Highlighted Text)
                </label>
                <input
                  type="text"
                  value={taglineDraft.headlineHighlight}
                  onChange={(e) => setTaglineDraft({ ...taglineDraft, headlineHighlight: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    background: "#18181b",
                    border: "1px solid rgba(216, 255, 62, 0.3)",
                    borderRadius: 6,
                    color: ACCENT,
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <p style={{ fontSize: "0.75rem", color: "#a1a1aa", margin: "6px 0 0", lineHeight: 1.5 }}>
                  Highlighted second line shown in lime accent color.
                </p>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#e4e4e7", marginBottom: 6 }}>
                  Hero Subtitle Description
                </label>
                <textarea
                  rows={4}
                  value={taglineDraft.subtitle}
                  onChange={(e) => setTaglineDraft({ ...taglineDraft, subtitle: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    background: "#18181b",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: 6,
                    color: "#d4d4d8",
                    fontSize: "0.875rem",
                    lineHeight: 1.6,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <p style={{ fontSize: "0.75rem", color: "#a1a1aa", margin: "6px 0 0", lineHeight: 1.5 }}>
                  Brief paragraph introducing your facility size, disciplines, and coaching philosophy.
                </p>
              </div>

              {/* Hero Section Background Video Input */}
              <div style={{ marginTop: 8 }}>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#ffffff", marginBottom: 6 }}>
                  🎥 Hero Section Background Video
                </label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsHeroDragActive(true); }}
                  onDragLeave={() => setIsHeroDragActive(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsHeroDragActive(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleHeroVideoFile(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => heroVideoFileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${isHeroDragActive ? ACCENT : "rgba(216, 255, 62, 0.3)"}`,
                    background: isHeroDragActive ? "rgba(216, 255, 62, 0.08)" : "#18181b",
                    borderRadius: 8,
                    padding: "16px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    marginBottom: 10,
                  }}
                >
                  <input
                    type="file"
                    ref={heroVideoFileInputRef}
                    accept="video/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleHeroVideoFile(e.target.files[0]);
                      }
                    }}
                  />
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <Upload size={20} color={ACCENT} />
                    <span style={{ fontSize: "0.8125rem", color: "#e4e4e7", fontWeight: 500 }}>
                      Drag & Drop background video or <span style={{ color: ACCENT, textDecoration: "underline" }}>browse device</span>
                    </span>
                    <span style={{ fontSize: "0.6875rem", color: "#71717a" }}>
                      Supports MP4, WEBM, MOV (Autoplays silently in full hero background)
                    </span>
                  </div>
                </div>

                <input
                  type="text"
                  value={taglineDraft.heroVideoUrl || ""}
                  onChange={(e) => setTaglineDraft({ ...taglineDraft, heroVideoUrl: e.target.value })}
                  placeholder="Or paste video URL (e.g. /hergirish_rotated.mp4 or https://...)"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: "#18181b",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: 6,
                    color: ACCENT,
                    fontSize: "0.8125rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Editable Hero Metrics Section */}
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#ffffff", marginBottom: 12 }}>
                  📊 Hero Section Metrics & Statistics (4 Cards)
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {(taglineDraft.heroMetrics || defaultSiteData.tagline.heroMetrics!).map((m, idx) => (
                    <div key={idx} style={{ background: "#18181b", padding: 14, borderRadius: 8, border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 10 }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.6875rem", color: "#a1a1aa", marginBottom: 4 }}>
                            Value (e.g. 19+ YRS)
                          </label>
                          <input
                            type="text"
                            value={m.value}
                            onChange={(e) => {
                              const newMetrics = [...(taglineDraft.heroMetrics || defaultSiteData.tagline.heroMetrics!)];
                              newMetrics[idx] = { ...newMetrics[idx], value: e.target.value };
                              setTaglineDraft({ ...taglineDraft, heroMetrics: newMetrics });
                            }}
                            style={{
                              width: "100%",
                              padding: "8px 10px",
                              background: "#27272a",
                              border: "1px solid rgba(255, 255, 255, 0.12)",
                              borderRadius: 4,
                              color: ACCENT,
                              fontWeight: 700,
                              fontSize: "0.8125rem",
                              outline: "none",
                              boxSizing: "border-box",
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "0.6875rem", color: "#a1a1aa", marginBottom: 4 }}>
                            Label Subtext (e.g. TRUSTED COACHES)
                          </label>
                          <input
                            type="text"
                            value={m.label}
                            onChange={(e) => {
                              const newMetrics = [...(taglineDraft.heroMetrics || defaultSiteData.tagline.heroMetrics!)];
                              newMetrics[idx] = { ...newMetrics[idx], label: e.target.value };
                              setTaglineDraft({ ...taglineDraft, heroMetrics: newMetrics });
                            }}
                            style={{
                              width: "100%",
                              padding: "8px 10px",
                              background: "#27272a",
                              border: "1px solid rgba(255, 255, 255, 0.12)",
                              borderRadius: 4,
                              color: "#ffffff",
                              fontSize: "0.8125rem",
                              outline: "none",
                              boxSizing: "border-box",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Preview Box */}
            <div
              style={{
                background: "#09090b",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 8,
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                  color: ACCENT,
                  background: "rgba(216, 255, 62, 0.1)",
                  padding: "3px 8px",
                  borderRadius: 4,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Live Preview
              </div>

              <div style={{ fontSize: "0.6875rem", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12 }}>
                BIDAR, KARNATAKA — EST. 2019
              </div>

              <h1
                style={{
                  fontSize: "2.25rem",
                  fontWeight: 800,
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  color: "#ffffff",
                  margin: "0 0 16px",
                  textTransform: "uppercase",
                }}
              >
                {taglineDraft.headlineMain}
                <br />
                <span style={{ color: ACCENT }}>{taglineDraft.headlineHighlight}</span>
              </h1>

              <p style={{ color: "#a1a1aa", fontSize: "0.875rem", lineHeight: 1.6, margin: 0 }}>
                {taglineDraft.subtitle}
              </p>
            </div>
          </div>
        </section>
        )}

        {(activeSection === "all" || activeSection === "founder") && (
          /* ═══════════════════════════════════════ SECTION 2: FOUNDER STORY & BEFORE-AFTER PHOTOS */
          <section
            ref={founderRef}
            id="admin-founder"
            style={{
              background: "#121215",
              border: "1px solid rgba(216, 255, 62, 0.2)",
              borderRadius: 12,
              padding: "32px",
              marginBottom: "40px",
            }}
          >
          <div style={{ marginBottom: "28px", borderBottom: "1px solid rgba(255, 255, 255, 0.06)", paddingBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <Award size={20} color={ACCENT} />
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#ffffff", margin: 0 }}>
                Founder & Head Coach Story
              </h3>
            </div>
            <p style={{ fontSize: "0.8125rem", color: "#a1a1aa", margin: 0 }}>
              Edit Coach Girish&apos;s photo, author details, and head coach quote text shown on the website.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "32px",
            }}
          >
            {/* Left Inputs */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Media Type Selector */}
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#e4e4e7", marginBottom: 8 }}>
                  Head Coach Media Format (9:16 Ratio)
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setFounderDraft({ ...founderDraft, mediaType: "video" })}
                    style={{
                      padding: "10px 14px",
                      background: founderDraft.mediaType === "video" ? "rgba(216, 255, 62, 0.15)" : "#18181b",
                      border: founderDraft.mediaType === "video" ? "1px solid #D8FF3E" : "1px solid rgba(255, 255, 255, 0.1)",
                      color: founderDraft.mediaType === "video" ? ACCENT : "#a1a1aa",
                      borderRadius: 6,
                      fontSize: "0.8125rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    🎥 Video Reel (9:16)
                  </button>

                  <button
                    type="button"
                    onClick={() => setFounderDraft({ ...founderDraft, mediaType: "image" })}
                    style={{
                      padding: "10px 14px",
                      background: founderDraft.mediaType === "image" ? "rgba(216, 255, 62, 0.15)" : "#18181b",
                      border: founderDraft.mediaType === "image" ? "1px solid #D8FF3E" : "1px solid rgba(255, 255, 255, 0.1)",
                      color: founderDraft.mediaType === "image" ? ACCENT : "#a1a1aa",
                      borderRadius: 6,
                      fontSize: "0.8125rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    🖼️ Photo (Image)
                  </button>
                </div>
              </div>

              {/* Founder Video Upload / URL */}
              {founderDraft.mediaType === "video" ? (
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#e4e4e7", marginBottom: 8 }}>
                    Coach Video Reel (Drag & Drop .MP4 or Device Upload)
                  </label>

                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsFounderDragActive(true);
                    }}
                    onDragLeave={() => setIsFounderDragActive(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsFounderDragActive(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleFounderVideoFile(e.dataTransfer.files[0]);
                      }
                    }}
                    onClick={() => founderVideoFileInputRef.current?.click()}
                    style={{
                      border: `2px dashed ${isFounderDragActive ? ACCENT : "rgba(216, 255, 62, 0.4)"}`,
                      background: isFounderDragActive ? "rgba(216, 255, 62, 0.08)" : "#18181b",
                      borderRadius: 8,
                      padding: "20px",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      marginBottom: 12,
                    }}
                  >
                    <input
                      type="file"
                      ref={founderVideoFileInputRef}
                      accept="video/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFounderVideoFile(e.target.files[0]);
                        }
                      }}
                    />
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                      <Upload size={24} color={ACCENT} />
                      <span style={{ fontSize: "0.8125rem", color: "#e4e4e7", fontWeight: 500 }}>
                        Drag & Drop video file here or <span style={{ color: ACCENT, textDecoration: "underline" }}>browse device</span>
                      </span>
                      <span style={{ fontSize: "0.6875rem", color: "#71717a" }}>
                        Supports MP4, WEBM, MOV (Autoplays vertically on scroll)
                      </span>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={founderDraft.videoUrl || ""}
                    onChange={(e) => setFounderDraft({ ...founderDraft, videoUrl: e.target.value, mediaType: "video" })}
                    placeholder="Or paste video URL directly (e.g. .mp4 link)..."
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "#18181b",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: 6,
                      color: "#ffffff",
                      fontSize: "0.8125rem",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              ) : (
                /* Founder Image Upload / URL */
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#e4e4e7", marginBottom: 8 }}>
                    Head Coach Photo (Drag & Drop or Device Upload)
                  </label>

                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsFounderDragActive(true);
                    }}
                    onDragLeave={() => setIsFounderDragActive(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsFounderDragActive(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleFounderImageFile(e.dataTransfer.files[0]);
                      }
                    }}
                    onClick={() => founderFileInputRef.current?.click()}
                    style={{
                      border: `2px dashed ${isFounderDragActive ? ACCENT : "rgba(255, 255, 255, 0.2)"}`,
                      background: isFounderDragActive ? "rgba(216, 255, 62, 0.05)" : "#18181b",
                      borderRadius: 8,
                      padding: "20px",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      marginBottom: 12,
                    }}
                  >
                    <input
                      type="file"
                      ref={founderFileInputRef}
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFounderImageFile(e.target.files[0]);
                        }
                      }}
                    />
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                      <Upload size={24} color={isFounderDragActive ? ACCENT : "#a1a1aa"} />
                      <span style={{ fontSize: "0.8125rem", color: "#e4e4e7", fontWeight: 500 }}>
                        Drag & Drop photo here or <span style={{ color: ACCENT, textDecoration: "underline" }}>browse device</span>
                      </span>
                      <span style={{ fontSize: "0.6875rem", color: "#71717a" }}>
                        Supports PNG, JPG, WEBP, GIF
                      </span>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={founderDraft.image}
                    onChange={(e) => setFounderDraft({ ...founderDraft, image: e.target.value, mediaType: "image" })}
                    placeholder="Or paste image URL directly..."
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "#18181b",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: 6,
                      color: "#ffffff",
                      fontSize: "0.8125rem",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              )}

              {/* Head Coach Quote Words */}
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#e4e4e7", marginBottom: 6 }}>
                  Head Coach Quote (Words from Coach Girish)
                </label>
                <textarea
                  rows={4}
                  value={founderDraft.quote}
                  onChange={(e) => setFounderDraft({ ...founderDraft, quote: e.target.value })}
                  placeholder="Enter Coach Girish's quote..."
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    background: "#18181b",
                    border: "1px solid rgba(216, 255, 62, 0.3)",
                    borderRadius: 6,
                    color: "#ffffff",
                    fontSize: "0.875rem",
                    lineHeight: 1.6,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#e4e4e7", marginBottom: 6 }}>
                    Coach Name / Title
                  </label>
                  <input
                    type="text"
                    value={founderDraft.quoteAuthor}
                    onChange={(e) => setFounderDraft({ ...founderDraft, quoteAuthor: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "#18181b",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: 6,
                      color: "#ffffff",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#e4e4e7", marginBottom: 6 }}>
                    Experience Subtext
                  </label>
                  <input
                    type="text"
                    value={founderDraft.quoteSubtext}
                    onChange={(e) => setFounderDraft({ ...founderDraft, quoteSubtext: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "#18181b",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: 6,
                      color: ACCENT,
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Right Live Preview Box (9:16 Ratio) */}
            <div
              style={{
                background: "#09090b",
                border: "1px solid rgba(216, 255, 62, 0.25)",
                borderRadius: 10,
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: ACCENT, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                LIVE PREVIEW: HEAD COACH (9:16 VERTICAL FORMAT)
              </div>

              {/* 9:16 Media Preview */}
              <div style={{ position: "relative", height: 280, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(216, 255, 62, 0.3)", background: "#111", aspectRatio: "9/16", margin: "0 auto", width: "100%", maxWidth: 180 }}>
                {founderDraft.mediaType === "video" && founderDraft.videoUrl ? (
                  <video
                    src={founderDraft.videoUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <img
                    src={founderDraft.image}
                    alt="Coach Preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                  />
                )}
                <div style={{ position: "absolute", bottom: 10, left: 10, right: 10, background: "rgba(0,0,0,0.85)", padding: "6px 8px", borderRadius: 4 }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#fff" }}>{founderDraft.quoteAuthor}</div>
                  <div style={{ fontSize: "0.625rem", color: ACCENT }}>{founderDraft.quoteSubtext}</div>
                </div>
              </div>

              {/* Quote Box Preview */}
              <div style={{ background: "rgba(216,255,62,0.04)", borderLeft: `3px solid ${ACCENT}`, padding: "12px 14px", borderRadius: "0 6px 6px 0" }}>
                <p style={{ fontSize: "0.8125rem", fontStyle: "italic", color: "#e4e4e7", margin: 0, lineHeight: 1.5 }}>
                  &ldquo;{founderDraft.quote}&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────── BEFORE & AFTER TRANSFORMATION IMAGES EDITING BLOCK */}
          <div style={{ marginTop: "36px", paddingTop: "28px", borderTop: "1px dashed rgba(216, 255, 62, 0.3)" }}>
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <Sliders size={18} color={ACCENT} />
                <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#ffffff", margin: 0 }}>
                  Before & After Transformation Comparison Photos
                </h4>
              </div>
              <p style={{ fontSize: "0.8125rem", color: "#a1a1aa", margin: 0, lineHeight: 1.5 }}>
                Update the BEFORE (Bulky/Starting) and AFTER (Transformed/Shredded) photos shown on the homepage comparison slider.
              </p>

              {/* Ideal Aspect Ratio Callout Banner */}
              <div style={{
                marginTop: 12,
                background: "rgba(216, 255, 62, 0.08)",
                border: "1px solid rgba(216, 255, 62, 0.3)",
                borderRadius: 8,
                padding: "12px 16px",
                display: "flex",
                alignItems: "flex-start",
                gap: 12
              }}>
                <Sparkles size={18} color={ACCENT} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#ffffff", marginBottom: 2 }}>
                    💡 Ideal Image Aspect Ratio Guide
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#d4d4d8", lineHeight: 1.5 }}>
                    For the smoothest comparison alignment, <strong>both the BEFORE and AFTER photos should have the exact same dimensions & aspect ratio</strong>.
                    <br />
                    • <strong>Recommended Aspect Ratio: 4:5 Portrait (e.g., 1080 × 1350 px)</strong> or <strong>1:1 Square (e.g., 1080 × 1080 px)</strong>.
                    <br />
                    • Ensure the person is centered and framed similarly in both photos so muscle changes align seamlessly when sliding.
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
              {/* Before Photo Input */}
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#ffffff", marginBottom: 8 }}>
                  📷 BEFORE Transformation Photo
                </label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsBeforeDragActive(true); }}
                  onDragLeave={() => setIsBeforeDragActive(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsBeforeDragActive(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleBeforeImageFile(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => beforeFileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${isBeforeDragActive ? ACCENT : "rgba(255, 255, 255, 0.2)"}`,
                    background: isBeforeDragActive ? "rgba(216, 255, 62, 0.08)" : "#18181b",
                    borderRadius: 8,
                    padding: "16px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    marginBottom: 10,
                  }}
                >
                  <input
                    type="file"
                    ref={beforeFileInputRef}
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleBeforeImageFile(e.target.files[0]);
                      }
                    }}
                  />
                  <Upload size={20} color={ACCENT} style={{ marginBottom: 6 }} />
                  <div style={{ fontSize: "0.8125rem", color: "#e4e4e7", fontWeight: 500 }}>
                    Drag & Drop BEFORE photo or <span style={{ color: ACCENT, textDecoration: "underline" }}>browse device</span>
                  </div>
                </div>
                <input
                  type="text"
                  value={founderDraft.beforeImage || ""}
                  onChange={(e) => setFounderDraft({ ...founderDraft, beforeImage: e.target.value })}
                  placeholder="Or paste BEFORE image URL..."
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: "#18181b",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: 6,
                    color: "#ffffff",
                    fontSize: "0.8125rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* After Photo Input */}
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: ACCENT, marginBottom: 8 }}>
                  ⚡ AFTER Transformation Photo
                </label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsAfterDragActive(true); }}
                  onDragLeave={() => setIsAfterDragActive(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsAfterDragActive(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleAfterImageFile(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => afterFileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${isAfterDragActive ? ACCENT : "rgba(216, 255, 62, 0.4)"}`,
                    background: isAfterDragActive ? "rgba(216, 255, 62, 0.08)" : "#18181b",
                    borderRadius: 8,
                    padding: "16px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    marginBottom: 10,
                  }}
                >
                  <input
                    type="file"
                    ref={afterFileInputRef}
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleAfterImageFile(e.target.files[0]);
                      }
                    }}
                  />
                  <Upload size={20} color={ACCENT} style={{ marginBottom: 6 }} />
                  <div style={{ fontSize: "0.8125rem", color: "#e4e4e7", fontWeight: 500 }}>
                    Drag & Drop AFTER photo or <span style={{ color: ACCENT, textDecoration: "underline" }}>browse device</span>
                  </div>
                </div>
                <input
                  type="text"
                  value={founderDraft.afterImage || ""}
                  onChange={(e) => setFounderDraft({ ...founderDraft, afterImage: e.target.value })}
                  placeholder="Or paste AFTER image URL..."
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: "#18181b",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: 6,
                    color: "#ffffff",
                    fontSize: "0.8125rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Live Interactive Before/After Comparison Preview */}
            <div style={{ marginTop: 24, background: "#09090b", border: "1px solid rgba(216, 255, 62, 0.25)", borderRadius: 10, padding: 20 }}>
              <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: ACCENT, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>
                LIVE PREVIEW: INTERACTIVE BEFORE/AFTER SLIDER
              </div>
              <div style={{ position: "relative", width: "100%", height: 260, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", background: "#111" }}>
                {/* After Image */}
                <img
                  src={founderDraft.afterImage || "/transformations/girish_after.png"}
                  alt="After preview"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
                />
                {/* Before Image */}
                <img
                  src={founderDraft.beforeImage || "/transformations/girish_before.png"}
                  alt="Before preview"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top center",
                    clipPath: `polygon(0 0, ${transSliderPos}% 0, ${transSliderPos}% 100%, 0 100%)`,
                    WebkitClipPath: `polygon(0 0, ${transSliderPos}% 0, ${transSliderPos}% 100%, 0 100%)`,
                  }}
                />
                {/* Labels */}
                <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(0,0,0,0.8)", color: "#fff", padding: "3px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
                  BEFORE
                </div>
                <div style={{ position: "absolute", top: 10, right: 10, background: ACCENT, color: "#000", padding: "3px 8px", borderRadius: 4, fontSize: 10, fontWeight: 800 }}>
                  AFTER
                </div>
                {/* Slider Line */}
                <div style={{ position: "absolute", top: 0, bottom: 0, left: `${transSliderPos}%`, width: 2, background: ACCENT, transform: "translateX(-50%)" }}>
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 24, height: 24, borderRadius: "50%", background: ACCENT, color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900 }}>
                    ↔
                  </div>
                </div>
              </div>
              {/* Slider Range Control */}
              <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: "0.75rem", color: "#a1a1aa" }}>Test slider drag:</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={transSliderPos}
                  onChange={(e) => setTransSliderPos(Number(e.target.value))}
                  style={{ flex: 1, accentColor: ACCENT }}
                />
                <span style={{ fontSize: "0.75rem", color: ACCENT, fontWeight: 700 }}>{transSliderPos}%</span>
              </div>
            </div>
          </div>
        </section>
        )}

        {(activeSection === "all" || activeSection === "offers") && (
          /* ═══════════════════════════════════════ SECTION 3: OFFERS */
          <section
            ref={offersRef}
            id="admin-offers"
            style={{
              background: "#121215",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 12,
              padding: "32px",
              marginBottom: "40px",
            }}
          >
          <div style={{ marginBottom: "28px", borderBottom: "1px solid rgba(255, 255, 255, 0.06)", paddingBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <Tag size={18} style={{ color: ACCENT }} />
              <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#ffffff", margin: 0 }}>
                2. Special Offers & Promotional Banner
              </h3>
            </div>
            <p style={{ fontSize: "0.8125rem", color: "#a1a1aa", margin: 0, lineHeight: 1.5 }}>
              Enable and customize the top announcement offer banner displayed across all pages.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Toggle Switch */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "#18181b",
                padding: "16px 20px",
                borderRadius: 8,
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <input
                type="checkbox"
                id="offerToggle"
                checked={offerDraft.enabled}
                onChange={(e) => setOfferDraft({ ...offerDraft, enabled: e.target.checked })}
                style={{ width: 18, height: 18, accentColor: ACCENT, cursor: "pointer" }}
              />
              <div>
                <label htmlFor="offerToggle" style={{ fontSize: "0.875rem", fontWeight: 600, color: "#ffffff", cursor: "pointer" }}>
                  Show Top Offer Announcement Banner
                </label>
                <p style={{ fontSize: "0.75rem", color: "#a1a1aa", margin: "2px 0 0" }}>
                  When enabled, this banner will appear at the very top of the landing page.
                </p>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#e4e4e7", marginBottom: 6 }}>
                Announcement Banner Text
              </label>
              <input
                type="text"
                value={offerDraft.announcementText}
                onChange={(e) => setOfferDraft({ ...offerDraft, announcementText: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  background: "#18181b",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: 6,
                  color: "#ffffff",
                  fontSize: "0.875rem",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <p style={{ fontSize: "0.75rem", color: "#a1a1aa", margin: "6px 0 0", lineHeight: 1.5 }}>
                The exact promotional text displayed in the top banner (e.g. discount details or limited seats).
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#e4e4e7", marginBottom: 6 }}>
                  Offer Badge Title
                </label>
                <input
                  type="text"
                  value={offerDraft.badgeText}
                  onChange={(e) => setOfferDraft({ ...offerDraft, badgeText: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    background: "#18181b",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: 6,
                    color: "#ffffff",
                    fontSize: "0.875rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <p style={{ fontSize: "0.75rem", color: "#a1a1aa", margin: "6px 0 0" }}>
                  Short tag title (e.g. LIMITED OFFER).
                </p>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#e4e4e7", marginBottom: 6 }}>
                  Discount Percentage (%)
                </label>
                <input
                  type="number"
                  value={offerDraft.discountPercentage}
                  onChange={(e) =>
                    setOfferDraft({
                      ...offerDraft,
                      discountPercentage: parseInt(e.target.value) || 0,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    background: "#18181b",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: 6,
                    color: "#ffffff",
                    fontSize: "0.875rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <p style={{ fontSize: "0.75rem", color: "#a1a1aa", margin: "6px 0 0" }}>
                  Discount rate applied to special promotions.
                </p>
              </div>
            </div>

            {/* Live Ticker Bar Preview */}
            {offerDraft.enabled && (
              <div
                style={{
                  background: ACCENT,
                  color: "#09090b",
                  padding: "12px 20px",
                  borderRadius: 6,
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <Tag size={16} />
                <span>Preview: {offerDraft.announcementText}</span>
              </div>
            )}
          </div>
        </section>
        )}

        {(activeSection === "all" || activeSection === "prices") && (
          /* ═══════════════════════════════════════ SECTION 4: PRICES & PLANS */
          <section
            ref={pricesRef}
            id="admin-prices"
            style={{
              background: "#121215",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 12,
              padding: "32px",
              marginBottom: "40px",
            }}
          >
          <div style={{ marginBottom: "28px", borderBottom: "1px solid rgba(255, 255, 255, 0.06)", paddingBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <DollarSign size={18} style={{ color: ACCENT }} />
              <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#ffffff", margin: 0 }}>
                3. Membership Pricing Plans
              </h3>
            </div>
            <p style={{ fontSize: "0.8125rem", color: "#a1a1aa", margin: 0, lineHeight: 1.5 }}>
              Update monthly plan costs, badge highlights, and feature lists. Changes automatically reflect on membership cards.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "24px",
            }}
          >
            {plansDraft.map((plan, index) => (
              <div
                key={plan.id}
                style={{
                  background: "#18181b",
                  border: plan.popular
                    ? "1px solid rgba(216, 255, 62, 0.3)"
                    : "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: 10,
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "16px",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                      paddingBottom: "12px",
                    }}
                  >
                    <span style={{ fontSize: "1.0625rem", fontWeight: 700, color: "#ffffff" }}>
                      Plan #{index + 1}: {plan.name}
                    </span>
                    {plan.popular && (
                      <span
                        style={{
                          fontSize: "0.6875rem",
                          fontWeight: 600,
                          background: ACCENT,
                          color: "#09090b",
                          padding: "2px 8px",
                          borderRadius: 4,
                        }}
                      >
                        Popular Card
                      </span>
                    )}
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#e4e4e7", marginBottom: 6 }}>
                      Plan Name
                    </label>
                    <input
                      type="text"
                      value={plan.name}
                      onChange={(e) => handleUpdatePlanName(plan.id, e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        background: "#27272a",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: 6,
                        color: "#ffffff",
                        fontSize: "0.875rem",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#ffffff", marginBottom: 6 }}>
                        Standard Gym Price (₹)
                      </label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#ffffff", fontWeight: 700 }}>
                          ₹
                        </span>
                        <input
                          type="number"
                          value={plan.price}
                          onChange={(e) => handleUpdatePlanPrice(plan.id, parseInt(e.target.value))}
                          style={{
                            width: "100%",
                            padding: "10px 12px 10px 28px",
                            background: "#27272a",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            borderRadius: 6,
                            color: "#ffffff",
                            fontSize: "0.95rem",
                            fontWeight: 700,
                            outline: "none",
                            boxSizing: "border-box",
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: ACCENT, marginBottom: 6 }}>
                        Website Offer CTA Price (₹)
                      </label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: ACCENT, fontWeight: 700 }}>
                          ₹
                        </span>
                        <input
                          type="number"
                          value={plan.offerPrice !== undefined ? plan.offerPrice : Math.round(plan.price * 0.75)}
                          onChange={(e) => handleUpdatePlanOfferPrice(plan.id, parseInt(e.target.value))}
                          style={{
                            width: "100%",
                            padding: "10px 12px 10px 28px",
                            background: "#27272a",
                            border: "1px solid rgba(216, 255, 62, 0.4)",
                            borderRadius: 6,
                            color: ACCENT,
                            fontSize: "1rem",
                            fontWeight: 700,
                            outline: "none",
                            boxSizing: "border-box",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#FF3E3E", marginBottom: 6 }}>
                      Website Offer Tag Pill Text
                    </label>
                    <input
                      type="text"
                      value={plan.offerTag || "⚡ GET 25% OFF VIA WEBSITE INQUIRY"}
                      onChange={(e) => handleUpdatePlanOfferTag(plan.id, e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        background: "#27272a",
                        border: "1px solid rgba(255, 62, 62, 0.25)",
                        borderRadius: 6,
                        color: "#FF3E3E",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#e4e4e7", marginBottom: 6 }}>
                      Badge Text (Optional)
                    </label>
                    <input
                      type="text"
                      value={plan.badge || ""}
                      placeholder="e.g. MOST POPULAR"
                      onChange={(e) => handleUpdatePlanBadge(plan.id, e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        background: "#27272a",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: 6,
                        color: "#ffffff",
                        fontSize: "0.875rem",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#e4e4e7", marginBottom: 6 }}>
                      Included Features (One feature per line)
                    </label>
                    <textarea
                      rows={5}
                      value={plan.features.join("\n")}
                      onChange={(e) => handleUpdatePlanFeatures(plan.id, e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        background: "#27272a",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: 6,
                        color: "#d4d4d8",
                        fontSize: "0.8125rem",
                        lineHeight: 1.6,
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        )}

        {(activeSection === "all" || activeSection === "coaches") && (
          /* ═══════════════════════════════════════ SECTION 5: COACHES */
          <section
            ref={coachesRef}
            id="admin-coaches"
            style={{
              background: "#121215",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 12,
              padding: "32px",
              marginBottom: "40px",
            }}
          >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "28px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
              paddingBottom: "20px",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <Users size={18} style={{ color: ACCENT }} />
                <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#ffffff", margin: 0 }}>
                  4. Coaches & Fitness Trainers Roster
                </h3>
              </div>
              <p style={{ fontSize: "0.8125rem", color: "#a1a1aa", margin: 0, lineHeight: 1.5 }}>
                Register new joining coaches, update specialties and profiles, or remove resigning trainers.
              </p>
            </div>

            <button
              onClick={handleOpenAddCoach}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: ACCENT,
                color: "#09090b",
                border: "none",
                borderRadius: 6,
                padding: "10px 18px",
                fontSize: "0.8125rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Plus size={16} />
              Register New Coach
            </button>
          </div>

          {/* Inline Form to Register / Edit Coach */}
          {isAddingCoach && (
            <div
              style={{
                background: "#18181b",
                border: "1px solid rgba(216, 255, 62, 0.3)",
                borderRadius: 10,
                padding: "28px",
                marginBottom: "28px",
              }}
            >
              <h4 style={{ fontSize: "1.125rem", fontWeight: 600, color: ACCENT, margin: "0 0 20px" }}>
                {editingCoachId ? "Edit Coach Profile" : "Register New Coach"}
              </h4>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#e4e4e7", marginBottom: 6 }}>
                    Coach Name (e.g. VIKAS GOWDA)
                  </label>
                  <input
                    type="text"
                    placeholder="VIKAS GOWDA"
                    value={coachForm.title}
                    onChange={(e) => setCoachForm({ ...coachForm, title: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "#27272a",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: 6,
                      color: "#ffffff",
                      fontSize: "0.875rem",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  <p style={{ fontSize: "0.75rem", color: "#a1a1aa", margin: "4px 0 0" }}>
                    Full name of the coach.
                  </p>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#e4e4e7", marginBottom: 6 }}>
                    Specialty Subtitle
                  </label>
                  <input
                    type="text"
                    placeholder="Powerlifting & Body Recomp"
                    value={coachForm.subtitle}
                    onChange={(e) => setCoachForm({ ...coachForm, subtitle: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "#27272a",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: 6,
                      color: "#ffffff",
                      fontSize: "0.875rem",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  <p style={{ fontSize: "0.75rem", color: "#a1a1aa", margin: "4px 0 0" }}>
                    Main discipline or focus area.
                  </p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#e4e4e7", marginBottom: 6 }}>
                    Experience / Role Badge (e.g. 8+ YEARS EXPERIENCE)
                  </label>
                  <input
                    type="text"
                    placeholder="8+ YEARS EXPERIENCE"
                    value={coachForm.meta}
                    onChange={(e) => setCoachForm({ ...coachForm, meta: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "#27272a",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: 6,
                      color: "#ffffff",
                      fontSize: "0.875rem",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#e4e4e7", marginBottom: 6 }}>
                    Coach Photo (Upload from Device)
                  </label>

                  {/* Hidden Device File Picker Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleImageFile(e.target.files[0]);
                      }
                    }}
                    style={{ display: "none" }}
                  />

                  {/* Drag and Drop Zone */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragActive(true);
                    }}
                    onDragLeave={() => setIsDragActive(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragActive(false);
                      if (e.dataTransfer.files?.[0]) {
                        handleImageFile(e.dataTransfer.files[0]);
                      }
                    }}
                    style={{
                      border: isDragActive
                        ? "2px dashed #D8FF3E"
                        : "2px dashed rgba(255, 255, 255, 0.2)",
                      borderRadius: 8,
                      padding: "14px 18px",
                      background: isDragActive
                        ? "rgba(216, 255, 62, 0.08)"
                        : "#27272a",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.2s ease",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    {coachForm.image ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", justifyContent: "center" }}>
                        <img
                          src={coachForm.image}
                          alt="Coach Preview"
                          style={{
                            width: 56,
                            height: 56,
                            borderRadius: 8,
                            objectFit: "cover",
                            border: "1px solid rgba(216, 255, 62, 0.5)",
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ textAlign: "left" }}>
                          <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: ACCENT, display: "block" }}>
                            Photo Attached
                          </span>
                          <span style={{ fontSize: "0.75rem", color: "#a1a1aa" }}>
                            Drag a new image or click to replace from device
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <UploadCloud size={24} style={{ color: ACCENT }} />
                        <div>
                          <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#ffffff" }}>
                            Drag & drop photo here, or <span style={{ color: ACCENT, textDecoration: "underline" }}>click to upload</span>
                          </span>
                          <p style={{ fontSize: "0.75rem", color: "#a1a1aa", margin: "3px 0 0" }}>
                            Upload PNG, JPG, or WEBP directly from your computer or phone.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#e4e4e7", marginBottom: 6 }}>
                  Skill Tags (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="Strength, HIIT, Nutrition"
                  value={coachForm.tags}
                  onChange={(e) => setCoachForm({ ...coachForm, tags: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: "#27272a",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: 6,
                    color: "#ffffff",
                    fontSize: "0.875rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#e4e4e7", marginBottom: 6 }}>
                  Coach Biography
                </label>
                <textarea
                  rows={3}
                  placeholder="Specialized coaching background..."
                  value={coachForm.desc}
                  onChange={(e) => setCoachForm({ ...coachForm, desc: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: "#27272a",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: 6,
                    color: "#d4d4d8",
                    fontSize: "0.875rem",
                    lineHeight: 1.5,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={handleSaveCoach}
                  style={{
                    background: ACCENT,
                    color: "#09090b",
                    border: "none",
                    borderRadius: 6,
                    padding: "10px 18px",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {editingCoachId ? "Update Profile" : "Confirm & Save Coach"}
                </button>
                <button
                  onClick={() => setIsAddingCoach(false)}
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    color: "#e4e4e7",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: 6,
                    padding: "10px 16px",
                    fontSize: "0.8125rem",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Active Coaches List */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
              gap: "16px",
            }}
          >
            {coachesDraft.map((coach, index) => (
              <div
                key={coach.id}
                style={{
                  background: "#18181b",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: 10,
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <div style={{ display: "flex", gap: 16 }}>
                  <img
                    src={coach.image}
                    alt={coach.title}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 8,
                      objectFit: "cover",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: ACCENT }}>
                        #{index + 1}
                      </span>
                      <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#ffffff", margin: 0 }}>
                        {coach.title}
                      </h4>
                    </div>
                    <p style={{ fontSize: "0.8125rem", color: "#a1a1aa", margin: "3px 0 6px" }}>
                      {coach.subtitle}
                    </p>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {coach.tags.map((t) => (
                        <span
                          key={t}
                          style={{
                            fontSize: "0.6875rem",
                            background: "rgba(255, 255, 255, 0.06)",
                            color: "#d4d4d8",
                            padding: "2px 8px",
                            borderRadius: 4,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                    paddingTop: "12px",
                  }}
                >
                  <span style={{ fontSize: "0.75rem", color: "#71717a" }}>{coach.meta}</span>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => handleOpenEditCoach(coach)}
                      style={{
                        background: "rgba(255, 255, 255, 0.06)",
                        color: "#e4e4e7",
                        border: "none",
                        borderRadius: 6,
                        padding: "6px 12px",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <Edit3 size={13} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteCoach(coach.id, coach.title)}
                      style={{
                        background: "rgba(239, 68, 68, 0.1)",
                        color: "#f87171",
                        border: "1px solid rgba(239, 68, 68, 0.2)",
                        borderRadius: 6,
                        padding: "6px 12px",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <Trash2 size={13} />
                      Resigned
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        )}

        {(activeSection === "all" || activeSection === "blogs") && (
          /* ═══════════════════════════════════════ SECTION 6: BLOGS & FITNESS ARTICLES */
          <section
            ref={blogsRef}
            id="blogs-management"
            style={{
              background: "#121215",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 12,
              padding: "32px",
              marginBottom: "40px",
            }}
          >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "28px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
              paddingBottom: "20px",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <BookOpen size={18} style={{ color: ACCENT }} />
                <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#ffffff", margin: 0 }}>
                  Blogs & Fitness Articles Manager
                </h3>
              </div>
              <p style={{ fontSize: "0.8125rem", color: "#a1a1aa", margin: 0, lineHeight: 1.5 }}>
                Add, edit, or remove fitness blog articles and Q&A guides displayed in the website footer.
              </p>
            </div>

            <button
              onClick={() => {
                if (isAddingBlog) {
                  setIsAddingBlog(false);
                  setEditingBlogId(null);
                } else {
                  setEditingBlogId(null);
                  setBlogForm({
                    id: "",
                    title: "",
                    subtitle: "",
                    category: "GUIDE",
                    author: "Coach Girish",
                    date: "August 2024",
                    content: "",
                  });
                  setIsAddingBlog(true);
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: ACCENT,
                color: "#09090b",
                border: "none",
                borderRadius: 6,
                padding: "10px 18px",
                fontSize: "0.8125rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Plus size={16} />
              {isAddingBlog ? "Cancel" : "Add New Blog Article"}
            </button>
          </div>

          {/* Add / Edit Blog Article Form */}
          {isAddingBlog && (
            <form
              onSubmit={handleSaveBlogForm}
              style={{
                background: "#18181b",
                border: "1px solid rgba(216, 255, 62, 0.3)",
                borderRadius: 10,
                padding: "28px",
                marginBottom: "28px",
              }}
            >
              <h4 style={{ fontSize: "1.125rem", fontWeight: 600, color: ACCENT, margin: "0 0 20px" }}>
                {editingBlogId ? "Edit Blog Article" : "Create New Blog Article"}
              </h4>

              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#e4e4e7", marginBottom: 6 }}>
                    Blog Question / Title (Required)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Best Time to Join a Gym in Kalaburagi"
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "#27272a",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: 6,
                      color: "#ffffff",
                      fontSize: "0.875rem",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  <p style={{ fontSize: "0.75rem", color: "#a1a1aa", margin: "4px 0 0" }}>
                    This question/title appears as the clickable link in the website footer.
                  </p>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#e4e4e7", marginBottom: 6 }}>
                    Category / Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. GUIDE, NUTRITION, BEGINNER"
                    value={blogForm.category}
                    onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "#27272a",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: 6,
                      color: "#ffffff",
                      fontSize: "0.875rem",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#e4e4e7", marginBottom: 6 }}>
                    Author Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Coach Girish"
                    value={blogForm.author}
                    onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "#27272a",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: 6,
                      color: "#ffffff",
                      fontSize: "0.875rem",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#e4e4e7", marginBottom: 6 }}>
                  Subtitle / Short Summary
                </label>
                <input
                  type="text"
                  placeholder="e.g. Morning vs Evening Training & Consistency Secrets"
                  value={blogForm.subtitle || ""}
                  onChange={(e) => setBlogForm({ ...blogForm, subtitle: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: "#27272a",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: 6,
                    color: "#ffffff",
                    fontSize: "0.875rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#e4e4e7", marginBottom: 6 }}>
                  Full Article Content (Required)
                </label>
                <textarea
                  rows={8}
                  required
                  placeholder="Enter the complete blog article text here..."
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "#27272a",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: 6,
                    color: "#ffffff",
                    fontSize: "0.875rem",
                    outline: "none",
                    fontFamily: "inherit",
                    lineHeight: 1.6,
                    boxSizing: "border-box",
                  }}
                />
                <p style={{ fontSize: "0.75rem", color: "#a1a1aa", margin: "4px 0 0" }}>
                  Separate paragraphs using double line breaks.
                </p>
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingBlog(false);
                    setEditingBlogId(null);
                  }}
                  style={{
                    background: "rgba(255, 255, 255, 0.06)",
                    color: "#a1a1aa",
                    border: "none",
                    borderRadius: 6,
                    padding: "10px 18px",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: ACCENT,
                    color: "#09090b",
                    border: "none",
                    borderRadius: 6,
                    padding: "10px 20px",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {editingBlogId ? "Update Blog Article" : "Save & Publish Article"}
                </button>
              </div>
            </form>
          )}

          {/* List of Published Blogs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "16px" }}>
            {blogsDraft.map((blog) => (
              <div
                key={blog.id}
                style={{
                  background: "#18181b",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: 10,
                  padding: "18px 20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        background: "rgba(216, 255, 62, 0.12)",
                        color: ACCENT,
                        padding: "2px 8px",
                        borderRadius: 4,
                        letterSpacing: "0.05em",
                      }}
                    >
                      {blog.category || "GUIDE"}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "#71717a" }}>{blog.date || "August 2024"}</span>
                  </div>

                  <h4 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#ffffff", margin: "0 0 6px", lineHeight: 1.4 }}>
                    {blog.title}
                  </h4>

                  {blog.subtitle && (
                    <p style={{ fontSize: "0.78125rem", color: "#a1a1aa", margin: "0 0 12px", lineHeight: 1.5 }}>
                      {blog.subtitle}
                    </p>
                  )}

                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#71717a",
                      margin: "0 0 16px",
                      lineHeight: 1.5,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {blog.content}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                    paddingTop: 12,
                  }}
                >
                  <span style={{ fontSize: "0.75rem", color: "#a1a1aa" }}>By {blog.author || "Coach Girish"}</span>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => handleOpenEditBlog(blog)}
                      style={{
                        background: "rgba(255, 255, 255, 0.06)",
                        color: "#e4e4e7",
                        border: "none",
                        borderRadius: 6,
                        padding: "6px 12px",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <Edit3 size={13} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteBlog(blog.id, blog.title)}
                      style={{
                        background: "rgba(239, 68, 68, 0.1)",
                        color: "#f87171",
                        border: "1px solid rgba(239, 68, 68, 0.2)",
                        borderRadius: 6,
                        padding: "6px 12px",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        )}

        {(activeSection === "all" || activeSection === "policies") && (
          /* ═══════════════════════════════════════ SECTION 7: LEGAL POLICIES */
          <section
            ref={policiesRef}
            id="policies-management"
            style={{
              background: "#121215",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 12,
              padding: "32px",
              marginBottom: "40px",
            }}
          >
            <div style={{ marginBottom: "28px", borderBottom: "1px solid rgba(255, 255, 255, 0.06)", paddingBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <Scale size={20} color={ACCENT} />
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#ffffff", margin: 0 }}>
                  Legal Policies Manager (Privacy, Terms & Refunds)
                </h3>
              </div>
              <p style={{ fontSize: "0.8125rem", color: "#a1a1aa", margin: 0 }}>
                Edit the official Privacy Policy, Terms & Conditions, and Refund Policy displayed when users click footer legal links.
              </p>
            </div>

            {/* Policy Selector Tabs */}
            <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
              {[
                { id: "privacy", label: "Privacy Policy" },
                { id: "terms", label: "Terms & Conditions" },
                { id: "refunds", label: "Refund Policy" },
              ].map((pTab) => {
                const isActive = activePolicyTab === pTab.id;
                return (
                  <button
                    key={pTab.id}
                    onClick={() => setActivePolicyTab(pTab.id as any)}
                    style={{
                      background: isActive ? ACCENT : "#18181b",
                      color: isActive ? "#09090b" : "#a1a1aa",
                      border: isActive ? "none" : "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: 6,
                      padding: "10px 20px",
                      fontSize: "0.8125rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {pTab.label}
                  </button>
                );
              })}
            </div>

            {/* Active Policy Textarea Editor */}
            <div style={{ background: "#18181b", padding: 24, borderRadius: 10, border: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: ACCENT, marginBottom: 8 }}>
                {activePolicyTab === "privacy" && "Editing Privacy Policy"}
                {activePolicyTab === "terms" && "Editing Terms & Conditions"}
                {activePolicyTab === "refunds" && "Editing Refund & Cancellation Policy"}
              </label>

              <textarea
                rows={16}
                value={
                  activePolicyTab === "privacy"
                    ? policiesDraft.privacyPolicy
                    : activePolicyTab === "terms"
                    ? policiesDraft.termsAndConditions
                    : policiesDraft.refundPolicy
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (activePolicyTab === "privacy") {
                    setPoliciesDraft({ ...policiesDraft, privacyPolicy: val });
                  } else if (activePolicyTab === "terms") {
                    setPoliciesDraft({ ...policiesDraft, termsAndConditions: val });
                  } else {
                    setPoliciesDraft({ ...policiesDraft, refundPolicy: val });
                  }
                }}
                style={{
                  width: "100%",
                  padding: "16px",
                  background: "#27272a",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: 8,
                  color: "#ffffff",
                  fontSize: "0.875rem",
                  lineHeight: 1.7,
                  fontFamily: "monospace",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <p style={{ fontSize: "0.75rem", color: "#a1a1aa", margin: "8px 0 0" }}>
                Markdown headings (# and ##) and bullet points (*) are formatted automatically in the website legal reader modal.
              </p>
            </div>
          </section>
        )}

        {(activeSection === "all" || activeSection === "admins") && (
          /* ═══════════════════════════════════════ SECTION 7: ADMIN USERS */
          <section
            ref={adminsRef}
            id="admin-management"
            style={{
              background: "#121215",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 12,
              padding: "32px",
              marginBottom: "40px",
            }}
          >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "28px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
              paddingBottom: "20px",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <ShieldCheck size={18} style={{ color: ACCENT }} />
                <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#ffffff", margin: 0 }}>
                  5. Admin Access & User Management
                </h3>
              </div>
              <p style={{ fontSize: "0.8125rem", color: "#a1a1aa", margin: 0, lineHeight: 1.5 }}>
                Grant login credentials for co-owners or staff managers to access this admin panel.
              </p>
            </div>

            <button
              onClick={() => setIsAddingAdmin(!isAddingAdmin)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: ACCENT,
                color: "#09090b",
                border: "none",
                borderRadius: 6,
                padding: "10px 18px",
                fontSize: "0.8125rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <UserPlus size={16} />
              {isAddingAdmin ? "Cancel" : "Add Another Admin"}
            </button>
          </div>

          {/* New Admin Registration Form */}
          {isAddingAdmin && (
            <form
              onSubmit={handleCreateNewAdmin}
              style={{
                background: "#18181b",
                border: "1px solid rgba(216, 255, 62, 0.3)",
                borderRadius: 10,
                padding: "28px",
                marginBottom: "28px",
              }}
            >
              <h4 style={{ fontSize: "1.125rem", fontWeight: 600, color: ACCENT, margin: "0 0 20px" }}>
                Create New Admin Account
              </h4>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#e4e4e7", marginBottom: 6 }}>
                    Admin Email ID (Required)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="manager@hercules.com"
                    value={newAdminForm.email}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "#27272a",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: 6,
                      color: "#ffffff",
                      fontSize: "0.875rem",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  <p style={{ fontSize: "0.75rem", color: "#a1a1aa", margin: "4px 0 0" }}>
                    Login email address.
                  </p>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#e4e4e7", marginBottom: 6 }}>
                    Admin Password (Required)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Set secret password"
                    value={newAdminForm.password}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, password: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "#27272a",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: 6,
                      color: "#ffffff",
                      fontSize: "0.875rem",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  <p style={{ fontSize: "0.75rem", color: "#a1a1aa", margin: "4px 0 0" }}>
                    Account password.
                  </p>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#e4e4e7", marginBottom: 6 }}>
                    Role / Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Co-Owner, Gym Manager"
                    value={newAdminForm.role}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, role: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "#27272a",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: 6,
                      color: "#ffffff",
                      fontSize: "0.875rem",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  type="submit"
                  style={{
                    background: ACCENT,
                    color: "#09090b",
                    border: "none",
                    borderRadius: 6,
                    padding: "10px 18px",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Create Admin Account
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingAdmin(false)}
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    color: "#e4e4e7",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: 6,
                    padding: "10px 16px",
                    fontSize: "0.8125rem",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Registered Admin Accounts */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {adminsDraft.map((admin) => {
              const isSuper = admin.email.toLowerCase() === "abcd@gmail.com";
              const isVisible = !!showAdminPass[admin.id];
              return (
                <div
                  key={admin.id}
                  style={{
                    background: "#18181b",
                    border: isSuper
                      ? "1px solid rgba(216, 255, 62, 0.3)"
                      : "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: 8,
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 16,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 6,
                        background: isSuper ? "rgba(216, 255, 62, 0.12)" : "rgba(255, 255, 255, 0.06)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: isSuper ? ACCENT : "#a1a1aa",
                      }}
                    >
                      <ShieldCheck size={20} />
                    </div>

                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#ffffff" }}>
                          {admin.email}
                        </span>
                        {isSuper && (
                          <span
                            style={{
                              fontSize: "0.6875rem",
                              fontWeight: 600,
                              background: ACCENT,
                              color: "#09090b",
                              padding: "2px 8px",
                              borderRadius: 4,
                            }}
                          >
                            Primary Owner
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: "0.75rem", color: "#a1a1aa", margin: "2px 0 0" }}>
                        Role: {admin.role} • Registered: {admin.addedAt}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    {/* Password Field */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        background: "#27272a",
                        padding: "6px 12px",
                        borderRadius: 6,
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <KeyRound size={13} style={{ color: "#71717a" }} />
                      <span style={{ fontSize: "0.8125rem", color: ACCENT, fontWeight: 600 }}>
                        {isVisible ? admin.password : "••••••••"}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleShowPass(admin.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#a1a1aa",
                          cursor: "pointer",
                          padding: 2,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>

                    {!isSuper && (
                      <button
                        onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                        style={{
                          background: "rgba(239, 68, 68, 0.1)",
                          color: "#f87171",
                          border: "1px solid rgba(239, 68, 68, 0.2)",
                          borderRadius: 6,
                          padding: "6px 12px",
                          fontSize: "0.75rem",
                          fontWeight: 500,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <UserX size={14} />
                        Revoke Access
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        )}

      </main>

      {/* Floating Save Button */}
      <div style={{ position: "fixed", bottom: 32, right: 32, zIndex: 1000 }}>
        <button
          onClick={handleSaveAll}
          disabled={!isDirty}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: isDirty ? ACCENT : "rgba(24, 24, 27, 0.95)",
            color: isDirty ? "#09090b" : "#e4e4e7",
            border: isDirty ? "none" : "1px solid rgba(216, 255, 62, 0.4)",
            borderRadius: 30,
            padding: "14px 28px",
            fontSize: "0.875rem",
            fontWeight: 700,
            cursor: isDirty ? "pointer" : "not-allowed",
            boxShadow: isDirty
              ? "0 10px 30px rgba(216, 255, 62, 0.35), 0 4px 12px rgba(0,0,0,0.8)"
              : "0 10px 30px rgba(0,0,0,0.8)",
            transition: "all 0.15s ease",
            opacity: isDirty ? 1 : 0.85,
            backdropFilter: "blur(12px)",
          }}
          onMouseEnter={(e) => {
            if (isDirty) e.currentTarget.style.transform = "scale(1.04)";
          }}
          onMouseLeave={(e) => {
            if (isDirty) e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {isDirty ? <Save size={18} /> : <Check size={18} style={{ color: ACCENT }} />}
          {isDirty ? "Save All Changes" : "All Changes Saved"}
        </button>
      </div>

      {/* ⚡ VIBRANT THEMED CONFIRMATION MODAL */}
      {confirmModal.isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999999,
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            animation: "adminModalFadeIn 0.2s ease-out forwards",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 440,
              background: "#121216",
              border: confirmModal.isDanger
                ? "1px solid rgba(239, 68, 68, 0.45)"
                : "1px solid rgba(216, 255, 62, 0.45)",
              borderRadius: 16,
              padding: "28px",
              boxShadow: confirmModal.isDanger
                ? "0 25px 60px rgba(239, 68, 68, 0.25), 0 0 50px rgba(0, 0, 0, 0.95)"
                : "0 25px 60px rgba(216, 255, 62, 0.2), 0 0 50px rgba(0, 0, 0, 0.95)",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: confirmModal.isDanger
                    ? "rgba(239, 68, 68, 0.15)"
                    : "rgba(216, 255, 62, 0.15)",
                  border: confirmModal.isDanger
                    ? "1px solid rgba(239, 68, 68, 0.4)"
                    : "1px solid rgba(216, 255, 62, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: confirmModal.isDanger ? "#ef4444" : ACCENT,
                  flexShrink: 0,
                }}
              >
                <AlertTriangle size={24} />
              </div>

              <div>
                <h3
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: 800,
                    color: "#ffffff",
                    margin: "0 0 6px",
                    letterSpacing: "-0.01em",
                    fontFamily: '"Inter", sans-serif',
                  }}
                >
                  {confirmModal.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#a1a1aa",
                    margin: 0,
                    lineHeight: 1.5,
                    fontFamily: '"Inter", sans-serif',
                  }}
                >
                  {confirmModal.message}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12, marginTop: 4 }}>
              {confirmModal.cancelText && (
                <button
                  type="button"
                  onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                  style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    color: "#e4e4e7",
                    border: "1px solid rgba(255, 255, 255, 0.14)",
                    borderRadius: 8,
                    padding: "10px 18px",
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {confirmModal.cancelText}
                </button>
              )}

              <button
                type="button"
                onClick={confirmModal.onConfirm}
                style={{
                  background: confirmModal.isDanger ? "#ef4444" : ACCENT,
                  color: confirmModal.isDanger ? "#ffffff" : "#09090b",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 20px",
                  fontSize: "0.8125rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  letterSpacing: "0.02em",
                  boxShadow: confirmModal.isDanger
                    ? "0 4px 16px rgba(239, 68, 68, 0.4)"
                    : "0 4px 16px rgba(216, 255, 62, 0.4)",
                  transition: "all 0.15s ease",
                }}
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
