1. Folder Structure

Keep it simple:

frontend/
├─ index.html        ← Dashboard / home page
├─ login.html        ← Login form
├─ register.html     ← Registration form
├─ reports.html      ← Reports listing
├─ alerts.html       ← Alerts listing
├─ js/
│  └─ main.js        ← JS for API calls
├─ css/
   └─ styles.css     ← Tailwind build (or CDN)

2. Use Tailwind CDN

No build step needed for speed. In <head>:

<link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.3.2/dist/tailwind.min.css" rel="stylesheet">

3. Login Form (login.html)
<form id="loginForm" class="max-w-sm mx-auto mt-10 p-6 bg-white shadow-md rounded">
  <h2 class="text-xl font-bold mb-4">Login</h2>
  <input type="text" id="username" placeholder="Username" class="w-full mb-3 p-2 border rounded">
  <input type="password" id="password" placeholder="Password" class="w-full mb-3 p-2 border rounded">
  <button type="submit" class="w-full bg-blue-600 text-white p-2 rounded">Login</button>
  <p id="loginMessage" class="mt-2 text-red-500"></p>
</form>

<script src="js/main.js"></script>

4. Register Form (register.html)
<form id="registerForm" class="max-w-sm mx-auto mt-10 p-6 bg-white shadow-md rounded">
  <h2 class="text-xl font-bold mb-4">Register</h2>
  <input type="text" id="regUsername" placeholder="Username" class="w-full mb-3 p-2 border rounded">
  <input type="password" id="regPassword" placeholder="Password" class="w-full mb-3 p-2 border rounded">
  <button type="submit" class="w-full bg-green-600 text-white p-2 rounded">Register</button>
  <p id="regMessage" class="mt-2 text-red-500"></p>
</form>

<script src="js/main.js"></script>

5. API Calls in main.js
// Login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const res = await fetch('http://localhost:8000/api/users/login/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  document.getElementById('loginMessage').textContent = data.message || data.error;
  if (res.ok) localStorage.setItem('token', data.token);
});

// Register
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('regUsername').value;
  const password = document.getElementById('regPassword').value;

  const res = await fetch('http://localhost:8000/api/users/register/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  document.getElementById('regMessage').textContent = data.message || JSON.stringify(data);
});

✅ Next Steps

Copy this template structure to your frontend folder.

Open login.html & register.html in browser to test API connectivity.
