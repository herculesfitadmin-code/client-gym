import { useState, useRef, useEffect, useCallback } from "react";
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
} from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";
import Lenis from "lenis";
import { ProgramStackedCardsSection } from "./components/ProgramStackedCards";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { CoachesStackedCardsSection } from "./components/CoachesStackedCards";
import { GymAtmosphereSection } from "./components/GymAtmosphereSection";

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
  fontFamily: '"Big Shoulders Display", Impact, sans-serif',
  fontWeight: 900,
};
const MF: React.CSSProperties = {
  fontFamily: '"JetBrains Mono", monospace',
  letterSpacing: "0.15em",
};
const BF: React.CSSProperties = { fontFamily: '"DM Sans", sans-serif' };

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
    color: BLUE,
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
    q: "What are your operating hours?",
    a: "Champion members enjoy 24/7 unrestricted access. Athlete members have access from 6AM to 10PM, and Elite members from 5AM to 11PM — seven days a week, 365 days a year including all public holidays.",
  },
  {
    q: "Do you offer trial sessions?",
    a: "Yes. We offer a complimentary one-day trial pass for prospective members. Walk in with a valid government-issued ID, or book your slot via WhatsApp to ensure floor space is ready for you.",
  },
  {
    q: "What equipment brands do you carry?",
    a: "We exclusively use Eleiko barbells and competition plates in our strength zone, and Panatta resistance machines on our training floor — the same equipment used in professional and international competitions worldwide.",
  },
  {
    q: "Are personal training sessions included in my membership?",
    a: "Elite memberships include 4 PT sessions per month. Champion memberships include unlimited personal training. Athlete members can purchase add-on PT sessions at ₹800 per session at any time.",
  },
  {
    q: "Do you provide nutrition guidance?",
    a: "All Elite and Champion members receive dedicated nutrition consultations. Our coaches are certified in sports nutrition and provide personalized macronutrient protocols aligned to your transformation goals and training schedule.",
  },
  {
    q: "How large is the facility?",
    a: "Hercules FITNESS spans 12,000 square feet across 6 dedicated training systems: Olympic lifting platform, powerlifting rack room, HIIT floor, combat zone, cardio deck, and active recovery suite.",
  },
  {
    q: "Can I pause or freeze my membership?",
    a: "Yes. All memberships can be frozen for up to 30 consecutive days per year at no additional charge. Champion memberships allow up to 60 days of annual freeze, which can be split across multiple intervals as needed.",
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
      <div style={{ ...DF, fontSize: "clamp(1.8rem, 3vw, 2.5rem)", color, lineHeight: 1 }}>
        {val}
      </div>
      <div style={{ ...MF, fontSize: 9, color: "#B3B3B3", letterSpacing: "0.2em", marginTop: 5 }}>
        {label}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function App() {
  const [navOpen, setNavOpen] = useState(false);
  const [activeProg, setActiveProg] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [facilityIdx, setFacilityIdx] = useState(0);
  const [hoveredTrainer, setHoveredTrainer] = useState<number | null>(null);
  const [bmi, setBmi] = useState({ weight: "", height: "", result: null as number | null });
  const [cal, setCal] = useState({
    weight: "",
    age: "",
    activity: "moderate",
    result: null as number | null,
  });
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
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

  useEffect(() => {
    const onMove = (e: MouseEvent) => handleSliderMove(e.clientX);
    const onTouch = (e: TouchEvent) => handleSliderMove(e.touches[0].clientX);
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
    v < 18.5 ? { label: "UNDERWEIGHT", color: BLUE } :
    v < 25   ? { label: "HEALTHY", color: LIME } :
    v < 30   ? { label: "OVERWEIGHT", color: RED } :
               { label: "OBESE", color: PURPLE };

  return (
    <div style={{ background: "#080808", color: "#fff", ...BF, overflowX: "clip" }}>
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
      <nav
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
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div
              style={{
                width: 34,
                height: 34,
                background: LIME,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span style={{ ...DF, color: "#080808", fontSize: 19, lineHeight: 1 }}>H</span>
            </div>
            <div>
              <div style={{ ...DF, fontSize: 18, letterSpacing: "0.12em", lineHeight: 1 }}>
                HERCULES
              </div>
              <div style={{ ...MF, fontSize: 8, color: "#B3B3B3", letterSpacing: "0.35em" }}>
                FITNESS
              </div>
            </div>
          </div>

          {/* Desktop links */}
          <div className="hf-desktop-nav" style={{ display: "flex", gap: 36, alignItems: "center" }}>
            {[
              { label: "PROGRAMS", href: "#programs" },
              { label: "THE ARENA", href: "#arena" },
              { label: "TRAINERS", href: "#trainers" },
              { label: "MEMBERSHIP", href: "#membership" },
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
                  letterSpacing: "0.2em",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = LIME)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#B3B3B3")}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <a href="tel:+918000000000" style={{ color: "#B3B3B3", lineHeight: 0 }}>
              <Phone size={16} />
            </a>
            <a
              href="#membership"
              style={{
                ...MF,
                fontSize: 10,
                color: "#080808",
                background: LIME,
                padding: "9px 20px",
                borderRadius: 2,
                fontWeight: 700,
                textDecoration: "none",
                letterSpacing: "0.15em",
                transition: "opacity 0.2s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
            >
              JOIN NOW
            </a>
            <button
              className="hf-mobile-btn"
              onClick={() => setNavOpen(!navOpen)}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                lineHeight: 0,
                padding: 0,
              }}
            >
              {navOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {navOpen && (
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.05)",
              padding: "1rem 2rem 1.5rem",
              background: "rgba(8,8,8,0.95)",
            }}
          >
            {[
              { label: "PROGRAMS", href: "#programs" },
              { label: "THE ARENA", href: "#arena" },
              { label: "TRAINERS", href: "#trainers" },
              { label: "MEMBERSHIP", href: "#membership" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setNavOpen(false)}
                style={{
                  display: "block",
                  ...MF,
                  fontSize: 12,
                  color: "#B3B3B3",
                  padding: "13px 0",
                  textDecoration: "none",
                  letterSpacing: "0.22em",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* ═══════════════════════════════════════ HERO */}
      <section
        style={{ position: "relative", height: "100vh", minHeight: 680, overflow: "hidden" }}
      >
        <video
          src="/hergirish_rotated.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
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
          <SectionLabel>BIDAR, KARNATAKA — EST. 2019</SectionLabel>

          <h1
            style={{
              ...DF,
              fontSize: "clamp(3.2rem, 8.5vw, 8.5rem)",
              lineHeight: 0.88,
              letterSpacing: "-0.01em",
              textTransform: "uppercase",
              marginBottom: "1.5rem",
            }}
          >
            WHERE CHAMPIONS
            <br />
            <span style={{ color: LIME }}>ARE FORGED</span>
          </h1>

          <p
            style={{
              color: "#B3B3B3",
              fontSize: "clamp(14px, 1.4vw, 17px)",
              maxWidth: 500,
              lineHeight: 1.75,
              marginBottom: "2.5rem",
            }}
          >
            12,000 sq ft of elite-grade training infrastructure. Six disciplines. Fifteen
            coaches. One mission — build the version of you that doesn&apos;t quit.
          </p>

          <div
            style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: "4rem" }}
          >
            <a
              href="#programs"
              style={{
                ...MF,
                fontSize: 10,
                background: LIME,
                color: "#080808",
                padding: "13px 28px",
                borderRadius: 2,
                fontWeight: 700,
                textDecoration: "none",
                letterSpacing: "0.15em",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
            >
              EXPLORE PROGRAMS <ArrowRight size={13} />
            </a>
            <a
              href="#facility"
              style={{
                ...MF,
                fontSize: 10,
                color: "#fff",
                padding: "13px 28px",
                borderRadius: 2,
                fontWeight: 600,
                textDecoration: "none",
                letterSpacing: "0.15em",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.04)",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(255,255,255,0.45)";
                el.style.background = "rgba(255,255,255,0.08)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(255,255,255,0.2)";
                el.style.background = "rgba(255,255,255,0.04)";
              }}
            >
              TOUR FACILITY <ArrowRight size={13} />
            </a>
          </div>

          {/* Metrics */}
          <div style={{ display: "flex", gap: "clamp(24px,5vw,60px)", flexWrap: "wrap" }}>
            {[
              ["500+", "MEMBERS"],
              ["15+", "COACHES"],
              ["12,000", "SQ FT"],
              ["6", "SYSTEMS"],
            ].map(([v, l]) => (
              <MetricCard key={l} val={v} label={l} />
            ))}
          </div>
        </div>

        {/* Vertical label */}
        <div
          style={{
            position: "absolute",
            right: "2.5rem",
            top: "50%",
            transform: "translateY(-50%) rotate(90deg)",
            ...MF,
            fontSize: 9,
            color: "rgba(255,255,255,0.18)",
            letterSpacing: "0.35em",
            whiteSpace: "nowrap",
            transformOrigin: "center",
          }}
        >
          HERCULES FITNESS — BIDAR 2019
        </div>
      </section>

      {/* ═══════════════════════════════════════ PHILOSOPHY */}
      <section
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
          <div className="hf-philo-grid">
            <div>
              <SectionLabel>PHILOSOPHY</SectionLabel>
              <h2
                style={{
                  ...DF,
                  fontSize: "clamp(2.4rem, 5vw, 4.8rem)",
                  lineHeight: 0.9,
                  textTransform: "uppercase",
                }}
              >
                WE DON&apos;T
                <br />
                COUNT REPS.
                <br />
                <span style={{ color: LIME }}>WE BUILD</span>
                <br />
                LEGACIES.
              </h2>
              <p
                style={{
                  color: "#B3B3B3",
                  lineHeight: 1.8,
                  marginTop: "2rem",
                  fontSize: 15,
                  maxWidth: 400,
                }}
              >
                Every session at Hercules is engineered with singular intent. No filler.
                No shortcuts. Just systematic progression toward the best version of you.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                {
                  num: "01",
                  label: "DISCIPLINE",
                  desc: "Consistency is the compound interest of fitness. We build habits that outlast motivation and carry through adversity.",
                },
                {
                  num: "02",
                  label: "PRECISION",
                  desc: "Every lift, rep, macro, and recovery window is tracked and optimized. Guesswork is the enemy of progress.",
                },
                {
                  num: "03",
                  label: "PROGRESS",
                  desc: "Data-driven periodisation and measurable outcomes. Your metrics tell the story of your evolution — we make that story compelling.",
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
      <ProgramStackedCardsSection />

      {/* ═══════════════════════════════════════ GYM ATMOSPHERE & WALKTHROUGH */}
      <GymAtmosphereSection />

      {/* ═══════════════════════════════════════ COACHES (3D STACKED CARDS) */}
      <CoachesStackedCardsSection />

      {/* ═══════════════════════════════════════ TRANSFORMATIONS */}
      <section style={{ padding: "8rem 2rem", background: "#080808" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <div className="hf-transform-grid">
            <div>
              <SectionLabel>TRANSFORMATIONS</SectionLabel>
              <h2
                style={{
                  ...DF,
                  fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
                  textTransform: "uppercase",
                  lineHeight: 0.92,
                  marginBottom: "2.5rem",
                }}
              >
                THE PROOF IS
                <br />
                <span style={{ color: LIME }}>IN THE BODY.</span>
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginBottom: "2.5rem",
                }}
              >
                {[
                  { val: "−22kg", label: "FAT LOST", color: RED },
                  { val: "+14kg", label: "MUSCLE GAINED", color: LIME },
                  { val: "24%", label: "FAT REDUCTION", color: CYAN },
                  { val: "3 WKS", label: "FIRST RESULTS", color: PURPLE },
                ].map(({ val, label, color }) => (
                  <div key={label} style={{ ...glass, padding: "1.25rem 1.5rem" }}>
                    <div style={{ ...DF, fontSize: 28, color, lineHeight: 1 }}>{val}</div>
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
                &ldquo;In 16 weeks, Hercules took me from someone who avoided mirrors to someone
                who competes. The system works — if you show up.&rdquo;
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
                  — RAHUL DESAI, BIDAR
                </footer>
              </blockquote>
            </div>

            {/* Before/After Slider */}
            <div>
              <div
                ref={sliderRef}
                style={{
                  position: "relative",
                  height: 500,
                  borderRadius: 4,
                  overflow: "hidden",
                  cursor: "ew-resize",
                  background: "#111",
                  userSelect: "none",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                onMouseDown={() => setIsDragging(true)}
                onTouchStart={() => setIsDragging(true)}
              >
                {/* After Image (Shredded Fit Body) */}
                <img
                  src={girishAfter}
                  alt="After transformation - Girish Shapurkar"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top center",
                  }}
                />
                {/* Before Image (Bulky physique) */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: `${sliderPos}%`,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={girishBefore}
                    alt="Before transformation - Girish Shapurkar"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: `${10000 / sliderPos}%`,
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "top center",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(8,8,8,0.25)",
                    }}
                  />
                </div>

                {/* Labels */}
                <div
                  style={{
                    position: "absolute",
                    top: "1rem",
                    left: "1rem",
                    ...MF,
                    fontSize: 9,
                    color: "#fff",
                    background: "rgba(8,8,8,0.8)",
                    padding: "4px 11px",
                    borderRadius: 2,
                    letterSpacing: "0.2em",
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
                  }}
                >
                  AFTER
                </div>

                {/* Divider */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: `${sliderPos}%`,
                    width: 2,
                    background: LIME,
                    transform: "translateX(-50%)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%,-50%)",
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      background: LIME,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: `0 0 20px ${LIME}60`,
                    }}
                  >
                    <ChevronLeft size={13} color="#080808" />
                    <ChevronRight size={13} color="#080808" />
                  </div>
                </div>
              </div>
              <div
                style={{
                  ...MF,
                  fontSize: 9,
                  color: "#555",
                  textAlign: "center",
                  marginTop: 12,
                  letterSpacing: "0.25em",
                }}
              >
                DRAG TO COMPARE
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ PRICING */}
      <section id="membership" style={{ padding: "8rem 2rem", background: "#09090A" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "5rem" }}>
            <SectionLabel>MEMBERSHIP</SectionLabel>
            <h2
              style={{
                ...DF,
                fontSize: "clamp(2.4rem, 5vw, 4rem)",
                textTransform: "uppercase",
                lineHeight: 0.92,
              }}
            >
              CHOOSE YOUR
              <br />
              <span style={{ color: LIME }}>LEVEL.</span>
            </h2>
          </div>

          <div className="hf-pricing-grid" style={{ marginBottom: "4rem" }}>
            {plans.map((plan) => (
              <div
                key={plan.name}
                style={{
                  ...glass,
                  padding: "2.5rem",
                  position: "relative",
                  borderColor: plan.popular ? `${LIME}40` : "rgba(255,255,255,0.08)",
                  background: plan.popular ? "rgba(216,255,62,0.04)" : "rgba(13,13,13,0.7)",
                  transition: "border-color 0.3s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!plan.popular)
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.16)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  if (!plan.popular)
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                {plan.badge && (
                  <div
                    style={{
                      position: "absolute",
                      top: -12,
                      left: "50%",
                      transform: "translateX(-50%)",
                      ...MF,
                      fontSize: 9,
                      background: LIME,
                      color: "#080808",
                      padding: "4px 16px",
                      borderRadius: 2,
                      letterSpacing: "0.2em",
                      fontWeight: 700,
                      whiteSpace: "nowrap",
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
                    letterSpacing: "0.28em",
                    marginBottom: "1.5rem",
                  }}
                >
                  {plan.name}
                </div>
                <div
                  style={{
                    ...DF,
                    fontSize: "clamp(2.5rem, 3.5vw, 3.5rem)",
                    lineHeight: 1,
                    marginBottom: "0.25rem",
                  }}
                >
                  ₹{plan.price.toLocaleString()}
                </div>
                <div
                  style={{ ...MF, fontSize: 9, color: "#B3B3B3", letterSpacing: "0.2em", marginBottom: "2rem" }}
                >
                  PER MONTH
                </div>
                <div
                  style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.06)", marginBottom: "2rem" }}
                />
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 11,
                    marginBottom: "2.5rem",
                  }}
                >
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <div
                        style={{
                          width: 5,
                          height: 5,
                          background: plan.popular ? LIME : "#444",
                          borderRadius: "50%",
                          marginTop: 6,
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ color: "#B3B3B3", fontSize: 13, lineHeight: 1.55 }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#footer"
                  style={{
                    display: "block",
                    textAlign: "center",
                    ...MF,
                    fontSize: 10,
                    padding: "13px",
                    borderRadius: 2,
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textDecoration: "none",
                    background: plan.popular ? LIME : "transparent",
                    color: plan.popular ? "#080808" : "#fff",
                    border: plan.popular ? "none" : "1px solid rgba(255,255,255,0.15)",
                    transition: "all 0.25s",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    if (!plan.popular) {
                      el.style.borderColor = LIME;
                      el.style.color = LIME;
                    } else el.style.opacity = "0.85";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    if (!plan.popular) {
                      el.style.borderColor = "rgba(255,255,255,0.15)";
                      el.style.color = "#fff";
                    } else el.style.opacity = "1";
                  }}
                >
                  GET STARTED
                </a>
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
      <section style={{ padding: "8rem 2rem", background: "#09090A" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <SectionLabel>FAQ</SectionLabel>
            <h2
              style={{
                ...DF,
                fontSize: "clamp(2.4rem, 5vw, 4rem)",
                textTransform: "uppercase",
                lineHeight: 0.92,
              }}
            >
              QUESTIONS
              <br />
              <span style={{ color: LIME }}>ANSWERED.</span>
            </h2>
          </div>

          <Accordion.Root type="single" collapsible style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {faqs.map((faq, i) => (
              <Accordion.Item
                key={i}
                value={`item-${i}`}
                style={{
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 4,
                  overflow: "hidden",
                  background: "rgba(13,13,13,0.6)",
                }}
              >
                <Accordion.Trigger
                  className="hf-faq-trigger"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    width: "100%",
                    padding: "1.5rem 1.75rem",
                    background: "none",
                    border: "none",
                    color: "#fff",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span style={{ ...MF, fontSize: 9, color: "rgba(255,255,255,0.18)", flexShrink: 0 }}>
                    0{i + 1}
                  </span>
                  <span style={{ ...DF, fontSize: 18, letterSpacing: "0.04em", flex: 1 }}>
                    {faq.q}
                  </span>
                  <ChevronDown size={15} color={LIME} className="hf-faq-chevron" style={{ flexShrink: 0, transition: "transform 0.28s" }} />
                </Accordion.Trigger>
                <Accordion.Content style={{ padding: "0 1.75rem 1.5rem 4.5rem" }}>
                  <p style={{ color: "#B3B3B3", fontSize: 14, lineHeight: 1.85 }}>{faq.a}</p>
                </Accordion.Content>
              </Accordion.Item>
            ))}
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
          <div className="hf-footer-grid" style={{ marginBottom: "4rem" }}>
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: "2rem" }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    background: LIME,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ ...DF, color: "#080808", fontSize: 21, lineHeight: 1 }}>H</span>
                </div>
                <div>
                  <div style={{ ...DF, fontSize: 20, letterSpacing: "0.12em" }}>HERCULES</div>
                  <div style={{ ...MF, fontSize: 8, color: "#B3B3B3", letterSpacing: "0.35em" }}>
                    FITNESS
                  </div>
                </div>
              </div>
              <p style={{ color: "#B3B3B3", fontSize: 13, lineHeight: 1.8, marginBottom: "1.75rem" }}>
                12,000 sq ft of professional-grade training infrastructure on NH-65 Udgir Road,
                in the heart of Bidar, Karnataka.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <MapPin size={14} color={LIME} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ color: "#B3B3B3", fontSize: 13 }}>
                    NH-65 Udgir Road, Bidar, Karnataka 585401
                  </span>
                </div>
                <a
                  href="tel:+918000000000"
                  style={{ display: "flex", gap: 10, alignItems: "center", color: "#B3B3B3", textDecoration: "none", fontSize: 13, transition: "color 0.2s" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = LIME)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#B3B3B3")}
                >
                  <Phone size={13} color={LIME} /> +91 80000 00000
                </a>
                <a
                  href="https://wa.me/918000000000"
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
                      HERCULES FITNESS CENTRE — KALABURAGI
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
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {["Full Name", "Phone Number", "Email Address"].map((f) => (
                  <input
                    key={f}
                    type="text"
                    placeholder={f}
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
                ))}
                <select
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
                  <option>Goal: Fat Loss</option>
                  <option>Goal: Muscle Gain</option>
                  <option>Goal: Body Recomposition</option>
                  <option>Goal: Endurance Training</option>
                  <option>Goal: Combat Sports</option>
                  <option>Goal: General Fitness</option>
                </select>
                <button
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
                  BOOK FREE CONSULTATION
                </button>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
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
              © 2024 HERCULES FITNESS. ALL RIGHTS RESERVED. BIDAR, KARNATAKA.
            </div>
            <div style={{ display: "flex", gap: 24 }}>
              {["PRIVACY", "TERMS", "REFUNDS"].map((item) => (
                <a
                  key={item}
                  href="#"
                  style={{
                    ...MF,
                    fontSize: 8,
                    color: "#444",
                    textDecoration: "none",
                    letterSpacing: "0.2em",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = LIME)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#444")}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ─── GLOBAL STYLES ─────────────────────────────────────────── */}
      <style>{`
        html.lenis, html.lenis body {
          height: auto;
        }
        .lenis.lenis-smooth {
          scroll-behavior: auto !important;
        }
        .lenis.lenis-smooth [data-lenis-prevent] {
          overscroll-behavior: contain;
        }
        .lenis.lenis-stopped {
          overflow: hidden;
        }
        .lenis.lenis-smooth iframe {
          pointer-events: none;
        }

        * { scrollbar-width: none; }
        *::-webkit-scrollbar { display: none; }

        .hf-stacked-card-grid {
          display: grid;
          grid-template-columns: 1fr 0.85fr;
          gap: 2.5rem;
          align-items: center;
          padding: 2.5rem;
          min-height: 440px;
        }
        .hf-stacked-card-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .hf-stacked-card-media {
          height: 100%;
          display: flex;
          align-items: center;
        }

        @media (max-width: 960px) {
          .hf-stacked-card-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
            padding: 1.5rem !important;
          }
          .hf-stacked-card-media {
            height: 280px !important;
            min-height: 280px !important;
          }
        }

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

        @media (max-width: 1024px) {
          .hf-testimonials-split {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }

        @media (max-width: 640px) {
          .hf-marquee-columns {
            grid-template-columns: 1fr !important;
          }
          .hf-marquee-box {
            height: 480px !important;
          }
        }

        .hf-desktop-nav { display: none; }
        @media (min-width: 768px) {
          .hf-desktop-nav { display: flex !important; }
          .hf-mobile-btn { display: none !important; }
        }

        .hf-philo-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6rem;
          align-items: center;
        }
        .hf-programs-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          align-items: start;
        }
        .hf-facility-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
        }
        .hf-trainers-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }
        .hf-transform-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }
        .hf-pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .hf-calc-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .hf-testi-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .hf-footer-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 4rem;
        }

        @media (max-width: 1100px) {
          .hf-philo-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .hf-programs-grid { grid-template-columns: 1fr !important; }
          .hf-facility-grid { grid-template-columns: 1fr !important; }
          .hf-trainers-grid { grid-template-columns: repeat(2,1fr) !important; }
          .hf-transform-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .hf-pricing-grid { grid-template-columns: 1fr !important; }
          .hf-calc-grid { grid-template-columns: 1fr !important; }
          .hf-testi-grid { grid-template-columns: 1fr !important; }
          .hf-footer-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
        }
        @media (max-width: 560px) {
          .hf-trainers-grid { grid-template-columns: 1fr !important; }
        }

        .hf-faq-trigger:hover { background: rgba(255,255,255,0.03) !important; }
        [data-state="open"] .hf-faq-chevron { transform: rotate(180deg); }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
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
              fontFamily: '"JetBrains Mono", monospace',
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
