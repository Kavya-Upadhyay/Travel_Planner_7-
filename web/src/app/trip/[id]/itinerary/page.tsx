"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, Clock } from "lucide-react";
import apiClient from "../../../../api/apiClient";

export default function ItineraryPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  
  useEffect(() => {
    fetchItinerary();
  }, []);

  const fetchItinerary = async () => {
    try {
      const response = await apiClient.get(`/itinerary/trip/${id}`);
      setActivities(response.data);
    } catch (error) {
      console.log(error);
      // Mock data
      setActivities([
        { id: "1", title: "Flight to Rome", description: "Terminal 2, Flight AZ123", startTime: "2026-06-10T10:00:00" },
        { id: "2", title: "Check-in Hotel", description: "Grand Hotel Plaza", startTime: "2026-06-10T14:30:00" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const addActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post(`/itinerary/trip/${id}`, {
        title, description, startTime, endTime: startTime
      });
      fetchItinerary();
      setTitle(""); setDescription(""); setStartTime("");
    } catch (error) {
      console.log(error);
      setActivities([...activities, { id: Math.random().toString(), title, description, startTime }]);
      setTitle(""); setDescription(""); setStartTime("");
    }
  };

  return (
    <main style={{ minHeight: "100vh", padding: "4rem 10%" }}>
      <header style={{ display: "flex", alignItems: "center", gap: "2rem", marginBottom: "4rem" }}>
        <button onClick={() => router.back()} className="btn-glass" style={{ padding: "0.8rem", borderRadius: "50%" }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: "3.5rem", fontWeight: 900, letterSpacing: "-1px" }}>Itinerary</h1>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "4rem" }}>
        
        {/* Add Activity Form */}
        <div>
          <motion.form 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={addActivity} 
            className="glass-card" 
            style={{ padding: "2.5rem", position: "sticky", top: "2rem" }}
          >
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "2rem" }}>New Activity</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <input 
                type="text" 
                placeholder="Activity Title" 
                className="input-field" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              
              <input 
                type="text" 
                placeholder="Description" 
                className="input-field" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              
              <input 
                type="datetime-local" 
                className="input-field" 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
              
              <button type="submit" className="btn-primary" style={{ marginTop: "1rem", background: "linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)", boxShadow: "0 4px 15px rgba(142, 45, 226, 0.4)" }}>
                <Plus size={20} style={{ marginRight: "0.5rem" }} />
                Add Activity
              </button>
            </div>
          </motion.form>
        </div>

        {/* Itinerary Timeline */}
        <div>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "3px solid var(--glass-border)", borderTopColor: "#8E2DE2", animation: "spin 1s linear infinite" }} />
            </div>
          ) : activities.length === 0 ? (
            <div className="glass-card" style={{ padding: "4rem", textAlign: "center" }}>
              <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)" }}>Your itinerary is empty.</p>
            </div>
          ) : (
            <div style={{ position: "relative", paddingLeft: "2rem", borderLeft: "2px dashed rgba(255,255,255,0.1)" }}>
              {activities.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()).map((activity, idx) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  style={{ position: "relative", marginBottom: "3rem" }}
                >
                  <div style={{ 
                    position: "absolute", left: "-2.6rem", top: "0", 
                    width: "20px", height: "20px", borderRadius: "50%", 
                    background: "#8E2DE2", border: "4px solid var(--bg-dark)" 
                  }} />
                  <div className="glass-card" style={{ padding: "2rem", borderTop: "4px solid #8E2DE2" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#00c6ff", fontWeight: 800, marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                      <Clock size={16} />
                      {new Date(activity.startTime).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <h3 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>{activity.title}</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", lineHeight: 1.5 }}>{activity.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}} />
    </main>
  );
}
