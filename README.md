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

### Frontend
- **React.js** - Biblioteca de interfaz de usuario
- **Material-UI (MUI)** - Componentes de UI
- **Recharts** - Gráficos interactivos
- **React Router** - Navegación entre páginas

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

2. **Configurar el backend**
```bash
cd backend
npm install
cp env.example .env
# Editar .env con tus credenciales de base de datos
```

3. **Configurar la base de datos**
```sql
CREATE DATABASE evaluaciones_taq;
USE evaluaciones_taq;
-- Ejecutar los scripts SQL necesarios
```

4. **Instalar dependencias del frontend**
```bash
cd ../frontend/admin
npm install
```

5. **Iniciar el backend**
```bash
cd ../../backend
node start_backend.js
```

6. **Iniciar el frontend**
```bash
cd ../frontend/admin
npm start
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
│   ├── admin/          # Panel administrativo
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   └── context/
│   │   └── package.json
│   └── evaluacion/     # Frontend para evaluaciones
└── README.md
```

## 🎨 Diseño

El proyecto utiliza el diseño visual del **Argon Dashboard** con:
- Paleta de colores moderna (#5e72e4, #825ee4)
- Gradientes de 87 grados
- Sombras suaves y bordes rectos
- Iconografía consistente
- Tipografía limpia y legible

## 🔐 Autenticación

- **Usuario**: `admin`
- **Contraseña**: `admin123`

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
- **Frontend Admin**: `http://localhost:3001`
- **Frontend Evaluación**: `http://localhost:3000`

## 📝 API Endpoints

### Locales
- `GET /api/admin/locales` - Obtener todos los locales
- `POST /api/admin/locales` - Crear nuevo local
- `PUT /api/admin/locales/:id` - Actualizar local
- `DELETE /api/admin/locales/:id` - Eliminar local

### Evaluaciones
- `GET /api/admin/evaluaciones` - Obtener evaluaciones
- `POST /api/evaluaciones` - Crear evaluación
- `GET /api/admin/estadisticas` - Obtener estadísticas

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Guillermo Angel** - [guillermoangel27@gmail.com](mailto:guillermoangel27@gmail.com)

## 🙏 Agradecimientos

- [Argon Dashboard](https://www.creative-tim.com/product/argon-dashboard) por el diseño inspirador
- [Material-UI](https://mui.com/) por los componentes de UI
- [Recharts](https://recharts.org/) por las librerías de gráficos 