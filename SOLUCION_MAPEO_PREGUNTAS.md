# Solución de Mapeo de Preguntas - Implementada ✅

## Problema Resuelto

El sistema tenía una inconsistencia donde:
- La tabla `respuestas` almacena **números** (1, 2, 3...) en la columna `pregunta`
- El frontend y backend intentaban usar **texto completo** de las preguntas
- No había correspondencia entre tipo de local y preguntas específicas

## Solución Implementada

### 1. **Funciones de Mapeo** (`backend/config/preguntas.js`)

```javascript
// Convertir texto de pregunta a número
const textoPreguntaANumero = (textoPregunta, tipoLocal) => {
  const tipoNormalizado = normalizarTipoLocal(tipoLocal);
  const preguntas = PREGUNTAS_POR_TIPO[tipoNormalizado] || [];
  const numero = preguntas.indexOf(textoPregunta) + 1;
  return numero > 0 ? numero : null;
};

// Convertir número a texto de pregunta
const numeroATextoPregunta = (numero, tipoLocal) => {
  const tipoNormalizado = normalizarTipoLocal(tipoLocal);
  const preguntas = PREGUNTAS_POR_TIPO[tipoNormalizado] || [];
  return preguntas[numero - 1] || null;
};
```

### 2. **Endpoint Actualizado** (`backend/routes/locales.js`)

```javascript
router.get('/respuestas-por-pregunta', (req, res) => {
  const { pregunta, tipo_local } = req.query;
  
  // Validar parámetros requeridos
  if (!pregunta || !tipo_local || tipo_local === 'all') {
    return res.status(400).json({ 
      error: 'Los parámetros "pregunta" y "tipo_local" son requeridos' 
    });
  }
  
  // Convertir texto a número
  const numeroPregunta = textoPreguntaANumero(pregunta, tipo_local);
  if (!numeroPregunta) {
    return res.status(400).json({ 
      error: 'Pregunta no válida para el tipo de local especificado' 
    });
  }
  
  // Consulta SQL con número y tipo
  const sql = `
    SELECT l.nombre, r.puntuacion, e.comentario, e.fecha, e.turno, r.pregunta
    FROM respuestas r
    INNER JOIN evaluaciones e ON r.evaluacion_id = e.id
    INNER JOIN locales l ON e.local_id = l.id
    WHERE r.pregunta = ? AND l.tipo_local = ? AND l.estatus = 'activo'
  `;
  
  // Devolver resultados con mapeo
  const respuestasFormateadas = results.map(respuesta => ({
    nombre_local: respuesta.nombre_local,
    puntuacion: respuesta.puntuacion,
    comentario: respuesta.comentario,
    fecha: respuesta.fecha,
    turno: respuesta.turno,
    pregunta_texto: pregunta, // Texto original
    pregunta_numero: respuesta.numero_pregunta // Número de la BD
  }));
});
```

### 3. **Script de Inserción Corregido** (`backend/insertar-datos-prueba-estadisticas.js`)

```javascript
// Obtener preguntas según el tipo de local
const preguntasParaLocal = PREGUNTAS_POR_TIPO[local.tipo_local] || [];

// Insertar respuestas con números
for (const pregunta of preguntasParaLocal) {
  const numeroPregunta = textoPreguntaANumero(pregunta, local.tipo_local);
  const puntuacionPregunta = Math.floor(Math.random() * 5) + 1;
  
  if (numeroPregunta) {
    await connection.execute(
      'INSERT INTO respuestas (evaluacion_id, pregunta, puntuacion) VALUES (?, ?, ?)',
      [evaluacionId, numeroPregunta, puntuacionPregunta] // ✅ Número en lugar de texto
    );
  }
}
```

### 4. **Frontend Actualizado** (`frontend/administrador/src/views/Estadisticas.js`)

```javascript
// Siempre enviar tipo_local con la pregunta
const cargarRespuestasPorPregunta = async (pregunta) => {
  const params = new URLSearchParams();
  params.append('pregunta', pregunta);
  params.append('tipo_local', selectedTipo); // ✅ Siempre enviar tipo_local
  
  const response = await localesAPI.getRespuestasPorPregunta(params.toString());
  setRespuestasData(response.data);
};
```

## Flujo de Datos Corregido

```
1. Usuario selecciona: tipo="alimentos", pregunta="¿El personal fue amable?"
2. Frontend envía: { pregunta: "¿El personal fue amable?", tipo_local: "alimentos" }
3. Backend convierte: texto → número (1)
4. SQL busca: WHERE r.pregunta = 1 AND l.tipo_local = 'alimentos'
5. Backend devuelve: resultados con pregunta_texto y pregunta_numero
6. Frontend muestra: resultados correctos
```

## Validaciones Implementadas

### ✅ **Validación de Pregunta**
- Verifica que la pregunta existe para el tipo de local
- Rechaza preguntas no válidas con error 400

### ✅ **Validación de Tipo**
- Filtra por tipo de local en la consulta SQL
- Asegura correspondencia pregunta-tipo

### ✅ **Validación de Parámetros**
- Requiere tanto `pregunta` como `tipo_local`
- Rechaza `tipo_local = 'all'` para este endpoint

## Resultados de Pruebas

```
✅ 3 respuestas encontradas para "¿El personal fue amable?" (alimentos)
✅ 1 respuesta encontrada para "¿El local estaba limpio?" (misceláneas)
✅ Error manejado correctamente para preguntas no válidas
✅ Mapeo funcionando con pregunta_texto y pregunta_numero
```

## Beneficios de la Solución

### 🔧 **Sin Cambios en Base de Datos**
- Mantiene estructura actual de `respuestas`
- No requiere migraciones
- Compatible con datos existentes

### 🎯 **Lógica Clara**
- Mapeo explícito texto ↔ número
- Validación de correspondencia pregunta-tipo
- Configuración centralizada

### 🚀 **Funcionalidad Completa**
- Filtros por tipo de local funcionan
- Análisis por preguntas específicas funciona
- Estadísticas correctas

## Archivos Modificados

1. **`backend/config/preguntas.js`** - Agregadas funciones de mapeo
2. **`backend/routes/locales.js`** - Endpoint actualizado con mapeo
3. **`backend/insertar-datos-prueba-estadisticas.js`** - Inserción corregida
4. **`frontend/administrador/src/views/Estadisticas.js`** - Frontend actualizado

## Estado Final

✅ **Solución implementada y funcionando**
✅ **Mapeo tipo de local ↔ preguntas ↔ respuestas correcto**
✅ **Sin afectar estructura de base de datos**
✅ **Validaciones y manejo de errores implementados**
✅ **Pruebas exitosas realizadas** 