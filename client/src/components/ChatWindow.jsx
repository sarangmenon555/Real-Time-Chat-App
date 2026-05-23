import { useEffect, useRef } from "react";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";
import MessageInput from "./MessageInput";
import useChatStore from "../store/chatStore";
import api from "../lib/api";

export default function ChatWindow({ onToggleSidebar }) {
  const { activeChannelId, channels, messages, setMessages, typingUsers, user, connected } = useChatStore();
  const endRef = useRef(null);

  const activeChannel = channels.find((c) => c._id === activeChannelId);
  const channelMessages = messages[activeChannelId] || [];
  const typing = Object.values(typingUsers[activeChannelId] || {});

  useEffect(() => {
    if (!activeChannelId) return;
    api.get("/messages/" + activeChannelId).then(({ data }) => {
      setMessages(activeChannelId, data);
    }).catch(console.error);
  }, [activeChannelId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [channelMessages, typing]);

  const grouped = channelMessages.map((msg, i) => {
    const prev = channelMessages[i - 1];
    return { ...msg, showAvatar: !prev || prev.userId !== msg.userId };
  });

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, height: "100vh" }}>
      <div style={{
        padding: "14px 20px", borderBottom: "1px solid #1a1a1a",
        display: "flex", alignItems: "center", gap: 12,
        background: "#0a0a0a", flexShrink: 0,
      }}>
        <button
          onClick={onToggleSidebar}
          style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", gap: 4, padding: 4,
          }}
        >
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ display: "block", width: 18, height: 1.5, background: "#555", borderRadius: 1 }} />
          ))}
        </button>
        <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, fontSize: 14, color: "#e8e8e8" }}>
          {activeChannel ? "# " + activeChannel.name : "Select a channel"}
        </span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
          <span className="connection-pulse" style={{
            width: 7, height: 7, borderRadius: "50%",
            background: connected ? "#47e8a0" : "#555", display: "inline-block",
          }} />
          <span style={{ fontSize: 11, color: "#555", fontFamily: "'DM Mono', monospace" }}>
            {connected ? "live" : "offline"}
          </span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", paddingTop: 12, paddingBottom: 4, display: "flex", flexDirection: "column", gap: 2 }}>
        {!activeChannelId && (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#333", fontFamily: "'DM Mono', monospace", fontSize: 13 }}>
              select a channel to start
            </span>
          </div>
        )}
        {grouped.map((msg) => (
          <div key={msg._id || msg.id} className="msg-enter">
            <Message msg={msg} isMe={msg.userId === user?.uid} showAvatar={msg.showAvatar} />
          </div>
        ))}
        <TypingIndicator names={typing} />
        <div ref={endRef} />
      </div>

      {activeChannelId && <MessageInput />}
    </div>
  );
}
