# Integración de Estadísticas con Datos Reales

## Descripción

La sección de estadísticas ha sido completamente integrada con datos reales de la base de datos. Ahora muestra información real de locales, evaluaciones y respuestas específicas por pregunta.

## Funcionalidades Implementadas

### 1. Estadísticas Generales de Locales
- **Datos reales** de la tabla `locales` con sus evaluaciones
- **Cálculo automático** de calificaciones promedio
- **Conteo de evaluaciones** por local
- **Filtros dinámicos** por nombre y tipo de local
- **Indicadores visuales** para calificaciones bajas (≤3)

### 2. Análisis por Preguntas Específicas
- **Respuestas reales** de la tabla `respuestas`
- **Filtrado por tipo de local** y pregunta específica
- **Visualización detallada** con calificaciones y comentarios
- **Filtros de fecha** (soportados en el backend)

## Estructura de Datos Utilizada

### Tabla `locales`
```sql
CREATE TABLE locales (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  estatus VARCHAR(45) DEFAULT 'activo',
  tipo_local VARCHAR(45) NOT NULL,
  token_publico VARCHAR(32) UNIQUE
);
```

### Tabla `evaluaciones`
```sql
CREATE TABLE evaluaciones (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  local_id INT(11) NOT NULL,
  puntuacion INT(11) NOT NULL,
  comentario TEXT,
  fecha DATETIME NOT NULL,
  turno VARCHAR(45) NOT NULL
);
```

### Tabla `respuestas`
```sql
CREATE TABLE respuestas (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  evaluacion_id INT(11) NOT NULL,
  pregunta VARCHAR(255) NOT NULL,
  puntuacion INT(11) NOT NULL
);
```

## Endpoints del Backend

### 1. Estadísticas Generales
```
GET /api/locales/evaluaciones/estadisticas
```

**Parámetros opcionales:**
- `fechaDesde`: Fecha de inicio (YYYY-MM-DD)
- `fechaHasta`: Fecha de fin (YYYY-MM-DD)

**Respuesta:**
```json
[
  {
    "id": 1,
    "nombre": "Restaurante El Buen Sabor",
    "tipo": "alimentos",
    "estatus": "activo",
    "totalEvaluaciones": 45,
    "calificacionPromedio": 4.2,
    "ultimaEvaluacion": "2024-01-15 14:30:00",
    "evaluacionesConComentario": 38
  }
]
```

### 2. Respuestas por Pregunta
```
GET /api/locales/respuestas-por-pregunta
```

**Parámetros requeridos:**
- `pregunta`: Texto de la pregunta específica

**Parámetros opcionales:**
- `tipo_local`: Tipo de local para filtrar
- `fechaDesde`: Fecha de inicio (YYYY-MM-DD)
- `fechaHasta`: Fecha de fin (YYYY-MM-DD)

**Respuesta:**
```json
[
  {
    "nombre_local": "Restaurante El Buen Sabor",
    "puntuacion": 5,
    "comentario": "Excelente servicio",
    "fecha": "2024-01-15 14:30:00",
    "turno": "1"
  }
]
```

## Configuración del Frontend

### Estados del Componente
```javascript
// Estados para locales
const [localesData, setLocalesData] = useState([]);
const [loadingLocales, setLoadingLocales] = useState(true);
const [errorLocales, setErrorLocales] = useState(null);

// Estados para respuestas
const [respuestasData, setRespuestasData] = useState([]);
const [loadingRespuestas, setLoadingRespuestas] = useState(false);
const [errorRespuestas, setErrorRespuestas] = useState(null);
```

### Funciones de API
```javascript
// Cargar estadísticas generales
const cargarLocales = async () => {
  const response = await localesAPI.getEstadisticas();
  setLocalesData(response.data);
};

// Cargar respuestas por pregunta
const cargarRespuestasPorPregunta = async (pregunta) => {
  const params = new URLSearchParams();
  params.append('pregunta', pregunta);
  if (selectedTipo !== "all") {
    params.append('tipo_local', selectedTipo);
  }
  const response = await localesAPI.getRespuestasPorPregunta(params.toString());
  setRespuestasData(response.data);
};
```

## Preguntas por Tipo de Local

### Alimentos (5 preguntas)
1. ¿El personal fue amable?
2. ¿El local estaba limpio?
3. ¿La atención fue rápida?
4. ¿Al finalizar su compra le entregaron ticket?
5. ¿La relación calidad-precio fue adecuada?

### Misceláneas (4 preguntas)
1. ¿El personal fue amable?
2. ¿El local estaba limpio?
3. ¿La atención fue rápida?
4. ¿Al finalizar su compra le entregaron ticket?

### Taxis (4 preguntas)
1. ¿El personal fue amable?
2. ¿Las instalaciones se encuentra limpias?
3. ¿La asignación de unidad fue rápida?
4. ¿Las instalaciones son adecuadas para realizar el abordaje?

### Estacionamiento (4 preguntas)
1. ¿El personal fue amable?
2. ¿Las instalaciones se encuentran limpias?
3. ¿El acceso a las instalaciones son adecuadas?
4. ¿El proceso para pago fue optimo?

## Cómo Probar

### 1. Preparar la Base de Datos
```bash
cd backend
node insertar-datos-prueba-estadisticas.js
```

### 2. Iniciar el Backend
```bash
cd backend
node start_backend.js
```

### 3. Probar los Endpoints
```bash
cd backend
node test-estadisticas-reales.js
```

### 4. Iniciar el Frontend
```bash
cd frontend/administrador
npm start
```

### 5. Navegar a Estadísticas
1. Inicia sesión en el administrador
2. Ve a la sección "Estadísticas"
3. Verifica que se muestren datos reales
4. Prueba los filtros y análisis por preguntas

## Características de la Interfaz

### Estados de Carga
- **Loading spinner** mientras se cargan los datos
- **Mensajes de error** con opción de reintentar
- **Estados vacíos** cuando no hay datos

### Indicadores Visuales
- **Colores por tipo de local**:
  - 🟢 Verde: Alimentos
  - 🔵 Azul: Misceláneas
  - 🟡 Amarillo: Taxis
  - ⚫ Gris: Estacionamiento
- **Resaltado de problemas**: Fondo rojo claro para calificaciones ≤3
- **Estrellas visuales** para calificaciones (1-5)

### Filtros Disponibles
- **Búsqueda por nombre** de local
- **Filtro por tipo** de local
- **Filtro por pregunta** específica
- **Limpieza de filtros** con un botón

## Datos de Ejemplo Incluidos

El script `insertar-datos-prueba-estadisticas.js` crea:

- **8 locales** de diferentes tipos
- **5-15 evaluaciones** por local
- **Respuestas completas** para cada pregunta según el tipo
- **Fechas distribuidas** en los últimos 30 días
- **Calificaciones variadas** (1-5) para mostrar diferentes escenarios

## Posibles Mejoras Futuras

### 1. Gráficos y Visualizaciones
- Gráficos de tendencias de calificaciones
- Comparativas entre locales
- Análisis de respuestas por pregunta con gráficos

### 2. Exportación de Datos
- Exportar estadísticas a Excel/CSV
- Reportes PDF de evaluaciones
- Dashboard ejecutivo

### 3. Filtros Avanzados
- Filtro por rango de calificaciones
- Filtro por evaluaciones con/sin comentarios
- Filtro por turno específico

### 4. Notificaciones
- Alertas de nuevas evaluaciones
- Notificaciones de calificaciones bajas
- Reportes automáticos por email

## Troubleshooting

### Error: "No se pueden cargar los datos"
- Verifica que el backend esté corriendo en el puerto 4000
- Verifica la conexión a la base de datos
- Revisa los logs del backend

### Error: "No hay locales con evaluaciones"
- Ejecuta el script de datos de prueba
- Verifica que existan evaluaciones en la base de datos
- Verifica que los locales tengan estatus 'activo'

### Error de Autenticación
- Verifica que el token de autenticación sea válido
- Revisa los logs del backend para errores de autenticación

### Datos no se actualizan
- Verifica que las consultas SQL estén correctas
- Revisa los logs del backend para errores de base de datos
- Verifica que las tablas tengan la estructura correcta

## Archivos Modificados

### Backend
- `backend/routes/locales.js` - Nuevo endpoint para respuestas por pregunta
- `backend/insertar-datos-prueba-estadisticas.js` - Script para datos de prueba (nuevo)
- `backend/test-estadisticas-reales.js` - Script de pruebas (nuevo)

### Frontend
- `frontend/administrador/src/views/Estadisticas.js` - Integración completa con datos reales
- `frontend/administrador/src/utils/api.js` - Nueva función para respuestas por pregunta

### Documentación
- `ESTADISTICAS_INTEGRATION.md` - Documentación completa (nuevo)

## Conclusión

La sección de estadísticas ahora está completamente funcional con datos reales de la base de datos. Proporciona una vista completa y detallada de las evaluaciones del sistema, permitiendo tanto un análisis general como un análisis granular por preguntas específicas. 