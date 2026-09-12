document.getElementById("register-form").addEventListener("submit", function (event) {
  event.preventDefault();

  const errorEl = document.getElementById("error-message");

  const firstName = document.getElementById("first-name").value;
  if (firstName.length < 2) {
    errorEl.textContent = "First name must have at least 2 letters.";
    return;
  }

  const lastName = document.getElementById("last-name").value;
  if (lastName.length < 2) {
    errorEl.textContent = "Last name must have at least 2 letters.";
    return;
  }

  const username = document.getElementById("username").value;
  const hasLetter = /[a-zA-Z]/.test(username);
  const hasNumber = /[0-9]/.test(username);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(username);
  if (username.length < 6) {
    errorEl.textContent = "Username must have at least 6 characters.";
    return;
  }
  else if (!hasLetter || !hasNumber || !hasSpecialChar) {
    errorEl.textContent = "Username must contain at least one letter, one number, and one special character.";
    return;
  }
  const email = document.getElementById("email").value;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errorEl.textContent = "Please enter a valid email address.";
    return;
  }

  const birthDate = document.getElementById("birthDate").value;
  const birthDateObj = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();
  const dayDiff = today.getDate() - birthDateObj.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
    if (age < 18 || age > 65) {
      errorEl.textContent = "You must be between 18 and 65 years old to register.";
      return;
    }

  const password = document.getElementById("password").value;
  if (password.length < 6) {
    errorEl.textContent = "Password must have at least 6 characters.";
    return;
  }

  const confirmPassword = document.getElementById("confirm-password").value;
  if (confirmPassword.length < 6) {
    errorEl.textContent = "Confirm password must have at least 6 characters.";
    return;
  }
  else if (password !== confirmPassword) {
    errorEl.textContent = "Passwords do not match.";
    return;
  }
    const user = {
    firstName,
    lastName,
    username,
    email,
    birthDate,
    password,
  };

  saveUser(user);
  setCurrentUser(user);
  window.location.href = "home.html";
});