#!/bin/bash

echo "🔄 Remplacement des icônes par défaut par le nouveau logo..."

# Sauvegarde des anciens fichiers
echo "📦 Sauvegarde des anciens fichiers..."
mkdir -p assets/images/backup
cp assets/images/icon.png assets/images/backup/
cp assets/images/adaptive-icon.png assets/images/backup/
cp assets/images/splash-icon.png assets/images/backup/

echo "📝 Instructions pour remplacer les icônes :"
echo ""
echo "1. Allez sur https://convertio.co/svg-png/"
echo "2. Uploadez assets/images/logo.svg"
echo "3. Convertissez en PNG avec ces tailles :"
echo "   - icon.png: 1024x1024px"
echo "   - adaptive-icon.png: 1024x1024px" 
echo "   - splash-icon.png: 400x400px"
echo ""
echo "4. Remplacez les fichiers dans assets/images/"
echo "5. Redémarrez : npx expo start --clear"
echo ""
echo "💡 Alternative rapide :"
echo "Copiez temporairement logo.svg vers icon.png pour test :"
echo "cp assets/images/logo.svg assets/images/icon.svg"

# Création d'une version simplifiée temporaire
echo "🛠️ Création d'icônes temporaires simplifiées..."

# Pour l'instant, on va juste vider le cache et forcer le redémarrage
echo "🧹 Nettoyage du cache Expo..."
