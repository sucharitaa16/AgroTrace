import { Eye, Fingerprint } from "lucide-react";
const SecuritySection = () => {
  return (
    <>
    <section style={{ padding: "80px 28px", background: "var(--dark)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2
            className="serif"
            style={{
              fontSize: "clamp(28px,3.5vw,44px)",
              fontWeight: 600,
              color: "#fff",
            }}
          >
            Security & Transparency
          </h2>
          <p style={{ color: "rgba(255,255,255,.45)", marginTop: 10 }}>
            Built on trust, secured by blockchain
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 20,
          }}
        >
          {[
            {
              icon: Lock,
              title: "Immutable Records",
              desc: "Once recorded on Polygon, history cannot be altered or deleted by anyone.",
              color: "var(--gold)",
            },
            {
              icon: Fingerprint,
              title: "OTP Verified Transfers",
              desc: "Every ownership transfer requires OTP verification — no unauthorized moves.",
              color: "#60a5fa",
            },
            {
              icon: Eye,
              title: "Public Verification",
              desc: "Anyone with the QR code can verify the product's journey in real time.",
              color: "#a78bfa",
            },
          ].map((c, i) => (
            <div
              key={i}
              className="card-hover"
              style={{
                border: "1px solid rgba(255,255,255,.08)",
                borderRadius: 20,
                padding: 32,
                textAlign: "center",
                background: "rgba(255,255,255,.03)",
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  border: `1px solid ${c.color}33`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    border: `1px solid ${c.color}`,
                    animation: "pulse-ring 2.5s ease-out infinite",
                    animationDelay: `${i * 0.4}s`,
                  }}
                />
                <c.icon style={{ width: 26, height: 26, color: c.color }} />
              </div>
              <h3
                className="serif"
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#fff",
                  marginBottom: 10,
                }}
              >
                {c.title}
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,.45)",
                  lineHeight: 1.7,
                }}
              >
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section></>
  );
};

export default SecuritySection;
