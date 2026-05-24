import { Leaf } from "lucide-react";

function PolygonIcon() {
  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 38 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M29.5 10L19 4L8.5 10V20L19 26L29.5 20V10Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="19" cy="10" r="2" fill="currentColor" />
      <circle cx="29.5" cy="20" r="2" fill="currentColor" />
      <circle cx="8.5" cy="20" r="2" fill="currentColor" />
    </svg>
  );
}

const Footer = () => {
  return (
    <footer style={{ background: "#080f0a", padding: "56px 28px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 48,
            marginBottom: 48,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  background: "linear-gradient(135deg,#2d6a4f,#40916c)",
                  borderRadius: 9,
                  padding: 6,
                }}
              >
                <Leaf style={{ width: 18, height: 18, color: "#fff" }} />
              </div>
              <span
                className="serif"
                style={{ fontSize: 20, fontWeight: 600, color: "#fff" }}
              >
                Agro<span style={{ color: "var(--gold)" }}>Trace</span>
              </span>
            </div>
            <p
              style={{
                color: "rgba(255,255,255,.35)",
                fontSize: 13,
                lineHeight: 1.75,
                maxWidth: 260,
              }}
            >
              A Web2.5 food supply chain tracking platform powered by Polygon
              blockchain.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <div
                style={{
                  background: "rgba(255,255,255,.07)",
                  borderRadius: 8,
                  padding: 7,
                }}
              >
                <PolygonIcon />
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,.07)",
                  borderRadius: 8,
                  padding: "7px 10px",
                  fontSize: 11,
                  color: "rgba(255,255,255,.5)",
                  fontFamily: "monospace",
                }}
              >
                OZ
              </div>
            </div>
          </div>
          {[
            ["Resources", ["How It Works", "Product", "Features", "Pricing"]],
            ["Company", ["About Us", "Contact", "Privacy Policy", "Terms"]],
            ["Powered By", ["Polygon", "OpenZeppelin", "Solidity", "React"]],
          ].map(([title, links]) => (
            <div key={title}>
              <h4
                style={{
                  color: "#fff",
                  fontWeight: 600,
                  marginBottom: 18,
                  fontSize: 14,
                }}
              >
                {title}
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      style={{
                        color: "rgba(255,255,255,.35)",
                        fontSize: 13,
                        textDecoration: "none",
                        transition: "color .2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.color = "var(--gold)")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.color = "rgba(255,255,255,.35)")
                      }
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,.07)",
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ color: "rgba(255,255,255,.25)", fontSize: 12 }}>
            © 2024 AgroTrace. All rights reserved.
          </span>
          <span style={{ color: "rgba(255,255,255,.25)", fontSize: 12 }}>
            Built with care for food transparency.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
