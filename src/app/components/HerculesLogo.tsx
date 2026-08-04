import React from "react";

interface HerculesLogoProps {
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
  color?: string;
  bgColor?: string;
}

export const HerculesLogo: React.FC<HerculesLogoProps> = ({
  size = 48,
  className = "",
  style = {},
  color = "#D8FF3E", // Lime/Yellow accent from design
  bgColor = "#080808",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}
    >
      <defs>
        {/* Curved Path for HERCULES top arc */}
        <path id="topTextArc" d="M 65,250 A 185,185 0 0,1 435,250" />
        {/* Curved Path for FITNESS CENTRE bottom arc */}
        <path id="bottomTextArc" d="M 435,250 A 185,185 0 0,1 65,250" />
      </defs>

      {/* Background Circle */}
      <circle cx="250" cy="250" r="240" fill={bgColor} />

      {/* Outer Thick Yellow Ring Border */}
      <circle cx="250" cy="250" r="236" stroke={color} strokeWidth="12" fill="none" />

      {/* Outer Inner Divider Line */}
      <circle cx="250" cy="250" r="172" stroke={color} strokeWidth="6" fill="none" />

      {/* Center Circle Divider Line */}
      <circle cx="250" cy="250" r="132" stroke={color} strokeWidth="6" fill="none" />

      {/* Top Arc Text: HERCULES */}
      <text fill={color} fontSize="46" fontWeight="900" fontFamily="sans-serif" letterSpacing="6">
        <textPath href="#topTextArc" startOffset="50%" textAnchor="middle">
          HERCULES
        </textPath>
      </text>

      {/* Bottom Arc Text: FITNESS CENTRE */}
      <text fill={color} fontSize="40" fontWeight="900" fontFamily="sans-serif" letterSpacing="4">
        <textPath href="#bottomTextArc" startOffset="50%" textAnchor="middle">
          FITNESS CENTRE
        </textPath>
      </text>

      {/* Left Text: ESTD */}
      <text
        x="98"
        y="258"
        fill={color}
        fontSize="24"
        fontWeight="900"
        fontFamily="sans-serif"
        textAnchor="middle"
        letterSpacing="2"
      >
        ESTD
      </text>

      {/* Right Text: 2024 */}
      <text
        x="402"
        y="258"
        fill={color}
        fontSize="24"
        fontWeight="900"
        fontFamily="sans-serif"
        textAnchor="middle"
        letterSpacing="2"
      >
        2024
      </text>

      {/* Horizontal Divider Bar Lines beside ESTD / 2024 */}
      <rect x="52" y="246" width="16" height="6" fill={color} rx="3" />
      <rect x="432" y="246" width="16" height="6" fill={color} rx="3" />

      {/* ─── DUMBBELL CENTER GRAPHIC ─── */}
      {/* Center Shaft Bar */}
      <rect x="175" y="242" width="150" height="16" fill={color} rx="4" />

      {/* Inner Collar Stops */}
      <rect x="210" y="215" width="12" height="70" fill={color} rx="3" />
      <rect x="278" y="215" width="12" height="70" fill={color} rx="3" />

      {/* Main Large Weight Plates */}
      <rect x="190" y="195" width="18" height="110" fill={color} rx="4" />
      <rect x="292" y="195" width="18" height="110" fill={color} rx="4" />

      {/* Medium Weight Plates */}
      <rect x="170" y="210" width="18" height="80" fill={color} rx="4" />
      <rect x="312" y="210" width="18" height="80" fill={color} rx="4" />

      {/* Small Outer Weight Plates */}
      <rect x="154" y="225" width="14" height="50" fill={color} rx="3" />
      <rect x="332" y="225" width="14" height="50" fill={color} rx="3" />
    </svg>
  );
};
