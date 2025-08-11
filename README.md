# 📱 Application Mobile - Gestionnaire de Tâches

## 📖 Description

Application mobile complète de gestion de tâches développée avec React Native et Expo. Interface intuitive avec authentification sécurisée, gestion avancée des tâches, filtrage par dates et système de priorités.

## ✨ Fonctionnalités principales

### 🔐 **Authentification sécurisée**
- Inscription et connexion utilisateur
- Stockage sécurisé des tokens JWT
- Déconnexion automatique en cas d'erreur d'authentification

### 📋 **Gestion complète des tâches**
- ➕ Création de nouvelles tâches
- ✏️ Modification des tâches existantes
- ❌ Suppression des tâches
- ✅ Marquage comme terminées/non terminées
- 📅 Sélection de dates d'échéance
- 🎯 Système de priorités (Basse, Moyenne, Haute)

### 📊 **Filtrage intelligent**
- 📅 **Toutes** - Affichage de toutes les tâches
- 📆 **Aujourd'hui** - Tâches à faire aujourd'hui
- 🌅 **Demain** - Tâches prévues pour demain
- 📰 **Cette semaine** - Tâches de la semaine en cours
- 🗓️ **Ce mois** - Tâches du mois en cours
- ⚠️ **En retard** - Tâches dépassées non terminées
- ✅ **Terminées** - Tâches accomplies

### 🎨 **Interface moderne**
- Design épuré et intuitif
- Indicateurs visuels de priorité
- Affichage contextuel des dates
- Navigation fluide entre les écrans

## 🛠️ Technologies

- **React Native** - Framework mobile cross-platform
- **Expo 53** - Plateforme de développement
- **TypeScript** - Typage statique pour plus de sécurité
- **Expo Router** - Navigation moderne
- **Expo SecureStore** - Stockage sécurisé des tokens
- **DateTimePicker** - Sélecteur de dates natif

## ⚙️ Installation

### 1. Prérequis
```bash
# Installer Node.js (v18 ou supérieur)
# Installer Expo CLI
npm install -g @expo/cli
```

### 2. Installation des dépendances
```bash
cd mobile
npm install
```

### 3. Configuration
Votre API backend est maintenant hébergée sur `https://backend-api-tasks.vercel.app`

### 4. Démarrage
```bash
npx expo start
```

### 5. Choisir la plateforme
- **i** - Simulateur iOS
- **a** - Émulateur Android  
- **w** - Web (développement)
- Scannez le QR code avec l'app Expo Go

## 📱 Guide d'utilisation

### 🚀 **Premier lancement**

1. **Inscription** - Créez votre compte utilisateur
2. **Connexion** - Connectez-vous avec vos identifiants
3. **Tableau de bord** - Accédez à vos tâches

### ➕ **Créer une tâche**

1. Appuyez sur le bouton **"+"** 
2. Renseignez les informations :
   - **Titre** (obligatoire)
   - **Description** (optionnelle)
   - **Date d'échéance** (optionnelle)
   - **Priorité** (Basse/Moyenne/Haute)
3. Appuyez sur **"Créer la tâche"**

### 📋 **Gérer vos tâches**

#### **Marquer comme terminée**
- Appuyez sur la case à cocher ☑️

#### **Modifier une tâche**
- Appuyez sur l'icône crayon ✏️
- Modifiez les informations
- Sauvegardez les changements

#### **Supprimer une tâche**
- Appuyez sur l'icône poubelle 🗑️
- Confirmez la suppression

### 🔍 **Filtrer vos tâches**

#### **Barre de filtres**
Utilisez les boutons de filtre en haut de l'écran :

- **Toutes** - Vue d'ensemble complète
- **Aujourd'hui** - Focus sur les tâches du jour
- **Demain** - Préparation de la journée suivante
- **Cette semaine** - Planification hebdomadaire
- **Ce mois** - Vue mensuelle
- **En retard** - Tâches nécessitant une attention urgente
- **Terminées** - Suivi des accomplissements

#### **Indicateurs visuels**
- 🔴 **Rouge** - Priorité haute
- 🟡 **Jaune** - Priorité moyenne  
- 🟢 **Vert** - Priorité basse
- ⚠️ **Badge retard** - Tâches en retard

### 📅 **Gestion des dates**

#### **Sélection de date**
- Appuyez sur le champ date
- Utilisez le sélecteur natif
- La date s'affiche automatiquement

#### **Affichage intelligent**
- **"Aujourd'hui"** - Tâches du jour
- **"Demain"** - Tâches de demain
- **"En retard de X jours"** - Calcul automatique
- **Format date** - Pour les autres dates

## 🎯 Cas d'usage

### 👨‍💼 **Professionnel**
- Gestion de projets
- Suivi des deadlines
- Organisation des réunions
- Planification des livrables

### 🏠 **Personnel**
- Liste de courses
- Tâches ménagères
- Rendez-vous médicaux
- Objectifs personnels

### 🎓 **Études**
- Devoirs à rendre
- Révisions d'examens
- Projets de groupe
- Planning des cours

### 💡 **Productivité**
- Méthode GTD (Getting Things Done)
- Priorisation avec matrice d'Eisenhower
- Suivi d'habitudes
- Planification hebdomadaire

## 📂 Structure de l'application

```
mobile/
├── app/
│   ├── _layout.tsx       # Navigation principale
│   ├── index.tsx         # Écran d'accueil
│   ├── login.tsx         # Connexion
│   ├── register.tsx      # Inscription
│   └── tasks.tsx         # Gestion des tâches
├── components/
│   ├── TaskCard.tsx      # Carte de tâche
│   ├── TaskFilter.tsx    # Barre de filtres
│   ├── DatePickerField.tsx # Sélecteur de date
│   ├── PriorityPicker.tsx  # Sélecteur de priorité
│   └── ui.tsx            # Composants UI communs
├── utils/
│   ├── api.ts            # Service API
│   ├── auth.ts           # Gestion auth
│   └── dateFilters.ts    # Logique de filtrage
└── constants/
    └── api.ts            # Configuration API
```

## 🔧 Fonctionnalités techniques

### 🔒 **Sécurité**
- Tokens JWT stockés de manière sécurisée
- Déconnexion automatique si token expiré
- Validation côté client et serveur

### 📱 **Interface utilisateur**
- Design responsive
- Animations fluides
- Feedback visuel immédiat
- Gestion des états de chargement

### 🚀 **Performance**
- Chargement optimisé des données
- Mise en cache des requêtes
- Navigation rapide entre écrans

## 🧪 Mode développement

### **Variables d'environnement**
```bash
# Configuration pour production (optionnel)
API_BASE_URL=https://backend-api-tasks.vercel.app/api
```

### **Scripts disponibles**
```bash
# Démarrage de l'app
npx expo start

# Build pour production
npx expo build

# Tests (si configurés)
npm test

# Linting
npx expo lint
```

### **Debug**
- Utilisez Flipper pour le debugging avancé
- Console logs disponibles dans le terminal Expo
- React DevTools compatible

## 📱 Plateformes supportées

### ✅ **iOS**
- iOS 13.0+
- iPhone et iPad
- Optimisé pour toutes les tailles d'écran

### ✅ **Android**
- Android 6.0+ (API 23+)
- Smartphones et tablettes
- Interface Material Design

### 🌐 **Web (développement)**
- Chrome, Firefox, Safari
- Responsive design
- Fonctionnalités limitées

## 🚀 Déploiement

### **iOS App Store**
```bash
# Build pour iOS
npx expo build:ios

# Soumettre via Expo
npx expo upload:ios
```

### **Google Play Store**
```bash
# Build pour Android
npx expo build:android

# Soumettre via Expo
npx expo upload:android
```

### **Expo Go (Test)**
- Publier sur Expo : `npx expo publish`
- Partager le lien de test
- Installation via QR code

## 💡 Conseils d'utilisation

### **🎯 Productivité maximale**
1. **Plannifiez votre journée** - Utilisez le filtre "Aujourd'hui"
2. **Priorisez** - Assignez des priorités à vos tâches
3. **Suivez vos progrès** - Consultez les tâches terminées
4. **Anticipez** - Planifiez avec le filtre "Cette semaine"

### **📅 Gestion du temps**
- Définissez des dates d'échéance réalistes
- Utilisez le filtre "En retard" pour rattraper
- Planifiez à l'avance avec "Ce mois"

### **🔔 Notifications (future version)**
- Rappels avant échéance
- Notifications de tâches en retard
- Résumé quotidien

## 🆘 Résolution de problèmes

### **Problèmes de connexion**
1. Vérifiez que l'API backend fonctionne sur Vercel
2. Contrôlez l'URL de l'API (`https://backend-api-tasks.vercel.app`)
3. Vérifiez votre connexion internet

### **Problèmes de synchronisation**
1. Vérifiez votre connexion internet
2. Déconnectez-vous et reconnectez-vous
3. Redémarrez l'application

### **Problèmes d'affichage**
1. Redémarrez l'app
2. Vérifiez les mises à jour Expo
3. Nettoyez le cache : `npx expo start -c`

## 🔄 Mises à jour

### **Expo OTA (Over The Air)**
```bash
# Publier une mise à jour
npx expo publish

# Les utilisateurs recevront automatiquement
# la mise à jour au prochain lancement
```

## 📞 Support et contribution

### **Reporting de bugs**
1. Vérifiez les logs dans la console
2. Reproduisez le problème
3. Fournissez les étapes de reproduction

### **Suggestions d'amélioration**
- Nouvelles fonctionnalités
- Améliorations UX/UI
- Optimisations de performance

---

## 🎉 Commencer maintenant !

```bash
# Installation rapide
cd mobile
npm install
npx expo start

# Scannez le QR code avec Expo Go
# Et commencez à organiser vos tâches ! 🚀
```

### **📱 Téléchargez Expo Go**
- [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
- [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

---

✅ **Votre gestionnaire de tâches mobile est prêt !**

🎯 **Organisez votre vie, une tâche à la fois.**
