# 🔧 Solutions aux erreurs de build EAS

## ❌ Erreur Gradle courante
"Build failed: Gradle build failed with unknown error"

## ✅ Solutions appliquées

### 1. Configuration Android robuste
- ✅ `versionCode`: 1 ajouté
- ✅ `compileSdkVersion`: 34
- ✅ `targetSdkVersion`: 34
- ✅ `buildToolsVersion`: "34.0.0"

### 2. Gradle commands explicites
- ✅ Preview: `:app:assembleRelease`
- ✅ Production: `:app:bundleRelease`

### 3. Dependencies mises à jour
- ✅ react-native-svg@15.11.2 (version compatible)

## 🚀 Alternatives de build

### Option 1: Build simple (recommandée)
```bash
npx eas build --platform android --profile preview --clear-cache
```

### Option 2: Build locale d'abord
```bash
npx expo export
npx eas build --platform android --profile preview --local
```

### Option 3: Build development
```bash
npx eas build --platform android --profile development
```

## 🔍 Debug en cas d'échec

### Vérifier les logs
```bash
npx eas build:list
npx eas build:view [BUILD_ID]
```

### Nettoyer le cache
```bash
npx eas build --clear-cache
```

### Build minimale de test
```bash
# Configuration ultra-simple pour test
npx create-expo-app --template blank TestApp
cd TestApp
npx eas init
npx eas build --platform android --profile preview
```

## 📱 Alternative: Expo Development Build

Si les builds continuent d'échouer :
```bash
npx eas build --platform android --profile development
```

Cette option :
- ✅ Plus rapide à compiler
- ✅ Moins de problèmes Gradle
- ✅ Permet le debug en temps réel
- ❌ Nécessite Expo Go ou dev client

## 🎯 Commande recommandée
```bash
npx eas build --platform android --profile preview --clear-cache
```
