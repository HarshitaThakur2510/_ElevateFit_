import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();

  // -------------------------
  // Session Check (same as customer)
  // -------------------------
  const [session, setSession] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("session") || "null");
    setSession(stored);

    if (!stored || stored.role !== "admin") {
      navigate("/welcome");
    }
  }, [navigate]);

  // -------------------------
  // Carousel slides
  // -------------------------
  const slides = [
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
    "https://images.unsplash.com/photo-1594737625785-c4c970f1b866",
    "https://images.unsplash.com/photo-1576678927484-cc907957088c"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Start carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // -------------------------
  // Navigation Functions
  // -------------------------
  const openMembers = () => navigate("/members");
  const openWallet = () => navigate("/wallet");
  const openContacts = () => navigate("/contact");

  const logout = () => {
    localStorage.removeItem("session");
    navigate("/welcome");
  };

  if (!session) return null;

  return (
    <div>

      {/* KEEPING ALL ORIGINAL CSS EXACTLY SAME */}
      <style>{`
        :root {
          --page-bg: #111827;
          --card-bg: #1f2937;
          --accent: #f97316;
          --accent-hover: #ea580c;
          --text: #ffffff;
          --muted: #d1d5db;
        }

        body {
          margin: 0;
          font-family: 'Poppins', sans-serif;
          background: var(--page-bg);
          color: var(--text);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        header {
          background: var(--card-bg);
          padding: 1rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        header h1 {
          font-size: 1.4rem;
          color: var(--accent);
        }

        nav a {
          color: var(--muted);
          text-decoration: none;
          font-weight: 600;
          margin-left: 1rem;
          cursor: pointer;
        }

        nav a:hover { color: var(--accent); }

        main {
          flex: 1;
          padding: 2rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.5rem;
        }

        .card {
          background: var(--card-bg);
          padding: 1.5rem;
          border-radius: 12px;
          text-align: center;
          border: 1px solid rgba(255,255,255,0.05);
          box-shadow: 0 8px 20px rgba(0,0,0,0.4);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.5);
        }

        .card h2 {
          color: var(--accent);
          margin-bottom: 0.5rem;
        }

        .card p {
          color: var(--muted);
          font-size: 0.95rem;
          margin-bottom: 1rem;
        }

        .card button {
          background: var(--accent);
          border: none;
          color: #fff;
          padding: 0.6rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
        }

        .card button:hover {
          background: var(--accent-hover);
          transform: scale(1.05);
        }

        .carousel {
          grid-column: 1 / -1;
          position: relative;
          height: 200px;
          margin-bottom: 1rem;
          overflow: hidden;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .slide {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 1s ease;
          background-size: cover;
          background-position: center;
        }

        .slide.active { opacity: 1; }

        footer {
          text-align: center;
          padding: 1rem;
          color: var(--muted);
          font-size: 0.9rem;
          background: var(--card-bg);
          border-top: 1px solid rgba(255,255,255,0.1);
        }
      `}</style>

      {/* HEADER */}
      <header>
        <h1>ElevateFit Admin</h1>
        <nav>
          <a onClick={() => navigate("/")}>Home</a>
          <a onClick={logout}>Logout</a>
        </nav>
      </header>

      {/* MAIN */}
      <main>

        {/* CAROUSEL */}
        <div className="carousel">
          {slides.map((src, i) => (
            <div
              key={i}
              className={`slide ${i === currentIndex ? "active" : ""}`}
              style={{ backgroundImage: `url(${src})` }}
            ></div>
          ))}
        </div>

        {/* CARDS */}
        <div className="card">
          <h2>Manage Members</h2>
          <p>View or Edit registered members.</p>
          <button onClick={openMembers}>Show Members</button>
        </div>

        <div className="card">
          <h2>Wallet</h2>
          <p>Track gym revenue and transactions.</p>
          <button onClick={openWallet}>View Wallet</button>
        </div>

        <div className="card">
          <h2>Customer Feedbacks</h2>
          <p>View customers who reached out</p>
          <button onClick={openContacts}>View Contacts</button>
        </div>

      </main>

      {/* FOOTER */}
      <footer>© 2025 ElevateFit Admin Dashboard</footer>
    </div>
  );
}
