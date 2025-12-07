// Gestion du menu hamburger et de la navigation

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const hasSubmenu = document.querySelector('.has-submenu');
const submenu = document.querySelector('.submenu');

// Toggle menu hamburger
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Toggle sous-menu
if (hasSubmenu) {
    hasSubmenu.addEventListener('click', (e) => {
        e.preventDefault();
        submenu.classList.toggle('active');
        hasSubmenu.classList.toggle('active');
    });
}

// Fermer le menu si on clique en dehors
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Fermer le menu quand on clique sur un lien (sauf le parent du sous-menu)
const navLinks = document.querySelectorAll('.nav-menu a:not(.has-submenu)');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Empêcher la fermeture du menu quand on clique à l'intérieur
navMenu.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Animation smooth scroll si nécessaire
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
