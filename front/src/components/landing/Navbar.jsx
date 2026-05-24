import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
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
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              background: "linear-gradient(135deg,#2d6a4f,#40916c)",
              borderRadius: 10,
              padding: 7,
            }}
          >
            <Leaf style={{ width: 20, height: 20, color: "#fff" }} />
          </div>
          <div>
            <span
              className="serif"
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: scrolled ? "var(--dark)" : "#fff",
              }}
            >
              Agro<span style={{ color: "var(--gold)" }}>Trace</span>
            </span>
            <div
              style={{
                fontSize: 9,
                color: scrolled ? "#888" : "rgba(255,255,255,.5)",
                marginTop: -2,
                letterSpacing: ".08em",
                textTransform: "uppercase",
              }}
            ></div>
          </div>
        </div>

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
              onMouseEnter={(e) =>
                (e.target.style.color = scrolled ? "var(--dark)" : "#fff")
              }
              onMouseLeave={(e) =>
                (e.target.style.color = scrolled
                  ? "#555"
                  : "rgba(255,255,255,.8)")
              }
            >
              {n}
            </a>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link to="/login">
            <button
              style={{
                background: "none",
                border: "none",
                color: scrolled ? "#555" : "rgba(255,255,255,.8)",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Sign In
            </button>
          </Link>
          <Link to="/login">
            <button
              className="btn-primary"
              style={{
                padding: "9px 22px",
                borderRadius: 10,
                fontSize: 13,
              }}
            >
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
