"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { ArrowRight, LogOut, Plus } from "lucide-react";
import apiClient from "../../api/apiClient";
import { logout } from "../../store/authSlice";

export default function DashboardPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      // Mocked if no backend running, but keeping real logic
      const response = await apiClient.get("/trips");
      setTrips(response.data);
    } catch (error) {
      console.log("Error fetching trips", error);
      // Fallback for visual demo if server is down:
      setTrips([
        { id: "1", title: "Euro Summer '26", destination: "Italy & France", startDate: "Jun 10", endDate: "Jun 24" },
        { id: "2", title: "Ski Trip", destination: "Swiss Alps", startDate: "Dec 15", endDate: "Dec 22" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    router.push("/");
  };

  return (
    <main style={{ minHeight: "100vh", padding: "4rem 10%" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4rem" }}>
        <h1 style={{ fontSize: "4rem", fontWeight: 900, letterSpacing: "-2px" }}>My Journeys</h1>
        <button onClick={handleLogout} className="btn-glass" style={{ gap: "0.5rem", padding: "0.5rem 1rem", borderColor: "rgba(255,0,0,0.3)", color: "#ff4d4d" }}>
          <LogOut size={18} />
          Logout
        </button>
      </header>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "5rem" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "3px solid var(--glass-border)", borderTopColor: "var(--accent-color)", animation: "spin 1s linear infinite" }} />
        </div>
      ) : trips.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "8rem" }}>
          <p style={{ fontSize: "1.5rem", color: "var(--text-secondary)" }}>You haven't planned any trips yet.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "2rem" }}>
          {trips.map((trip, idx) => (
            <motion.div 
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => router.push(`/trip/${trip.id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="glass-card" style={{ padding: "2rem", height: "100%", display: "flex", flexDirection: "column" }}>
                <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>{trip.title}</h2>
                <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)", marginBottom: "2rem", flexGrow: 1 }}>{trip.destination}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--accent-color)", fontWeight: 700 }}>{trip.startDate} - {trip.endDate}</span>
                  <ArrowRight style={{ color: "var(--accent-color)" }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Floating Action Button */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="btn-primary"
        style={{ position: "fixed", bottom: "3rem", right: "3rem", width: "70px", height: "70px", borderRadius: "35px", padding: 0, display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Plus size={32} />
      </motion.button>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}} />
    </main>
  );
}
