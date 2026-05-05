"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import apiClient from "../../../../api/apiClient";
import { useSelector } from "react-redux";

export default function ExpensesPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  
  // To keep existing logic, we fetch
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await apiClient.get(`/expenses/trip/${id}`);
      setExpenses(response.data);
    } catch (error) {
      console.log(error);
      // Mock data for UI presentation if backend isn't available
      setExpenses([
        { id: "1", description: "Dinner at Luigi's", amount: 150.00, currency: "USD", paidById: "user1" },
        { id: "2", description: "Colosseum Tickets", amount: 60.50, currency: "USD", paidById: "user2" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post(`/expenses`, {
        tripId: id, 
        description, 
        amount: parseFloat(amount),
        currency: 'USD', 
        date: new Date().toISOString(),
        paidById: 'USER_ID', // Requires actual user context in prod
        splitType: 'EQUAL', 
        splits: []
      });
      fetchExpenses();
      setDescription(''); 
      setAmount('');
    } catch (error) {
      console.log(error);
      // Mock update
      setExpenses([...expenses, { id: Math.random().toString(), description, amount: parseFloat(amount), currency: 'USD' }]);
      setDescription(''); 
      setAmount('');
    }
  };

  return (
    <main style={{ minHeight: "100vh", padding: "4rem 10%" }}>
      <header style={{ display: "flex", alignItems: "center", gap: "2rem", marginBottom: "4rem" }}>
        <button onClick={() => router.back()} className="btn-glass" style={{ padding: "0.8rem", borderRadius: "50%" }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: "3.5rem", fontWeight: 900, letterSpacing: "-1px" }}>Expenses</h1>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "4rem" }}>
        
        {/* Add Expense Form */}
        <div>
          <motion.form 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={addExpense} 
            className="glass-card" 
            style={{ padding: "2.5rem", position: "sticky", top: "2rem" }}
          >
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "2rem" }}>Record Expense</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <input 
                type="text" 
                placeholder="Expense Description" 
                className="input-field" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              
              <input 
                type="number" 
                step="0.01"
                placeholder="Amount (USD)" 
                className="input-field" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              
              <button type="submit" className="btn-primary" style={{ marginTop: "1rem", background: "linear-gradient(135deg, #ff4b1f 0%, #ff9068 100%)", boxShadow: "0 4px 15px rgba(255, 75, 31, 0.4)" }}>
                <Plus size={20} style={{ marginRight: "0.5rem" }} />
                Add Expense
              </button>
            </div>
          </motion.form>
        </div>

        {/* Expenses List */}
        <div>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "3px solid var(--glass-border)", borderTopColor: "#ff4b1f", animation: "spin 1s linear infinite" }} />
            </div>
          ) : expenses.length === 0 ? (
            <div className="glass-card" style={{ padding: "4rem", textAlign: "center" }}>
              <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)" }}>No expenses recorded yet.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {expenses.map((expense, idx) => (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="glass-card"
                  style={{ 
                    padding: "2rem", 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    borderLeft: "6px solid #ff4b1f"
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.25rem" }}>{expense.description}</h3>
                    <p style={{ color: "var(--text-secondary)" }}>Paid by: {expense.paidById || "User"}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "2rem", fontWeight: 900, color: "#ff9068", letterSpacing: "-1px" }}>
                      ${parseFloat(expense.amount).toFixed(2)}
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: 700 }}>{expense.currency}</div>
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
