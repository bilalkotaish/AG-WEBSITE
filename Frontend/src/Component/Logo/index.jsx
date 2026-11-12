export default function Logo({ className = "h-12 w-auto" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 245 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="AgCell"
    >
      {/* Brand Symbol */}
      <rect x="2" y="7" width="42" height="42" rx="11" fill="#0F1F4B" />

      {/* Mobile-inspired symbol */}
      <rect
        x="14"
        y="13"
        width="18"
        height="29"
        rx="3.5"
        stroke="white"
        strokeWidth="2"
      />

      <path
        d="M19 18H27"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <circle cx="23" cy="36" r="1.5" fill="#E10600" />

      {/* Brand Name */}
      <text
        x="54"
        y="37"
        fill="#0F1F4B"
        fontFamily="Montserrat, Arial, sans-serif"
        fontSize="29"
        fontWeight="800"
        letterSpacing="-1"
      >
        AG
      </text>

      <text
        x="99"
        y="37"
        fill="#8B0000"
        fontFamily="Montserrat, Arial, sans-serif"
        fontSize="29"
        fontWeight="800"
        letterSpacing="-1"
      >
        CELL
      </text>

      {/* Tagline */}
      <text
        x="55"
        y="49"
        fill="#64748B"
        fontFamily="Arial, sans-serif"
        fontSize="7"
        fontWeight="600"
        letterSpacing="2"
      >
        MOBILE TECHNOLOGY
      </text>
    </svg>
  );
}
