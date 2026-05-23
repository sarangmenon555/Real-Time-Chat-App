import { create } from "zustand";

const useChatStore = create((set, get) => ({
  user: null,
  token: null,
  channels: [],
  activeChannelId: null,
  messages: {},
  onlineUsers: {},
  typingUsers: {},
  connected: false,
  sidebarOpen: true,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setConnected: (connected) => set({ connected }),
  setSidebarOpen: (v) => set({ sidebarOpen: v }),

  setChannels: (channels) => set({ channels }),
  setActiveChannel: (id) => {
    set({ activeChannelId: id });
    set((state) => ({
      channels: state.channels.map((c) => (c._id === id ? { ...c, unread: 0 } : c)),
    }));
  },

  addChannel: (channel) => set((state) => ({ channels: [...state.channels, channel] })),

  setMessages: (channelId, messages) =>
    set((state) => ({ messages: { ...state.messages, [channelId]: messages } })),

  addMessage: (channelId, message) =>
    set((state) => {
      const existing = state.messages[channelId] || [];
      const isDupe = existing.some((m) => m._id === message._id);
      if (isDupe) return state;
      const updated = [...existing, message];
      let channels = state.channels;
      if (channelId !== state.activeChannelId) {
        channels = state.channels.map((c) =>
          c._id === channelId ? { ...c, unread: (c.unread || 0) + 1 } : c
        );
      }
      return { messages: { ...state.messages, [channelId]: updated }, channels };
    }),

  setOnlineUsers: (onlineUsers) => set({ onlineUsers }),

  setTyping: (channelId, userId, name, isTyping) =>
    set((state) => {
      const prev = state.typingUsers[channelId] || {};
      const updated = { ...prev };
      if (isTyping) updated[userId] = name;
      else delete updated[userId];
      return { typingUsers: { ...state.typingUsers, [channelId]: updated } };
    }),
}));

export default useChatStore;
