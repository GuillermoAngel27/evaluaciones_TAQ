#!/bin/bash

# 🚀 Script de Instalación para Producción - Sistema de Evaluaciones TAQ
# Este script prepara el proyecto para ser desplegado en cPanel

echo "🚀 Iniciando instalación para producción..."
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

# Crear directorios de distribución
echo "📁 Creando estructura de distribución..."
mkdir -p dist/api
mkdir -p dist/admin
mkdir -p dist/evaluacion

# Copiar backend
echo "📋 Copiando backend..."
cp -r backend/* dist/api/

# Copiar frontends construidos
echo "📋 Copiando panel de administración..."
cp -r frontend/administrador/build/* dist/admin/

echo "📋 Copiando aplicación de evaluaciones..."
cp -r frontend/evaluacion/build/* dist/evaluacion/

# Crear archivo .env de ejemplo para producción
echo "⚙️ Creando archivo .env de ejemplo..."
cat > dist/api/.env.example << EOF
# Configuración de la base de datos MySQL (cPanel)
DB_HOST=localhost
DB_USER=tuusuario_eval_user
DB_PASSWORD=tu_password_seguro
DB_NAME=tuusuario_evaluaciones
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
JWT_SECRET=tu_jwt_secret_super_seguro_aqui_2024
EOF

# Crear archivo README para cPanel
echo "📝 Creando README para cPanel..."
cat > dist/README_CPANEL.md << EOF
# 🚀 Instrucciones para cPanel

## 📁 Estructura de archivos:
- \`api/\` - Backend Node.js (subir a public_html/api/)
- \`admin/\` - Panel de administración (subir a public_html/admin/)
- \`evaluacion/\` - Aplicación de evaluaciones (subir a public_html/evaluacion/)

## 🔧 Pasos para cPanel:

1. **Crear base de datos MySQL** en cPanel
2. **Importar** \`api/database/init.sql\` a la base de datos
3. **Configurar** el archivo \`api/.env\` con tus credenciales
4. **Crear aplicación Node.js** apuntando a \`api/start_backend.js\`
5. **Crear subdominios**:
   - api.taqro.com.mx → public_html/api
   - admine.taqro.com.mx → public_html/admin
   - evaluacion.taqro.com.mx → public_html/evaluacion
6. **Instalar SSL** para cada subdominio
7. **Reiniciar** la aplicación Node.js

## 🔑 Credenciales por defecto:
- Usuario: admin
- Contraseña: admin2025

⚠️ **IMPORTANTE**: Cambia las credenciales después del primer login.

## 📞 URLs finales:
- API: https://api.taqro.com.mx
- Admin: https://admine.taqro.com.mx
- Evaluación: https://evaluacion.taqro.com.mx
EOF

echo ""
echo "✅ ¡Instalación completada exitosamente!"
echo "================================================"
echo "📁 Los archivos están listos en la carpeta 'dist/'"
echo "📋 Revisa 'dist/README_CPANEL.md' para las instrucciones de cPanel"
echo ""
echo "🚀 Próximos pasos:"
echo "1. Subir la carpeta 'dist/api/' a public_html/api/ en cPanel"
echo "2. Subir la carpeta 'dist/admin/' a public_html/admin/ en cPanel"
echo "3. Subir la carpeta 'dist/evaluacion/' a public_html/evaluacion/ en cPanel"
echo "4. Seguir las instrucciones en README_CPANEL.md"
echo ""
echo "🎉 ¡Tu proyecto está listo para producción!"
