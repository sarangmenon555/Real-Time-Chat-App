"use client";
import { useEffect, useState } from "react";
import useChatStore from "../store/chatStore";
import useSocket from "../hooks/useSocket";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import LoginScreen from "../components/LoginScreen";
import api from "../lib/api";

export default function Home() {
  const { user, token, setToken, setUser, setChannels, setActiveChannel, sidebarOpen, setSidebarOpen } = useChatStore();
  const [booting, setBooting] = useState(true);

  useSocket();

  useEffect(() => {
    const stored = localStorage.getItem("relay_token");
    if (stored) {
      setToken(stored);
      api.get("/auth/me")
        .then(({ data }) => setUser(data))
        .catch(() => { localStorage.removeItem("relay_token"); setToken(null); })
        .finally(() => setBooting(false));
    } else {
      setBooting(false);
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    api.get("/channels").then(({ data }) => {
      setChannels(data);
      if (data.length > 0) setActiveChannel(data[0]._id);
    }).catch(console.error);
  }, [token]);

  if (booting) {
    return (
      <div style={{ height: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "#333", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>loading...</span>
      </div>
    );
  }

  if (!user) return <LoginScreen />;

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0a0a0a", overflow: "hidden" }}>
      {sidebarOpen && <Sidebar />}
      <ChatWindow onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
    </div>
  );
}
