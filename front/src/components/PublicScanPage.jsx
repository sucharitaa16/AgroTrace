import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

const BASE = import.meta.env.VITE_API_URL || "https://agrotrace-25g0.onrender.com/api";

export default function PublicScanPage() {
  const { productId } = useParams();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${BASE}/products/history/${productId}`);
        const data = await res.json();

        if (data.success && data.product) {
          setProduct(data.product);
        } else {
          setProduct(null);
        }
      } catch (e) {
        console.error(e);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [productId]);

  const statusMap = {
    manufactured: { color: "#1d4ed8", bg: "#dbeafe", border: "#bfdbfe" },
    shipped: { color: "#b45309", bg: "#fef3c7", border: "#fde68a" },
    "in transit": { color: "#6d28d9", bg: "#ede9fe", border: "#ddd6fe" },
    delivered: { color: "#047857", bg: "#d1fae5", border: "#a7f3d0" },
  };

  const statusStyle = useMemo(() => {
    return (
      statusMap[product?.status?.toLowerCase()] || {
        color: "#374151",
        bg: "#f3f4f6",
        border: "#e5e7eb",
      }
    );
  }, [product]);

  const sortedHistory = useMemo(() => {
    return [...(product?.history || [])].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
  }, [product]);

  const pageStyle = {
    minHeight: "100vh",
    background: "#f4f6f8",
    padding: "32px 16px",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: "#111827",
  };

  const containerStyle = {
    maxWidth: 1100,
    margin: "0 auto",
  };

  const panelStyle = {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <div
          style={{
            ...containerStyle,
            display: "grid",
            placeItems: "center",
            minHeight: "70vh",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 42,
                height: 42,
                margin: "0 auto 14px",
                border: "3px solid #dbe3ea",
                borderTop: "3px solid #1d4ed8",
                borderRadius: "50%",
                animation: "spin 0.9s linear infinite",
              }}
            />
            <div style={{ fontSize: 18, fontWeight: 600, color: "#111827" }}>
              Verifying product record
            </div>
            <div style={{ marginTop: 6, fontSize: 14, color: "#6b7280" }}>
              Fetching blockchain-backed supply chain history
            </div>
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={pageStyle}>
        <div
          style={{
            ...containerStyle,
            display: "grid",
            placeItems: "center",
            minHeight: "70vh",
          }}
        >
          <div
            style={{
              ...panelStyle,
              width: "100%",
              maxWidth: 560,
              padding: 32,
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                margin: "0 auto 16px",
                borderRadius: 14,
                background: "#f3f4f6",
                display: "grid",
                placeItems: "center",
                fontSize: 22,
                fontWeight: 700,
                color: "#6b7280",
              }}
            >
              !
            </div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>
              Product record not found
            </h1>
            <p style={{ marginTop: 10, color: "#6b7280", fontSize: 15 }}>
              No verified blockchain history is available for this product ID.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div
          style={{
            ...panelStyle,
            padding: 24,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#6b7280",
                  marginBottom: 10,
                }}
              >
                Public Verification Portal
              </div>
              <h1
                style={{
                  margin: 0,
                  fontSize: 28,
                  lineHeight: 1.2,
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                {product.productName}
              </h1>
              <div
                style={{
                  marginTop: 8,
                  fontSize: 14,
                  color: "#6b7280",
                }}
              >
                Product traceability and chain-of-custody record
              </div>
            </div>

            <div
              style={{
                padding: "8px 12px",
                borderRadius: 999,
                border: `1px solid ${statusStyle.border}`,
                background: statusStyle.bg,
                color: statusStyle.color,
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                whiteSpace: "nowrap",
              }}
            >
              {product.status}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 20,
            alignItems: "start",
          }}
        >
          <div style={{ display: "grid", gap: 20 }}>
            <div style={{ ...panelStyle, padding: 24 }}>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  marginBottom: 18,
                  color: "#111827",
                }}
              >
                Product details
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 18,
                }}
              >
                <Field label="Product ID" value={product.productId} mono />
                <Field label="Category" value={product.category || "—"} />
                <Field
                  label="Quantity"
                  value={
                    product.quantity !== undefined
                      ? `${product.quantity} units`
                      : "—"
                  }
                />
                <Field label="Current Status" value={product.status || "—"} />
              </div>
            </div>

            <div style={{ ...panelStyle, padding: 24 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 18,
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  Audit trail
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#6b7280",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {sortedHistory.length} events
                </div>
              </div>

              {sortedHistory.length === 0 ? (
                <div
                  style={{
                    border: "1px dashed #d1d5db",
                    borderRadius: 12,
                    padding: 24,
                    textAlign: "center",
                    color: "#6b7280",
                    fontSize: 14,
                  }}
                >
                  No audit events available for this product.
                </div>
              ) : (
                <div style={{ display: "grid", gap: 14 }}>
                  {sortedHistory.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: 14,
                        padding: 16,
                        background: "#fcfcfd",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                          flexWrap: "wrap",
                          marginBottom: 10,
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: 15,
                              fontWeight: 600,
                              color: "#111827",
                            }}
                          >
                            {item.role || "Unknown role"}
                          </div>
                          <div
                            style={{
                              marginTop: 4,
                              fontSize: 13,
                              color: "#6b7280",
                            }}
                          >
                            {item.action || "No action recorded"}
                          </div>
                        </div>

                        <div
                          style={{
                            fontSize: 12,
                            color: "#6b7280",
                            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                          }}
                        >
                          {item.timestamp
                            ? new Date(item.timestamp).toLocaleString()
                            : "—"}
                        </div>
                      </div>

                      <div
                        style={{
                          paddingTop: 10,
                          borderTop: "1px solid #eef2f7",
                          fontSize: 13,
                          color: "#4b5563",
                        }}
                      >
                        <span style={{ color: "#6b7280" }}>Owner ID: </span>
                        <span
                          style={{
                            fontFamily:
                              "ui-monospace, SFMono-Regular, Menlo, monospace",
                          }}
                        >
                          {item.ownerId || "—"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "grid", gap: 20 }}>
            <div style={{ ...panelStyle, padding: 24 }}>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  marginBottom: 16,
                  color: "#111827",
                }}
              >
                Verification
              </div>

              <div style={{ display: "grid", gap: 14 }}>
                <InfoRow label="Record status" value="Verified" success />
                <InfoRow label="Source" value="Blockchain ledger" />
                <InfoRow
                  label="Scanned product"
                  value={product.productId || productId}
                  mono
                />
                <InfoRow
                  label="Scan time"
                  value={new Date().toLocaleString()}
                />
              </div>
            </div>

            <div style={{ ...panelStyle, padding: 24 }}>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  marginBottom: 10,
                  color: "#111827",
                }}
              >
                Integrity note
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "#6b7280",
                }}
              >
                This page displays the registered lifecycle history associated
                with the scanned product identifier. Each event represents a
                recorded supply chain handoff or status update.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, mono = false }) {
  return (
    <div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#6b7280",
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: "#111827",
          fontFamily: mono
            ? "ui-monospace, SFMono-Regular, Menlo, monospace"
            : "inherit",
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function InfoRow({ label, value, mono = false, success = false }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        alignItems: "flex-start",
        paddingBottom: 10,
        borderBottom: "1px solid #eef2f7",
      }}
    >
      <span style={{ fontSize: 13, color: "#6b7280" }}>{label}</span>
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: success ? "#047857" : "#111827",
          fontFamily: mono
            ? "ui-monospace, SFMono-Regular, Menlo, monospace"
            : "inherit",
          textAlign: "right",
          wordBreak: "break-word",
        }}
      >
        {value}
      </span>
    </div>
  );
}