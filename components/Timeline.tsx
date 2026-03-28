"use client";

interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  category: string;
  severity: "low" | "medium" | "high";
}

const severityColor: Record<string, string> = {
  low: "#22c55e",
  medium: "#f59e0b",
  high: "#ef4444",
};

const severityBg: Record<string, string> = {
  low: "#f0fdf4",
  medium: "#fffbeb",
  high: "#fff5f5",
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

export default function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 12, padding: 28, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.12em", color: "#9ca3af", fontWeight: 600 }}>📅 CASE TIMELINE</span>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#d1d5db" }}>{events.length} EVENTS</span>
      </div>

      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 84, top: 0, bottom: 0, width: 2, background: "linear-gradient(to bottom, #f3f4f6, #e5e7eb 20%, #e5e7eb 80%, #f3f4f6)", borderRadius: 2 }} />

        {events.map((event, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", marginBottom: i === events.length - 1 ? 0 : 28, position: "relative" }}>
            <div style={{ width: 68, flexShrink: 0, paddingTop: 14, textAlign: "right" }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "#374151", fontWeight: 600 }}>{event.year}</span>
            </div>

            <div style={{ width: 32, display: "flex", justifyContent: "center", paddingTop: 12, flexShrink: 0, position: "relative", zIndex: 1 }}>
              <div style={{
                width: 14, height: 14, borderRadius: "50%",
                background: severityBg[event.severity],
                border: `2.5px solid ${severityColor[event.severity]}`,
                boxShadow: `0 0 0 3px ${severityColor[event.severity]}22`,
              }} />
            </div>

            <div style={{ flex: 1, paddingLeft: 8 }}>
              <div style={{
                background: "#faf9f6",
                border: "1.5px solid #e5e7eb",
                borderLeft: `4px solid ${categoryColor[event.category] || "#6b7280"}`,
                borderRadius: 10,
                padding: "14px 18px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{categoryIcon[event.category] || "📄"}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#111", lineHeight: 1.3 }}>{event.title}</span>
                  </div>
                  <span style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 10,
                    color: categoryColor[event.category] || "#6b7280",
                    background: `${categoryColor[event.category]}11`,
                    border: `1px solid ${categoryColor[event.category]}33`,
                    padding: "2px 8px",
                    borderRadius: 20,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}>{event.category}</span>
                </div>
                <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.7, marginBottom: 10 }}>{event.description}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: severityColor[event.severity] }} />
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: severityColor[event.severity], fontWeight: 600 }}>
                    {event.severity.toUpperCase()} SEVERITY
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
