"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import apiClient from "../../api/apiClient";
import { setCredentials } from "../../store/authSlice";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  const router = useRouter();
  const dispatch = useDispatch();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin ? { email, password } : { email, password, fullName };
      
      const response = await apiClient.post(endpoint, payload);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      dispatch(setCredentials({ user, token }));
      
      router.push("/dashboard");
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || "Authentication failed. Please try again.");
    }
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "2rem" }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5 }}
        className="glass-card"
        style={{ width: "100%", maxWidth: "500px", padding: "3rem" }}
      >
        <h1 style={{ fontSize: "3rem", fontWeight: 900, letterSpacing: "-1px", marginBottom: "0.5rem" }}>
          {isLogin ? "Welcome Back" : "Join Us"}
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2.5rem", fontSize: "1.1rem" }}>
          {isLogin ? "Log in to continue your journey" : "Create an account to start planning"}
        </p>
        
        {errorMsg && (
          <div style={{ padding: "1rem", background: "rgba(255,0,0,0.1)", border: "1px solid rgba(255,0,0,0.3)", borderRadius: "8px", color: "#ff4d4d", marginBottom: "1.5rem" }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {!isLogin && (
            <input 
              type="text" 
              placeholder="Full Name" 
              className="input-field" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required={!isLogin}
            />
          )}
          
          <input 
            type="email" 
            placeholder="Email Address" 
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <input 
            type="password" 
            placeholder="Password" 
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button type="submit" className="btn-primary" style={{ marginTop: "1rem", width: "100%" }}>
            {isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>
        
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <button onClick={() => setIsLogin(!isLogin)} style={{ color: "var(--text-secondary)", fontSize: "1rem", fontWeight: 500 }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span style={{ color: "var(--accent-color)", fontWeight: 800 }}>
              {isLogin ? "Sign Up" : "Log In"}
            </span>
          </button>
        </div>
      </motion.div>
    </main>
  );
}
