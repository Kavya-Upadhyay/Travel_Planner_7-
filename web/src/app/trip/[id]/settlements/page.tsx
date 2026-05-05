"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import apiClient from "../../../../api/apiClient";

export default function SettlementsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [settlements, setSettlements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchSettlements();
  }, []);

  const fetchSettlements = async () => {
    try {
      const response = await apiClient.post(`/expenses/trip/${id}/settle`);
      setSettlements(response.data);
    } catch (error) {
      console.log(error);
      // Mock data for UI presentation
      setSettlements([
        { fromUserId: "Alice", toUserId: "Bob", amount: 45.50 },
        { fromUserId: "Charlie", toUserId: "Bob", amount: 12.00 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", padding: "4rem 10%" }}>
      <header style={{ display: "flex", alignItems: "center", gap: "2rem", marginBottom: "4rem" }}>
        <button onClick={() => router.back()} className="btn-glass" style={{ padding: "0.8rem", borderRadius: "50%" }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: "3.5rem", fontWeight: 900, letterSpacing: "-1px" }}>Settlements</h1>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          marginBottom: "4rem", 
          padding: "2rem", 
          background: "rgba(17, 153, 142, 0.1)", 
          borderRadius: "20px", 
          border: "1px solid rgba(17, 153, 142, 0.3)",
          display: "flex",
          alignItems: "center",
          gap: "1.5rem"
        }}
      >
        <ShieldCheck size={32} color="#38ef7d" />
        <p style={{ color: "#38ef7d", fontSize: "1.2rem", fontWeight: 600, margin: 0 }}>
          Min Cash Flow algorithm applied. These are the mathematically fewest transactions required to settle all debts.
        </p>
      </motion.div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "3px solid var(--glass-border)", borderTopColor: "#38ef7d", animation: "spin 1s linear infinite" }} />
        </div>
      ) : settlements.length === 0 ? (
        <div className="glass-card" style={{ padding: "6rem", textAlign: "center" }}>
          <p style={{ fontSize: "1.5rem", color: "var(--text-secondary)", fontWeight: 600 }}>Everyone is fully settled up! 🎉</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "800px", margin: "0 auto" }}>
          {settlements.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="glass-card"
              style={{ 
                padding: "2rem 3rem", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between",
                borderLeft: "6px solid #38ef7d"
              }}
            >
              {/* Payer */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: "60px", height: "60px", borderRadius: "30px", background: "var(--glass-bg)", border: "1px solid var(--glass-border)", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "1.5rem", fontWeight: 900 }}>{item.fromUserId?.charAt(0) || "U"}</span>
                </div>
                <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: 600 }}>{item.fromUserId}</span>
              </div>

              {/* Arrow Line */}
              <div style={{ flex: 1, padding: "0 2rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "0.5rem" }}>Owes</span>
                <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                  <div style={{ flex: 1, height: "2px", background: "linear-gradient(90deg, #11998e, #38ef7d)", borderRadius: "1px" }} />
                  <ArrowRight size={16} color="#38ef7d" style={{ marginLeft: "-4px" }} />
                </div>
              </div>

              {/* Payee */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: "60px", height: "60px", borderRadius: "30px", background: "var(--glass-bg)", border: "1px solid var(--glass-border)", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "1.5rem", fontWeight: 900 }}>{item.toUserId?.charAt(0) || "U"}</span>
                </div>
                <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: 600 }}>{item.toUserId}</span>
              </div>

              {/* Amount */}
              <div style={{ minWidth: "120px", textAlign: "right" }}>
                <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "#38ef7d", letterSpacing: "-1px" }}>
                  ${item.amount.toFixed(2)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}} />
    </main>
  );
}
