"use client";

const categoryColor: Record<string, string> = {
  Fraud: "#ef4444",
  Employment: "#8b5cf6",
  Regulatory: "#3b82f6",
  Environmental: "#22c55e",
  IP: "#f59e0b",
  Consumer: "#ec4899",
  Antitrust: "#f97316",
  Criminal: "#dc2626",
  Settlement: "#6366f1",
  Other: "#6b7280",
};

const categoryIcon: Record<string, string> = {
  Fraud: "🕵️",
  Employment: "👥",
  Regulatory: "🏛️",
  Environmental: "🌿",
  IP: "💡",
  Consumer: "👤",
  Antitrust: "⚖️",
  Criminal: "🚨",
  Settlement: "🤝",
  Other: "📄",
};

export default function CategoryTags({ categories }: { categories: string[] }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.12em", color: "#9ca3af", flexShrink: 0, fontWeight: 600 }}>EXPOSURE:</span>
      {categories.map((cat) => (
        <span key={cat} style={{
          fontSize: 12,
          color: categoryColor[cat] || "#6b7280",
          background: `${categoryColor[cat]}11`,
          border: `1px solid ${categoryColor[cat]}33`,
          padding: "4px 12px",
          borderRadius: 20,
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          gap: 5,
        }}>
          <span>{categoryIcon[cat] || "📄"}</span>
          {cat}
        </span>
      ))}
    </div>
  );
}
