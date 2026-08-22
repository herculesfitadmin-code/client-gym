import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Phone,
  Menu,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  MapPin,
  MessageCircle,
  Tag as TagIcon,
  ShieldCheck,
  MoreHorizontal,
} from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";
import Lenis from "lenis";
import { ProgramStackedCardsSection } from "./components/ProgramStackedCards";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { CoachesStackedCardsSection } from "./components/CoachesStackedCards";
import { GymAtmosphereSection } from "./components/GymAtmosphereSection";
import { FounderStorySection } from "./components/FounderStorySection";
import { AthleteCertificateCarouselSection } from "./components/AthleteCertificateCarouselSection";
import { AdminAuthModal } from "./components/AdminAuthModal";
import { AdminControlPanel } from "./components/AdminControlPanel";
import { loadSiteData, saveSiteData, fetchCloudSiteData, pushToCloud, recordEnquiryLead, defaultSiteData, AdminSiteData, PricingPlan, BlogPost } from "./adminStore";
import { WebInquiryModal } from "./components/WebInquiryModal";
import { HerculesLogo } from "./components/HerculesLogo";
import { BlogArticleModal } from "./components/BlogArticleModal";
import { PolicyReaderModal } from "./components/PolicyReaderModal";
import { subscribeToFirebaseSiteData } from "../lib/firebase";

import girishBefore from "../../public/transformations/girish_before.png";
import girishAfter from "../../public/transformations/girish_after.png";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const LIME = "#D8FF3E";
const RED = "#FF3E3E";
const CYAN = "#3EFFD8";
const MAGENTA = "#FF3ED8";
const BLUE = "#3E82FF";
const PURPLE = "#A83EFF";

const DF: React.CSSProperties = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Plus Jakarta Sans", "Inter", "Helvetica Neue", sans-serif',
  fontWeight: 800,
  letterSpacing: "-0.02em",
};
const MF: React.CSSProperties = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Plus Jakarta Sans", "Inter", "Helvetica Neue", sans-serif',
  fontWeight: 600,
};
const BF: React.CSSProperties = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Plus Jakarta Sans", "Inter", "Helvetica Neue", sans-serif',
};

const glass: React.CSSProperties = {
  background: "rgba(13,13,13,0.75)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 4,
};
const glassLite: React.CSSProperties = {
  background: "rgba(18,18,18,0.6)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 4,
};

// ─── DATA ──────────────────────────────────────────────────────────────────────
const programs = [
  {
    name: "ELITE STRENGTH",
    duration: "60 MIN",
    difficulty: "ADVANCED",
    tag: "POWER",
    color: LIME,
    desc: "Olympic lifting, powerlifting fundamentals, and progressive overload mastery for serious athletes chasing maximum output.",
  },
  {
    name: "HIIT PROTOCOL",
    duration: "45 MIN",
    difficulty: "INTENSE",
    tag: "BURN",
    color: RED,
    desc: "High-intensity interval training engineered for maximum caloric expenditure, VO₂ max gains, and metabolic conditioning.",
  },
  {
    name: "COMBAT ARTS",
    duration: "75 MIN",
    difficulty: "MODERATE",
    tag: "FIGHT",
    color: CYAN,
    desc: "MMA, boxing fundamentals, and functional combat drills for total-body athleticism, coordination and raw toughness.",
  },
  {
    name: "BODY RECOMP",
    duration: "55 MIN",
    difficulty: "MODERATE",
    tag: "SCULPT",
    color: MAGENTA,
    desc: "Simultaneous fat loss and muscle gain through precision programming, tempo work, and targeted metabolic stress.",
  },
  {
    name: "ENDURANCE",
    duration: "90 MIN",
    difficulty: "GRUELING",
    tag: "GRIND",
    color: LIME,
    desc: "Long-form cardio and lactate threshold training for peak athletic performance, mental fortitude, and stamina.",
  },
  {
    name: "RECOVERY",
    duration: "40 MIN",
    difficulty: "ACTIVE",
    tag: "HEAL",
    color: PURPLE,
    desc: "Structured mobility, PNF stretching, foam rolling, and fascia release protocols to optimise recovery between sessions.",
  },
];

const trainers = [
  {
    name: "ARJUN SHARMA",
    specialty: "Olympic Lifting & Powerlifting",
    experience: "8 YRS",
    tag: "STRENGTH COACH",
    img: "1567013127542-490d757e51fc",
  },
  {
    name: "PRIYA NAIR",
    specialty: "HIIT & Metabolic Conditioning",
    experience: "6 YRS",
    tag: "CONDITIONING",
    img: "1548690312-e3b507d8c110",
  },
  {
    name: "VIKRAM SINGH",
    specialty: "Combat Sports & MMA",
    experience: "10 YRS",
    tag: "COMBAT SPECIALIST",
    img: "1583454110551-21f2fa2afe61",
  },
  {
    name: "MAYA PATEL",
    specialty: "Body Recomposition & Nutrition",
    experience: "7 YRS",
    tag: "RECOMP EXPERT",
    img: "1594381898411-846e7d193883",
  },
];

const plans = [
  {
    name: "ATHLETE",
    price: 2999,
    badge: null as string | null,
    popular: false,
    features: [
      "Access 6AM – 10PM",
      "All Group Classes",
      "Locker Room",
      "Initial Assessment",
      "1 PT Session / Month",
    ],
  },
  {
    name: "ELITE",
    price: 4999,
    badge: "MOST POPULAR",
    popular: true,
    features: [
      "Access 5AM – 11PM",
      "All Group Classes",
      "Premium Locker",
      "Full Body Assessment",
      "4 PT Sessions / Month",
      "Nutrition Consultation",
      "Guest Pass ×2",
    ],
  },
  {
    name: "CHAMPION",
    price: 7999,
    badge: "24/7",
    popular: false,
    features: [
      "24/7 Unrestricted Access",
      "All Group Classes",
      "Private Locker",
      "Weekly Assessment",
      "Unlimited PT Sessions",
      "Custom Diet Planning",
      "Priority Class Booking",
      "₹1000 Merchandise Credit",
    ],
  },
];

const faqs = [
  {
    q: "Which is the best gym in Kalaburagi?",
    a: "Hercules Fitness is one of the best-rated gyms in Kalaburagi. Located on New Jewargi Road above the Ola showroom in State Bank Colony, we offer modern equipment, experienced certified trainers, spacious workout areas, and affordable membership plans starting at just ₹2,000 per month. Whether you are a complete beginner or an experienced lifter, Coach Girish and his team provide personal attention to every member.",
  },
  {
    q: "Do you have personal trainers at Hercules Fitness?",
    a: "Yes. Hercules Fitness has experienced certified trainers led by Coach Girish, who has 19+ years of hands-on coaching experience. Our trainers guide you through proper exercise form, posture correction, and customized workout plans based on your fitness goals — whether it is weight loss, muscle gain, or general fitness.",
  },
  {
    q: "Is Hercules Fitness beginner friendly?",
    a: "Absolutely. Hercules Fitness is very beginner friendly. You do not need any prior gym experience to join. Our trainers teach you how to use every machine safely, correct your exercise form from day one, and create simple workout plans that match your current fitness level. Many of our members started as complete beginners.",
  },
  {
    q: "What are the gym membership plans and prices?",
    a: "Our membership plans are very affordable: 1 Month at ₹2,000, 3 Months at ₹4,000, 6 Months at ₹6,000, and 12 Months at ₹10,000. Members who enquire through our website get a flat 25% discount on all plans. All memberships include full gym floor access, trainer guidance, and locker room access.",
  },
  {
    q: "What are the gym timings at Hercules Fitness Kalaburagi?",
    a: "Hercules Fitness is open Monday to Saturday from 5:00 AM to 10:00 PM, and on Sundays from 6:00 AM to 10:00 AM. You can choose any morning or evening slot based on your convenience.",
  },
  {
    q: "Do you help with weight loss?",
    a: "Yes, we offer dedicated weight loss guidance. Our trainers create customized workout plans combined with simple, practical diet advice using everyday food — no expensive supplements required. Many members have achieved significant fat loss results with our step-by-step approach.",
  },
  {
    q: "Is strength training available at Hercules Fitness?",
    a: "Yes. Strength training is one of our core specialties. We have a fully equipped strength zone with squat racks, benches, dumbbells, barbells, cable machines, and plate-loaded equipment. Coach Girish personally guides members on proper compound lifting techniques including squats, deadlifts, and bench presses.",
  },
  {
    q: "Is parking available at Hercules Fitness?",
    a: "Yes, convenient parking is available near the gym. Hercules Fitness is located on the 2nd floor above the Ola showroom on New Jewargi Road, State Bank Colony, Kalaburagi — an easily accessible location with good connectivity.",
  },
  {
    q: "What equipment does Hercules Fitness have?",
    a: "Hercules Fitness has a wide range of modern gym equipment including cardio machines (treadmills, ellipticals, stationary bikes), a fully equipped strength zone with squat racks, bench presses, cable crossover machines, dumbbell racks, kettlebells, resistance machines, and a functional training area.",
  },
  {
    q: "How can I contact Hercules Fitness Kalaburagi?",
    a: "You can reach Hercules Fitness by calling or WhatsApp at +91 99008 97907. Visit us at: 2nd floor, Sy #71/1A, Plot # 18, New Jewargi Rd, above Ola showroom, State Bank Colony, Kalaburagi, Karnataka 585102. You can also enquire through our website to get a flat 25% discount on membership.",
  },
];

const testimonials = [
  {
    name: "RAHUL DESAI",
    tag: "FAT LOSS",
    result: "−22 kg / 4 months",
    quote:
      "Hercules didn't just change my body. It rewired my identity. The coaches here don't let you quit — they build the version of you that never wants to.",
    avatar: "1500648767791-00dcc994a43e",
  },
  {
    name: "SNEHA KULKARNI",
    tag: "MUSCLE GAIN",
    result: "+14 kg lean mass",
    quote:
      "I've trained at premium gyms across three cities. Nothing compares to the programming here. Every session has surgical intent. The results speak clearly.",
    avatar: "1438761681033-6461ffad8d80",
  },
  {
    name: "AMIT JOSHI",
    tag: "BODY RECOMP",
    result: "24% fat reduced",
    quote:
      "Elite membership was the best investment I've made this year. The nutrition coaching alone restructured my relationship with food. Results hit week three.",
    avatar: "1507003211169-0a1dd7228f2d",
  },
  {
    name: "KAVYA REDDY",
    tag: "ENDURANCE",
    result: "First marathon completed",
    quote:
      "Zero running background to marathon finisher in six months. The Hercules endurance programming is genuinely world-class. I didn't think this was possible.",
    avatar: "1544005313-94ddf0286df2",
  },
];

const facilitySlides = [
  {
    label: "CARDIO DECK",
    sub: "32 Premium Machines",
    img: "1534438327276-14e5300c3a48",
  },
  {
    label: "STRENGTH ZONE",
    sub: "Eleiko Equipment",
    img: "1571019614242-c5c5dee9f50b",
  },
  {
    label: "EXTERIOR",
    sub: "NH-65, Bidar",
    img: "1540497077202-7c8a3999166f",
  },
];

// ─── NOISE SVG ────────────────────────────────────────────────────────────────
const noiseBg =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")";

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function Tag({
  children,
  color = LIME,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <div
      style={{
        ...MF,
        fontSize: 9,
        color,
        border: `1px solid ${color}40`,
        padding: "3px 10px",
        borderRadius: 2,
        display: "inline-block",
        letterSpacing: "0.2em",
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        ...MF,
        fontSize: 10,
        color: LIME,
        letterSpacing: "0.35em",
        marginBottom: "1.25rem",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <span style={{ display: "block", width: 24, height: 1, background: LIME }} />
      {children}
    </div>
  );
}

function MetricCard({
  val,
  label,
  color = "#fff",
}: {
  val: string;
  label: string;
  color?: string;
}) {
  return (
    <div>
      <div style={{ ...DF, fontSize: "clamp(2.2rem, 3.8vw, 3.2rem)", color: color === "#fff" ? "#FFFFFF" : color, fontWeight: 900, lineHeight: 1, textShadow: "0 4px 18px rgba(0,0,0,0.85)" }}>
        {val}
      </div>
      <div style={{ ...MF, fontSize: 10, color: LIME, letterSpacing: "0.18em", marginTop: 6, fontWeight: 800 }}>
        {label}
      </div>
    </div>
  );
}

// ─── ERROR BOUNDARY ───────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error("React ErrorBoundary caught error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ background: "#080808", color: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center", fontFamily: "sans-serif" }}>
          <h2 style={{ fontSize: 24, color: "#D8FF3E", marginBottom: 12 }}>Hercules Fitness Kalaburagi</h2>
          <p style={{ color: "#A3A3A3", marginBottom: 16, maxWidth: 500, lineHeight: 1.6 }}>A rendering issue occurred. Details below:</p>
          <div style={{ background: "#18181C", border: "1px solid rgba(255,62,62,0.4)", color: "#FF6B6B", padding: "12px 18px", borderRadius: 8, fontFamily: "monospace", fontSize: 12, maxWidth: 600, textAlign: "left", marginBottom: 20, wordBreak: "break-word" }}>
            {String(this.state.error?.stack || this.state.error?.message || this.state.error)}
          </div>
          <button
            onClick={() => {
              try { localStorage.removeItem("hercules_admin_site_data_v9"); } catch (e) {}
              window.location.reload();
            }}
            style={{ background: "#D8FF3E", color: "#080808", border: "none", padding: "14px 28px", borderRadius: 8, fontWeight: "bold", cursor: "pointer", fontSize: 14 }}
          >
            Reset Cache & Reload Website
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── LOADING SKELETON ─────────────────────────────────────────────────────────
function LoadingSkeleton() {
  const pulseKeyframes = `
    @keyframes skeletonPulse {
      0%, 100% { opacity: 0.25; }
      50% { opacity: 0.5; }
    }
  `;
  const pulseStyle: React.CSSProperties = {
    animation: "skeletonPulse 1.5s ease-in-out infinite",
    background: "#18181C",
    borderRadius: 8,
  };
  return (
    <div style={{ background: "#080808", color: "#fff", minHeight: "100vh", ...BF }}>
      <style>{pulseKeyframes}</style>
      {/* Nav skeleton */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ width: 140, height: 32, ...pulseStyle }} />
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ width: 60, height: 14, ...pulseStyle }} />
          <div style={{ width: 60, height: 14, ...pulseStyle }} />
          <div style={{ width: 60, height: 14, ...pulseStyle }} />
        </div>
      </div>
      {/* Hero skeleton */}
      <div style={{ padding: "clamp(60px, 12vw, 120px) 24px 60px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ width: "60%", height: 16, marginBottom: 20, ...pulseStyle }} />
        <div style={{ width: "90%", height: 48, marginBottom: 16, ...pulseStyle }} />
        <div style={{ width: "75%", height: 48, marginBottom: 28, ...pulseStyle }} />
        <div style={{ width: "100%", height: 18, marginBottom: 10, ...pulseStyle }} />
        <div style={{ width: "85%", height: 18, marginBottom: 40, ...pulseStyle }} />
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ width: 160, height: 50, ...pulseStyle, borderRadius: 6 }} />
          <div style={{ width: 160, height: 50, ...pulseStyle, borderRadius: 6 }} />
        </div>
      </div>
      {/* Metric cards skeleton */}
      <div style={{ display: "flex", justifyContent: "center", gap: 32, padding: "40px 24px", flexWrap: "wrap" }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ width: 80, height: 36, margin: "0 auto 8px", ...pulseStyle }} />
            <div style={{ width: 100, height: 12, margin: "0 auto", ...pulseStyle }} />
          </div>
        ))}
      </div>
      {/* Section skeleton blocks */}
      {[1, 2].map((i) => (
        <div key={i} style={{ padding: "60px 24px", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ width: 120, height: 12, marginBottom: 20, ...pulseStyle }} />
          <div style={{ width: "50%", height: 32, marginBottom: 16, ...pulseStyle }} />
          <div style={{ width: "100%", height: 200, ...pulseStyle, borderRadius: 12 }} />
        </div>
      ))}
    </div>
  );
}

function MainApp() {
  const [siteData, setSiteData] = useState<AdminSiteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [activeAdminEmail, setActiveAdminEmail] = useState("abcd@gmail.com");
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  // Auto-detect /admin URL route
  useEffect(() => {
    if (
      window.location.pathname === "/admin" ||
      window.location.pathname === "/admin/" ||
      window.location.hash === "#admin"
    ) {
      setIsAdminAuthOpen(true);
    }
  }, []);

  // ⚡ Firebase is the SINGLE SOURCE OF TRUTH — fetch before rendering
  useEffect(() => {
    let resolved = false;

    // Safety timeout: never block the user for more than 3 seconds
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        setSiteData((prev) => prev || loadSiteData());
        setIsLoading(false);
      }
    }, 3000);

    fetchCloudSiteData().then((cloudData) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        if (cloudData) {
          setSiteData(cloudData);
          // Cache to localStorage for faster subsequent loads
          try { localStorage.setItem("hercules_admin_site_data_v9", JSON.stringify(cloudData)); } catch (e) {}
        } else {
          // Firebase empty or unreachable — fall back to localStorage/defaults
          setSiteData(loadSiteData());
        }
        setIsLoading(false);
      }
    }).catch(() => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        setSiteData(loadSiteData());
        setIsLoading(false);
      }
    });

    // Real-time Firestore snapshot listener for instant live updates
    const unsubscribe = subscribeToFirebaseSiteData((cloudData) => {
      if (cloudData) {
        setSiteData(cloudData);
      }
    });

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  const handleSaveSiteData = async (newData: AdminSiteData) => {
    setSiteData(newData);
    return await saveSiteData(newData);
  };

  const handleResetSiteData = () => {
    setSiteData(defaultSiteData);
    saveSiteData(defaultSiteData);
  };

  const [navOpen, setNavOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [offerDismissed, setOfferDismissed] = useState(false);
  const [activePolicyModal, setActivePolicyModal] = useState<"privacy" | "terms" | "refunds" | null>(null);

  // Consultation Form States
  const [consultName, setConsultName] = useState("");
  const [consultPhone, setConsultPhone] = useState("");
  const [consultEmail, setConsultEmail] = useState("");
  const [consultGoal, setConsultGoal] = useState("Goal: Fat Loss");
  const [consultCoach, setConsultCoach] = useState("No Specific Coach (General Guidance)");
  const [consultSubmitted, setConsultSubmitted] = useState(false);

  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultName.trim() || !consultPhone.trim()) return;

    recordEnquiryLead(
      {
        name: consultName,
        phone: consultPhone,
        email: consultEmail,
        goal: consultGoal,
        preferredCoach: consultCoach,
        planName: "Free Consultation",
      },
      siteData,
      setSiteData
    );

    setConsultSubmitted(true);

    const waText = encodeURIComponent(
      `Hello Hercules Fitness Kalaburagi!\n\n` +
      `I would like to book a Free Consultation:\n` +
      `👤 *Name*: ${consultName}\n` +
      `📞 *Phone*: ${consultPhone}\n` +
      (consultEmail ? `📧 *Email*: ${consultEmail}\n` : "") +
      `🎯 *Goal*: ${consultGoal}\n` +
      `🏋️ *Preferred PT Coach*: ${consultCoach}`
    );
    window.open(`https://wa.me/919900897907?text=${waText}`, "_blank");
  };

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setHasScrolled((prev) => {
            const next = window.scrollY > 250;
            return prev !== next ? next : prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [activeProg, setActiveProg] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [facilityIdx, setFacilityIdx] = useState(0);
  const [hoveredTrainer, setHoveredTrainer] = useState<number | null>(null);
  const [inquiryPlan, setInquiryPlan] = useState<PricingPlan | null>(null);
  const [bmi, setBmi] = useState({ weight: "", height: "", result: null as number | null });
  const [cal, setCal] = useState({
    weight: "",
    age: "",
    activity: "moderate",
    result: null as number | null,
  });
  const sliderRef = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;

      const startVideo = () => {
        if (video && video.paused) {
          video.play().catch(() => {});
        }
      };

      startVideo();

      document.addEventListener("click", startVideo, { once: true });
      document.addEventListener("touchstart", startVideo, { once: true });
      window.addEventListener("focus", startVideo);

      return () => {
        document.removeEventListener("click", startVideo);
        document.removeEventListener("touchstart", startVideo);
        window.removeEventListener("focus", startVideo);
      };
    }
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 2.0,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const handleSliderMove = useCallback(
    (clientX: number) => {
      if (!isDragging || !sliderRef.current) return;
      const rect = sliderRef.current.getBoundingClientRect();
      setSliderPos(Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100)));
    },
    [isDragging]
  );

  // Handle-only slider — only the center button initiates drag
  const handleSliderHandleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  const handleSliderHandleTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => handleSliderMove(e.clientX);
    const onTouch = (e: TouchEvent) => { if (isDragging) handleSliderMove(e.touches[0].clientX); };
    const onUp = () => setIsDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, [handleSliderMove]);

  const calcBMI = () => {
    const w = parseFloat(bmi.weight);
    const h = parseFloat(bmi.height) / 100;
    if (w > 0 && h > 0)
      setBmi((s) => ({ ...s, result: parseFloat((w / (h * h)).toFixed(1)) }));
  };

  const calcCal = () => {
    const w = parseFloat(cal.weight);
    const a = parseFloat(cal.age);
    if (w > 0 && a > 0) {
      const bmr = 10 * w + 6.25 * 170 - 5 * a + 5;
      const mult: Record<string, number> = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        veryActive: 1.9,
      };
      setCal((s) => ({ ...s, result: Math.round(bmr * mult[s.activity]) }));
    }
  };

  const bmiCategory = (v: number) =>
    v < 18.5 ? { label: "UNDERWEIGHT", color: CYAN } :
    v < 25   ? { label: "HEALTHY", color: LIME } :
    v < 30   ? { label: "OVERWEIGHT", color: RED } :
               { label: "OBESE", color: PURPLE };

  // ⚡ Show loading skeleton while Firebase data is being fetched
  if (isLoading || !siteData) {
    return <LoadingSkeleton />;
  }

  return (
    <div style={{ background: "#080808", color: "#fff", ...BF, overflowX: "clip" }} role="document">
      {/* ⚡ FLOATING OFFERS POPUP */}
      {siteData.offer.enabled && hasScrolled && !offerDismissed && (
        <div
          className="hf-offer-popup"
          style={{
            position: "fixed",
            bottom: 24,
            left: 24,
            zIndex: 9995,
            background: "#D8FF3E",
            color: "#080808",
            border: "1px solid rgba(0, 0, 0, 0.15)",
            borderRadius: 22,
            padding: "16px 20px",
            maxWidth: 320,
            boxShadow: "0 20px 50px rgba(216, 255, 62, 0.45), 0 10px 30px rgba(0, 0, 0, 0.5)",
            animation: "offerPopupSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span
              style={{
                ...MF,
                fontSize: 10,
                fontWeight: 800,
                color: "#080808",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                opacity: 0.8,
              }}
            >
              🔥 LIMITED TIME OFFER
            </span>

            <button
              onClick={() => setOfferDismissed(true)}
              style={{
                background: "rgba(8, 8, 8, 0.12)",
                border: "none",
                borderRadius: "50%",
                width: 26,
                height: 26,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#080808",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              aria-label="Close offer notification"
            >
              <X size={14} />
            </button>
          </div>

          {/* Huge 25% OFF Hero Accent */}
          <div
            style={{
              ...DF,
              fontSize: "clamp(2.6rem, 7vw, 3.4rem)",
              fontWeight: 900,
              color: "#080808",
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              margin: "4px 0 2px",
            }}
          >
            {siteData.offer.discountPercentage}% OFF
          </div>

          <div
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Plus Jakarta Sans", "Inter", sans-serif',
              fontSize: 12,
              fontWeight: 700,
              color: "#18181B",
              lineHeight: 1.35,
              margin: 0,
            }}
          >
            {siteData.offer.announcementText}
          </div>

          <a
            href="#membership"
            onClick={() => setInquiryOpen(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              background: "#080808",
              color: "#D8FF3E",
              padding: "11px 20px",
              borderRadius: 50,
              fontSize: 12,
              fontWeight: 800,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Plus Jakarta Sans", "Inter", sans-serif',
              letterSpacing: "0.06em",
              textDecoration: "none",
              marginTop: 4,
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)",
              transition: "transform 0.15s ease",
            }}
          >
            FREE TRIAL <ArrowRight size={14} />
          </a>
        </div>
      )}

      {/* NOISE */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: noiseBg,
          zIndex: 9998,
          pointerEvents: "none",
          opacity: 0.55,
        }}
      />

      {/* ═══════════════════════════════════════ NAV */}
      <nav aria-label="Main navigation"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9000,
          background: "rgba(8,8,8,0.88)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            maxWidth: 1440,
            margin: "0 auto",
            padding: "0 2rem",
            height: 70,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <HerculesLogo size={44} />
            <div>
              <div style={{ ...DF, fontSize: 19, letterSpacing: "0.12em", lineHeight: 1 }}>
                HERCULES
              </div>
              <div style={{ ...MF, fontSize: 8, color: "#B3B3B3", letterSpacing: "0.35em" }}>
                FITNESS CENTRE
              </div>
            </div>
          </div>

          {/* Desktop links */}
          <div className="hf-desktop-nav" style={{ display: "flex", gap: "clamp(12px, 1.8vw, 28px)", alignItems: "center", flexShrink: 1 }}>
            {[
              { label: "FOUNDER STORY", href: "#founder-story" },
              { label: "PHILOSOPHY", href: "#philosophy" },
              { label: "PROGRAMS", href: "#programs" },
              { label: "ROSTER", href: "#trainers" },
              { label: "MENTORSHIP", href: "#membership" },
              { label: "FAQ", href: "#faq" },
              { label: "ARTICLES", href: "#blog" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                style={{
                  ...MF,
                  fontSize: 10,
                  color: "#B3B3B3",
                  textDecoration: "none",
                  transition: "color 0.2s",
                  letterSpacing: "0.14em",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = LIME)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#B3B3B3")}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
            <a href="tel:+919900897907" aria-label="Call Hercules Fitness" style={{ color: "#B3B3B3", lineHeight: 0 }}>
              <Phone size={16} />
            </a>
            <button
              className="hf-mobile-btn"
              onClick={() => setNavOpen(!navOpen)}
              aria-label="Toggle navigation menu"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: navOpen ? "rgba(216,255,62,0.15)" : "rgba(255,255,255,0.06)",
                border: `1px solid ${navOpen ? LIME : "rgba(255,255,255,0.18)"}`,
                borderRadius: 50,
                padding: "7px 14px",
                color: navOpen ? LIME : "#FFFFFF",
                cursor: "pointer",
                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                boxShadow: navOpen ? "0 0 20px rgba(216,255,62,0.25)" : "none",
              }}
            >
              {navOpen ? <X size={18} /> : <MoreHorizontal size={18} color={LIME} />}
              <span style={{ ...MF, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em" }}>
                MENU
              </span>
            </button>
          </div>
        </div>

        {/* Floating Curved Mobile/Tablet Menu Overlay */}
        {navOpen && (
          <div
            style={{
              position: "fixed",
              top: 80,
              left: "50%",
              transform: "translateX(-50%)",
              width: "calc(100% - 32px)",
              maxWidth: 480,
              background: "rgba(14, 14, 18, 0.96)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(216, 255, 62, 0.3)",
              borderRadius: 24,
              padding: "1.5rem",
              boxShadow: "0 25px 60px rgba(0,0,0,0.9), 0 0 40px rgba(216, 255, 62, 0.15)",
              zIndex: 9999,
              animation: "menuPopupSlide 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
                paddingBottom: "0.75rem",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div style={{ ...MF, fontSize: 10, color: LIME, letterSpacing: "0.2em", fontWeight: 700 }}>
                NAVIGATION MENU
              </div>
              <button
                onClick={() => setNavOpen(false)}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "none",
                  borderRadius: 50,
                  width: 30,
                  height: 30,
                  color: "#FFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: "1.25rem" }}>
              {[
                { label: "FOUNDER STORY", href: "#head-coach" },
                { label: "PHILOSOPHY", href: "#philosophy" },
                { label: "PROGRAMS", href: "#programs" },
                { label: "CERTIFICATES", href: "#athlete-certificates" },
                { label: "COACH ROSTER", href: "#trainers" },
                { label: "MENTORSHIP", href: "#membership" },
                { label: "FAQ", href: "#faq" },
                { label: "ARTICLES", href: "#blog" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setNavOpen(false)}
                  style={{
                    ...MF,
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: "#E4E4E7",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 50,
                    padding: "12px 14px",
                    textDecoration: "none",
                    letterSpacing: "0.1em",
                    textAlign: "center",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = LIME;
                    el.style.color = "#080808";
                    el.style.borderColor = LIME;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "rgba(255,255,255,0.04)";
                    el.style.color = "#E4E4E7";
                    el.style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1rem", display: "flex", gap: 10 }}>
              <a
                href="tel:+919900897907"
                style={{
                  flex: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#FFF",
                  borderRadius: 50,
                  padding: "12px",
                  textDecoration: "none",
                  ...MF,
                  fontSize: 10.5,
                  fontWeight: 700,
                }}
              >
                <Phone size={14} color={LIME} /> CALL US
              </a>
              <a
                href="#membership"
                onClick={() => setNavOpen(false)}
                style={{
                  flex: 1.5,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  background: LIME,
                  color: "#080808",
                  borderRadius: 50,
                  padding: "12px",
                  textDecoration: "none",
                  ...MF,
                  fontSize: 10.5,
                  fontWeight: 800,
                  boxShadow: "0 4px 16px rgba(216,255,62,0.3)",
                }}
              >
                EARN MENTORSHIP <ArrowRight size={14} />
              </a>
            </div>
          </div>
        )}
      </nav>

      <main>
      {/* ═══════════════════════════════════════ HERO */}
      <section
        aria-label="Hero section — Hercules Fitness Kalaburagi"
        style={{ position: "relative", height: "100vh", minHeight: 680, overflow: "hidden" }}
      >
        <video
          ref={heroVideoRef}
          key={siteData.tagline.heroVideoUrl || "/hergirish_rotated.mp4"}
          src={siteData.tagline.heroVideoUrl || "/hergirish_rotated.mp4"}
          autoPlay
          loop
          muted
          playsInline
          controls={false}
          aria-hidden="true"
          title="Coach Girish training at Hercules Fitness Kalaburagi"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            pointerEvents: "none",
          }}
        />
        {/* Cinematic gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(8,8,8,0.55) 0%, rgba(8,8,8,0.2) 35%, rgba(8,8,8,0.88) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 75% 45%, rgba(216,255,62,0.06) 0%, transparent 55%)",
          }}
        />
        {/* Grain */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: noiseBg,
            opacity: 0.7,
          }}
        />

        {/* Content */}
        <div
          className="hf-hero-content"
          style={{
            position: "relative",
            zIndex: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            maxWidth: 1440,
            margin: "0 auto",
            padding: "0 2rem 5rem",
          }}
        >
          <h1
            style={{
              ...DF,
              fontSize: "clamp(2rem, 4.2vw, 4.2rem)",
              lineHeight: 0.96,
              letterSpacing: "-0.01em",
              textTransform: "uppercase",
              marginBottom: "1rem",
              wordBreak: "break-word",
              overflowWrap: "break-word",
              maxWidth: 820,
            }}
          >
            {siteData.tagline.headlineMain}
            <br />
            <span style={{ color: LIME }}>{siteData.tagline.headlineHighlight}</span>
          </h1>

          <p
            style={{
              color: "#B3B3B3",
              fontSize: "clamp(13px, 1.4vw, 17px)",
              maxWidth: 500,
              lineHeight: 1.75,
              marginBottom: "1.5rem",
            }}
          >
            {siteData.tagline.subtitle}
          </p>

          <div
            className="hf-hero-cta"
            style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: "2rem" }}
          >
            <a
              href="#membership"
              title="Book Free Consultation at Hercules Fitness"
              className="hf-hero-btn-primary"
              style={{
                ...MF,
                fontSize: 11,
                background: LIME,
                color: "#080808",
                padding: "14px 28px",
                borderRadius: 50,
                fontWeight: 900,
                textDecoration: "none",
                letterSpacing: "0.1em",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.2s",
                whiteSpace: "nowrap",
                boxShadow: "0 0 25px rgba(216,255,62,0.4)",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.88")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
            >
              BOOK FREE CONSULTATION <ArrowRight size={14} />
            </a>

            <a
              href="#head-coach"
              title="Our Story: Building the most trusted gym in Kalaburagi"
              style={{
                ...MF,
                fontSize: 10.5,
                color: "#FFFFFF",
                padding: "14px 24px",
                borderRadius: 50,
                fontWeight: 700,
                textDecoration: "none",
                letterSpacing: "0.08em",
                border: "1px solid rgba(255,255,255,0.28)",
                background: "rgba(18, 18, 22, 0.75)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.2s",
                boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = LIME;
                el.style.color = LIME;
                el.style.background = "rgba(18, 18, 22, 0.95)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(255,255,255,0.28)";
                el.style.color = "#FFFFFF";
                el.style.background = "rgba(18, 18, 22, 0.75)";
              }}
            >
              OUR STORY — BUILDING THE MOST TRUSTED GYM IN KALABURAGI <ArrowRight size={13} />
            </a>
          </div>

          {/* Metrics */}
          <div className="hf-hero-metrics" style={{ display: "flex", gap: "clamp(16px,5vw,60px)", flexWrap: "wrap" }}>
            {(siteData.tagline.heroMetrics || defaultSiteData.tagline.heroMetrics!).map(({ value, label }) => (
              <MetricCard key={label} val={value} label={label} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ CURVED WAVE SEPARATOR */}
      <div style={{ position: "relative", marginTop: "-2px", zIndex: 3, lineHeight: 0 }}>
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", display: "block" }}
          preserveAspectRatio="none"
        >
          <path
            d="M0 60 C240 20, 480 95, 720 55 S1200 15, 1440 65 L1440 100 L0 100 Z"
            fill="#080808"
          />
          <path
            d="M0 60 C240 20, 480 95, 720 55 S1200 15, 1440 65"
            stroke="rgba(216,255,62,0.12)"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>

      {/* ═══════════════════════════════════════ FOUNDER STORY & HEAD COACH */}
      <FounderStorySection founderData={siteData.founder} />

      {/* ═══════════════════════════════════════ ATHLETE CERTIFICATES 3D CAROUSEL */}
      <AthleteCertificateCarouselSection />

      {/* ═══════════════════════════════════════ ATHLETIC PHILOSOPHY */}
      <section
        id="philosophy"
        aria-label="Our training philosophy"
        style={{ padding: "8rem 2rem", background: "#080808", position: "relative", overflow: "hidden" }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 20% 60%, rgba(216,255,62,0.035) 0%, transparent 55%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <div style={{ textAlign: "center", margin: "0 auto 3.5rem", maxWidth: 800 }}>
            <h2
              style={{
                ...DF,
                fontSize: "clamp(2.4rem, 5vw, 4.8rem)",
                lineHeight: 0.9,
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              FITNESS THAT WORKS
              <br />
              <span style={{ color: LIME }}>IN REAL LIFE</span>
            </h2>
          </div>

          <div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                {
                  num: "01",
                  label: "STEP-BY-STEP GUIDANCE",
                  desc: "No matter your current fitness level, we teach you how to move correctly and safely from your very first session.",
                },
                {
                  num: "02",
                  label: "HONEST RESULTS",
                  desc: "Simple exercise plans, clear diet advice, and real progress. We don't sell fake shortcuts or social media trends.",
                },
                {
                  num: "03",
                  label: "STRONG DISCIPLINE",
                  desc: "We help you build simple daily habits that stick with you for life—giving you more energy and confidence every single day.",
                },
              ].map(({ num, label, desc }) => (
                <div
                  key={label}
                  style={{
                    ...glass,
                    padding: "1.75rem 2rem",
                    display: "flex",
                    gap: 20,
                    cursor: "default",
                    transition: "border-color 0.3s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.borderColor = "rgba(216,255,62,0.22)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)")
                  }
                >
                  <div
                    style={{
                      ...MF,
                      fontSize: 9,
                      color: "rgba(255,255,255,0.18)",
                      paddingTop: 4,
                      flexShrink: 0,
                    }}
                  >
                    {num}
                  </div>
                  <div>
                    <div
                      style={{ ...DF, fontSize: 22, letterSpacing: "0.08em", marginBottom: 6 }}
                    >
                      {label}
                    </div>
                    <div style={{ color: "#B3B3B3", fontSize: 13, lineHeight: 1.7 }}>{desc}</div>
                  </div>
                  <div
                    style={{
                      marginLeft: "auto",
                      width: 2,
                      background: LIME,
                      opacity: 0.3,
                      borderRadius: 2,
                      flexShrink: 0,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ PROGRAMS STACKED CARDS */}
      <ProgramStackedCardsSection programs={siteData.programs} />

      {/* ═══════════════════════════════════════ GYM ATMOSPHERE & WALKTHROUGH */}
      <GymAtmosphereSection facilitySlides={siteData.facilitySlides} />

      {/* ═══════════════════════════════════════ COACHES (3D STACKED CARDS) */}
      <CoachesStackedCardsSection coaches={siteData.coaches} />

      {/* ═══════════════════════════════════════ TRANSFORMATIONS */}
      <section aria-label="Fitness transformation results" style={{ padding: "8rem 2rem", background: "#080808" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: 800, margin: "0 auto 3.5rem" }}>
            <h2
              style={{
                ...DF,
                fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
                color: "#FFFFFF",
                textTransform: "uppercase",
                lineHeight: 0.92,
                textAlign: "center",
              }}
            >
              THE PROOF IS
              <br />
              <span style={{ color: LIME }}>IN THE CHARACTER</span>
            </h2>
            <div style={{ ...MF, fontSize: 10, color: LIME, letterSpacing: "0.2em", textAlign: "center", marginTop: 10, fontWeight: 700 }}>
              FOUNDER'S OWN PHYSICAL & MENTAL TRANSFORMATION — COACH GIRISH
            </div>
          </div>

          <div className="hf-transform-grid">
            <div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginBottom: "2.5rem",
                }}
              >
                {[
                  { val: "19+ YRS", label: "ATHLETIC EXP", color: LIME },
                  { val: "100%", label: "FORM MASTERY", color: CYAN },
                  { val: "0", label: "GIMMICKS", color: RED },
                  { val: "LIFELONG", label: "VITALITY", color: PURPLE },
                ].map(({ val, label, color }) => (
                  <div key={label} style={{ ...glass, padding: "1.25rem 1.5rem" }}>
                    <div style={{ ...DF, fontSize: 24, color, lineHeight: 1 }}>{val}</div>
                    <div style={{ ...MF, fontSize: 8, color: "#B3B3B3", letterSpacing: "0.18em", marginTop: 6 }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              <blockquote
                style={{
                  borderLeft: `2px solid ${LIME}`,
                  paddingLeft: "1.5rem",
                  color: "#B3B3B3",
                  fontSize: 14,
                  lineHeight: 1.85,
                  fontStyle: "italic",
                }}
              >
                &ldquo;Girish doesn&apos;t just give you a workout plan—he teaches you how to think like an athlete, move with purpose, and respect your body. The transformation is mental as much as physical.&rdquo;
                <footer
                  style={{
                    ...MF,
                    fontSize: 9,
                    color: LIME,
                    marginTop: 10,
                    fontStyle: "normal",
                    letterSpacing: "0.22em",
                  }}
                >
                  — RAHUL DESAI | TRAINED UNDER GIRISH
                </footer>
              </blockquote>
            </div>

            {/* Before/After Slider — drag ONLY via center handle button */}
            <div>
              <div
                ref={sliderRef}
                style={{
                  position: "relative",
                  height: "clamp(320px, 50vw, 520px)",
                  borderRadius: 8,
                  overflow: "hidden",
                  cursor: "default",
                  background: "#111",
                  userSelect: "none",
                  border: "1px solid rgba(255,255,255,0.1)",
                  touchAction: "pan-y",
                }}
                /* NOTE: no onMouseDown / onTouchStart here — only the handle triggers drag */
              >
                {/* After Image — pointer-events: none so clicks don't trigger drag */}
                <img
                  src={siteData.founder?.afterImage || girishAfter}
                  alt="Coach Girish after body transformation at Hercules Fitness Kalaburagi — lean and fit physique"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top center",
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                  draggable={false}
                />

                {/* Before Image — pointer-events: none so clicks don't trigger drag */}
                <img
                  src={siteData.founder?.beforeImage || girishBefore}
                  alt="Coach Girish before body transformation — showing starting physique"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top center",
                    clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
                    WebkitClipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                  draggable={false}
                />

                {/* Labels */}
                <div
                  style={{
                    position: "absolute",
                    top: "1rem",
                    left: "1rem",
                    ...MF,
                    fontSize: 9,
                    color: "#fff",
                  }}
                >
                  BEFORE
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    ...MF,
                    fontSize: 9,
                    color: "#080808",
                    background: LIME,
                    padding: "4px 11px",
                    borderRadius: 2,
                    letterSpacing: "0.2em",
                    fontWeight: 700,
                    pointerEvents: "none",
                  }}
                >
                  AFTER
                </div>

                {/* Divider line */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: `${sliderPos}%`,
                    width: 2,
                    background: LIME,
                    transform: "translateX(-50%)",
                    pointerEvents: "none",
                  }}
                />

                {/* CENTER HANDLE — the ONLY element that initiates drag */}
                <div
                  onMouseDown={handleSliderHandleMouseDown}
                  onTouchStart={handleSliderHandleTouchStart}
                  role="slider"
                  aria-label="Drag to compare before and after"
                  aria-valuenow={Math.round(sliderPos)}
                  aria-valuemin={5}
                  aria-valuemax={95}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: `${sliderPos}%`,
                    transform: "translate(-50%, -50%)",
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: LIME,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 0 20px ${LIME}60, 0 4px 16px rgba(0,0,0,0.6)`,
                    cursor: "ew-resize",
                    zIndex: 10,
                    touchAction: "none",
                    transition: isDragging ? "none" : "left 0.1s ease",
                  }}
                >
                  <ChevronLeft size={14} color="#080808" />
                  <ChevronLeft size={14} color="#080808" />
                  <ChevronRight size={14} color="#080808" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ PRICING */}
      <section id="membership" aria-label="Membership plans and pricing" style={{ padding: "8rem 2rem", background: "#09090A" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "5rem" }}>
            <SectionLabel>FOUNDER MENTORSHIP</SectionLabel>
            <h2
              style={{
                ...DF,
                fontSize: "clamp(2.4rem, 5vw, 4rem)",
                textTransform: "uppercase",
                lineHeight: 0.92,
              }}
            >
              EARN YOUR
              <br />
              <span style={{ color: LIME }}>MENTORSHIP</span>
            </h2>
          </div>

          <div className="hf-pricing-grid" style={{ marginBottom: "3rem" }}>
            {siteData.plans.map((plan) => (
              <div
                key={plan.id || plan.name}
                style={{
                  ...glass,
                  padding: "2.25rem 1.75rem",
                  position: "relative",
                  borderColor: plan.popular ? `${LIME}50` : "rgba(255,255,255,0.08)",
                  background: plan.popular ? "rgba(216,255,62,0.04)" : "rgba(13,13,13,0.7)",
                  transition: "border-color 0.3s, transform 0.2s",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                onMouseEnter={(e) => {
                  if (!plan.popular)
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  if (!plan.popular)
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                <div>
                  {plan.badge && (
                    <div
                      style={{
                        position: "absolute",
                        top: -12,
                        left: "50%",
                        transform: "translateX(-50%)",
                        ...MF,
                        fontSize: 8.5,
                        background: LIME,
                        color: "#080808",
                        padding: "4px 14px",
                        borderRadius: 20,
                        letterSpacing: "0.15em",
                        fontWeight: 800,
                        whiteSpace: "nowrap",
                        boxShadow: "0 4px 15px rgba(216,255,62,0.3)",
                      }}
                    >
                      {plan.badge}
                    </div>
                  )}

                  <div
                    style={{
                      ...MF,
                      fontSize: 10,
                      color: plan.popular ? LIME : "#B3B3B3",
                      letterSpacing: "0.22em",
                      marginBottom: "1.25rem",
                      fontWeight: 700,
                    }}
                  >
                    {plan.name}
                  </div>

                  {/* Pricing Box: Standard Price */}
                  <div style={{ marginBottom: "1.25rem" }}>
                    <div
                      style={{
                        ...DF,
                        fontSize: "clamp(2.4rem, 3vw, 3.2rem)",
                        lineHeight: 1,
                        color: plan.popular ? LIME : "#FFFFFF",
                      }}
                    >
                      ₹{plan.price.toLocaleString()}/-
                    </div>
                    <div
                      style={{
                        ...MF,
                        fontSize: 9,
                        color: plan.popular ? LIME : "#A1A1AA",
                        letterSpacing: "0.15em",
                        marginTop: 4,
                        fontWeight: 700,
                      }}
                    >
                      {plan.period || "STANDARD PLAN"}
                    </div>

                    {/* Website 25% Off Tag */}
                    <div
                      style={{
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Plus Jakarta Sans", "Inter", sans-serif',
                        fontSize: 8.5,
                        fontWeight: 800,
                        color: "#FF3E3E",
                        background: "rgba(255, 62, 62, 0.12)",
                        border: "1px solid rgba(255, 62, 62, 0.25)",
                        padding: "4px 8px",
                        borderRadius: 4,
                        marginTop: 8,
                        display: "inline-block",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {plan.offerTag || "⚡ GET 25% OFF VIA WEBSITE INQUIRY"}
                    </div>
                  </div>

                  <div
                    style={{
                      width: "100%",
                      height: 1,
                      background: "rgba(255,255,255,0.06)",
                      marginBottom: "1.5rem",
                    }}
                  />

                  {/* Features List */}
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      marginBottom: "2rem",
                    }}
                  >
                    {plan.features.map((f, idx) => (
                      <li key={idx} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <div
                          style={{
                            width: 5,
                            height: 5,
                            background: plan.popular ? LIME : "#666",
                            borderRadius: "50%",
                            marginTop: 6,
                            flexShrink: 0,
                          }}
                        />
                        <span style={{ color: "#CCCCCC", fontSize: 12.5, lineHeight: 1.5 }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setInquiryPlan(plan)}
                  style={{
                    width: "100%",
                    textAlign: "center",
                    ...MF,
                    fontSize: 9.5,
                    padding: "13px 8px",
                    borderRadius: 4,
                    fontWeight: 900,
                    letterSpacing: "0.12em",
                    border: "none",
                    cursor: "pointer",
                    background: plan.popular ? LIME : "transparent",
                    color: plan.popular ? "#080808" : LIME,
                    boxShadow: plan.popular ? "0 4px 15px rgba(216,255,62,0.3)" : "none",
                    outline: plan.popular ? "none" : "1px solid rgba(216,255,62,0.4)",
                    transition: "all 0.25s",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.opacity = "0.85";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.opacity = "1";
                  }}
                >
                  GET THIS FOR ₹{(plan.offerPrice !== undefined ? plan.offerPrice : Math.round(plan.price * 0.75)).toLocaleString()}
                </button>
              </div>
            ))}
          </div>

          {/* ── CALCULATORS */}
          <div className="hf-calc-grid">
            {/* BMI */}
            <div style={{ ...glass, padding: "2.25rem" }}>
              <div style={{ ...MF, fontSize: 10, color: LIME, letterSpacing: "0.28em", marginBottom: "1.75rem" }}>
                BMI CALCULATOR
              </div>
              <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                {[
                  { label: "WEIGHT (KG)", key: "weight", ph: "75" },
                  { label: "HEIGHT (CM)", key: "height", ph: "175" },
                ].map(({ label, key, ph }) => (
                  <div key={key} style={{ flex: 1 }}>
                    <label style={{ ...MF, fontSize: 8, color: "#B3B3B3", letterSpacing: "0.22em", display: "block", marginBottom: 7 }}>
                      {label}
                    </label>
                    <input
                      type="number"
                      value={bmi[key as "weight" | "height"]}
                      onChange={(e) =>
                        setBmi((s) => ({ ...s, [key]: e.target.value, result: null }))
                      }
                      placeholder={ph}
                      style={{
                        width: "100%",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#fff",
                        padding: "11px 13px",
                        borderRadius: 2,
                        ...MF,
                        fontSize: 13,
                        outline: "none",
                        boxSizing: "border-box",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = `${LIME}60`)}
                      onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.1)")}
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={calcBMI}
                style={{
                  ...MF,
                  fontSize: 10,
                  background: LIME,
                  color: "#080808",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: 2,
                  cursor: "pointer",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  width: "100%",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
              >
                CALCULATE BMI
              </button>
              {bmi.result !== null && (
                <div style={{ marginTop: "1.75rem", textAlign: "center" }}>
                  <div
                    style={{
                      ...DF,
                      fontSize: 56,
                      color: bmiCategory(bmi.result).color,
                      lineHeight: 1,
                    }}
                  >
                    {bmi.result}
                  </div>
                  <div
                    style={{
                      ...MF,
                      fontSize: 9,
                      color: bmiCategory(bmi.result).color,
                      letterSpacing: "0.25em",
                      marginTop: 6,
                    }}
                  >
                    {bmiCategory(bmi.result).label}
                  </div>
                  <div style={{ color: "#555", fontSize: 12, marginTop: 4 }}>
                    {bmi.result < 18.5
                      ? "Consider a mass-building program."
                      : bmi.result < 25
                      ? "You're in the healthy range."
                      : bmi.result < 30
                      ? "A recomp program would help."
                      : "A structured fat-loss plan is ideal."}
                  </div>
                </div>
              )}
            </div>

            {/* Calorie */}
            <div style={{ ...glass, padding: "2.25rem" }}>
              <div style={{ ...MF, fontSize: 10, color: CYAN, letterSpacing: "0.28em", marginBottom: "1.75rem" }}>
                CALORIE CALCULATOR (TDEE)
              </div>
              <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                {[
                  { label: "WEIGHT (KG)", key: "weight", ph: "75" },
                  { label: "AGE", key: "age", ph: "28" },
                ].map(({ label, key, ph }) => (
                  <div key={key} style={{ flex: 1 }}>
                    <label style={{ ...MF, fontSize: 8, color: "#B3B3B3", letterSpacing: "0.22em", display: "block", marginBottom: 7 }}>
                      {label}
                    </label>
                    <input
                      type="number"
                      value={cal[key as "weight" | "age"]}
                      onChange={(e) =>
                        setCal((s) => ({ ...s, [key]: e.target.value, result: null }))
                      }
                      placeholder={ph}
                      style={{
                        width: "100%",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#fff",
                        padding: "11px 13px",
                        borderRadius: 2,
                        ...MF,
                        fontSize: 13,
                        outline: "none",
                        boxSizing: "border-box",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = `${CYAN}60`)}
                      onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.1)")}
                    />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ ...MF, fontSize: 8, color: "#B3B3B3", letterSpacing: "0.22em", display: "block", marginBottom: 7 }}>
                  ACTIVITY LEVEL
                </label>
                <select
                  value={cal.activity}
                  onChange={(e) => setCal((s) => ({ ...s, activity: e.target.value, result: null }))}
                  style={{
                    width: "100%",
                    background: "#0D0D0D",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#B3B3B3",
                    padding: "11px 13px",
                    borderRadius: 2,
                    ...MF,
                    fontSize: 11,
                    outline: "none",
                    cursor: "pointer",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="sedentary">Sedentary (desk job)</option>
                  <option value="light">Light (1–3×/week)</option>
                  <option value="moderate">Moderate (3–5×/week)</option>
                  <option value="active">Active (6–7×/week)</option>
                  <option value="veryActive">Very Active (athlete)</option>
                </select>
              </div>
              <button
                onClick={calcCal}
                style={{
                  ...MF,
                  fontSize: 10,
                  background: CYAN,
                  color: "#080808",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: 2,
                  cursor: "pointer",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  width: "100%",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
              >
                CALCULATE TDEE
              </button>
              {cal.result !== null && (
                <div style={{ marginTop: "1.75rem", textAlign: "center" }}>
                  <div style={{ ...DF, fontSize: 56, color: CYAN, lineHeight: 1 }}>
                    {cal.result.toLocaleString()}
                  </div>
                  <div style={{ ...MF, fontSize: 9, color: CYAN, letterSpacing: "0.25em", marginTop: 6 }}>
                    CALORIES / DAY
                  </div>
                  <div style={{ color: "#555", fontSize: 12, marginTop: 4 }}>
                    To lose fat, eat {Math.round(cal.result * 0.85).toLocaleString()} kcal. To gain, eat{" "}
                    {Math.round(cal.result * 1.12).toLocaleString()} kcal.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ TESTIMONIALS (GOOGLE REVIEWS) */}
      <TestimonialsSection />

      {/* ═══════════════════════════════════════ FAQ */}
      <section id="faq" aria-label="Frequently asked questions about Hercules Fitness Kalaburagi" style={{ padding: "7rem 2rem", background: "#09090A", overflow: "hidden" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2
              style={{
                ...DF,
                fontSize: "clamp(2.4rem, 5vw, 4rem)",
                textTransform: "uppercase",
                lineHeight: 0.92,
                textAlign: "center",
              }}
            >
              QUESTIONS
              <br />
              <span style={{ color: LIME }}>ANSWERED</span>
            </h2>
            <div style={{ ...MF, fontSize: 10, color: LIME, letterSpacing: "0.15em", marginTop: 10 }}>
              ← SWIPE HORIZONTALLY TO EXPLORE FAQS →
            </div>
          </div>

          {/* Horizontal Scroll Track of 2-Pair Stacked FAQ Cards */}
          <Accordion.Root type="single" collapsible>
            <div
              className="hf-faq-track"
              style={{
                display: "flex",
                overflowX: "auto",
                scrollSnapType: "x mandatory",
                touchAction: "pan-y",
                WebkitOverflowScrolling: "touch",
                gap: "1.5rem",
                paddingBottom: "1.5rem",
                scrollbarWidth: "none",
              }}
            >
              {Array.from({ length: Math.ceil(faqs.length / 2) }).map((_, pairIdx) => {
                const pair = faqs.slice(pairIdx * 2, pairIdx * 2 + 2);
                return (
                  <div
                    key={pairIdx}
                    style={{
                      flex: "0 0 85vw",
                      maxWidth: 450,
                      scrollSnapAlign: "start",
                      background: "#0E0E11",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 20,
                      padding: "1.25rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                      boxShadow: "0 15px 35px rgba(0,0,0,0.6)",
                    }}
                  >
                    {pair.map((faq, itemIdx) => {
                      const globalIdx = pairIdx * 2 + itemIdx;
                      return (
                        <Accordion.Item
                          key={globalIdx}
                          value={`item-${globalIdx}`}
                          style={{
                            border: "1px solid rgba(255,255,255,0.07)",
                            borderRadius: 12,
                            overflow: "hidden",
                            background: "rgba(255,255,255,0.02)",
                          }}
                        >
                          <Accordion.Trigger
                            className="hf-faq-trigger"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                              width: "100%",
                              padding: "1.1rem 1.25rem",
                              background: "none",
                              border: "none",
                              color: "#fff",
                              cursor: "pointer",
                              textAlign: "left",
                            }}
                          >
                            <span style={{ ...MF, fontSize: 9, color: LIME, flexShrink: 0, fontWeight: 700 }}>
                              0{globalIdx + 1}
                            </span>
                            <span style={{ ...DF, fontSize: 16, letterSpacing: "0.03em", flex: 1, lineHeight: 1.15 }}>
                              {faq.q}
                            </span>
                            <ChevronDown size={14} color={LIME} className="hf-faq-chevron" style={{ flexShrink: 0, transition: "transform 0.28s" }} />
                          </Accordion.Trigger>
                          <Accordion.Content style={{ padding: "0 1.25rem 1.25rem 2.8rem" }}>
                            <p style={{ color: "#B3B3B3", fontSize: 13.5, lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
                          </Accordion.Content>
                        </Accordion.Item>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </Accordion.Root>
        </div>
      </section>

      {/* ═══════════════════════════════════════ FOOTER */}
      <footer
        id="footer"
        style={{
          background: "#050505",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "6rem 2rem 3rem",
        }}
      >
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          {/* ⚡ PERMANENT FOOTER NEON OFFER BANNER CARD */}
          {siteData.offer.enabled && (
            <div
              className="hf-footer-offer-banner"
              style={{
                background: "#D8FF3E",
                color: "#080808",
                borderRadius: 28,
                padding: "3rem 3.5rem",
                marginBottom: "4rem",
                boxShadow: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 24,
              }}
            >
              <div style={{ maxWidth: 750 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span
                    style={{
                      ...MF,
                      fontSize: 11,
                      fontWeight: 800,
                      background: "#080808",
                      color: "#D8FF3E",
                      padding: "5px 12px",
                      borderRadius: 50,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    🔥 {siteData.offer.badgeText || "LIMITED TIME OFFER"}
                  </span>
                </div>

                {/* MASSIVE 25% OFF HERO TYPOGRAPHY */}
                <div
                  style={{
                    ...DF,
                    fontSize: "clamp(3.8rem, 8.5vw, 6.5rem)",
                    fontWeight: 900,
                    lineHeight: 0.9,
                    letterSpacing: "-0.04em",
                    color: "#080808",
                    margin: "8px 0 12px",
                    textTransform: "uppercase",
                  }}
                >
                  {siteData.offer.discountPercentage}% OFF
                </div>

                <h3
                  style={{
                    ...DF,
                    fontSize: "clamp(1.25rem, 2.5vw, 1.85rem)",
                    color: "#080808",
                    lineHeight: 1.2,
                    letterSpacing: "-0.02em",
                    margin: "0 0 8px",
                    textTransform: "uppercase",
                    fontWeight: 800,
                  }}
                >
                  {siteData.offer.announcementText}
                </h3>
                <p style={{ color: "#18181B", fontSize: 14, fontWeight: 600, margin: 0, lineHeight: 1.5, opacity: 0.9 }}>
                  Limited time promotional membership rate available at Hercules Fitness, Kalaburagi.
                </p>
              </div>

              <a
                href="#membership"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  background: "#080808",
                  color: "#D8FF3E",
                  padding: "16px 36px",
                  borderRadius: 50,
                  fontSize: 14,
                  fontWeight: 800,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Plus Jakarta Sans", "Inter", sans-serif',
                  letterSpacing: "0.08em",
                  textDecoration: "none",
                  boxShadow: "none",
                  transition: "transform 0.2s ease, background 0.2s ease",
                  flexShrink: 0,
                }}
              >
                CLAIM DISCOUNT OFFER <ArrowRight size={16} />
              </a>
            </div>
          )}

          <div className="hf-footer-grid" style={{ marginBottom: "4rem" }}>
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: "2rem" }}>
                <HerculesLogo size={52} />
                <div>
                  <div style={{ ...DF, fontSize: 22, letterSpacing: "0.12em" }}>HERCULES</div>
                  <div style={{ ...MF, fontSize: 9, color: "#B3B3B3", letterSpacing: "0.35em" }}>
                    FITNESS CENTRE
                  </div>
                </div>
              </div>
              <p style={{ color: "#B3B3B3", fontSize: 13, lineHeight: 1.8, marginBottom: "1.75rem" }}>
                Professional-grade training infrastructure on New Jewargi Road,
                in the heart of Kalaburagi, Karnataka.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <MapPin size={14} color={LIME} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ color: "#B3B3B3", fontSize: 13 }}>
                    2nd Floor, New Jewargi Rd, above Ola Showroom, State Bank Colony, Kalaburagi, Karnataka 585102
                  </span>
                </div>
                <a
                  href="tel:+919900897907"
                  style={{ display: "flex", gap: 10, alignItems: "center", color: "#B3B3B3", textDecoration: "none", fontSize: 13, transition: "color 0.2s" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = LIME)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#B3B3B3")}
                >
                  <Phone size={13} color={LIME} /> +91 99008 97907
                </a>
                <a
                  href="https://wa.me/919900897907"
                  style={{ display: "flex", gap: 10, alignItems: "center", color: "#B3B3B3", textDecoration: "none", fontSize: 13, transition: "color 0.2s" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#25D366")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#B3B3B3")}
                >
                  <MessageCircle size={13} color="#25D366" /> WhatsApp Us
                </a>
              </div>
            </div>

            {/* Map */}
            <div>
              <div style={{ ...MF, fontSize: 10, color: LIME, letterSpacing: "0.28em", marginBottom: "1.5rem" }}>
                FIND US
              </div>
              <div
                style={{
                  height: 260,
                  borderRadius: 6,
                  overflow: "hidden",
                  border: "1px solid rgba(216,255,62,0.25)",
                  background: "#0D0D0D",
                  position: "relative",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
                }}
              >
                {/* Google Maps Interactive Iframe */}
                <iframe
                  title="Hercules Fitness Centre Location"
                  src="https://maps.google.com/maps?q=17.3104365,76.8155937&z=17&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) contrast(1.2)" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                {/* Map Overlay Header */}
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    right: 10,
                    background: "rgba(10, 10, 12, 0.88)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    padding: "8px 12px",
                    borderRadius: 4,
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <MapPin size={14} color={LIME} />
                    <span style={{ ...MF, fontSize: 9, color: "#FFF", letterSpacing: "0.1em" }}>
                      HERCULES FITNESS — KALABURAGI
                    </span>
                  </div>

                  <a
                    href="https://maps.app.goo.gl/jMQTnRzLJPogrDKWA"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      ...MF,
                      fontSize: 8,
                      color: "#080808",
                      background: LIME,
                      padding: "4px 10px",
                      borderRadius: 2,
                      textDecoration: "none",
                      letterSpacing: "0.15em",
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                    }}
                  >
                    DIRECTIONS ↗
                  </a>
                </div>
              </div>
            </div>

            {/* Consultation form */}
            <div>
              <div style={{ ...MF, fontSize: 10, color: LIME, letterSpacing: "0.28em", marginBottom: "1.5rem" }}>
                FREE CONSULTATION
              </div>
              <form onSubmit={handleConsultationSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input
                  type="text"
                  placeholder="Full Name *"
                  required
                  value={consultName}
                  onChange={(e) => setConsultName(e.target.value)}
                  style={{
                    background: "rgba(255,255,255,0.035)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "#fff",
                    padding: "12px 14px",
                    borderRadius: 2,
                    ...MF,
                    fontSize: 11,
                    outline: "none",
                    transition: "border-color 0.2s",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = `${LIME}45`)}
                  onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.07)")}
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  required
                  value={consultPhone}
                  onChange={(e) => setConsultPhone(e.target.value)}
                  style={{
                    background: "rgba(255,255,255,0.035)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "#fff",
                    padding: "12px 14px",
                    borderRadius: 2,
                    ...MF,
                    fontSize: 11,
                    outline: "none",
                    transition: "border-color 0.2s",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = `${LIME}45`)}
                  onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.07)")}
                />
                <input
                  type="email"
                  placeholder="Email Address (Optional)"
                  value={consultEmail}
                  onChange={(e) => setConsultEmail(e.target.value)}
                  style={{
                    background: "rgba(255,255,255,0.035)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "#fff",
                    padding: "12px 14px",
                    borderRadius: 2,
                    ...MF,
                    fontSize: 11,
                    outline: "none",
                    transition: "border-color 0.2s",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = `${LIME}45`)}
                  onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.07)")}
                />
                <select
                  value={consultGoal}
                  onChange={(e) => setConsultGoal(e.target.value)}
                  style={{
                    background: "#0D0D0D",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "#B3B3B3",
                    padding: "12px 14px",
                    borderRadius: 2,
                    ...MF,
                    fontSize: 11,
                    outline: "none",
                    cursor: "pointer",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="Goal: Fat Loss">Goal: Fat Loss</option>
                  <option value="Goal: Muscle Gain">Goal: Muscle Gain</option>
                  <option value="Goal: Body Recomposition">Goal: Body Recomposition</option>
                  <option value="Goal: Endurance Training">Goal: Endurance Training</option>
                  <option value="Goal: Combat Sports">Goal: Combat Sports</option>
                  <option value="Goal: General Fitness">Goal: General Fitness</option>
                </select>



                <button
                  type="submit"
                  style={{
                    ...MF,
                    fontSize: 10,
                    background: LIME,
                    color: "#080808",
                    border: "none",
                    padding: "14px",
                    borderRadius: 2,
                    cursor: "pointer",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    marginTop: 2,
                    transition: "opacity 0.2s",
                    width: "100%",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                >
                  {consultSubmitted ? "✓ ENQUIRY LOGGED! (OPENING WHATSAPP)" : "BOOK FREE CONSULTATION"}
                </button>
              </form>
            </div>
          </div>

          {/* ⚡ SEO-READY BLOG & FITNESS GUIDES INTERNAL LINKING */}
          <div
            id="blog"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.05)",
              paddingTop: "2.5rem",
              marginBottom: "3rem",
            }}
          >
            <div style={{ ...MF, fontSize: 10, color: LIME, letterSpacing: "0.28em", marginBottom: "1.25rem" }}>
              FITNESS GUIDES & LOCAL ARTICLES — KALABURAGI
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "12px 24px",
              }}
            >
              {(siteData.blogs || defaultSiteData.blogs).map((blog) => (
                <button
                  key={blog.id}
                  onClick={() => setSelectedBlog(blog)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    textAlign: "left",
                    color: "#A1A1AA",
                    fontSize: 13,
                    fontFamily: '"DM Sans", sans-serif',
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    transition: "color 0.2s",
                    lineHeight: 1.5,
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = LIME)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#A1A1AA")}
                >
                  <span style={{ color: LIME, fontSize: 10 }}>›</span> {blog.title}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="hf-footer-bottom"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.05)",
              paddingTop: "2rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ ...MF, fontSize: 8, color: "#444", letterSpacing: "0.22em" }}>
              © 2024 HERCULES FITNESS. ALL RIGHTS RESERVED. KALABURAGI, KARNATAKA.
            </div>
            <div className="hf-footer-bottom-links" style={{ display: "flex", gap: 24, alignItems: "center" }}>
              <button
                onClick={() => setActivePolicyModal("privacy")}
                style={{
                  ...MF,
                  fontSize: 10,
                  color: "#A1A1AA",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  letterSpacing: "0.15em",
                  padding: "4px 8px",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = LIME)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#A1A1AA")}
              >
                PRIVACY POLICY
              </button>
              <button
                onClick={() => setActivePolicyModal("terms")}
                style={{
                  ...MF,
                  fontSize: 10,
                  color: "#A1A1AA",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  letterSpacing: "0.15em",
                  padding: "4px 8px",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = LIME)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#A1A1AA")}
              >
                TERMS
              </button>
              <button
                onClick={() => setActivePolicyModal("refunds")}
                style={{
                  ...MF,
                  fontSize: 10,
                  color: "#A1A1AA",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  letterSpacing: "0.15em",
                  padding: "4px 8px",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = LIME)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#A1A1AA")}
              >
                REFUNDS
              </button>
              <button
                onClick={() => setIsAdminAuthOpen(true)}
                style={{
                  ...MF,
                  fontSize: 8,
                  color: LIME,
                  background: "rgba(216, 255, 62, 0.08)",
                  border: "1px solid rgba(216, 255, 62, 0.25)",
                  padding: "4px 10px",
                  borderRadius: 2,
                  letterSpacing: "0.2em",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = LIME;
                  (e.currentTarget as HTMLElement).style.color = "#080808";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(216, 255, 62, 0.08)";
                  (e.currentTarget as HTMLElement).style.color = LIME;
                }}
              >
                <ShieldCheck size={10} />
                ADMIN
              </button>
            </div>
          </div>
        </div>
      </footer>
      </main>

      {/* ─── ADMIN MODALS ─── */}
      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        siteData={siteData}
        onSuccess={(authenticatedEmail) => {
          setActiveAdminEmail(authenticatedEmail);
          setIsAdminAuthOpen(false);
          setIsAdminPanelOpen(true);
        }}
      />

      <AdminControlPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        siteData={siteData}
        currentUserEmail={activeAdminEmail}
        onSaveData={handleSaveSiteData}
        onResetData={handleResetSiteData}
        onLogout={() => setIsAdminPanelOpen(false)}
      />

      <WebInquiryModal
        isOpen={!!inquiryPlan}
        onClose={() => setInquiryPlan(null)}
        selectedPlan={inquiryPlan}
        siteData={siteData}
        onUpdateSiteData={setSiteData}
      />

      <BlogArticleModal
        isOpen={!!selectedBlog}
        onClose={() => setSelectedBlog(null)}
        blog={selectedBlog}
      />

      <PolicyReaderModal
        isOpen={!!activePolicyModal}
        onClose={() => setActivePolicyModal(null)}
        policyType={activePolicyModal}
        policies={siteData.policies || defaultSiteData.policies}
      />

      {/* ─── GLOBAL STYLES ─────────────────────────────────────────── */}
      <style>{`
        html.lenis, html.lenis body { height: auto; }
        .lenis.lenis-smooth { scroll-behavior: auto !important; }
        .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
        .lenis.lenis-stopped { overflow: hidden; }
        .lenis.lenis-smooth iframe { pointer-events: none; }

        * { scrollbar-width: none; box-sizing: border-box; }
        *::-webkit-scrollbar { display: none; }
        img { max-width: 100%; }

        /* === GRID SYSTEMS === */
        .hf-stacked-card-grid {
          display: grid;
          grid-template-columns: 1fr 0.85fr;
          gap: 2.5rem;
          align-items: center;
          padding: 2.5rem;
          min-height: 440px;
        }
        .hf-stacked-card-content { display: flex; flex-direction: column; justify-content: center; }
        .hf-stacked-card-media { height: 100%; display: flex; align-items: center; }

        .hf-testimonials-split {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 3.5rem;
          align-items: center;
        }
        .hf-review-card-item:hover {
          border-color: rgba(216, 255, 62, 0.3) !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.5);
        }
        .hf-desktop-nav { display: none; }
        .hf-philo-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6rem;
          align-items: center;
        }
        .hf-programs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start; }
        .hf-facility-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
        .hf-trainers-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .hf-transform-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; }
        .hf-pricing-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .hf-calc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .hf-testi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .hf-footer-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 4rem; }

        @keyframes menuPopupSlide {
          from { opacity: 0; transform: translate(-50%, -10px) scale(0.96); }
          to { opacity: 1; transform: translate(-50%, 0) scale(1); }
        }

        /* === TABLET 1024px === */
        @media (max-width: 1024px) {
          .hf-testimonials-split { grid-template-columns: 1fr !important; gap: 3rem !important; }
        }

        /* === DESKTOP NAV BREAKPOINT (Only show full bar on wide screens >= 1180px) === */
        @media (min-width: 1180px) {
          .hf-desktop-nav { display: flex !important; }
          .hf-mobile-btn { display: none !important; }
        }
        @media (max-width: 1179px) {
          .hf-desktop-nav { display: none !important; }
          .hf-mobile-btn { display: inline-flex !important; }
        }

        /* === TABLET 1100px === */
        @media (max-width: 1100px) {
          .hf-philo-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .hf-programs-grid { grid-template-columns: 1fr !important; }
          .hf-facility-grid { grid-template-columns: 1fr !important; }
          .hf-trainers-grid { grid-template-columns: repeat(2,1fr) !important; }
          .hf-transform-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .hf-calc-grid { grid-template-columns: 1fr !important; }
          .hf-testi-grid { grid-template-columns: 1fr !important; }
          .hf-footer-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .hf-pricing-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .hf-stacked-card-grid { grid-template-columns: 1fr !important; gap: 2rem !important; padding: 1.5rem !important; }
          .hf-stacked-card-media { height: 280px !important; min-height: 280px !important; }
        }

        /* === MOBILE 640px === */
        @media (max-width: 640px) {
          .hf-pricing-grid { grid-template-columns: 1fr !important; }
          .hf-marquee-columns { grid-template-columns: 1fr !important; }
          .hf-marquee-box { height: 480px !important; }
          .hf-hero-content { padding: 0 1rem 3rem !important; }
          .hf-hero-cta { flex-direction: column !important; gap: 10px !important; }
          .hf-hero-btn-primary { width: 100% !important; justify-content: center !important; }
          .hf-hero-metrics { gap: 18px !important; flex-wrap: wrap !important; }
        }

        /* === MOBILE 480px === */
        @media (max-width: 480px) {
          section[aria-label], footer, section {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          .hf-footer-grid { gap: 2rem !important; }
          .hf-pricing-grid { grid-template-columns: 1fr !important; }
          .hf-trainers-grid { grid-template-columns: 1fr !important; }
          .hf-transform-grid { gap: 2rem !important; }
        }

        /* === SMALL MOBILE 360px === */
        @media (max-width: 360px) {
          .hf-hero-content { padding: 0 0.75rem 2rem !important; }
        }

        /* === OFFER POPUP MOBILE FIX === */
        @media (max-width: 480px) {
          .hf-offer-popup {
            bottom: 12px !important;
            right: 12px !important;
            left: 12px !important;
            max-width: none !important;
          }
          .hf-footer-offer-banner {
            flex-direction: column !important;
            padding: 1.5rem !important;
          }
          .hf-footer-bottom {
            flex-direction: column !important;
            gap: 12px !important;
            align-items: flex-start !important;
          }
          .hf-footer-bottom-links {
            flex-wrap: wrap !important;
            gap: 12px !important;
          }
        }

        /* === FAQ === */
        .hf-faq-trigger:hover { background: rgba(255,255,255,0.03) !important; }
        .hf-faq-track::-webkit-scrollbar { display: none; }
        [data-state="open"] .hf-faq-chevron { transform: rotate(180deg); }

        /* === STACKED CARD MOBILE === */
        @media (max-width: 560px) {
          .hf-trainers-grid { grid-template-columns: 1fr !important; }
          .hf-stacked-card-grid { padding: 1rem !important; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes offerPopupSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}

// ─── TESTIMONIAL CARD ────────────────────────────────────────────────────────
function TestiCard({
  t,
}: {
  t: { name: string; tag: string; result: string; quote: string; avatar: string };
}) {
  return (
    <div
      style={{
        background: "rgba(13,13,13,0.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 4,
        padding: "2rem",
        transition: "border-color 0.3s",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.borderColor = "rgba(216,255,62,0.18)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)")
      }
    >
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", alignItems: "center" }}>
        <img
          src={`https://images.unsplash.com/photo-${t.avatar}?w=80&h=80&fit=crop&auto=format`}
          alt={t.name}
          style={{
            width: 46,
            height: 46,
            borderRadius: "50%",
            objectFit: "cover",
            border: `1px solid rgba(216,255,62,0.35)`,
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: '"Big Shoulders Display", Impact, sans-serif',
              fontWeight: 900,
              fontSize: 15,
              letterSpacing: "0.06em",
              lineHeight: 1.2,
            }}
          >
            {t.name}
          </div>
          <div
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Plus Jakarta Sans", "Inter", sans-serif',
              fontSize: 8,
              color: "#D8FF3E",
              letterSpacing: "0.22em",
              marginTop: 3,
            }}
          >
            {t.tag}
          </div>
        </div>
        <div
          style={{
            fontFamily: '"Big Shoulders Display", Impact, sans-serif',
            fontWeight: 900,
            fontSize: 13,
            color: "#D8FF3E",
            textAlign: "right",
            flexShrink: 0,
          }}
        >
          {t.result}
        </div>
      </div>
      <p
        style={{
          color: "#B3B3B3",
          fontSize: 14,
          lineHeight: 1.85,
          fontStyle: "italic",
        }}
      >
        &ldquo;{t.quote}&rdquo;
      </p>
    </div>
  );
}
