import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, Volume2, VolumeX, Maximize2, X, Compass, MapPin } from "lucide-react";

// Real Gym Photos - SEO Optimized AVIF Assets for Kalaburagi Local Search
import exteriorImg from "../../../public/gallery/best-gym-in-kalaburagi-hercules-fitness-ola-building-exterior.avif";
import turfImg from "../../../public/gallery/hercules-fitness-kalaburagi-squat-rack-functional-turf-area.avif";
import cableImg from "../../../public/gallery/hercules-fitness-kalaburagi-cable-crossover-bench-press-zone.avif";
import dumbbellImg from "../../../public/gallery/hercules-fitness-kalaburagi-dumbbell-rack-free-weights-section.avif";
import aerofitImg from "../../../public/gallery/hercules-fitness-kalaburagi-aerofit-cardio-bikes-treadmills.avif";


const LIME = "#D8FF3E";

export interface GalleryPhoto {
  id: string;
  title: string;
  category: string;
  src: string;
}

const gymPortfolioPhotos: GalleryPhoto[] = [
  {
    id: "photo-1",
    title: "HERCULES FITNESS CENTRE (UNISEX) — KALABURAGI",
    category: "FACILITY EXTERIOR & LOCATION",
    src: exteriorImg,
  },
  {
    id: "photo-2",
    title: "FUNCTIONAL TURF & SQUAT RACK ZONE",
    category: "STRENGTH & CONDITIONING",
    src: turfImg,
  },
  {
    id: "photo-3",
    title: "CABLE CROSSOVER & INCLINE BENCHES",
    category: "ISOLATION & RESISTANCE",
    src: cableImg,
  },
  {
    id: "photo-4",
    title: "RUBBER DUMBBELL RACK & KETTLEBELLS",
    category: "FREE WEIGHTS",
    src: dumbbellImg,
  },
  {
    id: "photo-5",
    title: "AEROFIT BIKES & CARDIO DECK",
    category: "CARDIO & ENDURANCE",
    src: aerofitImg,
  },
];

export interface GymAtmosphereSectionProps {
  facilitySlides?: any[];
}

export const GymAtmosphereSection: React.FC<GymAtmosphereSectionProps> = ({ facilitySlides: propSlides }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const displayPhotos: GalleryPhoto[] = (propSlides && propSlides.length > 0 ? propSlides : gymPortfolioPhotos).map((s: any, idx: number) => {
    const defaultP = gymPortfolioPhotos[idx % gymPortfolioPhotos.length];
    return {
      id: s.id || `photo-${idx}`,
      title: s.label || s.title || defaultP.title,
      category: s.sub || s.category || defaultP.category,
      src: s.img || s.src || defaultP.src,
    };
  });

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section
      id="arena"
      aria-label="Gym atmosphere and facility gallery section"
      style={{
        padding: "7rem 2rem 9rem",
        background: "#D8FF3E",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto", position: "relative", zIndex: 2 }}>
        {/* Section Header */}
        <div
          style={{
            textAlign: "center",
            maxWidth: 800,
            margin: "0 auto 3.5rem",
          }}
        >
          <h2
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Plus Jakarta Sans", "Inter", sans-serif',
              fontWeight: 900,
              fontSize: "clamp(2.2rem, 5.2vw, 4.2rem)",
              textTransform: "uppercase",
              lineHeight: 0.92,
              color: "#080808",
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            THE ATHLETE&apos;S <span style={{ color: "#080808", background: "rgba(0,0,0,0.08)", padding: "2px 14px", borderRadius: 12 }}>HAVEN</span>
          </h2>
        </div>

        {/* 2-Column Split: Left 9:16 Vertical Video Reel + Right Photo Portfolio */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 28,
            alignItems: "start",
          }}
        >
          {/* LEFT: 9:16 Vertical Video Reel Container */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 380,
                aspectRatio: "9 / 16",
                borderRadius: 28,
                overflow: "hidden",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                background: "#000000",
                boxShadow: "0 25px 60px rgba(0,0,0,0.95)",
              }}
            >
              {/* Native Vertical 9:16 Video (herwalk.mp4) */}
              <video
                src="/herwalk.mp4"
                autoPlay
                loop
                muted
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block",
                }}
              />

              {/* Subtle Bottom Vignette Gradient */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, transparent 60%, rgba(8,8,10,0.8) 100%)",
                  pointerEvents: "none",
                }}
              />

              {/* Bottom Clean Label */}
              <div
                style={{
                  position: "absolute",
                  bottom: 20,
                  left: 20,
                  right: 20,
                  zIndex: 4,
                }}
              >
                <div
                  style={{
                    fontFamily: '"Big Shoulders Display", Impact, sans-serif',
                    fontWeight: 900,
                    fontSize: "1.6rem",
                    color: "#FFFFFF",
                    letterSpacing: "0.02em",
                    lineHeight: 1,
                  }}
                >
                  GYM ATMOSPHERE
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Portfolio Photos Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18 }}>
            {displayPhotos.map((photo, idx) => {
              const isLarge = idx === 0; // Exterior building photo occupies full row
              return (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  style={{
                    position: "relative",
                    borderRadius: 20,
                    overflow: "hidden",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    background: "#0E0E11",
                    gridColumn: isLarge ? "span 2" : "span 1",
                    height: isLarge ? 270 : 220,
                    cursor: "pointer",
                    boxShadow: "0 15px 35px rgba(0,0,0,0.6)",
                  }}
                  onClick={() => setActivePhoto(photo)}
                  whileHover={{
                    scale: 1.02,
                    borderColor: `${LIME}70`,
                    boxShadow: `0 20px 45px rgba(0,0,0,0.85), 0 0 25px ${LIME}20`,
                  }}
                >
                  <img
                    src={photo.src}
                    alt={photo.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      display: "block",
                      transition: "transform 0.5s ease",
                    }}
                  />

                  {/* Gradient Overlay */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(10,10,12,0.92) 0%, transparent 60%)",
                    }}
                  />

                  {/* Expand Icon */}
                  <div
                    style={{
                      position: "absolute",
                      top: 14,
                      right: 14,
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "rgba(10, 10, 12, 0.8)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Maximize2 size={13} />
                  </div>

                  {/* Bottom Title Label */}
                  <div style={{ position: "absolute", bottom: 14, left: 16, right: 16 }}>
                    <div
                      style={{
                        fontFamily: '"Big Shoulders Display", Impact, sans-serif',
                        fontWeight: 800,
                        fontSize: isLarge ? "1.4rem" : "1.1rem",
                        color: "#FFFFFF",
                        letterSpacing: "0.02em",
                        lineHeight: 1.1,
                      }}
                    >
                      {photo.title}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Full View */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "rgba(5, 5, 8, 0.95)",
              backdropFilter: "blur(20px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
            }}
            onClick={() => setActivePhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              style={{
                position: "relative",
                maxWidth: 1000,
                maxHeight: "90vh",
                width: "100%",
                borderRadius: 24,
                overflow: "hidden",
                border: "1px solid rgba(216, 255, 62, 0.3)",
                background: "#0E0E11",
                boxShadow: "0 30px 90px rgba(0,0,0,0.95)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActivePhoto(null)}
                style={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "rgba(10, 10, 12, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 10,
                }}
              >
                <X size={20} />
              </button>

              <img
                src={activePhoto.src}
                alt={activePhoto.title}
                style={{
                  width: "100%",
                  maxHeight: "75vh",
                  objectFit: "contain",
                  display: "block",
                  background: "#08080A",
                }}
              />

              <div
                style={{
                  padding: "1.5rem 2rem",
                  background: "#0A0A0C",
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Plus Jakarta Sans", "Inter", sans-serif',
                      fontSize: 11,
                      color: LIME,
                      letterSpacing: "0.15em",
                      marginBottom: 4,
                    }}
                  >
                    {activePhoto.category}
                  </div>
                  <div
                    style={{
                      fontFamily: '"Big Shoulders Display", Impact, sans-serif',
                      fontWeight: 900,
                      fontSize: "1.8rem",
                      color: "#FFFFFF",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {activePhoto.title}
                  </div>
                </div>

                <div
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Plus Jakarta Sans", "Inter", sans-serif',
                    fontSize: 11,
                    color: "#A1A1AA",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <MapPin size={14} style={{ color: LIME }} /> HERCULES FITNESS CENTRE — KALABURAGI
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
