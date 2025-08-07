#!/bin/bash

# 🚀 Script de Instalación Manual para cPanel - Sistema de Evaluaciones TAQ
# Este script prepara el proyecto para la estructura específica de cPanel

echo "🚀 Iniciando instalación manual para cPanel..."
echo "================================================"

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

# Verificar que Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no está instalado. Por favor instala Node.js 16 o superior."
    exit 1
fi

# Verificar que npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm no está instalado."
    exit 1
fi

echo "✅ Node.js y npm verificados"

# Limpiar instalaciones previas
echo "🧹 Limpiando instalaciones previas..."
rm -rf node_modules
rm -rf frontend/administrador/node_modules
rm -rf frontend/evaluacion/node_modules
rm -rf backend/node_modules

# Instalar dependencias del proyecto raíz
echo "📦 Instalando dependencias del proyecto raíz..."
npm install

# Instalar dependencias del backend
echo "📦 Instalando dependencias del backend..."
cd backend
npm install --production
cd ..

# Instalar dependencias del frontend administrador
echo "📦 Instalando dependencias del frontend administrador..."
cd frontend/administrador
npm install
cd ../..

# Instalar dependencias del frontend evaluacion
echo "📦 Instalando dependencias del frontend evaluacion..."
cd frontend/evaluacion
npm install
cd ../..

# Construir frontends para producción
echo "🔨 Construyendo frontends para producción..."

echo "🔨 Construyendo panel de administración..."
cd frontend/administrador
npm run build
cd ../..

echo "🔨 Construyendo aplicación de evaluaciones..."
cd frontend/evaluacion
npm run build
cd ../..

# Crear directorios de distribución para estructura manual
echo "📁 Creando estructura de distribución manual..."
mkdir -p dist-manual/backend
mkdir -p dist-manual/frontend/administrador
mkdir -p dist-manual/frontend/evaluacion

# Copiar backend
echo "📋 Copiando backend..."
cp -r backend/* dist-manual/backend/

# Copiar frontends construidos
echo "📋 Copiando panel de administración..."
cp -r frontend/administrador/build/* dist-manual/frontend/administrador/

echo "📋 Copiando aplicación de evaluaciones..."
cp -r frontend/evaluacion/build/* dist-manual/frontend/evaluacion/

# Crear archivo .env para producción
echo "⚙️ Creando archivo .env para producción..."
cat > dist-manual/backend/.env << EOF
# Configuración de la base de datos MySQL (cPanel)
DB_HOST=64.69.39.139
DB_USER=taqrocom_evaluaciones
DB_PASSWORD=Tvk\$JASJbT]Vsh[R
DB_NAME=taqrocom_evaluaciones
DB_PORT=3306

# Configuración del servidor
PORT=3000
NODE_ENV=production

# Configuración de CORS (URLs de producción)
CORS_ORIGIN=https://api.taqro.com.mx,https://admine.taqro.com.mx,https://evaluacion.taqro.com.mx

# Configuración de cookies para producción
COOKIE_SECURE=true
COOKIE_SAMESITE=lax
COOKIE_DOMAIN=.taqro.com.mx
COOKIE_HTTPONLY=true
COOKIE_MAX_AGE=86400000

# JWT Secret (OBLIGATORIO para autenticación)
JWT_SECRET=taqro_evaluaciones_jwt_secret_2024_super_seguro
EOF

# Crear archivos .htaccess
echo "📝 Creando archivos .htaccess..."

# .htaccess para administrador
cat > dist-manual/frontend/administrador/.htaccess << EOF
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Configuración de seguridad
Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "DENY"
Header always set X-XSS-Protection "1; mode=block"
EOF

# .htaccess para evaluacion
cat > dist-manual/frontend/evaluacion/.htaccess << EOF
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Configuración de seguridad
Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "DENY"
Header always set X-XSS-Protection "1; mode=block"
EOF

# Crear archivo README para instalación manual
echo "📝 Creando README para instalación manual..."
cat > dist-manual/README_INSTALACION_MANUAL.md << EOF
# 🚀 Instrucciones para Instalación Manual en cPanel

## 📁 Estructura de archivos:
- \`backend/\` - Backend Node.js (subir a public_html/subdominios/evaluaciones/backend/)
- \`frontend/administrador/\` - Panel de administración (subir a public_html/subdominios/evaluaciones/frontend/administrador/)
- \`frontend/evaluacion/\` - Aplicación de evaluaciones (subir a public_html/subdominios/evaluaciones/frontend/evaluacion/)

## 🔧 Pasos para cPanel:

1. **Subir archivos**:
   - Subir \`backend/\` → public_html/subdominios/evaluaciones/backend/
   - Subir \`frontend/administrador/\` → public_html/subdominios/evaluaciones/frontend/administrador/
   - Subir \`frontend/evaluacion/\` → public_html/subdominios/evaluaciones/frontend/evaluacion/

2. **Crear subdominios**:
   - api.taqro.com.mx → public_html/subdominios/evaluaciones/backend
   - admine.taqro.com.mx → public_html/subdominios/evaluaciones/frontend/administrador
   - evaluacion.taqro.com.mx → public_html/subdominios/evaluaciones/frontend/evaluacion

3. **Crear aplicación Node.js**:
   - Application root: /home/tuusuario/public_html/subdominios/evaluaciones/backend
   - Application URL: https://api.taqro.com.mx
   - Application startup file: start_backend.js

4. **Instalar dependencias del backend**:
   \`\`\`bash
   cd public_html/subdominios/evaluaciones/backend
   npm install --production
   \`\`\`

5. **Instalar SSL** para cada subdominio
6. **Reiniciar** la aplicación Node.js

## 🔑 Credenciales por defecto:
- Usuario: admin
- Contraseña: admin2025

⚠️ **IMPORTANTE**: Cambia las credenciales después del primer login.

## 📞 URLs finales:
- API: https://api.taqro.com.mx
- Admin: https://admine.taqro.com.mx
- Evaluación: https://evaluacion.taqro.com.mx

## ⚠️ Notas importantes:
- El archivo .env ya está configurado con las credenciales correctas
- Los archivos .htaccess ya están creados para React Router
- Asegúrate de que mod_rewrite esté habilitado en el servidor
EOF

echo ""
echo "✅ ¡Instalación manual completada exitosamente!"
echo "================================================"
echo "📁 Los archivos están listos en la carpeta 'dist-manual/'"
echo "📋 Revisa 'dist-manual/README_INSTALACION_MANUAL.md' para las instrucciones"
echo ""
echo "🚀 Próximos pasos:"
echo "1. Subir 'dist-manual/backend/' a public_html/subdominios/evaluaciones/backend/"
echo "2. Subir 'dist-manual/frontend/administrador/' a public_html/subdominios/evaluaciones/frontend/administrador/"
echo "3. Subir 'dist-manual/frontend/evaluacion/' a public_html/subdominios/evaluaciones/frontend/evaluacion/"
echo "4. Seguir las instrucciones en README_INSTALACION_MANUAL.md"
echo ""
echo "🎉 ¡Tu proyecto está listo para la instalación manual en cPanel!"
