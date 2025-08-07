# 🚀 Guía de Instalación Manual en cPanel

## 📁 Estructura de Directorios en cPanel

```
public_html/
└── subdominios/
    └── evaluaciones/
        ├── frontend/
        │   ├── administrador/     # admine.taqro.com.mx
        │   └── evaluacion/        # evaluacion.taqro.com.mx
        └── backend/               # api.taqro.com.mx
```

## 🔧 Paso 1: Preparar el proyecto localmente

### 1.1 Clonar y preparar
```bash
git clone https://github.com/GuillermoAngel27/evaluaciones_TAQ.git
cd evaluaciones_TAQ

# Instalar dependencias del proyecto raíz
npm install

# Instalar dependencias del backend
cd backend
npm install --production
cd ..

# Instalar dependencias del frontend administrador
cd frontend/administrador
npm install
cd ../..

# Instalar dependencias del frontend evaluacion
cd frontend/evaluacion
npm install
cd ../..
```

### 1.2 Construir los frontends
```bash
# Construir panel de administración
cd frontend/administrador
npm run build
cd ../..

# Construir aplicación de evaluaciones
cd frontend/evaluacion
npm run build
cd ../..
```

## 📤 Paso 2: Subir archivos a cPanel

### 2.1 Subir backend
- Sube toda la carpeta `backend/` a `public_html/subdominios/evaluaciones/backend/`

### 2.2 Subir frontends construidos
- Sube la carpeta `frontend/administrador/build/` a `public_html/subdominios/evaluaciones/frontend/administrador/`
- Sube la carpeta `frontend/evaluacion/build/` a `public_html/subdominios/evaluaciones/frontend/evaluacion/`

## ⚙️ Paso 3: Configurar en cPanel

### 3.1 Configurar subdominios
1. Ve a **Subdomains** en cPanel
2. Crea los subdominios:
   - `api.taqro.com.mx` → `public_html/subdominios/evaluaciones/backend`
   - `admine.taqro.com.mx` → `public_html/subdominios/evaluaciones/frontend/administrador`
   - `evaluacion.taqro.com.mx` → `public_html/subdominios/evaluaciones/frontend/evaluacion`

### 3.2 Configurar aplicación Node.js
1. Ve a **Setup Node.js App**
2. Crea aplicación:
   - **Node.js version**: 16.x o superior
   - **Application mode**: Production
   - **Application root**: `/home/tuusuario/public_html/subdominios/evaluaciones/backend`
   - **Application URL**: `https://api.taqro.com.mx`
   - **Application startup file**: `start_backend.js`
   - **Passenger port**: 3000

### 3.3 Configurar archivo .env
Crea archivo `.env` en `public_html/subdominios/evaluaciones/backend/.env`:

```env
# Configuración de la base de datos MySQL (cPanel)
DB_HOST=64.69.39.139
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

## 🔧 Paso 4: Instalar dependencias en cPanel

### 4.1 Usar Terminal de cPanel
1. Ve a **Terminal** en cPanel
2. Navega al directorio del backend:
```bash
cd public_html/subdominios/evaluaciones/backend
npm install --production
```

### 4.2 Verificar instalación
```bash
# Verificar que las dependencias se instalaron
ls -la node_modules

# Verificar que el archivo .env existe
ls -la .env

# Verificar que start_backend.js existe
ls -la start_backend.js
```

## 🌐 Paso 5: Configurar .htaccess

### 5.1 Para admine.taqro.com.mx
Crear archivo `.htaccess` en `public_html/subdominios/evaluaciones/frontend/administrador/.htaccess`:

```apache
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
```

### 5.2 Para evaluacion.taqro.com.mx
Crear archivo `.htaccess` en `public_html/subdominios/evaluaciones/frontend/evaluacion/.htaccess`:

```apache
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
```

## 🚀 Paso 6: Iniciar la aplicación

### 6.1 Reiniciar aplicación Node.js
1. Ve a **Setup Node.js App**
2. Encuentra tu aplicación
3. Haz clic en **Restart**

### 6.2 Verificar que todo funcione
1. **API**: `https://api.taqro.com.mx/health`
2. **Admin**: `https://admine.taqro.com.mx`
3. **Evaluación**: `https://evaluacion.taqro.com.mx`

## 🔑 Credenciales por Defecto
- **Usuario**: `admin`
- **Contraseña**: `admin2025`

## ⚠️ Solución de Problemas

### Error: "Cannot find module"
```bash
cd public_html/subdominios/evaluaciones/backend
npm install --production
```

### Error: "Database connection failed"
- Verifica que el archivo `.env` existe y tiene las credenciales correctas
- Verifica que la base de datos está creada y accesible

### Error: "CORS blocked"
- Verifica que las URLs en `CORS_ORIGIN` son correctas
- Asegúrate de que usas HTTPS

### Error: "React Router not working"
- Verifica que los archivos `.htaccess` están en las ubicaciones correctas
- Asegúrate de que mod_rewrite está habilitado

## 📞 URLs Finales
- **API**: `https://api.taqro.com.mx`
- **Admin**: `https://admine.taqro.com.mx`
- **Evaluación**: `https://evaluacion.taqro.com.mx`

¡Tu aplicación debería estar funcionando correctamente! 🎉
