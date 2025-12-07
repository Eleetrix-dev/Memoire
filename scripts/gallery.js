// Gestion du chargement automatique de la galerie et du lightbox

// Charger le manifest contenant la liste des médias
async function loadManifest() {
    try {
        const response = await fetch('gallery/manifest.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors du chargement du manifest:', error);
        return { photos: [], videos: [] };
    }
}

// Créer un élément de galerie
function createGalleryItem(src, type, filename) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    
    // Extraire un nom lisible du fichier
    const displayName = filename
        .replace(/\.(jpg|jpeg|png|gif|mp4|webm|mov)$/i, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());

    if (type === 'photo') {
        item.innerHTML = `
            <img src="${src}" alt="${displayName}" loading="lazy">
            <div class="overlay">
                <h3>${displayName}</h3>
                <p>Cliquez pour agrandir</p>
            </div>
        `;
        item.addEventListener('click', () => openLightbox(src));
    } else if (type === 'video') {
        item.innerHTML = `
            <video src="${src}" muted loop preload="metadata"></video>
            <div class="overlay">
                <h3>${displayName}</h3>
                <p>Survolez pour lire</p>
            </div>
        `;
        
        const video = item.querySelector('video');
        
        // Lecture au survol
        item.addEventListener('mouseenter', () => {
            video.play().catch(e => console.log('Autoplay prevented'));
        });
        
        item.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });
        
        // Clic pour voir en plein écran ou ouvrir dans nouvel onglet
        item.addEventListener('click', () => {
            window.open(src, '_blank');
        });
    }

    return item;
}

// Charger la galerie d'accueil (aperçu)
async function loadHomeGallery() {
    const manifest = await loadManifest();
    const homeGallery = document.getElementById('home-gallery');
    
    if (!homeGallery) return;
    
    homeGallery.innerHTML = '';
    
    // Afficher les 3 premières photos et 2 premières vidéos
    const photos = manifest.photos.slice(0, 3);
    const videos = manifest.videos.slice(0, 2);
    
    photos.forEach(photo => {
        const filename = photo.split('/').pop();
        const item = createGalleryItem(photo, 'photo', filename);
        homeGallery.appendChild(item);
    });
    
    videos.forEach(video => {
        const filename = video.split('/').pop();
        const item = createGalleryItem(video, 'video', filename);
        homeGallery.appendChild(item);
    });
    
    // Message si aucun média
    if (photos.length === 0 && videos.length === 0) {
        homeGallery.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px; color: #666;">
                <p style="font-size: 1.2rem;">Aucun média trouvé.</p>
                <p style="margin-top: 10px;">Ajoutez des photos dans <code>gallery/photos/</code> et des vidéos dans <code>gallery/videos/</code></p>
            </div>
        `;
    }
}

// Charger uniquement les photos
async function loadPhotosGallery() {
    const manifest = await loadManifest();
    const photosGallery = document.getElementById('photos-gallery');
    
    if (!photosGallery) return;
    
    photosGallery.innerHTML = '';
    
    manifest.photos.forEach(photo => {
        const filename = photo.split('/').pop();
        const item = createGalleryItem(photo, 'photo', filename);
        photosGallery.appendChild(item);
    });
    
    if (manifest.photos.length === 0) {
        photosGallery.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px; color: #666;">
                <p style="font-size: 1.2rem;">Aucune photo trouvée.</p>
                <p style="margin-top: 10px;">Ajoutez des photos dans <code>gallery/photos/</code></p>
            </div>
        `;
    }
}

// Charger uniquement les vidéos
async function loadVideosGallery() {
    const manifest = await loadManifest();
    const videosGallery = document.getElementById('videos-gallery');
    
    if (!videosGallery) return;
    
    videosGallery.innerHTML = '';
    
    manifest.videos.forEach(video => {
        const filename = video.split('/').pop();
        const item = createGalleryItem(video, 'video', filename);
        videosGallery.appendChild(item);
    });
    
    if (manifest.videos.length === 0) {
        videosGallery.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px; color: #666;">
                <p style="font-size: 1.2rem;">Aucune vidéo trouvée.</p>
                <p style="margin-top: 10px;">Ajoutez des vidéos dans <code>gallery/videos/</code></p>
            </div>
        `;
    }
}

// Lightbox pour les images
const lightbox = document.querySelector('.lightbox');
const lightboxImg = document.querySelector('.lightbox-content');
const lightboxClose = document.querySelector('.lightbox-close');

function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
}

if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

// Auto-charger selon la page
if (document.getElementById('home-gallery')) {
    loadHomeGallery();
}
