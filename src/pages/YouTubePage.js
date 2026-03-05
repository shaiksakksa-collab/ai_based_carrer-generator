import CAREERS from "../data/careers";

export default function YouTubePage({ career }) {
  const c = CAREERS[career];
  return (
    <div style={s.page}>
      <h1 style={s.title}>YouTube Channels</h1>
      <p style={s.sub}>Top creators for free, high-quality learning</p>
      <div style={s.list}>
        {c.youtube.map((ch, i) => (
          <a key={i} href={ch.link} target="_blank" rel="noopener noreferrer" style={s.card}>
            <div style={{ ...s.avatar, background: c.gradient }}>{ch.channel[0]}</div>
            <div style={{ flex: 1 }}>
              <h3 style={s.name}>{ch.channel}</h3>
              <p style={s.topic}>{ch.topic}</p>
              <span style={{ color: c.accent, fontSize: 12, fontWeight: 600 }}>👥 {ch.subs} subscribers</span>
            </div>
            <span style={{ color: "#ff0000", fontSize: 22 }}>▶</span>
          </a>
        ))}
      </div>
    </div>
  );
}

const s = {
  page: { padding: "44px 48px", maxWidth: 860, margin: "0 auto" },
  title: { fontFamily: "'Syne',sans-serif", color: "#fff", fontSize: 28, fontWeight: 800, marginBottom: 6 },
  sub: { color: "#33334a", fontSize: 14, marginBottom: 36 },
  list: { display: "flex", flexDirection: "column", gap: 12 },
  card: { display: "flex", alignItems: "center", gap: 18, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: "20px 24px", textDecoration: "none" },
  avatar: { width: 52, height: 52, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 22, flexShrink: 0 },
  name: { color: "#e8e8f0", fontWeight: 700, fontSize: 16, marginBottom: 4 },
  topic: { color: "#44445a", fontSize: 13, marginBottom: 6 },
};
