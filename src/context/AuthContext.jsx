import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API_BASE = "http://localhost:8001";
const LOGIN_URL = `${API_BASE}/api/auth/login/`;
const PROFILE_URL = `${API_BASE}/api/auth/me/`;
const LOGOUT_URL = `${API_BASE}/api/auth/logout/`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("user");

    if (accessToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const response = await fetch(LOGIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.detail || data?.error || "Login failed");
    }

    const data = await response.json();

    if (data.requires_2fa) {
      return { requires_2fa: true, session_token: data.session_token };
    }

    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);

    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
    } else {
      await fetchProfile(data.access);
    }

    return data;
  };

  const fetchProfile = async (token) => {
    const accessToken = token || localStorage.getItem("access_token");
    if (!accessToken) return null;

    const response = await fetch(PROFILE_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    const profile = await response.json();
    localStorage.setItem("user", JSON.stringify(profile));
    setUser(profile);
    return profile;
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    const accessToken = localStorage.getItem("access_token");

    // Call server logout to blacklist the token
    if (refreshToken && accessToken) {
      try {
        await fetch(LOGOUT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });
      } catch {
        // Continue with local cleanup even if server logout fails
      }
    }

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, fetchProfile, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
