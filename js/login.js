document.getElementById('login-form').addEventListener('submit', function (event) {
  event.preventDefault();

  const errorEl = document.getElementById('error-message');

  const username = document.getElementById('username').value;
  if (username.length < 6) {
    errorEl.textContent = 'Username must have at least 6 characters.';
    return;
  }

  const password = document.getElementById('password').value;
  if (password.length < 6) {
    errorEl.textContent = 'Password must have at least 6 characters.';
    return;
  }

  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    errorEl.textContent = 'Invalid username or password.';
    return;
  }

  setCurrentUser(user);
  window.location.href = 'home.html';
});

document.getElementById('register').addEventListener('click', function () {
  window.location.href = 'register.html';
});

document.getElementById('forgot-password').addEventListener('click', function () {
  const username = document.getElementById('username').value;
  if (!username) {
    alert('Please enter your username first.');
    return;
  }

  const confirmed = confirm('Resetting your password will delete your account data. Are you sure?');
  if (confirmed) {
    const users = getUsers().filter(u => u.username !== username);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    clearCurrentUser();
    window.location.href = 'register.html';
  }
});