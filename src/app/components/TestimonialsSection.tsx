import React from "react";
import { motion } from "motion/react";
import { Star, ArrowRight } from "lucide-react";

const LIME = "#D8FF3E";

export interface ReviewItem {
  id: string;
  name: string;
  role: string;
  reviewsCount: string;
  timeAgo: string;
  rating: number;
  comment: string;
  ownerResponse?: string;
}

// Authentic Google Business Reviews for Hercules Fitness Kalaburagi
const googleReviewsData: ReviewItem[] = [
  {
    id: "rev-1",
    name: "Alpha Series",
    role: "Member",
    reviewsCount: "3 Reviews",
    timeAgo: "1 year ago",
    rating: 5,
    comment: "Extremely neat and clean. Thank you Hercules Fitness!",
    ownerResponse: "Tq 😊",
  },
  {
    id: "rev-2",
    name: "Nawab Saab",
    role: "Member",
    reviewsCount: "3 Reviews",
    timeAgo: "1 year ago",
    rating: 5,
    comment: "Hercules Gym is very clean and neat gym in Kalaburagi. Good trainer 👍",
    ownerResponse: "Tq 😊",
  },
  {
    id: "rev-3",
    name: "Syeda Tahniyath",
    role: "Local Guide",
    reviewsCount: "21 Reviews",
    timeAgo: "2 years ago",
    rating: 5,
    comment:
      "Comfortable environment for ladies, properly equipped and trainers are super supportive and attentive. Special thanks to Coach Girish sir for training me well.",
  },
  {
    id: "rev-4",
    name: "Vikas H",
    role: "Member",
    reviewsCount: "5 Reviews",
    timeAgo: "1 year ago",
    rating: 5,
    comment:
      "Equipments are good and maintained neatly. Cleanliness is top notch. Coach Girish has wide experience in fitness and personal training.",
  },
  {
    id: "rev-5",
    name: "Mohammed Zaid",
    role: "Member",
    reviewsCount: "1 Review",
    timeAgo: "1 year ago",
    rating: 5,
    comment:
      "Best gym in Gulbarga with all modern equipment and affordable membership fee.",
  },
  {
    id: "rev-6",
    name: "Basavaraj Patil",
    role: "Member",
    reviewsCount: "4 Reviews",
    timeAgo: "2 years ago",
    rating: 5,
    comment:
      "Spacious gym floor, excellent guidance by Coach Girish. Transformed my lifestyle here.",
  },
];

const ReviewCard: React.FC<{ review: ReviewItem }> = ({ review }) => (
  <div
    style={{
      background: "rgba(255, 255, 255, 0.03)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      borderRadius: 18,
      padding: "1.4rem",
      marginBottom: "1.25rem",
      boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
    }}
  >
    {/* Star Rating */}
    <div style={{ display: "flex", gap: 3, marginBottom: "0.85rem" }}>
      {Array.from({ length: review.rating }).map((_, i) => (
        <Star key={i} size={14} fill={LIME} color={LIME} />
      ))}
    </div>

    {/* Review Text */}
    <p
      style={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: 14,
        lineHeight: 1.6,
        color: "#E4E4E7",
        margin: "0 0 1rem",
        fontStyle: "italic",
      }}
    >
      &ldquo;{review.comment}&rdquo;
    </p>

    <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.07)", paddingTop: "0.85rem" }}>
      {/* Reviewer Name */}
      <div
        style={{
          fontFamily: '"Big Shoulders Display", Impact, sans-serif',
          fontWeight: 900,
          fontSize: "1.25rem",
          color: "#FFFFFF",
          letterSpacing: "0.03em",
          lineHeight: 1,
        }}
      >
        {review.name}
      </div>

      {/* Meta info */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 10,
          color: "#8E8E93",
          marginTop: 6,
        }}
      >
        <span>
          {review.role} • {review.reviewsCount}
        </span>
        <span>{review.timeAgo}</span>
      </div>

      {/* Owner Response Pill */}
      {review.ownerResponse && (
        <div
          style={{
            marginTop: "0.85rem",
            background: "rgba(216, 255, 62, 0.08)",
            border: "1px solid rgba(216, 255, 62, 0.3)",
            borderRadius: 12,
            padding: "8px 12px",
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 11,
            color: LIME,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ fontWeight: 700 }}>Owner Response:</span>
          <span>{review.ownerResponse}</span>
        </div>
      )}
    </div>
  </div>
);

export const TestimonialsSection: React.FC = () => {
  const col1 = googleReviewsData.slice(0, 3);
  const col2 = googleReviewsData.slice(3, 6);

  return (
    <section
      id="reviews"
      aria-label="Google member reviews for Hercules Fitness Kalaburagi"
      style={{
        padding: "7rem 2rem",
        background: "#08080A",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Top Centered Section Header */}
        <div
          style={{
            textAlign: "center",
            maxWidth: 750,
            margin: "0 auto 3rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              fontFamily: '"Big Shoulders Display", Impact, sans-serif',
              fontWeight: 900,
              fontSize: "clamp(2.6rem, 5.5vw, 4.4rem)",
              textTransform: "uppercase",
              lineHeight: 0.92,
              color: "#FFFFFF",
              letterSpacing: "0.02em",
              marginBottom: "1.25rem",
              textAlign: "center",
            }}
          >
            WHAT OUR <span style={{ color: LIME }}>MEMBERS SAY</span>
          </h2>

          {/* Rating Pill Badge */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.035)",
              border: "1px solid rgba(255, 255, 255, 0.09)",
              padding: "10px 20px",
              borderRadius: 40,
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", gap: 3 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} fill={LIME} color={LIME} />
              ))}
            </div>
            <span
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 11,
                fontWeight: 700,
                color: "#FFFFFF",
                letterSpacing: "0.08em",
              }}
            >
              4.9 Rated on Google <span style={{ color: "#8E8E93", fontWeight: 400 }}>(120+ Reviews)</span>
            </span>
          </div>
        </div>

        {/* Marquee Review Container */}
        <div
          style={{
            background: "#0E0E11",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: 24,
            padding: "1.75rem",
            height: 540,
            maxHeight: "70vh",
            overflow: "hidden",
            position: "relative",
            boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
            maxWidth: 900,
            margin: "0 auto",
          }}
          className="hf-marquee-box"
        >
          {/* Top & Bottom Fade Mask Gradient */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 70,
              background: "linear-gradient(to bottom, #0E0E11 0%, transparent 100%)",
              zIndex: 2,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 70,
              background: "linear-gradient(to top, #0E0E11 0%, transparent 100%)",
              zIndex: 2,
              pointerEvents: "none",
            }}
          />

          {/* Dual Column Marquee Track */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.25rem",
              height: "100%",
            }}
            className="hf-marquee-columns"
          >
            {/* Column 1: Moves Upward */}
            <div style={{ overflow: "hidden" }}>
              <motion.div
                animate={{ y: [0, "-50%"] }}
                transition={{
                  duration: 38,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{ display: "flex", flexDirection: "column" }}
              >
                {[...col1, ...col1].map((rev, idx) => (
                  <ReviewCard key={`c1-${rev.id}-${idx}`} review={rev} />
                ))}
              </motion.div>
            </div>

            {/* Column 2: Moves Downward */}
            <div style={{ overflow: "hidden" }}>
              <motion.div
                animate={{ y: ["-50%", 0] }}
                transition={{
                  duration: 42,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{ display: "flex", flexDirection: "column" }}
              >
                {[...col2, ...col2].map((rev, idx) => (
                  <ReviewCard key={`c2-${rev.id}-${idx}`} review={rev} />
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
