#!/bin/bash

echo "========================================"
echo "Instalando Panel de Administracion"
echo "========================================"
echo

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js no está instalado"
    echo "Por favor instala Node.js desde https://nodejs.org/"
    exit 1
fi

echo "Node.js encontrado:"
node --version

echo
echo "Instalando dependencias..."
npm install

if [ $? -ne 0 ]; then
    echo "ERROR: Error al instalar dependencias"
    exit 1
fi

echo
echo "========================================"
echo "Instalación completada exitosamente!"
echo "========================================"
echo
echo "Para iniciar el servidor de desarrollo:"
echo "npm start"
echo
echo "Para construir para producción:"
echo "npm run build"
echo 