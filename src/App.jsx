import { useState, useEffect, useRef, useCallback } from "react";

const ADMIN_EMAIL = "admin@college.edu";
const ADMIN_PASSWORD = "Admin@2024";
const COLLEGE_DOMAIN = "@college.edu";

const initialClubs = [
  { id: 1, name: "Tech Society", color: "#3B82F6" },
  { id: 2, name: "Cultural Club", color: "#8B5CF6" },
  { id: 3, name: "Sports Council", color: "#10B981" },
  { id: 4, name: "Drama Club", color: "#F59E0B" },
  { id: 5, name: "Music Society", color: "#EC4899" },
];

const today = new Date();
const fmt = (d) => d.toISOString().split("T")[0];
const addDays = (n) => { const d = new Date(today); d.setDate(d.getDate() + n); return fmt(d); };

const initialEvents = [
  { id: 1, title: "HackFest 2024", clubId: 1, clubName: "Tech Society", date: addDays(5), time: "09:00", venue: "Main Auditorium", description: "24-hour coding marathon. Build innovative solutions to real-world problems. Teams of 2-4. Prizes worth ₹50,000.", category: "Hackathon", totalSeats: 120, registrations: 87, image: "💻" },
  { id: 2, title: "Cultural Fest", clubId: 2, clubName: "Cultural Club", date: addDays(10), time: "14:00", venue: "Open Air Theatre", description: "Annual cultural extravaganza featuring dance, music, art, and fashion. A celebration of diversity and creativity.", category: "Cultural", totalSeats: 300, registrations: 245, image: "🎭" },
  { id: 3, title: "Inter-College Cricket", clubId: 3, clubName: "Sports Council", date: addDays(3), time: "08:00", venue: "Cricket Ground", description: "Annual inter-college cricket tournament. 8 colleges competing for the championship trophy.", category: "Sports", totalSeats: 200, registrations: 156, image: "🏏" },
  { id: 4, title: "Shakespeare Night", clubId: 4, clubName: "Drama Club", date: addDays(15), time: "18:00", venue: "Black Box Theatre", description: "A special evening presenting three acts from Shakespeare's greatest plays performed by our award-winning drama troupe.", category: "Arts", totalSeats: 80, registrations: 80, image: "🎬" },
  { id: 5, title: "Acoustic Evening", clubId: 5, clubName: "Music Society", date: addDays(7), time: "17:00", venue: "Garden Amphitheater", description: "An intimate acoustic concert featuring student musicians across genres. Open mic slots available.", category: "Music", totalSeats: 150, registrations: 43, image: "🎵" },
  { id: 6, title: "AI/ML Workshop", clubId: 1, clubName: "Tech Society", date: addDays(20), time: "10:00", venue: "Computer Lab 3", description: "Hands-on workshop on Machine Learning fundamentals using Python, scikit-learn and TensorFlow. Bring your laptops.", category: "Workshop", totalSeats: 60, registrations: 58, image: "🤖" },
  { id: 7, title: "Photography Contest", clubId: 2, clubName: "Cultural Club", date: addDays(12), time: "09:00", venue: "Art Gallery", description: "Capture the essence of campus life. Submit your best shots. Top 20 exhibited in the gallery.", category: "Arts", totalSeats: 100, registrations: 34, image: "📸" },
  { id: 8, title: "Basketball Tournament", clubId: 3, clubName: "Sports Council", date: addDays(8), time: "11:00", venue: "Indoor Stadium", description: "3-on-3 basketball tournament. Register your team of 3. Round-robin format followed by knockouts.", category: "Sports", totalSeats: 90, registrations: 72, image: "🏀" },
];

const CATEGORIES = ["All", "Hackathon", "Cultural", "Sports", "Arts", "Music", "Workshop"];
const CAT_COLORS = { Hackathon: "#3B82F6", Cultural: "#8B5CF6", Sports: "#10B981", Arts: "#F59E0B", Music: "#EC4899", Workshop: "#06B6D4" };

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}
function formatTime(t) {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}
function seatsLeft(ev) { return ev.totalSeats - ev.registrations; }
function seatsPercent(ev) { return Math.round((ev.registrations / ev.totalSeats) * 100); }

// ── State management (no localStorage in artifacts) ──────────────────────────
let _users = []; // in-memory user store

// ── Toast ────────────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);
  const remove = useCallback((id) => setToasts(p => p.filter(t => t.id !== id)), []);
  return { toasts, addToast: add, removeToast: remove };
}

function Toast({ toasts, removeToast }) {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none" }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          display: "flex", alignItems: "center", gap: 10, padding: "12px 18px",
          background: t.type === "success" ? "#ECFDF5" : t.type === "error" ? "#FEF2F2" : "#EFF6FF",
          border: `1px solid ${t.type === "success" ? "#6EE7B7" : t.type === "error" ? "#FECACA" : "#BFDBFE"}`,
          borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
          color: t.type === "success" ? "#065F46" : t.type === "error" ? "#991B1B" : "#1E40AF",
          fontSize: 14, fontWeight: 500, maxWidth: 320, pointerEvents: "all",
          animation: "slideIn 0.3s ease"
        }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>{t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}</span>
          <span style={{ flex: 1 }}>{t.message}</span>
          <button onClick={() => removeToast(t.id)} style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.5, fontSize: 18, padding: 0, lineHeight: 1 }}>×</button>
        </div>
      ))}
    </div>
  );
}

// ── Modal ────────────────────────────────────────────────────────────────────
function Modal({ open, onClose, children, width = 440 }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(15,23,42,0.4)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
      backdropFilter: "blur(4px)", animation: "fadeIn 0.15s ease"
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 20, boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
        width: "100%", maxWidth: width, maxHeight: "90vh", overflowY: "auto",
        animation: "slideUp 0.25s cubic-bezier(0.34,1.56,0.64,1)"
      }}>
        {children}
      </div>
    </div>
  );
}

// ── Input ────────────────────────────────────────────────────────────────────
function Field({ label, error, type = "text", ...props }) {
  const [show, setShow] = useState(false);
  const isPass = type === "password";
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</label>}
      <div style={{ position: "relative" }}>
        <input
          type={isPass && show ? "text" : type}
          {...props}
          style={{
            width: "100%", padding: "10px 14px", paddingRight: isPass ? 42 : 14,
            border: `1.5px solid ${error ? "#F87171" : "#E5E7EB"}`,
            borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box",
            background: "#F9FAFB", fontFamily: "'DM Sans', sans-serif", color: "#111827",
            transition: "border-color 0.2s, box-shadow 0.2s", ...props.style
          }}
          onFocus={e => { e.target.style.borderColor = "#6366F1"; e.target.style.boxShadow = "0 0 0 3px #6366F120"; }}
          onBlur={e => { e.target.style.borderColor = error ? "#F87171" : "#E5E7EB"; e.target.style.boxShadow = "none"; }}
        />
        {isPass && (
          <button type="button" onClick={() => setShow(!show)} style={{
            position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", fontSize: 15, padding: 0, lineHeight: 1
          }}>{show ? "🙈" : "👁"}</button>
        )}
      </div>
      {error && <p style={{ color: "#EF4444", fontSize: 11, marginTop: 4, marginBottom: 0 }}>{error}</p>}
    </div>
  );
}

function FieldSelect({ label, error, children, ...props }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</label>}
      <select {...props} style={{
        width: "100%", padding: "10px 14px", border: `1.5px solid ${error ? "#F87171" : "#E5E7EB"}`,
        borderRadius: 10, fontSize: 14, background: "#F9FAFB", fontFamily: "'DM Sans', sans-serif",
        color: "#111827", cursor: "pointer", outline: "none", ...props.style
      }}>{children}</select>
      {error && <p style={{ color: "#EF4444", fontSize: 11, marginTop: 4 }}>{error}</p>}
    </div>
  );
}

function Btn({ children, variant = "primary", size = "md", loading, disabled, onClick, style: extraStyle }) {
  const base = { primary: { background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "#fff", border: "none", boxShadow: "0 2px 10px #6366F140" }, secondary: { background: "#F3F4F6", color: "#374151", border: "1px solid #E5E7EB", boxShadow: "none" }, ghost: { background: "transparent", color: "#6366F1", border: "1.5px solid #6366F1", boxShadow: "none" }, danger: { background: "#FEE2E2", color: "#DC2626", border: "1px solid #FECACA", boxShadow: "none" } };
  const sz = { sm: { padding: "6px 14px", fontSize: 13 }, md: { padding: "10px 20px", fontSize: 14 }, lg: { padding: "12px 24px", fontSize: 15 } };
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        ...base[variant], ...sz[size],
        borderRadius: 10, cursor: disabled ? "not-allowed" : "pointer", fontWeight: 700,
        fontFamily: "'DM Sans', sans-serif", opacity: disabled ? 0.55 : 1,
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
        transition: "all 0.2s", ...extraStyle
      }}
      onMouseEnter={e => { if (!disabled && !loading) e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; }}
    >
      {loading && <span style={{ width: 13, height: 13, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.6s linear infinite" }} />}
      {children}
    </button>
  );
}

// ── Auth Modals ───────────────────────────────────────────────────────────────
function LoginModal({ open, onClose, onLogin, onSwitchSignup, addToast }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const e = {};
    if (!form.email) e.email = "Email required";
    if (!form.password) e.password = "Password required";
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    if (form.email === ADMIN_EMAIL && form.password === ADMIN_PASSWORD) {
      onLogin({ id: 0, email: form.email, name: "Admin", role: "admin" });
      addToast("Welcome back, Admin! 👋", "success");
      onClose(); setForm({ email: "", password: "" }); setErrors({});
    } else {
    try {
  const res = await fetch("http://127.0.0.1:8000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: form.email,
      password: form.password
    })
  });

  if (!res.ok) {
    setErrors({ password: "Invalid email or password" });
    setLoading(false);
    return;
  }

  const user = await res.json();

  onLogin({
  id: user.id || Date.now(),
  name: user.name || user.email.split("@")[0],
  email: user.email,
  branch: user.branch || "",
  semester: user.semester || "",
  role: "student"
});

  addToast(`Welcome back, ${user.name}! 🎉`, "success");
  onClose();
  setForm({ email: "", password: "" });
  setErrors({});

} catch (err) {
  setErrors({ password: "Server error" });
}
    }
    setLoading(false);
  };

  return (
    <Modal open={open} onClose={onClose} width={400}>
      <div style={{ padding: "32px 28px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ width: 52, height: 52, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 12px" }}>🏛️</div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#111827", fontFamily: "'Playfair Display', Georgia, serif" }}>Welcome Back</h2>
          <p style={{ margin: "4px 0 0", color: "#6B7280", fontSize: 13 }}>Sign in to your college account</p>
        </div>
        <Field label="College Email" type="email" placeholder="you@college.edu" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} error={errors.email} />
        <Field label="Password" type="password" placeholder="Your password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} error={errors.password}
          onKeyDown={e => e.key === "Enter" && submit()} />
        <Btn style={{ width: "100%", marginTop: 8 }} size="lg" onClick={submit} loading={loading}>Sign In</Btn>
        <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "#6B7280" }}>
          New here? <span onClick={() => { onClose(); onSwitchSignup(); }} style={{ color: "#6366F1", cursor: "pointer", fontWeight: 700 }}>Create account →</span>
        </p>
        <div style={{ marginTop: 16, background: "#F9FAFB", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#6B7280", textAlign: "center" }}>
          Admin demo: <strong>admin@college.edu</strong> / <strong>Admin@2024</strong>
        </div>
      </div>
    </Modal>
  );
}

function SignupModal({ open, onClose, onLogin, onSwitchLogin, addToast }) {
  const [form, setForm] = useState({ name: "", branch: "", semester: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const branches = ["Computer Science", "Information Technology", "Electronics", "Mechanical", "Civil", "Biotechnology"];
  const semesters = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];

  const submit = async () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name required";
    if (!form.branch) e.branch = "Select your branch";
    if (!form.semester) e.semester = "Select semester";
    if (!form.email) e.email = "Email required";
    else if (!form.email.endsWith(COLLEGE_DOMAIN)) e.email = `Must end with ${COLLEGE_DOMAIN}`;
    if (!form.password) e.password = "Password required";
    else if (form.password.length < 8) e.password = "Min 8 characters";
    else if (!/[A-Z]/.test(form.password)) e.password = "Need at least one uppercase";
    else if (!/[0-9]/.test(form.password)) e.password = "Need at least one number";
    if (!form.confirm) e.confirm = "Confirm your password";
    else if (form.password !== form.confirm) e.confirm = "Passwords don't match";
    if (Object.keys(e).length) { setErrors(e); return; }
    if (_users.find(u => u.email === form.email)) { setErrors({ email: "Email already registered" }); return; }
    setLoading(true);
    try {
  const res = await fetch("http://127.0.0.1:8000/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: form.name,
      branch: form.branch,
      semester: form.semester,
      email: form.email,
      password: form.password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    addToast("Signup failed", "error");
    setLoading(false);
    return;
  }

  onLogin({
  name: form.name,
  email: form.email,
  branch: form.branch,
  semester: form.semester,
  role: "student",
});

  addToast(`Welcome, ${form.name}! Account created 🎉`, "success");

} catch (err) {
  console.error(err);
  addToast("Server error", "error");
}
    addToast(`Welcome, ${form.name}! Account created 🎉`, "success");
    onClose(); setForm({ name: "", branch: "", semester: "", email: "", password: "", confirm: "" }); setErrors({});
    setLoading(false);
  };

  return (
    <Modal open={open} onClose={onClose} width={460}>
      <div style={{ padding: "32px 28px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ width: 52, height: 52, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 12px" }}>✨</div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#111827", fontFamily: "'Playfair Display', Georgia, serif" }}>Join EduEvents</h2>
          <p style={{ margin: "4px 0 0", color: "#6B7280", fontSize: 13 }}>Create your student account</p>
        </div>
        <Field label="Full Name" placeholder="Jane Doe" value={form.name} onChange={e => f("name", e.target.value)} error={errors.name} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <FieldSelect label="Branch" value={form.branch} onChange={e => f("branch", e.target.value)} error={errors.branch}>
            <option value="">Select branch</option>
            {branches.map(b => <option key={b} value={b}>{b}</option>)}
          </FieldSelect>
          <FieldSelect label="Semester" value={form.semester} onChange={e => f("semester", e.target.value)} error={errors.semester}>
            <option value="">Semester</option>
            {semesters.map(s => <option key={s} value={s}>{s} Sem</option>)}
          </FieldSelect>
        </div>
        <Field label="College Email" type="email" placeholder={`you${COLLEGE_DOMAIN}`} value={form.email} onChange={e => f("email", e.target.value)} error={errors.email} />
        <Field label="Password" type="password" placeholder="Min 8 chars, 1 uppercase, 1 number" value={form.password} onChange={e => f("password", e.target.value)} error={errors.password} />
        <Field label="Confirm Password" type="password" placeholder="Re-enter password" value={form.confirm} onChange={e => f("confirm", e.target.value)} error={errors.confirm} />
        <Btn style={{ width: "100%", marginTop: 6 }} size="lg" onClick={submit} loading={loading}>Create Account</Btn>
        <p style={{ textAlign: "center", marginTop: 14, fontSize: 13, color: "#6B7280" }}>
          Have an account? <span onClick={() => { onClose(); onSwitchLogin(); }} style={{ color: "#6366F1", cursor: "pointer", fontWeight: 700 }}>Sign in →</span>
        </p>
      </div>
    </Modal>
  );
}

// ── Create Event Modal ────────────────────────────────────────────────────────
function CreateEventModal({ open, onClose, onCreate, addToast }) {
  const empty = { title: "", clubId: "", date: "", time: "", venue: "", description: "", category: "", totalSeats: "" };
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = async () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title required";
    if (!form.clubId) e.clubId = "Select a club";
    if (!form.date) e.date = "Date required";
    else if (form.date < fmt(today)) e.date = "Cannot be in the past";
    if (!form.time) e.time = "Time required";
    if (!form.venue.trim()) e.venue = "Venue required";
    if (!form.description.trim()) e.description = "Description required";
    if (!form.category) e.category = "Select category";
    if (!form.totalSeats) e.totalSeats = "Seats required";
    else if (parseInt(form.totalSeats) < 1) e.totalSeats = "Must be ≥ 1";
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const club = initialClubs.find(c => c.id === parseInt(form.clubId));
    const emojis = ["🎯", "🎪", "🎨", "🎤", "🏆", "🔬", "🌟", "🎭"];
    onCreate({ id: Date.now(), title: form.title, clubId: parseInt(form.clubId), clubName: club.name, date: form.date, time: form.time, venue: form.venue, description: form.description, category: form.category, totalSeats: parseInt(form.totalSeats), registrations: 0, image: emojis[Math.floor(Math.random() * emojis.length)] });
    addToast("Event created successfully! 🎉", "success");
    setForm(empty); setErrors({}); onClose();
    setLoading(false);
  };

  return (
    <Modal open={open} onClose={onClose} width={500}>
      <div style={{ padding: "28px 28px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#111827", fontFamily: "'Playfair Display', Georgia, serif" }}>Create New Event</h2>
            <p style={{ margin: "4px 0 0", color: "#6B7280", fontSize: 13 }}>Fill in the details below</p>
          </div>
          <button onClick={onClose} style={{ background: "#F3F4F6", border: "none", borderRadius: 8, width: 30, height: 30, cursor: "pointer", fontSize: 16, color: "#6B7280", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>
        <Field label="Event Title" placeholder="e.g., Annual Tech Fest 2024" value={form.title} onChange={e => f("title", e.target.value)} error={errors.title} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <FieldSelect label="Organizing Club" value={form.clubId} onChange={e => f("clubId", e.target.value)} error={errors.clubId}>
            <option value="">Select club</option>
            {initialClubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </FieldSelect>
          <FieldSelect label="Category" value={form.category} onChange={e => f("category", e.target.value)} error={errors.category}>
            <option value="">Category</option>
            {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
          </FieldSelect>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="Date" type="date" value={form.date} onChange={e => f("date", e.target.value)} error={errors.date} min={fmt(today)} />
          <Field label="Time" type="time" value={form.time} onChange={e => f("time", e.target.value)} error={errors.time} />
        </div>
        <Field label="Venue" placeholder="e.g., Main Auditorium" value={form.venue} onChange={e => f("venue", e.target.value)} error={errors.venue} />
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.4 }}>Description</label>
          <textarea value={form.description} onChange={e => f("description", e.target.value)} placeholder="Describe the event..." rows={3} style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${errors.description ? "#F87171" : "#E5E7EB"}`, borderRadius: 10, fontSize: 14, fontFamily: "'DM Sans', sans-serif", resize: "vertical", background: "#F9FAFB", boxSizing: "border-box", outline: "none" }} />
          {errors.description && <p style={{ color: "#EF4444", fontSize: 11, marginTop: 4 }}>{errors.description}</p>}
        </div>
        <Field label="Total Seats" type="number" placeholder="e.g., 100" value={form.totalSeats} onChange={e => f("totalSeats", e.target.value)} error={errors.totalSeats} min="1" />
        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="secondary" size="lg" onClick={onClose} style={{ flex: 1 }}>Cancel</Btn>
          <Btn size="lg" onClick={submit} loading={loading} style={{ flex: 2 }}>Create Event</Btn>
        </div>
      </div>
    </Modal>
  );
}

// ── Event Card ────────────────────────────────────────────────────────────────
function EventCard({ event, onClick, isRegistered }) {
  const left = seatsLeft(event);
  const pct = seatsPercent(event);
  const isFull = left <= 0;
  const c = CAT_COLORS[event.category] || "#6366F1";
  return (
    <div onClick={onClick} style={{
      background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      border: "1.5px solid #F3F4F6", cursor: "pointer", overflow: "hidden",
      transition: "all 0.22s ease", position: "relative"
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(99,102,241,0.18)"; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = "#C7D2FE"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "#F3F4F6"; }}
    >
      {isRegistered && <div style={{ position: "absolute", top: 10, right: 10, background: "#ECFDF5", color: "#065F46", borderRadius: 20, padding: "3px 9px", fontSize: 11, fontWeight: 700, border: "1px solid #6EE7B7", zIndex: 1 }}>✓ Registered</div>}
      <div style={{ padding: "18px 18px 14px", borderBottom: "1px solid #F9FAFB" }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
          <div style={{ width: 50, height: 50, borderRadius: 13, background: `${c}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{event.image}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ margin: "0 0 3px", fontSize: 15, fontWeight: 700, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{event.title}</h3>
            <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>by {event.clubName}</p>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          <span style={{ background: `${c}18`, color: c, borderRadius: 20, padding: "2px 9px", fontSize: 11, fontWeight: 700 }}>{event.category}</span>
          <span style={{ fontSize: 11, color: "#9CA3AF", display: "flex", alignItems: "center", gap: 3 }}>📅 {formatDate(event.date)}</span>
          <span style={{ fontSize: 11, color: "#9CA3AF", display: "flex", alignItems: "center", gap: 3 }}>📍 {event.venue}</span>
        </div>
      </div>
      <div style={{ padding: "12px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: isFull ? "#EF4444" : left < 20 ? "#D97706" : "#059669" }}>
            {isFull ? "● Fully Booked" : `● ${left} seats left`}
          </span>
          <span style={{ fontSize: 11, color: "#9CA3AF" }}>{event.registrations}/{event.totalSeats}</span>
        </div>
        <div style={{ height: 5, background: "#F3F4F6", borderRadius: 99 }}>
          <div style={{ height: "100%", width: `${pct}%`, background: pct >= 100 ? "#EF4444" : pct > 75 ? "#F59E0B" : "#10B981", borderRadius: 99 }} />
        </div>
      </div>
    </div>
  );
}

// ── Event Details ─────────────────────────────────────────────────────────────
function EventDetails({ event, user, registrations, onRegister, onBack, addToast }) {
  const isRegistered = registrations.includes(event.id);
  const isFull = seatsLeft(event) <= 0;
  const [loading, setLoading] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);
  const pct = seatsPercent(event);
  const c = CAT_COLORS[event.category] || "#6366F1";

  const handleRegister = async () => {
    if (!user) { addToast("Please login to register", "error"); return; }
    if (user.role === "admin") { addToast("Admins cannot register for events", "error"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    onRegister(event.id);
    setJustRegistered(true);
    addToast(`Registered for ${event.title}! 🎉`, "success");
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px 48px" }}>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", color: "#6366F1", cursor: "pointer", fontSize: 14, fontWeight: 700, padding: "18px 0", fontFamily: "'DM Sans', sans-serif" }}>← Back to Events</button>
      <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 4px 28px rgba(0,0,0,0.08)", border: "1.5px solid #F3F4F6", overflow: "hidden" }}>
        <div style={{ padding: "28px 28px 20px", borderBottom: "1px solid #F3F4F6", background: `linear-gradient(135deg, ${c}08 0%, #fff 70%)` }}>
          <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
            <div style={{ width: 76, height: 76, borderRadius: 20, background: `${c}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, flexShrink: 0 }}>{event.image}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                <span style={{ background: `${c}18`, color: c, borderRadius: 20, padding: "3px 11px", fontSize: 12, fontWeight: 700 }}>{event.category}</span>
                {(isRegistered || justRegistered) && <span style={{ background: "#ECFDF5", color: "#065F46", borderRadius: 20, padding: "3px 11px", fontSize: 12, fontWeight: 700, border: "1px solid #6EE7B7" }}>✓ Registered</span>}
              </div>
              <h1 style={{ margin: "0 0 4px", fontSize: 26, fontWeight: 800, color: "#111827", fontFamily: "'Playfair Display', Georgia, serif", lineHeight: 1.2 }}>{event.title}</h1>
              <p style={{ margin: 0, color: "#6B7280", fontSize: 14 }}>Organized by <strong style={{ color: "#374151" }}>{event.clubName}</strong></p>
            </div>
          </div>
        </div>
        <div style={{ padding: "22px 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, marginBottom: 24 }}>
            {[{ icon: "📅", label: "Date", val: formatDate(event.date) }, { icon: "⏰", label: "Time", val: formatTime(event.time) }, { icon: "📍", label: "Venue", val: event.venue }].map(item => (
              <div key={item.label} style={{ background: "#F9FAFB", borderRadius: 12, padding: "12px 14px", display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <div>
                  <p style={{ margin: 0, fontSize: 10, color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{item.label}</p>
                  <p style={{ margin: 0, fontSize: 13, color: "#111827", fontWeight: 600 }}>{item.val}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 22 }}>
            <h3 style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 700, color: "#111827" }}>About This Event</h3>
            <p style={{ margin: 0, color: "#4B5563", lineHeight: 1.7, fontSize: 14 }}>{event.description}</p>
          </div>
          <div style={{ background: "#F9FAFB", borderRadius: 14, padding: "18px 20px", marginBottom: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827" }}>Seat Availability</h3>
              <span style={{ fontSize: 22, fontWeight: 800, color: isFull ? "#EF4444" : seatsLeft(event) < 20 ? "#D97706" : "#059669" }}>
                {isFull ? "FULL" : seatsLeft(event)}<span style={{ fontSize: 12, fontWeight: 500, color: "#9CA3AF" }}>{!isFull ? " left" : ""}</span>
              </span>
            </div>
            <div style={{ height: 9, background: "#E5E7EB", borderRadius: 99, marginBottom: 8 }}>
              <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: pct >= 100 ? "#EF4444" : pct > 75 ? "#F59E0B" : "#10B981", borderRadius: 99, transition: "width 0.8s ease" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6B7280" }}>
              <span>{event.registrations} registered</span>
              <span>{event.totalSeats} total</span>
            </div>
          </div>
          {user && user.role === "student" && (
            (isRegistered || justRegistered) ? (
              <div style={{ background: "#ECFDF5", border: "1px solid #6EE7B7", borderRadius: 14, padding: "16px 18px", display: "flex", gap: 14, alignItems: "center" }}>
                <span style={{ fontSize: 28 }}>🎟️</span>
                <div><p style={{ margin: 0, fontWeight: 700, color: "#065F46" }}>You're all set!</p><p style={{ margin: 0, fontSize: 13, color: "#047857" }}>Registration confirmed. See you there!</p></div>
              </div>
            ) : (
              <Btn size="lg" onClick={handleRegister} loading={loading} disabled={loading || isFull} style={{ width: "100%" }}>
                {isFull ? "Event is Full" : "Register Now →"}
              </Btn>
            )
          )}
          {!user && <div style={{ textAlign: "center", padding: "14px", background: "#EEF2FF", borderRadius: 12 }}><p style={{ margin: 0, color: "#4338CA", fontSize: 14 }}>Please <strong>login</strong> to register for this event</p></div>}
          {user?.role === "admin" && <div style={{ background: "#F9FAFB", borderRadius: 12, padding: "14px", textAlign: "center" }}><p style={{ margin: 0, color: "#6B7280", fontSize: 13 }}>Admin view — registration not available</p></div>}
        </div>
      </div>
    </div>
  );
}

// ── Calendar Modal ────────────────────────────────────────────────────────────
function CalendarModal({ open, onClose, events, onSelectEvent }) {
  const [cur, setCur] = useState(new Date());
  const y = cur.getFullYear(), m = cur.getMonth();
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const firstDay = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const eventMap = {};
  events.forEach(ev => { if (!eventMap[ev.date]) eventMap[ev.date] = []; eventMap[ev.date].push(ev); });
  const todayStr = fmt(today);
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const monthStr = `${y}-${String(m + 1).padStart(2, "0")}`;
  const monthEvents = events.filter(ev => ev.date.startsWith(monthStr)).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <Modal open={open} onClose={onClose} width={480}>
      <div style={{ padding: "24px 24px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <button onClick={() => setCur(new Date(y, m - 1, 1))} style={{ background: "#F3F4F6", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>‹</button>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#111827", fontFamily: "'Playfair Display', Georgia, serif" }}>{months[m]} {y}</h2>
          <button onClick={() => setCur(new Date(y, m + 1, 1))} style={{ background: "#F3F4F6", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>›</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 2 }}>
          {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: "#9CA3AF", padding: "5px 0" }}>{d}</div>)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
          {cells.map((day, i) => {
            if (!day) return <div key={i} />;
            const ds = `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dayEvts = eventMap[ds] || [];
            const isToday = ds === todayStr;
            const hasEvt = dayEvts.length > 0;
            return (
              <div key={i} onClick={() => { if (hasEvt) { onSelectEvent(dayEvts[0]); onClose(); } }} style={{
                padding: "7px 3px", borderRadius: 9, textAlign: "center", cursor: hasEvt ? "pointer" : "default",
                background: isToday ? "linear-gradient(135deg,#6366F1,#8B5CF6)" : hasEvt ? "#EEF2FF" : "transparent",
                color: isToday ? "#fff" : "#374151", position: "relative", transition: "all 0.15s"
              }}
                onMouseEnter={e => { if (hasEvt && !isToday) e.currentTarget.style.background = "#E0E7FF"; }}
                onMouseLeave={e => { if (hasEvt && !isToday) e.currentTarget.style.background = "#EEF2FF"; }}
              >
                <span style={{ fontSize: 13, fontWeight: isToday ? 700 : hasEvt ? 700 : 400 }}>{day}</span>
                {hasEvt && !isToday && <div style={{ display: "flex", justifyContent: "center", gap: 2, marginTop: 2 }}>{dayEvts.slice(0, 3).map((_, j) => <div key={j} style={{ width: 3, height: 3, borderRadius: "50%", background: "#6366F1" }} />)}</div>}
              </div>
            );
          })}
        </div>
        {monthEvents.length > 0 && (
          <div style={{ marginTop: 18, borderTop: "1px solid #F3F4F6", paddingTop: 14 }}>
            <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5 }}>Events this month</p>
            {monthEvents.map(ev => (
              <div key={ev.id} onClick={() => { onSelectEvent(ev); onClose(); }} style={{ display: "flex", gap: 10, alignItems: "center", padding: "7px 8px", borderRadius: 10, cursor: "pointer", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#F9FAFB"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <span style={{ fontSize: 18 }}>{ev.image}</span>
                <div><p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111827" }}>{ev.title}</p><p style={{ margin: 0, fontSize: 11, color: "#6B7280" }}>{formatDate(ev.date)}</p></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

// ── Profile Page ──────────────────────────────────────────────────────────────
function ProfilePage({ user, events, registrations, onBack }) {
  const myEvents = events.filter(e => registrations.includes(e.id));
  return (
    <div style={{ maxWidth: 660, margin: "0 auto", padding: "0 16px 48px" }}>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", color: "#6366F1", cursor: "pointer", fontSize: 14, fontWeight: 700, padding: "18px 0", fontFamily: "'DM Sans', sans-serif" }}>← Back</button>
      <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 4px 28px rgba(0,0,0,0.08)", border: "1.5px solid #F3F4F6", overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "28px", background: "linear-gradient(135deg,#EEF2FF,#F5F3FF)", borderBottom: "1px solid #E0E7FF", display: "flex", gap: 18, alignItems: "center" }}>
          <div style={{ width: 68, height: 68, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 26, fontWeight: 800, flexShrink: 0 }}>{user.name.charAt(0).toUpperCase()}</div>
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: "#111827", fontFamily: "'Playfair Display', Georgia, serif" }}>{user.name}</h2>
            {user.role === "admin" ? <span style={{ background: "#EEF2FF", color: "#4338CA", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700 }}>● Admin</span> : <p style={{ margin: 0, color: "#6B7280", fontSize: 13 }}>{user.branch} · {user.semester} Semester</p>}
          </div>
        </div>
        <div style={{ padding: "20px 28px" }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: "#111827" }}>Account Details</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
            {[
              { label: "Email", val: user.email, icon: "✉️" },
              ...(user.role !== "admin" ? [{ label: "Branch", val: user.branch, icon: "🎓" }, { label: "Semester", val: `${user.semester} Sem`, icon: "📚" }, { label: "Events", val: myEvents.length + " registered", icon: "🎟️" }] : [{ label: "Role", val: "System Administrator", icon: "🔑" }])
            ].map(item => (
              <div key={item.label} style={{ background: "#F9FAFB", borderRadius: 11, padding: "11px 14px" }}>
                <p style={{ margin: 0, fontSize: 10, color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>{item.icon} {item.label}</p>
                <p style={{ margin: 0, fontSize: 13, color: "#111827", fontWeight: 600 }}>{item.val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {user.role === "student" && (
        <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 4px 28px rgba(0,0,0,0.08)", border: "1.5px solid #F3F4F6", padding: "20px 28px" }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: "#111827" }}>My Registered Events</h3>
          {myEvents.length === 0 ? (
            <div style={{ textAlign: "center", padding: "36px 20px" }}>
              <div style={{ fontSize: 44, marginBottom: 10 }}>🎟️</div>
              <p style={{ margin: 0, color: "#9CA3AF", fontSize: 14 }}>No events registered yet</p>
              <p style={{ margin: "4px 0 0", color: "#D1D5DB", fontSize: 12 }}>Explore events and register to see them here</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {myEvents.map(ev => (
                <div key={ev.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 14px", background: "#F9FAFB", borderRadius: 12, border: "1px solid #F3F4F6" }}>
                  <span style={{ fontSize: 24 }}>{ev.image}</span>
                  <div style={{ flex: 1 }}><p style={{ margin: 0, fontWeight: 700, color: "#111827", fontSize: 13 }}>{ev.title}</p><p style={{ margin: 0, color: "#6B7280", fontSize: 11 }}>{ev.clubName} · {formatDate(ev.date)}</p></div>
                  <span style={{ background: "#ECFDF5", color: "#065F46", borderRadius: 20, padding: "2px 9px", fontSize: 11, fontWeight: 700 }}>✓</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Admin Dashboard ───────────────────────────────────────────────────────────
function AdminDashboard({ events, onBack }) {
  const totalRegs = events.reduce((s, e) => s + e.registrations, 0);
  const fullCount = events.filter(e => seatsLeft(e) <= 0).length;
  const upcoming = events.filter(e => e.date >= fmt(today)).length;
  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 16px 48px" }}>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", color: "#6366F1", cursor: "pointer", fontSize: 14, fontWeight: 700, padding: "18px 0", fontFamily: "'DM Sans', sans-serif" }}>← Back</button>
      <h2 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 800, color: "#111827", fontFamily: "'Playfair Display', Georgia, serif" }}>Admin Dashboard</h2>
      <p style={{ margin: "0 0 20px", color: "#6B7280", fontSize: 13 }}>Overview of all events and registrations</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total Events", val: events.length, icon: "📅", c: "#6366F1", bg: "#EEF2FF" },
          { label: "Upcoming", val: upcoming, icon: "🔜", c: "#059669", bg: "#ECFDF5" },
          { label: "Registrations", val: totalRegs, icon: "🎟️", c: "#D97706", bg: "#FFFBEB" },
          { label: "Fully Booked", val: fullCount, icon: "🔴", c: "#DC2626", bg: "#FEF2F2" },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 14, padding: "18px", border: `1px solid ${s.c}20` }}>
            <p style={{ margin: "0 0 6px", fontSize: 22 }}>{s.icon}</p>
            <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: s.c }}>{s.val}</p>
            <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>{s.label}</p>
          </div>
        ))}
      </div>
      <div style={{ background: "#fff", borderRadius: 18, boxShadow: "0 4px 28px rgba(0,0,0,0.08)", border: "1.5px solid #F3F4F6", overflow: "hidden" }}>
        <div style={{ padding: "16px 22px", borderBottom: "1px solid #F3F4F6" }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#111827" }}>Capacity Tracker</h3>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#F9FAFB" }}>
              {["Event","Club","Date","Category","Filled","Status"].map(h => <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {events.map((ev, i) => {
                const pct = seatsPercent(ev);
                const isFull = seatsLeft(ev) <= 0;
                return (
                  <tr key={ev.id} style={{ borderTop: "1px solid #F3F4F6", background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ padding: "11px 16px" }}><div style={{ display: "flex", gap: 8, alignItems: "center" }}><span style={{ fontSize: 18 }}>{ev.image}</span><span style={{ fontWeight: 600, fontSize: 13, color: "#111827" }}>{ev.title}</span></div></td>
                    <td style={{ padding: "11px 16px", fontSize: 12, color: "#6B7280" }}>{ev.clubName}</td>
                    <td style={{ padding: "11px 16px", fontSize: 12, color: "#6B7280", whiteSpace: "nowrap" }}>{ev.date}</td>
                    <td style={{ padding: "11px 16px" }}><span style={{ fontSize: 11, fontWeight: 700, color: CAT_COLORS[ev.category] || "#6366F1", background: `${CAT_COLORS[ev.category] || "#6366F1"}15`, borderRadius: 20, padding: "2px 8px" }}>{ev.category}</span></td>
                    <td style={{ padding: "11px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 70, height: 5, background: "#E5E7EB", borderRadius: 99 }}>
                          <div style={{ width: `${Math.min(pct, 100)}%`, height: "100%", background: pct >= 100 ? "#EF4444" : pct > 75 ? "#F59E0B" : "#10B981", borderRadius: 99 }} />
                        </div>
                        <span style={{ fontSize: 12, color: "#374151" }}>{ev.registrations}/{ev.totalSeats}</span>
                      </div>
                    </td>
                    <td style={{ padding: "11px 16px" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: isFull ? "#FEE2E2" : seatsLeft(ev) < 20 ? "#FFFBEB" : "#ECFDF5", color: isFull ? "#DC2626" : seatsLeft(ev) < 20 ? "#92400E" : "#065F46" }}>
                        {isFull ? "Full" : seatsLeft(ev) < 20 ? "Almost Full" : "Available"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Home Page ─────────────────────────────────────────────────────────────────
function HomePage({ events, onLoginClick, onSignupClick }) {
  const [slide, setSlide] = useState(0);
  const upcoming = events.filter(e => e.date >= fmt(today)).slice(0, 5);
  useEffect(() => {
    const t = setInterval(() => setSlide(p => (p + 1) % Math.max(1, upcoming.length)), 3800);
    return () => clearInterval(t);
  }, [upcoming.length]);

  return (
    <div style={{ minHeight: "calc(100vh - 60px)" }}>
      <div style={{ background: "linear-gradient(135deg,#EEF2FF 0%,#F5F3FF 50%,#FDF4FF 100%)", padding: "72px 16px 52px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(#6366F130,transparent)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -50, left: -50, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(#8B5CF630,transparent)", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 600, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#EEF2FF", color: "#4F46E5", borderRadius: 20, padding: "6px 16px", fontSize: 13, fontWeight: 700, marginBottom: 20, border: "1px solid #C7D2FE" }}>🎓 College Event Hub</div>
          <h1 style={{ margin: "0 0 14px", fontSize: "clamp(28px,5vw,50px)", fontWeight: 900, color: "#111827", fontFamily: "'Playfair Display', Georgia, serif", lineHeight: 1.15 }}>
            Your Campus,<br /><span style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>All Events</span>
          </h1>
          <p style={{ margin: "0 0 28px", fontSize: 17, color: "#6B7280", lineHeight: 1.6 }}>Discover events from every club. Register, track, never miss out.</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn size="lg" onClick={onSignupClick} style={{ fontSize: 15 }}>Get Started →</Btn>
            <Btn size="lg" variant="ghost" onClick={onLoginClick}>Sign In</Btn>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 36, flexWrap: "wrap" }}>
            {[{ n: events.length, label: "Events" }, { n: initialClubs.length, label: "Clubs" }, { n: events.reduce((s, e) => s + e.totalSeats, 0), label: "Seats" }].map(s => (
              <div key={s.label}><p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#6366F1" }}>{s.n}</p><p style={{ margin: 0, fontSize: 12, color: "#9CA3AF" }}>{s.label}</p></div>
            ))}
          </div>
        </div>
      </div>

      {upcoming.length > 0 && (
        <div style={{ maxWidth: 860, margin: "36px auto 0", padding: "0 16px" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", marginBottom: 16, fontFamily: "'Playfair Display', Georgia, serif" }}>Upcoming Events</h2>
          <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", boxShadow: "0 6px 32px rgba(99,102,241,0.14)", border: "1.5px solid #E5E7EB" }}>
            {upcoming.map((ev, i) => {
              const c = CAT_COLORS[ev.category] || "#6366F1";
              return (
                <div key={ev.id} style={{ display: i === slide ? "flex" : "none", background: `linear-gradient(135deg,${c}12,#fff)`, padding: "32px 36px", gap: 24, alignItems: "center", animation: "fadeIn 0.4s ease" }}>
                  <div style={{ width: 88, height: 88, borderRadius: 22, background: `${c}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 46, flexShrink: 0 }}>{ev.image}</div>
                  <div>
                    <span style={{ background: `${c}18`, color: c, borderRadius: 20, padding: "3px 11px", fontSize: 12, fontWeight: 700 }}>{ev.category}</span>
                    <h3 style={{ margin: "8px 0 4px", fontSize: 24, fontWeight: 800, color: "#111827", fontFamily: "'Playfair Display', Georgia, serif" }}>{ev.title}</h3>
                    <p style={{ margin: "0 0 4px", color: "#6B7280", fontSize: 13 }}>{ev.clubName} · {formatDate(ev.date)} · {formatTime(ev.time)}</p>
                    <p style={{ margin: "0 0 14px", color: "#9CA3AF", fontSize: 12 }}>{seatsLeft(ev)} seats remaining</p>
                    <Btn onClick={onSignupClick} size="md">Register Now →</Btn>
                  </div>
                </div>
              );
            })}
            <div style={{ position: "absolute", bottom: 12, right: 14, display: "flex", gap: 5 }}>
              {upcoming.map((_, i) => <button key={i} onClick={() => setSlide(i)} style={{ width: i === slide ? 18 : 7, height: 7, borderRadius: 99, background: i === slide ? "#6366F1" : "#CBD5E1", border: "none", cursor: "pointer", transition: "all 0.3s", padding: 0 }} />)}
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 860, margin: "36px auto 0", padding: "0 16px 48px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", marginBottom: 14, fontFamily: "'Playfair Display', Georgia, serif" }}>Browse by Category</h2>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {CATEGORIES.filter(c => c !== "All").map(cat => {
            const c = CAT_COLORS[cat] || "#6366F1";
            return <span key={cat} onClick={onSignupClick} style={{ background: `${c}12`, color: c, border: `1px solid ${c}28`, borderRadius: 20, padding: "8px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = `${c}22`; }}
              onMouseLeave={e => { e.currentTarget.style.background = `${c}12`; }}
            >{cat}</span>;
          })}
        </div>
      </div>
    </div>
  );
}

// ── Events Listing ────────────────────────────────────────────────────────────
function EventsListing({ events, user, registrations, onSelectEvent, addToast }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [availability, setAvailability] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [showCalendar, setShowCalendar] = useState(false);

  const filtered = events
    .filter(ev => {
      const q = search.toLowerCase();
      return (!q || ev.title.toLowerCase().includes(q) || ev.clubName.toLowerCase().includes(q) || ev.category.toLowerCase().includes(q))
        && (category === "All" || ev.category === category)
        && (availability === "All" || (availability === "Available" && seatsLeft(ev) > 0) || (availability === "Full" && seatsLeft(ev) <= 0));
    })
    .sort((a, b) => sortBy === "title" ? a.title.localeCompare(b.title) : sortBy === "seats" ? seatsLeft(b) - seatsLeft(a) : a.date.localeCompare(b.date));

  return (
    <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 16px 48px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setShowCalendar(true)} style={{ background: "#EEF2FF", border: "1px solid #C7D2FE", borderRadius: 10, padding: "7px 13px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 700, color: "#4F46E5", fontFamily: "'DM Sans', sans-serif" }}>📅 Calendar</button>
          <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: "#111827", fontFamily: "'Playfair Display', Georgia, serif" }}>All Events</h2>
        </div>
        <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 500 }}>{filtered.length} event{filtered.length !== 1 ? "s" : ""}</span>
      </div>
      <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #F3F4F6", padding: "14px 16px", marginBottom: 18, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1 1 180px" }}>
          <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", fontSize: 15 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events, clubs..." style={{ width: "100%", padding: "9px 12px 9px 33px", border: "1.5px solid #E5E7EB", borderRadius: 10, fontSize: 13, background: "#F9FAFB", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: "9px 13px", border: "1.5px solid #E5E7EB", borderRadius: 10, fontSize: 13, background: "#F9FAFB", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", outline: "none" }}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={availability} onChange={e => setAvailability(e.target.value)} style={{ padding: "9px 13px", border: "1.5px solid #E5E7EB", borderRadius: 10, fontSize: 13, background: "#F9FAFB", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", outline: "none" }}>
          <option value="All">All Availability</option>
          <option value="Available">Available</option>
          <option value="Full">Fully Booked</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: "9px 13px", border: "1.5px solid #E5E7EB", borderRadius: 10, fontSize: 13, background: "#F9FAFB", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", outline: "none" }}>
          <option value="date">Sort: Date</option>
          <option value="title">Sort: Title</option>
          <option value="seats">Sort: Seats</option>
        </select>
      </div>
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: 52, marginBottom: 14 }}>🔍</div>
          <h3 style={{ margin: "0 0 6px", color: "#374151" }}>No events found</h3>
          <p style={{ margin: 0, color: "#9CA3AF", fontSize: 14 }}>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
          {filtered.map(ev => <EventCard key={ev.id} event={ev} onClick={() => onSelectEvent(ev)} isRegistered={registrations.includes(ev.id)} />)}
        </div>
      )}
      <CalendarModal open={showCalendar} onClose={() => setShowCalendar(false)} events={events} onSelectEvent={onSelectEvent} />
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar({ user, page, onLoginClick, onSignupClick, onCreateEvent, onNavigate, onLogout }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const close = e => { if (ref.current && !ref.current.contains(e.target)) setProfileOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.96)", borderBottom: "1px solid #F3F4F6", padding: "0 20px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", backdropFilter: "blur(10px)", boxShadow: "0 2px 14px rgba(0,0,0,0.05)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div onClick={() => onNavigate("home")} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <span style={{ fontSize: 24 }}>🏛️</span>
          <span style={{ fontWeight: 900, fontSize: 17, color: "#111827", fontFamily: "'Playfair Display', Georgia, serif" }}>EduEvents</span>
        </div>
        {user && (
          <>
            <button onClick={() => onNavigate("events")} style={{ background: page === "events" ? "#EEF2FF" : "none", border: "none", borderRadius: 8, padding: "5px 11px", cursor: "pointer", fontSize: 13, color: page === "events" ? "#4F46E5" : "#6B7280", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>Events</button>
            {user.role === "admin" && <button onClick={() => onNavigate("dashboard")} style={{ background: page === "dashboard" ? "#EEF2FF" : "none", border: "none", borderRadius: 8, padding: "5px 11px", cursor: "pointer", fontSize: 13, color: page === "dashboard" ? "#4F46E5" : "#6B7280", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>Dashboard</button>}
          </>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {!user ? (
          <>
            <Btn variant="secondary" size="sm" onClick={onLoginClick}>Log In</Btn>
            <Btn size="sm" onClick={onSignupClick}>Sign Up</Btn>
          </>
        ) : (
          <>
            {user.role === "admin" && (
              <button onClick={onCreateEvent} style={{ display: "flex", alignItems: "center", gap: 5, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "#fff", border: "none", borderRadius: 10, padding: "7px 14px", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", boxShadow: "0 2px 8px #6366F135" }}>+ Create Event</button>
            )}
            <div ref={ref} style={{ position: "relative" }}>
              <button onClick={() => setProfileOpen(!profileOpen)} style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "#fff", border: "2px solid #C7D2FE", cursor: "pointer", fontSize: 14, fontWeight: 800 }}>
                {user.name.charAt(0).toUpperCase()}
              </button>
              {profileOpen && (
                <div style={{ position: "absolute", top: 46, right: 0, background: "#fff", borderRadius: 14, boxShadow: "0 8px 36px rgba(0,0,0,0.13)", border: "1px solid #F3F4F6", minWidth: 190, overflow: "hidden", animation: "slideDown 0.2s ease", zIndex: 200 }}>
                  <div style={{ padding: "12px 14px", borderBottom: "1px solid #F3F4F6", background: "#F9FAFB" }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: "#111827" }}>{user.name}</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#6B7280" }}>{user.email}</p>
                  </div>
                  {[
                    { label: "👤 My Profile", action: () => { onNavigate("profile"); setProfileOpen(false); } },
                    ...(user.role === "admin" ? [{ label: "📊 Dashboard", action: () => { onNavigate("dashboard"); setProfileOpen(false); } }] : []),
                  ].map(item => (
                    <button key={item.label} onClick={item.action} style={{ display: "block", width: "100%", padding: "10px 14px", textAlign: "left", background: "none", border: "none", fontSize: 13, cursor: "pointer", color: "#374151", fontFamily: "'DM Sans', sans-serif" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#F9FAFB"}
                      onMouseLeave={e => e.currentTarget.style.background = "none"}
                    >{item.label}</button>
                  ))}
                  <button onClick={() => { onLogout(); setProfileOpen(false); }} style={{ display: "block", width: "100%", padding: "10px 14px", textAlign: "left", background: "none", border: "none", fontSize: 13, cursor: "pointer", color: "#EF4444", fontFamily: "'DM Sans', sans-serif", borderTop: "1px solid #F3F4F6" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#FEF2F2"}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}
                  >🚪 Log Out</button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [events, setEvents] = useState(initialEvents);
  const [registrations, setRegistrations] = useState([]);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("home");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  const handleLogin = u => { setUser(u); setPage("events"); };
  const handleLogout = () => { setUser(null); setPage("home"); setRegistrations([]); addToast("Logged out", "info"); };
  const handleCreateEvent = ev => setEvents(p => [ev, ...p]);
  const handleRegister = eventId => {
    if (registrations.includes(eventId)) { addToast("Already registered!", "error"); return; }
    setRegistrations(p => [...p, eventId]);
    setEvents(p => p.map(ev => ev.id === eventId ? { ...ev, registrations: ev.registrations + 1 } : ev));
  };
  const navigate = p => {
    if ((p === "events" || p === "profile" || p === "dashboard") && !user) { setShowLogin(true); return; }
    setPage(p); setSelectedEvent(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px) scale(0.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(16px) } to { opacity: 1; transform: translateX(0) } }
        @keyframes spin { to { transform: rotate(360deg) } }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 99px; }
      `}</style>

      <Navbar user={user} page={page} onLoginClick={() => setShowLogin(true)} onSignupClick={() => setShowSignup(true)} onCreateEvent={() => setShowCreate(true)} onNavigate={navigate} onLogout={handleLogout} />

      <main>
        {page === "home" && <HomePage events={events} onLoginClick={() => setShowLogin(true)} onSignupClick={() => setShowSignup(true)} />}
        {page === "events" && <EventsListing events={events} user={user} registrations={registrations} onSelectEvent={ev => { setSelectedEvent(ev); setPage("event-detail"); }} addToast={addToast} />}
        {page === "event-detail" && selectedEvent && <EventDetails event={events.find(e => e.id === selectedEvent.id) || selectedEvent} user={user} registrations={registrations} onRegister={handleRegister} onBack={() => setPage("events")} addToast={addToast} />}
        {page === "profile" && user && <ProfilePage user={user} events={events} registrations={registrations} onBack={() => setPage("events")} />}
        {page === "dashboard" && user?.role === "admin" && <AdminDashboard events={events} onBack={() => setPage("events")} />}
      </main>

      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} onLogin={handleLogin} onSwitchSignup={() => { setShowLogin(false); setShowSignup(true); }} addToast={addToast} />
      <SignupModal open={showSignup} onClose={() => setShowSignup(false)} onLogin={handleLogin} onSwitchLogin={() => { setShowSignup(false); setShowLogin(true); }} addToast={addToast} />
      <CreateEventModal open={showCreate} onClose={() => setShowCreate(false)} onCreate={handleCreateEvent} addToast={addToast} />
      <Toast toasts={toasts} removeToast={removeToast} />
      {showSignup && (
    <SignupModal onClose={() => setShowSignup(false)} />
      )}
    </div>
  );
}
