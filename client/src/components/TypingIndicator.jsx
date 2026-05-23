export default function TypingIndicator({ names = [] }) {
  if (!names.length) return null;
  return (
    <div style={{ padding: "4px 16px 8px", display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
        {[0, 1, 2].map((i) => (
          <span key={i} className="typing-dot" style={{
            width: 5, height: 5, borderRadius: "50%",
            background: "#e8c547", display: "inline-block",
            animationDelay: i * 0.2 + "s",
          }} />
        ))}
      </div>
      <span style={{ fontSize: 12, color: "#666", fontFamily: "'DM Mono', monospace" }}>
        {names.join(", ")} {names.length === 1 ? "is" : "are"} typing
      </span>
    </div>
  );
}
