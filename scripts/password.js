document.addEventListener('DOMContentLoaded', async () => {
  const lock = document.getElementById('lock-screen');
  const passwordBox = document.getElementById('password-box');
  const pwdInput = document.getElementById('pwd-input');
  const pwdBtn = document.getElementById('pwd-submit');
  const app = document.getElementById('app');
  const pwdMsg = document.getElementById('pwd-msg');
  let storedHash = null;
  try {
    const res = await fetch('assets/config/password.json', {cache:'no-store'});
    const cfg = await res.json();
    storedHash = cfg.hash;
  } catch(e) {
    console.error('password config missing', e);
    pwdMsg.textContent = 'Configuration error';
  }
  lock.addEventListener('click', () => {
    lock.classList.add('wings-open');
    setTimeout(()=> {
      passwordBox.classList.remove('hidden');
      pwdInput.focus();
    }, 700);
  });
  pwdBtn.addEventListener('click', async () => {
    const value = pwdInput.value || '';
    pwdMsg.textContent = '';
    if(!storedHash){ pwdMsg.textContent = 'Configuration error'; return; }
    try {
      const ok = bcrypt.compareSync(value, storedHash);
      if(ok){
        document.getElementById('lock-screen').remove();
        app.classList.remove('hidden');
      } else {
        pwdMsg.textContent = 'Incorrect password';
        pwdInput.value = '';
        pwdInput.focus();
      }
    } catch(err){
      console.error(err);
      pwdMsg.textContent = 'Error validating password';
    }
  });
  pwdInput.addEventListener('keydown', (e)=> { if(e.key==='Enter') pwdBtn.click(); });
  const frag = window.location.hash;
if(frag && frag.startsWith('#k=')){
  const token = frag.substring(3);
  if(storedHash){
    try {
      const ok = bcrypt.compareSync(value, storedHash);
      if(ok){
        document.getElementById('lock-screen').remove();
        app.classList.remove('hidden');
      }
    } catch(e){
      console.error(e);
    }
  }
}

});
