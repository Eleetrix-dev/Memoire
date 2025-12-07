// Gestion de l'animation d'ouverture avec les ailes

const splashScreen = document.getElementById('splash-screen');
const mainContent = document.getElementById('main-content');

// Vérifier si l'utilisateur a déjà visité la page
const hasVisited = sessionStorage.getItem('hasVisited');

if (hasVisited) {
    // Si déjà visité, sauter l'animation
    splashScreen.classList.add('hidden');
    mainContent.classList.add('visible');
} else {
    // Animation d'ouverture au clic
    splashScreen.addEventListener('click', openSplash);
    
    // Aussi possible d'ouvrir avec Entrée ou Espace
    document.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !splashScreen.classList.contains('opening')) {
            openSplash();
        }
    });
}

function openSplash() {
    splashScreen.classList.add('opening');
    
    // Marquer comme visité
    sessionStorage.setItem('hasVisited', 'true');
    
    // Cacher le splash et afficher le contenu
    setTimeout(() => {
        splashScreen.classList.add('hidden');
        mainContent.classList.add('visible');
    }, 1500);
}
