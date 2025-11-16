// js/contact.js
const API = "http://localhost:3000";

const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("c-name").value.trim();
    const email = document.getElementById("c-email").value.trim();
    const msg = document.getElementById("c-msg").value.trim();
    const errEl = document.getElementById("c-error");
    const okEl = document.getElementById("c-success");
    errEl.textContent = ""; okEl.textContent = "";

    if (!name || !email || !msg) { errEl.textContent = "All fields are required."; return; }
    if (!/\S+@\S+\.\S+/.test(email)) { errEl.textContent = "Enter a valid email."; return; }

    try {
      const res = await fetch(`${API}/contacts`, {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ name, email, message: msg, createdAt: new Date().toISOString() })
      });
      if (!res.ok) throw new Error("Failed");
      contactForm.reset();
      okEl.textContent = "Thanks! Your message was sent.";
    } catch (err) {
      errEl.textContent = "Could not send. Is JSON Server on port 3000 running?";
      console.error(err);
    }
  });
}
