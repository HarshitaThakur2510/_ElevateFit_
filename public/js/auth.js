// js/auth.js

const API = "http://localhost:3000";

// Helpers
const $ = (s) => document.querySelector(s);
const emailOk = (e) => /\S+@\S+\.\S+/.test(e);

async function getJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}
async function postJSON(url, body) {
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

/* USER SIGNUP → /users */
const userSignupForm = $("#signup-user-form");
if (userSignupForm) {
  userSignupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = $("#su-name").value.trim();
    const email = $("#su-email").value.trim();
    const password = $("#su-password").value;
    const confirm = $("#su-confirm").value;
    const err = $("#su-error");
    err.textContent = "";

    if (!name || !email || !password || !confirm) {
      err.textContent = "All fields are required.";
      return;
    }
    if (!emailOk(email)) {
      err.textContent = "Enter a valid email.";
      return;
    }
    if (password.length < 6) {
      err.textContent = "Password must be at least 6 characters.";
      return;
    }
    if (password !== confirm) {
      err.textContent = "Passwords do not match.";
      return;
    }

    try {
      const dup = await getJSON(
        `${API}/users?email=${encodeURIComponent(email)}`
      );
      if (dup.length) {
        err.textContent = "Email already registered. Please log in.";
        return;
      }

      await postJSON(`${API}/users`, {
        name,
        email,
        password,
        role: "user",
        createdAt: new Date().toISOString(),
      });
      alert("Signup successful! Please log in now.");
      window.location.href = "login.html";
    } catch (ex) {
      console.error(ex);
      err.textContent = "Signup failed. Is JSON Server on port 3000 running?";
    }
  });
}

/* ADMIN SIGNUP → /admins */
const adminSignupForm = $("#signup-admin-form");
if (adminSignupForm) {
  adminSignupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = $("#sa-name").value.trim();
    const email = $("#sa-email").value.trim();
    const password = $("#sa-password").value;
    const confirm = $("#sa-confirm").value;
    const err = $("#sa-error");
    err.textContent = "";

    if (!name || !email || !password || !confirm) {
      err.textContent = "All fields are required.";
      return;
    }
    if (!emailOk(email)) {
      err.textContent = "Enter a valid email.";
      return;
    }
    if (password.length < 6) {
      err.textContent = "Password must be at least 6 characters.";
      return;
    }
    if (password !== confirm) {
      err.textContent = "Passwords do not match.";
      return;
    }

    try {
      const dup = await getJSON(
        `${API}/admins?email=${encodeURIComponent(email)}`
      );
      if (dup.length) {
        err.textContent = "Admin email already exists. Please log in.";
        return;
      }

      await postJSON(`${API}/admins`, {
        name,
        email,
        password,
        role: "admin",
        createdAt: new Date().toISOString(),
      });
      alert("Admin signup successful! Please log in.");
      window.location.href = "login.html";
    } catch (ex) {
      console.error(ex);
      err.textContent = "Admin signup failed. Is JSON Server on port 3000 running?";
    }
  });
}

/* LOGIN (user/admin) */
const loginForm = $("#login-form");
if (loginForm) {
  const roleInput = $("#roleInput");
  const err = $("#lg-error");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    err.textContent = "";

    const role = roleInput?.value === "admin" ? "admin" : "user";
    const email = ($("#lg-email") || $("#email")).value.trim();
    const password = ($("#lg-password") || $("#password")).value;

    if (!email || !password) {
      err.textContent = "Email and password are required.";
      return;
    }
    if (!emailOk(email)) {
      err.textContent = "Enter a valid email.";
      return;
    }

    try {
      const path = role === "admin" ? "admins" : "users";
      const url = `${API}/${path}?email=${encodeURIComponent(
        email
      )}&password=${encodeURIComponent(password)}`;
      const res = await getJSON(url);
      if (!Array.isArray(res) || res.length === 0) {
        err.textContent = "Invalid credentials.";
        return;
      }

      const u = res[0];
      localStorage.setItem(
        "session",
        JSON.stringify({ role, id: u.id, name: u.name, email: u.email })
      );
      alert(`Logged in as ${role}.`);
      // ✅ Always redirect to index.html
      window.location.href = "index.html";
    } catch (ex) {
      console.error(ex);
      err.textContent = "Login failed. Is JSON Server on port 3000 running?";
    }
  });
}
