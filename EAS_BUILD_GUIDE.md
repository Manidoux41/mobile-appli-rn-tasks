# 📱 Guide EAS Build - My Todo App List

## 🚀 Build et Publication sur EAS

### 📋 Prérequis
- ✅ Compte Expo connecté : `superflyman90@gmail.com`
- ✅ Projet EAS créé : `@superflyman90/my-todo-app-list`
- ✅ ID Projet : `700d1845-2425-4ee4-8f0b-f24640b5f8ac`

## 🔨 Types de Build

### 1. 🧪 **Preview Build** (Recommandé pour test)
```bash
# Android APK (installation directe)
npx eas build --platform android --profile preview

# iOS Simulator (si vous avez un Mac)
npx eas build --platform ios --profile preview
```

### 2. 🎯 **Production Build**
```bash
# Android AAB (Google Play Store)
npx eas build --platform android --profile production

# iOS IPA (App Store)
npx eas build --platform ios --profile production
```

### 3. ⚡ **Build Both Platforms**
```bash
npx eas build --platform all --profile preview
```

## 📱 Installation sur votre téléphone

### **Android** (le plus simple)
1. Build preview : `npx eas build --platform android --profile preview`
2. Attendre la compilation (10-15 min)
3. Télécharger l'APK depuis le lien fourni
4. Installer sur Android (autoriser sources inconnues)

### **iOS** (plus complexe)
1. Besoin d'un certificat développeur Apple ($99/an)
2. Ou utiliser TestFlight pour distribution

## 🎯 **Commande recommandée pour vous**
```bash
npx eas build --platform android --profile preview
```

## 📊 Suivi du Build
- Dashboard EAS : https://expo.dev/@superflyman90/my-todo-app-list
- Statut en temps réel dans le terminal
- Notification par email quand terminé

## 🔗 Partage de l'app
Une fois buildée, vous obtiendrez :
- **Lien de téléchargement direct**
- **QR Code** pour installation facile
- **Possibilité de partager** avec d'autres testeurs

## ⚙️ Configuration actuelle

### eas.json
```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "production": {
      "autoIncrement": true,
      "android": { "buildType": "apk" }
    }
  }
}
```

### app.json
- **Nom** : My Todo App List
- **Version** : 1.0.0
- **Bundle ID** : com.superflyman90.mytodoapplist
- **Icône** : Logo personnalisé

## 🚨 Important
- **Première build** : Peut prendre 15-20 minutes
- **Builds suivantes** : Plus rapides (cache)
- **Limite gratuite** : 30 builds/mois
- **Taille max** : ~150MB

## 📱 Test sur téléphone
1. **Android** : Télécharger APK → Installer
2. **iPhone** : TestFlight ou profil développeur requis

---

## 🎉 Étapes suivantes après le build

1. **Télécharger l'app** depuis le lien EAS
2. **Installer sur votre téléphone**
3. **Tester toutes les fonctionnalités**
4. **Partager avec des testeurs**
5. **Publication sur stores** (optionnel)

✅ **Votre app sera 100% fonctionnelle et installable !**
