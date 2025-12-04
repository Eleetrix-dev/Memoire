/* script.js
  - gère l'ouverture après clic sur l'écran d'accueil
  - le menu burger + panneau latéral
  - lazy-loading simple des images
*/

/* ---------- DOM ---------- */
const landing = document.getElementById('landing');
const mainContent = document.getElementById('mainContent');
const burger = document.getElementById('burger');
const sideMenu = document.getElementById('sideMenu');
const welcome = document.querySelector('.welcome');
const wingLeft = document.querySelector('.wing.left');
const wingRight = document.querySelector('.wing.right');

/* ---------- OPEN SITE (after click) ---------- */
function openSite() {
  // Disable further clicks while animating
  welcome.style.pointerEvents = 'none';

  // small delay so user sees the wings open before fade
  setTimeout(() => {
    landing.style.transition = 'opacity .7s ease, transform .7s ease';
    landing.style.opacity = '0';
    landing.style.transform = 'scale(0.99) translateY(-6px)';
  }, 350);

  // after fade out, hide landing and reveal main
  setTimeout(() => {
    landing.style.display = 'none';
    mainContent.classList.remove('hidden');
    mainContent.focus();
    // start lazy load of images
    lazyLoadImages();
  }, 1100);
}

/* bind click to welcome and whole landing (accessibility) */
welcome.addEventListener('click', openSite);
landing.addEventListener('click', (e) => {
  // avoid clicks on images being blocked
  if (e.target === landing || e.target === welcome || e.target.classList.contains('sub')) {
    openSite();
  }
});

/* ---------- BURGER / SIDE MENU ---------- */
function toggleMenu() {
  const isOpen = sideMenu.classList.toggle('open');
  burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  sideMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
}
burger.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleMenu();
});
/* close menu when clicking outside */
document.addEventListener('click', (e) => {
  if (!sideMenu.contains(e.target) && !burger.contains(e.target)) {
    sideMenu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    sideMenu.setAttribute('aria-hidden', 'true');
  }
});

/* keyboard escape closes menu */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    sideMenu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    sideMenu.setAttribute('aria-hidden', 'true');
  }
});

/* ---------- LAZY LOAD (very simple) ---------- */
function lazyLoadImages() {
  const lazyImages = document.querySelectorAll('img.lazy');
  lazyImages.forEach(img => {
    const src = img.getAttribute('data-src');
    if (!src) return;
    img.src = src;
    img.addEventListener('load', () => {
      img.classList.remove('lazy');
    });
  });
}

/* ---------- SMOOTH SCROLL FROM SIDE MENU ---------- */
const links = sideMenu.querySelectorAll('a[data-target]');
links.forEach(a => {
  a.addEventListener('click', function(e) {
    e.preventDefault();
    const id = this.getAttribute('data-target');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({behavior: 'smooth', block: 'start'});
      // close menu
      sideMenu.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });
});

/* ---------- INIT: If user refreshes after landing closed (dev) ---------- */
document.addEventListener('DOMContentLoaded', () => {
  // if landing already hidden (e.g. reload after opening) ensure main shown
  if (landing.style.display === 'none') {
    mainContent.classList.remove('hidden');
  }
});
