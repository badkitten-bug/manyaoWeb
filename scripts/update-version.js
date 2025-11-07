#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Función para generar versión basada en timestamp
function generateVersion() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  
  return `${year}.${month}.${day}.${hour}${minute}`;
}

// Función para actualizar versión en globals.css
function updateCSSVersion() {
  const cssPath = path.join(__dirname, '..', 'src', 'app', 'globals.css');
  const version = generateVersion();
  
  try {
    let content = fs.readFileSync(cssPath, 'utf8');
    
    // Buscar y reemplazar la línea de versión
    const versionRegex = /\/\* CSS Version: .+ \*\//;
    const newVersionLine = `/* CSS Version: ${version} */`;
    
    if (versionRegex.test(content)) {
      content = content.replace(versionRegex, newVersionLine);
    } else {
      // Si no existe, agregar al inicio
      content = newVersionLine + '\n' + content;
    }
    
    fs.writeFileSync(cssPath, content, 'utf8');
    console.log(`✅ CSS version updated to: ${version}`);
  } catch (error) {
    console.error('❌ Error updating CSS version:', error.message);
  }
}

// Función para actualizar versión en package.json
function updatePackageVersion() {
  const packagePath = path.join(__dirname, '..', 'package.json');
  const version = generateVersion();
  
  try {
    const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    packageContent.version = version;
    
    fs.writeFileSync(packagePath, JSON.stringify(packageContent, null, 2), 'utf8');
    console.log(`✅ Package version updated to: ${version}`);
  } catch (error) {
    console.error('❌ Error updating package version:', error.message);
  }
}

// Ejecutar actualizaciones
console.log('🔄 Updating versions...');
updateCSSVersion();
updatePackageVersion();
console.log('✨ Version update completed!');
