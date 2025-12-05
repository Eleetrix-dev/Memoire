/* ---------- CONFIG ---------- */
/* Remplace THIS_HASH par le hash SHA-256 du mot de passe que tu choisis.
   Exemple pour 'monmotdepasse' -> compute SHA256 and place hex string here.
   To compute: open browser console and run:
     digestMessage('monmotdepasse').then(h=>console.log(h))
*/
const PASSWORD_HASH = "5db1fee4b5703808c48078a76768b155b421b210c0761cd6a5d223f4d99f1eaa"; // <-- change this

/* If you want auto-open via URL: add #k=thekey (thekey must be the pre-hash token or the hash)
   If it's the raw key we compute its hash and compare.
*/

/* ---------- HELPERS: WebCrypto SHA-256 ---------- */
async function digestMessage(message) {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2,'0')).join('');
  return hashHex;
}

/* ---------- DOM ---------- */
const landing = document.getElementById('landing');
const welcome = document.querySelector('.welcome');
const leftWing = document.querySelector('.wing.left');
const rightWing = document.querySelector('.wing.right');
const pwdModal = document.getElementById('pwdModal');
const pwdInput = document.getElementById('pwdInput');
const pwdOk = document.getElementById('pwdOk');
const pwdCancel = document.getElementById('pwdCancel');
const mainContent = document.getElementById('mainContent');
const hero = document.querySelector('.hero');
const burger = document.getElementById('burger');
const sideMenu = document.getElementById('sideMenu');

/* ---------- OPENING FLOW ---------- */
function openWingsThenPrompt() {
  // Play wings open
  leftWing.classList.add('open-left');
  rightWing.classList.add('open-right');

  // small delay then show password modal
  setTimeout(() => {
    showPasswordModal();
  }, 900);
}

/* show modal */
function showPasswordModal() {
  pwdModal.classList.remove('hidden');
  pwdInput.value = '';
  pwdInput.focus();
}

/* hide modal */
function hidePasswordModal() {
  pwdModal.classList.add('hidden');
}

/* reveal site after successful auth */
async function revealSite() {
  // fade out landing
  landing.style.transition = 'opacity .75s ease, transform .75s ease';
  landing.style.opacity = '0';
  landing.style.transform = 'scale(.99) translateY(-6px)';
  setTimeout(() => { landing.style.display = 'none'; mainContent.classList.remove('hidden'); hero.classList.add('show'); lazyLoadImages(); }, 900);
}

/* ---------- AUTH HANDLING ---------- */
async function attemptPasswordCheck(plainOrHash) {
  // if user passed the raw password, compute hash
  let hash;
  if (plainOrHash.length === 64 && /^[0-9a-f]+$/i.test(plainOrHash)) {
    hash = plainOrHash.toLowerCase();
  } else {
    hash = await digestMessage(plainOrHash);
  }
  if (hash === PASSWORD_HASH.toLowerCase()) {
    hidePasswordModal();
    await revealSite();
    return true;
  }
  return false;
}

/* bind modal buttons */
pwdOk.addEventListener('click', async () => {
  const ok = await attemptPasswordCheck(pwdInput.value.trim());
  if (!ok) {
    pwdInput.value = '';
    pwdInput.placeholder = 'Mot de passe incorrect';
    pwdInput.focus();
  }
});
pwdCancel.addEventListener('click', () => {
  // reset: close modal and re-enable landing click
  hidePasswordModal();
});

/* Enter key */
pwdInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') pwdOk.click();
});

/* landing click (or keyboard) */
welcome.addEventListener('click', (e) => {
  openWingsThenPrompt();
});
welcome.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') openWingsThenPrompt();
});

/* ---------- MENU ---------- */
burger.addEventListener('click', (e) => {
  e.stopPropagation();
  sideMenu.classList.toggle('open');
  const isOpen = sideMenu.classList.contains('open');
  burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  sideMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
});
document.addEventListener('click', (e) => {
  if (!sideMenu.contains(e.target) && !burger.contains(e.target)) {
    sideMenu.classList.remove('open');
  }
});
document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') sideMenu.classList.remove('open'); });

/* ---------- LIGHTBOX & LAZYLOAD ---------- */
function lazyLoadImages() {
  const lazyImages = document.querySelectorAll('img.lazy');
  lazyImages.forEach(img => {
    const src = img.getAttribute('data-src');
    if (!src) return;
    img.src = src;
    img.addEventListener('load', ()=> img.classList.remove('lazy'));
    // bind lightbox
    img.addEventListener('click', () => openLightbox(img.src));
  });

  // bind existing non-lazy images too
  document.querySelectorAll('.card img:not(.lazy)').forEach(img=>{
    img.addEventListener('click', ()=> openLightbox(img.src));
  });
}

function openLightbox(src) {
  // create overlay
  const overlay = document.createElement('div');
  overlay.className = 'fullscreen-overlay';
  overlay.innerHTML = `<img src="${src}" class="big" alt="Agrandissement">`;
  overlay.addEventListener('click', ()=> overlay.remove());
  document.body.appendChild(overlay);
  // small show animation
  requestAnimationFrame(()=> overlay.classList.add('show'));
}

/* ---------- SECURITY: block copy/right/print ---------- */
/* block right click and selection-based copy */
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('selectstart', e => e.preventDefault());
document.addEventListener('copy', e => e.preventDefault());

/* try to intercept PrintScreen key / ctrl+S / ctrl+U / F12 */
document.addEventListener('keydown', (e) => {
  // block common devtools or screen capture keys
  if (
    e.key === 'PrintScreen' ||
    (e.ctrlKey && (e.key === 's' || e.key === 'S' || e.key === 'u' || e.key === 'U')) ||
    e.key === 'F12'
  ) {
    e.preventDefault();
    // momentary overlay to spoil screenshot
    showTempOverlay();
  }
});

/* on blur/hide -> hide main content (makes screenshot harder) */
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (!landing || landing.style.display !== 'none') return;
    applyBlurHide();
  } else {
    removeBlurHide();
  }
});
window.addEventListener('blur', () => { if (!landing || landing.style.display !== 'none') return; applyBlurHide(); });
window.addEventListener('focus', removeBlurHide);

let tempOverlay;
function showTempOverlay() {
  if (tempOverlay) return;
  tempOverlay = document.createElement('div');
  tempOverlay.style.position = 'fixed';
  tempOverlay.style.inset = '0';
  tempOverlay.style.zIndex = '4000';
  tempOverlay.style.background = 'radial-gradient(circle at 50% 30%, rgba(157,226,193,0.06), rgba(0,0,0,0.95))';
  document.body.appendChild(tempOverlay);
  setTimeout(()=>{ tempOverlay && tempOverlay.remove(); tempOverlay = null; }, 700);
}

function applyBlurHide(){
  mainContent.style.filter = 'blur(12px) grayscale(.8)';
  mainContent.style.opacity = '.02';
}
function removeBlurHide(){
  mainContent.style.filter = '';
  mainContent.style.opacity = '1';
}

/* ---------- ON LOAD: check URL auto key ---------- */
document.addEventListener('DOMContentLoaded', async () => {
  // check for #k= token (auto open)
  const frag = window.location.hash;
  if (frag && frag.startsWith('#k=')) {
    const token = frag.substring(3);
    // try token as raw or hashed
    const ok = await attemptAutoKey(token);
    if (ok) return;
  }
  // else: normal flow (landing shown)
});

/* try auto key */
async function attemptAutoKey(token) {
  // if token looks like a 64-hex, compare directly, otherwise compute hash
  let candidate = token;
  if (!/^[0-9a-f]{64}$/i.test(token)) {
    candidate = await digestMessage(token);
  }
  if (candidate.toLowerCase() === PASSWORD_HASH.toLowerCase()) {
    // show wings open, then reveal directly
    leftWing.classList.add('open-left'); rightWing.classList.add('open-right');
    setTimeout(()=>{ hideLandingAndReveal(); }, 900);
    return true;
  }
  return false;
}

function hideLandingAndReveal() {
  landing.style.display = 'none';
  mainContent.classList.remove('hidden');
  hero.classList.add('show');
  lazyLoadImages();
}

/* export digest helper for user use (developer convenience) */
window.digestMessage = digestMessage;
