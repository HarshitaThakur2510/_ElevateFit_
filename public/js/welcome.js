// js/welcome.js
(() => {
  const joinBtn = document.getElementById('joinBtn');
  const authModal = document.getElementById('authModal');
  const closeAuth = document.getElementById('closeAuth');
  const loginTab = document.getElementById('loginTab');
  const signupTab = document.getElementById('signupTab');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const loginError = document.getElementById('loginError');
  const signupError = document.getElementById('signupError');
  const authTitle = document.getElementById('authTitle');

  function openModal() { authModal.classList.remove('hidden'); }
  function closeModal() { authModal.classList.add('hidden'); }

  joinBtn?.addEventListener('click', openModal);
  closeAuth?.addEventListener('click', closeModal);

  loginTab.addEventListener('click', () => {
    authTitle.textContent = 'Login';
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
    loginTab.classList.add('bg-orange-500', 'text-white');
    signupTab.classList.remove('bg-orange-500');
  });

  signupTab.addEventListener('click', () => {
    authTitle.textContent = 'Create Account';
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
    signupTab.classList.add('bg-orange-500', 'text-white');
    loginTab.classList.remove('bg-orange-500');
  });

  // SIGNUP
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    signupError.textContent = '';
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;

    if (!name || !email || !password) {
      signupError.textContent = 'All fields required';
      return;
    }

    try {
      // check existing users
      const res = await fetch('http://localhost:5000/users?email=' + encodeURIComponent(email));
      const existing = await res.json();
      if (existing.length) {
        signupError.textContent = 'Email already exists';
        return;
      }

      const newUser = {
        name, email, password, role: 'user', createdAt: new Date().toISOString()
      };

      const createRes = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      const savedUser = await createRes.json();
      // set session
      localStorage.setItem('session', JSON.stringify({ id: savedUser.id, name: savedUser.name, role: savedUser.role }));
      // close and go to index
      closeModal();
      window.location.href = 'index.html';
    } catch (err) {
      console.error(err);
      signupError.textContent = 'Signup failed';
    }
  });

  // LOGIN
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.textContent = '';

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    // check admin first
    try {
      const adminRes = await fetch('http://localhost:5000/admins?email=' + encodeURIComponent(email) + '&password=' + encodeURIComponent(password));
      const admins = await adminRes.json();
      if (admins.length) {
        const admin = admins[0];
        localStorage.setItem('session', JSON.stringify({ id: admin.id, name: admin.name, role: 'admin' }));
        closeModal();
        window.location.href = 'index.html';
        return;
      }

      // check users
      const userRes = await fetch('http://localhost:5000/users?email=' + encodeURIComponent(email) + '&password=' + encodeURIComponent(password));
      const users = await userRes.json();
      if (users.length) {
        const user = users[0];
        localStorage.setItem('session', JSON.stringify({ id: user.id, name: user.name, role: 'user' }));
        closeModal();
        window.location.href = 'index.html';
        return;
      }

      loginError.textContent = 'Invalid credentials';
    } catch (err) {
      console.error(err);
      loginError.textContent = 'Login error';
    }
  });
})();
