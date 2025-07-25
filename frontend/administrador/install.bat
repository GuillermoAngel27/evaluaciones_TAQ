@echo off
echo ========================================
echo Instalando Panel de Administracion
echo ========================================
echo.

echo Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no esta instalado
    echo Por favor instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js encontrado: 
node --version

echo.
echo Instalando dependencias...
npm install

if %errorlevel% neq 0 (
    echo ERROR: Error al instalar dependencias
    pause
    exit /b 1
)

echo.
echo ========================================
echo Instalacion completada exitosamente!
echo ========================================
echo.
echo Para iniciar el servidor de desarrollo:
echo npm start
echo.
echo Para construir para produccion:
echo npm run build
echo.
pause 