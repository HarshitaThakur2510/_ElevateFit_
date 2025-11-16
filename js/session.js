// js/session.js
(function () {
  const slot = document.querySelector("#session-info");
  if (!slot) return;

  const ses = JSON.parse(localStorage.getItem("session") || "null");

  // If no session → show Login & redirect if needed
  if (!ses) {
    slot.innerHTML = `<a href="login.html">Login</a>`;
    return;
  }

  // Role class (for color styling)
  const roleClass = ses.role === "admin" ? "admin" : "user";

  // Inject badge + logout
  slot.innerHTML = `
    <span class="user-badge" id="userNameRole">
      <i class="fa-solid fa-user"></i>
      ${ses.name}
      <span class="role-pill ${roleClass}">${ses.role.toUpperCase()}</span>
    </span>

    <button id="logoutBtn" style="margin-left:10px;">Logout</button>
  `;

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("session");
    alert("Logged out successfully!");
    window.location.href = "welcome.html";
  });

  // Click on badge → go to correct dashboard
  document.getElementById("userNameRole").addEventListener("click", () => {
    if (ses.role === "admin") {
      window.location.href = "admin.html";
    } else if (ses.role === "user") {
      window.location.href = "customer.html";
    }
  });
})();
