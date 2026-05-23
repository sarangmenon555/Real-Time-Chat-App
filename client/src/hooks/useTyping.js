import { useRef, useCallback } from "react";
import { getSocket } from "../lib/socket";
import useChatStore from "../store/chatStore";

export default function useTyping() {
  const activeChannelId = useChatStore((s) => s.activeChannelId);
  const isTypingRef = useRef(false);
  const timeoutRef = useRef(null);

  const startTyping = useCallback(() => {
    const socket = getSocket();
    if (!socket || !activeChannelId) return;
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socket.emit("typing:start", { channelId: activeChannelId });
    }
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      socket.emit("typing:stop", { channelId: activeChannelId });
    }, 2000);
  }, [activeChannelId]);

  const stopTyping = useCallback(() => {
    const socket = getSocket();
    if (!socket || !activeChannelId) return;
    clearTimeout(timeoutRef.current);
    isTypingRef.current = false;
    socket.emit("typing:stop", { channelId: activeChannelId });
  }, [activeChannelId]);

  return { startTyping, stopTyping };
}
