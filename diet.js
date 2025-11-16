// Client-side Edamam Recipe Search (keys are public)
const EDAMAM_APP_ID = '5087aaee';
const EDAMAM_APP_KEY = '8071150d441fb7cb10d9d5446c981afb';

const EDAMAM_USER = 'YOUR_EDAMAM_USER_ID';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('dietForm');
  const results = document.getElementById('dietResults');


  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    results.innerHTML = 'Loading...';

    // Validate API keys
    if (!EDAMAM_APP_ID || !EDAMAM_APP_KEY || EDAMAM_APP_ID === 'YOUR_APP_ID_HERE') {
      results.innerHTML = '<p style="color:orangered">Replace placeholders with your Edamam app id/key in diet.js before calling the API.</p>';
      return;
    }

    // Collect user input
    const q = document.getElementById('mealQuery').value || 'meal';
    const calories = document.getElementById('calories').value || '';
    const diet = document.getElementById('dietPref').value || '';
    const health = document.getElementById('healthPref').value || '';
    const cuisineType = document.getElementById('cuisineType').value || '';
    const excluded = document.getElementById('excluded').value || '';

    // Build API params
    const params = new URLSearchParams();
    params.append('q', q);
    params.append('app_id', EDAMAM_APP_ID);
    params.append('app_key', EDAMAM_APP_KEY);
    if (calories) params.append('calories', calories);
    if (diet) params.append('diet', diet);
    if (health) params.append('health', health);
    if (cuisineType) params.append('cuisineType', cuisineType);
    if (excluded) params.append('excluded', excluded);
    params.append('from', '0');
    params.append('to', '8');

    const url = `https://api.edamam.com/api/recipes/v2?type=public&${params.toString()}`;

    try {
      const resp = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Accept': 'application/json',
          'Edamam-Account-User': EDAMAM_USER
        }
      });

      if (!resp.ok) {
        const body = await resp.text().catch(() => '');
        throw new Error(`API error ${resp.status} ${resp.statusText} ${body ? '- ' + body : ''}`);
      }

      const json = await resp.json();
      const hits = json.hits || [];

      if (!hits.length) {
        results.innerHTML = '<p>No plans found.</p>';
        return;
      }

      // Render results
      results.innerHTML = '';
      hits.forEach(h => {
        const r = h.recipe;
        const card = document.createElement('div');
        card.className = 'plan-card';
        card.innerHTML = `
          <img src="${r.image || 'images/nutrition_reset.jpg'}" alt="${r.label}">
          <h3>${r.label}</h3>
          <p>
            <strong>Source:</strong> ${r.source} — 
            <strong>Calories:</strong> ${Math.round(r.calories)} — 
            <strong>Servings:</strong> ${r.yield}
          </p>
          <p>${(r.dietLabels || []).join(', ')} ${(r.healthLabels || []).slice(0,4).join(', ')}</p>
          <details>
            <summary>Ingredients & link</summary>
            <ul>${(r.ingredientLines || []).map(i => `<li>${i}</li>`).join('')}</ul>
            <p><a href="${r.url}" target="_blank" rel="noopener">View full recipe</a></p>
          </details>
        `;
        results.appendChild(card);
      });

    } catch (err) {
      results.innerHTML = `<p style="color:orangered">Network / API error: ${err.message}</p>`;
    }
  });
});
