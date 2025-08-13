# 📚 MANUAL DE USUARIO COMPLETO - SISTEMA DE EVALUACIONES TAQ

## 📋 **INFORMACIÓN GENERAL**

**Versión del Manual:** 2.0  
**Fecha de Actualización:** Diciembre 2024  
**Sistema:** Evaluaciones TAQ - Panel Administrativo  
**URL de Acceso:** `http://localhost:3000` (Desarrollo) / `https://admine.taqro.com.mx` (Producción)

---

## 🔐 **CAPÍTULO 1: ACCESO AL SISTEMA**

### **1.1 Página de Login**

#### **Ubicación y Acceso**
- **URL Directa:** `/l/login` - Ruta específica para la página de autenticación
- **Acceso desde:** Navegador web moderno (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- **Requisitos:** JavaScript habilitado y cookies activadas para funcionamiento correcto
- **Redirección:** Al acceder a cualquier ruta protegida sin autenticación, se redirige automáticamente al login

#### **Credenciales por Defecto - Explicación Detallada**
| Rol | Usuario | Contraseña | Acceso | Descripción de Funcionalidades |
|-----|---------|------------|---------|--------------------------------|
| **Administrador** | `admin` | `admin1234` | Completo | Acceso total a todas las funciones del sistema, incluyendo gestión de usuarios, configuración del sistema y auditoría completa |
| **Normal** | `usuario1` | `usuario1234` | Limitado | Acceso para gestionar locales, ver evaluaciones, generar reportes y acceder a estadísticas básicas |

#### **Proceso de Login**
1. **Abrir navegador** y navegar a la URL del sistema
2. **Ingresar credenciales** en los campos correspondientes
3. **Hacer clic** en "Iniciar Sesión"
4. **Sistema valida** credenciales y redirige al dashboard
5. **Mensaje de bienvenida** aparece automáticamente

#### **Características de Seguridad**
- **Rate Limiting**: Máximo 6 intentos en 15 minutos
- **Validación de contraseñas**: Mínimo 8 caracteres con complejidad
- **Sesiones seguras**: JWT con cookies httpOnly
- **Logout automático**: Por inactividad o cierre de sesión

---

## 🏠 **CAPÍTULO 2: INTERFAZ PRINCIPAL**

### **2.1 Dashboard Principal (`/a/inicio`)**

#### **Elementos de la Interfaz**
- **Sidebar Izquierdo**: Menú de navegación principal que contiene todas las secciones del sistema. Se colapsa automáticamente en dispositivos móviles para optimizar el espacio de pantalla.
- **Header Superior**: Barra superior que muestra el logo del sistema, información del usuario logueado (nombre, rol, avatar) y el menú desplegable de usuario con opciones como cerrar sesión.
- **Área de Contenido**: Zona principal donde se muestran las métricas del dashboard, gráficos interactivos y estadísticas en tiempo real. Es la parte más dinámica de la interfaz.
- **Footer**: Pie de página que contiene información del sistema, versión y enlaces de soporte.

#### **Métricas del Dashboard - Explicación Detallada**

##### **📊 Total de Locales**
- **¿Qué muestra?** Contador en tiempo real de todos los establecimientos comerciales registrados en el sistema
- **¿Qué incluye?** Locales activos (operando normalmente) e inactivos (temporalmente cerrados o descontinuados)
- **¿Para qué sirve?** Permite al administrador conocer la cobertura total del sistema y monitorear el crecimiento de la red de establecimientos
- **¿Cómo se actualiza?** Se actualiza automáticamente cada 30 segundos y también cuando se crean, editan o eliminan locales

##### **📝 Total de Evaluaciones**
- **¿Qué muestra?** Número acumulado de todas las evaluaciones realizadas por clientes desde el inicio del sistema
- **¿Qué incluye?** Todas las evaluaciones válidas (con tokens únicos) de todos los tipos de locales
- **¿Para qué sirve?** Indica el nivel de participación de los clientes y la actividad general del sistema
- **¿Cómo se calcula?** Suma de evaluaciones de la tabla `evaluaciones` en la base de datos

##### **⭐ Promedio General**
- **¿Qué muestra?** Calificación promedio de todas las evaluaciones del sistema en una escala de 1 a 5 estrellas
- **¿Qué incluye?** Promedio ponderado de todas las respuestas a todas las preguntas de todos los locales
- **¿Para qué sirve?** Proporciona una métrica de satisfacción general del cliente y permite identificar tendencias de calidad
- **¿Cómo se calcula?** Suma de todas las puntuaciones dividida por el total de respuestas

##### **📅 Evaluaciones Hoy**
- **¿Qué muestra?** Contador de evaluaciones realizadas en el día actual (desde 00:00:00 hasta 23:59:59)
- **¿Qué incluye?** Solo evaluaciones del día en curso, útil para monitoreo diario
- **¿Para qué sirve?** Permite verificar la actividad diaria del sistema y comparar con días anteriores
- **¿Cómo se filtra?** Por fecha del servidor, considerando la zona horaria del sistema

##### **🎯 Satisfacción**
- **¿Qué muestra?** Porcentaje de evaluaciones con calificación alta (4 o 5 estrellas) del total de evaluaciones
- **¿Qué incluye?** Solo evaluaciones con puntuación 4-5 estrellas, consideradas como "satisfactorias"
- **¿Para qué sirve?** Métrica clave para medir la calidad del servicio y la satisfacción del cliente
- **¿Cómo se calcula?** (Evaluaciones 4-5 estrellas / Total de evaluaciones) × 100

#### **Actualización Automática - Funcionamiento Detallado**
- **Frecuencia**: El sistema ejecuta una actualización automática cada 30 segundos para mantener las métricas siempre actualizadas
- **Indicador Visual**: Un spinner de carga (ícono giratorio) aparece brevemente en cada métrica durante la actualización
- **Estado en Tiempo Real**: Todas las métricas se muestran con la información más reciente disponible, sin necesidad de recargar la página
- **Optimización**: Las actualizaciones son inteligentes y solo recargan datos que han cambiado, manteniendo el rendimiento del sistema

### **2.2 Navegación del Sistema**

#### **Menú Principal (Sidebar) - Explicación Detallada**
| Opción | Icono | Descripción | Acceso | Funcionalidades Específicas |
|--------|-------|-------------|---------|----------------------------|
| **Inicio** | 📊 | Dashboard principal con métricas en tiempo real | Todos los roles | Ver métricas generales, gráficos de actividad, notificaciones del sistema y acceso rápido a funciones principales |
| **Gestión de Usuarios** | 👥 | Administración completa del sistema de usuarios | Solo Administrador | Crear, editar, eliminar usuarios, asignar roles, cambiar contraseñas, gestionar permisos y auditoría de accesos |
| **Gestión de Locales** | 🏪 | Administración de establecimientos comerciales | Admin + Normal | Registrar nuevos locales, editar información, generar códigos QR, gestionar tokens y controlar el estado de operación |
| **Evaluaciones** | 📝 | Sistema de revisión y análisis de evaluaciones | Admin + Normal | Ver evaluaciones por local, analizar respuestas, filtrar por turnos y fechas, analizar datos y generar reportes |
| **Estadísticas** | 📈 | Análisis avanzado y reportes del sistema | Admin + Normal | Dashboard estadístico, gráficos interactivos, insights automáticos, filtros avanzados y análisis detallado |

#### **Sistema de Permisos por Rol - Detalle Técnico**

##### **🔐 Administrador (Acceso Completo)**
- **Gestión de Usuarios:** Crear, editar, eliminar y gestionar todos los usuarios del sistema
- **Gestión de Locales:** Control total sobre establecimientos, incluyendo eliminación y modificación masiva
- **Evaluaciones:** Acceso completo a todas las evaluaciones con capacidad de modificación y eliminación
- **Estadísticas:** Acceso a todas las métricas, incluyendo datos sensibles y reportes ejecutivos
- **Configuración del Sistema:** Modificar parámetros del sistema, configuraciones de seguridad y ajustes generales
- **Auditoría:** Acceso completo a logs de seguridad, historial de cambios y reportes de actividad

##### **👤 Usuario Normal (Acceso Operativo)**
- **Gestión de Locales:** Crear, editar y gestionar establecimientos comerciales
- **Evaluaciones:** Ver y analizar todas las evaluaciones con capacidad de filtrado y análisis
- **Estadísticas:** Acceso completo a reportes y análisis estadísticos
- **Limitaciones:** No puede gestionar usuarios ni acceder a configuraciones del sistema

#### **Menú de Usuario (Header)**
- **Avatar**: Imagen de perfil del usuario
- **Nombre**: Nombre completo del usuario logueado
- **Rol**: Tipo de usuario (Administrador o Normal)
- **Menú desplegable**: Opciones de usuario

---

## 👥 **CAPÍTULO 3: GESTIÓN DE USUARIOS** *(Solo Administrador)*

### **3.1 Acceso a la Sección**
- **Ruta:** `/a/usuarios`
- **Permisos:** Solo usuarios con rol "Administrador"
- **Icono:** 👥 (Usuario)
- **Nota:** Esta sección solo es visible para usuarios administradores

### **3.2 Funcionalidades Disponibles**

#### **3.2.1 Listar Usuarios**
- **Vista:** Tabla interactiva que muestra todos los usuarios registrados en el sistema con información detallada y opciones de gestión
- **Columnas Detalladas:**
  - **ID**: Identificador único automático asignado por el sistema (no editable)
  - **Usuario**: Nombre de usuario único para acceso al sistema (campo de búsqueda principal)
  - **Nombre**: Nombre real del usuario (puede incluir nombres compuestos)
  - **Apellido**: Apellido del usuario (puede incluir apellidos compuestos)
  - **Rol**: Tipo de usuario que determina permisos (Administrador o Normal)
  - **Estado**: Indica si el usuario está activo (puede acceder) o inactivo (acceso bloqueado)
  - **Fecha Creación**: Momento exacto cuando se registró el usuario en el sistema
- **Filtros Avanzados:**
  - **Por Rol**: Dropdown que permite filtrar usuarios por tipo de acceso
  - **Por Estado**: Filtro para mostrar solo usuarios activos, inactivos o ambos
  - **Búsqueda por Nombre**: Campo de texto que busca en nombre, apellido y usuario
- **Paginación Inteligente:** 10 usuarios por página con navegación entre páginas y contador total

#### **3.2.2 Crear Nuevo Usuario**
1. **Hacer clic** en botón "Agregar Usuario" (+)
2. **Completar formulario:**
   - Usuario (único)
   - Contraseña (mínimo 8 caracteres)
   - Nombre completo
   - Apellido
   - Rol (Administrador o Normal)
3. **Hacer clic** en "Guardar"

#### **3.2.3 Editar Usuario**
1. **Hacer clic** en botón de edición (✏️)
2. **Modificar campos** necesarios
3. **Hacer clic** en "Guardar Cambios"

#### **3.2.4 Cambiar Contraseña**
1. **Abrir modal** de edición del usuario
2. **Hacer clic** en "Cambiar Contraseña"
3. **Ingresar nueva contraseña** (cumplir requisitos de complejidad)
4. **Confirmar cambio**

#### **3.2.5 Eliminar Usuario**
1. **Hacer clic** en botón de eliminación (🗑️)
2. **Confirmar acción** en diálogo de confirmación
3. **Usuario se elimina completamente** del sistema

### **3.3 Validaciones de Seguridad**
- **Contraseñas complejas**: Mayúsculas, minúsculas, números, símbolos
- **Usuarios únicos**: No se permiten duplicados
- **Roles protegidos**: Solo administradores pueden crear otros administradores
- **Gestión de Roles**: Los usuarios normales no pueden cambiar roles ni crear administradores
- **Sistema de 2 Roles**: Solo existen roles de "Administrador" y "Normal"

---

## 🏪 **CAPÍTULO 4: GESTIÓN DE LOCALES**

### **4.1 Acceso a la Sección**
- **Ruta:** `/a/locales`
- **Permisos:** Administrador y Usuario Normal
- **Icono:** 🏪 (Tienda)
- **Nota:** Esta sección es accesible para todos los usuarios del sistema

### **4.2 Funcionalidades Disponibles**

#### **4.2.1 Listar Locales**
- **Vista:** Tabla interactiva que muestra todos los establecimientos comerciales registrados en el sistema con información completa y opciones de gestión
- **Columnas Detalladas:**
  - **ID**: Identificador único automático asignado por el sistema (no editable)
  - **Nombre**: Nombre comercial del establecimiento tal como aparece en la fachada o publicidad
  - **Tipo**: Categoría del local que determina las preguntas de evaluación (Alimentos, Misceláneas, Taxis, Estacionamiento)
  - **Estado**: Indica si el local está activo (operando normalmente) o inactivo (temporalmente cerrado)
  - **Token**: Código único de 16 caracteres generado automáticamente para evaluaciones (no editable)
  - **Fecha Creación**: Momento exacto cuando se registró el local en el sistema
- **Filtros Avanzados:**
  - **Por Tipo**: Dropdown que permite filtrar por categoría específica de local
  - **Por Estado**: Filtro para mostrar solo locales activos, inactivos o ambos
  - **Búsqueda por Nombre**: Campo de texto que busca en el nombre del establecimiento
- **Paginación Inteligente:** 10 locales por página con navegación entre páginas y contador total
- **Acciones por Fila:** Cada local tiene botones para editar, eliminar, generar QR y ver URL de evaluación

#### **4.2.2 Crear Nuevo Local**
1. **Hacer clic** en botón "Agregar Local" (+)
2. **Completar formulario:**
   - **Nombre del Local**: Nombre del establecimiento
   - **Tipo de Local**: 
     - 🍽️ **Alimentos** (5 preguntas de evaluación)
     - 🛒 **Misceláneas** (4 preguntas de evaluación)
     - 🚕 **Taxis** (4 preguntas de evaluación)
     - 🅿️ **Estacionamiento** (4 preguntas de evaluación)
   - **Estado**: Activo/Inactivo
3. **Hacer clic** en "Guardar"

#### **4.2.3 Editar Local**
1. **Hacer clic** en botón de edición (✏️)
2. **Modificar campos** necesarios
3. **Hacer clic** en "Guardar Cambios"

#### **4.2.4 Eliminar Local**
1. **Hacer clic** en botón de eliminación (🗑️)
2. **Confirmar acción** en diálogo
3. **Local se marca como inactivo**

#### **4.2.5 Generar Códigos QR**
1. **Hacer clic** en botón de QR (📱) en la fila del local deseado
2. **Seleccionar tipo de generación:**
   - **QR Individual**: Genera un código QR único para el local seleccionado
     - *Incluye:* Nombre del local, tipo, token único y URL de evaluación
     - *Formato:* PDF de alta calidad listo para imprimir
     - *Uso:* Colocar en el local físico para que los clientes escaneen
   - **QR Masivo**: Genera códigos QR para múltiples locales
     - *Selección:* Elegir por tipo de local o todos los activos
     - *Formato:* PDF con múltiples páginas, un QR por página
     - *Uso:* Distribución masiva o impresión en lote
3. **Descargar PDF** con códigos QR en formato profesional
4. **Imprimir** y distribuir en los establecimientos correspondientes

#### **4.2.6 Ver URL de Evaluación**
1. **Hacer clic** en botón de ojo (👁️)
2. **Copiar URL** de evaluación del local
3. **Compartir** con clientes para evaluación

### **4.3 Tipos de Local y Preguntas**

#### **🍽️ Alimentos (5 preguntas)**
1. ¿El personal fue amable?
2. ¿El local estaba limpio?
3. ¿La atención fue rápida?
4. ¿Al finalizar su compra le entregaron ticket?
5. ¿La relación calidad-precio fue adecuada?

#### **🛒 Misceláneas (4 preguntas)**
1. ¿El personal fue amable?
2. ¿El local estaba limpio?
3. ¿La atención fue rápida?
4. ¿Al finalizar su compra le entregaron ticket?

#### **🚕 Taxis (4 preguntas)**
1. ¿El personal fue amable?
2. ¿Las instalaciones se encuentra limpias?
3. ¿La asignación de unidad fue rápida?
4. ¿Las instalaciones son adecuadas para realizar el abordaje?

#### **🅿️ Estacionamiento (4 preguntas)**
1. ¿El personal fue amable?
2. ¿Las instalaciones se encuentran limpias?
3. ¿El acceso a las instalaciones son adecuadas?
4. ¿El proceso para pago fue optimo?

---

## 📝 **CAPÍTULO 5: EVALUACIONES**

### **5.1 Acceso a la Sección**
- **Ruta:** `/a/evaluaciones`
- **Permisos:** Administrador y Usuario Normal
- **Icono:** 📝 (Documento)
- **Nota:** Esta sección es accesible para todos los usuarios del sistema

### **5.2 Funcionalidades Disponibles**

#### **5.2.1 Vista General de Evaluaciones - Dashboard Principal**
- **Resumen Consolidado por Local**: Vista principal que muestra un resumen estadístico de cada establecimiento comercial
  - *Métricas Mostradas:* 
    - Total de evaluaciones recibidas por el local
    - Calificación promedio (1-5 estrellas)
    - Fecha de la última evaluación
    - Estado del local (Activo/Inactivo)
  - *Organización de Datos:* Lista ordenable por:
    - Nombre del establecimiento (alfabético)
    - Tipo de local (Alimentos, Misceláneas, Taxis, Estacionamiento)
    - Cantidad total de evaluaciones (ascendente/descendente)
    - Calificación promedio (ascendente/descendente)
  - *Acceso Rápido:* Hacer clic en cualquier fila de local para acceder a evaluaciones detalladas

#### **5.2.2 Filtros de Búsqueda y Análisis**
- **Filtro por Tipo de Local**: 
  - *Dropdown Selector:* Permite filtrar por categoría específica
  - *Opciones Disponibles:* Alimentos, Misceláneas, Taxis, Estacionamiento
  - *Funcionalidad:* Muestra solo locales del tipo seleccionado
  - *Uso:* Útil para análisis comparativo entre categorías

- **Filtro por Turno de Operación**:
  - *Sistema Automático:* El sistema asigna turnos según la hora de evaluación
  - *Opciones de Filtrado:* Mañana, Tarde, Noche, Madrugada
  - *Horarios de Turnos:*
    - **Mañana:** 05:30:01 - 13:30:00
    - **Tarde:** 13:30:01 - 21:00:00
    - **Noche:** 00:00:00 - 05:30:00
    - **Madrugada:** 21:00:01 - 23:59:59

- **Filtro por Rango de Fechas**:
  - *Selector de Fecha Inicio:* Calendario para elegir fecha de inicio del análisis
  - *Selector de Fecha Fin:* Calendario para elegir fecha final del análisis
  - *Validación:* El sistema previene selección de fechas inválidas
  - *Aplicación:* Filtra evaluaciones realizadas en el período seleccionado

- **Filtro por Calificación Mínima**:
  - *Control Deslizante:* Permite establecer calificación mínima de 1 a 5 estrellas
  - *Funcionalidad:* Solo muestra locales que cumplan con el umbral de calidad
  - *Uso:* Identificar establecimientos que requieren atención inmediata

- **Búsqueda por Nombre de Local**:
  - *Campo de Texto:* Búsqueda en tiempo real por nombre del establecimiento
  - *Funcionalidad:* Filtra resultados mientras se escribe
  - *Uso:* Encontrar rápidamente locales específicos

#### **5.2.3 Navegación y Paginación**
- **Paginación Inteligente**: 
  - *Elementos por Página:* 10 locales por vista
  - *Navegación:* Botones de anterior, siguiente y números de página
  - *Contador Total:* Muestra el número total de locales encontrados
  - *Estado de Carga:* Indicador visual durante la búsqueda de datos

#### **5.2.4 Vista Detallada de Evaluaciones por Local**
1. **Acceso a Detalles**: Hacer clic en cualquier fila de local para expandir la vista
2. **Lista de Evaluaciones Individuales**: Muestra cada evaluación realizada por clientes
3. **Información de Cada Evaluación**:
   - **Fecha y Hora Exacta**: 
     - *Formato:* DD-MM-AAAA HH:MM AM/PM
     - *Zona Horaria:* Hora local de México
     - *Precisión:* Hasta el minuto exacto
   
   - **Turno Automático Asignado**:
     - *Identificación Visual:* Número de turno (1-4) con descripción textual
     - *Código de Colores:* Diferentes colores para cada turno
     - *Cálculo Automático:* Basado en la hora de evaluación del cliente
   
   - **Calificación General del Local**:
     - *Escala Visual:* 1 a 5 estrellas con representación gráfica
     - *Cálculo:* Promedio ponderado de todas las respuestas individuales
     - *Representación:* Estrellas llenas y vacías para fácil interpretación
   
   - **Comentarios del Cliente**:
     - *Campo Opcional:* Feedback textual proporcionado por el cliente
     - *Longitud:* Sin límite de caracteres
     - *Búsqueda:* Filtrable por palabras clave específicas
     - *Uso:* Identificar problemas o sugerencias de mejora
   
   - **Desglose por Pregunta Individual**:
     - *Pregunta Específica:* Texto exacto según el tipo de local
     - *Puntuación Individual:* Calificación de 1 a 5 estrellas por pregunta
     - *Análisis:* Identificación de fortalezas y áreas de mejora específicas

#### **5.2.5 Análisis de Datos y Tendencias**
- **Calificación por Pregunta**: 
  - *Vista Detallada:* Puntuación individual de cada pregunta de evaluación
  - *Identificación de Problemas:* Localizar áreas con calificaciones bajas
  - *Análisis Comparativo:* Comparar rendimiento entre diferentes aspectos del servicio

- **Identificación de Tendencias**:
  - *Patrones Temporales:* Análisis de calificaciones por día de la semana
  - *Evolución de Calidad:* Seguimiento de mejoras o declives en el tiempo
  - *Correlaciones:* Relación entre diferentes métricas de evaluación

- **Gestión de Comentarios**:
  - *Búsqueda Avanzada:* Filtrado por palabras clave o frases específicas
  - *Análisis de Sentimiento:* Identificar feedback positivo y negativo
  - *Acciones de Mejora:* Basadas en comentarios de los clientes

### **5.3 Funcionalidades de Visualización y Análisis**
- **Vista Consolidada por Local**: Estadísticas agregadas para análisis rápido
- **Filtrado Avanzado**: Múltiples criterios para análisis específico
- **Navegación Intuitiva**: Acceso fácil a información detallada
- **Análisis en Tiempo Real**: Datos actualizados automáticamente
- **Interfaz Responsiva**: Optimizada para diferentes tamaños de pantalla

### **5.4 Casos de Uso Principales**
- **Monitoreo Diario**: Revisar evaluaciones del día para identificar problemas inmediatos
- **Análisis de Rendimiento**: Comparar calificaciones entre diferentes tipos de local
- **Seguimiento de Mejoras**: Monitorear evolución de calificaciones en el tiempo
- **Identificación de Problemas**: Localizar establecimientos con calificaciones bajas
- **Análisis por Turno**: Evaluar calidad del servicio en diferentes horarios del día

---

## 📈 **CAPÍTULO 6: ESTADÍSTICAS**

### **6.1 Acceso a la Sección**
- **Ruta:** `/a/estadisticas`
- **Permisos:** Administrador y Usuario Normal
- **Icono:** 📈 (Gráfico)
- **Nota:** Esta sección es accesible para todos los usuarios del sistema

### **6.2 Funcionalidades Disponibles**

#### **6.2.1 Dashboard Estadístico Básico**
- **Métricas Generales del Sistema**: Vista simplificada con estadísticas básicas
  - *Total de Evaluaciones:* Contador acumulado de todas las evaluaciones realizadas
  - *Promedio General:* Calificación promedio de todo el sistema
  - *Distribución por Tipo:* Porcentaje de locales por categoría (Alimentos, Misceláneas, Taxis, Estacionamiento)
  - *Actividad Reciente:* Evaluaciones de las últimas 24 horas, 7 días y 30 días

#### **6.2.2 Gráficos Básicos**
- **Gráfico de Barras - Calificaciones por Tipo de Local**: 
  - *Funcionalidad:* Muestra barras verticales comparando el rendimiento de cada tipo de local
  - *Colores:* Código de colores único para cada categoría
  - *Escala:* Eje Y muestra calificaciones de 1 a 5 estrellas, Eje X muestra tipos de local

- **Gráfico de Líneas - Evaluaciones por Día**:
  - *Funcionalidad:* Línea temporal que muestra la cantidad de evaluaciones diarias
  - *Rangos:* Vista de períodos específicos (7 días, 30 días, 90 días)

- **Gráfico de Dona - Distribución por Categorías**:
  - *Funcionalidad:* Círculo dividido en secciones que muestra la proporción de cada tipo de local
  - *Porcentajes:* Muestra el porcentaje exacto de cada categoría
  - *Colores:* Paleta de colores diferenciada para cada tipo de local

#### **6.2.3 Filtros Disponibles**
- **Rango de Fechas**: Selector de fecha inicio y fin para análisis de períodos específicos
- **Tipo de Local**: Dropdown que permite filtrar por categoría específica
- **Calificación Mínima**: Filtro para establecer umbral de calidad

#### **6.2.4 Análisis de Datos**
- **Vista de Métricas**: Estadísticas agregadas por tipo de local
- **Comparativas**: Análisis básico entre diferentes categorías
- **Tendencias**: Identificación de patrones temporales básicos

### **6.3 Funcionalidades de Exportación**
- **Captura de Pantalla**: Los usuarios pueden tomar capturas de los gráficos y métricas
- **Datos Visuales**: Información presentada de forma clara para reportes manuales
- **Análisis en Tiempo Real**: Datos actualizados para toma de decisiones inmediatas

---

## 🔧 **CAPÍTULO 7: FUNCIONES AVANZADAS**

### **7.1 Generación de Códigos QR**

#### **7.1.1 QR Individual**
1. **Navegar** a Gestión de Locales
2. **Seleccionar** local específico
3. **Hacer clic** en botón QR (📱)
4. **Descargar** PDF con código QR único

#### **7.1.2 QR Masivo**
1. **Acceder** a modal de generación masiva
2. **Seleccionar** tipo de local
3. **Confirmar** generación
4. **Descargar** PDF con todos los códigos

### **7.2 Sistema de Tokens**
- **Generación automática**: Al crear local
- **Validación única**: Una evaluación por token
- **Seguridad**: Prevención de duplicados

### **7.3 Monitoreo en Tiempo Real**
- **Actualización automática**: Cada 30 segundos
- **Notificaciones**: Alertas de sistema
- **Logs de actividad**: Registro de acciones
- **Visualización de datos**: Métricas y gráficos en tiempo real para análisis

---

## 🚪 **CAPÍTULO 8: CERRADO DE SESIÓN**

### **8.1 Proceso de Logout**

#### **8.1.1 Método Principal**
1. **Hacer clic** en avatar de usuario (header superior)
2. **Seleccionar** "Cerrar Sesión"
3. **Confirmar** acción en diálogo
4. **Sistema redirige** a página de login

#### **8.1.2 Método Alternativo**
1. **Cerrar navegador** completamente
2. **Sesión expira** automáticamente
3. **Token se invalida** en el servidor

### **8.2 Seguridad Post-Logout**
- **Token invalidado**: Se agrega a blacklist
- **Cookies eliminadas**: Limpieza automática
- **Sesión cerrada**: Acceso bloqueado

---

## 📱 **CAPÍTULO 9: FUNCIONES MÓVILES**

### **9.1 Responsive Design**
- **Sidebar colapsable**: En dispositivos móviles
- **Menú hamburguesa**: Navegación adaptada
- **Touch-friendly**: Botones optimizados para móvil

### **9.2 Navegación Móvil**
- **Gestos táctiles**: Swipe para navegar
- **Zoom automático**: Adaptación de contenido
- **Menús desplegables**: Optimizados para pantallas pequeñas

---

## ⚠️ **CAPÍTULO 10: SOLUCIÓN DE PROBLEMAS**

### **10.1 Problemas Comunes**

#### **10.1.1 Error de Login**
- **Verificar credenciales**: Usuario y contraseña correctos
- **Revisar mayúsculas**: Contraseña sensible a mayúsculas
- **Limpiar caché**: Borrar datos del navegador
- **Contactar administrador**: Si persiste el problema

#### **10.1.2 Error de Acceso**
- **Verificar permisos**: Rol de usuario adecuado
- **Revisar sesión**: Login válido
- **Recargar página**: Actualizar navegador

#### **10.1.3 Problemas de Rendimiento**
- **Verificar conexión**: Internet estable
- **Cerrar otras pestañas**: Liberar memoria
- **Actualizar navegador**: Versión más reciente

### **10.2 Mensajes de Error**

#### **10.2.1 Errores de Autenticación**
- **"Token de acceso requerido"**: Sesión expirada
- **"Credenciales inválidas"**: Usuario/contraseña incorrectos
- **"Demasiados intentos"**: Rate limiting activado

#### **10.2.2 Errores de Permisos**
- **"Acceso denegado"**: Rol insuficiente
- **"Operación no permitida"**: Función restringida

---

## 🔒 **CAPÍTULO 11: SEGURIDAD Y BUENAS PRÁCTICAS**

### **11.1 Contraseñas Seguras**
- **Mínimo 8 caracteres**
- **Incluir mayúsculas y minúsculas**
- **Agregar números y símbolos**
- **No compartir credenciales**
- **Cambiar regularmente**

### **11.2 Gestión de Sesiones**
- **Cerrar sesión al terminar**
- **No compartir dispositivos**
- **Reportar actividad sospechosa**
- **Mantener navegador actualizado**

### **11.3 Acceso al Sistema**
- **Solo desde dispositivos seguros**
- **Evitar redes WiFi públicas**
- **Usar conexiones confiables**
- **Mantener antivirus actualizado**

---

## 🔄 **CAPÍTULO 13: FLUJO DE TRABAJO DETALLADO DEL SISTEMA**

### **Proceso de Evaluación - Flujo Completo del Cliente**

#### **Fase 1: Activación del Token**
1. **Cliente escanea código QR** → El código QR contiene un token único de 16 caracteres
   - *Ubicación del QR:* Colocado físicamente en el establecimiento comercial
   - *Formato del Token:* Código alfanumérico único (ej: "A1B2C3D4E5F6G7H8")
   - *Validación:* El sistema verifica que el token existe y está activo

2. **Sistema valida token** → Verificación completa de seguridad
   - *Verificación de Existencia:* Confirma que el token está registrado en la base de datos
   - *Verificación de Uso:* Confirma que el token no ha sido utilizado previamente
   - *Verificación de Estado:* Confirma que el local asociado está activo
   - *Verificación de Tiempo:* Confirma que el token no ha expirado

#### **Fase 2: Carga de Información**
3. **Carga información del local** → Sistema obtiene datos completos del establecimiento
   - *Información Básica:* Nombre comercial, dirección, tipo de local
   - *Configuración de Preguntas:* Lista específica según el tipo de local
   - *Diseño de Interfaz:* Adapta la interfaz según el tipo de establecimiento
   - *Validación de Acceso:* Confirma que el cliente puede proceder con la evaluación

#### **Fase 3: Proceso de Evaluación**
4. **Cliente responde preguntas** → Sistema de calificación interactivo
   - *Interfaz Adaptativa:* Preguntas específicas según el tipo de local
   - *Sistema de Calificación:* Escala de 1 a 5 estrellas con representación visual
   - *Validación de Respuestas:* Asegura que todas las preguntas sean respondidas
   - *Comentarios Opcionales:* Campo de texto para feedback adicional

#### **Fase 4: Procesamiento y Almacenamiento**
5. **Sistema guarda evaluación** → Almacenamiento seguro con metadatos
   - *Datos de Evaluación:* Respuestas individuales a cada pregunta
   - *Metadatos Automáticos:* Fecha, hora, turno automático, dispositivo
   - *Validación de Integridad:* Verifica que todos los datos sean válidos
   - *Confirmación de Guardado:* Notifica al cliente que la evaluación fue exitosa

6. **Token se marca como usado** → Sistema de seguridad anti-duplicados
   - *Invalidación Inmediata:* El token se marca como "utilizado" en tiempo real
   - *Prevención de Replay:* Imposibilita evaluaciones duplicadas
   - *Auditoría de Seguridad:* Registra el uso del token para trazabilidad
   - *Confirmación Visual:* El cliente recibe confirmación de evaluación exitosa

### **Proceso Administrativo - Flujo de Gestión del Sistema**

#### **Fase 1: Autenticación y Acceso**
1. **Administrador inicia sesión** → Sistema de autenticación robusto
   - *Validación de Credenciales:* Usuario y contraseña verificados contra la base de datos
   - *Generación de JWT:* Token de sesión seguro con tiempo de expiración
   - *Configuración de Cookies:* Cookies seguras (httpOnly, secure, sameSite)
   - *Verificación de Rol:* Sistema confirma los permisos del usuario

#### **Fase 2: Acceso al Dashboard**
2. **Accede al dashboard** → Interfaz principal con métricas en tiempo real
   - *Carga de Métricas:* Sistema obtiene datos actualizados de la base de datos
   - *Actualización Automática:* Métricas se refrescan cada 30 segundos
   - *Indicadores Visuales:* Spinners de carga y estados de actualización
   - *Notificaciones:* Alertas sobre eventos importantes del sistema

#### **Fase 3: Gestión Operativa**
3. **Gestiona locales** → Operaciones CRUD completas sobre establecimientos
   - *Creación de Locales:* Formularios con validación y generación automática de tokens
   - *Edición de Información:* Modificación de datos con historial de cambios
   - *Generación de QR:* Creación de códigos QR individuales y masivos
   - *Control de Estado:* Activación/desactivación de establecimientos

#### **Fase 4: Análisis de Datos**
4. **Analiza estadísticas** → Sistema de insights y reportes avanzados
   - *Dashboard Estadístico:* Métricas agregadas y comparativas
   - *Gráficos Interactivos:* Visualizaciones dinámicas con filtros
   - *Insights Automáticos:* Identificación automática de patrones y tendencias
   - *Reportes y Análisis:* Generación de códigos QR en PDF y análisis estadístico

#### **Fase 5: Toma de Decisiones**
5. **Toma decisiones** → Basado en datos reales y análisis del sistema
   - *Identificación de Problemas:* Locales con calificaciones bajas o tendencias negativas
   - *Análisis de Tendencias:* Patrones temporales y estacionales
   - *Comparación de Rendimiento:* Análisis entre tipos de local y establecimientos
   - *Planificación de Acciones:* Definición de estrategias de mejora basadas en datos

---

## 📞 **CAPÍTULO 12: SOPORTE Y CONTACTO**

### **12.1 Canales de Soporte**
- **Administrador del Sistema**: Contacto directo
- **Documentación**: Manuales y guías
- **Base de Conocimientos**: FAQ y soluciones

### **12.2 Información de Contacto**
- **Soporte Técnico**: Administrador del sistema
- **Emergencias**: Contacto directo del administrador
- **Horarios**: Según disponibilidad del equipo

---

## 📋 **APÉNDICE A: ATAJOS DE TECLADO**

| Función | Windows/Linux | Mac |
|---------|---------------|-----|
| **Navegación rápida** | Alt + [Número] | Cmd + [Número] |
| **Búsqueda** | Ctrl + F | Cmd + F |
| **Recargar página** | F5 | Cmd + R |
| **Cerrar pestaña** | Ctrl + W | Cmd + W |
| **Nueva pestaña** | Ctrl + T | Cmd + T |

---

## 📋 **APÉNDICE B: GLOSARIO DE TÉRMINOS**

- **Dashboard**: Panel principal con métricas del sistema
- **Local**: Establecimiento comercial evaluable
- **Token**: Código único para evaluación
- **Turno**: Período de tiempo específico del día
- **Rate Limiting**: Limitación de intentos de acceso
- **JWT**: Token de autenticación seguro
- **Blacklist**: Lista de tokens invalidados
- **Insights**: Análisis automático de datos

---

## 📋 **APÉNDICE C: CHECKLIST DE VERIFICACIÓN**

### **C.1 Acceso Diario**
- [ ] Login exitoso
- [ ] Verificar métricas del dashboard
- [ ] Revisar notificaciones del sistema
- [ ] Confirmar permisos de usuario

### **C.2 Gestión de Locales**
- [ ] Verificar estado de locales activos
- [ ] Generar códigos QR si es necesario
- [ ] Actualizar información de establecimientos
- [ ] Revisar tokens generados

### **C.3 Análisis de Datos**
- [ ] Revisar evaluaciones del día
- [ ] Analizar tendencias de satisfacción
- [ ] Identificar áreas de mejora
- [ ] Generar reportes si es necesario

### **C.4 Cierre de Sesión**
- [ ] Guardar trabajo pendiente
- [ ] Cerrar sesión correctamente
- [ ] Verificar logout exitoso
- [ ] Cerrar navegador

---

## 📝 **NOTAS IMPORTANTES**

### **⚠️ Advertencias de Seguridad**
1. **Nunca compartir** credenciales de acceso
2. **Cerrar sesión** al terminar de usar el sistema
3. **Reportar inmediatamente** cualquier actividad sospechosa
4. **Mantener actualizado** el navegador web

### **💡 Consejos de Uso**
1. **Usar filtros** para encontrar información rápidamente
2. **Exportar datos** regularmente para respaldos
3. **Revisar métricas** diariamente para monitoreo
4. **Utilizar insights** para identificar oportunidades de mejora

### **🔄 Actualizaciones del Sistema**
- El sistema se actualiza automáticamente
- Las nuevas funcionalidades se anuncian en el dashboard
- Consultar al administrador para cambios importantes

---

**🎯 Este manual cubre todas las funcionalidades del Sistema de Evaluaciones TAQ. Para consultas adicionales o soporte técnico, contactar al administrador del sistema.**

**📅 Última actualización:** Diciembre 2024  
**📚 Versión del Manual:** 2.0  
**🔧 Sistema:** Evaluaciones TAQ v1.0
