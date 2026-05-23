import { useEffect, useRef } from "react";
import { connectSocket, disconnectSocket } from "../lib/socket";
import useChatStore from "../store/chatStore";

export default function useSocket() {
  const token = useChatStore((s) => s.token);
  const activeChannelId = useChatStore((s) => s.activeChannelId);
  const { setConnected, addMessage, setOnlineUsers, setTyping } = useChatStore();
  const prevChannelRef = useRef(null);

  useEffect(() => {
    if (!token) return;
    const socket = connectSocket(token);

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("message:new", (msg) => addMessage(msg.channelId, msg));
    socket.on("presence:update", (users) => setOnlineUsers(users));
    socket.on("typing:update", ({ userId, name, typing, channelId }) => {
      if (channelId) setTyping(channelId, userId, name, typing);
    });

    return () => {
      disconnectSocket();
      setConnected(false);
    };
  }, [token]);

  useEffect(() => {
    const socket = connectSocket(token);
    if (!socket || !activeChannelId) return;
    if (prevChannelRef.current && prevChannelRef.current !== activeChannelId) {
      socket.emit("channel:leave", prevChannelRef.current);
    }
    socket.emit("channel:join", activeChannelId);
    prevChannelRef.current = activeChannelId;
  }, [activeChannelId, token]);

  return null;
}
