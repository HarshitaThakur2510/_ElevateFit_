import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Customer() {
  const navigate = useNavigate();

  // -------------------------
  // Session Check
  // -------------------------
  const [session, setSession] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("session") || "null");
    setSession(stored);

    if (!stored || stored.role !== "user") {
      navigate("/welcome");
    }
  }, [navigate]);

  // -------------------------
  // Carousel Logic
  // -------------------------
  const slides = [
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
    "https://images.unsplash.com/photo-1594737625785-c4c970f1b866",
    "https://images.unsplash.com/photo-1576678927484-cc907957088c"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // -------------------------
  // Navigation Buttons
  // -------------------------
  const openPage = (url) => {
    navigate(url);
  };

  const logout = () => {
    localStorage.removeItem("session");
    navigate("/welcome");
  };

  if (!session) return null; // prevent flashing

  return (
    <div>

      {/* ALL ORIGINAL CSS KEPT EXACTLY AS IT IS */}
      <style>{`
        :root {
          --page-bg: #111827;
          --card-bg: #1f2937;
          --button-bg: #f97316;
          --button-hover: #ea580c;
          --text: #ffffff;
          --muted: #d1d5db;
        }

        * { box-sizing: border-box; font-family: 'Poppins', Arial, sans-serif; margin:0; padding:0; }

        body {
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
          color: var(--text);
        }

        nav a {
          color: var(--muted);
          text-decoration: none;
          font-weight: 600;
          margin-left: 1rem;
          cursor: pointer;
        }

        nav a:hover {
          color: var(--button-bg);
        }

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
          position: relative;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .card:hover {
          transform: translateY(-6px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.4);
        }

        .card h2 {
          color: var(--text);
          margin-bottom: 0.5rem;
        }

        .card p {
          color: var(--muted);
          font-size: 0.95rem;
          margin-bottom: 1rem;
        }

        .card button {
          background: var(--button-bg);
          border: none;
          color: #fff;
          padding: 0.6rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.3s;
        }

        .card button:hover {
          background: var(--button-hover);
        }

        .carousel {
          grid-column: 1 / -1;
          position: relative;
          height: 200px;
          margin-bottom: 1rem;
          overflow: hidden;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.03);
        }

        .slide {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 1s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          background-size: cover;
          background-position: center;
        }

        .slide.active {
          opacity: 1;
        }

        footer {
          text-align: center;
          padding: 1rem;
          color: var(--muted);
          font-size: 0.9rem;
          background: var(--card-bg);
          border-top: 1px solid rgba(255,255,255,0.1);
        }
      `}</style>

      {/* ---------------- HEADER ---------------- */}
      <header>
        <h1>Welcome, {session.name}</h1>
        <nav>
          <a onClick={() => navigate("/")}>Home</a>
          <a onClick={logout}>Logout</a>
        </nav>
      </header>

      {/* ---------------- MAIN CONTENT ---------------- */}
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
          <h2>Profile</h2>
          <p>View and update your personal details and gym info.</p>
          <button onClick={() => openPage("/profile")}>Open Profile</button>
        </div>

        <div className="card">
          <h2>Membership</h2>
          <p>Check your active plans, renewals, and offers.</p>
          <button onClick={() => openPage("/membership")}>View Membership</button>
        </div>

        <div className="card">
          <h2>Diet Plans</h2>
          <p>Get personalized diet plans and nutritional guidance.</p>
          <button onClick={() => openPage("/diet")}>View Diet Plans</button>
        </div>

      </main>

      {/* ---------------- FOOTER ---------------- */}
      <footer>© 2025 ElevateFit</footer>

    </div>
  );
}
