# Corrección de Gráfica de Barras - Barras en Blanco ✅

## Resumen del Problema

Las barras de la gráfica en la pestaña "Por Pregunta" se mostraban en blanco sin valores. El problema era que la función `generarDatosGrafica()` estaba intentando obtener datos de las preguntas desde los arrays `areasProblema` y `mejoresPracticas`, que solo contienen las preguntas en los extremos (muy bajas o muy altas), no todas las preguntas del tipo de local.

## 🔍 Análisis del Problema

### **Causa Raíz:**
- **Datos Incompletos:** Los arrays `areasProblema` y `mejoresPracticas` solo contienen preguntas con promedios < 3.5 y > 4.5 respectivamente
- **Falta de Datos Reales:** No había un endpoint que obtuviera los promedios de **todas** las preguntas de un tipo de local
- **Lógica Incorrecta:** La función intentaba combinar datos parciales en lugar de obtener datos completos

### **Síntomas:**
- Barras vacías (sin altura)
- Valores 0 para todas las preguntas
- Gráfica sin datos visuales

## 🔧 Solución Implementada

### **1. Nuevo Endpoint Backend**

#### **Endpoint:** `GET /locales/promedios-por-pregunta/:tipoLocal`

```javascript
// GET - Obtener promedios por pregunta por tipo de local
router.get('/promedios-por-pregunta/:tipoLocal', authenticateToken, requireRole(['administrador', 'normal']), (req, res) => {
  const { tipoLocal } = req.params;
  const tipoNormalizado = normalizarTipoLocal(tipoLocal);
  
  // Obtener todas las preguntas del tipo de local
  const { PREGUNTAS_POR_TIPO } = require('../config/preguntas.js');
  const preguntasTipo = PREGUNTAS_POR_TIPO[tipoNormalizado] || [];
  
  // Crear consulta para obtener promedios de todas las preguntas
  const numerosPreguntas = Array.from({ length: preguntasTipo.length }, (_, i) => i + 1);
  const placeholders = numerosPreguntas.map(() => '?').join(',');
  
  const sql = `
    SELECT 
      r.pregunta as numero_pregunta,
      AVG(r.puntuacion) as promedio,
      COUNT(*) as total_respuestas
    FROM respuestas r
    INNER JOIN evaluaciones e ON r.evaluacion_id = e.id
    INNER JOIN locales l ON e.local_id = l.id
    WHERE l.estatus = 'activo' 
    AND l.tipo_local = ? 
    AND r.pregunta IN (${placeholders})
    GROUP BY r.pregunta
    ORDER BY r.pregunta ASC
  `;
  
  // Procesar resultados y retornar datos completos
});
```

#### **Características del Endpoint:**
- **Datos Completos:** Obtiene promedios de todas las preguntas del tipo
- **Normalización:** Usa la función de normalización de tipos
- **Mapeo de Preguntas:** Convierte números a texto usando `numeroATextoPregunta`
- **Datos por Defecto:** Incluye preguntas sin datos con promedio 0

### **2. Nueva Función API Frontend**

#### **Función:** `getPromediosPorPregunta`

```javascript
// En utils/api.js
getPromediosPorPregunta: (tipoLocal) => api.get(`/locales/promedios-por-pregunta/${tipoLocal}`),
```

### **3. Estados Adicionales Frontend**

```javascript
// Nuevos estados para la gráfica
const [datosGrafica, setDatosGrafica] = useState(null);
const [loadingGrafica, setLoadingGrafica] = useState(false);
```

### **4. Función de Carga de Datos**

```javascript
// Función para cargar datos de la gráfica por pregunta
const cargarDatosGrafica = async (tipoLocal) => {
  try {
    setLoadingGrafica(true);
    
    const response = await localesAPI.getPromediosPorPregunta(tipoLocal);
    console.log('Datos de gráfica cargados:', response.data);
    setDatosGrafica(response.data);
  } catch (error) {
    console.error('Error cargando datos de gráfica:', error);
    setDatosGrafica(null);
  } finally {
    setLoadingGrafica(false);
  }
};
```

### **5. useEffect para Carga Automática**

```javascript
// Cargar datos de la gráfica cuando cambie el tipo seleccionado
useEffect(() => {
  if (activeTab === 'preguntas') {
    cargarDatosGrafica(selectedTipoGrafica);
  }
}, [selectedTipoGrafica, activeTab]);
```

### **6. Función de Generación de Datos Simplificada**

```javascript
// Función para generar datos de la gráfica de preguntas
const generarDatosGrafica = () => {
  if (!datosGrafica || datosGrafica.length === 0) {
    return null;
  }

  const labels = datosGrafica.map(item => item.pregunta);
  const data = datosGrafica.map(item => item.promedio);
  
  return {
    labels: labels,
    datasets: [{
      label: `Promedio por Pregunta - ${selectedTipoGrafica}`,
      data: data,
      backgroundColor: data.map(promedio => {
        if (promedio >= 4) return 'rgba(40, 167, 69, 0.8)'; // Verde
        if (promedio >= 3) return 'rgba(255, 193, 7, 0.8)'; // Amarillo
        return 'rgba(220, 53, 69, 0.8)'; // Rojo
      }),
      // ... resto de configuración
    }]
  };
};
```

### **7. Estado de Carga en la Gráfica**

```javascript
{loadingGrafica ? (
  <div className="text-center py-5">
    <Spinner color="primary" />
    <p className="mt-2">Cargando datos de la gráfica...</p>
  </div>
) : generarDatosGrafica() ? (
  <Bar data={generarDatosGrafica()} options={opcionesGrafica} />
) : (
  <div className="text-center py-5">
    <p className="text-muted">
      No hay datos disponibles para el tipo de local seleccionado.
    </p>
  </div>
)}
```

## 📊 Estructura de Datos del Nuevo Endpoint

### **Respuesta del Endpoint:**
```json
[
  {
    "numero": 1,
    "pregunta": "¿El personal fue amable?",
    "promedio": 4,
    "totalRespuestas": 25
  },
  {
    "numero": 2,
    "pregunta": "¿El local estaba limpio?",
    "promedio": 3,
    "totalRespuestas": 25
  },
  {
    "numero": 3,
    "pregunta": "¿La atención fue rápida?",
    "promedio": 5,
    "totalRespuestas": 25
  }
]
```

### **Características:**
- **Datos Completos:** Incluye todas las preguntas del tipo
- **Promedios Reales:** Calculados desde la base de datos
- **Conteo de Respuestas:** Para contexto adicional
- **Mapeo de Texto:** Preguntas convertidas de número a texto

## ✅ Beneficios de la Corrección

### **Para el Usuario:**
1. **Datos Reales:** Barras con valores reales de la base de datos
2. **Visualización Completa:** Todas las preguntas del tipo mostradas
3. **Carga Dinámica:** Datos se actualizan al cambiar tipo de local
4. **Estados de Carga:** Feedback visual durante la carga

### **Para el Sistema:**
1. **Datos Precisos:** Información real vs datos simulados
2. **Escalabilidad:** Fácil agregar nuevos tipos de local
3. **Mantenibilidad:** Código más limpio y organizado
4. **Performance:** Carga optimizada por tipo de local

## 🚀 Estado Final

### **Funcionalidad:**
- ✅ Barras con valores reales
- ✅ Carga dinámica por tipo de local
- ✅ Estados de carga apropiados
- ✅ Manejo de errores robusto
- ✅ Datos completos de todas las preguntas

### **Experiencia:**
- ✅ Visualización inmediata de datos
- ✅ Feedback visual durante carga
- ✅ Cambio instantáneo entre tipos
- ✅ Información contextual completa

### **Técnico:**
- ✅ Endpoint dedicado para datos de gráfica
- ✅ Estados bien organizados
- ✅ Carga optimizada
- ✅ Compatibilidad preservada

## 🎯 Conclusión

La corrección ha transformado la gráfica de barras de una visualización vacía a una herramienta funcional que muestra datos reales y precisos. Los usuarios ahora pueden:

1. **Ver promedios reales** de cada pregunta por tipo de local
2. **Comparar visualmente** el rendimiento entre preguntas
3. **Identificar patrones** de rendimiento inmediatamente
4. **Tomar decisiones** basadas en datos reales

La implementación mantiene toda la funcionalidad anterior mientras proporciona datos precisos y una experiencia de usuario significativamente mejorada. 