document.addEventListener('DOMContentLoaded', async () => {
  const lock = document.getElementById('lock-screen');
  const passwordBox = document.getElementById('password-box');
  const pwdInput = document.getElementById('pwd-input');
  const pwdBtn = document.getElementById('pwd-submit');
  const app = document.getElementById('app');
  const pwdMsg = document.getElementById('pwd-msg');

  let storedHash = null;

  // Load password hash (works GH Pages + local)
  async function loadPasswordConfig() {
    try {
      const res = await fetch("assets/config/password.json", { cache: "no-store" });
      if (!res.ok) throw new Error(res.status);
      const cfg = await res.json();
      storedHash = cfg.hash;
    } catch (err) {
      console.error("Password config error:", err);
      pwdMsg.textContent = "Configuration error";
    }
  }

  await loadPasswordConfig();

  // Unlock animation
  lock.addEventListener("click", () => {
    lock.classList.add("wings-open");
    setTimeout(() => {
      passwordBox.classList.remove("hidden");
      pwdInput.focus();
    }, 700);
  });

  // Validate password
  function validatePassword(input) {
    if (!storedHash) {
      pwdMsg.textContent = "Configuration error";
      return;
    }

    try {
      const ok = bcrypt.compareSync(input, storedHash);
      if (ok) {
        lock.remove();
        app.classList.remove("hidden");
      } else {
        pwdMsg.textContent = "Incorrect password";
        pwdInput.value = "";
        pwdInput.focus();
      }
    } catch (err) {
      console.error(err);
      pwdMsg.textContent = "Error validating password";
    }
  }

  pwdBtn.addEventListener("click", () => validatePassword(pwdInput.value));
  pwdInput.addEventListener("keydown", (e) => e.key === "Enter" && validatePassword(pwdInput.value));

  // URL fragment authentication (#k=password)
  const frag = window.location.hash;
  if (frag && frag.startsWith("#k=")) {
    const token = decodeURIComponent(frag.substring(3));
    validatePassword(token);
  }
});
