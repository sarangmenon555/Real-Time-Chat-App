import Avatar from "./Avatar";

const USER_COLORS = ["#e8c547", "#47c5e8", "#e847a0", "#a047e8", "#47e8a0"];

function colorForId(id = "") {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return USER_COLORS[Math.abs(hash) % USER_COLORS.length];
}

export default function Message({ msg, isMe, showAvatar }) {
  const color = isMe ? "#e8c547" : colorForId(msg.userId);
  const name = isMe ? "You" : msg.userName;
  const time = msg.createdAt
    ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : msg.time || "";

  return (
    <div style={{
      display: "flex", flexDirection: isMe ? "row-reverse" : "row",
      gap: 10, padding: "3px 16px", alignItems: "flex-end",
    }}>
      <div style={{ width: 36, flexShrink: 0 }}>
        {showAvatar && <Avatar name={name} color={color} size={36} />}
      </div>
      <div style={{
        maxWidth: "62%", display: "flex", flexDirection: "column",
        alignItems: isMe ? "flex-end" : "flex-start", gap: 3,
      }}>
        {showAvatar && (
          <span style={{
            fontSize: 11, color, fontFamily: "'DM Mono', monospace",
            fontWeight: 700, letterSpacing: "0.04em",
          }}>
            {name}
          </span>
        )}
        {msg.mediaUrl && msg.mediaType === "image" ? (
          <img
            src={msg.mediaUrl} alt="shared"
            style={{ maxWidth: 260, borderRadius: 8, border: "1px solid #222" }}
          />
        ) : (
          <div style={{
            background: isMe ? "#e8c54722" : "#ffffff08",
            border: "1px solid " + (isMe ? "#e8c54744" : "#ffffff10"),
            borderRadius: isMe ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
            padding: "9px 13px", fontSize: 14, color: "#e8e8e8",
            lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif", wordBreak: "break-word",
          }}>
            {msg.text}
          </div>
        )}
        <span style={{ fontSize: 10, color: "#444", fontFamily: "'DM Mono', monospace" }}>
          {time}
        </span>
      </div>
    </div>
  );
}
