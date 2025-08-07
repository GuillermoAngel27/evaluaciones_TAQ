# 🔍 Diagnóstico de Problemas de Autenticación en Producción

## Problema Identificado
En producción, al iniciar sesión, el sistema redirige al inicio pero luego retorna al login, indicando un problema con la persistencia de la sesión.

## Cambios Realizados

### 1. Mejoras en CORS (backend/start_backend.js)
- Configuración más flexible de CORS que permite requests sin origin
- Logging de orígenes bloqueados para debugging
- Headers adicionales permitidos

### 2. Configuración de Cookies Mejorada (backend/config/cookies.js)
- SameSite configurado como 'lax' en desarrollo y 'strict' en producción
- Mejor manejo de dominios de cookies

### 3. Logging Mejorado
- Logs de debug en AuthContext para verificar errores de autenticación
- Logs en interceptores de API para identificar errores 401
- Logs en ProtectedRoute para rastrear redirecciones

### 4. Endpoints de Diagnóstico
- `/api/auth/test-cookies` - Verifica estado de cookies
- `/api/auth/test-auth` - Verifica autenticación
- `/api/auth/test-login` - Prueba login

## Pasos para Diagnosticar en Producción

### 1. Verificar Configuración de Entorno
```bash
# En el servidor de producción, verificar variables de entorno:
echo $NODE_ENV
echo $COOKIE_DOMAIN
echo $JWT_SECRET
```

### 2. Probar Endpoints de Diagnóstico
```bash
# Probar cookies
curl -X GET "https://evaluaciones.taqro.com.mx/api/auth/test-cookies" \
  -H "Content-Type: application/json" \
  -b "cookies.txt" \
  -c "cookies.txt"

# Probar autenticación
curl -X GET "https://evaluaciones.taqro.com.mx/api/auth/test-auth" \
  -H "Content-Type: application/json" \
  -b "cookies.txt" \
  -c "cookies.txt"
```

### 3. Usar Página de Diagnóstico
Acceder a: `https://admine.taqro.com.mx/diagnostico.html`

Esta página permite:
- Ver información del navegador
- Probar endpoints de la API
- Verificar estado de cookies
- Probar autenticación

### 4. Revisar Logs del Servidor
```bash
# Ver logs en tiempo real
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log

# Ver logs de la aplicación Node.js
pm2 logs
```

### 5. Verificar Configuración de Nginx (si aplica)
```nginx
# Asegurar que las cookies se pasen correctamente
location /api/ {
    proxy_pass http://localhost:4000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # Importante para cookies
    proxy_cookie_path / "/";
    proxy_cookie_domain localhost $host;
}
```

## Posibles Causas del Problema

### 1. Configuración de Dominio de Cookies
Si `COOKIE_DOMAIN` no está configurado correctamente, las cookies pueden no persistir.

**Solución:**
```bash
# En el archivo .env del backend
COOKIE_DOMAIN=.taqro.com.mx
```

### 2. Problemas de CORS
Si el origen no está permitido, las cookies no se envían.

**Verificar:**
- El dominio del frontend está en la lista de orígenes permitidos
- `credentials: true` está configurado

### 3. Configuración de HTTPS
En producción, las cookies requieren `secure: true`.

**Verificar:**
- El sitio usa HTTPS
- Las cookies se configuran con `secure: true`

### 4. Problemas de JWT
Si el JWT_SECRET no está configurado o es diferente.

**Verificar:**
```bash
echo $JWT_SECRET
```

## Comandos de Debugging

### 1. Verificar Estado de la Base de Datos
```sql
-- Verificar usuarios activos
SELECT id, username, rol, activo, fecha_actualizacion 
FROM usuarios 
WHERE activo = 1;

-- Verificar tokens en blacklist
SELECT * FROM token_blacklist ORDER BY created_at DESC LIMIT 10;
```

### 2. Verificar Logs de Seguridad
```bash
# Ver logs de autenticación
grep "LOGIN" /var/log/security.log
grep "TOKEN" /var/log/security.log
```

### 3. Probar API Directamente
```bash
# Login
curl -X POST "https://evaluaciones.taqro.com.mx/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin2025"}' \
  -c "cookies.txt"

# Verificar
curl -X GET "https://evaluaciones.taqro.com.mx/api/auth/verify" \
  -H "Content-Type: application/json" \
  -b "cookies.txt"
```

## Soluciones Recomendadas

### 1. Verificar Variables de Entorno
```bash
# Crear/actualizar archivo .env en el backend
NODE_ENV=production
COOKIE_DOMAIN=.taqro.com.mx
JWT_SECRET=tu_jwt_secret_muy_seguro
```

### 2. Reiniciar Servicios
```bash
# Reiniciar backend
pm2 restart all

# Reiniciar nginx (si aplica)
sudo systemctl restart nginx
```

### 3. Limpiar Cookies del Navegador
- Abrir DevTools (F12)
- Ir a Application/Storage > Cookies
- Eliminar todas las cookies del dominio

### 4. Verificar Configuración de SSL
```bash
# Verificar certificado SSL
openssl s_client -connect admine.taqro.com.mx:443 -servername admine.taqro.com.mx
```

## Contacto para Soporte
Si el problema persiste después de seguir estos pasos, proporcionar:
1. Logs del servidor
2. Resultados de los endpoints de diagnóstico
3. Captura de pantalla de la consola del navegador
4. Información del entorno de producción
