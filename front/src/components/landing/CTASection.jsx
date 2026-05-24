import { Leaf } from "lucide-react";

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
`;

const CTASection = () => {
  return (
          <section style={{ padding: "100px 28px", background: "var(--cream)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div
            style={{
              background:
                "linear-gradient(135deg, var(--dark) 0%, #1a3028 100%)",
              borderRadius: 28,
              padding: "70px 56px",
              textAlign: "center",
              border: "1px solid rgba(201,168,76,.25)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "radial-gradient(circle at 80% 20%, rgba(201,168,76,.08) 0%, transparent 50%)",
                pointerEvents: "none",
              }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(201,168,76,.12)",
                  border: "1px solid rgba(201,168,76,.3)",
                  borderRadius: 30,
                  padding: "6px 16px",
                  marginBottom: 24,
                }}
              >
                <Leaf style={{ width: 12, height: 12, color: "var(--gold)" }} />
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--gold-light)",
                    fontWeight: 500,
                  }}
                >
                  Start for free
                </span>
              </div>
              <h2
                className="serif"
                style={{
                  fontSize: "clamp(28px,4vw,48px)",
                  fontWeight: 600,
                  color: "#fff",
                  lineHeight: 1.1,
                  marginBottom: 18,
                }}
              >
                Build Trust Into
                <br />
                Every Food Product
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,.5)",
                  marginBottom: 36,
                  maxWidth: 420,
                  margin: "0 auto 36px",
                }}
              >
                Join AgroTrace and make your supply chain transparent, secure,
                and trusted by customers worldwide.
              </p>
              <div
                style={{ display: "flex", gap: 14, justifyContent: "center" }}
              >
                <button
                  className="btn-primary"
                  style={{
                    padding: "14px 32px",
                    borderRadius: 13,
                    fontSize: 15,
                  }}
                >
                  Get Started Today
                </button>
                <button
                  className="btn-ghost"
                  style={{
                    padding: "14px 32px",
                    borderRadius: 13,
                    fontSize: 15,
                  }}
                >
                  View Demo
                </button>
              </div>
              <p
                style={{
                  color: "rgba(255,255,255,.3)",
                  fontSize: 12,
                  marginTop: 18,
                }}
              >
                Free trial · No credit card required · Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>
  )
}

export default CTASection
