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
- **Dashboard en tiempo real** - Actualización automática cada 30 segundos
- **Gestión completa de locales** - CRUD con filtros y búsqueda
- **Sistema de usuarios y roles** - Administrador, Supervisor, Evaluador, Viewer
- **Estadísticas inteligentes** - Análisis por local, pregunta y tipo
- **Insights automáticos** - Identificación de áreas de mejora

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

### **Frontend Administrativo**
- **React 18** - Biblioteca de interfaz de usuario
- **Argon Dashboard** - Framework de UI profesional
- **Bootstrap 4.6** - Framework CSS
- **Chart.js 4.5** - Gráficos interactivos
- **Reactstrap 9.2** - Componentes Bootstrap para React

### **Frontend Evaluación**
- **React 18** - Biblioteca de interfaz de usuario
- **CSS personalizado** - Diseño mobile-first
- **Fetch API** - Comunicación con backend
- **LocalStorage** - Persistencia de estado

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
npm run start:evaluacion # Puerto 5173
```

## 📁 Estructura del Proyecto

```
evaluacionesTAQ/
├── backend/                 # API REST (Node.js + Express + MySQL)
│   ├── config/             # Configuración de preguntas
│   ├── database/           # Scripts SQL y migraciones
│   ├── routes/             # Endpoints de la API
│   ├── utils/              # Utilidades (turnos, etc.)
│   └── start_backend.js    # Servidor principal
├── frontend/
│   ├── administrador/      # Panel administrativo (React + Argon Dashboard)
│   │   ├── src/
│   │   │   ├── components/ # Componentes reutilizables
│   │   │   ├── views/      # Páginas principales
│   │   │   ├── context/    # Contexto de autenticación
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

## 🌐 URLs de Acceso

- **Backend API**: `http://localhost:4000`
- **Panel Administrativo**: `http://localhost:3000`
- **Aplicación de Evaluación**: `http://localhost:5173`
- **Health Check**: `http://localhost:4000/health`

## 📊 Funcionalidades del Dashboard

### **Métricas en Tiempo Real**
- **Total de Locales** - Activos e inactivos
- **Total de Evaluaciones** - Número total de evaluaciones
- **Promedio General** - Calificación promedio del sistema
- **Evaluaciones Hoy** - Evaluaciones del día actual
- **Satisfacción** - Porcentaje de calificaciones 4-5 estrellas

### **Análisis Avanzado**
- **Por Local** - Estadísticas individuales de cada establecimiento
- **Por Pregunta** - Análisis específico de cada pregunta
- **Por Tipo** - Comparación entre tipos de local
- **Insights Automáticos** - Identificación de áreas de mejora

### **Gráficos Interactivos**
- **Calificaciones por Tipo** - Comparación visual entre categorías
- **Evaluaciones por Día** - Tendencia temporal
- **Top Locales** - Ranking de establecimientos más evaluados
- **Comentarios Recientes** - Feedback de clientes

## 🔐 Autenticación y Roles

### **Usuarios por Defecto**
- **Administrador**: `admin` / `admin1234`
- **Supervisor**: `supervisor1` / `supervisor1234`
- **Evaluador**: `evaluador1` / `evaluador1234`
- **Viewer**: `viewer1` / `viewer1234`

### **Niveles de Acceso**
- **Administrador**: Acceso completo a todas las funcionalidades
- **Supervisor**: Gestión de locales y visualización de estadísticas
- **Evaluador**: Solo visualización de evaluaciones y estadísticas
- **Viewer**: Acceso limitado a reportes básicos

## 📝 API Endpoints Principales

### **Autenticación**
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `GET /api/auth/verify` - Verificar token

### **Locales**
- `GET /api/locales` - Listar locales
- `POST /api/locales` - Crear local
- `GET /api/locales/:id` - Obtener local
- `PUT /api/locales/:id` - Actualizar local
- `DELETE /api/locales/:id` - Eliminar local
- `GET /api/locales/estadisticas` - Estadísticas de locales
- `GET /api/locales/insights-evaluacion` - Insights de evaluación

### **Evaluaciones**
- `GET /api/evaluaciones` - Listar evaluaciones
- `POST /api/evaluaciones` - Crear evaluación
- `GET /api/evaluaciones/turno-actual` - Obtener turno actual
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
npm run start:evaluacion   # Solo aplicación de evaluación (puerto 5173)
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
1. **Administrador inicia sesión** → Autenticación JWT
2. **Accede al dashboard** → Ve métricas en tiempo real
3. **Gestiona locales** → CRUD de establecimientos
4. **Analiza estadísticas** → Insights y tendencias
5. **Toma decisiones** → Basado en datos reales

## 🛠️ Mantenimiento

### **Backups**
- **Base de Datos**: Backup diario automático recomendado
- **Logs**: Rotación de logs del servidor
- **Configuración**: Versionado de archivos de configuración

### **Monitoreo**
- **Health Checks**: Endpoint `/health` para verificación
- **Logs**: Registro detallado de operaciones
- **Errores**: Captura y reporte de errores

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
- **Reportes Automáticos**: Exportación programada
- **API Pública**: Integración con sistemas externos
- **Analytics Avanzados**: Machine Learning para insights
- **Multiidioma**: Soporte para múltiples idiomas

### **Mejoras Técnicas**
- **Microservicios**: Arquitectura distribuida
- **Docker**: Containerización completa
- **CI/CD**: Pipeline de despliegue automático
- **Testing**: Cobertura completa de pruebas

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Guillermo Angel** - [GitHub](https://github.com/GuillermoAngel27)

## 📞 Soporte

- **Repositorio**: https://github.com/GuillermoAngel27/evaluaciones_TAQ
- **Issues**: https://github.com/GuillermoAngel27/evaluaciones_TAQ/issues
- **Documentación Completa**: Ver `DOCUMENTACION_COMPLETA_PROYECTO.md`

## 🙏 Agradecimientos

- [Argon Dashboard](https://www.creative-tim.com/product/argon-dashboard) por el diseño inspirador
- [Chart.js](https://www.chartjs.org/) por las librerías de gráficos
- [Reactstrap](https://reactstrap.github.io/) por los componentes Bootstrap

---

**Última actualización:** Diciembre 2024  
**Estado del proyecto:** ✅ **PRODUCCIÓN LISTA** 