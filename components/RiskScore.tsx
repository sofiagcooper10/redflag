"use client";

interface RiskScoreProps {
  score: number;
  rationale: string;
}

export default function RiskScore({ score, rationale }: RiskScoreProps) {
  const getColor = () => {
    if (score <= 25) return { bar: "#22c55e", label: "LOW RISK", bg: "#f0fdf4", border: "#bbf7d0" };
    if (score <= 50) return { bar: "#f59e0b", label: "MODERATE", bg: "#fffbeb", border: "#fde68a" };
    if (score <= 75) return { bar: "#f97316", label: "ELEVATED", bg: "#fff7ed", border: "#fed7aa" };
    return { bar: "#ef4444", label: "HIGH RISK", bg: "#fff5f5", border: "#fca5a5" };
  };

  const { bar, label, bg, border } = getColor();
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.12em", color: "#9ca3af", fontWeight: 600 }}>📊 RISK SCORE</span>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 700, color: bar, background: bg, border: `1px solid ${border}`, padding: "3px 10px", borderRadius: 20 }}>{label}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 16 }}>
        <svg width="120" height="120" viewBox="0 0 130 130">
          <circle cx="65" cy="65" r="54" fill="none" stroke="#f3f4f6" strokeWidth="12" />
          <circle cx="65" cy="65" r="54" fill="none" stroke={bar} strokeWidth="12"
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" transform="rotate(-90 65 65)"
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
          />
          <text x="65" y="60" textAnchor="middle" fill="#111" fontSize="28" fontWeight="700" fontFamily="'IBM Plex Mono', monospace">{score}</text>
          <text x="65" y="78" textAnchor="middle" fill="#9ca3af" fontSize="11" fontFamily="'IBM Plex Mono', monospace">/ 100</text>
        </svg>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
          {[
            { range: "0–25", label: "Low", color: "#22c55e" },
            { range: "26–50", label: "Moderate", color: "#f59e0b" },
            { range: "51–75", label: "Elevated", color: "#f97316" },
            { range: "76–100", label: "High", color: "#ef4444" },
          ].map((tier) => (
            <div key={tier.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: tier.color, flexShrink: 0 }} />
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#9ca3af", width: 44 }}>{tier.range}</span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#6b7280" }}>{tier.label}</span>
            </div>
          ))}
        </div>
      </div>

      <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6, borderTop: "1px solid #f3f4f6", paddingTop: 14, fontStyle: "italic" }}>{rationale}</p>
      <p style={{ fontSize: 11, color: "#d1d5db", marginTop: 8, fontStyle: "normal", textAlign: "center" }}>
        ⚠ Score is an AI estimate and may vary
      </p>
    </div>
  );
}
