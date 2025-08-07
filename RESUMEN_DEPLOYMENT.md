# 🚀 Resumen Ejecutivo - Despliegue en cPanel

## 📋 Pasos Rápidos (5 minutos)

### 1. Preparar el proyecto localmente
```bash
# Clonar el repositorio
git clone https://github.com/GuillermoAngel27/evaluaciones_TAQ.git
cd evaluaciones_TAQ

# Instalar dependencias y construir
npm run install:all
npm run build:all

# Verificar que todo esté correcto
npm run verify

# Preparar para producción
npm run prepare:production  # Linux/Mac
# O
npm run prepare:production:win  # Windows
```

### 2. En cPanel (15 minutos)

#### 2.1 Base de datos
- Crear base de datos MySQL: `tuusuario_evaluaciones`
- Crear usuario: `tuusuario_eval_user`
- Importar `dist/api/database/init.sql`

#### 2.2 Subir archivos
- Subir `dist/api/` → `public_html/api/`
- Subir `dist/admin/` → `public_html/admin/`
- Subir `dist/evaluacion/` → `public_html/evaluacion/`

#### 2.3 Configurar
- Crear archivo `.env` en `public_html/api/` con tus credenciales
- Crear aplicación Node.js apuntando a `start_backend.js`
- Crear subdominios:
  - `api.taqro.com.mx`
  - `admine.taqro.com.mx`
  - `evaluacion.taqro.com.mx`
- Instalar SSL para cada subdominio

#### 2.4 Iniciar
- Reiniciar aplicación Node.js
- Probar URLs

## 🔑 Credenciales por Defecto
- **Usuario**: `admin`
- **Contraseña**: `admin2025`

## 📞 URLs Finales
- **API**: `https://api.taqro.com.mx`
- **Admin**: `https://admine.taqro.com.mx`
- **Evaluación**: `https://evaluacion.taqro.com.mx`

## ⚠️ Importante
1. Cambia las credenciales admin después del primer login
2. Configura respaldos automáticos de la base de datos
3. Verifica que SSL esté funcionando correctamente

## 📚 Documentación Completa
- **Guía detallada**: `GUIA_CPANEL_DEPLOYMENT.md`
- **Solución de problemas**: Sección al final de la guía
- **Verificación**: `npm run verify`

---

**¡Tu aplicación estará funcionando en menos de 20 minutos!** 🎉
