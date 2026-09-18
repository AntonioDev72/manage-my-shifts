const EYE_ICON =
  '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';

const EYE_OFF_ICON =
  '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.8 21.8 0 0 1 5.06-6.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.8 21.8 0 0 1-3.22 4.44M14.12 14.12a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';

document.querySelectorAll(".toggle-password").forEach(function (button) {
  button.addEventListener("click", function () {
    const targetId = button.dataset.target;
    const input = document.getElementById(targetId);

    if (input.type === "password") {
      input.type = "text";
      button.innerHTML = EYE_OFF_ICON;
      button.setAttribute("aria-label", "Hide password");
    } else {
      input.type = "password";
      button.innerHTML = EYE_ICON;
      button.setAttribute("aria-label", "Show password");
    }
  });
});
