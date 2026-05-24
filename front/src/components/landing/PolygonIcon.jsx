import { ShieldCheck, CheckCircle, Zap } from "lucide-react";
import ".../styles/landing.css"
const PolygonIcon = () => {
  return (
          <section style={{ padding: "100px 28px", background: "var(--cream)" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: 56 }}>
                <h2
                  className="serif"
                  style={{
                    fontSize: "clamp(30px,4vw,48px)",
                    fontWeight: 600,
                    color: "var(--dark)",
                  }}
                >
                  Best of Both Worlds
                </h2>
                <p style={{ color: "#888", marginTop: 10 }}>
                  Web2 Usability &nbsp;+&nbsp; Web3 Security
                </p>
              </div>
    
              <div
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}
              >
                {/* Web2 */}
                <div
                  className="card-hover"
                  style={{
                    background: "#fff",
                    border: "1px solid #e8e0d5",
                    borderRadius: 22,
                    padding: 40,
                    boxShadow: "0 2px 20px rgba(0,0,0,.05)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      marginBottom: 28,
                    }}
                  >
                    <div
                      style={{
                        background: "#eff6ff",
                        borderRadius: 14,
                        padding: 10,
                      }}
                    >
                      <Zap style={{ width: 24, height: 24, color: "#2563eb" }} />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "#888",
                          textTransform: "uppercase",
                          letterSpacing: ".08em",
                        }}
                      >
                        Layer 1
                      </div>
                      <h3
                        className="serif"
                        style={{
                          fontSize: 22,
                          fontWeight: 600,
                          color: "var(--dark)",
                        }}
                      >
                        Fast & User Friendly
                      </h3>
                    </div>
                  </div>
                  {[
                    "OTP Authentication",
                    "Fast Database Operations",
                    "No Wallets Required",
                    "Simple Mobile Interface",
                    "Easy Onboarding",
                  ].map((f) => (
                    <div
                      key={f}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "11px 0",
                        borderBottom: "1px solid #f0ebe3",
                      }}
                    >
                      <CheckCircle
                        style={{
                          width: 16,
                          height: 16,
                          color: "var(--green-light)",
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: 14, color: "#444" }}>{f}</span>
                    </div>
                  ))}
                </div>
    
                {/* Web3 */}
                <div
                  className="card-hover"
                  style={{
                    background: "var(--dark)",
                    border: "1px solid rgba(201,168,76,.2)",
                    borderRadius: 22,
                    padding: 40,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      marginBottom: 28,
                    }}
                  >
                    <div
                      style={{
                        background: "rgba(201,168,76,.15)",
                        borderRadius: 14,
                        padding: 10,
                      }}
                    >
                      <ShieldCheck
                        style={{ width: 24, height: 24, color: "var(--gold)" }}
                      />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "rgba(255,255,255,.4)",
                          textTransform: "uppercase",
                          letterSpacing: ".08em",
                        }}
                      >
                        Layer 2
                      </div>
                      <h3
                        className="serif"
                        style={{ fontSize: 22, fontWeight: 600, color: "#fff" }}
                      >
                        Tamper Proof & Transparent
                      </h3>
                    </div>
                  </div>
                  {[
                    "Polygon Blockchain",
                    "Immutable Records",
                    "Public Verification",
                    "Secure Ownership Transfer",
                    "Transparent Supply Chain",
                  ].map((f) => (
                    <div
                      key={f}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "11px 0",
                        borderBottom: "1px solid rgba(255,255,255,.07)",
                      }}
                    >
                      <ShieldCheck
                        style={{
                          width: 16,
                          height: 16,
                          color: "var(--gold)",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{ fontSize: 14, color: "rgba(255,255,255,.75)" }}
                      >
                        {f}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
  );
};

export default PolygonIcon;
