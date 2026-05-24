import { Link } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import {
  ShieldCheck,
  QrCode,
  Leaf,
  CheckCircle,
  Scan,
  Lock,
  Zap,
  Eye,
  Fingerprint,
} from "lucide-react";
import Footer from "./landing/Footer";
import CTASection from "./landing/CTASection";
import HeroSection from "./landing/HeroSection";

// ─── Keyframe injection ────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --green: #2d6a4f;
    --green-light: #40916c;
    --green-pale: #d8f3dc;
    --cream: #f8f5f0;
    --dark: #0f1a14;
    --gold: #c9a84c;
    --gold-light: #e8c96b;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--dark); }

  h1,h2,h3,.serif { font-family: 'Cormorant Garamond', serif; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes float {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    50%      { transform: translateY(-14px) rotate(1.5deg); }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes scan {
    0%,100% { top: 8px; }
    50%      { top: calc(100% - 8px); }
  }
  @keyframes pulse-ring {
    0%   { transform: scale(1);   opacity: .6; }
    100% { transform: scale(2.2); opacity: 0; }
  }
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes ticker {
    0%   { opacity: 0; transform: translateY(10px); }
    20%  { opacity: 1; transform: translateY(0); }
    80%  { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-10px); }
  }

  .anim-fadeUp { animation: fadeUp .7s ease both; }
  .anim-fadeIn { animation: fadeIn .9s ease both; }

  .hero-bg {
    background:
      linear-gradient(170deg, rgba(45,106,79,.92) 0%, rgba(15,26,20,.97) 100%),
      url("https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1600&q=80") center/cover no-repeat;
  }

  .glass {
    background: rgba(255,255,255,.07);
    backdrop-filter: blur(18px);
    border: 1px solid rgba(255,255,255,.13);
  }

  .gold-text {
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 60%, var(--gold) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .card-hover {
    transition: transform .3s ease, box-shadow .3s ease;
  }
  .card-hover:hover {
    transform: translateY(-6px);
    box-shadow: 0 24px 48px rgba(45,106,79,.15);
  }

  .btn-primary {
    background: linear-gradient(135deg, var(--gold) 0%, #b8860b 100%);
    color: #0f1a14;
    font-weight: 600;
    letter-spacing: .03em;
    border: none;
    cursor: pointer;
    transition: filter .2s, transform .15s;
  }
  .btn-primary:hover { filter: brightness(1.12); transform: translateY(-1px); }

  .btn-ghost {
    background: transparent;
    border: 1px solid rgba(255,255,255,.3);
    color: #fff;
    cursor: pointer;
    transition: background .2s, border-color .2s;
  }
  .btn-ghost:hover { background: rgba(255,255,255,.1); border-color: rgba(255,255,255,.6); }

  .step-line::after {
    content: '';
    position: absolute;
    top: 26px; right: -30%;
    width: 60%; height: 1px;
    background: linear-gradient(90deg, var(--green-light), transparent);
  }

  .marquee-track { animation: marquee 28s linear infinite; }
  .marquee-track:hover { animation-play-state: paused; }

  .scan-line {
    position: absolute;
    left: 8px; right: 8px; height: 2px;
    background: linear-gradient(90deg, transparent, var(--gold-light), transparent);
    animation: scan 2.4s ease-in-out infinite;
    box-shadow: 0 0 12px var(--gold-light);
  }

  .ticker-num { animation: ticker 3s ease infinite; }

  .noise::before {
    content: '';
    position: absolute; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 1;
  }

  /* ── Language switcher ── */
  .lang-switcher {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 1000;
    display: flex;
    gap: 6px;
    background: rgba(15,26,20,.85);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 14px;
    padding: 6px;
  }
  .lang-btn {
    padding: 6px 14px;
    border-radius: 9px;
    border: none;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background .2s, color .2s;
    letter-spacing: .04em;
    background: transparent;
    color: rgba(255,255,255,.55);
  }
  .lang-btn:hover { background: rgba(255,255,255,.08); color: #fff; }
  .lang-btn.active {
    background: linear-gradient(135deg, var(--gold), #b8860b);
    color: #0f1a14;
  }

  /* Hide the native Google widget UI but keep it functional */
  #google_translate_element { display: none !important; }
  .goog-te-banner-frame { display: none !important; }
  body { top: 0 !important; }
`;

// ─── Tiny helpers ──────────────────────────────────────────────────────────────
function Smartphone({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

function PolygonIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 38 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M29.5 10L19 4L8.5 10V20L19 26L29.5 20V10Z" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="19" cy="10" r="2" fill="currentColor" />
      <circle cx="29.5" cy="20" r="2" fill="currentColor" />
      <circle cx="8.5" cy="20" r="2" fill="currentColor" />
    </svg>
  );
}

// ─── Stat counter ──────────────────────────────────────────────────────────────
function Counter({ to, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        let start = 0;
        const step = to / 60;
        const t = setInterval(() => {
          start += step;
          if (start >= to) { setVal(to); clearInterval(t); }
          else setVal(Math.floor(start));
        }, 16);
      },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

// ─── Google Translate hook ─────────────────────────────────────────────────────
function useGoogleTranslate() {
  const [activeLang, setActiveLang] = useState("en");

  useEffect(() => {
    // Define the callback GT will call once its script loads
    window.googleTranslateElementInit = () => {
      const container = document.getElementById("google_translate_element");
      // Guard: don't double-init if widget already injected
      if (!container || container.innerHTML.trim() !== "") return;

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,hi,bn",
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    // Load script only once
    if (!document.querySelector("#google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google?.translate) {
      // Script already loaded on a re-mount — init directly
      window.googleTranslateElementInit();
    }
  }, []);

  const changeLanguage = (lang) => {
    setActiveLang(lang);

    // Poll for the hidden <select> GT injects, then fire a change event
    let attempts = 0;
    const interval = setInterval(() => {
      const select = document.querySelector(".goog-te-combo");
      if (select) {
        select.value = lang;
        select.dispatchEvent(new Event("change"));
        clearInterval(interval);
      }
      // Stop after ~5 s to avoid infinite polling
      if (++attempts > 50) clearInterval(interval);
    }, 100);
  };

  return { activeLang, changeLanguage };
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [tickerIdx, setTickerIdx] = useState(0);
  const { activeLang, changeLanguage } = useGoogleTranslate();

  const tickers = [
    "AGT-2024-000567 ✓ Verified",
    "AGT-2024-001290 ✓ In Transit",
    "AGT-2024-002034 ✓ Delivered",
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTickerIdx((i) => (i + 1) % tickers.length), 3000);
    return () => clearInterval(t);
  }, []);

  const languages = [
    { code: "en", label: "EN" },
    { code: "hi", label: "हि" },
    { code: "bn", label: "বাং" },
  ];

  return (
    <div>
      <style>{css}</style>

      {/*
        ── GOOGLE TRANSLATE MOUNT POINT ──────────────────────────────────────
        Must be its own dedicated div — hidden via CSS above.
        DO NOT put id="google_translate_element" on the root wrapper.
      */}
      <div id="google_translate_element" />

      {/* ── LANGUAGE SWITCHER (floating bottom-right) ─────────────────────── */}
      <div className="lang-switcher">
        {languages.map(({ code, label }) => (
          <button
            key={code}
            className={`lang-btn${activeLang === code ? " active" : ""}`}
            onClick={() => changeLanguage(code)}
            aria-label={`Switch to ${label}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 50,
          transition: "all .3s",
          background: scrolled ? "rgba(248,245,240,.97)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(45,106,79,.1)" : "none",
          padding: scrolled ? "12px 0" : "20px 0",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ background: "linear-gradient(135deg,#2d6a4f,#40916c)", borderRadius: 10, padding: 7 }}>
              <Leaf style={{ width: 20, height: 20, color: "#fff" }} />
            </div>
            <span className="serif" style={{ fontSize: 22, fontWeight: 600, color: scrolled ? "var(--dark)" : "#fff" }}>
              Agro<span style={{ color: "var(--gold)" }}>Trace</span>
            </span>
          </div>

          {/* Nav links */}
          <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
            {["How It Works", "Features", "Pricing"].map((n) => (
              <a
                key={n}
                href="#"
                style={{
                  color: scrolled ? "#555" : "rgba(255,255,255,.8)",
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "color .2s",
                }}
                onMouseEnter={(e) => (e.target.style.color = scrolled ? "var(--dark)" : "#fff")}
                onMouseLeave={(e) => (e.target.style.color = scrolled ? "#555" : "rgba(255,255,255,.8)")}
              >
                {n}
              </a>
            ))}
          </div>

          {/* Auth buttons */}
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Link to="/login">
              <button style={{ background: "none", border: "none", color: scrolled ? "#555" : "rgba(255,255,255,.8)", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                Sign In
              </button>
            </Link>
            <Link to="/login">
              <button className="btn-primary" style={{ padding: "9px 22px", borderRadius: 10, fontSize: 13 }}>
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <HeroSection />

      {/* ── STATS BAND ───────────────────────────────────────────────────── */}
      <div style={{ background: "var(--dark)", padding: "60px 28px" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 32,
            textAlign: "center",
          }}
        >
          {[
            ["5000", "+", "Active Users"],
            ["1000000", "+", "Batches Tracked"],
            ["99.9", "%", "Uptime"],
            ["180", "+", "Countries"],
          ].map(([n, s, l]) => (
            <div key={l}>
              <div className="serif gold-text" style={{ fontSize: 48, fontWeight: 600 }}>
                <Counter to={parseInt(n)} />
                {s}
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.45)", marginTop: 6, letterSpacing: ".04em" }}>
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── WEB2 vs WEB3 ─────────────────────────────────────────────────── */}
      <section style={{ padding: "100px 28px", background: "var(--cream)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 className="serif" style={{ fontSize: "clamp(30px,4vw,48px)", fontWeight: 600, color: "var(--dark)" }}>
              Best of Both Worlds
            </h2>
            <p style={{ color: "#888", marginTop: 10 }}>Web2 Usability &nbsp;+&nbsp; Web3 Security</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* Web2 card */}
            <div
              className="card-hover"
              style={{ background: "#fff", border: "1px solid #e8e0d5", borderRadius: 22, padding: 40, boxShadow: "0 2px 20px rgba(0,0,0,.05)" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
                <div style={{ background: "#eff6ff", borderRadius: 14, padding: 10 }}>
                  <Zap style={{ width: 24, height: 24, color: "#2563eb" }} />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: ".08em" }}>Layer 1</div>
                  <h3 className="serif" style={{ fontSize: 22, fontWeight: 600, color: "var(--dark)" }}>Fast & User Friendly</h3>
                </div>
              </div>
              {["OTP Authentication", "Fast Database Operations", "No Wallets Required", "Simple Mobile Interface", "Easy Onboarding"].map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 0", borderBottom: "1px solid #f0ebe3" }}>
                  <CheckCircle style={{ width: 16, height: 16, color: "var(--green-light)", flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: "#444" }}>{f}</span>
                </div>
              ))}
            </div>

            {/* Web3 card */}
            <div
              className="card-hover"
              style={{ background: "var(--dark)", border: "1px solid rgba(201,168,76,.2)", borderRadius: 22, padding: 40 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
                <div style={{ background: "rgba(201,168,76,.15)", borderRadius: 14, padding: 10 }}>
                  <ShieldCheck style={{ width: 24, height: 24, color: "var(--gold)" }} />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", textTransform: "uppercase", letterSpacing: ".08em" }}>Layer 2</div>
                  <h3 className="serif" style={{ fontSize: 22, fontWeight: 600, color: "#fff" }}>Tamper Proof & Transparent</h3>
                </div>
              </div>
              {["Polygon Blockchain", "Immutable Records", "Public Verification", "Secure Ownership Transfer", "Transparent Supply Chain"].map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 0", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
                  <ShieldCheck style={{ width: 16, height: 16, color: "var(--gold)", flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,.75)" }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PolygonIcon />

      {/* ── SCAN & VERIFY ────────────────────────────────────────────────── */}
      <section style={{ padding: "100px 28px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--green-pale)", borderRadius: 30, padding: "6px 14px", marginBottom: 20 }}>
              <Scan style={{ width: 12, height: 12, color: "var(--green)" }} />
              <span style={{ fontSize: 12, color: "var(--green)", fontWeight: 500 }}>Customer Experience</span>
            </div>
            <h2 className="serif" style={{ fontSize: "clamp(30px,3.5vw,46px)", fontWeight: 600, color: "var(--dark)", lineHeight: 1.1 }}>
              Scan. Trace.<br />
              <em style={{ color: "var(--green-light)" }}>Trust.</em>
            </h2>
            <p style={{ color: "#888", lineHeight: 1.8, marginTop: 18, marginBottom: 28 }}>
              Customers scan a QR code to view the complete journey of the product — from seed to shelf — backed by tamper-proof blockchain records.
            </p>
            {[
              ["Real-Time Updates", "Every transfer logged instantly"],
              ["Blockchain Verified", "Polygon-secured, immutable"],
              ["Full Transparency", "Every hand it touched"],
              ["Trusted Globally", "Open for public audit"],
            ].map(([t, d]) => (
              <div key={t} style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <div style={{ background: "var(--green-pale)", borderRadius: 8, padding: 6, height: "fit-content" }}>
                  <CheckCircle style={{ width: 14, height: 14, color: "var(--green)" }} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--dark)" }}>{t}</div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{d}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Phone mockup */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ background: "var(--dark)", borderRadius: 40, padding: "12px 12px 20px", width: 240, boxShadow: "0 40px 100px rgba(0,0,0,.25)", animation: "float 7s ease-in-out infinite", border: "1px solid rgba(255,255,255,.08)" }}>
              <div style={{ background: "#fff", borderRadius: 30, overflow: "hidden" }}>
                <div style={{ background: "linear-gradient(135deg,var(--green),var(--green-light))", padding: "20px 16px 14px" }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,.7)", letterSpacing: ".06em" }}>AGROTRACE</div>
                  <div style={{ color: "#fff", fontWeight: 600, fontSize: 14, marginTop: 2 }}>Product Journey</div>
                </div>
                <div style={{ padding: 16 }}>
                  <div style={{ position: "relative", background: "#f4f4f4", borderRadius: 12, padding: 12, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <QrCode style={{ width: 80, height: 80, color: "#1a1a1a" }} />
                    <div className="scan-line" style={{ background: "linear-gradient(90deg,transparent,var(--green-light),transparent)" }} />
                  </div>
                  {[
                    ["Origin", "Rajshahi, BD"],
                    ["Processed", "Dhaka Plant"],
                    ["Shipped", "Express Cargo"],
                    ["Store", "GreenMart #42"],
                  ].map(([k, v], i) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: i < 3 ? "1px solid #f0f0f0" : "none" }}>
                      <span style={{ fontSize: 11, color: "#888" }}>{k}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#222" }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 14, background: "var(--green-pale)", borderRadius: 8, padding: "8px 10px", display: "flex", alignItems: "center", gap: 6 }}>
                    <CheckCircle style={{ width: 14, height: 14, color: "var(--green)" }} />
                    <span style={{ fontSize: 11, color: "var(--green)", fontWeight: 600 }}>Blockchain Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECURITY ─────────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 28px", background: "var(--dark)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 className="serif" style={{ fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 600, color: "#fff" }}>
              Security & Transparency
            </h2>
            <p style={{ color: "rgba(255,255,255,.45)", marginTop: 10 }}>Built on trust, secured by blockchain</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {[
              { icon: Lock,        title: "Immutable Records",      desc: "Once recorded on Polygon, history cannot be altered or deleted by anyone.",               color: "var(--gold)"  },
              { icon: Fingerprint, title: "OTP Verified Transfers", desc: "Every ownership transfer requires OTP verification — no unauthorized moves.",             color: "#60a5fa"      },
              { icon: Eye,         title: "Public Verification",    desc: "Anyone with the QR code can verify the product's journey in real time.",                  color: "#a78bfa"      },
            ].map((c, i) => (
              <div
                key={i}
                className="card-hover"
                style={{ border: "1px solid rgba(255,255,255,.08)", borderRadius: 20, padding: 32, textAlign: "center", background: "rgba(255,255,255,.03)" }}
              >
                <div style={{ width: 60, height: 60, borderRadius: "50%", border: `1px solid ${c.color}33`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", position: "relative" }}>
                  <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `1px solid ${c.color}`, animation: "pulse-ring 2.5s ease-out infinite", animationDelay: `${i * 0.4}s` }} />
                  <c.icon style={{ width: 26, height: 26, color: c.color }} />
                </div>
                <h3 className="serif" style={{ fontSize: 20, fontWeight: 600, color: "#fff", marginBottom: 10 }}>{c.title}</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,.45)", lineHeight: 1.7 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </div>
  );
}