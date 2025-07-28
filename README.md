# 🏪 Sistema de Evaluaciones TAQ

Sistema completo de gestión y evaluación de locales comerciales con interfaz moderna inspirada en Argon Dashboard.

## ✨ Características

- **Dashboard Administrativo** con diseño Argon Dashboard
- **Gestión de Locales** (CRUD completo)
- **Sistema de Evaluaciones** con calificaciones y comentarios
- **Estadísticas Avanzadas** con gráficos interactivos
- **Interfaz Responsive** para móviles y desktop
- **Autenticación de Usuarios** con persistencia local

## 🛠️ Tecnologías Utilizadas

### Frontend Administrativo
- **React.js** - Biblioteca de interfaz de usuario
- **Argon Dashboard** - Framework de UI
- **Bootstrap 5** - Framework CSS
- **Chart.js** - Gráficos interactivos
- **Reactstrap** - Componentes de Bootstrap para React

### Frontend Evaluaciones
- **React.js** - Biblioteca de interfaz de usuario
- **CSS Inline** - Estilos personalizados
- **Fetch API** - Comunicación con backend

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MySQL2** - Base de datos
- **CORS** - Cross-Origin Resource Sharing

## 🚀 Instalación

### Prerrequisitos
- Node.js (v14 o superior)
- MySQL
- Git

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone git@github.com:GuillermoAngel27/evaluaciones_TAQ.git
cd evaluacionesTAQ
```

2. **Instalar todas las dependencias**
```bash
npm run install:all
```

3. **Configurar variables de entorno**
```bash
# Copiar archivo de configuración principal
cp env.example .env

# Configurar backend
cd backend
cp env.example .env
# Editar backend/.env con tus credenciales de base de datos

# Configurar frontend administrativo (opcional)
cd ../frontend/administrador
cp env.example .env
```

4. **Configurar la base de datos**
```sql
CREATE DATABASE evaluaciones_taq;
USE evaluaciones_taq;
-- Ejecutar los scripts SQL necesarios
```

5. **Iniciar todos los servicios (desarrollo)**
```bash
npm run start:dev
```

**O iniciar servicios individualmente:**
```bash
# Backend
npm run start:backend

# Frontend Administrativo
npm run start:admin

# Frontend Evaluaciones
npm run start:evaluacion
```

## 📁 Estructura del Proyecto

```
evaluacionesTAQ/
├── backend/
│   ├── config/
│   ├── database/
│   ├── routes/
│   └── start_backend.js
├── frontend/
│   ├── administrador/  # Panel administrativo (Argon Dashboard)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── views/
│   │   │   └── context/
│   │   └── package.json
│   └── evaluacion/     # Frontend para evaluaciones
└── README.md
```

## 🎨 Diseño

### Panel Administrativo
El proyecto utiliza el diseño visual del **Argon Dashboard** con:
- Paleta de colores moderna (#5e72e4, #825ee4)
- Gradientes de 87 grados
- Sombras suaves y bordes rectos
- Iconografía FontAwesome
- Tipografía limpia y legible

### Frontend Evaluaciones
Diseño **mobile-first** optimizado para dispositivos móviles:
- Interfaz táctil intuitiva
- Colores Material Design (#1976d2, #dc004e)
- Componentes responsivos
- UX prioritaria para clientes

## 🔐 Autenticación

### Panel Administrativo
- **Usuario**: `admin`
- **Contraseña**: `admin1234`

### Frontend Evaluaciones
- **Sin autenticación** - Acceso directo mediante URL con ID del local
- **Tokens únicos** - Generados automáticamente por dispositivo

## 📊 Funcionalidades

### Dashboard
- Estadísticas en tiempo real
- Gráficos de evaluaciones por día
- Métricas de rendimiento
- Vista general del sistema

### Gestión de Locales
- Crear, editar y eliminar locales
- Estados: Activo, Inactivo, Mantenimiento
- Tipos: Restaurante, Café, Bar, Pizzería
- Generación de códigos QR

### Evaluaciones
- Sistema de calificación 1-5 estrellas
- Comentarios de clientes
- Filtros avanzados
- Vista detallada de evaluaciones

### Estadísticas
- Gráficos de área y barras
- Análisis por período
- Métricas de rendimiento
- Exportación de datos

## 🌐 URLs de Acceso

- **Backend API**: `http://localhost:4000`
- **Frontend Administrativo**: `http://localhost:3000`
- **Frontend Evaluación**: `http://localhost:3001`

## 🚀 Scripts Disponibles

### Instalación
- `npm run install:all` - Instalar dependencias de todos los servicios
- `npm run install:backend` - Instalar dependencias del backend
- `npm run install:admin` - Instalar dependencias del panel administrativo
- `npm run install:evaluacion` - Instalar dependencias del frontend de evaluaciones

### Desarrollo
- `npm run start:dev` - Iniciar todos los servicios en modo desarrollo
- `npm run start:backend` - Iniciar solo el backend
- `npm run start:admin` - Iniciar solo el panel administrativo
- `npm run start:evaluacion` - Iniciar solo el frontend de evaluaciones

### Producción
- `npm run build:all` - Construir todos los frontends para producción
- `npm run build:admin` - Construir panel administrativo
- `npm run build:evaluacion` - Construir frontend de evaluaciones

## 📝 API Endpoints

### Locales
- `GET /api/locales` - Obtener todos los locales
- `GET /api/locales/:id` - Obtener local específico
- `POST /api/locales` - Crear nuevo local
- `PUT /api/locales/:id` - Actualizar local
- `DELETE /api/locales/:id` - Eliminar local

### Evaluaciones
- `GET /api/evaluaciones` - Obtener evaluaciones
- `GET /api/evaluaciones/:id` - Obtener evaluación específica
- `POST /api/evaluaciones` - Crear evaluación
- `DELETE /api/evaluaciones/:id` - Eliminar evaluación
- `GET /api/evaluaciones/preguntas/:tipo` - Obtener preguntas por tipo de local

### Tokens
- `POST /api/tokens/generar` - Generar token para evaluación
- `POST /api/tokens/verificar-evaluacion` - Verificar si puede evaluar
- `POST /api/tokens/usar` - Marcar token como usado

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Guillermo Angel** - [guillermoangel27](guillermoangel27)

## 🙏 Agradecimientos

- [Argon Dashboard](https://www.creative-tim.com/product/argon-dashboard) por el diseño inspirador
- [Material-UI](https://mui.com/) por los componentes de UI
- [Recharts](https://recharts.org/) por las librerías de gráficos 