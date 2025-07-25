# Panel de Administración

Panel de administración basado en Argon Dashboard React para el sistema de evaluaciones TAQ.

## Características

- Dashboard moderno y responsive
- Sistema de autenticación
- Navegación lateral con sidebar
- Componentes reutilizables
- Diseño basado en Bootstrap 5
- Iconos de FontAwesome
- Gráficos con Chart.js

## Instalación

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn

### Pasos de instalación

1. **Navegar al directorio del proyecto:**
   ```bash
   cd frontend/administrador
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm start
   ```

4. **Abrir en el navegador:**
   ```
   http://localhost:3000
   ```

## Estructura del Proyecto

```
src/
├── assets/           # Recursos estáticos (CSS, imágenes, fuentes)
├── components/       # Componentes reutilizables
│   ├── Footers/     # Componentes de pie de página
│   ├── Headers/     # Componentes de encabezado
│   ├── Navbars/     # Barras de navegación
│   └── Sidebar/     # Barra lateral
├── layouts/         # Layouts principales (Admin, Auth)
├── views/           # Páginas y vistas
│   └── examples/    # Ejemplos de páginas
├── variables/       # Variables de configuración
├── index.js         # Punto de entrada
└── routes.js        # Configuración de rutas
```

## Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm test` - Ejecuta las pruebas
- `npm run eject` - Expone la configuración de webpack

## Tecnologías Utilizadas

- **React 18** - Biblioteca de interfaz de usuario
- **React Router 6** - Enrutamiento
- **Bootstrap 5** - Framework CSS
- **Reactstrap** - Componentes de Bootstrap para React
- **FontAwesome** - Iconos
- **Chart.js** - Gráficos
- **Perfect Scrollbar** - Scrollbar personalizado
- **Axios** - Cliente HTTP

## Configuración

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
```

### Personalización

- **Colores**: Modificar variables en `src/assets/scss/argon-dashboard/_variables.scss`
- **Rutas**: Editar `src/routes.js`
- **Componentes**: Personalizar en `src/components/`

## Despliegue

Para construir la aplicación para producción:

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `build/`.

## Licencia

Este proyecto está basado en Argon Dashboard React de Creative Tim, licenciado bajo MIT. 