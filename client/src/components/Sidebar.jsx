import StatusDot from "./StatusDot";
import Avatar from "./Avatar";
import useChatStore from "../store/chatStore";

export default function Sidebar() {
  const { user, channels, activeChannelId, setActiveChannel, connected, onlineUsers } = useChatStore();

  return (
    <div style={{
      width: 240, background: "#0e0e0e", borderRight: "1px solid #1a1a1a",
      display: "flex", flexDirection: "column", flexShrink: 0, height: "100vh",
    }}>
      <div style={{
        padding: "18px 16px 14px", borderBottom: "1px solid #1a1a1a",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{
            fontFamily: "'DM Mono', monospace", fontWeight: 700,
            fontSize: 13, letterSpacing: "0.12em", color: "#e8c547", textTransform: "uppercase",
          }}>Relay</div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>
            <span className="connection-pulse" style={{
              width: 6, height: 6, borderRadius: "50%",
              background: connected ? "#47e8a0" : "#555", display: "inline-block",
            }} />
            <span style={{ fontSize: 10, color: "#555", fontFamily: "'DM Mono', monospace" }}>
              {connected ? "socket connected" : "connecting..."}
            </span>
          </div>
        </div>
      </div>

      <div style={{ padding: "14px 10px 6px", overflowY: "auto", flex: 1 }}>
        <div style={{
          fontSize: 10, color: "#444", fontFamily: "'DM Mono', monospace",
          letterSpacing: "0.1em", textTransform: "uppercase", padding: "0 6px 8px",
        }}>Channels</div>
        {channels.map((ch) => (
          <div key={ch._id} onClick={() => setActiveChannel(ch._id)} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "7px 8px", borderRadius: 6, cursor: "pointer",
            background: activeChannelId === ch._id ? "#e8c54714" : "transparent",
            transition: "background 0.15s",
          }}>
            <span style={{
              fontFamily: "'DM Mono', monospace", fontSize: 13,
              color: activeChannelId === ch._id ? "#e8c547" : "#666",
            }}>
              # {ch.name}
            </span>
            {ch.unread > 0 && (
              <span style={{
                background: "#e8c547", color: "#0a0a0a", fontSize: 10,
                fontWeight: 700, borderRadius: 10, padding: "1px 6px",
                fontFamily: "'DM Mono', monospace",
              }}>
                {ch.unread}
              </span>
            )}
          </div>
        ))}

        <div style={{
          fontSize: 10, color: "#444", fontFamily: "'DM Mono', monospace",
          letterSpacing: "0.1em", textTransform: "uppercase", padding: "14px 6px 8px",
        }}>Online</div>
        {Object.entries(onlineUsers).map(([uid, u]) => (
          <div key={uid} style={{
            display: "flex", alignItems: "center", gap: 8, padding: "5px 8px", borderRadius: 6,
          }}>
            <StatusDot status="online" />
            <span style={{ fontSize: 12, color: "#888", fontFamily: "'DM Sans', sans-serif" }}>
              {u.name}
            </span>
          </div>
        ))}
      </div>

      {user && (
        <div style={{
          padding: "12px 16px", borderTop: "1px solid #1a1a1a",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <Avatar name={user.name} color="#e8c547" size={32} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#e8e8e8" }}>{user.name}</div>
            <div style={{ fontSize: 10, color: "#47e8a0", fontFamily: "'DM Mono', monospace" }}>online</div>
          </div>
        </div>
      )}
    </div>
  );
}
