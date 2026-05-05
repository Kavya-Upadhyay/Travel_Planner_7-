"use client";

import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Vote } from "lucide-react";

export default function PollsPage() {
  const router = useRouter();
  
  return (
    <main style={{ minHeight: "100vh", padding: "4rem 10%" }}>
      <header style={{ display: "flex", alignItems: "center", gap: "2rem", marginBottom: "4rem" }}>
        <button onClick={() => router.back()} className="btn-glass" style={{ padding: "0.8rem", borderRadius: "50%" }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: "3.5rem", fontWeight: 900, letterSpacing: "-1px" }}>Polls</h1>
      </header>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card" 
        style={{ padding: "6rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem", borderLeft: "6px solid #ee0979" }}
      >
        <div style={{ padding: "2rem", background: "rgba(238, 9, 121, 0.1)", borderRadius: "50%" }}>
          <Vote size={64} color="#ee0979" />
        </div>
        <h2 style={{ fontSize: "2.5rem", fontWeight: 800 }}>Democratic Planning</h2>
        <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)", maxWidth: "600px" }}>
          Voting and democratic planning features are coming in the next update. Soon you'll be able to vote on destinations, activities, and dining options with your group.
        </p>
      </motion.div>
    </main>
  );
}
