#!/usr/bin/env python3
"""
Script pour générer automatiquement le fichier manifest.json
qui liste tous les médias présents dans les dossiers gallery/photos et gallery/videos
"""

import os
import json
from pathlib import Path

# Extensions acceptées
PHOTO_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'}
VIDEO_EXTENSIONS = {'.mp4', '.webm', '.mov', '.avi', '.mkv'}

def scan_directory(directory, extensions):
    """Scanne un dossier et retourne la liste des fichiers avec les extensions données"""
    files = []
    dir_path = Path(directory)
    
    if not dir_path.exists():
        print(f"⚠️  Le dossier {directory} n'existe pas")
        return files
    
    for file in sorted(dir_path.iterdir()):
        if file.is_file() and file.suffix.lower() in extensions:
            # Utiliser des chemins relatifs avec '/' pour le web
            relative_path = str(file).replace('\\', '/')
            files.append(relative_path)
    
    return files

def generate_manifest():
    """Génère le fichier manifest.json"""
    
    # Scanner les dossiers
    photos = scan_directory('gallery/photos', PHOTO_EXTENSIONS)
    videos = scan_directory('gallery/videos', VIDEO_EXTENSIONS)
    
    # Créer le manifest
    manifest = {
        'photos': photos,
        'videos': videos
    }
    
    # Sauvegarder le fichier JSON
    manifest_path = Path('gallery/manifest.json')
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    
    # Afficher le résumé
    print("✅ Manifest généré avec succès!")
    print(f"📷 Photos trouvées: {len(photos)}")
    print(f"🎬 Vidéos trouvées: {len(videos)}")
    
    if photos:
        print("\nPhotos:")
        for photo in photos:
            print(f"  - {photo}")
    
    if videos:
        print("\nVidéos:")
        for video in videos:
            print(f"  - {video}")
    
    if not photos and not videos:
        print("\n⚠️  Aucun média trouvé!")
        print("Ajoutez des photos dans 'gallery/photos/' et des vidéos dans 'gallery/videos/'")

if __name__ == '__main__':
    print("🔍 Génération du manifest...\n")
    generate_manifest()
