# 📱 Guide de Build APK Natif Android

## 🎯 Objectif
Créer une APK Android installable sans Expo, en utilisant React Native CLI.

## 📋 Prérequis (à installer si pas déjà fait)

### 1. Android Studio
- Télécharger : https://developer.android.com/studio
- Installer avec SDK Android
- Configurer les variables d'environnement

### 2. Java Development Kit (JDK)
```bash
# Vérifier si Java est installé
java -version

# Si pas installé, télécharger JDK 17 ou 21
# https://adoptium.net/
```

### 3. Variables d'environnement
Ajouter au fichier `~/.zshrc` :
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home
```

### 4. React Native CLI
```bash
npm install -g @react-native-community/cli
```

## 🚀 Processus de build

### Étape 1: Ejection du projet Expo
```bash
npx expo eject
```

### Étape 2: Configuration Android
```bash
cd android
./gradlew clean
./gradlew assembleRelease
```

### Étape 3: Localisation de l'APK
```
android/app/build/outputs/apk/release/app-release.apk
```

## 🔧 Commandes détaillées

### 1. Préparation
```bash
cd /Users/manfredparbatia/Desktop/supabase-api/mobile
npx expo install --fix
```

### 2. Ejection (conversion en React Native pur)
```bash
npx expo eject
```

### 3. Build Android
```bash
cd android
chmod +x gradlew
./gradlew assembleRelease
```

## 📱 Installation de l'APK

### Sur votre téléphone Android :
1. Transférer l'APK vers le téléphone
2. Autoriser l'installation depuis sources inconnues
3. Installer l'APK

### Via ADB (Android Debug Bridge) :
```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

## ⚠️ Problèmes potentiels et solutions

### Erreur de signature
```bash
# Générer une clé de signature
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### Erreur de build Gradle
```bash
cd android
./gradlew clean
./gradlew assembleRelease --stacktrace
```

### Erreur de dépendances
```bash
npm install
cd ios && pod install && cd ..  # Si nécessaire
```

## 🎯 Avantages de cette méthode
- ✅ APK directement installable
- ✅ Pas de limites Expo
- ✅ Contrôle total sur le build
- ✅ Débogage plus facile
- ✅ Taille d'app optimisée

## 📊 Comparaison des méthodes

| Méthode | Temps | Difficulté | Contrôle |
|---------|--------|------------|----------|
| Expo EAS | 15-20 min | Facile | Limité |
| React Native CLI | 5-10 min | Moyen | Total |
| Android Studio | 3-5 min | Avancé | Maximum |

---

## 🚀 Démarrage du processus

Prêt à commencer ? Exécutez :
```bash
cd /Users/manfredparbatia/Desktop/supabase-api/mobile
npx expo eject
```
