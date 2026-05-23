import { useState } from "react";
import api from "../lib/api";
import useChatStore from "../store/chatStore";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser, setToken } = useChatStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) { setError("Email and name required"); return; }
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, name });
      localStorage.setItem("relay_token", data.token);
      setToken(data.token);
      setUser(data.user);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: "100vh", background: "#0a0a0a", display: "flex",
      alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        width: 380, padding: 40, border: "1px solid #1a1a1a",
        borderRadius: 12, background: "#0e0e0e",
      }}>
        <div style={{
          fontFamily: "'DM Mono', monospace", fontWeight: 700,
          fontSize: 22, color: "#e8c547", letterSpacing: "0.1em",
          textTransform: "uppercase", marginBottom: 8,
        }}>
          Relay
        </div>
        <div style={{ fontSize: 13, color: "#555", fontFamily: "'DM Mono', monospace", marginBottom: 32 }}>
          real-time messaging
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input
            value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Display name"
            style={{
              background: "#111", border: "1px solid #222", borderRadius: 8,
              padding: "11px 14px", color: "#e8e8e8", fontSize: 14,
              fontFamily: "'DM Sans', sans-serif", outline: "none",
            }}
          />
          <input
            value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address" type="email"
            style={{
              background: "#111", border: "1px solid #222", borderRadius: 8,
              padding: "11px 14px", color: "#e8e8e8", fontSize: 14,
              fontFamily: "'DM Sans', sans-serif", outline: "none",
            }}
          />
          {error && (
            <span style={{ fontSize: 12, color: "#e84747", fontFamily: "'DM Mono', monospace" }}>
              {error}
            </span>
          )}
          <button
            type="submit" disabled={loading}
            style={{
              background: "#e8c54720", border: "1px solid #e8c54766",
              borderRadius: 8, padding: "11px 14px", color: "#e8c547",
              fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 700,
              cursor: loading ? "default" : "pointer", letterSpacing: "0.06em",
              textTransform: "uppercase", transition: "all 0.15s",
            }}
          >
            {loading ? "connecting..." : "join relay"}
          </button>
        </form>
      </div>
    </div>
  );
}
