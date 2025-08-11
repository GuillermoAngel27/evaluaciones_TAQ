# 🚀 GUÍA COMPLETA DE INSTALACIÓN EN CPANEL - TAQRO EVALUACIONES

## 📋 **INFORMACIÓN DEL PROYECTO**
- **Dominio Principal**: taqro.com.mx
- **API**: api.taqro.com.mx
- **Administrador**: admine.taqro.com.mx  
- **Evaluación**: evaluacion.taqro.com.mx
- **Usuario cPanel**: taqrocom

---

## 🔧 **PASO 1: PREPARACIÓN INICIAL**

### **1.1 Conectar al Servidor**
```bash
ssh taqrocom@tu-servidor.com
```

### **1.2 Crear Directorios de Logs**
```bash
# Crear directorios necesarios
mkdir -p /home/taqrocom/.pm2/logs
mkdir -p /home/taqrocom/logs

# Verificar permisos
chmod 755 /home/taqrocom/.pm2
chmod 755 /home/taqrocom/logs
```

---

## 🖥️ **PASO 2: INSTALACIÓN DEL BACKEND (API)**

### **2.1 Ir al Directorio del Backend**
```bash
cd /home/taqrocom/public_html/subdominios/api
pwd
# Debe mostrar: /home/taqrocom/public_html/subdominios/api
```

### **2.2 Verificar Archivos de Configuración Existentes**

#### **Archivo .env (YA CONFIGURADO)**
```bash
# Verificar contenido del .env
cat .env
```

**Contenido actual (correcto):**
```env
# Configuración de la base de datos MySQL (cPanel)
DB_HOST=localhost
DB_USER=taqrocom_evaluaciones
DB_PASSWORD=Tvk$JASJbT]Vsh[R
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
```

#### **Archivo .htaccess (YA CONFIGURADO)**
```bash
# Verificar contenido del .htaccess
cat .htaccess
```

**Contenido actual (correcto):**
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
```

#### **Archivo ecosystem.config.js (YA CONFIGURADO)**
```bash
# Verificar contenido del ecosystem.config.js
cat ecosystem.config.js
```

**Contenido actual (correcto):**
```javascript
module.exports = {
  apps: [{
    name: 'api-backend',
    script: 'start_backend.js',
    cwd: '/home/taqrocom/public_html/subdominios/api',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/home/taqrocom/.pm2/logs/api-backend-error.log',
    out_file: '/home/taqrocom/.pm2/logs/api-backend-out.log',
    log_file: '/home/taqrocom/.pm2/logs/api-backend-combined.log',
    time: true
  }]
};
```

### **2.3 Instalar Dependencias del Backend**
```bash
# Verificar que estás en el directorio correcto
pwd
# Debe mostrar: /home/taqrocom/public_html/subdominios/api

# Instalar todas las dependencias
npm install

# Verificar que se instalaron correctamente
ls -la node_modules/
echo "✅ Dependencias del backend instaladas"
```

### **2.4 Crear Script de Gestión PM2**
```bash
# Crear script de gestión
nano /home/taqrocom/pm2-manager.sh
```

**Contenido del script:**
```bash
#!/bin/bash

# Configuración
API_DIR="/home/taqrocom/public_html/subdominios/api"
PM2_PATH="/home/taqrocom/nodejs/bin/pm2"
LOG_FILE="/home/taqrocom/pm2-manager.log"
NODE_PATH="/home/taqrocom/nodejs/bin"

# Configurar variables de entorno
export PATH="$NODE_PATH:$PATH"
export HOME="/home/taqrocom"
export PM2_HOME="/home/taqrocom/.pm2"

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> $LOG_FILE
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1"
}

check_api() {
    if $PM2_PATH list 2>/dev/null | grep -q "api-backend.*online"; then
        log "✅ API está ejecutándose correctamente"
        return 0
    else
        log "❌ API no está ejecutándose - iniciando..."
        return 1
    fi
}

start_api() {
    log "🚀 Iniciando API..."
    cd $API_DIR
    
    # Asegurar que PM2 esté disponible
    export PATH="$NODE_PATH:$PATH"
    
    # Iniciar la API
    $PM2_PATH start ecosystem.config.js
    
    # Esperar y verificar
    sleep 5
    
    if check_api; then
        log "✅ API iniciada correctamente"
        return 0
    else
        log "❌ ERROR: No se pudo iniciar la API"
        return 1
    fi
}

restart_api() {
    log "🔄 Reiniciando API..."
    cd $API_DIR
    export PATH="$NODE_PATH:$PATH"
    $PM2_PATH restart api-backend
    log "✅ API reiniciada"
}

health_check() {
    response=$(curl -s -o /dev/null -w "%{http_code}" https://api.taqro.com.mx/health 2>/dev/null)
    if [ "$response" = "200" ]; then
        log "✅ Health check: OK (200)"
        return 0
    else
        log "❌ Health check: ERROR ($response)"
        return 1
    fi
}

case "$1" in
    start) start_api ;;
    check) 
        if ! check_api; then 
            start_api
        fi 
        ;;
    restart) restart_api ;;
    health) health_check ;;
    status)
        echo "=== Estado PM2 ==="
        export PATH="$NODE_PATH:$PATH"
        $PM2_PATH status
        echo "=== Health Check ==="
        health_check
        ;;
    *) 
        echo "Uso: $0 {start|check|restart|health|status}"
        echo "Ejemplo: $0 start"
        ;;
esac
```

### **2.5 Hacer Ejecutable el Script**
```bash
chmod +x /home/taqrocom/pm2-manager.sh
echo "✅ Script PM2 manager creado y ejecutable"
```

### **2.6 Configurar Crontab para Persistencia**
```bash
# Editar crontab
crontab -e
```

**Reemplazar todo el contenido con:**
```bash
# Configuración del shell y PATH
SHELL="/usr/local/cpanel/bin/jailshell"
PATH="/usr/local/bin:/usr/bin:/bin:/home/taqrocom/nodejs/bin"
HOME="/home/taqrocom"

# Tarea existente de Softaculous
58 16 7 * * /usr/local/cpanel/3rdparty/bin/php /usr/local/cpanel/whostmgr/docroot/cgi/softaculous/cli.php --backup --auto=1 --insid=26_50530

# Iniciar PM2 automáticamente al reiniciar el servidor
@reboot /home/taqrocom/pm2-manager.sh start

# Verificar cada minuto si PM2 está ejecutándose
* * * * * /home/taqrocom/pm2-manager.sh check

# Health check cada 5 minutos
*/5 * * * * /home/taqrocom/pm2-manager.sh health

# Reiniciar PM2 cada día a las 3 AM
0 3 * * * /home/taqrocom/pm2-manager.sh restart

# Limpiar logs antiguos cada semana
0 2 * * 0 find /home/taqrocom -name "pm2-manager.log" -mtime +7 -delete
```

### **2.7 Iniciar la API con PM2**
```bash
# Verificar que estás en el directorio correcto
cd /home/taqrocom/public_html/subdominios/api
pwd

# Iniciar con PM2
pm2 start ecosystem.config.js

# Guardar configuración
pm2 save

# Verificar estado
pm2 status

echo "✅ Backend iniciado con PM2"
```

---

## 🎨 **PASO 3: INSTALACIÓN DEL FRONTEND ADMINISTRADOR**

### **3.1 Ir al Directorio del Administrador**
```bash
cd /home/taqrocom/public_html/subdominios/evaluaciones/frontend/administrador
pwd
# Debe mostrar: /home/taqrocom/public_html/subdominios/evaluaciones/frontend/administrador
```

### **3.2 Verificar Archivos de Configuración Existentes**

#### **Archivo .env (YA CONFIGURADO)**
```bash
# Verificar contenido del .env
cat .env
```

**Contenido actual (correcto):**
```env
# Configuración de la API (URL de producción)
REACT_APP_API_URL=https://api.taqro.com.mx/api

# API Key de Google Maps (opcional)
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Configuración del entorno
REACT_APP_ENV=production

# URL base de la aplicación
REACT_APP_BASE_URL=https://admine.taqro.com.mx
```

#### **Archivo .htaccess (YA CONFIGURADO)**
```bash
# Verificar contenido del .htaccess
cat .htaccess
```

**Contenido actual (correcto):**
```apache
RewriteEngine On

# Handle React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [QSA,L]

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# CORS headers
Header always set Access-Control-Allow-Origin "*"
Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
```

### **3.3 Instalar Dependencias del Administrador**
```bash
# Instalar todas las dependencias
npm install

# Verificar instalación
ls -la node_modules/
echo "✅ Dependencias del administrador instaladas"
```

### **3.4 Construir la Aplicación**
```bash
# Construir para producción
npm run build

# Verificar que se creó la carpeta build
ls -la build/
echo "✅ Aplicación administrador construida"
```

### **3.5 Verificar .htaccess en Build**
```bash
# Verificar .htaccess en build
cat build/.htaccess
```

**Contenido actual (correcto):**
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [QSA,L]
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Access-Control-Allow-Origin "*"
Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
```

---

## 📱 **PASO 4: INSTALACIÓN DEL FRONTEND EVALUACIÓN**

### **4.1 Ir al Directorio de Evaluación**
```bash
cd /home/taqrocom/public_html/subdominios/evaluaciones/frontend/evaluacion
pwd
# Debe mostrar: /home/taqrocom/public_html/subdominios/evaluaciones/frontend/evaluacion
```

### **4.2 Verificar Archivos de Configuración Existentes**

#### **Archivo .env (YA CONFIGURADO)**
```bash
# Verificar contenido del .env
cat .env
```

**Contenido actual (correcto):**
```env
# Configuración de la API (URL de producción)
REACT_APP_API_URL=https://api.taqro.com.mx/api

# Puerto (no necesario en producción)
PORT=3001
```

#### **Archivo .htaccess (YA CONFIGURADO)**
```bash
# Verificar contenido del .htaccess
cat .htaccess
```

**Contenido actual (correcto):**
```apache
RewriteEngine On

# Handle React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [QSA,L]

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# CORS headers
Header always set Access-Control-Allow-Origin "*"
Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
```

### **4.3 Instalar Dependencias de Evaluación**
```bash
# Instalar todas las dependencias
npm install

# Verificar instalación
ls -la node_modules/
echo "✅ Dependencias de evaluación instaladas"
```

### **4.4 Construir la Aplicación**
```bash
# Construir para producción
npm run build

# Verificar que se creó la carpeta build
ls -la build/
echo "✅ Aplicación evaluación construida"
```

### **4.5 Verificar .htaccess en Build**
```bash
# Verificar .htaccess en build
cat build/.htaccess
```

**Contenido actual (correcto):**
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [QSA,L]
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Access-Control-Allow-Origin "*"
Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
```

---

## 🔍 **PASO 5: VERIFICACIÓN Y PRUEBAS**

### **5.1 Verificar Estado de PM2**
```bash
# Ver estado
pm2 status

# Ver logs
pm2 logs api-backend --lines 10

echo "✅ Estado de PM2 verificado"
```

### **5.2 Probar API**
```bash
# Health check
curl https://api.taqro.com.mx/health

# Probar endpoint de autenticación
curl -X POST https://api.taqro.com.mx/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin2025"}'

echo "✅ API probada correctamente"
```

### **5.3 Probar Frontends**
```bash
# Probar administrador
curl -I https://admine.taqro.com.mx

# Probar evaluación
curl -I https://evaluacion.taqro.com.mx

echo "✅ Frontends probados correctamente"
```

---

## 🛠️ **PASO 6: VERIFICACIÓN FINAL**

### **6.1 Verificar que Todo Funciona**
```bash
echo "=== VERIFICACIÓN FINAL ==="

# 1. Verificar PM2
echo "1. Estado PM2:"
pm2 status

# 2. Verificar API
echo "2. Health Check API:"
curl -s https://api.taqro.com.mx/health | head -1

# 3. Verificar frontends
echo "3. Frontend Administrador:"
curl -s -I https://admine.taqro.com.mx | head -1

echo "4. Frontend Evaluación:"
curl -s -I https://evaluacion.taqro.com.mx | head -1

# 4. Verificar logs
echo "5. Últimos logs PM2 Manager:"
tail -5 /home/taqrocom/pm2-manager.log

echo "=== VERIFICACIÓN COMPLETADA ==="
```

### **6.2 Probar Persistencia de PM2**
```bash
echo "=== PRUEBA DE PERSISTENCIA ==="
echo "1. Estado actual:"
pm2 status

echo "2. Cerrar terminal (Ctrl+D)"
echo "3. Abrir nueva terminal"
echo "4. Conectar al servidor: ssh taqrocom@tu-servidor.com"
echo "5. Verificar que PM2 se reinició automáticamente:"
echo "   pm2 status"
echo "   curl https://api.taqro.com.mx/health"
```

---

## 📝 **RESUMEN DE COMANDOS EJECUTADOS**

```bash
# 1. Preparación
mkdir -p /home/taqrocom/.pm2/logs
mkdir -p /home/taqrocom/logs

# 2. Backend
cd /home/taqrocom/public_html/subdominios/api
npm install
chmod +x /home/taqrocom/pm2-manager.sh
crontab -e  # Agregar las tareas de crontab
pm2 start ecosystem.config.js
pm2 save

# 3. Administrador
cd /home/taqrocom/public_html/subdominios/evaluaciones/frontend/administrador
npm install
npm run build

# 4. Evaluación
cd /home/taqrocom/public_html/subdominios/evaluaciones/frontend/evaluacion
npm install
npm run build

# 5. Verificar
pm2 status
curl https://api.taqro.com.mx/health
curl -I https://admine.taqro.com.mx
curl -I https://evaluacion.taqro.com.mx
```

---

## 🚨 **SOLUCIÓN DE PROBLEMAS COMUNES**

### **Si PM2 no persiste:**
```bash
# Verificar crontab
crontab -l

# Verificar logs del script
tail -f /home/taqrocom/pm2-manager.log

# Probar manualmente
/home/taqrocom/pm2-manager.sh check
```

### **Si hay errores de CORS:**
```bash
# Verificar que .htaccess de la API no tenga headers CORS
cat /home/taqrocom/public_html/subdominios/api/.htaccess

# Reiniciar PM2
pm2 restart api-backend
```

### **Si hay errores de módulos:**
```bash
# Reinstalar dependencias
cd /home/taqrocom/public_html/subdominios/api
rm -rf node_modules package-lock.json
npm install
```

### **Si hay problemas de permisos:**
```bash
# Verificar permisos
ls -la /home/taqrocom/.pm2/
ls -la /home/taqrocom/pm2-manager.sh

# Corregir permisos si es necesario
chmod 755 /home/taqrocom/.pm2/
chmod +x /home/taqrocom/pm2-manager.sh
```

---

## ✅ **CHECKLIST DE VERIFICACIÓN**

- [ ] Directorios de logs creados
- [ ] Script PM2 manager creado y ejecutable
- [ ] Crontab configurado
- [ ] Backend instalado y ejecutándose
- [ ] Administrador instalado y construido
- [ ] Evaluación instalada y construida
- [ ] API respondiendo correctamente
- [ ] Frontends accesibles
- [ ] PM2 persistente después de cerrar terminal

---

## 🎯 **ESTADO FINAL ESPERADO**

Después de completar todos los pasos:

1. **API**: https://api.taqro.com.mx/health responde con status "ok"
2. **Administrador**: https://admine.taqro.com.mx carga correctamente
3. **Evaluación**: https://evaluacion.taqro.com.mx carga correctamente
4. **PM2**: Se ejecuta automáticamente y persiste después de reinicios
5. **Base de datos**: Conectada y funcionando
6. **Logs**: Generándose correctamente en /home/taqrocom/.pm2/logs/

---

## 📞 **SOPORTE**

Si encuentras algún problema durante la instalación:

1. Verificar logs: `pm2 logs api-backend`
2. Verificar script: `/home/taqrocom/pm2-manager.sh status`
3. Verificar crontab: `crontab -l`
4. Verificar permisos: `ls -la /home/taqrocom/`

**¡La instalación está completa cuando todos los elementos del checklist están marcados!** 🚀
