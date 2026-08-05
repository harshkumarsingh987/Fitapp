import { useState, useRef, useEffect } from "react";
import { Box, Typography, TextField, IconButton, Paper, Avatar, CircularProgress } from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function AICoach() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: `Hi ${user?.name?.split(" ")[0] || ""}! I'm your AI coach. Ask me about your workouts, nutrition, or recovery — or just say hi for a tip.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const question = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setLoading(true);
    try {
      const { data } = await api.post("/ai/coach", { question });
      setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Something went wrong reaching the AI coach. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - 140px)" }}>
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        AI Coach
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Personalized guidance based on your goals and recent activity.
      </Typography>

      <Box sx={{ flexGrow: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2, pr: 1 }}>
        {messages.map((m, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              gap: 1.5,
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              flexDirection: m.role === "user" ? "row-reverse" : "row",
              maxWidth: "75%",
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: m.role === "user" ? "#4C6FFF" : "#00C896",
              }}
            >
              {m.role === "user" ? user?.name?.[0]?.toUpperCase() : <AutoAwesomeRoundedIcon fontSize="small" />}
            </Avatar>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: m.role === "user" ? "#4C6FFF" : "#fff",
                color: m.role === "user" ? "#fff" : "text.primary",
                border: m.role === "user" ? "none" : "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="body2" sx={{ lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {m.text}
              </Typography>
            </Paper>
          </Box>
        ))}
        {loading && (
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: "#00C896" }}>
              <AutoAwesomeRoundedIcon fontSize="small" />
            </Avatar>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
              <CircularProgress size={16} sx={{ color: "#00C896" }} />
            </Paper>
          </Box>
        )}
        <div ref={bottomRef} />
      </Box>

      <Box sx={{ display: "flex", gap: 1.5, mt: 2 }}>
        <TextField
          fullWidth
          placeholder="Ask your coach anything…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          size="medium"
        />
        <IconButton
          onClick={handleSend}
          disabled={loading || !input.trim()}
          sx={{ bgcolor: "#00C896", color: "#fff", "&:hover": { bgcolor: "#00A67D" }, width: 48, height: 48 }}
        >
          <SendRoundedIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
