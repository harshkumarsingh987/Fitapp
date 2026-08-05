import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("pulse_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("pulse_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem("pulse_user", JSON.stringify(data.user));
      })
      .catch(() => {
        localStorage.removeItem("pulse_token");
        localStorage.removeItem("pulse_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const loginWithToken = (token, userData) => {
    localStorage.setItem("pulse_token", token);
    localStorage.setItem("pulse_user", JSON.stringify(userData));
    setUser(userData);
  };

  const updateUser = (userData) => {
    localStorage.setItem("pulse_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("pulse_token");
    localStorage.removeItem("pulse_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithToken, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
