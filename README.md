# 🏪 Sistema de Evaluaciones TAQ

**Sistema completo de gestión y evaluación de locales comerciales** con interfaz moderna inspirada en Argon Dashboard. Permite a los clientes evaluar servicios mediante códigos QR y proporciona un panel administrativo completo para análisis y gestión.

## ✨ Características Principales

### 🎯 **Sistema de Evaluaciones Públicas**
- **Códigos QR únicos** para cada local comercial
- **Evaluación por dispositivo** - Control de evaluaciones únicas
- **Preguntas dinámicas** según tipo de local (Alimentos, Misceláneas, Taxis, Estacionamiento)
- **Turnos automáticos** - Detección automática del turno actual
- **Validación de tokens** - Prevención de evaluaciones duplicadas

### 📊 **Panel Administrativo Avanzado**
- **Dashboard principal** - Vista general del sistema con header personalizado
- **Gestión completa de locales** - CRUD con filtros, búsqueda y generación de códigos QR
- **Sistema de usuarios y roles** - Administrador y Usuario Normal con permisos granulares
- **Gestión de evaluaciones** - Navegación jerárquica desde locales hasta evaluaciones individuales
- **Estadísticas organizadas** - 3 secciones: por local, por pregunta y comparación por tipo
- **Sistema de filtros avanzados** - Búsqueda, tipo de local, fechas y turnos

### 🔐 **Sistema de Seguridad**
- **Autenticación JWT** con tokens seguros
- **Roles y permisos granulares** - Control de acceso por funcionalidad
- **Validación de datos** - Sanitización y verificación
- **Prevención SQL Injection** - Parámetros preparados

## 🛠️ Stack Tecnológico

### **Backend**
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MySQL 8.0+** - Base de datos relacional
- **JWT** - Autenticación de tokens
- **bcrypt** - Hashing seguro de contraseñas
- **Helmet** - Headers de seguridad HTTP
- **Express Rate Limit** - Prevención de ataques de fuerza bruta
- **Cookie Parser** - Manejo seguro de cookies
- **CORS** - Control de acceso entre dominios

### **Frontend Administrativo**
- **React 18** - Biblioteca de interfaz de usuario
- **Argon Dashboard** - Framework de UI profesional
- **Bootstrap 4.6** - Framework CSS
- **Chart.js 4.5** - Gráficos interactivos
- **Reactstrap 9.2** - Componentes Bootstrap para React
- **FontAwesome 6.2** - Iconografía profesional
- **Perfect Scrollbar** - Scrollbars personalizados
- **SweetAlert2** - Alertas y confirmaciones elegantes

### **Frontend Evaluación**
- **React 19** - Biblioteca de interfaz de usuario
- **CSS personalizado** - Diseño mobile-first
- **Fetch API** - Comunicación con backend
- **LocalStorage** - Persistencia de estado
- **SweetAlert2** - Notificaciones de usuario

## 🛡️ **Características de Seguridad Avanzada**

### **Rate Limiting y Protección**
- **Login Rate Limiting**: Máximo 6 intentos en 15 minutos
- **Password Change Rate Limiting**: Máximo 3 intentos por hora
- **CORS Configurado**: Solo dominios autorizados permitidos
- **Headers de Seguridad**: Helmet CSP con políticas estrictas

### **Validación y Autenticación**
- **Contraseñas Complejas**: Mínimo 8 caracteres, mayúsculas, minúsculas, números y símbolos
- **JWT con Cookies Seguras**: httpOnly, secure, sameSite configurados
- **Blacklist de Tokens**: Sistema completo de invalidación de sesiones
- **Logging de Seguridad**: Registro detallado de eventos de seguridad

### **Manejo de Sesiones**
- **Tokens Invalidados**: Sistema de logout seguro
- **Expiración Automática**: Tokens con tiempo de vida limitado
- **Prevención de Replay**: Tokens únicos por sesión
- **Auditoría Completa**: Logs de login, logout y cambios de contraseña


## 📚 **Dependencias Específicas Implementadas**

### **Backend - Utilidades Avanzadas**
```json
{
  "html2canvas": "^1.4.1",        // Generación de códigos QR en PDF
"jspdf": "^3.0.1",              // Creación de PDFs de códigos QR
  "qrcode": "^1.5.4",             // Generación de códigos QR únicos
  "node-cron": "^4.2.1",          // Tareas programadas automáticas
  "node-fetch": "^2.7.0",         // Fetch API para Node.js
  "joi-password-complexity": "^5.2.0" // Validación de contraseñas complejas
}
```

### **Frontend - Componentes Profesionales**
```json
{
  "@fortawesome/fontawesome-free": "^6.2.0", // Iconografía profesional
  "perfect-scrollbar": "^1.5.5",            // Scrollbars personalizados
  "react-copy-to-clipboard": "^5.1.0",      // Funcionalidad de copia
  "sweetalert2": "^11.22.2"                 // Alertas elegantes
}
```

## 🚀 Instalación Rápida

### **Prerrequisitos**
- Node.js 16+
- MySQL 8.0+
- npm o yarn

### **1. Clonar e Instalar**
```bash
git clone https://github.com/GuillermoAngel27/evaluaciones_TAQ.git
cd evaluacionesTAQ
npm run install:all
```

### **2. Configurar Base de Datos**
```bash
# Crear base de datos
CREATE DATABASE evaluaciones_taq;

# Ejecutar script de inicialización
mysql -u root -p evaluaciones_taq < backend/database/init.sql
```

### **3. Configurar Variables de Entorno**
```bash
# Backend
cd backend
cp env.example .env
# Editar .env con tus credenciales

# Frontend Admin (opcional)
cd ../frontend/administrador
cp env.example .env
```

### **4. Iniciar Servicios**
```bash
# Iniciar todos los servicios
npm run start:dev

# O individualmente:
npm run start:backend    # Puerto 4000
npm run start:admin      # Puerto 3000
npm run start:evaluacion # Puerto 3001
```

## 📁 Estructura del Proyecto

```
evaluacionesTAQ/
├── backend/                 # API REST (Node.js + Express + MySQL)
│   ├── config/             # Configuración de preguntas y cookies
│   ├── database/           # Scripts SQL y migraciones
│   ├── routes/             # Endpoints de la API
│   ├── utils/              # Utilidades (turnos, seguridad, limpieza)
│   └── start_backend.js    # Servidor principal con configuración de seguridad
├── frontend/
│   ├── administrador/      # Panel administrativo (React + Argon Dashboard)
│   │   ├── src/
│   │   │   ├── components/ # Componentes reutilizables
│   │   │   ├── views/      # Páginas principales
│   │   │   ├── context/    # Contexto de autenticación
│   │   │   ├── hooks/      # Hooks personalizados
│   │   │   └── utils/      # Utilidades (API, PDF, etc.)
│   │   └── package.json
│   └── evaluacion/         # Aplicación de evaluación (React)
│       ├── src/
│       │   ├── components/ # Componentes de evaluación
│       │   ├── pages/      # Páginas de evaluación
│       │   └── App.js      # Aplicación principal
│       └── package.json
└── README.md
```

## 🔧 Configuración de Preguntas

### **Preguntas por Tipo de Local**

#### **Alimentos (5 preguntas)**
1. ¿El personal fue amable?
2. ¿El local estaba limpio?
3. ¿La atención fue rápida?
4. ¿Al finalizar su compra le entregaron ticket?
5. ¿La relación calidad-precio fue adecuada?

#### **Misceláneas (4 preguntas)**
1. ¿El personal fue amable?
2. ¿El local estaba limpio?
3. ¿La atención fue rápida?
4. ¿Al finalizar su compra le entregaron ticket?

#### **Taxis (4 preguntas)**
1. ¿El personal fue amable?
2. ¿Las instalaciones se encuentra limpias?
3. ¿La asignación de unidad fue rápida?
4. ¿Las instalaciones son adecuadas para realizar el abordaje?

#### **Estacionamiento (4 preguntas)**
1. ¿El personal fue amable?
2. ¿Las instalaciones se encuentran limpias?
3. ¿El acceso a las instalaciones son adecuadas?
4. ¿El proceso para pago fue optimo?

### **Sistema de Normalización**
El sistema incluye **normalización inteligente** de tipos de local:
- **Misceláneas**: Acepta variantes como 'miscelanea', 'misceláneas'
- **Alimentos**: Reconocimiento de 'alimento', 'alimentos'
- **Taxis**: Identifica 'taxi', 'taxis'
- **Estacionamiento**: Detecta 'parking', 'estacionamiento'

## 🌐 URLs de Acceso

- **Backend API**: `http://localhost:4000`
- **Panel Administrativo**: `http://localhost:3000`
- **Aplicación de Evaluación**: `http://localhost:3001`
- **Health Check**: `http://localhost:4000/health`

## 📊 Funcionalidades del Sistema

### **Dashboard Principal**
- **Header personalizado** con gradiente de colores corporativos
- **Navegación lateral** con acceso a todas las funcionalidades del sistema
- **Vista general** del estado del sistema y métricas básicas

### **Gestión de Locales**
- **CRUD completo** de establecimientos comerciales
- **Filtros avanzados** por nombre, tipo y estado
- **Generación de códigos QR** únicos para cada local
- **Categorización automática** por tipo (Alimentos, Misceláneas, Taxis, Estacionamiento)
- **Paginación inteligente** para listas extensas

### **Gestión de Usuarios**
- **Sistema de roles** con permisos granulares
- **Creación y edición** de usuarios con validaciones de seguridad
- **Gestión de contraseñas** con sistema de placeholder y cambio opcional
- **Restricciones de seguridad** (no eliminar propio usuario, último administrador)
- **Filtros por rol y estado** activo/inactivo

### **Sistema de Evaluaciones**
- **Navegación jerárquica**: Locales → Evaluaciones del Local → Evaluación Individual
- **Filtros en cascada** que se mantienen entre vistas
- **Filtros por turno** específicos para cada local
- **Vista detallada** con comentarios y respuestas por pregunta
- **Sistema de calificación** visual con estrellas y colores

### **Sistema de Estadísticas**
- **📋 Estadísticas por Local**: Tabla con métricas de rendimiento, filtros y paginación
- **❓ Análisis por Pregunta**: Gráfica de barras por tipo de local con sistema de colores
- **📈 Comparación por Tipo**: Tabla comparativa entre categorías de locales
- **Sistema de colores**: Verde (5⭐), Amarillo (4⭐), Rojo (3-1⭐) para interpretación rápida

## 🔐 Autenticación y Roles

### **Usuarios por Defecto**
- **Administrador**: `admin` / `admin1234`

### **Niveles de Acceso Implementados**
El sistema implementa **2 roles principales**:

#### **🔐 Administrador**
- ✅ **Gestión completa de usuarios** (crear, editar, eliminar, cambiar contraseñas)
- ✅ **Gestión completa de locales** (crear, editar, eliminar, generar códigos QR)
- ✅ **Acceso completo a evaluaciones** (ver, navegar, filtrar por turnos)
- ✅ **Estadísticas completas** (3 secciones con análisis detallado)
- ✅ **Configuración del sistema** (invalidar tokens, blacklist)

#### **👤 Usuario Normal**
- ✅ **Ver locales** y generar códigos QR
- ✅ **Acceso completo a evaluaciones** (navegación jerárquica, filtros, detalles)
- ✅ **Estadísticas completas** (mismo acceso que administradores)
- ❌ **NO puede** crear/editar/eliminar usuarios
- ❌ **NO puede** crear/editar/eliminar locales
- ❌ **NO puede** eliminar evaluaciones

## 📝 API Endpoints Principales

### **Autenticación**
- `POST /api/auth/login` - Iniciar sesión (con rate limiting)
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/logout` - Cerrar sesión (invalida token)
- `GET /api/auth/verify` - Verificar token

### **Locales**
- `GET /api/locales` - Listar locales
- `POST /api/locales` - Crear local (solo admin)
- `GET /api/locales/:id` - Obtener local
- `PUT /api/locales/:id` - Actualizar local (solo admin)
- `DELETE /api/locales/:id` - Eliminar local (solo admin)
- `GET /api/locales/estadisticas` - Estadísticas de locales
- `GET /api/locales/insights-evaluacion` - Insights de evaluación

### **Evaluaciones**
- `GET /api/evaluaciones` - Listar evaluaciones
- `POST /api/evaluaciones` - Crear evaluación
- `GET /api/evaluaciones/turno-actual` - Obtener turno actual
- `GET /api/evaluaciones/turnos` - Listar todos los turnos disponibles
- `GET /api/evaluaciones/preguntas/:tipo` - Obtener preguntas por tipo
- `GET /api/evaluaciones/dashboard/stats` - Estadísticas del dashboard
- `GET /api/evaluaciones/dashboard/top-locales` - Top locales evaluados

### **Tokens**
- `GET /api/tokens/:token` - Validar token público
- `POST /api/tokens/generar` - Generar nuevo token

## 🚀 Scripts Disponibles

### **Instalación**
```bash
npm run install:all        # Instalar todas las dependencias
npm run install:backend    # Solo backend
npm run install:admin      # Solo panel administrativo
npm run install:evaluacion # Solo aplicación de evaluación
```

### **Desarrollo**
```bash
npm run start:dev          # Iniciar todos los servicios
npm run start:backend      # Solo backend (puerto 4000)
npm run start:admin        # Solo panel administrativo (puerto 3000)
npm run start:evaluacion   # Solo aplicación de evaluación (puerto 3001)
```

### **Producción**
```bash
npm run build:all          # Construir todos los frontends
npm run build:admin        # Construir panel administrativo
npm run build:evaluacion   # Construir aplicación de evaluación
```

## 🔄 Flujo de Trabajo

### **Proceso de Evaluación**
1. **Cliente escanea QR** → Obtiene token único
2. **Sistema valida token** → Verifica que no haya sido usado
3. **Carga información del local** → Nombre, tipo, preguntas
4. **Cliente responde preguntas** → Calificación 1-5 estrellas
5. **Sistema guarda evaluación** → Con turno automático
6. **Token se marca como usado** → Previene evaluaciones duplicadas

### **Proceso Administrativo**
1. **Usuario inicia sesión** → Autenticación JWT con cookies seguras
2. **Accede al sistema** → Navega por las diferentes secciones
3. **Gestiona locales** → CRUD de establecimientos y generación de códigos QR
4. **Analiza evaluaciones** → Navegación jerárquica con filtros avanzados
5. **Revisa estadísticas** → 3 secciones de análisis organizadas
6. **Toma decisiones** → Basado en datos reales y métricas visuales

## 🛠️ Mantenimiento

### **Backups**
- **Base de Datos**: Backup diario automático recomendado
- **Logs**: Rotación de logs del servidor
- **Configuración**: Versionado de archivos de configuración

### **Monitoreo**
- **Health Checks**: Endpoint `/health` para verificación
- **Logs de Seguridad**: Registro detallado de eventos de seguridad
- **Errores**: Captura y reporte de errores
- **Rate Limiting**: Monitoreo de intentos fallidos

### **Limpieza Automática**
- **Tokens Expirados**: Limpieza automática de tokens vencidos
- **Blacklist**: Mantenimiento de la lista de tokens invalidados
- **Logs Antiguos**: Rotación automática de archivos de log

## 📱 Responsive Design

### **Panel Administrativo**
- **Desktop**: Layout completo con sidebar
- **Tablet**: Sidebar colapsable
- **Mobile**: Navegación adaptada

### **Aplicación de Evaluación**
- **Mobile-First**: Optimizada para dispositivos móviles
- **Touch-Friendly**: Botones y controles adaptados
- **Offline**: Funcionalidad básica sin conexión

## 🔮 Roadmap Futuro

### **Funcionalidades Planificadas**
- **Notificaciones Push**: Alertas en tiempo real
- **Reportes Automáticos**: Generación programada
- **API Pública**: Integración con sistemas externos
- **Analytics Avanzados**: Machine Learning para insights
- **Multiidioma**: Soporte para múltiples idiomas

### **Mejoras Técnicas**
- **Microservicios**: Arquitectura distribuida
- **Docker**: Containerización completa
- **CI/CD**: Pipeline de despliegue automático
- **Testing**: Cobertura completa de pruebas

## 👨‍💻 Autor

**Guillermo Angel** - [GitHub](https://github.com/GuillermoAngel27)

## 📞 Soporte

- **Repositorio**: https://github.com/GuillermoAngel27/evaluaciones_TAQ
- **Issues**: https://github.com/GuillermoAngel27/evaluaciones_TAQ/issues


**Última actualización:** DICIEMBRE 2024  
**Estado del proyecto:** ✅ **PRODUCCIÓN LISTA**  
**Versión del README:** 4.0 - **ACTUALIZADO CON FUNCIONALIDAD REAL DEL SISTEMA** 