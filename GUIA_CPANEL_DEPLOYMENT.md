# 🚀 Guía Completa para Desplegar en cPanel - Sistema de Evaluaciones TAQ

## 📋 Requisitos Previos

### En cPanel necesitas:
- **Node.js** habilitado (versión 16 o superior)
- **MySQL** habilitado
- **Subdominios** configurados:
  - `api.tudominio.com` (para el backend)
  - `admin.tudominio.com` (para el panel de administración)
  - `evaluacion.tudominio.com` (para las evaluaciones)

## 🔧 Paso 1: Preparar el Proyecto Localmente

### 1.1 Clonar el repositorio
```bash
git clone https://github.com/GuillermoAngel27/evaluaciones_TAQ.git
cd evaluaciones_TAQ
```

### 1.2 Instalar todas las dependencias
```bash
npm run install:all
```

### 1.3 Construir los frontends para producción
```bash
npm run build:all
```

## 🗄️ Paso 2: Configurar la Base de Datos en cPanel

### 2.1 Crear base de datos MySQL
1. Ve a **MySQL Databases** en cPanel
2. Crea una nueva base de datos: `tuusuario_evaluaciones`
3. Crea un usuario de base de datos: `tuusuario_eval_user`
4. Asigna el usuario a la base de datos con todos los privilegios

### 2.2 Importar la estructura de la base de datos
1. Ve a **phpMyAdmin**
2. Selecciona tu base de datos
3. Ve a **Import**
4. Sube el archivo `backend/database/init.sql`

## ⚙️ Paso 3: Configurar Variables de Entorno

### 3.1 Backend (.env)
Crea un archivo `.env` en la carpeta `backend/` con:

```env
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
CORS_ORIGIN=https://api.tudominio.com,https://admin.tudominio.com,https://evaluacion.tudominio.com

# Configuración de cookies para producción
COOKIE_SECURE=true
COOKIE_SAMESITE=lax
COOKIE_DOMAIN=.tudominio.com
COOKIE_HTTPONLY=true
COOKIE_MAX_AGE=86400000

# JWT Secret (OBLIGATORIO para autenticación)
JWT_SECRET=tu_jwt_secret_super_seguro_aqui_2024
```

### 3.2 Frontend Administrador
En `frontend/administrador/src/config/` crea `config.js`:

```javascript
const config = {
  API_URL: 'https://api.tudominio.com',
  APP_NAME: 'Sistema de Evaluaciones TAQ'
};

export default config;
```

### 3.3 Frontend Evaluación
En `frontend/evaluacion/src/config/` crea `config.js`:

```javascript
const config = {
  API_URL: 'https://api.tudominio.com',
  APP_NAME: 'Evaluación TAQ'
};

export default config;
```

## 📁 Paso 4: Subir Archivos a cPanel

### 4.1 Estructura de directorios en cPanel:
```
public_html/
├── api/                    # Backend Node.js
│   ├── backend/
│   ├── package.json
│   └── .env
├── admin/                  # Panel de administración
│   └── build/
└── evaluacion/            # Aplicación de evaluaciones
    └── build/
```

### 4.2 Subir archivos:
1. **Backend**: Sube toda la carpeta `backend/` a `public_html/api/`
2. **Admin**: Sube la carpeta `build/` de `frontend/administrador/` a `public_html/admin/`
3. **Evaluación**: Sube la carpeta `build/` de `frontend/evaluacion/` a `public_html/evaluacion/`

## 🔧 Paso 5: Configurar Node.js en cPanel

### 5.1 Crear aplicación Node.js
1. Ve a **Setup Node.js App** en cPanel
2. Crea una nueva aplicación:
   - **Node.js version**: 16.x o superior
   - **Application mode**: Production
   - **Application root**: `/home/tuusuario/public_html/api`
   - **Application URL**: `https://api.tudominio.com`
   - **Application startup file**: `start_backend.js`
   - **Passenger port**: 3000

### 5.2 Instalar dependencias del backend
1. Ve a **Terminal** en cPanel
2. Navega al directorio del backend:
```bash
cd public_html/api
npm install --production
```

## 🌐 Paso 6: Configurar Subdominios

### 6.1 Crear subdominios
1. Ve a **Subdomains** en cPanel
2. Crea los siguientes subdominios:
   - `api.tudominio.com` → `public_html/api`
   - `admin.tudominio.com` → `public_html/admin`
   - `evaluacion.tudominio.com` → `public_html/evaluacion`

### 6.2 Configurar .htaccess para React Router

**Para admin.tudominio.com** (crear `public_html/admin/.htaccess`):
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

**Para evaluacion.tudominio.com** (crear `public_html/evaluacion/.htaccess`):
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

## 🔒 Paso 7: Configurar SSL/HTTPS

1. Ve a **SSL/TLS** en cPanel
2. Instala certificados SSL para cada subdominio:
   - `api.tudominio.com`
   - `admin.tudominio.com`
   - `evaluacion.tudominio.com`

## 🚀 Paso 8: Iniciar la Aplicación

### 8.1 Iniciar el backend
1. Ve a **Setup Node.js App**
2. Encuentra tu aplicación
3. Haz clic en **Restart**

### 8.2 Verificar que todo funcione
1. **API**: `https://api.tudominio.com/health`
2. **Admin**: `https://admin.tudominio.com`
3. **Evaluación**: `https://evaluacion.tudominio.com`

## 🔧 Paso 9: Configuraciones Adicionales

### 9.1 Configurar dominio personalizado (opcional)
Si quieres usar un dominio personalizado:
1. Actualiza las variables de entorno
2. Actualiza los archivos de configuración de los frontends
3. Configura los DNS del dominio

### 9.2 Configurar respaldos automáticos
1. Ve a **Backup** en cPanel
2. Configura respaldos automáticos de la base de datos

## 🐛 Solución de Problemas Comunes

### Error: "Cannot find module"
```bash
cd public_html/api
npm install
```

### Error: "Database connection failed"
- Verifica las credenciales en el archivo `.env`
- Asegúrate de que la base de datos existe
- Verifica que el usuario tiene permisos

### Error: "CORS blocked"
- Verifica que las URLs en `CORS_ORIGIN` son correctas
- Asegúrate de que usas HTTPS en producción

### Error: "React Router not working"
- Verifica que el archivo `.htaccess` está configurado correctamente
- Asegúrate de que mod_rewrite está habilitado

## 📞 Credenciales por Defecto

- **Usuario admin**: `admin`
- **Contraseña admin**: `admin2025`

**⚠️ IMPORTANTE**: Cambia estas credenciales después del primer inicio de sesión.

## 🔄 Mantenimiento

### Actualizar la aplicación:
1. Sube los nuevos archivos
2. Reinicia la aplicación Node.js
3. Limpia la caché del navegador

### Ver logs:
1. Ve a **Setup Node.js App**
2. Haz clic en **View Logs**

---

## ✅ Checklist de Verificación

- [ ] Base de datos creada y configurada
- [ ] Variables de entorno configuradas
- [ ] Archivos subidos correctamente
- [ ] Aplicación Node.js creada y funcionando
- [ ] Subdominios configurados
- [ ] SSL/HTTPS configurado
- [ ] .htaccess configurado para React Router
- [ ] API respondiendo en `/health`
- [ ] Frontends accesibles
- [ ] Login funcionando
- [ ] Credenciales admin cambiadas

¡Tu aplicación debería estar funcionando correctamente en cPanel! 🎉
