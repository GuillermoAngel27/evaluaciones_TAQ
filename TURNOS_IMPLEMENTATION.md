# Implementación de Sistema de Turnos

## Resumen de Cambios

Se ha implementado un sistema de validación de turnos para las evaluaciones que automáticamente determina el turno actual basado en la hora del sistema y registra esta información en cada evaluación.

## Estructura de Base de Datos

### Nueva Tabla: `turnos`
```sql
CREATE TABLE turnos (
  turno INT(10) UNSIGNED NOT NULL,
  hra_ini VARCHAR(8) NOT NULL,
  hra_fin VARCHAR(8) NOT NULL,
  PRIMARY KEY (turno, hra_ini)
);
```

### Datos de Turnos
```sql
INSERT INTO turnos (turno, hra_ini, hra_fin) VALUES
(1, '05:30:01', '13:30:00'),
(2, '13:30:01', '21:00:00'),
(3, '00:00:00', '05:30:00'),
(4, '21:00:01', '23:59:59');
```

### Modificación de Tabla: `evaluaciones`
```sql
ALTER TABLE evaluaciones ADD COLUMN turno INT(10) UNSIGNED NOT NULL DEFAULT 1 AFTER fecha;
```

## Archivos Modificados/Creados

### Backend

#### 1. `backend/utils/turnoUtils.js` (NUEVO)
- `obtenerTurnoActual()`: Determina el turno actual basado en la hora del sistema (retorna número)
- `obtenerTurnoActualTexto()`: Obtiene el turno actual en formato texto
- `turnoATexto()`: Convierte número de turno a texto
- `validarTurnoEvaluacion()`: Valida si se puede evaluar en un turno específico
- `obtenerTodosLosTurnos()`: Obtiene información de todos los turnos

#### 2. `backend/routes/evaluaciones.js` (MODIFICADO)
- Agregado endpoint `GET /turno-actual` para obtener el turno actual
- Modificado endpoint `POST /` para incluir validación de turno y guardar el turno en la evaluación
- Importación de `obtenerTurnoActual` desde `turnoUtils`

#### 3. `backend/setup-turnos.js` (NUEVO)
- Script para configurar la tabla de turnos y modificar la tabla evaluaciones
- Incluye verificación de columnas existentes

#### 4. `backend/test-turnos.js` (NUEVO)
- Script de prueba para verificar la funcionalidad de turnos
- Simula diferentes horas para probar la lógica de determinación de turnos

### Frontend

#### 1. `frontend/evaluacion/src/pages/EvaluacionPage.js` (MODIFICADO)
- Agregado estado `turnoActual` para mostrar el turno actual
- Función `obtenerTurnoActual()` para consultar el turno desde el backend
- Visualización del turno actual en el formulario de evaluación
- Información adicional para el usuario sobre el turno

#### 2. `frontend/administrador/src/views/Evaluaciones.js` (MODIFICADO)
- Agregado filtro de turnos en la vista de evaluaciones detalladas
- Agregados badges de turno en cada tarjeta de evaluación
- Mejorada visualización del turno en el modal de detalles
- Implementada nueva nomenclatura de turnos con rangos horarios
- Agregado contador de evaluaciones por turno

## Instrucciones de Implementación

### 1. Configurar la Base de Datos

```bash
cd backend
node setup-turnos.js
```

Este script:
- Crea la tabla `turnos` si no existe
- Inserta los datos de turnos según los rangos especificados
- Agrega la columna `turno` a la tabla `evaluaciones` si no existe

### 2. Migrar Datos Existentes (si es necesario)

Si ya tenías evaluaciones con el formato anterior de turnos, ejecuta:

```bash
cd backend
node migrate-turnos.js
```

Este script:
- Detecta el formato actual de la columna turno
- Migra de VARCHAR a INT si es necesario
- Actualiza valores por defecto
- Proporciona estadísticas de la migración

### 3. Probar la Funcionalidad

```bash
cd backend
node test-turnos.js
```

Este script verifica:
- Que todos los turnos estén configurados correctamente
- Que la determinación del turno actual funcione
- Que diferentes horas se mapeen correctamente a los turnos

### 4. Reiniciar el Backend

```bash
cd backend
node start_backend.js
```

### 5. Probar el Frontend

```bash
cd frontend/evaluacion
npm start
```

Navegar a una URL de evaluación para verificar que se muestre el turno actual.

## Funcionalidades Implementadas

### 1. Determinación Automática de Turno
- El sistema consulta la tabla `turnos` para determinar el turno actual
- Se basa en la hora del sistema (HH:MM:SS)
- Maneja casos edge como el turno 3 que se divide en dos rangos

### 2. Registro de Turno en Evaluaciones
- Cada evaluación ahora incluye el campo `turno`
- Se registra automáticamente al momento de crear la evaluación
- No requiere intervención manual del usuario

### 3. Visualización en Frontend
- **Evaluación Pública**: Muestra el turno actual antes de enviar la evaluación
- **Panel Administrativo**: Muestra el turno en los detalles de cada evaluación

### 4. API Endpoints
- `GET /api/evaluaciones/turno-actual`: Obtiene el turno actual
- `POST /api/evaluaciones/`: Ahora incluye el turno en la respuesta

## Rangos de Turnos

| Turno | Hora Inicio | Hora Fin | Descripción |
|-------|-------------|----------|-------------|
| 1 | 05:30:01 | 13:30:00 | Mañana |
| 2 | 13:30:01 | 21:00:00 | Tarde |
| 3 | 00:00:00 | 05:30:00 | Madrugada |
| 4 | 21:00:01 | 23:59:59 | Noche |

## Consideraciones Técnicas

### 1. Manejo de Errores
- Si no se encuentra un turno para la hora actual, se usa turno 1 por defecto
- Se registran warnings en la consola para debugging
- El frontend maneja tanto números como texto para compatibilidad

### 2. Compatibilidad
- Los cambios son retrocompatibles
- Las evaluaciones existentes mantienen el valor por defecto 1
- El frontend maneja tanto el formato numérico como el texto para compatibilidad
- No se requieren cambios en la estructura de datos existente

### 3. Performance
- Las consultas de turno son eficientes con índices en las columnas de tiempo
- La determinación del turno se hace una sola vez por evaluación

## Próximos Pasos Opcionales

1. **Validación de Turnos Específicos**: Permitir que ciertos locales solo acepten evaluaciones en turnos específicos
2. **Estadísticas por Turno**: Agregar reportes que muestren el rendimiento por turno
3. **Configuración Dinámica**: Permitir modificar los rangos de turnos desde el panel administrativo
4. **Notificaciones**: Alertar cuando se acerque el cambio de turno

## Verificación de Implementación

Para verificar que todo funciona correctamente:

1. Ejecutar `node setup-turnos.js`
2. Si tenías datos existentes, ejecutar `node migrate-turnos.js`
3. Ejecutar `node test-turnos.js`
4. Crear una evaluación desde el frontend público
5. Verificar que se muestre el turno actual
6. Revisar en el panel administrativo que la evaluación incluya el turno
7. Verificar que las evaluaciones existentes sigan funcionando 