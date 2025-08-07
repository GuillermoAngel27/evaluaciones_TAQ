@echo off
chcp 65001 >nul

REM 🚀 Script de Instalación para Producción - Sistema de Evaluaciones TAQ
REM Este script prepara el proyecto para ser desplegado en cPanel

echo 🚀 Iniciando instalación para producción...
echo ================================================

REM Verificar que estamos en el directorio correcto
if not exist "package.json" (
    echo ❌ Error: No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto.
    pause
    exit /b 1
)

REM Verificar que Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Node.js no está instalado. Por favor instala Node.js 16 o superior.
    pause
    exit /b 1
)

REM Verificar que npm está instalado
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: npm no está instalado.
    pause
    exit /b 1
)

echo ✅ Node.js y npm verificados

REM Limpiar instalaciones previas
echo 🧹 Limpiando instalaciones previas...
if exist "node_modules" rmdir /s /q "node_modules"
if exist "frontend\administrador\node_modules" rmdir /s /q "frontend\administrador\node_modules"
if exist "frontend\evaluacion\node_modules" rmdir /s /q "frontend\evaluacion\node_modules"
if exist "backend\node_modules" rmdir /s /q "backend\node_modules"

REM Instalar dependencias del proyecto raíz
echo 📦 Instalando dependencias del proyecto raíz...
call npm install

REM Instalar dependencias del backend
echo 📦 Instalando dependencias del backend...
cd backend
call npm install --production
cd ..

REM Instalar dependencias del frontend administrador
echo 📦 Instalando dependencias del frontend administrador...
cd frontend\administrador
call npm install
cd ..\..

REM Instalar dependencias del frontend evaluacion
echo 📦 Instalando dependencias del frontend evaluacion...
cd frontend\evaluacion
call npm install
cd ..\..

REM Construir frontends para producción
echo 🔨 Construyendo frontends para producción...

echo 🔨 Construyendo panel de administración...
cd frontend\administrador
call npm run build
cd ..\..

echo 🔨 Construyendo aplicación de evaluaciones...
cd frontend\evaluacion
call npm run build
cd ..\..

REM Crear directorios de distribución
echo 📁 Creando estructura de distribución...
if not exist "dist" mkdir "dist"
if not exist "dist\api" mkdir "dist\api"
if not exist "dist\admin" mkdir "dist\admin"
if not exist "dist\evaluacion" mkdir "dist\evaluacion"

REM Copiar backend
echo 📋 Copiando backend...
xcopy "backend\*" "dist\api\" /E /I /Y

REM Copiar frontends construidos
echo 📋 Copiando panel de administración...
xcopy "frontend\administrador\build\*" "dist\admin\" /E /I /Y

echo 📋 Copiando aplicación de evaluaciones...
xcopy "frontend\evaluacion\build\*" "dist\evaluacion\" /E /I /Y

REM Crear archivo .env de ejemplo para producción
echo ⚙️ Creando archivo .env de ejemplo...
(
echo # Configuración de la base de datos MySQL ^(cPanel^)
echo DB_HOST=localhost
echo DB_USER=tuusuario_eval_user
echo DB_PASSWORD=tu_password_seguro
echo DB_NAME=tuusuario_evaluaciones
echo DB_PORT=3306
echo.
echo # Configuración del servidor
echo PORT=3000
echo NODE_ENV=production
echo.
echo # Configuración de CORS ^(URLs de producción^)
echo CORS_ORIGIN=https://api.tudominio.com,https://admin.tudominio.com,https://evaluacion.tudominio.com
echo.
echo # Configuración de cookies para producción
echo COOKIE_SECURE=true
echo COOKIE_SAMESITE=lax
echo COOKIE_DOMAIN=.tudominio.com
echo COOKIE_HTTPONLY=true
echo COOKIE_MAX_AGE=86400000
echo.
echo # JWT Secret ^(OBLIGATORIO para autenticación^)
echo JWT_SECRET=tu_jwt_secret_super_seguro_aqui_2024
) > "dist\api\.env.example"

REM Crear archivo README para cPanel
echo 📝 Creando README para cPanel...
(
echo # 🚀 Instrucciones para cPanel
echo.
echo ## 📁 Estructura de archivos:
echo - `api/` - Backend Node.js ^(subir a public_html/api/^)
echo - `admin/` - Panel de administración ^(subir a public_html/admin/^)
echo - `evaluacion/` - Aplicación de evaluaciones ^(subir a public_html/evaluacion/^)
echo.
echo ## 🔧 Pasos para cPanel:
echo.
echo 1. **Crear base de datos MySQL** en cPanel
echo 2. **Importar** `api/database/init.sql` a la base de datos
echo 3. **Configurar** el archivo `api/.env` con tus credenciales
echo 4. **Crear aplicación Node.js** apuntando a `api/start_backend.js`
echo 5. **Crear subdominios**:
echo    - api.tudominio.com → public_html/api
echo    - admin.tudominio.com → public_html/admin
echo    - evaluacion.tudominio.com → public_html/evaluacion
echo 6. **Instalar SSL** para cada subdominio
echo 7. **Reiniciar** la aplicación Node.js
echo.
echo ## 🔑 Credenciales por defecto:
echo - Usuario: admin
echo - Contraseña: admin2025
echo.
echo ⚠️ **IMPORTANTE**: Cambia las credenciales después del primer login.
echo.
echo ## 📞 URLs finales:
echo - API: https://api.tudominio.com
echo - Admin: https://admin.tudominio.com
echo - Evaluación: https://evaluacion.tudominio.com
) > "dist\README_CPANEL.md"

echo.
echo ✅ ¡Instalación completada exitosamente!
echo ================================================
echo 📁 Los archivos están listos en la carpeta 'dist/'
echo 📋 Revisa 'dist/README_CPANEL.md' para las instrucciones de cPanel
echo.
echo 🚀 Próximos pasos:
echo 1. Subir la carpeta 'dist/api/' a public_html/api/ en cPanel
echo 2. Subir la carpeta 'dist/admin/' a public_html/admin/ en cPanel
echo 3. Subir la carpeta 'dist/evaluacion/' a public_html/evaluacion/ en cPanel
echo 4. Seguir las instrucciones en README_CPANEL.md
echo.
echo 🎉 ¡Tu proyecto está listo para producción!
pause
