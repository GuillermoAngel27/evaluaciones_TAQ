# Frontend de Evaluaciones - Sistema TAQ

Frontend para la recolección de evaluaciones de clientes en locales comerciales.

## 🎯 Propósito

Este frontend permite a los clientes evaluar su experiencia en locales comerciales mediante:
- Calificación por estrellas (1-5)
- Comentarios opcionales
- Preguntas específicas según el tipo de local

## 🚀 Instalación

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Pasos de instalación

1. **Navegar al directorio:**
   ```bash
   cd frontend/evaluacion
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
   http://localhost:3001
   ```

## 📱 Uso

### Acceso a Evaluación
Para acceder a una evaluación específica, usar la URL:
```
http://localhost:3001/?id=ID_DEL_LOCAL
```

### Flujo de Evaluación
1. **Escaneo de QR** - El cliente escanea el código QR del local
2. **Verificación** - El sistema verifica si puede evaluar (máximo 1 por 24h)
3. **Preguntas** - Se muestran preguntas específicas según el tipo de local
4. **Calificación** - El cliente califica cada pregunta (1-5 estrellas)
5. **Comentario** - Opcionalmente puede agregar un comentario
6. **Envío** - La evaluación se envía al backend
7. **Confirmación** - Se muestra mensaje de agradecimiento

## 🏗️ Estructura del Proyecto

```
src/
├── components/
│   ├── PreguntasForm.js    # Formulario de preguntas
│   └── RatingSelector.js   # Selector de calificación
├── pages/
│   └── EvaluacionPage.js   # Página principal de evaluación
├── App.js                  # Componente principal
└── index.js               # Punto de entrada
```

## 🔧 Configuración

### Variables de Entorno
Crear un archivo `.env` en la raíz del proyecto:
```env
REACT_APP_API_URL=http://localhost:4000/api
PORT=3001
```

### Tipos de Locales Soportados
- **Misceláneas** - Preguntas básicas de servicio
- **Alimentos** - Incluye relación calidad-precio
- **Taxis** - Preguntas específicas de transporte
- **Estacionamiento** - Preguntas sobre instalaciones

## 📊 Características

### Responsive Design
- **Mobile-first** - Optimizado para dispositivos móviles
- **Touch-friendly** - Interfaz táctil intuitiva
- **Adaptativo** - Se adapta a diferentes tamaños de pantalla

### Validaciones
- **Respuestas obligatorias** - Todas las preguntas deben ser respondidas
- **Rango válido** - Calificaciones entre 1 y 5
- **Token único** - Prevención de evaluaciones duplicadas

### Estados de UI
- **Carga** - Mientras se verifica el local
- **Error** - Si el local no existe o está inactivo
- **Evaluación** - Formulario de preguntas
- **Envío** - Procesando la evaluación
- **Éxito** - Confirmación de envío

## 🔗 Integración

### Backend
- **API REST** en `http://localhost:4000`
- **Endpoints** para locales, evaluaciones y tokens
- **CORS** configurado para comunicación

### Base de Datos
- **MySQL** con tablas para locales, evaluaciones y respuestas
- **Tokens únicos** por dispositivo y local
- **Validación temporal** (24 horas)

## 🚀 Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo en puerto 3001
- `npm run build` - Construye la aplicación para producción
- `npm test` - Ejecuta las pruebas
- `npm run eject` - Expone la configuración de webpack

## 🎨 Diseño

### Paleta de Colores
- **Primario**: #1976d2 (Azul Material-UI)
- **Secundario**: #dc004e (Rojo Material-UI)
- **Fondo**: #f5f6fa (Gris claro)
- **Texto**: #263238 (Gris oscuro)

### Componentes
- **Tarjetas** con sombras suaves
- **Botones** con efectos hover
- **Formularios** con validación visual
- **Iconos** para mejor UX

## 📝 Notas de Desarrollo

### Tecnologías
- **React 19** - Biblioteca de interfaz
- **CSS Inline** - Estilos personalizados
- **Fetch API** - Comunicación con backend
- **LocalStorage** - Persistencia de device ID

### Consideraciones
- **Sin estado global** - Componentes simples
- **Sin routing** - Página única
- **Optimizado para móvil** - UX prioritaria
- **Accesibilidad** - Navegación por teclado

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
