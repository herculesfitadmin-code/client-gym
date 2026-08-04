import React from "react";
import { motion } from "motion/react";
import { Star, MessageSquareQuote, ArrowRight, ShieldCheck } from "lucide-react";

const LIME = "#D8FF3E";

export interface GoogleReview {
  id: string;
  name: string;
  subtitle: string;
  rating: number;
  timeAgo: string;
  text: string;
  ownerResponse?: string;
}

export const googleReviews: GoogleReview[] = [
  {
    id: "rev-1",
    name: "Vasavi Kulkarni",
    subtitle: "Member • 6 Reviews",
    rating: 5,
    timeAgo: "1 year ago",
    text: "The Gym is very clean and neat. The trainer is also very good he will be monitoring all the time and very helpful. He suggests diet plans also individually so if you are beginner it’s highly recommended and for an experienced person it’s an add on.",
    ownerResponse: "Tq 😊",
  },
  {
    id: "rev-2",
    name: "Prashant Vastradmath",
    subtitle: "Member • 2 Reviews",
    rating: 5,
    timeAgo: "1 year ago",
    text: "The trainers at Hercules Fitness are professional, knowledgeable, and approachable. They provide personalized guidance based on fitness goals, whether it’s weight loss, muscle building, or overall fitness. The staff is friendly and always ready to assist with queries.",
  },
  {
    id: "rev-3",
    name: "Manojkumar Jadhav",
    subtitle: "Member • 5 Reviews",
    rating: 5,
    timeAgo: "1 year ago",
    text: "I’ve been attending Hercules Fitness Centre in Kalaburagi for the past month and am thoroughly impressed with their setup and modern equipment. The gym stands out in our city for its state-of-the-art facilities.",
  },
  {
    id: "rev-4",
    name: "Venugopal",
    subtitle: "Local Guide • 14 Reviews",
    rating: 5,
    timeAgo: "1 year ago",
    text: "If you're a beginner or experienced and want to work out, this is the best gym because the trainer Girish is a professional trainer as well as a professional body builder. He suggests diet plans to individuals and the gym is maintained very clean and hygienic.",
    ownerResponse: "Tq 😊",
  },
  {
    id: "rev-5",
    name: "Pradeep Pradeepkumar",
    subtitle: "Member • 4 Reviews",
    rating: 5,
    timeAgo: "1 year ago",
    text: "Hi I'm Pradeep, I'm here to share my feedback about Hercules Fitness — one of the best Gyms I ever found. Equipments in gym are really good for all people like beginners and also professionals. Overlay professional gym trainer is guiding for proper workouts... thank you!",
  },
  {
    id: "rev-6",
    name: "ALPHA series",
    subtitle: "Member • 3 Reviews",
    rating: 5,
    timeAgo: "1 year ago",
    text: "I haven't seen a Gym like this in Gulbarga! Extremely neat and clean. Thank you Hercules Fitness!",
    ownerResponse: "Tq 😊",
  },
  {
    id: "rev-7",
    name: "Sharath Sindhe",
    subtitle: "Member • 2 Reviews",
    rating: 5,
    timeAgo: "8 months ago",
    text: "Super Friendly Gym! The trainer is superb friendly and creates a super welcoming environment.",
  },
  {
    id: "rev-8",
    name: "Vanitesh",
    subtitle: "Member • 3 Reviews",
    rating: 5,
    timeAgo: "1 year ago",
    text: "One of the best gyms in Gulbarga! Owner is a professional body builder and the gym atmosphere is very good.",
  },
  {
    id: "rev-9",
    name: "NAWAB SAAB",
    subtitle: "Member • 3 Reviews",
    rating: 5,
    timeAgo: "1 year ago",
    text: "Great gym, Clean, well-maintained equipment, and friendly staff & good trainer 👍",
    ownerResponse: "Tq 😊",
  },
  {
    id: "rev-10",
    name: "Mallikarjun Vastradmath",
    subtitle: "Member • 1 Review",
    rating: 5,
    timeAgo: "1 year ago",
    text: "I had very well experience and changes in the gym, trainer guides and helps a lot to grow our fitness.",
  },
  {
    id: "rev-11",
    name: "Kumari Shalini Sikha",
    subtitle: "Member • 2 Reviews",
    rating: 5,
    timeAgo: "1 year ago",
    text: "Very clean gym with awesome workout environment and motivating fitness classes.",
  },
  {
    id: "rev-12",
    name: "Vinod Patil",
    subtitle: "Member • 3 Reviews",
    rating: 5,
    timeAgo: "1 year ago",
    text: "Hercules Fitness is extraordinary! All new set up with Air Conditioning — total paisa vasool!",
    ownerResponse: "Tq 😊",
  },
  {
    id: "rev-13",
    name: "Nagu N",
    subtitle: "Member • 2 Reviews",
    rating: 5,
    timeAgo: "1 year ago",
    text: "All new equipment, clean gym, experienced and supportive good trainer.",
    ownerResponse: "Tq 😊",
  },
  {
    id: "rev-14",
    name: "Venky Patil",
    subtitle: "Local Guide • 276 Reviews",
    rating: 5,
    timeAgo: "1 year ago",
    text: "An awesome gym! Trainer is very good and supportive.",
    ownerResponse: "Tq 😊",
  },
  {
    id: "rev-15",
    name: "Khurshid Khan",
    subtitle: "Local Guide • 13 Reviews",
    rating: 5,
    timeAgo: "1 year ago",
    text: "Nice coaching, nice environment, and top-tier equipment 💪💪💪♥️",
  },
  {
    id: "rev-16",
    name: "Sachin Jadhav",
    subtitle: "Local Guide • 7 Reviews",
    rating: 5,
    timeAgo: "1 year ago",
    text: "Best gym in Gulbarga / Kalaburagi hands down!",
    ownerResponse: "Tq 😊",
  },
  {
    id: "rev-17",
    name: "Gururaj Kamatar",
    subtitle: "Local Guide • 9 Reviews",
    rating: 5,
    timeAgo: "1 week ago",
    text: "Overall Good Gym with a very humble owner and professional guidance!",
  },
];

// Split reviews into 2 columns for marquee
const col1 = googleReviews.filter((_, i) => i % 2 === 0);
const col2 = googleReviews.filter((_, i) => i % 2 !== 0);

const ReviewCard: React.FC<{ review: GoogleReview }> = ({ review }) => {
  return (
    <div
      style={{
        background: "rgba(22, 22, 26, 0.9)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.07)",
        borderRadius: 16,
        padding: "1.35rem 1.5rem",
        marginBottom: "1rem",
        transition: "all 0.25s ease",
        position: "relative",
      }}
      className="hf-review-card-item"
    >
      {/* Rating Stars */}
      <div style={{ display: "flex", gap: 3, marginBottom: "0.85rem" }}>
        {Array.from({ length: review.rating }).map((_, i) => (
          <Star key={i} size={14} fill={LIME} color={LIME} />
        ))}
      </div>

      {/* Quote text */}
      <p
        style={{
          fontFamily: '"DM Sans", sans-serif',
          color: "#E4E4E7",
          fontSize: 13.5,
          lineHeight: 1.7,
          fontStyle: "italic",
          marginBottom: "1.1rem",
        }}
      >
        &ldquo;{review.text}&rdquo;
      </p>

      <div
        style={{
          height: 1,
          background: "rgba(255, 255, 255, 0.06)",
          marginBottom: "0.9rem",
        }}
      />

      {/* Author Name & Subtitle */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div
            style={{
              fontFamily: '"Big Shoulders Display", Impact, sans-serif',
              fontWeight: 900,
              fontSize: 16,
              letterSpacing: "0.05em",
              color: "#FFFFFF",
              textTransform: "uppercase",
              lineHeight: 1.1,
            }}
          >
            {review.name}
          </div>
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 9,
              color: "#8E8E93",
              letterSpacing: "0.1em",
              marginTop: 3,
            }}
          >
            {review.subtitle}
          </div>
        </div>

        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 9,
            color: "#666",
          }}
        >
          {review.timeAgo}
        </div>
      </div>

      {/* Owner Response Badge if present */}
      {review.ownerResponse && (
        <div
          style={{
            marginTop: "0.85rem",
            padding: "6px 10px",
            background: "rgba(216, 255, 62, 0.06)",
            border: "1px solid rgba(216, 255, 62, 0.2)",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <ShieldCheck size={12} color={LIME} />
          <span
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 9.5,
              color: LIME,
              fontWeight: 600,
            }}
          >
            Owner Response: {review.ownerResponse}
          </span>
        </div>
      )}
    </div>
  );
};

export const TestimonialsSection: React.FC = () => {
  return (
    <section
      id="testimonials"
      aria-label="Google reviews and member testimonials section"
      style={{
        padding: "8rem 2rem",
        background: "#08080A",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div className="hf-testimonials-split">
          {/* Left Column: Marquee Review Container (Matching user screenshot) */}
          <div
            style={{
              background: "#0E0E11",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 24,
              padding: "1.75rem",
              height: 620,
              maxHeight: "75vh",
              overflow: "hidden",
              position: "relative",
              boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
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

          {/* Right Column: Text Header & Rating Callout (Matching user screenshot) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              paddingLeft: "clamp(0rem, 2vw, 2.5rem)",
            }}
          >
            {/* Top Label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: "1rem",
              }}
            >
              <div style={{ width: 28, height: 2, background: LIME }} />
              <span
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 11,
                  fontWeight: 700,
                  color: LIME,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                }}
              >
                SUCCESS STORIES
              </span>
            </div>

            {/* Main Title */}
            <h2
              style={{
                fontFamily: '"Big Shoulders Display", Impact, sans-serif',
                fontWeight: 900,
                fontSize: "clamp(2.6rem, 5.5vw, 4.4rem)",
                textTransform: "uppercase",
                lineHeight: 0.92,
                color: "#FFFFFF",
                letterSpacing: "0.02em",
                marginBottom: "1.75rem",
              }}
            >
              WHAT OUR
              <br />
              <span style={{ color: LIME }}>MEMBERS SAY</span>
            </h2>

            {/* Description Paragraph */}
            <p
              style={{
                fontFamily: '"DM Sans", sans-serif',
                color: "#A1A1AA",
                fontSize: 14.5,
                lineHeight: 1.85,
                marginBottom: "2.25rem",
                maxWidth: 540,
              }}
            >
              At <strong style={{ color: "#FFF" }}>Hercules Fitness Centre</strong>, we don&apos;t just transform bodies—we elevate lives. Our members come to us seeking more than a workout; they seek expert guidance, cutting-edge equipment, and a luxury environment designed for peak performance and recovery. Every success story is a testament to the dedication, innovation, and personalized care that defines the Hercules experience.
            </p>

            {/* Rating Pill Badge (Matching user screenshot) */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.035)",
                border: "1px solid rgba(255, 255, 255, 0.09)",
                padding: "12px 22px",
                borderRadius: 40,
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                marginBottom: "2.5rem",
                alignSelf: "flex-start",
              }}
            >
              <div style={{ display: "flex", gap: 3 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={15} fill={LIME} color={LIME} />
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

            {/* CTA Button (Matching user screenshot) */}
            <div>
              <a
                href="#membership"
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 11,
                  fontWeight: 800,
                  background: LIME,
                  color: "#080808",
                  padding: "16px 36px",
                  borderRadius: 40,
                  textDecoration: "none",
                  letterSpacing: "0.15em",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  transition: "all 0.25s ease",
                  boxShadow: "0 6px 24px rgba(216, 255, 62, 0.3)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(-2px)";
                  el.style.boxShadow = "0 8px 30px rgba(216, 255, 62, 0.45)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "0 6px 24px rgba(216, 255, 62, 0.3)";
                }}
              >
                GET STARTED <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
