import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/api';
import { useLocation } from 'react-router-dom';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));   // ⬅ moved to localStorage
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(localStorage.getItem("token")); // ⬅ moved to localStorage
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const location = useLocation();

  // ----------------------------------------------------
  // Persist token + user in LOCALSTORAGE (fix logout)
  // ----------------------------------------------------
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // ----------------------------------------------------
  // Verify token — but SKIP on payment success page
  // ----------------------------------------------------
  useEffect(() => {
    const verify = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      // ⛔ STOP AUTH CHECK on payment-success
      if (location.pathname === "/payment-success") {
        console.log("⛔ Auth check skipped on /payment-success");
        setInitializing(false);
        return;
      }

      if (storedToken && storedUser) {
        try {
          api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
          const { data } = await api.get("/auth/me");

          setUser(data.user);
          setToken(storedToken);
        } catch (err) {
          console.warn("Token invalid:", err);
          logout();
        }
      }

      setInitializing(false);
    };

    verify();
  }, [location.pathname]);

  // ----------------------------------------------------
  // AUTH FUNCTIONS
  // ----------------------------------------------------
  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });

      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      setToken(data.token);
      setUser(data.user);

      setLoading(false);
      return {
        ok: true,
        user: data.user,
        message: `Welcome back, ${data.user.name}! 🎉`,
      };
    } catch (err) {
      setLoading(false);
      return {
        ok: false,
        error: err.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", payload);

      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      setToken(data.token);
      setUser(data.user);

      setLoading(false);
      return {
        ok: true,
        user: data.user,
        message: `Welcome to PetAdopt, ${data.user.name}! 🐾`,
      };
    } catch (err) {
      setLoading(false);
      return {
        ok: false,
        error: err.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
  };

  const updateUser = async (updates) => {
    setLoading(true);
    try {
      const { data } = await api.put("/auth/profile", updates);
      setUser(data.user);
      setLoading(false);
      return {
        ok: true,
        user: data.user,
        message: "Profile updated successfully! ✨",
      };
    } catch (err) {
      setLoading(false);
      return {
        ok: false,
        error: err.response?.data?.message || "Failed to update profile",
      };
    }
  };

  const refreshUser = async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
      return { ok: true, user: data.user };
    } catch (err) {
      return { ok: false, error: err.response?.data?.message };
    }
  };

  // ----------------------------------------------------
  // CONTEXT VALUE
  // ----------------------------------------------------
  const value = {
    user,
    token,
    loading,
    initializing,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
    setUser,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === "admin",
    isOwner: user?.role === "owner",
    isUser: user?.role === "user",
  };

  // ----------------------------------------------------
  // INITIAL LOADING UI
  // ----------------------------------------------------
  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
        <div className="text-center text-xl font-bold text-purple-600">
          Loading PetAdopt…
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
