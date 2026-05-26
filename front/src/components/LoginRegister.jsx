import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react";

import {
  Leaf, ShieldCheck, QrCode, ArrowRight, LogOut,
  Truck, Factory, Store, Scan, User, Package,
  CheckCircle, Clock, AlertCircle, ChevronRight,
  Eye, EyeOff, Plus, Send, RefreshCw, Copy,
  BarChart2, Bell, Shield, TrendingUp, Users,
  Search, Flag, Activity, DollarSign, Box,
  Hash, Layers, Award, Zap, MapPin, X, Filter,
  Calendar, ChevronDown, MoreVertical, ExternalLink,
  CheckSquare, XCircle, Database, Lock
} from "lucide-react";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const BASE = "https://agrotrace-25g0.onrender.com/api";

const ROLES = ["FARMER", "MANUFACTURER", "DISTRIBUTOR", "RETAILER"];

const ROLE_META = {
  FARMER:       { color: "#2d6a4f", bg: "#d8f3dc", icon: Leaf,    label: "Farmer"       },
  MANUFACTURER: { color: "#1d4ed8", bg: "#dbeafe", icon: Factory, label: "Manufacturer"  },
  DISTRIBUTOR:  { color: "#b45309", bg: "#fef3c7", icon: Truck,   label: "Distributor"   },
  RETAILER:     { color: "#7c3aed", bg: "#ede9fe", icon: Store,   label: "Retailer"      },
  ADMIN:        { color: "#dc2626", bg: "#fee2e2", icon: Shield,  label: "Admin"         },
};

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
  :root {
    --green:#2d6a4f; --green-l:#40916c; --green-pale:#d8f3dc; --green-xpale:#edf7f0;
    --cream:#f7f4ef; --dark:#0f1a14; --gold:#c9a84c; --gold-l:#e8c96b;
    --red:#dc2626; --blue:#1d4ed8; --purple:#7c3aed; --orange:#b45309;
    --border:#e6ddd2; --muted:#8a8680; --surface:#ffffff;
    --shadow-sm: 0 1px 4px rgba(15,26,20,.06);
    --shadow-md: 0 4px 24px rgba(15,26,20,.09);
    --shadow-lg: 0 12px 48px rgba(15,26,20,.13);
    --radius-sm: 8px; --radius-md: 12px; --radius-lg: 18px;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    color: var(--dark);
    -webkit-font-smoothing: antialiased;
    line-height: 1.5;
  }
  .serif { font-family: 'Cormorant Garamond', serif; }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(18px) } to { opacity:1; transform:translateY(0) } }
  @keyframes fadeIn   { from { opacity:0 } to { opacity:1 } }
  @keyframes spin     { to   { transform:rotate(360deg) } }
  @keyframes toastIn  { from { opacity:0; transform:translateX(20px) } to { opacity:1; transform:translateX(0) } }
  @keyframes lineGrow { from { transform: scaleY(0); transform-origin: top; } to { transform: scaleY(1); transform-origin: top; } }
  @keyframes slideDown { from { opacity:0; transform:translateY(-8px) } to { opacity:1; transform:translateY(0) } }
  @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:.5 } }
  @keyframes notifPop { from { opacity:0; transform:scale(.92) translateY(-6px) } to { opacity:1; transform:scale(1) translateY(0) } }
  @keyframes barGrow { from { width: 0 } to { } }

  .fade-up  { animation: fadeUp  .45s cubic-bezier(.22,1,.36,1) both; }
  .fade-in  { animation: fadeIn  .3s ease both; }
  .spin     { animation: spin .75s linear infinite; }
  .pulse    { animation: pulse 2s ease-in-out infinite; }

  .journey-line-active { animation: lineGrow .4s cubic-bezier(.22,1,.36,1) both; }

  input, select, textarea { font-family: 'DM Sans', sans-serif; }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #d4ccc3; border-radius: 10px; }

  input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: var(--green) !important;
    box-shadow: 0 0 0 3px rgba(45,106,79,.12);
  }

  .nav-link { transition: all .15s; }
  .nav-link:hover { background: rgba(255,255,255,.08) !important; }

  .sidebar-btn { transition: all .15s ease; }
  .sidebar-btn:hover { background: var(--green-xpale) !important; color: var(--green) !important; }

  .auth-tab { transition: all .2s; }
  .auth-tab:hover { color: var(--green) !important; }

  .btn-primary:hover  { filter: brightness(1.07); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(45,106,79,.28) !important; }
  .btn-gold:hover     { filter: brightness(1.07); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(201,168,76,.3) !important; }
  .btn-outline:hover  { background: var(--green-xpale) !important; }
  .btn-danger:hover   { filter: brightness(1.1); transform: translateY(-1px); }
  .btn-ghost:hover    { color: var(--dark) !important; }
  .btn-any { transition: all .18s cubic-bezier(.22,1,.36,1) !important; }

  .card-hover { transition: box-shadow .2s, transform .2s; }
  .card-hover:hover { box-shadow: var(--shadow-md) !important; transform: translateY(-1px); }

  .result-box { transition: box-shadow .2s; }
  .result-box:hover { box-shadow: 0 0 0 3px rgba(201,168,76,.15); }

  .auth-bg-orb {
    position: fixed; border-radius: 50%; pointer-events: none; z-index: 0;
    filter: blur(80px); opacity: .18;
  }

  code { cursor: pointer; user-select: all; }
  code:hover { opacity: .8; }

  .chip {
    display: inline-flex; align-items: center; gap: 4px;
    background: var(--green-pale); color: var(--green);
    border-radius: 20px; padding: 2px 10px; font-size: 11px; font-weight: 600;
  }

  @keyframes nodePulse {
    0%   { box-shadow: 0 0 0 0 rgba(45,106,79,.4); }
    70%  { box-shadow: 0 0 0 8px rgba(45,106,79,0); }
    100% { box-shadow: 0 0 0 0 rgba(45,106,79,0); }
  }
  .node-pulse { animation: nodePulse 1.8s ease-out 2; }

  /* Notif dot blink */
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
  .notif-dot { animation: blink 1.5s ease-in-out infinite; }

  .stat-card { transition: box-shadow .2s, transform .2s; }
  .stat-card:hover { box-shadow: var(--shadow-md) !important; transform: translateY(-2px); }

  .admin-row:hover { background: var(--green-xpale) !important; }

  .tag {
    display: inline-flex; align-items: center; gap: 4px;
    border-radius: 20px; padding: 3px 10px; font-size: 11px; font-weight: 700;
    letter-spacing: .03em;
  }

  .bar-fill { animation: barGrow .8s cubic-bezier(.22,1,.36,1) both; }

  .notif-item { transition: background .15s; }
  .notif-item:hover { background: var(--green-xpale) !important; }

  .search-input { transition: all .2s; }
  .search-input:focus { box-shadow: 0 0 0 3px rgba(45,106,79,.12); border-color: var(--green) !important; }

  .qr-public-bg {
    min-height: 100vh;
    background: linear-gradient(145deg, #0a1510 0%, #0f2218 50%, #0d1a1a 100%);
  }

  /* Shimmer loader */
  @keyframes shimmer { from{background-position:-600px 0} to{background-position:600px 0} }
  .shimmer {
    background: linear-gradient(90deg, #f0ebe3 25%, #faf6f0 50%, #f0ebe3 75%);
    background-size: 600px 100%;
    animation: shimmer 1.4s infinite linear;
    border-radius: 6px;
  }
`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
async function api(path, method = "GET", body = null, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });
  const data = await res.json();
  if (!res.ok && res.status !== 409) throw new Error(data.message || "Request failed");
  return data;
}

function Card({ children, style = {}, hover = false, className = "" }) {
  return (
    <div
      className={`${hover ? "card-hover" : ""} ${className}`}
      style={{
        background: "var(--surface)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
        padding: 24,
        ...style
      }}
    >
      {children}
    </div>
  );
}

function Btn({
  children,
  onClick,
  variant = "primary",
  loading,
  disabled,
  style = {},
  small
}) {
  const variantStyles = {
    primary: {
      background: "linear-gradient(135deg, var(--green) 0%, var(--green-l) 100%)",
      color: "#fff"
    },
    gold: {
      background: "linear-gradient(135deg, var(--gold) 0%, #b8860b 100%)",
      color: "#0f1a14"
    },
    outline: {
      background: "transparent",
      border: "1.5px solid var(--green)",
      color: "var(--green)"
    },
    danger: {
      background: "var(--red)",
      color: "#fff"
    },
    ghost: {
      background: "transparent",
      color: "#888"
    },
    purple: {
      background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
      color: "#fff"
    }
  };

  const variantClass = {
    primary: "btn-primary",
    gold: "btn-gold",
    outline: "btn-outline",
    danger: "btn-danger",
    ghost: "btn-ghost"
  };

  return (
    <button
      className={`btn-any ${variantClass[variant] || ""}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        borderRadius: "var(--radius-sm)",
        fontWeight: 600,
        cursor: "pointer",
        border: "none",
        padding: small ? "7px 15px" : "11px 22px",
        fontSize: small ? 13 : 14,
        letterSpacing: ".01em",
        opacity: (disabled || loading) ? 0.55 : 1,
        pointerEvents: (disabled || loading) ? "none" : "auto",
        ...variantStyles[variant],
        ...style
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Input({ label, value, onChange, type="text", placeholder, required, options, hint, min }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
      {label && <label style={{ fontSize:11, fontWeight:600, color:"#6b6560", letterSpacing:".06em", textTransform:"uppercase" }}>{label}{required && <span style={{ color:"var(--red)", marginLeft:2 }}>*</span>}</label>}
      {hint && <span style={{ fontSize:11, color:"#aaa", marginTop:-3 }}>{hint}</span>}
      {options ? (
        <select value={value} onChange={e=>onChange(e.target.value)} style={inputStyle}>
          <option value="">Select…</option>
          {options.map(o=><option key={o} value={o}>{o}</option>)}
        </select>
      ) : type==="password" ? (
        <div style={{ position:"relative" }}>
          <input type={show?"text":"password"} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{...inputStyle, paddingRight:42}} />
          <button type="button" onClick={()=>setShow(!show)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#aaa", display:"flex", alignItems:"center" }}>
            {show ? <EyeOff size={15}/> : <Eye size={15}/>}
          </button>
        </div>
      ) : (
        <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} min={min} style={inputStyle} />
      )}
    </div>
  );
}

const inputStyle = { padding:"10px 14px", borderRadius:"var(--radius-sm)", border:"1.5px solid var(--border)", fontSize:14, outline:"none", transition:"border .15s, box-shadow .15s", background:"#fafaf8", width:"100%", color:"var(--dark)" };

function Toast({ msg, type }) {
  if (!msg) return null;
  const configs = {
    success: { bg:"#1a4a35", accent:"#4ade80", icon:<CheckCircle size={15}/> },
    error:   { bg:"#7f1d1d", accent:"#f87171", icon:<AlertCircle size={15}/> },
    info:    { bg:"#1e3a5f", accent:"#60a5fa", icon:<Clock size={15}/> },
  };
  const c = configs[type] || configs.info;
  return (
    <div style={{ position:"fixed", bottom:28, right:28, zIndex:9999, background:c.bg, color:"#fff", padding:"13px 20px", borderRadius:"var(--radius-md)", fontSize:13, fontWeight:500, boxShadow:"var(--shadow-lg)", display:"flex", alignItems:"center", gap:10, maxWidth:380, borderLeft:`3px solid ${c.accent}`, animation:"toastIn .35s cubic-bezier(.22,1,.36,1) both" }}>
      <span style={{ color:c.accent, flexShrink:0 }}>{c.icon}</span>
      {msg}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    CREATED:       { bg:"#dbeafe", color:"#1d4ed8", dot:"#3b82f6" },
    MANUFACTURING: { bg:"#fef3c7", color:"#b45309", dot:"#f59e0b" },
    DISTRIBUTING:  { bg:"#ede9fe", color:"#7c3aed", dot:"#a78bfa" },
    RETAILING:     { bg:"#d8f3dc", color:"#2d6a4f", dot:"#34d399" },
    SOLD:          { bg:"#fee2e2", color:"#dc2626", dot:"#f87171" },
  };
  const s = map[status] || { bg:"#f3f4f6", color:"#6b7280", dot:"#9ca3af" };
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:s.bg, color:s.color, borderRadius:20, padding:"4px 12px", fontSize:11, fontWeight:700, letterSpacing:".04em" }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:s.dot, display:"inline-block" }}/>
      {status}
    </span>
  );
}

// ─── AUTH SCREEN ──────────────────────────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ role:"", name:"", email:"", password:"", phone:"", address:"", companyName:"" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const set = k => v => setForm(f=>({...f,[k]:v}));

  const showToast = (msg, type="info") => { setToast({msg,type}); setTimeout(()=>setToast(null),3500); };

  const handleLogin = async () => {
    if (!form.email||!form.password) return showToast("Email and password required","error");
    setLoading(true);
    try {
      const data = await api("/auth/login","POST",{email:form.email,password:form.password});
      showToast("Logged in!","success");
      setTimeout(()=>onLogin(data.token, data.user||{email:form.email}),400);
    } catch(e) { showToast(e.message,"error"); }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!form.role||!form.name||!form.email||!form.password) return showToast("Fill all required fields","error");
    setLoading(true);
    try {
      await api("/auth/register","POST",{role:form.role,name:form.name,email:form.email,password:form.password,phone:form.phone,address:form.address,companyName:form.companyName});
      showToast("Registered! Please log in.","success");
      setTab("login");
    } catch(e) { showToast(e.message,"error"); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(145deg, #0a1510 0%, #0f2218 50%, #0d1a1a 100%)", padding:24, position:"relative", overflow:"hidden" }}>
      <style>{css}</style>
      {toast && <Toast msg={toast.msg} type={toast.type}/>}
      <div className="auth-bg-orb" style={{ width:500, height:500, background:"var(--green)", top:-150, left:-150 }}/>
      <div className="auth-bg-orb" style={{ width:400, height:400, background:"var(--gold)", bottom:-100, right:-100 }}/>

      <div className="fade-up" style={{ width:"100%", maxWidth:448, position:"relative", zIndex:1 }}>
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:12, marginBottom:10 }}>
            <div style={{ background:"linear-gradient(135deg, var(--green), var(--green-l))", borderRadius:"var(--radius-md)", padding:12, boxShadow:"0 8px 32px rgba(45,106,79,.4)" }}>
              <Leaf style={{ width:22, height:22, color:"#fff" }}/>
            </div>
            <span className="serif" style={{ fontSize:30, fontWeight:600, color:"#fff", letterSpacing:"-.01em" }}>Agro<span style={{ color:"var(--gold)" }}>Trace</span></span>
          </div>
          <p style={{ color:"rgba(255,255,255,.4)", fontSize:13, letterSpacing:".03em" }}>Supply Chain Management Platform</p>
        </div>

        <Card style={{ boxShadow:"var(--shadow-lg), 0 0 0 1px rgba(255,255,255,.06)" }}>
          <div style={{ display:"flex", borderBottom:"1.5px solid #f0ebe3", marginBottom:26 }}>
            {["login","register"].map(t=>(
              <button key={t} className="auth-tab" onClick={()=>setTab(t)} style={{ flex:1, padding:"10px 0", background:"none", border:"none", borderBottom:tab===t?"2.5px solid var(--green)":"2.5px solid transparent", marginBottom:-1.5, color:tab===t?"var(--green)":"#aaa", fontWeight:600, fontSize:14, cursor:"pointer", textTransform:"capitalize" }}>{t}</button>
            ))}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {tab==="register" && (
              <>
                <Input label="Role" value={form.role} onChange={set("role")} options={ROLES} required/>
                <Input label="Full Name" value={form.name} onChange={set("name")} placeholder="John Doe" required/>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  <Input label="Phone" value={form.phone} onChange={set("phone")} placeholder="9999999999"/>
                  <Input label="Company" value={form.companyName} onChange={set("companyName")} placeholder="Green Farm"/>
                </div>
                <Input label="Address" value={form.address} onChange={set("address")} placeholder="Village Area"/>
              </>
            )}
            <Input label="Email" value={form.email} onChange={set("email")} type="email" placeholder="you@example.com" required/>
            <Input label="Password" value={form.password} onChange={set("password")} type="password" placeholder="••••••" required/>
            <Btn onClick={tab==="login"?handleLogin:handleRegister} loading={loading} style={{ marginTop:6, justifyContent:"center", width:"100%", padding:"13px 22px" }}>
              {tab==="login"?"Sign In":"Create Account"} <ArrowRight size={15}/>
            </Btn>
          </div>
        </Card>
        <p style={{ textAlign:"center", color:"rgba(255,255,255,.2)", fontSize:12, marginTop:20, letterSpacing:".02em" }}>Farm to shelf · Verified on blockchain</p>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ token, user, onLogout }) {
  const [tab, setTab] = useState("products");
  const [toast, setToast] = useState(null);
  const [notifCount, setNotifCount] = useState(0);

  const showToast = (msg, type="info") => { setToast({msg,type}); setTimeout(()=>setToast(null),3500); };

  const isAdmin = user?.role === "ADMIN";

  const tabs = [
    { id:"products", label:"My Products", icon:Package },
    ...(user?.role==="FARMER" ? [{ id:"create", label:"Create Batch", icon:Plus }] : []),
    ...(user?.role!=="FARMER" ? [{ id:"transfer", label:"Transfer", icon:Send }] : []),
    { id:"verify", label:"Verify OTP", icon:ShieldCheck },
    ...(["MANUFACTURER","DISTRIBUTOR","RETAILER"].includes(user?.role) ? [{ id:"update", label:"Update Product", icon:RefreshCw }] : []),
    ...(user?.role==="RETAILER" ? [{ id:"sell", label:"Sell", icon:Store }] : []),
    { id:"history", label:"Scan History", icon:Scan },
    // ── NEW TABS ──
    { id:"analytics", label:"Analytics", icon:BarChart2 },
    { id:"notifications", label:"Activity Feed", icon:Bell, badge:notifCount },
    { id:"public-scan", label:"QR Public Page", icon:QrCode },
    ...(isAdmin ? [{ id:"admin", label:"Admin Panel", icon:Shield }] : []),
  ];

  const roleInfo = user?.role ? ROLE_META[user.role] : null;

  return (
    <div style={{ minHeight:"100vh", background:"var(--cream)" }}>
      <style>{css}</style>
      {toast && <Toast msg={toast.msg} type={toast.type}/>}

      <nav style={{ background:"var(--dark)", padding:"0 28px", position:"sticky", top:0, zIndex:40, borderBottom:"1px solid rgba(255,255,255,.04)" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:60 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ background:"linear-gradient(135deg, var(--green), var(--green-l))", borderRadius:"var(--radius-sm)", padding:7, boxShadow:"0 4px 12px rgba(45,106,79,.3)" }}>
              <Leaf style={{ width:17, height:17, color:"#fff" }}/>
            </div>
            <span className="serif" style={{ fontSize:21, fontWeight:600, color:"#fff", letterSpacing:"-.01em" }}>Agro<span style={{ color:"var(--gold)" }}>Trace</span></span>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {roleInfo && <span style={{ background:roleInfo.bg, color:roleInfo.color, borderRadius:20, padding:"4px 12px", fontSize:11, fontWeight:700, letterSpacing:".05em" }}>{roleInfo.label.toUpperCase()}</span>}
            <div style={{ position:"relative" }}>
              <button className="nav-link" onClick={()=>{ setTab("notifications"); setNotifCount(0); }} style={{ background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", color:"rgba(255,255,255,.6)", borderRadius:"var(--radius-sm)", padding:"7px 12px", cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontSize:12 }}>
                <Bell size={14}/>
              </button>
              {notifCount>0 && <span className="notif-dot" style={{ position:"absolute", top:-4, right:-4, width:16, height:16, borderRadius:"50%", background:"var(--red)", fontSize:9, fontWeight:700, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid var(--dark)" }}>{notifCount}</span>}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:32, height:32, borderRadius:"50%", background:"rgba(255,255,255,.08)", border:"1.5px solid rgba(255,255,255,.12)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <User size={14} style={{ color:"rgba(255,255,255,.6)" }}/>
              </div>
              <span style={{ color:"rgba(255,255,255,.6)", fontSize:13 }}>{user?.email||"User"}</span>
            </div>
            <button className="nav-link" onClick={onLogout} style={{ background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", color:"rgba(255,255,255,.55)", borderRadius:"var(--radius-sm)", padding:"7px 14px", cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", gap:6 }}>
              <LogOut size={12}/> Logout
            </button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth:1280, margin:"0 auto", padding:"28px 24px", display:"grid", gridTemplateColumns:"220px 1fr", gap:24, alignItems:"start" }}>
        <aside style={{ position:"sticky", top:88 }}>
          <Card style={{ padding:8 }}>
            {tabs.map(t=>(
              <button key={t.id} className="sidebar-btn" onClick={()=>{ setTab(t.id); if(t.id==="notifications") setNotifCount(0); }} style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:"var(--radius-sm)", border:"none", cursor:"pointer", background:tab===t.id?"var(--green-pale)":"transparent", color:tab===t.id?"var(--green)":"#666", fontWeight:tab===t.id?600:400, fontSize:13, marginBottom:2 }}>
                <t.icon size={14}/>
                {t.label}
                {t.badge>0 && <span style={{ marginLeft:"auto", background:"var(--red)", color:"#fff", borderRadius:20, padding:"1px 7px", fontSize:10, fontWeight:700 }}>{t.badge}</span>}
                {tab===t.id && !t.badge && <ChevronRight size={12} style={{ marginLeft:"auto" }}/>}
              </button>
            ))}
          </Card>
        </aside>

        <main className="fade-up">
          {tab==="products"      && <ProductsList      token={token} showToast={showToast}/>}
          {tab==="create"        && <CreateBatch       token={token} showToast={showToast}/>}
          {tab==="transfer"      && <RequestTransfer   token={token} showToast={showToast}/>}
          {tab==="verify"        && <VerifyOTP         token={token} showToast={showToast}/>}
          {tab==="update"        && <UpdateProduct     token={token} user={user} showToast={showToast}/>}
          {tab==="sell"          && <SellProduct       token={token} showToast={showToast}/>}
          {tab==="history"       && <ProductHistory    showToast={showToast}/>}
          {tab==="analytics"     && <AnalyticsDashboard token={token} user={user} showToast={showToast}/>}
          {tab==="notifications" && <NotificationFeed  token={token} showToast={showToast}/>}
          {tab==="public-scan"   && <PublicQRPreview   showToast={showToast}/>}
          {tab==="admin"         && isAdmin && <AdminPanel token={token} showToast={showToast}/>}
        </main>
      </div>
    </div>
  );
}

// ─── SECTION: PRODUCTS LIST ───────────────────────────────────────────────────
// function ProductsList({ token, showToast }) {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);

  // const load = async () => {
  //   setLoading(true);

  //   try {
  //     const data = await api("/analytics/dashboard", "GET", null, token);

  //     setProducts(data.analytics?.topProducts || []);
  //   } catch (e) {
  //     showToast(e.message, "error");
  //   }

  //   setLoading(false);
  // };



//   const load = async () => {
//   setLoading(true);

//   try {
//     const data = await api("/analytics/dashboard", "GET", null, token);

//     // Use recentProducts instead of topProducts
//     setProducts(data.recentProducts || []);
//   } catch (e) {
//     showToast(e.message, "error");
//   }

//   setLoading(false);
// };

//   useEffect(() => {
//     if (token) {
//       load();
//     }
//   }, [token]);





//   return (
//     <div>
//       <SectionHeader icon={Package} title="My Products" subtitle="All batches associated with your account">
//         <Btn onClick={load} loading={loading} small variant="outline"><RefreshCw size={13}/> Refresh</Btn>
//       </SectionHeader>
//       {products.length===0 ? (
//         <Card style={{ textAlign:"center", padding:64 }}>
//           <div style={{ width:60, height:60, borderRadius:"50%", background:"var(--green-xpale)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}><Package size={26} style={{ color:"#bbb" }}/></div>
//           <p style={{ color:"#999", fontSize:14, marginBottom:4 }}>No products yet.</p>
//           <p style={{ color:"#bbb", fontSize:13, marginBottom:20 }}>Click Refresh or Create a Batch to get started.</p>
//           <Btn onClick={load} loading={loading} style={{ justifyContent:"center" }} variant="outline">Load Products</Btn>
//         </Card>
//       ) : (
//         <div style={{ display:"grid", gap:12 }}>
//           {products.map((p,i)=>(
//             <Card key={i} hover style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"18px 22px" }}>
//               <div style={{ display:"flex", gap:16, alignItems:"center" }}>
//                 <div style={{ background:"var(--green-pale)", borderRadius:12, padding:11, flexShrink:0 }}><Package size={17} style={{ color:"var(--green)" }}/></div>
//                 <div>
//                   <div style={{ fontWeight:600, fontSize:15 }}>{p.productName||p.name}</div>
//                   <div style={{ fontSize:12, color:"#999", marginTop:3 }}>Sold: {p.totalSold}</div>
//                 </div>
//               </div>
//               <StatusBadge status={p.status}/>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

//


function ProductsList({ token, showToast }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);

    try {
      const data = await api(
        "/products/my-products",
        "GET",
        null,
        token
      );

      setProducts(data.products || []);

    } catch (e) {
      showToast(e.message, "error");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (token) {
      load();
    }
  }, [token]);

  return (
    <div>
      <SectionHeader
        icon={Package}
        title="My Products"
        subtitle="All batches associated with your account"
      >
        <Btn
          onClick={load}
          loading={loading}
          small
          variant="outline"
        >
          <RefreshCw size={13}/> Refresh
        </Btn>
      </SectionHeader>

      {products.length === 0 ? (
        <Card style={{ textAlign:"center", padding:64 }}>
          <div
            style={{
              width:60,
              height:60,
              borderRadius:"50%",
              background:"var(--green-xpale)",
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
              margin:"0 auto 16px"
            }}
          >
            <Package
              size={26}
              style={{ color:"#bbb" }}
            />
          </div>

          <p
            style={{
              color:"#999",
              fontSize:14,
              marginBottom:4
            }}
          >
            No products yet.
          </p>

          <p
            style={{
              color:"#bbb",
              fontSize:13,
              marginBottom:20
            }}
          >
            Click Refresh or Create a Batch to get started.
          </p>

          <Btn
            onClick={load}
            loading={loading}
            style={{ justifyContent:"center" }}
            variant="outline"
          >
            Load Products
          </Btn>
        </Card>
      ) : (
        <div style={{ display:"grid", gap:12 }}>
          {products.map((p,i)=>(
            <Card
              key={i}
              hover
              style={{
                display:"flex",
                justifyContent:"space-between",
                alignItems:"center",
                padding:"18px 22px"
              }}
            >
              <div
                style={{
                  display:"flex",
                  gap:16,
                  alignItems:"center"
                }}
              >
                <div
                  style={{
                    background:"var(--green-pale)",
                    borderRadius:12,
                    padding:11,
                    flexShrink:0
                  }}
                >
                  <Package
                    size={17}
                    style={{ color:"var(--green)" }}
                  />
                </div>

                <div>
                  <div
                    style={{
                      fontWeight:600,
                      fontSize:15
                    }}
                  >
                    {p.productName}
                  </div>

                  <div
                    style={{
                      fontSize:12,
                      color:"#999",
                      marginTop:3
                    }}
                  >
                    Product ID: {p.productId}
                  </div>

                  <div
                    style={{
                      fontSize:12,
                      color:"#999",
                      marginTop:3
                    }}
                  >
                    Status: {p.status}
                  </div>
                </div>
              </div>

              <StatusBadge status={p.status}/>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}





// ─── PRODUCT ID COPY BOX ─────────────────────────────────────────────────────
function ProductIdBox({ productId }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(productId); } catch { const el=document.createElement("textarea"); el.value=productId; document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el); }
    setCopied(true); setTimeout(()=>setCopied(false),2000);
  };
  return (
    <div style={{ marginTop:22, background:"linear-gradient(135deg, #e8f5ee, #d8f3dc)", borderRadius:"var(--radius-md)", border:"1.5px solid rgba(45,106,79,.2)", padding:"16px 18px" }}>
      <div style={{ fontSize:11, color:"var(--green)", fontWeight:700, marginBottom:10, letterSpacing:".05em", textTransform:"uppercase", display:"flex", alignItems:"center", gap:6 }}><CheckCircle size={13}/> Product ID</div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
        <code style={{ fontSize:15, fontWeight:700, color:"var(--dark)", wordBreak:"break-all", letterSpacing:".02em", flex:1 }}>{productId}</code>
        <button onClick={handleCopy} style={{ display:"flex", alignItems:"center", gap:6, background:copied?"var(--green)":"#fff", border:`1.5px solid ${copied?"var(--green)":"rgba(45,106,79,.3)"}`, color:copied?"#fff":"var(--green)", borderRadius:"var(--radius-sm)", padding:"6px 12px", cursor:"pointer", fontSize:12, fontWeight:600, flexShrink:0, transition:"all .2s" }}>
          {copied ? <><CheckCircle size={13}/> Copied!</> : <><Copy size={13}/> Copy</>}
        </button>
      </div>
    </div>
  );
}

// ─── SECTION: CREATE BATCH ────────────────────────────────────────────────────
function CreateBatch({ token, showToast }) {
  const [form, setForm] = useState({ productName:"", quantity:"", category:"Food", farmLocation:"", cropType:"", harvestDate:"", farmingMethod:"Organic" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const set = k => v => setForm(f=>({...f,[k]:v}));

  const submit = async () => {
    if (!form.productName||!form.quantity||!form.farmLocation) return showToast("Fill required fields","error");
    if (Number(form.quantity)<=0) return showToast("Quantity must be greater than 0","error");
    setLoading(true);
    try {
      const data = await api("/products/create","POST",{...form,quantity:Number(form.quantity)},token);
      const productId = data?.productId||data?.id||data?.product?.productId||data?.product?._id;
      setResult(productId);
      showToast("Batch created! Copy your Product ID.","success");
      setForm({ productName:"", quantity:"", category:"Food", farmLocation:"", cropType:"", harvestDate:"", farmingMethod:"Organic" });
    } catch(e) { showToast(e.message,"error"); }
    setLoading(false);
  };

  return (
    <div>
      <SectionHeader icon={Plus} title="Create Product Batch" subtitle="Register a new crop batch on the blockchain"/>
      <Card style={{ maxWidth:580 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <Input label="Product Name *" value={form.productName} onChange={set("productName")} placeholder="Rice"/>
            <Input label="Quantity *" value={form.quantity} onChange={set("quantity")} type="number" placeholder="100" min={1}/>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <Input label="Category" value={form.category} onChange={set("category")} options={["Food","Grain","Vegetable","Fruit","Other"]}/>
            <Input label="Farm Location *" value={form.farmLocation} onChange={set("farmLocation")} placeholder="Kolkata"/>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <Input label="Crop Type" value={form.cropType} onChange={set("cropType")} placeholder="Basmati"/>
            <Input label="Harvest Date" value={form.harvestDate} onChange={set("harvestDate")} type="date"/>
          </div>
          <Input label="Farming Method" value={form.farmingMethod} onChange={set("farmingMethod")} options={["Organic","Conventional","Hydroponic","Biodynamic"]}/>
          <Btn onClick={submit} loading={loading}><Plus size={15}/> Create Batch</Btn>
        </div>
        {result && <ProductIdBox productId={result}/>}
      </Card>
    </div>
  );
}

// ─── SECTION: REQUEST TRANSFER ────────────────────────────────────────────────
function RequestTransfer({ token, showToast }) {
  const [productId, setProductId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const submit = async () => {

    if (!productId.trim()) {
      return showToast(
        "Enter a Product ID",
        "error"
      );
    }

    setLoading(true);

    try {

      const data = await api(
        `/transfer/request/${productId.trim()}`,
        "POST",
        null,
        token
      );

      setResult(data);

      showToast(
        "Transfer request sent successfully!",
        "success"
      );

    } catch(e) {

      showToast(e.message,"error");

    }

    setLoading(false);
  };

  return (
    <div>

      <SectionHeader
        icon={Send}
        title="Request Ownership Transfer"
        subtitle="As the next role in the chain, request ownership of a product"
      />

      <Card style={{ maxWidth:520 }}>

        <div
          style={{
            display:"flex",
            flexDirection:"column",
            gap:14
          }}
        >

          <Input
            label="Product ID *"
            value={productId}
            onChange={setProductId}
            placeholder="PROD123456"
          />

          <Btn
            onClick={submit}
            loading={loading}
          >
            <Send size={15}/>
            Request Transfer
          </Btn>

        </div>

        {result && (

          <div
            style={{
              marginTop:20,
              display:"flex",
              flexDirection:"column",
              gap:10
            }}
          >

            <div
  style={{
    background:"var(--card)",
    border:"1px solid var(--line)",
    borderRadius:"var(--radius-md)",
    padding:"16px"
  }}
>

  <div
    style={{
      fontSize:12,
      fontWeight:700,
      color:"var(--blue)",
      marginBottom:10
    }}
  >
    REQUEST ID
  </div>

  <div
    style={{
      display:"flex",
      alignItems:"center",
      justifyContent:"space-between",
      gap:10
    }}
  >

    <code
      style={{
        fontSize:14,
        fontWeight:600,
        wordBreak:"break-all"
      }}
    >
      {result.request?.id || result.requestId}
    </code>

    <Btn
      small
      variant="outline"
      onClick={() => {
        navigator.clipboard.writeText(
          result.request?.id ||
          result.requestId
        );

        showToast(
          "Request ID copied!",
          "success"
        );
      }}
    >
      <Copy size={14}/>
      Copy
    </Btn>

  </div>

</div>

          </div>

        )}

      </Card>

    </div>
  );
}



// ─── SECTION: VERIFY OTP ──────────────────────────────────────────────────────
function VerifyOTP({ token, showToast }) {

  const [requestId, setRequestId] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {

    if (
      !requestId.trim() ||
      !otp.trim()
    ) {

      return showToast(
        "Enter Request ID and OTP",
        "error"
      );

    }

    setLoading(true);

    try {

      await api(
        `/transfer/verify/${requestId.trim()}`,
        "POST",
        { otp },
        token
      );

      showToast(
        "✅ Ownership transferred successfully!",
        "success"
      );

      setRequestId("");
      setOtp("");

    } catch(e) {

      showToast(e.message,"error");

    }

    setLoading(false);
  };

  return (
    <div>

      <SectionHeader
        icon={ShieldCheck}
        title="Verify OTP & Accept Ownership"
        subtitle="Enter the OTP received to complete ownership transfer"
      />

      <Card style={{ maxWidth:440 }}>

        <div
          style={{
            display:"flex",
            flexDirection:"column",
            gap:14
          }}
        >

          <Input
            label="Request ID *"
            value={requestId}
            onChange={setRequestId}
            placeholder="Paste request ID"
          />

          <Input
            label="OTP *"
            value={otp}
            onChange={setOtp}
            placeholder="123456"
          />

          <Btn
            onClick={submit}
            loading={loading}
            variant="gold"
          >
            <ShieldCheck size={15}/>
            Verify & Transfer
          </Btn>

        </div>

      </Card>

    </div>
  );
}
// ─── SECTION: UPDATE PRODUCT ──────────────────────────────────────────────────
function UpdateProduct({ token, user, showToast }) {
  const role = user?.role;
  const initialForm = {
    MANUFACTURER: { manufacturingDate:"", factoryLocation:"", packagingType:"", ingredientsUsed:"" },
    DISTRIBUTOR:  { warehouseLocation:"", transportMethod:"", dispatchDate:"" },
    RETAILER:     { storeLocation:"", shelfDate:"", retailPrice:"" },
  }[role] || {};

  const [productId, setProductId] = useState("");
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const set = k => v => setForm(f=>({...f,[k]:v}));

  const submit = async () => {
    if (!productId.trim()) return showToast("Enter a Product ID","error");
    const body = Object.fromEntries(Object.entries(form).filter(([,v])=>v));
    if (Object.keys(body).length===0) return showToast("Fill at least one field to update","error");
    setLoading(true);
    try {
      await api(`/products/update/${productId.trim()}`,"PUT",body,token);
      showToast("Product updated successfully!","success");
    } catch(e) { showToast(e.message,"error"); }
    setLoading(false);
  };

  const roleColor = ROLE_META[role]?.color||"var(--green)";
  const roleBg    = ROLE_META[role]?.bg||"var(--green-pale)";
  const RoleIcon  = ROLE_META[role]?.icon||RefreshCw;

  return (
    <div>
      <SectionHeader icon={RefreshCw} title="Update Product Details" subtitle="Update your product details as the current owner"/>
      <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:roleBg, color:roleColor, borderRadius:"var(--radius-sm)", padding:"7px 14px", fontSize:12, fontWeight:600, marginBottom:20, border:`1px solid ${roleColor}33` }}>
        <RoleIcon size={13}/> Editing as {ROLE_META[role]?.label}
      </div>
      <Card style={{ maxWidth:580 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Input label="Product ID *" value={productId} onChange={setProductId} placeholder="PROD123456"/>
          <div style={{ height:1, background:"var(--border)", margin:"2px 0" }}/>
          {role==="MANUFACTURER" && (
            <>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Input label="Manufacturing Date" value={form.manufacturingDate} onChange={set("manufacturingDate")} type="date"/>
                <Input label="Factory Location" value={form.factoryLocation} onChange={set("factoryLocation")} placeholder="Factory A, Mumbai"/>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Input label="Packaging Type" value={form.packagingType} onChange={set("packagingType")} options={["Plastic","Glass","Cardboard","Vacuum Sealed","Other"]}/>
                <Input label="Ingredients Used" value={form.ingredientsUsed} onChange={set("ingredientsUsed")} placeholder="Rice, Water, Salt"/>
              </div>
            </>
          )}
          {role==="DISTRIBUTOR" && (
            <>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Input label="Warehouse Location" value={form.warehouseLocation} onChange={set("warehouseLocation")} placeholder="Hub A, Delhi"/>
                <Input label="Transport Method" value={form.transportMethod} onChange={set("transportMethod")} options={["Road","Rail","Air","Sea","Cold Chain"]}/>
              </div>
              <Input label="Dispatch Date" value={form.dispatchDate} onChange={set("dispatchDate")} type="date"/>
            </>
          )}
          {role==="RETAILER" && (
            <>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Input label="Store Location" value={form.storeLocation} onChange={set("storeLocation")} placeholder="Shop 4, Park Street"/>
                <Input label="Shelf Date" value={form.shelfDate} onChange={set("shelfDate")} type="date"/>
              </div>
              <Input label="Retail Price (₹)" value={form.retailPrice} onChange={set("retailPrice")} type="number" placeholder="299"/>
            </>
          )}
          <Btn onClick={submit} loading={loading}><RefreshCw size={15}/> Update Product</Btn>
        </div>
      </Card>
    </div>
  );
}

// ─── SECTION: SELL PRODUCT ────────────────────────────────────────────────────
function SellProduct({ token, showToast }) {
  const [productId, setProductId] = useState("");
  const [form, setForm] = useState({ name:"", phone:"", address:"" });
  const [loading, setLoading] = useState(false);
  const set = k => v => setForm(f=>({...f,[k]:v}));

  const submit = async () => {
    if (!productId.trim()||!form.name) return showToast("Product ID and customer name required","error");
    setLoading(true);
    try {
      await api(`/products/sell/${productId.trim()}`,"POST",form,token);
      showToast("Product sold! Status set to SOLD.","success");
      setProductId(""); setForm({ name:"", phone:"", address:"" });
    } catch(e) { showToast(e.message,"error"); }
    setLoading(false);
  };

  return (
    <div>
      <SectionHeader icon={Store} title="Sell Product to Customer" subtitle="Retailer only — mark product as sold and store customer info"/>
      <Card style={{ maxWidth:480 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Input label="Product ID *" value={productId} onChange={setProductId} placeholder="PROD123456"/>
          <div style={{ height:1, background:"var(--border)", margin:"2px 0" }}/>
          <p style={{ fontSize:11, color:"#aaa", fontWeight:600, textTransform:"uppercase", letterSpacing:".06em" }}>Customer Information</p>
          <Input label="Customer Name *" value={form.name} onChange={set("name")} placeholder="Samrat"/>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <Input label="Phone" value={form.phone} onChange={set("phone")} placeholder="8888888888"/>
            <Input label="Address" value={form.address} onChange={set("address")} placeholder="Kolkata"/>
          </div>
          <Btn onClick={submit} loading={loading} variant="gold"><Store size={15}/> Sell Product</Btn>
        </div>
      </Card>
    </div>
  );
}


function ProductHistory({ showToast }) {

  const [productId, setProductId] = useState("");
  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState(null);

  const [verification, setVerification] =
    useState(null);

  const load = async () => {

    if (!productId.trim()) {
      return showToast(
        "Enter a Product ID",
        "error"
      );
    }

    setLoading(true);

    try {

      const data = await api(
        `/products/history/${productId.trim()}`
      );

      console.log(
        "HISTORY DATA =>",
        data
      );

      if (!data.product) {

        setHistory(null);

        setVerification(null);

        return showToast(
          "Invalid Product ID",
          "error"
        );
      }

      setHistory(data.product);

      setVerification({
        success: data.success,
        blockchainVerified:
          data.blockchainVerified,
        trustedSource:
          data.trustedSource,
        message: data.message
      });

    } catch (e) {

      console.error(e);

      setHistory(null);

      setVerification(null);

      showToast(
        e.message ||
        "Failed to load product",
        "error"
      );
    }

    setLoading(false);
  };

  const journey = [
    {
      role: "FARMER",
      icon: Leaf,
      label: "Farm"
    },
    {
      role: "MANUFACTURER",
      icon: Factory,
      label: "Manufacturer"
    },
    {
      role: "DISTRIBUTOR",
      icon: Truck,
      label: "Distributor"
    },
    {
      role: "RETAILER",
      icon: Store,
      label: "Retailer"
    },
    {
      role: "CUSTOMER",
      icon: User,
      label: "Customer"
    }
  ];

  const getProductName = () =>
    history?.productName ||
    history?.name ||
    "Unknown Product";

  const getQuantity = () =>
    history?.quantity || 0;

  const getCategory = () =>
    history?.category ||
    "Uncategorized";

  return (

    <div>

      <SectionHeader
        icon={Scan}
        title="Product Journey"
        subtitle="Scan or enter a Product ID to see the full farm-to-shelf history"
      />

      {/* SEARCH */}

      <Card
        style={{
          maxWidth: 580,
          marginBottom: 24
        }}
      >

        <div
          style={{
            display: "flex",
            gap: 10
          }}
        >

          <div style={{ flex: 1 }}>

            <Input
              value={productId}
              onChange={setProductId}
              placeholder="Enter Product ID…"
            />

          </div>

          <Btn
            onClick={load}
            loading={loading}
          >

            <Scan size={15} />
            Trace

          </Btn>

        </div>

      </Card>

      {/* RESULT */}

      {history && (

        <div className="fade-up">

          {/* PRODUCT CARD */}

          <Card
            style={{
              marginBottom: 16
            }}
          >

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "flex-start"
              }}
            >

              <div>

                <div
                  style={{
                    fontSize: 11,
                    color: "#aaa",
                    textTransform:
                      "uppercase",
                    letterSpacing:
                      ".07em",
                    marginBottom: 6,
                    fontWeight: 600
                  }}
                >
                  Product
                </div>

                <div
                  className="serif"
                  style={{
                    fontSize: 24,
                    fontWeight: 600
                  }}
                >

                  {getProductName()}

                </div>

                <div
                  style={{
                    fontSize: 13,
                    color: "#999",
                    marginTop: 6,
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap"
                  }}
                >

                  <span className="chip">
                    {getCategory()}
                  </span>

                  <span>
                    {getQuantity()} units
                  </span>

                  {history?.farmer
                    ?.farmLocation && (

                    <span>
                      · Origin:
                      {" "}
                      {
                        history.farmer
                          .farmLocation
                      }
                    </span>

                  )}

                </div>

              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection:
                    "column",
                  alignItems:
                    "flex-end",
                  gap: 10
                }}
              >

                <StatusBadge
                  status={
                    history?.status ||
                    "CREATED"
                  }
                />

              </div>

            </div>

          </Card>

          {/* BLOCKCHAIN STATUS */}

          {verification && (

            <Card
              style={{
                marginBottom: 16,
                border:
                  verification.blockchainVerified
                    ? "2px solid #16a34a"
                    : "2px solid #dc2626",
                background:
                  verification.blockchainVerified
                    ? "#f0fdf4"
                    : "#fef2f2"
              }}
            >

              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color:
                    verification.blockchainVerified
                      ? "#16a34a"
                      : "#dc2626",
                  marginBottom: 8
                }}
              >

                {verification.blockchainVerified
                  ? "Blockchain Verified"
                  : "Product Data Tampered"}

              </div>

              <div
                style={{
                  fontSize: 13,
                  color: "#555",
                  marginBottom: 6
                }}
              >

                {
                  verification.message
                }

              </div>

              <div
                style={{
                  fontSize: 12,
                  color: "#777"
                }}
              >

                Trusted Source:
                {" "}

                <b>
                  {
                    verification.trustedSource
                  }
                </b>

              </div>

            </Card>

          )}

          {/* TIMELINE */}

          <Card>

            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#aaa",
                textTransform:
                  "uppercase",
                letterSpacing:
                  ".08em",
                marginBottom: 24
              }}
            >
              Supply Chain Journey
            </div>

            <div
              style={{
                display: "flex",
                flexDirection:
                  "column",
                gap: 0
              }}
            >

              {journey.map(
                (step, i) => {

                  const meta =
                    ROLE_META[
                      step.role
                    ] || {};

                  const done =
                    history?.history?.some(
                      h =>
                        h.role ===
                        step.role
                    );

                  return (

                    <div
                      key={i}
                      style={{
                        display:
                          "flex",
                        gap: 16,
                        position:
                          "relative"
                      }}
                    >

                      {i <
                        journey.length -
                        1 && (

                        <div
                          style={{
                            position:
                              "absolute",
                            left: 19,
                            top: 42,
                            width: 2,
                            height:
                              "100%",
                            background:
                              done
                                ? "var(--green)"
                                : "#eee"
                          }}
                        />

                      )}

                      {/* ICON */}

                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius:
                            "50%",
                          flexShrink: 0,
                          background:
                            done
                              ? meta.bg
                              : "#f5f5f5",
                          border: `2px solid ${
                            done
                              ? meta.color
                              : "#ddd"
                          }`,
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center"
                        }}
                      >

                        <step.icon
                          size={15}
                          style={{
                            color:
                              done
                                ? meta.color
                                : "#bbb"
                          }}
                        />

                      </div>

                      {/* CONTENT */}

                      <div
                        style={{
                          paddingBottom:
                            i <
                            journey.length -
                              1
                              ? 30
                              : 0,
                          flex: 1
                        }}
                      >

                        <div
                          style={{
                            display:
                              "flex",
                            justifyContent:
                              "space-between",
                            alignItems:
                              "center",
                            marginTop: 9
                          }}
                        >

                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              color:
                                done
                                  ? "var(--dark)"
                                  : "#bbb"
                            }}
                          >

                            {
                              step.label
                            }

                          </div>

                          {done && (

                            <CheckCircle
                              size={14}
                              style={{
                                color:
                                  "var(--green)"
                              }}
                            />

                          )}

                        </div>



                        

                        {history?.history
                          ?.filter(
                            h =>
                              h.role ===
                              step.role
                          )
                          ?.map(
                            (
                              item,
                              idx
                            ) => (

                              <div
                                key={
                                  idx
                                }
                                style={{
                                  marginTop: 8,
                                  padding:
                                    "10px 12px",
                                  background:
                                    "#fafafa",
                                  border:
                                    "1px solid #eee",
                                  borderRadius: 10,
                                  fontSize: 12,
                                  color:
                                    "#666"
                                }}
                              >

                                <div
                                  style={{
                                    fontWeight: 600,
                                    marginBottom: 4,
                                    color:
                                      "#333"
                                  }}
                                >

                                  {
                                    item.action
                                  }

                                </div>

                                <div>

                                  Owner:
                                  {" "}
                                  {
                                    item.ownerId
                                  }

                                </div>

                                <div
                                  style={{
                                    marginTop: 4
                                  }}
                                >

                                  {item.timestamp
                                    ? new Date(
                                        item.timestamp
                                      ).toLocaleString()
                                    : "No timestamp"}

                                </div>

                              </div>

                            )
                          )}

                      </div>

                    </div>

                  );
                }
              )}

            </div>

          </Card>

        </div>

      )}

    </div>

  );
}











// ═══════════════════════════════════════════════════════════════════════════════
// ─── NEW: ANALYTICS DASHBOARD ─────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function AnalyticsDashboard({ token, user, showToast }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api("/analytics/dashboard","GET",null,token);
      setAnalytics(data.analytics);
    } catch(e) { showToast(e.message,"error"); }
    setLoading(false);
  };

  useEffect(()=>{ load(); }, []);

  if (loading) return (
    <div>
      <SectionHeader icon={BarChart2} title="Analytics Dashboard" subtitle="Role-specific insights and performance metrics"/>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:24 }}>
        {[1,2,3].map(i=><div key={i} className="shimmer" style={{ height:100, borderRadius:"var(--radius-lg)" }}/>)}
      </div>
      <div className="shimmer" style={{ height:260, borderRadius:"var(--radius-lg)" }}/>
    </div>
  );

  if (!analytics) return (
    <div>
      <SectionHeader icon={BarChart2} title="Analytics Dashboard" subtitle="Role-specific insights and performance metrics">
        <Btn onClick={load} loading={loading} small variant="outline"><RefreshCw size={13}/> Load</Btn>
      </SectionHeader>
      <Card style={{ textAlign:"center", padding:64 }}>
        <BarChart2 size={36} style={{ color:"#ddd", margin:"0 auto 12px" }}/>
        <p style={{ color:"#999" }}>Click to load your analytics</p>
        <Btn onClick={load} style={{ marginTop:16, justifyContent:"center" }}>Load Analytics</Btn>
      </Card>
    </div>
  );

  const role = analytics.role;

  return (
    <div>
      <SectionHeader icon={BarChart2} title="Analytics Dashboard" subtitle={`${ROLE_META[role]?.label||role} — performance insights`}>
        <Btn onClick={load} loading={loading} small variant="outline"><RefreshCw size={13}/> Refresh</Btn>
      </SectionHeader>

      {/* FARMER ANALYTICS */}
      {role==="FARMER" && <FarmerAnalytics analytics={analytics}/>}
      {role==="MANUFACTURER" && <ManufacturerAnalytics analytics={analytics}/>}
      {role==="DISTRIBUTOR" && <DistributorAnalytics analytics={analytics}/>}
      {role==="RETAILER" && <RetailerAnalytics analytics={analytics}/>}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color="#2d6a4f", bg="#d8f3dc" }) {
  return (
    <Card className="stat-card" style={{ padding:"20px 22px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ background:bg, borderRadius:"var(--radius-md)", padding:12, flexShrink:0 }}>
          <Icon size={20} style={{ color }}/>
        </div>
        <div>
          <div style={{ fontSize:11, color:"#999", fontWeight:600, textTransform:"uppercase", letterSpacing:".06em", marginBottom:4 }}>{label}</div>
          <div style={{ fontSize:26, fontWeight:700, color:"var(--dark)", lineHeight:1 }}>{value}</div>
          {sub && <div style={{ fontSize:12, color:"#aaa", marginTop:4 }}>{sub}</div>}
        </div>
      </div>
    </Card>
  );
}

function HorizBar({ label, value, max, color }) {
  const pct = max>0 ? Math.round((value/max)*100) : 0;
  return (
    <div style={{ marginBottom:12 }}>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:5 }}>
        <span style={{ fontWeight:500 }}>{label}</span>
        <span style={{ color:"#999", fontWeight:600 }}>{value}</span>
      </div>
      <div style={{ height:8, background:"#f0ebe3", borderRadius:8, overflow:"hidden" }}>
        <div className="bar-fill" style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg, ${color}, ${color}cc)`, borderRadius:8 }}/>
      </div>
    </div>
  );
}

function FarmerAnalytics({ analytics }) {
  const { overview, growth, categoryStats=[], statusStats=[], recentProducts=[] } = analytics;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
        <StatCard icon={Layers}     label="Total Batches"  value={overview?.totalBatches??0}  color="#2d6a4f" bg="#d8f3dc"/>
        <StatCard icon={Activity}   label="Active"         value={overview?.activeProducts??0} color="#1d4ed8" bg="#dbeafe"/>
        <StatCard icon={CheckCircle} label="Sold"          value={overview?.soldProducts??0}   color="#dc2626" bg="#fee2e2"/>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:16 }}>
        <StatCard icon={Calendar}   label="This Month"  value={growth?.monthlyBatches??0}  sub="batches created"  color="#b45309" bg="#fef3c7"/>
        <StatCard icon={TrendingUp} label="This Year"   value={growth?.yearlyBatches??0}   sub="batches created"  color="#7c3aed" bg="#ede9fe"/>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        {categoryStats.length>0 && (
          <Card>
            <div style={{ fontSize:12, fontWeight:700, color:"#aaa", textTransform:"uppercase", letterSpacing:".07em", marginBottom:16 }}>By Category</div>
            {categoryStats.map((c,i)=><HorizBar key={i} label={c.category||"Unknown"} value={c.total} max={Math.max(...categoryStats.map(x=>x.total))} color="#2d6a4f"/>)}
          </Card>
        )}
        {statusStats.length>0 && (
          <Card>
            <div style={{ fontSize:12, fontWeight:700, color:"#aaa", textTransform:"uppercase", letterSpacing:".07em", marginBottom:16 }}>By Status</div>
            {statusStats.map((s,i)=>{
              const colors = { CREATED:"#1d4ed8", MANUFACTURING:"#b45309", DISTRIBUTING:"#7c3aed", RETAILING:"#2d6a4f", SOLD:"#dc2626" };
              return <HorizBar key={i} label={s.status||"Unknown"} value={s.total} max={Math.max(...statusStats.map(x=>x.total))} color={colors[s.status]||"#999"}/>;
            })}
          </Card>
        )}
      </div>
      {recentProducts.length>0 && (
        <Card>
          <div style={{ fontSize:12, fontWeight:700, color:"#aaa", textTransform:"uppercase", letterSpacing:".07em", marginBottom:16 }}>Recent Products</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {recentProducts.map((p,i)=>(
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 14px", background:"var(--green-xpale)", borderRadius:"var(--radius-sm)" }}>
                <div style={{ fontWeight:600, fontSize:14 }}>{p.productName}</div>
                <StatusBadge status={p.status}/>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function ManufacturerAnalytics({ analytics }) {
  const { overview, growth, packagingStats=[], factoryStats=[], recentProducts=[] } = analytics;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
        <StatCard icon={Factory}    label="Total Manufactured" value={overview?.totalManufactured??0} color="#1d4ed8" bg="#dbeafe"/>
        <StatCard icon={Truck}      label="In Distribution"    value={overview?.inDistribution??0}    color="#b45309" bg="#fef3c7"/>
        <StatCard icon={CheckCircle} label="Sold"              value={overview?.soldProducts??0}      color="#dc2626" bg="#fee2e2"/>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        {packagingStats.length>0 && (
          <Card>
            <div style={{ fontSize:12, fontWeight:700, color:"#aaa", textTransform:"uppercase", letterSpacing:".07em", marginBottom:16 }}>By Packaging</div>
            {packagingStats.map((p,i)=><HorizBar key={i} label={p.packagingType||"Unknown"} value={p.total} max={Math.max(...packagingStats.map(x=>x.total))} color="#1d4ed8"/>)}
          </Card>
        )}
        {factoryStats.length>0 && (
          <Card>
            <div style={{ fontSize:12, fontWeight:700, color:"#aaa", textTransform:"uppercase", letterSpacing:".07em", marginBottom:16 }}>By Factory</div>
            {factoryStats.map((f,i)=><HorizBar key={i} label={f.factoryLocation||"Unknown"} value={f.total} max={Math.max(...factoryStats.map(x=>x.total))} color="#7c3aed"/>)}
          </Card>
        )}
      </div>
    </div>
  );
}

function DistributorAnalytics({ analytics }) {
  const { overview, transportStats=[], warehouseStats=[], recentDeliveries=[] } = analytics;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
        <StatCard icon={Truck}       label="Total Distributed"    value={overview?.totalDistributed??0}  color="#b45309" bg="#fef3c7"/>
        <StatCard icon={Store}       label="Delivered to Retail"  value={overview?.deliveredToRetail??0} color="#7c3aed" bg="#ede9fe"/>
        <StatCard icon={CheckCircle} label="Sold"                 value={overview?.soldProducts??0}      color="#dc2626" bg="#fee2e2"/>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        {transportStats.length>0 && (
          <Card>
            <div style={{ fontSize:12, fontWeight:700, color:"#aaa", textTransform:"uppercase", letterSpacing:".07em", marginBottom:16 }}>Transport Methods</div>
            {transportStats.map((t,i)=><HorizBar key={i} label={t.transportMethod||"Unknown"} value={t.total} max={Math.max(...transportStats.map(x=>x.total))} color="#b45309"/>)}
          </Card>
        )}
        {warehouseStats.length>0 && (
          <Card>
            <div style={{ fontSize:12, fontWeight:700, color:"#aaa", textTransform:"uppercase", letterSpacing:".07em", marginBottom:16 }}>Warehouse Locations</div>
            {warehouseStats.map((w,i)=><HorizBar key={i} label={w.warehouseLocation||"Unknown"} value={w.total} max={Math.max(...warehouseStats.map(x=>x.total))} color="#2d6a4f"/>)}
          </Card>
        )}
      </div>
    </div>
  );
}

function RetailerAnalytics({ analytics }) {
  const { overview, revenue, categorySales=[], topProducts=[], recentCustomers=[] } = analytics;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
        <StatCard icon={Box}         label="Total Products" value={overview?.totalProducts??0}  color="#7c3aed" bg="#ede9fe"/>
        <StatCard icon={CheckCircle} label="Sold"           value={overview?.soldProducts??0}   color="#dc2626" bg="#fee2e2"/>
        <StatCard icon={Store}       label="Unsold"         value={overview?.unsoldProducts??0} color="#b45309" bg="#fef3c7"/>
        <StatCard icon={DollarSign}  label="Revenue"        value={`₹${(revenue?.totalRevenue||0).toLocaleString("en-IN")}`} sub={`₹${(revenue?.monthlyRevenue||0).toLocaleString("en-IN")} this month`} color="#2d6a4f" bg="#d8f3dc"/>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        {topProducts.length>0 && (
          <Card>
            <div style={{ fontSize:12, fontWeight:700, color:"#aaa", textTransform:"uppercase", letterSpacing:".07em", marginBottom:16 }}>Top Products</div>
            {topProducts.map((p,i)=>(
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:i<topProducts.length-1?"1px solid #f5f0ea":"none" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ width:22, height:22, borderRadius:6, background:"var(--green-pale)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"var(--green)" }}>{i+1}</span>
                  <span style={{ fontSize:14, fontWeight:500 }}>{p.productName}</span>
                </div>
                <span style={{ fontSize:13, fontWeight:700, color:"var(--green)" }}>{p.totalSold} sold</span>
              </div>
            ))}
          </Card>
        )}
        {categorySales.length>0 && (
          <Card>
            <div style={{ fontSize:12, fontWeight:700, color:"#aaa", textTransform:"uppercase", letterSpacing:".07em", marginBottom:16 }}>Category Revenue</div>
            {categorySales.map((c,i)=>(
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:i<categorySales.length-1?"1px solid #f5f0ea":"none" }}>
                <span style={{ fontSize:14 }}>{c._id||"Unknown"}</span>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"var(--dark)" }}>₹{(c.revenue||0).toLocaleString("en-IN")}</div>
                  <div style={{ fontSize:11, color:"#aaa" }}>{c.totalSold} sold</div>
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
      {recentCustomers.length>0 && (
        <Card>
          <div style={{ fontSize:12, fontWeight:700, color:"#aaa", textTransform:"uppercase", letterSpacing:".07em", marginBottom:16 }}>Recent Customers</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {recentCustomers.map((c,i)=>(
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 14px", background:"#fafaf7", borderRadius:"var(--radius-sm)", border:"1px solid var(--border)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:32, height:32, borderRadius:"50%", background:"var(--green-pale)", display:"flex", alignItems:"center", justifyContent:"center" }}><User size={14} style={{ color:"var(--green)" }}/></div>
                  <div>
                    <div style={{ fontWeight:600, fontSize:13 }}>{c.customer?.name||"—"}</div>
                    <div style={{ fontSize:11, color:"#aaa" }}>{c.productName}</div>
                  </div>
                </div>
                <span style={{ fontSize:13, fontWeight:700, color:"var(--green)" }}>₹{c["retailer.retailPrice"]||c.retailer?.retailPrice||0}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── NEW: NOTIFICATION / ACTIVITY FEED ────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════





// function NotificationFeed({ token, showToast }) {

//   const [notifs, setNotifs] = useState([]);
//   const [filter, setFilter] = useState("all");

  










// const loadNotifications = async () => {
//   try {

//     const data = await api(
//       "/analytics/dashboard",
//       "GET",
//       null,
//       token
//     );

//     console.log(data);

//     setNotifs(
//   (data.analytics?.recentProducts || []).map(p => ({
//     id: p._id,
//     title: "New Product Added",
//     msg: `${p.productName} batch created`,
//     time: new Date(p.createdAt).toLocaleString(),
//     type: "batch_created",
//     read: false
//   }))
// );

//   } catch(e) {
//     showToast(e.message, "error");
//   }
// };










//   useEffect(() => {
//     if(token){
//       loadNotifications();
//     }
//   }, [token]);

//   const markAll = () =>
//     setNotifs(n =>
//       n.map(x => ({
//         ...x,
//         read:true
//       }))
//     );

//   const dismiss = id =>
//     setNotifs(n =>
//       n.filter(x => x.id !== id)
//     );

//   const markRead = id =>
//     setNotifs(n =>
//       n.map(x =>
//         x.id === id
//           ? { ...x, read:true }
//           : x
//       )
//     );

//   const filtered =
//     filter === "unread"
//       ? notifs.filter(n => !n.read)
//       : filter === "alerts"
//       ? notifs.filter(n => n.type === "alert")
//       : notifs;

//   const unreadCount =
//     notifs.filter(n => !n.read).length;

//   const typeLabels = {
//     transfer_request:"Transfer",
//     otp_verified:"Ownership",
//     product_sold:"Sale",
//     batch_created:"Batch",
//     qr_scanned:"QR Scan",
//     alert:"Alert"
//   };

//   return (
//     <div>

//       <SectionHeader
//         icon={Bell}
//         title="Activity Feed"
//         subtitle="Real-time ownership changes, transfers, OTP events and alerts"
//       >
//         {unreadCount > 0 && (
//           <Btn
//             onClick={markAll}
//             small
//             variant="outline"
//           >
//             <CheckSquare size={13}/>
//             Mark All Read
//           </Btn>
//         )}
//       </SectionHeader>

//       <div
//         style={{
//           display:"flex",
//           gap:8,
//           marginBottom:20,
//           flexWrap:"wrap"
//         }}
//       >

//         {["all","unread","alerts"].map(f => (
//           <button
//             key={f}
//             onClick={() => setFilter(f)}
//             style={{
//               padding:"7px 16px",
//               borderRadius:20,
//               fontSize:12,
//               fontWeight:600,
//               cursor:"pointer",
//               border:
//                 filter === f
//                   ? "none"
//                   : "1.5px solid var(--border)",
//               background:
//                 filter === f
//                   ? "var(--green)"
//                   : "transparent",
//               color:
//                 filter === f
//                   ? "#fff"
//                   : "#666",
//               transition:"all .15s"
//             }}
//           >
//             {
//               f === "all"
//                 ? "All Events"
//                 : f === "unread"
//                 ? `Unread (${unreadCount})`
//                 : "Alerts"
//             }
//           </button>
//         ))}

//         <div
//           style={{
//             marginLeft:"auto",
//             fontSize:13,
//             color:"#aaa",
//             display:"flex",
//             alignItems:"center",
//             gap:6
//           }}
//         >
//           <Activity size={13}/>
//           {filtered.length} events
//         </div>

//       </div>

//       {filtered.length === 0 ? (

//         <Card
//           style={{
//             textAlign:"center",
//             padding:48
//           }}
//         >
//           <Bell
//             size={30}
//             style={{
//               color:"#ddd",
//               margin:"0 auto 12px"
//             }}
//           />

//           <p style={{ color:"#aaa" }}>
//             No notifications available.
//           </p>
//         </Card>

//       ) : (

//         <div
//           style={{
//             display:"flex",
//             flexDirection:"column",
//             gap:8
//           }}
//         >

//           {filtered.map((n,i) => (

//             <div
//               key={n.id || i}
//               className="notif-item"
//               onClick={() => markRead(n.id)}

//               style={{
//                 display:"flex",
//                 gap:14,
//                 padding:"14px 18px",
//                 borderRadius:"var(--radius-md)",
//                 background:
//                   n.read
//                     ? "var(--surface)"
//                     : "#f0faf4",

//                 border:`1px solid ${
//                   n.read
//                     ? "var(--border)"
//                     : "rgba(45,106,79,.15)"
//                 }`,

//                 cursor:"pointer",
//                 position:"relative",
//                 animation:`slideDown .3s ${i*0.04}s both`
//               }}
//             >

//               <div
//                 style={{
//                   width:40,
//                   height:40,
//                   borderRadius:12,
//                   background:n.bg || "#dbeafe",
//                   display:"flex",
//                   alignItems:"center",
//                   justifyContent:"center",
//                   flexShrink:0
//                 }}
//               >

//                 {n.icon ? (
//                   <n.icon
//                     size={16}
//                     style={{
//                       color:n.color || "#1d4ed8"
//                     }}
//                   />
//                 ) : (
//                   <Bell
//                     size={16}
//                     style={{
//                       color:"#1d4ed8"
//                     }}
//                   />
//                 )}

//               </div>

//               <div style={{ flex:1, minWidth:0 }}>

//                 <div
//                   style={{
//                     display:"flex",
//                     justifyContent:"space-between",
//                     alignItems:"flex-start",
//                     gap:8
//                   }}
//                 >

//                   <div
//                     style={{
//                       fontWeight:600,
//                       fontSize:14,
//                       color:"var(--dark)"
//                     }}
//                   >
//                     {n.title}
//                   </div>

//                   <div
//                     style={{
//                       display:"flex",
//                       alignItems:"center",
//                       gap:8,
//                       flexShrink:0
//                     }}
//                   >

//                     <span
//                       style={{
//                         background:n.bg || "#dbeafe",
//                         color:n.color || "#1d4ed8",
//                         borderRadius:20,
//                         padding:"2px 8px",
//                         fontSize:10,
//                         fontWeight:700
//                       }}
//                     >
//                       {typeLabels[n.type] || n.type}
//                     </span>

//                     {!n.read && (
//                       <span
//                         style={{
//                           width:8,
//                           height:8,
//                           borderRadius:"50%",
//                           //background:"var(--green)",
//                           background:"#22c55e",
//                           display:"inline-block"
//                         }}
//                       />
//                     )}

//                   </div>

//                 </div>

//                 <div
//                   style={{
//                     fontSize:13,
//                     color:"#666",
//                     marginTop:3,
//                     lineHeight:1.5
//                   }}
//                 >
//                   {n.msg}
//                 </div>

//                 <div
//                   style={{
//                     fontSize:11,
//                     color:"#bbb",
//                     marginTop:5
//                   }}
//                 >
//                   {n.time}
//                 </div>

//               </div>

//               <button
//                 onClick={e => {
//                   e.stopPropagation();
//                   dismiss(n.id);
//                 }}

//                 style={{
//                   position:"absolute",
//                   top:10,
//                   right:10,
//                   background:"none",
//                   border:"none",
//                   cursor:"pointer",
//                   color:"#ccc",
//                   display:"flex",
//                   padding:4,
//                   borderRadius:4,
//                   transition:"color .15s"
//                 }}
//               >
//                 <X size={13}/>
//               </button>

//             </div>

//           ))}

//         </div>

//       )}

//       <div
//         style={{
//           marginTop:20,
//           padding:"14px 18px",
//           background:"#f9f7f3",
//           borderRadius:"var(--radius-md)",
//           border:"1px dashed var(--border)",
//           display:"flex",
//           gap:10,
//           alignItems:"center"
//         }}
//       >
//         <Zap
//           size={14}
//           style={{ color:"var(--gold)" }}
//         />

//         <span
//           style={{
//             fontSize:12,
//             color:"#888"
//           }}
//         >
//           Live notifications will appear here
//           when ownership transfers, OTPs are
//           verified, or QR codes are scanned.
//         </span>

//       </div>

//     </div>
//   );
// }





// function NotificationFeed({ token, showToast }) {
//   const [notifs, setNotifs] = useState([]);
//   const [filter, setFilter] = useState("all");

//   const loadNotifications = async () => {
//     try {
//       const data = await api("/analytics/dashboard", "GET", null, token);

//       setNotifs(
//         (data.analytics?.recentProducts || []).map((p) => ({
//           id: p._id,
//           title: "New Product Added",
//           msg: `${p.productName} batch created`,
//           time: new Date(p.createdAt).toLocaleString(),
//           type: "batch_created",
//           read: false,
//         }))
//       );
//     } catch (e) {
//       showToast(e.message, "error");
//     }
//   };

//   useEffect(() => {
//     if (token) loadNotifications();
//   }, [token]);

//   const markAll = () =>
//     setNotifs((n) => n.map((x) => ({ ...x, read: true })));

//   const dismiss = (id) =>
//     setNotifs((n) => n.filter((x) => x.id !== id));

//   const markRead = (id) =>
//     setNotifs((n) =>
//       n.map((x) => (x.id === id ? { ...x, read: true } : x))
//     );

//   const filtered =
//     filter === "unread"
//       ? notifs.filter((n) => !n.read)
//       : filter === "alerts"
//       ? notifs.filter((n) => n.type === "alert")
//       : notifs;

//   const unreadCount = notifs.filter((n) => !n.read).length;

//   const typeLabels = {
//     transfer_request: "Transfer",
//     otp_verified: "Ownership",
//     product_sold: "Sale",
//     batch_created: "Batch",
//     qr_scanned: "QR Scan",
//     alert: "Alert",
//   };

//   const ui = {
//     shell: {
//       background: "linear-gradient(180deg, #ffffff 0%, #fbfcfd 100%)",
//       border: "1px solid rgba(16,24,40,0.08)",
//       borderRadius: 24,
//       padding: 22,
//       boxShadow: "0 10px 30px rgba(16,24,40,0.06)",
//     },
//     toolbar: {
//       display: "flex",
//       gap: 10,
//       marginBottom: 18,
//       flexWrap: "wrap",
//       alignItems: "center",
//     },
//     tab: (active) => ({
//       padding: "9px 16px",
//       borderRadius: 999,
//       fontSize: 12,
//       fontWeight: 600,
//       border: active
//         ? "1px solid rgba(15,23,42,0.04)"
//         : "1px solid rgba(16,24,40,0.08)",
//       background: active ? "#111827" : "rgba(255,255,255,0.75)",
//       color: active ? "#fff" : "#475467",
//       boxShadow: active ? "0 6px 18px rgba(17,24,39,0.16)" : "none",
//       backdropFilter: "blur(8px)",
//       transition: "all .22s ease",
//       cursor: "pointer",
//     }),
//     stats: {
//       marginLeft: "auto",
//       fontSize: 12,
//       color: "#667085",
//       display: "flex",
//       alignItems: "center",
//       gap: 8,
//       padding: "8px 12px",
//       borderRadius: 999,
//       background: "rgba(248,250,252,.9)",
//       border: "1px solid rgba(16,24,40,0.06)",
//     },
//     list: {
//       display: "flex",
//       flexDirection: "column",
//       gap: 12,
//     },
//     item: (read) => ({
//       position: "relative",
//       display: "flex",
//       gap: 14,
//       padding: "16px 18px",
//       borderRadius: 20,
//       background: read
//         ? "rgba(255,255,255,0.86)"
//         : "linear-gradient(180deg, #f8fbff 0%, #f4f8ff 100%)",
//       border: read
//         ? "1px solid rgba(16,24,40,0.07)"
//         : "1px solid rgba(59,130,246,0.10)",
//       boxShadow: read
//         ? "0 4px 14px rgba(16,24,40,0.04)"
//         : "0 10px 25px rgba(37,99,235,0.08)",
//       cursor: "pointer",
//       transition: "transform .18s ease, box-shadow .18s ease, background .18s ease",
//     }),
//     iconBox: (read) => ({
//       width: 42,
//       height: 42,
//       borderRadius: 14,
//       background: read ? "#f2f4f7" : "#eaf2ff",
//       color: read ? "#667085" : "#245bdb",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       flexShrink: 0,
//       border: "1px solid rgba(16,24,40,0.05)",
//     }),
//     title: {
//       fontSize: 15,
//       fontWeight: 700,
//       color: "#101828",
//       letterSpacing: "-0.01em",
//     },
//     message: {
//       fontSize: 13.5,
//       color: "#475467",
//       marginTop: 4,
//       lineHeight: 1.55,
//     },
//     time: {
//       fontSize: 12,
//       color: "#98A2B3",
//       marginTop: 8,
//     },
//     badge: (type) => ({
//       background: type === "alert" ? "#fff1f3" : "#eef4ff",
//       color: type === "alert" ? "#c01048" : "#344054",
//       border: "1px solid rgba(16,24,40,0.06)",
//       borderRadius: 999,
//       padding: "4px 10px",
//       fontSize: 10.5,
//       fontWeight: 700,
//       letterSpacing: ".02em",
//     }),
//     unreadDot: {
//       width: 8,
//       height: 8,
//       borderRadius: "50%",
//       background: "#2563eb",
//       boxShadow: "0 0 0 4px rgba(37,99,235,0.12)",
//       display: "inline-block",
//     },
//     dismiss: {
//       position: "absolute",
//       top: 12,
//       right: 12,
//       background: "rgba(255,255,255,.8)",
//       border: "1px solid rgba(16,24,40,0.06)",
//       width: 28,
//       height: 28,
//       borderRadius: 10,
//       cursor: "pointer",
//       color: "#98A2B3",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//     },
//     empty: {
//       textAlign: "center",
//       padding: "56px 24px",
//       borderRadius: 20,
//       background: "rgba(248,250,252,.7)",
//       border: "1px dashed rgba(16,24,40,0.08)",
//       color: "#98A2B3",
//     },
//     footerNote: {
//       marginTop: 18,
//       padding: "14px 16px",
//       background: "linear-gradient(180deg, #fcfcfd 0%, #f8fafc 100%)",
//       borderRadius: 18,
//       border: "1px solid rgba(16,24,40,0.06)",
//       display: "flex",
//       gap: 10,
//       alignItems: "center",
//       color: "#667085",
//       fontSize: 12.5,
//     },
//   };

//   return (
//     <div style={ui.shell}>
//       <SectionHeader
//         icon={Bell}
//         title="Activity Feed"
//         subtitle="Ownership changes, transfers, OTP events and alerts"
//       >
//         {unreadCount > 0 && (
//           <Btn onClick={markAll} small variant="outline">
//             <CheckSquare size={13} />
//             Mark All Read
//           </Btn>
//         )}
//       </SectionHeader>

//       <div style={ui.toolbar}>
//         {["all", "unread", "alerts"].map((f) => (
//           <button
//             key={f}
//             onClick={() => setFilter(f)}
//             style={ui.tab(filter === f)}
//           >
//             {f === "all"
//               ? "All Events"
//               : f === "unread"
//               ? `Unread (${unreadCount})`
//               : "Alerts"}
//           </button>
//         ))}

//         <div style={ui.stats}>
//           <Activity size={13} />
//           {filtered.length} events
//         </div>
//       </div>

//       {filtered.length === 0 ? (
//         <div style={ui.empty}>
//           <Bell size={28} style={{ margin: "0 auto 12px", opacity: 0.55 }} />
//           <p>No notifications available.</p>
//         </div>
//       ) : (
//         <div style={ui.list}>
//           {filtered.map((n, i) => (
//             <div
//               key={n.id || i}
//               onClick={() => markRead(n.id)}
//               style={ui.item(n.read)}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.transform = "translateY(-1px)";
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.transform = "translateY(0)";
//               }}
//             >
//               <div style={ui.iconBox(n.read)}>
//                 {n.icon ? <n.icon size={16} /> : <Bell size={16} />}
//               </div>

//               <div style={{ flex: 1, minWidth: 0 }}>
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "flex-start",
//                     gap: 8,
//                     paddingRight: 34,
//                   }}
//                 >
//                   <div style={ui.title}>{n.title}</div>

//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 8,
//                       flexShrink: 0,
//                     }}
//                   >
//                     <span style={ui.badge(n.type)}>
//                       {typeLabels[n.type] || n.type}
//                     </span>
//                     {!n.read && <span style={ui.unreadDot} />}
//                   </div>
//                 </div>

//                 <div style={ui.message}>{n.msg}</div>
//                 <div style={ui.time}>{n.time}</div>
//               </div>

//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   dismiss(n.id);
//                 }}
//                 style={ui.dismiss}
//                 aria-label="Dismiss notification"
//               >
//                 <X size={13} />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       <div style={ui.footerNote}>
//         <Zap size={14} style={{ color: "#667085" }} />
//         <span>
//           Live notifications will appear here when ownership transfers, OTPs are
//           verified, or QR codes are scanned.
//         </span>
//       </div>
//     </div>
//   );
// }







function NotificationFeed({ token, showToast }) {
  const [notifs, setNotifs] = useState([]);
  const [filter, setFilter] = useState("all");

  const loadNotifications = async () => {
    try {
      const data = await api(
        "/analytics/dashboard",
        "GET",
        null,
        token
      );

      console.log(data);

      setNotifs(
        (data.analytics?.recentProducts || []).map((p) => ({
          id: p._id,
          title: "New Product Added",
          msg: `${p.productName} batch created`,
          time: new Date(p.createdAt).toLocaleString(),
          type: "batch_created",
          read: false
        }))
      );
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  useEffect(() => {
    if (token) {
      loadNotifications();
    }
  }, [token]);

  const markAll = () =>
    setNotifs((n) =>
      n.map((x) => ({
        ...x,
        read: true
      }))
    );

  const dismiss = (id) =>
    setNotifs((n) =>
      n.filter((x) => x.id !== id)
    );

  const markRead = (id) =>
    setNotifs((n) =>
      n.map((x) =>
        x.id === id
          ? { ...x, read: true }
          : x
      )
    );

  const filtered =
    filter === "unread"
      ? notifs.filter((n) => !n.read)
      : filter === "alerts"
      ? notifs.filter((n) => n.type === "alert")
      : notifs;

  const unreadCount =
    notifs.filter((n) => !n.read).length;

  const typeLabels = {
    transfer_request: "Transfer",
    otp_verified: "Ownership",
    product_sold: "Sale",
    batch_created: "Batch",
    qr_scanned: "QR Scan",
    alert: "Alert"
  };

  const BellWithDot = ({ size = 18 }) => (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Bell size={size} />
      {unreadCount > 0 && (
        <span
          style={{
            position: "absolute",
            top: -2,
            right: -2,
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#ef4444",
            border: "2px solid #fff",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.05)"
          }}
        />
      )}
    </div>
  );

  return (
    <div>
      <SectionHeader
        icon={BellWithDot}
        title="Activity Feed"
        subtitle="Real-time ownership changes, transfers, OTP events and alerts"
      >
        {unreadCount > 0 && (
          <Btn
            onClick={markAll}
            small
            variant="outline"
          >
            <CheckSquare size={13} />
            Mark All Read
          </Btn>
        )}
      </SectionHeader>

      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 20,
          flexWrap: "wrap"
        }}
      >
        {["all", "unread", "alerts"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "7px 16px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              border:
                filter === f
                  ? "none"
                  : "1.5px solid var(--border)",
              background:
                filter === f
                  ? "var(--green)"
                  : "transparent",
              color:
                filter === f
                  ? "#fff"
                  : "#666",
              transition: "all .15s"
            }}
          >
            {f === "all"
              ? "All Events"
              : f === "unread"
              ? `Unread (${unreadCount})`
              : "Alerts"}
          </button>
        ))}

        <div
          style={{
            marginLeft: "auto",
            fontSize: 13,
            color: "#aaa",
            display: "flex",
            alignItems: "center",
            gap: 6
          }}
        >
          <Activity size={13} />
          {filtered.length} events
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card
          style={{
            textAlign: "center",
            padding: 48
          }}
        >
          <Bell
            size={30}
            style={{
              color: "#ddd",
              margin: "0 auto 12px"
            }}
          />

          <p style={{ color: "#aaa" }}>
            No notifications available.
          </p>
        </Card>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8
          }}
        >
          {filtered.map((n, i) => (
            <div
              key={n.id || i}
              className="notif-item"
              onClick={() => markRead(n.id)}
              style={{
                display: "flex",
                gap: 14,
                padding: "14px 18px",
                borderRadius: "var(--radius-md)",
                background: n.read
                  ? "var(--surface)"
                  : "#f0faf4",
                border: `1px solid ${
                  n.read
                    ? "var(--border)"
                    : "rgba(45,106,79,.15)"
                }`,
                cursor: "pointer",
                position: "relative",
                animation: `slideDown .3s ${i * 0.04}s both`
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: n.bg || "#dbeafe",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
              >
                {n.icon ? (
                  <n.icon
                    size={16}
                    style={{
                      color: n.color || "#1d4ed8"
                    }}
                  />
                ) : (
                  <Bell
                    size={16}
                    style={{
                      color: "#1d4ed8"
                    }}
                  />
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 8
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      color: "var(--dark)"
                    }}
                  >
                    {n.title}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexShrink: 0
                    }}
                  >
                    <span
                      style={{
                        background: n.bg || "#dbeafe",
                        color: n.color || "#1d4ed8",
                        borderRadius: 20,
                        padding: "2px 8px",
                        fontSize: 10,
                        fontWeight: 700
                      }}
                    >
                      {typeLabels[n.type] || n.type}
                    </span>

                    {!n.read && (
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#22c55e",
                          display: "inline-block"
                        }}
                      />
                    )}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: 13,
                    color: "#666",
                    marginTop: 3,
                    lineHeight: 1.5
                  }}
                >
                  {n.msg}
                </div>

                <div
                  style={{
                    fontSize: 11,
                    color: "#bbb",
                    marginTop: 5
                  }}
                >
                  {n.time}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dismiss(n.id);
                }}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#ccc",
                  display: "flex",
                  padding: 4,
                  borderRadius: 4,
                  transition: "color .15s"
                }}
                aria-label="Dismiss notification"
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          marginTop: 20,
          padding: "14px 18px",
          background: "#f9f7f3",
          borderRadius: "var(--radius-md)",
          border: "1px dashed var(--border)",
          display: "flex",
          gap: 10,
          alignItems: "center"
        }}
      >
        <Zap
          size={14}
          style={{ color: "var(--gold)" }}
        />

        <span
          style={{
            fontSize: 12,
            color: "#888"
          }}
        >
          Live notifications will appear here
          when ownership transfers, OTPs are
          verified, or QR codes are scanned.
        </span>
      </div>
    </div>
  );
}












// ═══════════════════════════════════════════════════════════════════════════════
// ─── NEW: PUBLIC QR SCANNER PREVIEW ───────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════




// function PublicQRPreview({ showToast }) {
//   const [productId, setProductId] = useState("");
//   const [loading, setLoading]     = useState(false);
//   const [history, setHistory]     = useState(null);

//   const load = async () => {
//     if (!productId.trim()) return showToast("Enter a Product ID to preview","error");
//     setLoading(true);
//     try {
//       const data = await api(`/products/history/${productId.trim()}`);
//       setHistory(data);
//     } catch(e) { showToast(e.message,"error"); }
//     setLoading(false);
//   };

//   return (
//     <div>
//       <SectionHeader icon={QrCode} title="QR Public Page Preview" subtitle="Preview exactly what a customer sees when they scan a product QR code"/>

//       <div style={{ marginBottom:20, padding:"12px 16px", background:"#fef9ee", border:"1px solid rgba(201,168,76,.3)", borderRadius:"var(--radius-md)", display:"flex", gap:10, alignItems:"center" }}>
//         <ExternalLink size={14} style={{ color:"var(--gold)", flexShrink:0 }}/>
//         <span style={{ fontSize:13, color:"#7a6a40" }}>
//           The public URL is <code style={{ background:"rgba(0,0,0,.06)", padding:"2px 7px", borderRadius:4, fontSize:12 }}>https://agrotrace.io/scan/:productId</code> — no login required. This panel shows a live preview.
//         </span>
//       </div>

//       <Card style={{ maxWidth:480, marginBottom:24 }}>
//         <div style={{ display:"flex", gap:10 }}>
//           <div style={{ flex:1 }}><Input value={productId} onChange={setProductId} placeholder="Enter Product ID to preview…"/></div>
//           <Btn onClick={load} loading={loading}><QrCode size={15}/> Preview</Btn>
//         </div>
//       </Card>

//       {history && (
//         <div className="fade-up">
//           {/* Public-facing card — dark background to mimic customer phone view */}
//           <div style={{ background:"linear-gradient(145deg, #0a1510 0%, #0f2218 50%, #0d1a1a 100%)", borderRadius:"var(--radius-lg)", padding:28, maxWidth:480, position:"relative", overflow:"hidden" }}>
//             {/* orbs */}
//             <div style={{ position:"absolute", width:200, height:200, borderRadius:"50%", background:"var(--green)", top:-60, left:-60, filter:"blur(60px)", opacity:.15, pointerEvents:"none" }}/>
//             <div style={{ position:"absolute", width:150, height:150, borderRadius:"50%", background:"var(--gold)", bottom:-40, right:-40, filter:"blur(60px)", opacity:.12, pointerEvents:"none" }}/>

//             <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:22 }}>
//               <div style={{ background:"linear-gradient(135deg, var(--green), var(--green-l))", borderRadius:"var(--radius-sm)", padding:8 }}>
//                 <Leaf style={{ width:16, height:16, color:"#fff" }}/>
//               </div>
//               <span className="serif" style={{ fontSize:19, fontWeight:600, color:"#fff" }}>Agro<span style={{ color:"var(--gold)" }}>Trace</span></span>
//               <span style={{ marginLeft:"auto", fontSize:10, color:"rgba(255,255,255,.3)", letterSpacing:".05em" }}>VERIFIED</span>
//             </div>

//             <div style={{ background:"rgba(255,255,255,.05)", borderRadius:"var(--radius-md)", padding:"14px 16px", marginBottom:16, backdropFilter:"blur(4px)", border:"1px solid rgba(255,255,255,.07)" }}>
//               <div style={{ fontSize:10, color:"rgba(255,255,255,.4)", letterSpacing:".08em", marginBottom:6 }}>PRODUCT</div>
//               <div className="serif" style={{ fontSize:22, color:"#fff", fontWeight:600 }}>{history.productName||history.name}</div>
//               <div style={{ display:"flex", gap:8, marginTop:8, flexWrap:"wrap" }}>
//                 <span style={{ background:"rgba(45,106,79,.35)", color:"#4ade80", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700 }}>{history.category}</span>
//                 {/* <span style={{ color:"rgba(255,255,255,.4)", fontSize:12 }}>{history.quantity} units</span> */}
                
//                 <span style={{ color:"rgba(255,255,255,.92)", fontSize:12, fontWeight:500 }}>
                  
//   {history?.quantity ?? history?.product?.quantity ?? history?.farmer?.quantity ?? "0"} units
// </span>
//               </div>
//             </div>

//             {/* Journey steps — compact customer view */}
//             {[
//               { role:"FARMER",       icon:"🌱", label:"Farmed by",     value:history.farmer?.farmLocation, sub:history.farmer?.farmingMethod },
//               { role:"MANUFACTURER", icon:"🏭", label:"Manufactured",  value:history.manufacturer?.factoryLocation, sub:history.manufacturer?.packagingType },
//               { role:"DISTRIBUTOR",  icon:"🚚", label:"Distributed via",value:history.distributor?.warehouseLocation, sub:history.distributor?.transportMethod },
//               { role:"RETAILER",     icon:"🏪", label:"Retailed at",   value:history.retailer?.storeLocation, sub:history.retailer?.retailPrice?`₹${history.retailer.retailPrice}`:null },
//             ].map((s,i)=>(
//               s.value ? (
//                 <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom:12 }}>
//                   <span style={{ fontSize:20, flexShrink:0, width:32, textAlign:"center" }}>{s.icon}</span>
//                   <div style={{ background:"rgba(255,255,255,.04)", borderRadius:"var(--radius-sm)", padding:"10px 14px", flex:1, border:"1px solid rgba(255,255,255,.06)" }}>
//                     <div style={{ fontSize:10, color:"rgba(255,255,255,.35)", letterSpacing:".06em", marginBottom:3 }}>{s.label.toUpperCase()}</div>
//                     <div style={{ fontSize:13, color:"#fff", fontWeight:600 }}>{s.value}</div>
//                     {s.sub && <div style={{ fontSize:11, color:"rgba(255,255,255,.4)", marginTop:2 }}>{s.sub}</div>}
//                   </div>
//                 </div>
//               ) : null
//             ))}

//             {history.blockchainTx && (
//               <div style={{ background:"rgba(201,168,76,.08)", borderRadius:"var(--radius-sm)", padding:"10px 14px", border:"1px solid rgba(201,168,76,.2)", marginTop:4 }}>
//                 <div style={{ fontSize:10, color:"var(--gold)", fontWeight:700, letterSpacing:".07em", marginBottom:4 }}>BLOCKCHAIN ANCHOR</div>
//                 <code style={{ fontSize:11, color:"rgba(201,168,76,.9)", wordBreak:"break-all" }}>{history.blockchainTx}</code>
//               </div>
//             )}

//             <div style={{ textAlign:"center", marginTop:20, fontSize:11, color:"rgba(255,255,255,.2)" }}>Farm to shelf · Verified on blockchain</div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





































function PublicQRPreview({ showToast }) {
  const [productId, setProductId] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(null);

  const cardRef = useRef(null);

  const load = async () => {
    if (!productId.trim()) {
      return showToast(
        "Enter a Product ID to preview",
        "error"
      );
    }

    setLoading(true);

    try {
      const data = await api(
        `/products/history/${productId.trim()}`
      );

      setHistory(data);

    } catch (e) {

      showToast(e.message, "error");

    }

    setLoading(false);
  };

  const downloadQRCard = async () => {
    if (!cardRef.current) return;

    const canvas =
      await html2canvas(cardRef.current);

    const link =
      document.createElement("a");

    link.download =
      `${history.productId}-qr-card.png`;

    link.href =
      canvas.toDataURL("image/png");

    link.click();
  };

  return (
    <div>

      <SectionHeader
        icon={QrCode}
        title="QR Public Page Preview"
        subtitle="Preview exactly what a customer sees when they scan a product QR code"
      />

      <div
        style={{
          marginBottom:20,
          padding:"12px 16px",
          background:"#fef9ee",
          border:"1px solid rgba(201,168,76,.3)",
          borderRadius:"var(--radius-md)",
          display:"flex",
          gap:10,
          alignItems:"center"
        }}
      >
        <ExternalLink
          size={14}
          style={{
            color:"var(--gold)",
            flexShrink:0
          }}
        />

        <span
          style={{
            fontSize:13,
            color:"#7a6a40"
          }}
        >
          The public URL is

          <code
            style={{
              background:"rgba(0,0,0,.06)",
              padding:"2px 7px",
              borderRadius:4,
              fontSize:12
            }}
          >
            https://agrotrace.io/scan/:productId
          </code>

          — no login required.
          This panel shows a live preview.
        </span>
      </div>

      <Card
        style={{
          maxWidth:480,
          marginBottom:24
        }}
      >
        <div
          style={{
            display:"flex",
            gap:10
          }}
        >
          <div style={{ flex:1 }}>
            <Input
              value={productId}
              onChange={setProductId}
              placeholder="Enter Product ID to preview…"
            />
          </div>

          <Btn
            onClick={load}
            loading={loading}
          >
            <QrCode size={15}/>
            Preview
          </Btn>
        </div>
      </Card>

      {history && (
        <div
          className="fade-up"
          ref={cardRef}
        >

          <div
            style={{
              background:
                "linear-gradient(145deg, #0a1510 0%, #0f2218 50%, #0d1a1a 100%)",

              borderRadius:"var(--radius-lg)",

              padding:28,

              maxWidth:480,

              position:"relative",

              overflow:"hidden"
            }}
          >

            {/* background orbs */}

            <div
              style={{
                position:"absolute",
                width:200,
                height:200,
                borderRadius:"50%",
                background:"var(--green)",
                
                top:-60,
                left:-60,
                filter:"blur(60px)",
                opacity:.15,
                pointerEvents:"none"
              }}
            />

            <div
              style={{
                position:"absolute",
                width:150,
                height:150,
                borderRadius:"50%",
                background:"var(--gold)",
                bottom:-40,
                right:-40,
                filter:"blur(60px)",
                opacity:.12,
                pointerEvents:"none"
              }}
            />

            {/* header */}

            <div
              style={{
                display:"flex",
                alignItems:"center",
                gap:10,
                marginBottom:22
              }}
            >
              <div
                style={{
                  background:
                    "linear-gradient(135deg, var(--green), var(--green-l))",

                  borderRadius:"var(--radius-sm)",

                  padding:8
                }}
              >
                <Leaf
                  style={{
                    width:16,
                    height:16,
                    color:"#fff"
                  }}
                />
              </div>

              <span
                className="serif"
                style={{
                  fontSize:19,
                  fontWeight:600,
                  color:"#fff"
                }}
              >
                Agro
                <span
                  style={{
                    color:"var(--gold)"
                  }}
                >
                  Trace
                </span>
              </span>

              <span
                style={{
                  marginLeft:"auto",
                  fontSize:10,
                  color:"rgba(255,255,255,.3)",
                  letterSpacing:".05em"
                }}
              >
                VERIFIED
              </span>
            </div>

            {/* product card */}

            <div
              style={{
                background:"rgba(255,255,255,.05)",

                borderRadius:"var(--radius-md)",

                padding:"14px 16px",

                marginBottom:16,

                backdropFilter:"blur(4px)",

                border:"1px solid rgba(255,255,255,.07)"
              }}
            >

              <div
                style={{
                  fontSize:10,
                  color:"rgba(255,255,255,.4)",
                  letterSpacing:".08em",
                  marginBottom:6
                }}
              >
                PRODUCT
              </div>

              <div
                className="serif"
                style={{
                  fontSize:22,
                  color:"#fff",
                  fontWeight:600
                }}
              >
                {history.productName || history.name}
              </div>

              {/* product id */}

              <div
                style={{
                  marginTop:10,
                  fontSize:12,
                  color:"rgba(255,255,255,.65)"
                }}
              >
                Product ID: {history.productId}
              </div>

              <div
                style={{
                  display:"flex",
                  gap:8,
                  marginTop:8,
                  flexWrap:"wrap"
                }}
              >
                <span
                  style={{
                    background:"rgba(45,106,79,.35)",
                    color:"#4ade80",
                    borderRadius:20,
                    padding:"3px 10px",
                    fontSize:11,
                    fontWeight:700
                  }}
                >
                  {history.category}
                </span>

                <span
                  style={{
                    color:"rgba(255,255,255,.92)",
                    fontSize:12,
                    fontWeight:500
                  }}
                >
                  {history?.quantity ??
                    history?.product?.quantity ??
                    history?.farmer?.quantity ??
                    "0"} units
                </span>
              </div>
            </div>

            {/* fake qr preview */}

            <div
              style={{
                background:"#fff",
                borderRadius:"var(--radius-md)",
                padding:20,
                width:170,
                margin:"0 auto 20px",
                display:"flex",
                flexDirection:"column",
                alignItems:"center",
                gap:10
              }}
            >
              <QRCodeCanvas
  // value={`https://agrotrace.io/scan/${history.product?.productId}`}

  value={`http://localhost:5173/scan/${history.product?.productId}`}
  size={140}
  bgColor="#ffffff"
  fgColor="#000000"
  level="H"
/>

              <div
                style={{
                  fontSize:11,
                  color:"#666",
                  textAlign:"center",
                  wordBreak:"break-all"
                }}
              >
                {history.productId}
              </div>
            </div>

            {/* journey */}

            {[
              {
                role:"FARMER",
                icon:"🌱",
                label:"Farmed by",
                value:history.farmer?.farmLocation,
                sub:history.farmer?.farmingMethod
              },

              {
                role:"MANUFACTURER",
                icon:"🏭",
                label:"Manufactured",
                value:history.manufacturer?.factoryLocation,
                sub:history.manufacturer?.packagingType
              },

              {
                role:"DISTRIBUTOR",
                icon:"🚚",
                label:"Distributed via",
                value:history.distributor?.warehouseLocation,
                sub:history.distributor?.transportMethod
              },

              {
                role:"RETAILER",
                icon:"🏪",
                label:"Retailed at",
                value:history.retailer?.storeLocation,
                sub:history.retailer?.retailPrice
                  ? `₹${history.retailer.retailPrice}`
                  : null
              },

            ].map((s,i)=>(

              s.value ? (

                <div
                  key={i}
                  style={{
                    display:"flex",
                    gap:12,
                    alignItems:"flex-start",
                    marginBottom:12
                  }}
                >

                  <span
                    style={{
                      fontSize:20,
                      flexShrink:0,
                      width:32,
                      textAlign:"center"
                    }}
                  >
                    {s.icon}
                  </span>

                  <div
                    style={{
                      background:"rgba(255,255,255,.04)",
                      borderRadius:"var(--radius-sm)",
                      padding:"10px 14px",
                      flex:1,
                      border:"1px solid rgba(255,255,255,.06)"
                    }}
                  >

                    <div
                      style={{
                        fontSize:10,
                        color:"rgba(255,255,255,.35)",
                        letterSpacing:".06em",
                        marginBottom:3
                      }}
                    >
                      {s.label.toUpperCase()}
                    </div>

                    <div
                      style={{
                        fontSize:13,
                        color:"#fff",
                        fontWeight:600
                      }}
                    >
                      {s.value}
                    </div>

                    {s.sub && (
                      <div
                        style={{
                          fontSize:11,
                          color:"rgba(255,255,255,.4)",
                          marginTop:2
                        }}
                      >
                        {s.sub}
                      </div>
                    )}

                  </div>

                </div>

              ) : null

            ))}

            {/* download button */}

            <div
              style={{
                marginTop:24,
                display:"flex",
                justifyContent:"center"
              }}
            >
              <Btn
                onClick={downloadQRCard}
                variant="outline"
                small
              >
                Download QR Card
              </Btn>
            </div>

            <div
              style={{
                textAlign:"center",
                marginTop:20,
                fontSize:11,
                color:"rgba(255,255,255,.2)"
              }}
            >
              Farm to shelf · Verified on blockchain
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

















// ═══════════════════════════════════════════════════════════════════════════════
// ─── NEW: ADMIN PANEL ─────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
const MOCK_USERS = [
  { id:"FAR001234", name:"Ramesh Kumar",     email:"ramesh@farm.in",   role:"FARMER",       status:"active",   products:12, joined:"Jan 2024" },
  { id:"FAR002345", name:"Priya Singh",      email:"priya@harvest.in", role:"FARMER",       status:"active",   products:8,  joined:"Feb 2024" },
  { id:"MANU00123", name:"AgroProcess Ltd",  email:"ops@agroprocess",  role:"MANUFACTURER", status:"active",   products:34, joined:"Dec 2023" },
  { id:"MANU00456", name:"BioFoods Co.",     email:"admin@biofoods",   role:"MANUFACTURER", status:"flagged",  products:6,  joined:"Mar 2024" },
  { id:"DIST00789", name:"FastMove Logistics",email:"fm@logistics",    role:"DISTRIBUTOR",  status:"active",   products:28, joined:"Jan 2024" },
  { id:"RETA01234", name:"Bazaar Mart",      email:"mgr@bazaarmart",   role:"RETAILER",     status:"active",   products:19, joined:"Feb 2024" },
  { id:"RETA05678", name:"FreshStop Stores", email:"ops@freshstop",    role:"RETAILER",     status:"suspended",products:0,  joined:"Apr 2024" },
];

const MOCK_PRODUCTS_ADMIN = [
  { id:"PROD-RICE-001",    name:"Basmati Rice",   owner:"Ramesh Kumar",    role:"FARMER",       status:"CREATED",       hash:"0xab3f…9c1e" },
  { id:"PROD-WHEAT-002",   name:"Durum Wheat",    owner:"AgroProcess Ltd", role:"MANUFACTURER", status:"MANUFACTURING", hash:"0xfe12…44a7" },
  { id:"PROD-MANGO-003",   name:"Alphonso Mango", owner:"FastMove",        role:"DISTRIBUTOR",  status:"DISTRIBUTING",  hash:"0x32cd…891b" },
  { id:"PROD-MAIZE-004",   name:"Yellow Maize",   owner:"Bazaar Mart",     role:"RETAILER",     status:"RETAILING",     hash:"0x77af…2e63" },
  { id:"PROD-PULSE-005",   name:"Red Lentils",    owner:"Customer",        role:"CUSTOMER",     status:"SOLD",          hash:"0x90bc…f5d2" },
  { id:"PROD-SUGAR-006",   name:"Sugarcane",      owner:"BioFoods Co.",    role:"MANUFACTURER", status:"MANUFACTURING", hash:"0x1a2b…3c4d", flagged:true },
];

function AdminPanel({ token, showToast }) {
  const [subTab, setSubTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [userFilter, setUserFilter] = useState("all");

  const statusColor = { active:["#d8f3dc","#2d6a4f"], flagged:["#fef3c7","#b45309"], suspended:["#fee2e2","#dc2626"] };

  const filteredUsers = MOCK_USERS.filter(u=>{
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()) || u.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = userFilter==="all" || u.status===userFilter || u.role.toLowerCase()===userFilter.toLowerCase();
    return matchSearch && matchFilter;
  });

  const totalProducts   = MOCK_PRODUCTS_ADMIN.length;
  const activeProducts  = MOCK_PRODUCTS_ADMIN.filter(p=>p.status!=="SOLD").length;
  const flaggedItems    = MOCK_PRODUCTS_ADMIN.filter(p=>p.flagged).length;
  const totalUsers      = MOCK_USERS.length;
  const flaggedUsers    = MOCK_USERS.filter(u=>u.status==="flagged"||u.status==="suspended").length;

  return (
    <div>
      <SectionHeader icon={Shield} title="Admin Panel" subtitle="Platform-wide oversight — users, products, integrity flags">
        <div style={{ display:"flex", alignItems:"center", gap:8, background:"#fee2e2", color:"#dc2626", borderRadius:"var(--radius-sm)", padding:"7px 14px", fontSize:12, fontWeight:700 }}>
          <Lock size={12}/> ADMIN ACCESS
        </div>
      </SectionHeader>

      {/* Sub-tabs */}
      <div style={{ display:"flex", gap:4, marginBottom:24, borderBottom:"1.5px solid var(--border)", paddingBottom:0 }}>
        {[
          { id:"overview", label:"Overview",  icon:BarChart2 },
          { id:"users",    label:"Users",      icon:Users },
          { id:"products", label:"Products",   icon:Database },
          { id:"flags",    label:"Flags & Alerts", icon:Flag },
        ].map(t=>(
          <button key={t.id} onClick={()=>setSubTab(t.id)} style={{ display:"flex", alignItems:"center", gap:7, padding:"10px 16px", background:"none", border:"none", borderBottom:subTab===t.id?"2.5px solid var(--red)":"2.5px solid transparent", marginBottom:-1.5, color:subTab===t.id?"var(--red)":"#888", fontWeight:subTab===t.id?700:400, fontSize:13, cursor:"pointer", transition:"all .15s" }}>
            <t.icon size={13}/> {t.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {subTab==="overview" && (
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
            <StatCard icon={Users}       label="Total Users"      value={totalUsers}         color="#1d4ed8" bg="#dbeafe"/>
            <StatCard icon={Package}     label="Total Products"   value={totalProducts}      color="#2d6a4f" bg="#d8f3dc"/>
            <StatCard icon={Activity}    label="Active Products"  value={activeProducts}     color="#b45309" bg="#fef3c7"/>
            <StatCard icon={AlertCircle} label="Flagged"          value={flaggedUsers+flaggedItems} color="#dc2626" bg="#fee2e2"/>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <Card>
              <div style={{ fontSize:12, fontWeight:700, color:"#aaa", textTransform:"uppercase", letterSpacing:".07em", marginBottom:16 }}>Users by Role</div>
              {ROLES.map(r=>{
                const count = MOCK_USERS.filter(u=>u.role===r).length;
                const meta = ROLE_META[r];
                return <HorizBar key={r} label={meta.label} value={count} max={MOCK_USERS.length} color={meta.color}/>;
              })}
            </Card>
            <Card>
              <div style={{ fontSize:12, fontWeight:700, color:"#aaa", textTransform:"uppercase", letterSpacing:".07em", marginBottom:16 }}>Products by Status</div>
              {["CREATED","MANUFACTURING","DISTRIBUTING","RETAILING","SOLD"].map(s=>{
                const count = MOCK_PRODUCTS_ADMIN.filter(p=>p.status===s).length;
                const colors = { CREATED:"#1d4ed8", MANUFACTURING:"#b45309", DISTRIBUTING:"#7c3aed", RETAILING:"#2d6a4f", SOLD:"#dc2626" };
                return <HorizBar key={s} label={s} value={count} max={MOCK_PRODUCTS_ADMIN.length} color={colors[s]||"#999"}/>;
              })}
            </Card>
          </div>
        </div>
      )}

      {/* USERS */}
      {subTab==="users" && (
        <div>
          <div style={{ display:"flex", gap:12, marginBottom:18, alignItems:"center" }}>
            <div style={{ flex:1, position:"relative" }}>
              <Search size={14} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#aaa" }}/>
              <input className="search-input" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, email or ID…" style={{...inputStyle, paddingLeft:36}}/>
            </div>
            <select value={userFilter} onChange={e=>setUserFilter(e.target.value)} style={{...inputStyle, width:"auto", minWidth:140}}>
              <option value="all">All Roles</option>
              {ROLES.map(r=><option key={r} value={r}>{ROLE_META[r].label}</option>)}
              <option value="flagged">Flagged</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <Card style={{ padding:0, overflow:"hidden" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:"#faf8f4" }}>
                  {["ID","Name","Email","Role","Products","Status","Action"].map(h=>(
                    <th key={h} style={{ padding:"11px 16px", textAlign:"left", fontSize:11, fontWeight:700, color:"#aaa", textTransform:"uppercase", letterSpacing:".06em", borderBottom:"1px solid var(--border)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u,i)=>{
                  const [sbg,scol] = statusColor[u.status]||["#f3f4f6","#6b7280"];
                  const meta = ROLE_META[u.role]||{};
                  return (
                    <tr key={u.id} className="admin-row" style={{ borderBottom:i<filteredUsers.length-1?"1px solid #faf6f0":"none" }}>
                      <td style={{ padding:"11px 16px" }}><code style={{ fontSize:11, background:"#f5f0ea", padding:"2px 7px", borderRadius:4 }}>{u.id}</code></td>
                      <td style={{ padding:"11px 16px", fontWeight:600, fontSize:13 }}>{u.name}</td>
                      <td style={{ padding:"11px 16px", fontSize:12, color:"#888" }}>{u.email}</td>
                      <td style={{ padding:"11px 16px" }}><span style={{ background:meta.bg, color:meta.color, borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700 }}>{meta.label}</span></td>
                      <td style={{ padding:"11px 16px", fontSize:13, fontWeight:600 }}>{u.products}</td>
                      <td style={{ padding:"11px 16px" }}><span style={{ background:sbg, color:scol, borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700, textTransform:"capitalize" }}>{u.status}</span></td>
                      <td style={{ padding:"11px 16px" }}>
                        <div style={{ display:"flex", gap:6 }}>
                          {u.status==="active" && <button onClick={()=>showToast(`Flagged ${u.name}`,"info")} style={{ padding:"5px 10px", background:"#fef3c7", color:"#b45309", border:"none", borderRadius:6, fontSize:11, fontWeight:700, cursor:"pointer" }}>Flag</button>}
                          {u.status!=="suspended" && <button onClick={()=>showToast(`${u.name} suspended`,"error")} style={{ padding:"5px 10px", background:"#fee2e2", color:"#dc2626", border:"none", borderRadius:6, fontSize:11, fontWeight:700, cursor:"pointer" }}>Suspend</button>}
                          {u.status==="suspended" && <button onClick={()=>showToast(`${u.name} reinstated`,"success")} style={{ padding:"5px 10px", background:"#d8f3dc", color:"#2d6a4f", border:"none", borderRadius:6, fontSize:11, fontWeight:700, cursor:"pointer" }}>Reinstate</button>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* PRODUCTS */}
      {subTab==="products" && (
        <Card style={{ padding:0, overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#faf8f4" }}>
                {["Product ID","Name","Current Owner","Role","Status","Hash","Flag"].map(h=>(
                  <th key={h} style={{ padding:"11px 16px", textAlign:"left", fontSize:11, fontWeight:700, color:"#aaa", textTransform:"uppercase", letterSpacing:".06em", borderBottom:"1px solid var(--border)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_PRODUCTS_ADMIN.map((p,i)=>{
                const meta = ROLE_META[p.role]||{};
                return (
                  <tr key={p.id} className="admin-row" style={{ borderBottom:i<MOCK_PRODUCTS_ADMIN.length-1?"1px solid #faf6f0":"none", background:p.flagged?"#fffbeb":"transparent" }}>
                    <td style={{ padding:"11px 16px" }}><code style={{ fontSize:11, background:"#f5f0ea", padding:"2px 7px", borderRadius:4 }}>{p.id}</code></td>
                    <td style={{ padding:"11px 16px", fontWeight:600, fontSize:13 }}>{p.name}</td>
                    <td style={{ padding:"11px 16px", fontSize:12, color:"#666" }}>{p.owner}</td>
                    <td style={{ padding:"11px 16px" }}><span style={{ background:meta.bg, color:meta.color, borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700 }}>{meta.label}</span></td>
                    <td style={{ padding:"11px 16px" }}><StatusBadge status={p.status}/></td>
                    <td style={{ padding:"11px 16px" }}><code style={{ fontSize:11, color:"var(--gold)" }}>{p.hash}</code></td>
                    <td style={{ padding:"11px 16px" }}>
                      {p.flagged ? (
                        <span style={{ display:"flex", alignItems:"center", gap:5, background:"#fef3c7", color:"#b45309", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700 }}><AlertCircle size={11}/> Flagged</span>
                      ) : (
                        <button onClick={()=>showToast(`Flagged ${p.id}`,"info")} style={{ padding:"5px 10px", background:"#f5f0ea", color:"#888", border:"none", borderRadius:6, fontSize:11, cursor:"pointer" }}>Flag</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {/* FLAGS */}
      {subTab==="flags" && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <Card style={{ border:"1.5px solid #fca5a5", background:"#fffaf9" }}>
            <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
              <div style={{ background:"#fee2e2", borderRadius:12, padding:10, flexShrink:0 }}><AlertCircle size={18} style={{ color:"#dc2626" }}/></div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:15, color:"var(--dark)" }}>Integrity Alert — PROD-SUGAR-006</div>
                <div style={{ fontSize:13, color:"#666", marginTop:4, lineHeight:1.6 }}>Cryptographic anchor mismatch detected. The hash chain for this product does not link correctly to its predecessor document. This could indicate tampered data. Manual review required before the product can continue in the supply chain.</div>
                <div style={{ display:"flex", gap:8, marginTop:12 }}>
                  <Btn small variant="danger"><Flag size={12}/> Escalate</Btn>
                  <Btn small variant="outline">View Product</Btn>
                  <button onClick={()=>showToast("Alert resolved","success")} style={{ padding:"7px 15px", background:"#d8f3dc", color:"#2d6a4f", border:"none", borderRadius:"var(--radius-sm)", fontSize:13, fontWeight:600, cursor:"pointer" }}>Resolve</button>
                </div>
              </div>
            </div>
          </Card>
          <Card style={{ border:"1.5px solid #fde68a", background:"#fffdf5" }}>
            <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
              <div style={{ background:"#fef3c7", borderRadius:12, padding:10, flexShrink:0 }}><AlertCircle size={18} style={{ color:"#b45309" }}/></div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:15, color:"var(--dark)" }}>Suspicious Activity — BioFoods Co. (MANU00456)</div>
                <div style={{ fontSize:13, color:"#666", marginTop:4, lineHeight:1.6 }}>This manufacturer account has made 12 transfer requests in 30 minutes, triggering rate-limit protection. Account has been automatically flagged for review. Products handled by this account are temporarily frozen pending verification.</div>
                <div style={{ display:"flex", gap:8, marginTop:12 }}>
                  <Btn small variant="danger">Suspend Account</Btn>
                  <Btn small variant="outline">View Activity Log</Btn>
                  <button onClick={()=>showToast("Flag cleared","success")} style={{ padding:"7px 15px", background:"#d8f3dc", color:"#2d6a4f", border:"none", borderRadius:"var(--radius-sm)", fontSize:13, fontWeight:600, cursor:"pointer" }}>Clear Flag</button>
                </div>
              </div>
            </div>
          </Card>
          <Card style={{ border:"1px dashed var(--border)", background:"#fafaf7", textAlign:"center", padding:40 }}>
            <CheckCircle size={28} style={{ color:"#c8e6c9", margin:"0 auto 10px" }}/>
            <p style={{ color:"#aaa", fontSize:14 }}>No other active alerts. System integrity is healthy.</p>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, subtitle, children }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22 }}>
      <div style={{ display:"flex", gap:14, alignItems:"center" }}>
        <div style={{ background:"var(--green-pale)", borderRadius:"var(--radius-md)", padding:10, boxShadow:"0 2px 8px rgba(45,106,79,.12)" }}><Icon size={18} style={{ color:"var(--green)" }}/></div>
        <div>
          <h2 className="serif" style={{ fontSize:23, fontWeight:600, color:"var(--dark)", lineHeight:1.2 }}>{title}</h2>
          <p style={{ fontSize:13, color:"#aaa", marginTop:2 }}>{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function ResultBox({ label, value, color }) {
  if (!value) return null;
  return (
    <div className="result-box" style={{ background:"#fafaf8", border:`1.5px solid ${color}33`, borderRadius:"var(--radius-md)", padding:"13px 16px" }}>
      <div style={{ fontSize:10, color, fontWeight:700, letterSpacing:".07em", textTransform:"uppercase", marginBottom:7 }}>{label}</div>
      <code style={{ fontSize:14, fontWeight:700, color:"var(--dark)", wordBreak:"break-all", letterSpacing:".01em" }}>{value}</code>
    </div>
  );
}

function StepInfoPill({ icon, label, value, color }) {
  if (!value) return null;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:9, background:`${color}0d`, border:`1px solid ${color}22`, borderRadius:10, padding:"7px 12px", minWidth:0 }}>
      <span style={{ width:28, height:28, borderRadius:8, background:`${color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, flexShrink:0 }}>{icon}</span>
      <div style={{ minWidth:0 }}>
        <div style={{ fontSize:10, fontWeight:700, color, letterSpacing:".06em", textTransform:"uppercase", marginBottom:1 }}>{label}</div>
        <div style={{ fontSize:12, fontWeight:500, color:"#333", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{value}</div>
      </div>
    </div>
  );
}

// ─── PUBLIC QR SCAN PAGE (standalone, no auth needed) ─────────────────────────
export function PublicScanPage({ productId: initialId }) {
  const [productId, setProductId] = useState(initialId||"");
  const [loading, setLoading]     = useState(false);
  const [history, setHistory]     = useState(null);
  const [error, setError]         = useState(null);

  useEffect(()=>{ if (initialId) loadHistory(initialId); }, [initialId]);

  const loadHistory = async (id) => {
    setLoading(true); setError(null);
    try {
      const data = await api(`/products/history/${id}`);
      setHistory(data);
    } catch(e) { setError(e.message); }
    setLoading(false);
  };

  const journey = [
    { role:"FARMER",       icon:Leaf,    label:"Farm",         dataKey:"farmer" },
    { role:"MANUFACTURER", icon:Factory, label:"Manufactured", dataKey:"manufacturer" },
    { role:"DISTRIBUTOR",  icon:Truck,   label:"Distributed",  dataKey:"distributor" },
    { role:"RETAILER",     icon:Store,   label:"Retailed",      dataKey:"retailer" },
  ];

  return (
    <div className="qr-public-bg" style={{ padding:"24px 20px", minHeight:"100vh", fontFamily:"'DM Sans', sans-serif" }}>
      <style>{css}</style>

      <div style={{ maxWidth:440, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:8 }}>
            <div style={{ background:"linear-gradient(135deg, #2d6a4f, #40916c)", borderRadius:10, padding:10 }}><Leaf style={{ width:18, height:18, color:"#fff" }}/></div>
            <span className="serif" style={{ fontSize:24, fontWeight:600, color:"#fff" }}>Agro<span style={{ color:"#c9a84c" }}>Trace</span></span>
          </div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,.3)", letterSpacing:".08em" }}>PRODUCT VERIFICATION</div>
        </div>

        {!initialId && (
          <div style={{ marginBottom:20, display:"flex", gap:10 }}>
            <input value={productId} onChange={e=>setProductId(e.target.value)} placeholder="Enter Product ID…" style={{...inputStyle, background:"rgba(255,255,255,.07)", border:"1px solid rgba(255,255,255,.12)", color:"#fff", flex:1 }}/>
            <button onClick={()=>loadHistory(productId)} style={{ background:"linear-gradient(135deg,#2d6a4f,#40916c)", color:"#fff", border:"none", borderRadius:"var(--radius-sm)", padding:"0 18px", cursor:"pointer", fontWeight:600, fontSize:14 }}>Verify</button>
          </div>
        )}

        {loading && <div style={{ textAlign:"center", padding:48, color:"rgba(255,255,255,.4)" }}><span className="spin" style={{ width:28, height:28, border:"2px solid rgba(255,255,255,.2)", borderTopColor:"#fff", borderRadius:"50%", display:"inline-block" }}/></div>}
        {error   && <div style={{ background:"rgba(220,38,38,.15)", border:"1px solid rgba(220,38,38,.3)", borderRadius:"var(--radius-md)", padding:"14px 18px", color:"#f87171", fontSize:13 }}>{error}</div>}

        {history && !loading && (
          <div className="fade-up">
            <div style={{ background:"rgba(255,255,255,.05)", borderRadius:"var(--radius-lg)", padding:20, border:"1px solid rgba(255,255,255,.08)", marginBottom:16 }}>
              <div style={{ fontSize:10, color:"rgba(255,255,255,.35)", letterSpacing:".1em", marginBottom:8 }}>VERIFIED PRODUCT</div>
              <div className="serif" style={{ fontSize:26, color:"#fff", fontWeight:600, marginBottom:8 }}>{history.productName}</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <span style={{ background:"rgba(45,106,79,.35)", color:"#4ade80", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700 }}>{history.category}</span>
                <span style={{ background:"rgba(255,255,255,.08)", color:"rgba(255,255,255,.5)", borderRadius:20, padding:"3px 10px", fontSize:11 }}>{history.quantity} units</span>
                <StatusBadge status={history.status}/>
              </div>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
              {journey.map((s,i)=>{
                const d = history[s.dataKey];
                if (!d||Object.keys(d).length===0) return null;
                const meta = ROLE_META[s.role]||{};
                return (
                  <div key={i} style={{ background:"rgba(255,255,255,.04)", borderRadius:"var(--radius-md)", padding:"14px 16px", border:"1px solid rgba(255,255,255,.07)", display:"flex", gap:12, alignItems:"flex-start" }}>
                    <div style={{ width:34, height:34, borderRadius:10, background:meta.bg+"33", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <s.icon size={15} style={{ color:meta.color }}/>
                    </div>
                    <div>
                      <div style={{ fontSize:10, color:"rgba(255,255,255,.35)", letterSpacing:".07em", marginBottom:4 }}>{s.label.toUpperCase()}</div>
                      <div style={{ fontSize:13, color:"#fff", fontWeight:600 }}>
                        {s.dataKey==="farmer" && d.farmLocation}
                        {s.dataKey==="manufacturer" && d.factoryLocation}
                        {s.dataKey==="distributor" && d.warehouseLocation}
                        {s.dataKey==="retailer" && d.storeLocation}
                      </div>
                    </div>
                    <span style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:4, fontSize:11, color:meta.color||"#4ade80", fontWeight:700, flexShrink:0 }}><CheckCircle size={12}/> Done</span>
                  </div>
                );
              })}
            </div>

            {history.blockchainTx && (
              <div style={{ background:"rgba(201,168,76,.08)", borderRadius:"var(--radius-md)", padding:"12px 16px", border:"1px solid rgba(201,168,76,.2)" }}>
                <div style={{ fontSize:10, color:"#c9a84c", fontWeight:700, letterSpacing:".07em", marginBottom:5 }}>BLOCKCHAIN ANCHOR</div>
                <code style={{ fontSize:11, color:"rgba(201,168,76,.8)", wordBreak:"break-all" }}>{history.blockchainTx}</code>
              </div>
            )}

            <div style={{ textAlign:"center", marginTop:24, fontSize:11, color:"rgba(255,255,255,.18)" }}>Farm to shelf · Cryptographically verified · AgroTrace</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function AgroTraceApp() {
  const [token, setToken] = useState(null);
  const [user, setUser]   = useState(null);

  // Check for ?scan=PRODUCTID in URL to show public QR page
  const urlParams = typeof window!=="undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const scanId = urlParams.get("scan");
  if (scanId) return <PublicScanPage productId={scanId}/>;

  useEffect(()=>{
    const savedToken = localStorage.getItem("agt_token");
    const savedUser  = localStorage.getItem("agt_user");
    if (savedToken) setToken(savedToken);
    if (savedUser) { try { setUser(JSON.parse(savedUser)); } catch { setUser(null); } }
  }, []);

  const handleLogin = (tok, usr) => {
    localStorage.setItem("agt_token", tok);
    localStorage.setItem("agt_user", JSON.stringify(usr));
    setToken(tok); setUser(usr);
  };

  const handleLogout = () => {
    localStorage.removeItem("agt_token");
    localStorage.removeItem("agt_user");
    setToken(null); setUser(null);
  };

  if (!token) return <AuthScreen onLogin={handleLogin}/>;
  return <Dashboard token={token} user={user} onLogout={handleLogout}/>;
}