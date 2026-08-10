import React, { useEffect, useState } from "react";

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  image: string;
}

export const defaultCertificates: CertificateItem[] = [
  {
    id: "cert-1",
    title: "Shafi Sami Bodybuilding & Men's Physique Championship 2023",
    issuer: "Merit Certificate & Gold Medal — Coach Girish",
    image: "/certificates/real_cert_1.png",
  },
  {
    id: "cert-2",
    title: "Karnataka Shbee 2023 State Level Bodybuilding Competition",
    issuer: "Certificate of Merit & Medal — Coach Girish",
    image: "/certificates/real_cert_2.png",
  },
  {
    id: "cert-3",
    title: "Certified Personal Trainer & Babu's Classic 2024",
    issuer: "IFBB & Integrated Fitness Sports Institute",
    image: "/certificates/real_cert_3.png",
  },
  {
    id: "cert-4",
    title: "Karnataka Amateur Bodybuilders Association Open State 2023",
    issuer: "Certificate of Participation & Medal — Coach Girish",
    image: "/certificates/real_cert_4.png",
  },
  {
    id: "cert-5",
    title: "District Level Bodybuilding Championship & Mir Classic 2022",
    issuer: "Certificate of Merit & Medal — Coach Girish",
    image: "/certificates/real_cert_5.png",
  },
];

interface SigmoidCertificateFlowProps {
  certificates?: CertificateItem[];
}

export const SigmoidCertificateFlow: React.FC<SigmoidCertificateFlowProps> = ({
  certificates = defaultCertificates,
}) => {
  const activeCertificates = certificates.length > 0 ? certificates : defaultCertificates;

  // Global progress driver from 0 to 1 (loops continuously)
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    // Complete full loop cycle in ~20 seconds for a smooth, elegant flow
    const CYCLE_DURATION = 20000;

    const animate = (currentTime: number) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;

      setProgress((prev) => (prev + delta / CYCLE_DURATION) % 1);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  /**
   * Sigmoid Trajectory Calculator
   * Transforms normalized progress p in [0, 1] to (x%, y%) coordinates, scale, tilt, and opacity.
   * - Top-Right Entry: p = 0.0 -> x ~ 84%, y ~ -5% (Empty space beside headline)
   * - Mid-Right Sweep: p = 0.25 -> x ~ 78%, y ~ 25% (High clarity area)
   * - S-Curve Transition: p = 0.55 -> x ~ 40%, y ~ 55%
   * - Bottom-Left Exit: p = 1.0 -> x ~ 14%, y ~ 110% (Behind video card & out screen)
   */
  const getSigmoidState = (p: number) => {
    const normP = ((p % 1) + 1) % 1; // Normalize to [0, 1]

    // Vertical Y travels linearly top to bottom (-5% to 110%)
    const yPercent = normP * 115 - 5;

    // Sigmoid X curve calculation:
    // u parameter ranges from -4.0 to +4.0
    const u = (normP - 0.45) * 8.5;
    const sigmoidVal = 1 / (1 + Math.exp(u)); // 1 -> 0

    // X curve spans from 84% (top right) down to 14% (bottom left)
    const xPercent = 14 + sigmoidVal * 70;

    // Dynamic rotation & scale along the S-curve
    const rotation = (1 - sigmoidVal * 2) * 8; // -8deg to +8deg tilt
    const scale = 0.82 + Math.sin(normP * Math.PI) * 0.22; // Depth perspective (0.82 to 1.04)

    // Opacity fade-in near entry and fade-out near exit
    let opacity = 1;
    if (normP < 0.08) {
      opacity = normP / 0.08;
    } else if (normP > 0.9) {
      opacity = (1 - normP) / 0.1;
    }

    return {
      xPercent,
      yPercent,
      rotation,
      scale,
      opacity,
    };
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 1, // Layer 1: behind headline text and video card
      }}
      aria-hidden="true"
    >
      {/* Render Flowing Pure Certificates */}
      {activeCertificates.map((cert, index) => {
        const total = activeCertificates.length;
        const itemOffset = index / total;
        const itemProgress = (progress + itemOffset) % 1;
        const state = getSigmoidState(itemProgress);

        return (
          <img
            key={cert.id}
            src={cert.image}
            alt={cert.title}
            style={{
              position: "absolute",
              top: `${state.yPercent}%`,
              left: `${state.xPercent}%`,
              transform: `translate(-50%, -50%) rotate(${state.rotation}deg) scale(${state.scale})`,
              opacity: state.opacity,
              transition: "transform 0.05s linear, opacity 0.1s linear",
              width: "clamp(130px, 22vw, 240px)",
              height: "auto",
              display: "block",
              pointerEvents: "none",
              willChange: "transform, opacity",
              filter: "drop-shadow(0 15px 30px rgba(0, 0, 0, 0.85))",
            }}
          />
        );
      })}
    </div>
  );
};
