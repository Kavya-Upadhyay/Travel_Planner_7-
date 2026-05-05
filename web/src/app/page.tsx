"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  const fadeUp: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <main>
      {/* Navbar */}
      <nav style={{ padding: "2rem 4rem", display: "flex", justifyContent: "space-between", alignItems: "center", position: "fixed", width: "100%", zIndex: 100, backdropFilter: "blur(10px)", background: "rgba(10, 10, 12, 0.5)" }}>
        <div style={{ fontSize: "1.75rem", fontWeight: 900, letterSpacing: "-1px" }}>
          TimeToSplit
        </div>
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <Link href="#features" style={{ fontWeight: 600, color: "var(--text-secondary)" }}>Features</Link>
          <Link href="/auth" className="btn-glass" style={{ padding: "0.5rem 1.5rem" }}>Log in</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 10%" }}>
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <h1 style={{ fontSize: "8rem", fontWeight: 900, lineHeight: 1, letterSpacing: "-3px", marginBottom: "1rem" }}>
            Your journey.
          </h1>
        </motion.div>
        
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }}>
          <h1 className="highlight-text" style={{ fontSize: "8rem", fontWeight: 900, lineHeight: 1, letterSpacing: "-3px", marginBottom: "2rem" }}>
            Perfectly synced.
          </h1>
        </motion.div>
        
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.4 }}>
          <p style={{ fontSize: "1.5rem", color: "var(--text-secondary)", maxWidth: "600px", lineHeight: 1.6, marginBottom: "3rem" }}>
            Experience visually stunning trip planning. Track itineraries, vote on plans, and settle debts instantly with breathtaking algorithmic precision.
          </p>
        </motion.div>
        
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.6 }}>
          <button className="btn-primary" onClick={() => router.push("/auth")}>
            Start Exploring
          </button>
        </motion.div>
      </section>

      {/* Graphic Section */}
      <section style={{ padding: "0 10%", marginBottom: "8rem" }}>
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }} 
          variants={fadeUp}
          className="glass-card"
          style={{ width: "100%", height: "600px", display: "flex", justifyContent: "center", alignItems: "center", position: "relative", overflow: "hidden" }}
        >
          <div style={{ position: "absolute", top: "-50%", left: "-50%", width: "200%", height: "200%", background: "radial-gradient(circle, rgba(245, 175, 25, 0.1) 0%, transparent 60%)", animation: "spin 20s linear infinite" }} />
          <h2 style={{ fontSize: "2rem", fontWeight: 800, zIndex: 1 }}>Stunning Visual Dashboard</h2>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section style={{ display: "flex", justifyContent: "space-around", padding: "6rem 10%", background: "rgba(0,0,0,0.3)", backdropFilter: "blur(20px)", marginBottom: "8rem", borderTop: "1px solid var(--glass-border)", borderBottom: "1px solid var(--glass-border)" }}>
        {[
          { num: "1.2M+", label: "Trips Organized" },
          { num: "$40M+", label: "Debts Settled" },
          { num: "O(N log N)", label: "Min Cash Flow Engine" }
        ].map((stat, idx) => (
          <motion.div 
            key={idx} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: idx * 0.2 } } }}
            style={{ textAlign: "center" }}
          >
            <div className="gradient-text" style={{ fontSize: "5rem", fontWeight: 900, letterSpacing: "-2px", marginBottom: "1rem" }}>{stat.num}</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--text-secondary)" }}>{stat.label}</div>
          </motion.div>
        ))}
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: "0 10%", marginBottom: "10rem" }}>
        <motion.h2 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }} 
          variants={fadeUp}
          style={{ fontSize: "4.5rem", fontWeight: 900, letterSpacing: "-2px", marginBottom: "4rem" }}
        >
          Engineered for excellence.
        </motion.h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          {[
            { title: "Real-time sync", desc: "Collaborate on itineraries instantly with WebSockets. Drag and drop days." },
            { title: "Min-Cash Flow", desc: "A greedy algorithm ensures your group makes the absolute minimum number of transactions." },
            { title: "Smart Vault", desc: "Keep passports and bookings securely in one centralized digital space." },
            { title: "Democratic Planning", desc: "Vote on destinations and activities with our built-in polling engine." }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: idx * 0.1 } } }}
              className="glass-card"
              style={{ padding: "3rem" }}
            >
              <h3 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1rem" }}>{feature.title}</h3>
              <p style={{ fontSize: "1.125rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "4rem 10%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--glass-border)" }}>
        <div style={{ fontSize: "1.5rem", fontWeight: 900 }}>TimeToSplit</div>
        <div style={{ color: "var(--text-secondary)" }}>© 2026 TimeToSplit. Built with precision.</div>
        <div style={{ display: "flex", gap: "2rem" }}>
          <Link href="#" style={{ fontWeight: 600 }}>Privacy</Link>
          <Link href="#" style={{ fontWeight: 600 }}>Terms</Link>
        </div>
      </footer>
    </main>
  );
}
