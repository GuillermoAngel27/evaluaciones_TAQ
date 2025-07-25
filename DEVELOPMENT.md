# 🚀 Guía de Desarrollo - Sistema de Evaluaciones TAQ

## ⚡ Inicio Rápido

### 1. Instalación Completa
```bash
# Clonar repositorio
git clone git@github.com:GuillermoAngel27/evaluaciones_TAQ.git
cd evaluacionesTAQ

# Instalar todas las dependencias
npm run install:all

# Configurar variables de entorno
cp env.example .env
cd backend && cp env.example .env && cd ..
cd frontend/administrador && cp env.example .env && cd ../..
```

### 2. Configurar Base de Datos
```sql
CREATE DATABASE evaluaciones_taq;
USE evaluaciones_taq;

-- Crear tablas (ejecutar scripts SQL necesarios)
```

### 3. Iniciar Desarrollo
```bash
# Iniciar todos los servicios
npm run start:dev
```

## 📁 Estructura del Proyecto

```
evaluacionesTAQ/
├── backend/                 # API REST (Node.js + Express + MySQL)
│   ├── config/             # Configuración de preguntas
│   ├── routes/             # Rutas de la API
│   ├── database/           # Scripts de base de datos
│   ├── start_backend.js    # Punto de entrada
│   └── package.json
├── frontend/
│   ├── administrador/      # Panel administrativo (Argon Dashboard)
│   │   ├── src/
│   │   │   ├── components/ # Componentes reutilizables
│   │   │   ├── views/      # Páginas del dashboard
│   │   │   ├── context/    # Contexto de autenticación
│   │   │   └── utils/      # Utilidades y API
│   │   └── package.json
│   └── evaluacion/         # Frontend de evaluaciones (React)
│       ├── src/
│       │   ├── components/ # Componentes de evaluación
│       │   ├── pages/      # Páginas de evaluación
│       │   └── App.js      # Componente principal
│       └── package.json
├── package.json            # Scripts de gestión del proyecto
├── env.example             # Variables de entorno de ejemplo
└── README.md              # Documentación principal
```

## 🔧 Scripts Disponibles

### Instalación
```bash
npm run install:all        # Instalar todo
npm run install:backend    # Solo backend
npm run install:admin      # Solo panel administrativo
npm run install:evaluacion # Solo frontend evaluaciones
```

### Desarrollo
```bash
npm run start:dev          # Iniciar todos los servicios
npm run start:backend      # Solo backend (puerto 4000)
npm run start:admin        # Solo administrativo (puerto 3000)
npm run start:evaluacion   # Solo evaluaciones (puerto 3001)
```

### Producción
```bash
npm run build:all          # Construir todos los frontends
npm run build:admin        # Construir administrativo
npm run build:evaluacion   # Construir evaluaciones
```

## 🌐 URLs de Acceso

| Servicio | URL | Descripción |
|----------|-----|-------------|
| Backend API | http://localhost:4000 | API REST |
| Panel Admin | http://localhost:3000 | Dashboard administrativo |
| Evaluaciones | http://localhost:3001 | Frontend de evaluaciones |

## 🔐 Credenciales de Desarrollo

### Panel Administrativo
- **Usuario**: `admin`
- **Contraseña**: `admin1234`

### Frontend Evaluaciones
- **Sin autenticación** - Acceso directo por URL
- **Ejemplo**: `http://localhost:3001/?id=1`

## 📊 Base de Datos

### Tablas Principales
- **`locales`** - Información de locales comerciales
- **`evaluaciones`** - Evaluaciones realizadas
- **`respuestas`** - Respuestas individuales por pregunta
- **`tokens`** - Tokens de acceso para evaluaciones

### Configuración
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password_aqui
DB_NAME=evaluaciones_taq
DB_PORT=3306
```

## 🎯 Flujo de Desarrollo

### 1. Backend
```bash
cd backend
npm start
# Servidor en http://localhost:4000
```

### 2. Panel Administrativo
```bash
cd frontend/administrador
npm start
# Dashboard en http://localhost:3000
```

### 3. Frontend Evaluaciones
```bash
cd frontend/evaluacion
npm start
# Evaluaciones en http://localhost:3001
```

## 🔍 Debugging

### Backend
```bash
# Ver logs del servidor
cd backend && npm start

# Verificar conexión a BD
curl http://localhost:4000/health
```

### Frontend Administrativo
```bash
# Ver logs de React
cd frontend/administrador && npm start

# Verificar autenticación
# Revisar localStorage en DevTools
```

### Frontend Evaluaciones
```bash
# Ver logs de React
cd frontend/evaluacion && npm start

# Probar evaluación
# http://localhost:3001/?id=1
```

## 🐛 Troubleshooting

### Error de Conexión a Base de Datos
```bash
# Verificar MySQL
mysql -u root -p
SHOW DATABASES;

# Verificar variables de entorno
cat backend/.env
```

### Error de CORS
```bash
# Verificar configuración en backend/start_backend.js
# Asegurar que los puertos estén incluidos
```

### Error de Puerto en Uso
```bash
# Verificar puertos ocupados
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :4000

# Terminar procesos si es necesario
taskkill /PID <PID> /F
```

## 📝 Notas de Desarrollo

### Tecnologías Utilizadas
- **Backend**: Node.js, Express, MySQL2, JWT
- **Admin**: React, Argon Dashboard, Bootstrap, Chart.js
- **Evaluaciones**: React, CSS Inline, Fetch API

### Convenciones
- **Commits**: Usar mensajes descriptivos
- **Variables**: Usar camelCase en JavaScript
- **Archivos**: Usar PascalCase para componentes React
- **Rutas**: Usar kebab-case para URLs

### Próximos Pasos
1. Implementar tests automatizados
2. Agregar migraciones de base de datos
3. Implementar logging avanzado
4. Optimizar performance
5. Agregar documentación de API

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📞 Soporte

- **Email**: guillermoangel27@gmail.com
- **Issues**: https://github.com/GuillermoAngel27/evaluaciones_TAQ/issues
- **Documentación**: README.md 