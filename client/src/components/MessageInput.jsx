import { useState, useRef, useCallback } from "react";
import { getSocket } from "../lib/socket";
import useTyping from "../hooks/useTyping";
import useChatStore from "../store/chatStore";
import api from "../lib/api";

export default function MessageInput() {
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  const { startTyping, stopTyping } = useTyping();
  const { activeChannelId, user, addMessage } = useChatStore();

  const send = useCallback(async () => {
    if (!text.trim() || !activeChannelId) return;
    const socket = getSocket();
    const payload = { channelId: activeChannelId, text: text.trim() };
    setText("");
    stopTyping();
    socket?.emit("message:send", payload, (ack) => {
      if (!ack?.ok) console.error("Send failed:", ack?.error);
    });
  }, [text, activeChannelId, stopTyping]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
    if (e.target.value) startTyping();
    else stopTyping();
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const { data } = await api.post("/upload", form, { headers: { "Content-Type": "multipart/form-data" } });
      const socket = getSocket();
      socket?.emit("message:send", {
        channelId: activeChannelId,
        text: "",
        mediaUrl: data.url,
        mediaType: data.mediaType,
      });
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const activeChannel = useChatStore((s) => s.channels.find((c) => c._id === s.activeChannelId));

  return (
    <div style={{ padding: "12px 16px 16px", borderTop: "1px solid #1a1a1a", flexShrink: 0 }}>
      <div style={{
        display: "flex", alignItems: "flex-end", gap: 10,
        background: "#111", border: "1px solid #222", borderRadius: 10, padding: "10px 12px",
      }}>
        <input
          ref={fileRef} type="file" accept="image/*,.pdf,.zip,.txt"
          style={{ display: "none" }} onChange={handleFileUpload}
        />
        <button
          onClick={() => fileRef.current?.click()}
          style={{
            background: "none", border: "1px solid #222", borderRadius: 6,
            color: "#555", cursor: "pointer", padding: "5px 10px",
            fontFamily: "'DM Mono', monospace", fontSize: 11,
            transition: "all 0.15s", flexShrink: 0,
          }}
        >
          {uploading ? "..." : "attach"}
        </button>
        <textarea
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={"Message #" + (activeChannel?.name || "...")}
          rows={1}
          style={{
            flex: 1, background: "none", border: "none", color: "#e8e8e8",
            fontSize: 14, fontFamily: "'DM Sans', sans-serif", resize: "none",
            outline: "none", lineHeight: 1.5, maxHeight: 120, overflowY: "auto",
            caretColor: "#e8c547",
          }}
        />
        <button
          onClick={send}
          disabled={!text.trim()}
          style={{
            background: text.trim() ? "#e8c54720" : "transparent",
            border: "1px solid " + (text.trim() ? "#e8c54766" : "#222"),
            borderRadius: 6, padding: "5px 14px",
            color: text.trim() ? "#e8c547" : "#333",
            fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 700,
            cursor: text.trim() ? "pointer" : "default", transition: "all 0.15s",
            letterSpacing: "0.04em", flexShrink: 0,
          }}
        >
          send
        </button>
      </div>
      <div style={{ fontSize: 10, color: "#333", fontFamily: "'DM Mono', monospace", marginTop: 6, paddingLeft: 2 }}>
        enter to send, shift+enter for newline
      </div>
    </div>
  );
}
