# 📋 DOCUMENTACIÓN COMPLETA - SISTEMA DE EVALUACIONES TAQ

## 🎯 **RESUMEN EJECUTIVO**

**Sistema completo de gestión y evaluación de locales comerciales** con interfaz moderna inspirada en Argon Dashboard. Permite a los clientes evaluar servicios mediante códigos QR y proporciona un panel administrativo completo para análisis y gestión.

---

## 🏗️ **ARQUITECTURA DEL SISTEMA**

### **Estructura del Proyecto**
```
evaluacionesTAQ/
├── backend/                 # API REST (Node.js + Express + MySQL)
├── frontend/
│   ├── administrador/       # Panel administrativo (React + Argon Dashboard)
│   └── evaluacion/          # Aplicación de evaluación (React)
└── documentación/           # Archivos de documentación
```

### **Stack Tecnológico**
- **Backend:** Node.js, Express, MySQL, JWT
- **Frontend Admin:** React 18, Argon Dashboard, Bootstrap, Chart.js
- **Frontend Evaluación:** React 18, CSS personalizado
- **Base de Datos:** MySQL 8.0+
- **Autenticación:** JWT + bcrypt

---

## 🚀 **FUNCIONALIDADES PRINCIPALES**

### **1. Sistema de Evaluaciones Públicas**
- **Códigos QR:** Cada local tiene un token único para generar QR
- **Evaluación por Dispositivo:** Control de evaluaciones únicas por dispositivo
- **Preguntas Dinámicas:** Diferentes preguntas según tipo de local
- **Turnos Automáticos:** Detección automática del turno actual
- **Validación de Tokens:** Verificación de tokens válidos y no usados

### **2. Panel Administrativo**
- **Dashboard en Tiempo Real:** Estadísticas actualizadas cada 30 segundos
- **Gestión de Locales:** CRUD completo de locales comerciales
- **Gestión de Usuarios:** Sistema de roles y permisos
- **Estadísticas Avanzadas:** Análisis por local, pregunta y tipo
- **Insights Inteligentes:** Identificación de áreas de mejora

### **3. Sistema de Autenticación**
- **Roles Múltiples:** Administrador, Supervisor, Evaluador, Viewer
- **JWT Tokens:** Autenticación segura con tokens
- **Permisos Granulares:** Acceso controlado por funcionalidad

---

## 📊 **BASE DE DATOS**

### **Tablas Principales**

#### **usuarios**
```sql
- id (PK)
- username (UNIQUE)
- password (hasheada)
- nombre, apellido
- rol (administrador, supervisor, evaluador, viewer)
- activo (BOOLEAN)
- fecha_creacion, fecha_actualizacion
```

#### **locales**
```sql
- id (PK)
- nombre
- tipo_local (alimentos, miscelaneas, taxis, estacionamiento)
- estatus (activo, inactivo)
- token_publico (UNIQUE, 16 caracteres)
- fecha_creacion, fecha_actualizacion
```

#### **evaluaciones**
```sql
- id (PK)
- local_id (FK)
- puntuacion (1-5)
- comentario (TEXT)
- fecha (DATETIME)
- turno (1-4)
```

#### **respuestas**
```sql
- evaluacion_id (FK)
- pregunta (1-N)
- puntuacion (1-5)
- PRIMARY KEY (evaluacion_id, pregunta)
```

#### **turnos**
```sql
- turno (1-4)
- hra_ini, hra_fin
- PRIMARY KEY (turno, hra_ini)
```

### **Turnos Configurados**
- **Turno 1:** 05:30:01 - 13:30:00
- **Turno 2:** 13:30:01 - 21:00:00
- **Turno 3:** 00:00:00 - 05:30:00
- **Turno 4:** 21:00:01 - 23:59:59

---

## 🔧 **CONFIGURACIÓN DE PREGUNTAS**

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

---

## 🌐 **ENDPOINTS DE LA API**

### **Autenticación (`/api/auth`)**
- `POST /login` - Iniciar sesión
- `POST /register` - Registrar usuario
- `GET /verify` - Verificar token

### **Usuarios (`/api/usuarios`)**
- `GET /` - Listar usuarios
- `POST /` - Crear usuario
- `GET /:id` - Obtener usuario
- `PUT /:id` - Actualizar usuario
- `DELETE /:id` - Eliminar usuario

### **Locales (`/api/locales`)**
- `GET /` - Listar locales
- `POST /` - Crear local
- `GET /:id` - Obtener local
- `PUT /:id` - Actualizar local
- `DELETE /:id` - Eliminar local
- `GET /estadisticas` - Estadísticas de locales
- `GET /insights-evaluacion` - Insights de evaluación

### **Evaluaciones (`/api/evaluaciones`)**
- `GET /` - Listar evaluaciones
- `POST /` - Crear evaluación
- `GET /turno-actual` - Obtener turno actual
- `GET /turnos` - Listar turnos
- `GET /preguntas/:tipo` - Obtener preguntas por tipo
- `GET /dashboard/stats` - Estadísticas del dashboard
- `GET /dashboard/top-locales` - Top locales evaluados
- `GET /dashboard/ultimas` - Últimas evaluaciones
- `GET /dashboard/comentarios` - Comentarios recientes
- `GET /dashboard/calificaciones-por-tipo` - Calificaciones por tipo
- `GET /dashboard/por-dia` - Evaluaciones por día

### **Tokens (`/api/tokens`)**
- `GET /:token` - Validar token público
- `POST /generar` - Generar nuevo token

---

## 🎨 **INTERFACES DE USUARIO**

### **Panel Administrativo (Puerto 3000)**
- **Dashboard:** Métricas en tiempo real, gráficos, top locales
- **Locales:** Gestión CRUD con filtros y búsqueda
- **Evaluaciones:** Lista con filtros por fecha y local
- **Estadísticas:** Análisis unificado con pestañas (Por Local, Por Pregunta, Por Tipo)
- **Usuarios:** Gestión de usuarios y roles

### **Aplicación de Evaluación (Puerto 5173)**
- **Página de Bienvenida:** Instrucciones y logo
- **Formulario de Evaluación:** Preguntas dinámicas según tipo de local
- **Confirmación:** Mensaje de agradecimiento post-evaluación

---

## 🔐 **SISTEMA DE SEGURIDAD**

### **Autenticación**
- **JWT Tokens:** Tokens de acceso con expiración
- **bcrypt:** Hashing seguro de contraseñas
- **Middleware:** Verificación automática de tokens

### **Autorización**
- **Roles:** 4 niveles de acceso
- **Permisos:** Control granular por funcionalidad
- **Validación:** Verificación de permisos en cada endpoint

### **Validación de Datos**
- **Sanitización:** Limpieza de inputs
- **Validación:** Verificación de tipos y rangos
- **SQL Injection:** Prevención con parámetros preparados

---

## 📈 **FUNCIONALIDADES AVANZADAS**

### **Dashboard Inteligente**
- **Métricas en Tiempo Real:** Actualización automática cada 30 segundos
- **Gráficos Interactivos:** Chart.js para visualización
- **Insights Automáticos:** Identificación de áreas de mejora
- **Priorización:** Problemas críticos destacados

### **Sistema de Turnos**
- **Detección Automática:** Turno actual basado en hora
- **Validación:** Verificación de horarios
- **Flexibilidad:** Configuración de turnos personalizable

### **Control de Evaluaciones**
- **Dispositivo Único:** Una evaluación por dispositivo por local
- **Tokens Únicos:** Validación de tokens no utilizados
- **Persistencia:** Almacenamiento local de estado

---

## 🚀 **INSTALACIÓN Y CONFIGURACIÓN**

### **Requisitos Previos**
- Node.js 16+
- MySQL 8.0+
- npm o yarn

### **Configuración de Base de Datos**
```bash
# Crear base de datos
CREATE DATABASE evaluaciones_taq;

# Ejecutar script de inicialización
mysql -u root -p evaluaciones_taq < backend/database/init.sql
```

### **Variables de Entorno**
```env
# Backend (.env)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=evaluaciones_taq
DB_PORT=3306
JWT_SECRET=tu_jwt_secret
PORT=4000

# Frontend Admin (.env)
REACT_APP_API_URL=http://localhost:4000/api
```

### **Instalación Completa**
```bash
# Instalar todas las dependencias
npm run install:all

# Iniciar todos los servicios
npm run start:dev

# O iniciar individualmente
npm run start:backend    # Puerto 4000
npm run start:admin      # Puerto 3000
npm run start:evaluacion # Puerto 5173
```

---

## 📊 **MÉTRICAS Y ESTADÍSTICAS**

### **Dashboard Principal**
- **Total de Locales:** Contador de locales activos/inactivos
- **Total de Evaluaciones:** Número total de evaluaciones
- **Promedio General:** Calificación promedio del sistema
- **Evaluaciones Hoy:** Evaluaciones del día actual
- **Satisfacción:** Porcentaje de calificaciones 4-5 estrellas

### **Análisis por Local**
- **Calificación Promedio:** Por local individual
- **Total de Evaluaciones:** Por local
- **Última Evaluación:** Fecha de la evaluación más reciente
- **Tendencia:** Comparación con período anterior

### **Análisis por Pregunta**
- **Áreas Críticas:** Preguntas con promedio < 3.5 estrellas
- **Mejores Prácticas:** Preguntas con promedio > 4.5 estrellas
- **Priorización:** Problemas ordenados por criticidad

### **Análisis por Tipo**
- **Comparación:** Rendimiento entre tipos de local
- **Tendencias:** Evolución temporal por tipo
- **Benchmarking:** Estándares por categoría

---

## 🔄 **FLUJO DE TRABAJO**

### **Proceso de Evaluación**
1. **Cliente escanea QR** → Obtiene token único
2. **Sistema valida token** → Verifica que no haya sido usado
3. **Carga información del local** → Nombre, tipo, preguntas
4. **Cliente responde preguntas** → Calificación 1-5 estrellas
5. **Sistema guarda evaluación** → Con turno automático
6. **Token se marca como usado** → Previene evaluaciones duplicadas

### **Proceso Administrativo**
1. **Administrador inicia sesión** → Autenticación JWT
2. **Accede al dashboard** → Ve métricas en tiempo real
3. **Gestiona locales** → CRUD de establecimientos
4. **Analiza estadísticas** → Insights y tendencias
5. **Toma decisiones** → Basado en datos reales

---

## 🛠️ **MANTENIMIENTO Y OPERACIONES**

### **Backups**
- **Base de Datos:** Backup diario automático
- **Logs:** Rotación de logs del servidor
- **Configuración:** Versionado de archivos de configuración

### **Monitoreo**
- **Health Checks:** Endpoint `/health` para verificación
- **Logs:** Registro detallado de operaciones
- **Errores:** Captura y reporte de errores

### **Escalabilidad**
- **Conexiones DB:** Pool de conexiones configurado
- **Caché:** Posibilidad de implementar Redis
- **CDN:** Assets estáticos optimizados

---

## 📱 **RESPONSIVE DESIGN**

### **Panel Administrativo**
- **Desktop:** Layout completo con sidebar
- **Tablet:** Sidebar colapsable
- **Mobile:** Navegación adaptada

### **Aplicación de Evaluación**
- **Mobile-First:** Optimizada para dispositivos móviles
- **Touch-Friendly:** Botones y controles adaptados
- **Offline:** Funcionalidad básica sin conexión

---

## 🔮 **ROADMAP FUTURO**

### **Funcionalidades Planificadas**
- **Notificaciones Push:** Alertas en tiempo real
- **Reportes Automáticos:** Exportación programada
- **API Pública:** Integración con sistemas externos
- **Analytics Avanzados:** Machine Learning para insights
- **Multiidioma:** Soporte para múltiples idiomas

### **Mejoras Técnicas**
- **Microservicios:** Arquitectura distribuida
- **Docker:** Containerización completa
- **CI/CD:** Pipeline de despliegue automático
- **Testing:** Cobertura completa de pruebas

---

## 📞 **SOPORTE Y CONTACTO**

### **Información del Proyecto**
- **Desarrollador:** Guillermo Angel
- **Repositorio:** https://github.com/GuillermoAngel27/evaluaciones_TAQ
- **Licencia:** MIT
- **Versión:** 1.0.0

### **Documentación Técnica**
- **API Docs:** Endpoints documentados en código
- **Base de Datos:** Esquema completo en `init.sql`
- **Configuración:** Variables de entorno documentadas

---

## ✅ **ESTADO ACTUAL**

### **Funcionalidades Implementadas**
- ✅ Sistema de evaluación completo
- ✅ Panel administrativo funcional
- ✅ Autenticación y autorización
- ✅ Dashboard en tiempo real
- ✅ Gestión de locales y usuarios
- ✅ Estadísticas avanzadas
- ✅ Sistema de turnos
- ✅ Control de evaluaciones únicas

### **Calidad del Código**
- ✅ Código documentado y comentado
- ✅ Manejo de errores robusto
- ✅ Validación de datos
- ✅ Seguridad implementada
- ✅ Responsive design
- ✅ Performance optimizado

---

**Última actualización:** Diciembre 2024  
**Estado del proyecto:** ✅ **PRODUCCIÓN LISTA** 