import {
  QrCode,
  ArrowRight,
  BadgeCheck,
  Scan,
  Leaf,
  Factory,
  Truck,
  Store,
} from "lucide-react";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const [tickerIdx, setTickerIdx] = useState(0);
  const tickers = [
    "AGT-2024-000567 ✓ Verified",
    "AGT-2024-001290 ✓ In Transit",
    "AGT-2024-002034 ✓ Delivered",
  ];

  useEffect(() => {
    const t = setInterval(
      () => setTickerIdx((i) => (i + 1) % tickers.length),
      3000,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      
      <section
        className="hero-bg noise"
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* Decorative orbs */}
        <div
          style={{
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(201,168,76,.15) 0%, transparent 70%)",
            top: -100,
            right: -100,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(64,145,108,.2) 0%, transparent 70%)",
            bottom: 60,
            left: -60,
            pointerEvents: "none",
          }}
        />

        {/* Ticker bar */}
        <div
          style={{
            position: "absolute",
            top: 80,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          <div
            className="glass"
            style={{
              padding: "6px 18px",
              borderRadius: 30,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#4caf50",
                display: "inline-block",
                boxShadow: "0 0 0 3px rgba(76,175,80,.3)",
                flexShrink: 0,
              }}
            />
            <span
              className="ticker-num"
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,.85)",
                fontFamily: "monospace",
                minWidth: 220,
              }}
              key={tickerIdx}
            >
              {tickers[tickerIdx]}
            </span>
          </div>
        </div>

        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "120px 28px 80px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "center",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Left copy */}
          <div>
            <div
              className="anim-fadeUp"
              style={{
                animationDelay: ".1s",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(201,168,76,.15)",
                border: "1px solid rgba(201,168,76,.35)",
                borderRadius: 30,
                padding: "6px 16px",
                marginBottom: 24,
              }}
            >
              <BadgeCheck
                style={{ width: 14, height: 14, color: "var(--gold)" }}
              />
              <span
                style={{
                  fontSize: 12,
                  color: "var(--gold-light)",
                  fontWeight: 500,
                  letterSpacing: ".04em",
                }}
              >
                Trusted by 5,000+ users worldwide
              </span>
            </div>

            <h1
              className="serif anim-fadeUp"
              style={{
                fontSize: "clamp(42px,5vw,68px)",
                fontWeight: 600,
                lineHeight: 1.08,
                color: "#fff",
                animationDelay: ".2s",
              }}
            >
              Track Every Food
              <br />
              <em className="gold-text" style={{ fontStyle: "italic" }}>
                Farm To Shelf.
              </em>
            </h1>

            <p
              className="anim-fadeUp"
              style={{
                color: "rgba(255,255,255,.65)",
                fontSize: 16,
                lineHeight: 1.75,
                marginTop: 22,
                maxWidth: 440,
                animationDelay: ".35s",
              }}
            >
              A Web2.5 supply chain platform combining OTP verified ownership
              transfer with tamper‑proof blockchain records — no wallets, no
              friction.
            </p>

            <div
              className="anim-fadeUp"
              style={{
                display: "flex",
                gap: 14,
                marginTop: 36,
                animationDelay: ".48s",
              }}
            >
              <button
                className="btn-primary"
                style={{
                  padding: "13px 28px",
                  borderRadius: 12,
                  fontSize: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                Track a Product <ArrowRight style={{ width: 15, height: 15 }} />
              </button>
              <button
                className="btn-ghost"
                style={{ padding: "13px 28px", borderRadius: 12, fontSize: 14 }}
              >
                Explore System
              </button>
            </div>

            {/* Stats row */}
            <div
              className="anim-fadeUp"
              style={{
                display: "flex",
                gap: 36,
                marginTop: 48,
                animationDelay: ".6s",
              }}
            >
              {[
                ["5K+", "Users"],
                ["99.9%", "Uptime"],
                ["1M+", "Batches Tracked"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div
                    className="serif gold-text"
                    style={{ fontSize: 28, fontWeight: 600 }}
                  >
                    {n}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,.5)",
                      marginTop: 2,
                    }}
                  >
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — tracking card */}
          <div className="anim-fadeUp" style={{ animationDelay: ".3s" }}>
            {/* Floating farm image */}
            <div style={{ position: "relative", marginBottom: 20 }}>
              <div
                style={{
                  borderRadius: 20,
                  overflow: "hidden",
                  aspectRatio: "16/9",
                  animation: "float 6s ease-in-out infinite",
                  boxShadow: "0 32px 80px rgba(0,0,0,.45)",
                  border: "1px solid rgba(255,255,255,.12)",
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=900&q=80"
                  alt="Farm fields"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg,transparent 50%,rgba(15,26,20,.7))",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 14,
                    left: 16,
                    right: 16,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,.7)",
                      letterSpacing: ".06em",
                      textTransform: "uppercase",
                    }}
                  >
                    Origin
                  </div>
                  <div style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>
                    Hooghly, West Bengal
                  </div>
                </div>
                <div style={{ position: "absolute", top: 12, right: 12 }}>
                  <div
                    style={{
                      background: "rgba(76,175,80,.9)",
                      borderRadius: 20,
                      padding: "4px 10px",
                      fontSize: 11,
                      color: "#fff",
                      fontWeight: 600,
                    }}
                  >
                    ● LIVE
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking card */}
            <div className="glass" style={{ borderRadius: 18, padding: 22 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 16,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,.5)",
                      letterSpacing: ".06em",
                      textTransform: "uppercase",
                    }}
                  >
                    Current Batch
                  </div>
                  <div
                    style={{
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: 15,
                      marginTop: 2,
                    }}
                  >
                    AGT-2024-000567
                  </div>
                </div>
                {/* QR with scan line */}
                <div
                  style={{
                    position: "relative",
                    background: "#fff",
                    borderRadius: 10,
                    padding: 8,
                    width: 56,
                    height: 56,
                  }}
                >
                  <QrCode style={{ width: 40, height: 40, color: "#0f1a14" }} />
                  <div className="scan-line" />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px 24px",
                  marginBottom: 16,
                }}
              >
                {[
                  ["Product", "Fresh Mango"],
                  ["Quantity", "1,000 kg"],
                  ["Status", "In Store"],
                  ["Owner", "Retailer"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      paddingBottom: 8,
                      borderBottom: "1px solid rgba(255,255,255,.08)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        color: "rgba(255,255,255,.4)",
                        letterSpacing: ".05em",
                        textTransform: "uppercase",
                      }}
                    >
                      {k}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#fff",
                        fontWeight: 500,
                        marginTop: 2,
                      }}
                    >
                      {v}
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: 12,
                  borderTop: "1px solid rgba(255,255,255,.1)",
                }}
              >
                <span style={{ fontSize: 11, color: "rgba(255,255,255,.4)" }}>
                  Blockchain Tx
                </span>
                <code
                  style={{
                    fontSize: 11,
                    background: "rgba(201,168,76,.15)",
                    color: "var(--gold-light)",
                    padding: "3px 8px",
                    borderRadius: 6,
                  }}
                >
                  0xfa8a…ef2a9b
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: 28,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            zIndex: 2,
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,.4)",
              letterSpacing: ".1em",
              textTransform: "uppercase",
            }}
          >
            Scroll
          </span>
          <div
            style={{
              width: 1,
              height: 40,
              background:
                "linear-gradient(180deg,rgba(255,255,255,.4),transparent)",
            }}
          />
        </div>
      </section>

      <div
        style={{
          background: "var(--dark)",
          padding: "16px 0",
          overflow: "hidden",
          borderBottom: "1px solid rgba(201,168,76,.2)",
        }}
      >
        <div
          className="marquee-track"
          style={{
            display: "flex",
            gap: 56,
            whiteSpace: "nowrap",
            width: "max-content",
          }}
        >
          {[...Array(2)].flatMap(() =>
            [
              "✦ OTP Authentication",
              "✦ Polygon Blockchain",
              "✦ No Wallets Required",
              "✦ Immutable Records",
              "✦ QR Verification",
              "✦ Real-Time Tracking",
              "✦ Public Transparency",
            ].map((t) => (
              <span
                key={t + Math.random()}
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,.45)",
                  fontWeight: 400,
                  letterSpacing: ".06em",
                }}
              >
                {t}
              </span>
            )),
          )}
        </div>
      </div>

      <section
        style={{ padding: "100px 28px", maxWidth: 1200, margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span
            style={{
              fontSize: 11,
              color: "var(--green-light)",
              fontWeight: 600,
              letterSpacing: ".12em",
              textTransform: "uppercase",
            }}
          >
            Web2.5 Architecture
          </span>
          <h2
            className="serif"
            style={{
              fontSize: "clamp(32px,4vw,50px)",
              fontWeight: 600,
              color: "var(--dark)",
              marginTop: 8,
            }}
          >
            How AgroTrace Works
          </h2>
          <p
            style={{
              color: "#888",
              marginTop: 12,
              maxWidth: 500,
              margin: "12px auto 0",
              lineHeight: 1.7,
            }}
          >
            Every ownership transfer is verified off-chain and permanently
            recorded on Polygon blockchain.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5,1fr)",
            gap: 20,
            position: "relative",
          }}
        >
          {[
            {
              step: "01",
              title: "Farmer Creates Batch",
              desc: "Registers crop details, harvest date, quantity & origin.",
              icon: Leaf,
              img: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&q=70",
            },
            {
              step: "02",
              title: "Manufacturer Accepts",
              desc: "OTP-verified ownership transfer before processing.",
              icon: Factory,
              img: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=400&q=70",
            },
            {
              step: "03",
              title: "Distributor Ships",
              desc: "Logistics, warehouse updates & shipping records added.",
              icon: Truck,
              img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=70",
            },
            {
              step: "04",
              title: "Retailer Generates QR",
              desc: "Customer-facing QR with full traceability history.",
              icon: Store,
              img: "https://images.unsplash.com/photo-1601598851547-4302969d0614?w=400&q=70",
            },
            {
              step: "05",
              title: "Customer Verifies",
              desc: "Scan QR to see the entire farm-to-shelf journey.",
              icon: Scan,
              img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=70",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="card-hover"
              style={{
                position: "relative",
                background: "#fff",
                border: "1px solid #e8e0d5",
                borderRadius: 18,
                overflow: "hidden",
                boxShadow: "0 2px 16px rgba(0,0,0,.05)",
              }}
            >
              <div style={{ height: 110, overflow: "hidden" }}>
                <img
                  src={s.img}
                  alt={s.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform .4s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.transform = "scale(1.08)")
                  }
                  onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                />
              </div>
              <div style={{ padding: "16px 16px 20px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <span
                    className="serif"
                    style={{
                      fontSize: 28,
                      fontWeight: 600,
                      color: "var(--green-pale)",
                      WebkitTextStroke: "1px var(--green-light)",
                    }}
                  >
                    {s.step}
                  </span>
                  <div
                    style={{
                      background: "var(--green-pale)",
                      borderRadius: 10,
                      padding: 6,
                    }}
                  >
                    <s.icon
                      style={{ width: 16, height: 16, color: "var(--green)" }}
                    />
                  </div>
                </div>
                <h3
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--dark)",
                    marginBottom: 6,
                    lineHeight: 1.3,
                  }}
                >
                  {s.title}
                </h3>
                <p style={{ fontSize: 11, color: "#888", lineHeight: 1.6 }}>
                  {s.desc}
                </p>
              </div>
              {i < 4 && (
                <div
                  style={{
                    position: "absolute",
                    top: 55,
                    right: -12,
                    fontSize: 18,
                    color: "var(--gold)",
                    zIndex: 3,
                    textShadow: "0 0 12px rgba(201,168,76,.4)",
                  }}
                >
                  ›
                </div>
              )}
            </div>
          ))}
        </div>
      </section>


    </div>
  );
};

export default HeroSection;
