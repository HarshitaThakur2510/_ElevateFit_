import React, { useEffect, useState, useRef } from "react";

const EDAMAM_APP_ID = "5087aaee";
const EDAMAM_APP_KEY = "8071150d441fb7cb10d9d5446c981afb";
const EDAMAM_USER = "YOUR_EDAMAM_USER_ID"; 

export default function DietConnector() {
  const [loading, setLoading] = useState(false);
  const [hits, setHits] = useState([]);
  const [error, setError] = useState("");
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    const form = document.getElementById("dietForm");

    if (!form) {
      console.error("dietForm not found!");
      return;
    }

    const submitHandler = async (e) => {
      e.preventDefault();
      setError("");
      setHits([]);
      setLoading(true);

      const q = document.getElementById("mealQuery").value || "meal";
      const calories = document.getElementById("calories").value || "";
      const diet = document.getElementById("dietPref").value || "";
      const health = document.getElementById("healthPref").value || "";
      const cuisineType = document.getElementById("cuisineType").value || "";
      const excluded = document.getElementById("excluded").value || "";

      const params = new URLSearchParams();
      params.append("q", q);
      params.append("app_id", EDAMAM_APP_ID);
      params.append("app_key", EDAMAM_APP_KEY);
      if (calories) params.append("calories", calories);
      if (diet) params.append("diet", diet);
      if (health) params.append("health", health);
      if (cuisineType) params.append("cuisineType", cuisineType);
      if (excluded) params.append("excluded", excluded);
      params.append("from", "0");
      params.append("to", "8");

      const url = `https://api.edamam.com/api/recipes/v2?type=public&${params.toString()}`;

      try {
        const resp = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...(EDAMAM_USER ? { "Edamam-Account-User": EDAMAM_USER } : {}),
          },
        });

        if (!resp.ok) {
          const body = await resp.text().catch(() => "");
          throw new Error(`API error ${resp.status} ${resp.statusText} ${body}`);
        }

        const json = await resp.json();
        const recipeHits = json.hits || [];

        if (mounted.current) setHits(recipeHits);

      } catch (err) {
        if (mounted.current) setError(err.message);
      } finally {
        if (mounted.current) setLoading(false);
      }
    };

    form.addEventListener("submit", submitHandler);

    return () => {
      form.removeEventListener("submit", submitHandler);
      mounted.current = false;
    };
  }, []);

  return (
    <div style={{ width: "100%", maxWidth: 1000, marginTop: 20 }}>
      <h3 style={{ color: "#f97316" }}>Diet Results</h3>

      {loading && <p>Loading results...</p>}
      {error && <p style={{ color: "orangered" }}>{error}</p>}

      <div id="dietResults" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
        gap: 16
      }}>
        {(!loading && hits.length === 0) && (
          <p style={{ color: "#ccc" }}>No plans yet. Submit the form.</p>
        )}

        {hits.map((h, i) => {
          const r = h.recipe;
          return (
            <div key={i} className="plan-card">
              <img src={r.image} alt={r.label} />
              <h3>{r.label}</h3>
              <p><strong>Source:</strong> {r.source}</p>
              <p><strong>Calories:</strong> {Math.round(r.calories)}</p>
              <details>
                <summary>Ingredients</summary>
                <ul>
                  {r.ingredientLines.map((line, idx) => (
                    <li key={idx}>{line}</li>
                  ))}
                </ul>
                <p><a href={r.url} target="_blank">Full Recipe</a></p>
              </details>
            </div>
          );
        })}
      </div>
    </div>
  );
}
