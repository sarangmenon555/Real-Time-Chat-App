const colors = { online: "#47e8a0", away: "#e8c547", offline: "#333" };

export default function StatusDot({ status = "offline" }) {
  return (
    <span style={{
      width: 8, height: 8, borderRadius: "50%",
      background: colors[status] || "#333",
      display: "inline-block", flexShrink: 0,
    }} />
  );
}
