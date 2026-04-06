import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const SSO_LOGIN_URL = "http://localhost:8001/login";
const SSO_LOGOUT_URL = "http://localhost:8001/logout";
const TOKEN_URL = "http://localhost:8001/api/auth/token/";
const PROFILE_URL = "http://localhost:8001/api/auth/me/";
const CLIENT_ID = "client_vobl3vosnsfkaaan6vxkhcpz";
const CLIENT_SECRET =
  "Oa83m3VJGjiQxM81r3Z_oKc8AbBfPxroDFXiXvQWKEl_QLGdygG49ar7NCcOdtjx";
const REDIRECT_URI = "https://brainwavesai.netlify.app/login";

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

  const redirectToSSO = () => {
    window.location.href = `${SSO_LOGIN_URL}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
  };

  const exchangeCode = async (code) => {
    const response = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    });

    if (!response.ok) {
      throw new Error("Token exchange failed");
    }

    const data = await response.json();
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

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = SSO_LOGOUT_URL;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, redirectToSSO, exchangeCode, fetchProfile, logout }}
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
