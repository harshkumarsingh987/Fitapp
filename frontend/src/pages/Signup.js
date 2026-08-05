import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  Divider,
} from "@mui/material";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import BrandPanel from "../components/BrandPanel";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/signup", form);
      loginWithToken(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create your account.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    try {
      const { data } = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });
      loginWithToken(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Google sign-in failed.");
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <BrandPanel />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          bgcolor: "background.default",
        }}
      >
        <Paper
          elevation={0}
          sx={{ width: "100%", maxWidth: 420, p: { xs: 3, sm: 5 }, border: "1px solid", borderColor: "divider" }}
        >
          <Typography variant="h4" sx={{ mb: 0.5 }}>
            Create your account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Start tracking in under a minute.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google sign-in failed.")}
              shape="pill"
              width="100%"
              text="signup_with"
            />
          </Box>

          <Divider sx={{ mb: 3, color: "text.secondary", fontSize: 13 }}>or sign up with email</Divider>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField name="name" label="Full name" value={form.name} onChange={handleChange} required fullWidth />
            <TextField
              name="email"
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              helperText="At least 6 characters"
              value={form.password}
              onChange={handleChange}
              required
              fullWidth
            />
            <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ mt: 1 }}>
              {loading ? "Creating account…" : "Create account"}
            </Button>
          </Box>

          <Typography variant="body2" sx={{ mt: 4, textAlign: "center", color: "text.secondary" }}>
            Already have an account?{" "}
            <Link component={RouterLink} to="/login" sx={{ fontWeight: 600 }}>
              Log in
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
