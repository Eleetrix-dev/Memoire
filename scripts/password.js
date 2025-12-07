document.addEventListener('DOMContentLoaded', async () => {
  const lock = document.getElementById('lock-screen');
  const passwordBox = document.getElementById('password-box');
  const pwdInput = document.getElementById('pwd-input');
  const pwdBtn = document.getElementById('pwd-submit');
  const app = document.getElementById('app');
  const pwdMsg = document.getElementById('pwd-msg');
  let storedHash = null;

  // Load password hash from config
  try {
    const res = await fetch('assets/config/password.json', { cache: 'no-store' });
    const cfg = await res.json();
    storedHash = cfg.hash;
  } catch (e) {
    console.error('password config missing', e);
    pwdMsg.textContent = 'Configuration error';
  }

  // Unlock animation
  lock.addEventListener('click', () => {
    lock.classList.add('wings-open');
    setTimeout(() => {
      passwordBox.classList.remove('hidden');
      pwdInput.focus();
    }, 700);
  });

  // Handle password submit
  pwdBtn.addEventListener('click', () => {
    const value = pwdInput.value || '';
    pwdMsg.textContent = '';

    if (!storedHash) {
      pwdMsg.textContent = 'Configuration error';
      return;
    }

    try {
      const valid = bcrypt.compareSync(password, storedHash); // ✅ use value here
      if (ok) {
        document.getElementById('lock-screen').remove();
        app.classList.remove('hidden');
      } else {
        pwdMsg.textContent = 'Incorrect password';
        pwdInput.value = '';
        pwdInput.focus();
      }
    } catch (err) {
      console.error(err);
      pwdMsg.textContent = 'Error validating password';
    }
  });

  // Allow Enter key to submit
  pwdInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') pwdBtn.click();
  });

  // Support #k=token in URL fragment
  const frag = window.location.hash;
  if (frag && frag.startsWith('#k=')) {
    const token = frag.substring(3);
    if (storedHash) {
      try {
        const hash = bcrypt.hashSync(password, 12);
        if (ok) {
          document.getElementById('lock-screen').remove();
          app.classList.remove('hidden');
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
});
