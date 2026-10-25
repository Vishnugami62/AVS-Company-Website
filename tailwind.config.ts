import type { Config } from "tailwindcss";

// Brand tokens from the AVS style guide (deck slide 42).
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#13275A", // AVS Navy — headings, header, footer
          deep: "#0E1D45", // Deep Navy — footer, dark sections
          700: "#1B336E",
          600: "#24417F",
        },
        gold: {
          DEFAULT: "#C99A3E", // AVS Gold — buttons, highlights
          light: "#E2BF72", // Light Gold — gradient, accents
          text: "#8A6420", // Gold Text — small gold text on light
        },
        cream: "#F6F0E4", // section backgrounds
        paper: "#FFFCF6", // cards
        whatsapp: "#1F8A4C",
        ink: "#1A1D24",
        muted: "#5B6472",
      },
      fontFamily: {
        head: ["var(--font-head)", "Century Gothic", "Jost", "sans-serif"],
        body: ["var(--font-body)", "Calibri", "Carlito", "Segoe UI", "sans-serif"],
        tagline: ["Georgia", "Times New Roman", "serif"],
      },
      borderRadius: {
        card: "20px",
        pill: "999px",
      },
      boxShadow: {
        card: "0 10px 30px -12px rgba(19, 39, 90, 0.18)",
        soft: "0 4px 16px -6px rgba(19, 39, 90, 0.14)",
        lift: "0 18px 48px -18px rgba(19, 39, 90, 0.30)",
      },
      maxWidth: {
        shell: "1200px",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #E2BF72 0%, #C99A3E 100%)",
        "navy-gradient": "linear-gradient(160deg, #1B336E 0%, #13275A 55%, #0E1D45 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
