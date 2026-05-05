"use client";

import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Clock, DollarSign, Scale, Vote } from "lucide-react";

export default function TripHubPage() {
  const router = useRouter();
  const { id } = useParams();

  const hubs = [
    { id: "itinerary", title: "Itinerary", desc: "Plan your timeline", icon: <Clock size={40} />, color: "linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)" },
    { id: "expenses", title: "Expenses", desc: "Track group spending", icon: <DollarSign size={40} />, color: "linear-gradient(135deg, #ff4b1f 0%, #ff9068 100%)" },
    { id: "settlements", title: "Settlements", desc: "Algorithm optimized", icon: <Scale size={40} />, color: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" },
    { id: "polls", title: "Polls", desc: "Vote on destinations", icon: <Vote size={40} />, color: "linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)" },
  ];

  return (
    <main style={{ minHeight: "100vh", padding: "4rem 10%" }}>
      <header style={{ display: "flex", alignItems: "center", gap: "2rem", marginBottom: "4rem" }}>
        <button onClick={() => router.back()} className="btn-glass" style={{ padding: "0.8rem", borderRadius: "50%" }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: "3.5rem", fontWeight: 900, letterSpacing: "-1px" }}>Trip Hub</h1>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
        {hubs.map((hub, idx) => (
          <motion.div
            key={hub.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            whileHover={{ y: -10, scale: 1.02 }}
            onClick={() => router.push(`/trip/${id}/${hub.id}`)}
            style={{ 
              background: hub.color, 
              borderRadius: "24px", 
              padding: "3rem", 
              cursor: "pointer", 
              boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              border: "1px solid rgba(255,255,255,0.2)"
            }}
          >
            <div style={{ marginBottom: "1.5rem", background: "rgba(255,255,255,0.2)", padding: "1.5rem", borderRadius: "50%" }}>
              {hub.icon}
            </div>
            <h2 style={{ fontSize: "2rem", fontWeight: 900, marginBottom: "0.5rem" }}>{hub.title}</h2>
            <p style={{ fontSize: "1.1rem", fontWeight: 500, color: "rgba(255,255,255,0.8)" }}>{hub.desc}</p>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
