export default function Avatar({ name = "", color = "#e8c547", size = 36 }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%",
        background: color + "22", border: "1.5px solid " + color + "66",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.33, fontWeight: 700, color, flexShrink: 0,
        fontFamily: "'DM Mono', monospace",
      }}
    >
      {initials || "?"}
    </div>
  );
}
