"use client";

import { useState } from "react";
import RiskScore from "@/components/RiskScore";
import Timeline from "@/components/Timeline";
import CategoryTags from "@/components/CategoryTags";

interface AnalysisResult {
  company: string;
  summary: string;
  riskScore: number;
  riskRationale: string;
  timeline: {
    year: number;
    title: string;
    description: string;
    category: string;
    severity: "low" | "medium" | "high";
  }[];
  categories: string[];
  verdict: string;
}

const EXAMPLES = ["Wells Fargo", "Theranos", "Enron", "Meta", "Boeing"];

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [loadingMsg, setLoadingMsg] = useState("");

  const loadingMessages = [
    "Pulling court records...",
    "Scanning federal dockets...",
    "Analyzing legal exposure...",
    "Building the red flag report...",
  ];

  const analyze = async (company?: string) => {
    const target = company || query.trim();
    if (!target) return;
    setLoading(true);
    setResult(null);
    setError("");
    let msgIndex = 0;
    setLoadingMsg(loadingMessages[0]);
    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % loadingMessages.length;
      setLoadingMsg(loadingMessages[msgIndex]);
    }, 2200);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: target }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  return (
    <main>
      <header>
        <div className="logo-wrap">
          <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="15" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.5"/>
            <path d="M16 9v8" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="16" cy="21.5" r="1.5" fill="#ef4444"/>
          </svg>
          <div>
            <div className="logo-text">RED FLAG</div>
            <div className="logo-sub">DUE DILIGENCE IN SECONDS</div>
          </div>
        </div>
        <div className="header-badge">AI-POWERED RESEARCH</div>
      </header>

      {!result && !loading && (
        <section className="hero">
          <h1 className="hero-headline">
            Every lawsuit.<br />
            Every settlement.<br />
            <span className="accent">Every red flag.</span>
          </h1>
          <p className="hero-sub">
            Due diligence in seconds. Enter any company name to instantly 
            generate its complete legal biography, case timeline, and AI risk score.
          </p>
        </section>
      )}

      {!result && !loading && (
        <section className="how-it-works">
          <div className="hiw-step">
            <span className="hiw-icon" suppressHydrationWarning>🔍</span>
            <span className="hiw-title">Search</span>
            <span className="hiw-desc">Enter any public company name</span>
          </div>
          <div className="hiw-arrow">→</div>
          <div className="hiw-step">
            <span className="hiw-icon" suppressHydrationWarning>🤖</span>
            <span className="hiw-title">AI Research</span>
            <span className="hiw-desc">Claude scans court records & filings</span>
          </div>
          <div className="hiw-arrow">→</div>
          <div className="hiw-step">
            <span className="hiw-icon" suppressHydrationWarning>📋</span>
            <span className="hiw-title">Get Report</span>
            <span className="hiw-desc">Legal biography, timeline & risk score</span>
          </div>
        </section>
      )}

      <section className="search-section">
        <div className="search-bar">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="7.5" cy="7.5" r="5.5" stroke="#9ca3af" strokeWidth="1.5"/>
            <path d="M12 12 L16 16" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && analyze()}
            placeholder="Search any company..."
            className="search-input"
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
          <button onClick={() => analyze()} disabled={loading || !query.trim()} className="search-btn">
            {loading ? "SEARCHING..." : "INVESTIGATE →"}
          </button>
        </div>
        {!result && !loading && (
          <div className="examples">
            <span className="examples-label">Try:</span>
            {EXAMPLES.map((ex) => (
              <button key={ex} onClick={() => { setQuery(ex); analyze(ex); }} className="example-pill">{ex}</button>
            ))}
          </div>
        )}
      </section>

      {loading && (
        <section className="loading-wrap">
          <div className="flag-pulse">
            <svg width="52" height="52" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="15" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.5"/>
              <path d="M16 9v8" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="16" cy="21.5" r="1.5" fill="#ef4444"/>
            </svg>
          </div>
          <p className="loading-msg">{loadingMsg}</p>
          <div className="loading-bar-wrap"><div className="loading-bar" /></div>
        </section>
      )}

      {error && <div className="error-msg">⚠ {error}</div>}

      {result && (
        <section className="results">
          <div className="result-header">
            <div>
              <h2 className="company-name">{result.company}</h2>
              <CategoryTags categories={result.categories} />
            </div>
            <div className="verdict-box">
              <span className="verdict-label">⚖ ANALYST VERDICT</span>
              <p className="verdict-text">"{result.verdict}"</p>
            </div>
          </div>

          <div className="grid-two">
            <div className="summary-card">
              <div className="section-label">📋 LEGAL BIOGRAPHY</div>
              {result.summary.split("\n").filter(Boolean).map((para, i) => (
                <p key={i} className="summary-para">{para}</p>
              ))}
            </div>
            <RiskScore score={result.riskScore} rationale={result.riskRationale} />
          </div>

          <Timeline events={result.timeline} />

          <p className="disclaimer">⚠ AI-generated from public sources. Always verify with primary legal databases before making business decisions.</p>
          <button className="new-search" onClick={() => { setResult(null); setQuery(""); }}>← Search Another Company</button>
        </section>
      )}
    </main>
  );
}
