const fs = require('fs');
const path = require('path');

// Script pour créer des placeholders PNG temporaires
// En attendant la conversion manuelle des SVG

const sizes = {
  'icon.png': 1024,
  'adaptive-icon.png': 1024,
  'splash-icon.png': 400,
  'favicon.png': 48
};

console.log('📱 Configuration des icônes pour My Todo App List');
console.log('');
console.log('🎨 Pour avoir les vrais logos, convertissez ces SVG en PNG :');
console.log('- assets/images/logo.svg → icon.png (1024x1024)');
console.log('- assets/images/splash-icon.svg → splash-icon.png (400x400)');
console.log('');
console.log('🌐 Sites de conversion recommandés :');
console.log('- https://convertio.co/svg-png/');
console.log('- https://cloudconvert.com/svg-to-png');
console.log('');
console.log('⚙️ Ou utilisez un logiciel :');
console.log('- Inkscape (gratuit)');
console.log('- Adobe Illustrator');
console.log('- Figma (export)');
console.log('');

// Vérifier si les fichiers PNG existent
Object.keys(sizes).forEach(filename => {
  const filepath = path.join(__dirname, 'images', filename);
  if (fs.existsSync(filepath)) {
    console.log(`✅ ${filename} existe`);
  } else {
    console.log(`❌ ${filename} manquant - à convertir depuis SVG`);
  }
});

console.log('');
console.log('🚀 Une fois les PNG créés, redémarrez avec : npx expo start --clear');

module.exports = { sizes };
