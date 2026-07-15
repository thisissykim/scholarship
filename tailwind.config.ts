import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "var(--bg-base)",
        surface: "var(--bg-surface)",
        "surface-alt": "var(--bg-surface-alt)",
        card: "var(--bg-card)",
        "card-alt": "var(--bg-card-alt)",
        brand: "var(--brand-green)",
        "brand-border": "var(--brand-green-border)",
        text: "var(--text-base)",
        secondary: "var(--text-secondary)",
        tertiary: "var(--text-tertiary)",
        negative: "var(--text-negative)",
        warning: "var(--text-warning)",
        announcement: "var(--text-announcement)",
        border: "var(--border-gray)",
        "border-light": "var(--border-light)"
      },
      boxShadow: {
        heavy: "var(--shadow-heavy)",
        medium: "var(--shadow-medium)",
        inset: "var(--shadow-inset)"
      },
      borderRadius: {
        badge: "var(--radius-badge)",
        input: "var(--radius-input)",
        card: "var(--radius-card)",
        section: "var(--radius-section)",
        panel: "var(--radius-panel)",
        pill: "var(--radius-pill)"
      }
    }
  },
  plugins: []
};

export default config;
