import { useState, useMemo } from "react";

const SPEC_COLORS = {
  Sports:      "#d97a3a",
  Politics:    "#d95a5a",
  Culture:     "#9b6dd9",
  Technology:  "#4a90d9",
  Economy:     "#e0a030",
  Health:      "#3cb87a",
  Environment: "#3ab8c8",
};

const INITIAL_DATA = [
  { id:1,  name:"رزان إدريس",     specialization:"Sports",      articles:201, social_posts:3400, spread:312000, rating:9.5 },
  { id:2,  name:"Bahaa Abassi",     specialization:"Politics",    articles:142, social_posts:980,  spread:87400,  rating:9.2 },
  { id:3,  name:"Mais Ibrahim",     specialization:"Culture",     articles:63,  social_posts:2100, spread:210000, rating:8.9 },
  { id:4,  name:"Habiba Shadid",    specialization:"Technology",  articles:98,  social_posts:1520, spread:134000, rating:8.7 },
  { id:5,  name:"Masara Qirish",    specialization:"Technology",  articles:87,  social_posts:1750, spread:178000, rating:8.6 },
  { id:6,  name:"Qossai Nassan",    specialization:"Politics",    articles:130, social_posts:1100, spread:102000, rating:8.4 },
  { id:7,  name:"Karla Jalad",      specialization:"Economy",     articles:115, social_posts:870,  spread:91000,  rating:8.1 },
  { id:8,  name:"Falastin Hussain", specialization:"Economy",     articles:109, social_posts:760,  spread:74500,  rating:7.9 },
  { id:9,  name:"Balqees Arar",     specialization:"Health",      articles:76,  social_posts:640,  spread:52300,  rating:7.4 },
  { id:10, name:"Malak Malah",      specialization:"Environment", articles:54,  social_posts:490,  spread:38700,  rating:7.1 },
];

const fmt = (n) =>
  n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + "M" :
  n >= 1_000     ? (n / 1_000).toFixed(0) + "K" : String(n);

function Stars({ rating }) {
  const full  = Math.floor(rating / 2);
  const half  = (rating % 2) >= 1;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span style={{ color: "#e0a030", fontSize: 12, letterSpacing: 1 }}>
      {"★".repeat(full)}
      {half && <span style={{ fontSize: 10 }}>½</span>}
      <span style={{ color: "rgba(255,255,255,.15)" }}>{"☆".repeat(empty)}</span>
      <span style={{ color: "#666", fontSize: 11, marginLeft: 5 }}>{rating.toFixed(1)}</span>
    </span>
  );
}

function Badge({ spec }) {
  const c = SPEC_COLORS[spec] || "#888";
  return (
    <span style={{
      background: c + "22", color: c, border: `1px solid ${c}44`,
      borderRadius: 20, padding: "3px 11px", fontSize: 11, fontWeight: 600,
    }}>{spec}</span>
  );
}

function MiniBar({ value, max, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ minWidth: 34, fontSize: 12, fontWeight: 500, color }}>{value}</span>
      <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,.07)", borderRadius: 3, overflow: "hidden", minWidth: 50 }}>
        <div style={{ width: `${(value / max * 100).toFixed(1)}%`, height: "100%", background: color, borderRadius: 3, transition: "width .5s" }} />
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, accent, delay }) {
  const accentMap = { gold: "#e0a030", blue: "#4a90d9", green: "#3cb87a", red: "#d95a5a" };
  const c = accentMap[accent] || accent;
  return (
    <div style={{
      background: "linear-gradient(135deg,#12122a,#10102a)", border: "1px solid #1e1e3f",
      borderRadius: 14, padding: "18px 20px", position: "relative", overflow: "hidden",
      animation: `fadeUp .32s ease ${delay}s both`,
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: c, borderRadius: "14px 14px 0 0" }} />
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".1em", color: "#888", marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: c, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 11, color: "#555" }}>{sub}</div>
    </div>
  );
}

function HlCard({ emoji, color, label, name, meta }) {
  return (
    <div style={{
      background: "linear-gradient(135deg,#12122a,#10102a)", border: "1px solid #1e1e3f",
      borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14,
    }}>
      <div style={{ width: 42, height: 42, borderRadius: "50%", background: color + "22", color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{emoji}</div>
      <div>
        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".1em", color, marginBottom: 3 }}>{label}</div>
        <div style={{ fontWeight: 500, fontSize: 14, color: "#eee" }}>{name}</div>
        <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{meta}</div>
      </div>
    </div>
  );
}

const BLANK = { name: "", specialization: "Politics", articles: "", social_posts: "", spread: "", rating: "" };

export default function App() {
  const [data, setData]         = useState(INITIAL_DATA);
  const [sortKey, setSortKey]   = useState("rating");
  const [sortDir, setSortDir]   = useState(-1);
  const [spec, setSpec]         = useState("All");
  const [search, setSearch]     = useState("");
  const [modal, setModal]       = useState(false);
  const [editId, setEditId]     = useState(null);
  const [form, setForm]         = useState(BLANK);

  const specs = ["All", ...Object.keys(SPEC_COLORS)];
  const maxArt    = Math.max(...data.map(d => d.articles));
  const maxSpread = Math.max(...data.map(d => d.spread));

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter(j =>
      (spec === "All" || j.specialization === spec) &&
      (j.name.toLowerCase().includes(q) || j.specialization.toLowerCase().includes(q))
    );
  }, [data, spec, search]);

  const rows = useMemo(() =>
    [...filtered].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      return typeof av === "string" ? av.localeCompare(bv) * sortDir : (av - bv) * sortDir;
    }), [filtered, sortKey, sortDir]);

  const toggleSort = (k) => {
    if (sortKey === k) setSortDir(d => d * -1);
    else { setSortKey(k); setSortDir(-1); }
  };

  const avgRating     = (data.reduce((s, d) => s + d.rating, 0) / data.length).toFixed(2);
  const totalArticles = data.reduce((s, d) => s + d.articles, 0);
  const totalSpread   = data.reduce((s, d) => s + d.spread, 0);
  const topJ          = [...data].sort((a, b) => b.rating - a.rating)[0];
  const topSpread     = [...data].sort((a, b) => b.spread - a.spread)[0];
  const topArt        = [...data].sort((a, b) => b.articles - a.articles)[0];

  const openAdd = () => { setEditId(null); setForm(BLANK); setModal(true); };
  const openEdit = (row) => {
    setEditId(row.id);
    setForm({ name: row.name, specialization: row.specialization, articles: row.articles, social_posts: row.social_posts, spread: row.spread, rating: row.rating });
    setModal(true);
  };
  const saveModal = () => {
    if (!form.name.trim()) return alert("Name is required");
    const obj = { ...form, id: editId || Math.max(...data.map(d => d.id)) + 1, articles: +form.articles || 0, social_posts: +form.social_posts || 0, spread: +form.spread || 0, rating: Math.min(10, Math.max(0, +form.rating || 0)) };
    setData(prev => editId ? prev.map(d => d.id === editId ? obj : d) : [...prev, obj]);
    setModal(false);
  };
  const delRow = (id) => { if (window.confirm("Remove this journalist?")) setData(prev => prev.filter(d => d.id !== id)); };
  const downloadCSV = () => {
    const headers = ["ID","Name","Specialization","Articles","Social Posts","Spread","Rating"];
    const csvRows = data.map(d => [d.id, `"${d.name}"`, d.specialization, d.articles, d.social_posts, d.spread, d.rating]);
    const csv = [headers, ...csvRows].map(r => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "journalists_data.csv"; a.click();
  };

  const S = { // style shortcuts
    page:  { minHeight: "100vh", background: "#0b0b1a", color: "#eee", fontFamily: "'DM Sans',sans-serif", padding: "32px 20px" },
    wrap:  { maxWidth: 1100, margin: "0 auto" },
    th:    (k) => ({ padding: "11px 14px", textAlign: "left", fontSize: 11, textTransform: "uppercase", letterSpacing: ".09em", color: sortKey === k ? "#e0a030" : "#888", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'Playfair Display',serif", fontWeight: 700, borderBottom: "1px solid #1e1e3f", userSelect: "none" }),
    inp:   { width: "100%", background: "#0b0b1a", color: "#eee", border: "1px solid #1e1e3f", borderRadius: 7, padding: "8px 11px", fontSize: 13, fontFamily: "inherit", outline: "none" },
  };

  return (
    <div style={S.page}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}} @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@400;500&display=swap');`}</style>
      <div style={S.wrap}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 14 }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 44, fontWeight: 900, lineHeight: 1, letterSpacing: -1 }}>
              <span style={{ color: "#e0a030", fontStyle: "italic" }}>Press</span>
              <span style={{ color: "#fff" }}>Lens</span>
            </div>
            <div style={{ color: "#888", fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", marginTop: 6 }}>Journalist Analytics Dashboard</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={openAdd} style={{ background: "#e0a030", color: "#0b0b1a", border: "1px solid #e0a030", borderRadius: 8, padding: "9px 18px", fontWeight: 500, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>＋ Add Journalist</button>
            <button onClick={downloadCSV} style={{ background: "transparent", color: "#e0a030", border: "1px solid #e0a030", borderRadius: 8, padding: "9px 18px", fontWeight: 500, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>↓ Export CSV</button>
          </div>
        </div>

        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 14 }}>
          <StatCard label="Avg Rating"   value={avgRating}                accent="gold"  sub="across all journalists" delay={0}   />
          <StatCard label="Total Articles" value={totalArticles.toLocaleString()} accent="blue" sub="published"            delay={0.05} />
          <StatCard label="Total Spread" value={fmt(totalSpread)}         accent="green" sub="social impressions"      delay={0.1}  />
          <StatCard label="Top Journalist" value={topJ.name.split(" ")[0]} accent="red"  sub={`Rating ${topJ.rating}`} delay={0.15} />
        </div>

        {/* Highlights */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 18 }}>
          <HlCard emoji="🏆" color="#e0a030" label="Best Rated Journalist"     name={topJ.name}      meta={`Rating ${topJ.rating} · ${topJ.specialization}`} />
          <HlCard emoji="📡" color="#3cb87a" label="Highest Social Spread"     name={topSpread.name} meta={`${fmt(topSpread.spread)} impressions · ${topSpread.specialization}`} />
          <HlCard emoji="📰" color="#4a90d9" label="Most Articles Published"   name={topArt.name}    meta={`${topArt.articles} articles · ${topArt.specialization}`} />
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14, alignItems: "center" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search journalists…"
            style={{ flex: 1, minWidth: 180, background: "#10102a", color: "#eee", border: "1px solid #1e1e3f", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontFamily: "inherit", outline: "none" }}
          />
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {specs.map(s => {
              const active = s === spec;
              const c = SPEC_COLORS[s] || "#e0a030";
              return (
                <button key={s} onClick={() => setSpec(s)} style={{
                  fontSize: 11, padding: "5px 13px", borderRadius: 20,
                  border: `1px solid ${active ? c : "#1e1e3f"}`,
                  background: active ? c : "transparent",
                  color: active ? "#fff" : "#888", fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
                }}>{s}</button>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div style={{ background: "#10102a", borderRadius: 16, border: "1px solid #1e1e3f", overflow: "auto", boxShadow: "0 8px 40px rgba(0,0,0,.5)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
            <thead>
              <tr>
                <th style={S.th("")}>#</th>
                {[["name","Journalist"],["specialization","Beat"],["articles","Articles"],["social_posts","Social Posts"],["spread","Spread"],["rating","Rating"]].map(([k,l]) => (
                  <th key={k} onClick={() => toggleSort(k)} style={S.th(k)}>
                    {l} {sortKey === k ? (sortDir === -1 ? "↓" : "↑") : ""}
                  </th>
                ))}
                <th style={{ ...S.th(""), cursor: "default", color: "#555" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.id} style={{ borderBottom: "1px solid rgba(30,30,63,.8)", transition: "background .12s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.03)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "12px 14px", color: "#555", fontSize: 12 }}>#{i+1}</td>
                  <td style={{ padding: "12px 14px", fontWeight: 500 }}>{row.name}</td>
                  <td style={{ padding: "12px 14px" }}><Badge spec={row.specialization} /></td>
                  <td style={{ padding: "12px 14px" }}><MiniBar value={row.articles} max={maxArt} color="#4a90d9" /></td>
                  <td style={{ padding: "12px 14px", color: "#888", fontSize: 13 }}>{row.social_posts.toLocaleString()}</td>
                  <td style={{ padding: "12px 14px" }}><MiniBar value={fmt(row.spread)} max={maxSpread} color="#3cb87a" /></td>
                  <td style={{ padding: "12px 14px" }}><Stars rating={row.rating} /></td>
                  <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                    <button onClick={() => openEdit(row)} style={{ background: "transparent", color: "#e0a030", border: "1px solid rgba(224,160,48,.4)", borderRadius: 6, padding: "5px 11px", fontSize: 11, cursor: "pointer", marginRight: 6, fontFamily: "inherit" }}>✏ Edit</button>
                    <button onClick={() => delRow(row.id)} style={{ background: "transparent", color: "#d95a5a", border: "1px solid rgba(217,90,90,.4)", borderRadius: 6, padding: "5px 11px", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>✕</button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={8} style={{ padding: 32, textAlign: "center", color: "#555" }}>No journalists match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{ textAlign: "right", color: "#555", fontSize: 12, marginTop: 10 }}>Showing {rows.length} of {data.length} journalists</div>

        {/* Modal */}
        {modal && (
          <div onClick={e => e.target === e.currentTarget && setModal(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.65)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ background: "#12122a", border: "1px solid #1e1e3f", borderRadius: 16, padding: 28, width: 340, maxWidth: "95vw" }}>
              <div style={{ fontFamily: "'Playfair Display',serif", color: "#e0a030", fontSize: 20, marginBottom: 18 }}>{editId ? "Edit Journalist" : "Add Journalist"}</div>
              {[["Name","name","text"],["Articles","articles","number"],["Social Posts","social_posts","number"],["Spread","spread","number"],["Rating (0–10)","rating","number"]].map(([label,key,type]) => (
                <div key={key} style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>{label}</label>
                  <input type={type} step={key==="rating"?".1":"1"} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={S.inp} />
                </div>
              ))}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>Specialization</label>
                <select value={form.specialization} onChange={e => setForm(f => ({ ...f, specialization: e.target.value }))} style={{ ...S.inp }}>
                  {Object.keys(SPEC_COLORS).map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={saveModal} style={{ flex: 1, background: "#e0a030", color: "#0b0b1a", border: "none", borderRadius: 8, padding: 11, fontWeight: 500, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Save</button>
                <button onClick={() => setModal(false)} style={{ flex: 1, background: "transparent", color: "#888", border: "1px solid #1e1e3f", borderRadius: 8, padding: 11, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
