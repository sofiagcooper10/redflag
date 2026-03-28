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
          <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="15" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.5"/>
            <path d="M16 9v8" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="16" cy="21.5" r="1.5" fill="#ef4444"/>
          </svg>
          <div>
            <div className="logo-text">RED FLAG</div>
            <div className="logo-sub">CORPORATE LEGAL INTELLIGENCE</div>
          </div>
        </div>
        <div className="header-badge">AI-POWERED RESEARCH</div>
      </header>

      {!result && !loading && (
        <section className="hero">
          <h1 className="hero-headline">
            Every company<br />has a story.<br />
            <span className="accent">Find theirs.</span>
          </h1>
          <p className="hero-sub">
            Enter any company name to instantly generate its complete legal biography —
            lawsuits, settlements, regulatory actions, and an AI risk score.
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

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=IBM+Plex+Mono:wght@400;600&family=Inter:wght@300;400;500;600&display=swap');
        body { background: #faf9f6; color: #1a1a1a; font-family: 'Inter', sans-serif; min-height: 100vh; }
        main { max-width: 960px; margin: 0 auto; padding: 0 28px 100px; }
        header { display: flex; justify-content: space-between; align-items: center; padding: 28px 0; border-bottom: 1.5px solid #e8e4dc; margin-bottom: 60px; }
        .logo-wrap { display: flex; align-items: center; gap: 12px; }
        .logo-text { font-family: 'IBM Plex Mono', monospace; font-size: 20px; font-weight: 600; letter-spacing: 0.12em; color: #111; }
        .logo-sub { font-family: 'IBM Plex Mono', monospace; font-size: 8px; letter-spacing: 0.18em; color: #bbb; margin-top: 3px; }
        .header-badge { font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: 0.1em; color: #ef4444; border: 1px solid #fca5a5; background: #fff5f5; padding: 5px 12px; border-radius: 20px; }
        .hero { margin-bottom: 52px; }
        .hero-headline { font-family: 'Playfair Display', serif; font-size: clamp(42px, 7vw, 72px); line-height: 1.08; color: #111; margin-bottom: 20px; font-weight: 700; }
        .accent { color: #ef4444; }
        .hero-sub { font-size: 16px; color: #6b7280; max-width: 500px; line-height: 1.75; }
        .search-section { margin-bottom: 56px; }
        .search-bar { display: flex; align-items: center; background: #fff; border: 1.5px solid #e5e7eb; border-radius: 12px; padding: 6px 6px 6px 18px; gap: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); transition: border-color 0.2s, box-shadow 0.2s; }
        .search-bar:focus-within { border-color: #ef4444; box-shadow: 0 2px 20px rgba(239,68,68,0.1); }
        .search-input { flex: 1; background: transparent; border: none; outline: none; font-size: 16px; color: #111; font-family: 'Inter', sans-serif; padding: 10px 0; }
        .search-input::placeholder { color: #d1d5db; }
        .search-btn { background: #ef4444; color: white; border: none; padding: 12px 24px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 600; letter-spacing: 0.05em; cursor: pointer; border-radius: 8px; transition: background 0.2s, transform 0.1s; white-space: nowrap; }
        .search-btn:hover:not(:disabled) { background: #dc2626; transform: translateY(-1px); }
        .search-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .examples { display: flex; align-items: center; gap: 8px; margin-top: 14px; flex-wrap: wrap; }
        .examples-label { font-size: 12px; color: #9ca3af; font-weight: 500; }
        .example-pill { background: #fff; border: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; padding: 5px 14px; border-radius: 20px; cursor: pointer; transition: all 0.2s; font-weight: 500; }
        .example-pill:hover { border-color: #ef4444; color: #ef4444; background: #fff5f5; }
        .loading-wrap { text-align: center; padding: 80px 0; }
        .flag-pulse { display: inline-block; animation: flagpulse 1.2s ease-in-out infinite; margin-bottom: 20px; }
        @keyframes flagpulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.2); opacity: 0.6; } }
        .loading-msg { font-family: 'IBM Plex Mono', monospace; font-size: 13px; color: #9ca3af; letter-spacing: 0.05em; margin-bottom: 20px; }
        .loading-bar-wrap { width: 240px; height: 3px; background: #f3f4f6; margin: 0 auto; border-radius: 2px; overflow: hidden; }
        .loading-bar { height: 100%; background: linear-gradient(to right, #ef4444, #f87171); border-radius: 2px; animation: loadbar 1.8s ease-in-out infinite; }
        @keyframes loadbar { 0% { width: 0%; margin-left: 0%; } 50% { width: 70%; margin-left: 15%; } 100% { width: 0%; margin-left: 100%; } }
        .error-msg { background: #fff5f5; border: 1px solid #fca5a5; color: #dc2626; font-size: 13px; padding: 14px 18px; border-radius: 8px; margin-bottom: 24px; }
        .results { display: flex; flex-direction: column; gap: 28px; }
        .result-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; flex-wrap: wrap; padding-bottom: 28px; border-bottom: 1.5px solid #e8e4dc; }
        .company-name { font-family: 'Playfair Display', serif; font-size: clamp(32px, 5vw, 52px); color: #111; margin-bottom: 14px; font-weight: 700; }
        .verdict-box { background: #fff; border: 1.5px solid #e5e7eb; border-left: 4px solid #ef4444; padding: 18px 22px; max-width: 340px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .verdict-label { font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: 0.18em; color: #9ca3af; display: block; margin-bottom: 10px; }
        .verdict-text { font-family: 'Playfair Display', serif; font-size: 15px; color: #374151; line-height: 1.6; font-style: italic; }
        .grid-two { display: grid; grid-template-columns: 1fr 300px; gap: 24px; align-items: start; }
        @media (max-width: 720px) { .grid-two { grid-template-columns: 1fr; } .result-header { flex-direction: column; } .verdict-box { max-width: 100%; } }
        .summary-card { background: #fff; border: 1.5px solid #e5e7eb; padding: 28px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .section-label { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.12em; color: #9ca3af; margin-bottom: 18px; font-weight: 600; }
        .summary-para { font-size: 14px; color: #374151; line-height: 1.8; margin-bottom: 16px; }
        .summary-para:last-child { margin-bottom: 0; }
        .disclaimer { font-size: 11px; color: #d1d5db; line-height: 1.6; text-align: center; }
        .new-search { background: transparent; border: 1.5px solid #e5e7eb; color: #6b7280; font-family: 'Inter', sans-serif; font-size: 13px; padding: 10px 20px; border-radius: 8px; cursor: pointer; transition: all 0.2s; align-self: flex-start; font-weight: 500; }
        .new-search:hover { border-color: #ef4444; color: #ef4444; }
        .how-it-works { display: flex; align-items: center; gap: 12px; margin-bottom: 52px; background: #fff; border: 1.5px solid #e5e7eb; border-radius: 12px; padding: 20px 28px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); flex-wrap: wrap; }
        .hiw-step { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1; min-width: 100px; }
        .hiw-icon { font-size: 24px; }
        .hiw-title { font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600; color: #111; letter-spacing: 0.05em; }
        .hiw-desc { font-size: 11px; color: #9ca3af; text-align: center; line-height: 1.4; }
        .hiw-arrow { font-size: 18px; color: #d1d5db; flex-shrink: 0; }
      `}</style>
    </main>
  );
}
