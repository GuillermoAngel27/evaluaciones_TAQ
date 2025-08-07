#!/usr/bin/env node

/**
 * 🚀 Script de Verificación - Sistema de Evaluaciones TAQ
 * Este script verifica que todas las dependencias y configuraciones estén correctas
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Verificando instalación del proyecto...');
console.log('==============================================');

let errores = [];
let advertencias = [];

// Función para verificar si existe un archivo
function verificarArchivo(ruta, descripcion) {
    if (fs.existsSync(ruta)) {
        console.log(`✅ ${descripcion}: ${ruta}`);
        return true;
    } else {
        console.log(`❌ ${descripcion}: ${ruta} - NO ENCONTRADO`);
        errores.push(`${descripcion}: ${ruta}`);
        return false;
    }
}

// Función para verificar si existe un directorio
function verificarDirectorio(ruta, descripcion) {
    if (fs.existsSync(ruta) && fs.statSync(ruta).isDirectory()) {
        console.log(`✅ ${descripcion}: ${ruta}`);
        return true;
    } else {
        console.log(`❌ ${descripcion}: ${ruta} - NO ENCONTRADO`);
        errores.push(`${descripcion}: ${ruta}`);
        return false;
    }
}

// Función para verificar dependencias
function verificarDependencias(packageJsonPath, descripcion) {
    if (!fs.existsSync(packageJsonPath)) {
        console.log(`❌ ${descripcion}: package.json no encontrado`);
        errores.push(`${descripcion}: package.json no encontrado`);
        return;
    }

    try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        console.log(`✅ ${descripcion}: package.json válido`);
        
        if (packageJson.dependencies) {
            console.log(`   📦 Dependencias: ${Object.keys(packageJson.dependencies).length}`);
        }
        
        if (packageJson.devDependencies) {
            console.log(`   🔧 DevDependencies: ${Object.keys(packageJson.devDependencies).length}`);
        }
    } catch (error) {
        console.log(`❌ ${descripcion}: package.json inválido - ${error.message}`);
        errores.push(`${descripcion}: package.json inválido`);
    }
}

// Función para verificar versión de Node.js
function verificarNodeVersion() {
    try {
        const version = process.version;
        console.log(`✅ Node.js versión: ${version}`);
        
        const majorVersion = parseInt(version.slice(1).split('.')[0]);
        if (majorVersion < 16) {
            console.log(`⚠️  Advertencia: Node.js ${version} es menor a la versión recomendada (16.x)`);
            advertencias.push(`Node.js ${version} es menor a la versión recomendada`);
        }
    } catch (error) {
        console.log(`❌ Error al verificar versión de Node.js: ${error.message}`);
        errores.push('Error al verificar versión de Node.js');
    }
}

// Función para verificar npm
function verificarNpm() {
    try {
        const version = execSync('npm --version', { encoding: 'utf8' }).trim();
        console.log(`✅ npm versión: ${version}`);
    } catch (error) {
        console.log(`❌ Error al verificar npm: ${error.message}`);
        errores.push('Error al verificar npm');
    }
}

// Verificaciones principales
console.log('\n📋 Verificando estructura del proyecto...');

// Verificar archivos principales
verificarArchivo('package.json', 'Package.json principal');
verificarArchivo('backend/package.json', 'Package.json del backend');
verificarArchivo('frontend/administrador/package.json', 'Package.json del administrador');
verificarArchivo('frontend/evaluacion/package.json', 'Package.json de evaluaciones');

// Verificar archivos de configuración
verificarArchivo('backend/start_backend.js', 'Archivo de inicio del backend');
verificarArchivo('backend/database/init.sql', 'Script de base de datos');
verificarArchivo('backend/env.example', 'Archivo de ejemplo de variables de entorno');

// Verificar directorios
verificarDirectorio('backend', 'Directorio del backend');
verificarDirectorio('frontend/administrador', 'Directorio del administrador');
verificarDirectorio('frontend/evaluacion', 'Directorio de evaluaciones');

// Verificar archivos de configuración de frontend
verificarArchivo('frontend/administrador/src/config/config.js', 'Configuración del administrador');
verificarArchivo('frontend/evaluacion/src/config/config.js', 'Configuración de evaluaciones');

// Verificar archivos .htaccess
verificarArchivo('frontend/administrador/public/.htaccess', '.htaccess del administrador');
verificarArchivo('frontend/evaluacion/public/.htaccess', '.htaccess de evaluaciones');

console.log('\n📦 Verificando dependencias...');

// Verificar dependencias de cada parte
verificarDependencias('package.json', 'Proyecto principal');
verificarDependencias('backend/package.json', 'Backend');
verificarDependencias('frontend/administrador/package.json', 'Frontend administrador');
verificarDependencias('frontend/evaluacion/package.json', 'Frontend evaluaciones');

console.log('\n🔧 Verificando entorno...');

// Verificar Node.js y npm
verificarNodeVersion();
verificarNpm();

// Verificar si node_modules existen
console.log('\n📁 Verificando instalación de dependencias...');

const directoriosNodeModules = [
    'node_modules',
    'backend/node_modules',
    'frontend/administrador/node_modules',
    'frontend/evaluacion/node_modules'
];

directoriosNodeModules.forEach(dir => {
    if (fs.existsSync(dir)) {
        console.log(`✅ ${dir} - Instalado`);
    } else {
        console.log(`⚠️  ${dir} - No instalado (ejecuta 'npm run install:all')`);
        advertencias.push(`${dir} no instalado`);
    }
});

// Verificar builds
console.log('\n🔨 Verificando builds...');

const directoriosBuild = [
    'frontend/administrador/build',
    'frontend/evaluacion/build'
];

directoriosBuild.forEach(dir => {
    if (fs.existsSync(dir)) {
        console.log(`✅ ${dir} - Construido`);
    } else {
        console.log(`⚠️  ${dir} - No construido (ejecuta 'npm run build:all')`);
        advertencias.push(`${dir} no construido`);
    }
});

// Resumen
console.log('\n==============================================');
console.log('📊 RESUMEN DE VERIFICACIÓN');
console.log('==============================================');

if (errores.length === 0 && advertencias.length === 0) {
    console.log('🎉 ¡Todo está perfecto! El proyecto está listo para producción.');
} else {
    if (errores.length > 0) {
        console.log(`❌ Errores encontrados: ${errores.length}`);
        errores.forEach(error => console.log(`   - ${error}`));
    }
    
    if (advertencias.length > 0) {
        console.log(`⚠️  Advertencias: ${advertencias.length}`);
        advertencias.forEach(warning => console.log(`   - ${warning}`));
    }
    
    console.log('\n🔧 Para solucionar los problemas:');
    console.log('1. Ejecuta: npm run install:all');
    console.log('2. Ejecuta: npm run build:all');
    console.log('3. Vuelve a ejecutar este script de verificación');
}

console.log('\n🚀 Para desplegar en cPanel:');
console.log('1. Ejecuta: ./install-production.sh (Linux/Mac)');
console.log('2. O ejecuta: install-production.bat (Windows)');
console.log('3. Sigue las instrucciones en GUIA_CPANEL_DEPLOYMENT.md');

console.log('\n==============================================');
