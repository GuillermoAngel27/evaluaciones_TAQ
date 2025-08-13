# 🏢 Manual de Administrador - Sistema de Evaluaciones TAQ

## 📋 **Descripción General**

El **Panel de Administración TAQ** es una interfaz web que permite controlar todo el sistema de evaluaciones de locales comerciales. Desde aquí se pueden gestionar usuarios, locales, evaluaciones y generar reportes estadísticos detallados.

### **Funcionalidades Principales**
- Visualización de métricas en tiempo real del sistema
- Gestión completa de usuarios del sistema
- Administración de locales comerciales
- Generación de códigos QR para cada establecimiento
- Revisión de evaluaciones de clientes
- Análisis estadístico para mejora continua

### **🔐 Sistema de Permisos por Rol**
El Panel de Administración TAQ implementa un sistema de permisos basado en roles:

> **📋 Nota Técnica**: Los permisos se implementan a nivel de navegación en el sidebar. Solo la sección "Gestión de Usuarios" tiene la restricción `adminOnly: true` en las rutas. Las demás secciones son accesibles para todos los usuarios autenticados, pero las operaciones específicas (como crear/editar/eliminar locales) se controlan mediante el hook `usePermissions` en cada vista. La funcionalidad de eliminar evaluaciones no está implementada en la interfaz actual.

#### **👑 Usuario Administrador**
- **Acceso completo** a todas las funcionalidades del sistema
- **Gestión total** de usuarios, locales y evaluaciones
- **Estadísticas avanzadas** y reportes detallados
- **Control completo** del sistema

#### **👤 Usuario Normal**
- **Acceso completo** a la mayoría de funcionalidades
- **Dashboard completo** con métricas del sistema
- **Visualización** de locales y evaluaciones
- **Generación de códigos QR** para locales
- **Estadísticas completas** del sistema
- **NO puede** gestionar usuarios, crear/editar/eliminar locales
- **NO puede** eliminar evaluaciones (funcionalidad no implementada)

---

## 🚀 **Acceso al Sistema**

### **Credenciales de Acceso**
- **URL**: `https://admine.taqro.com.mx`
- **Usuario**: `admin`
- **Contraseña**: `admin1234`

### **Proceso de Inicio de Sesión**
1. Abrir el navegador web
2. Navegar a la URL del sistema
3. Ingresar las credenciales
4. Hacer clic en "Iniciar Sesión"

> **📸 Captura de Pantalla**: Tomar imagen de la página de login mostrando el formulario de acceso

---

## 🏠 **Interfaz Principal - Dashboard**

### **Descripción del Dashboard**
El Dashboard es la página principal que proporciona una vista general de todas las métricas importantes del sistema de evaluaciones. Los datos se actualizan automáticamente cada 30 segundos.

> **🔐 Acceso**: Esta sección es visible para **todos los usuarios** del sistema (administradores y usuarios normales). Ambos roles pueden acceder al Dashboard y visualizar las métricas del sistema.

### **Componentes del Dashboard**

#### **Tarjetas de Métricas Principales (Header)**
- **Total Locales**: Número total de establecimientos registrados en el sistema
- **Evaluaciones Hoy**: Cantidad de evaluaciones recibidas en el día actual
- **Promedio Calificación**: Calificación promedio general del sistema (escala 1-5 estrellas)
- **Total Evaluaciones**: Número total acumulado de evaluaciones de clientes

#### **Gráfico Principal - Calificaciones por Tipo de Local**
- **Ubicación**: Columna izquierda, ocupa 8 columnas
- **Contenido**: Gráfico de barras que compara el promedio de calificaciones entre diferentes tipos de local
- **Tipos incluidos**: Alimentos, Misceláneas, Taxis, Estacionamiento
- **Escala**: Eje Y de 1 a 5 estrellas
- **Información adicional**: Muestra el promedio general y total de evaluaciones debajo del gráfico
- **Última actualización**: Timestamp de la última actualización de datos

#### **Comentarios Recientes (Columna Derecha)**
- **Ubicación**: Columna derecha, ocupa 4 columnas
- **Contenido**: Lista de los 6 comentarios más recientes de clientes
- **Información mostrada**:
  - Nombre del local evaluado
  - Calificación otorgada (con badge de color según puntuación)
  - Fecha de la evaluación
  - Comentario completo del cliente
- **Colores de calificación**: Verde (4-5 estrellas), Amarillo (3 estrellas), Rojo (1-2 estrellas)
- **Scroll**: Área con scroll vertical para navegar entre comentarios

#### **Top 5 Locales Más Evaluados**
- **Ubicación**: Fila inferior, columna izquierda (6 columnas)
- **Contenido**: Ranking de los 5 establecimientos con más evaluaciones
- **Información mostrada**:
  - Posición en el ranking (1°, 2°, 3°, etc.)
  - Nombre del local
  - Calificación promedio
  - Tipo de local con icono representativo
  - Número total de evaluaciones
- **Iconos por tipo**: Cubiertos (Alimentos), Bolsa (Misceláneas), Carro (Taxis), Estacionamiento (Parking)

#### **Últimas 6 Evaluaciones**
- **Ubicación**: Fila inferior, columna derecha (6 columnas)
- **Contenido**: Lista de las 6 evaluaciones más recientes del sistema
- **Información mostrada**:
  - Nombre del local evaluado
  - Tipo de local con icono
  - Fecha de la evaluación
  - Calificación otorgada (con badge de color)
- **Organización**: Ordenadas por fecha, de más reciente a más antigua

### **Características Técnicas del Dashboard**
- **Acceso universal**: Todos los usuarios del sistema pueden visualizar esta sección
- **Actualización automática**: Cada 30 segundos sin mostrar indicadores de carga
- **Datos en tiempo real**: Consumo de APIs del backend para información actualizada
- **Fallback de datos**: Muestra datos de ejemplo si hay errores de conexión
- **Responsive design**: Adaptado para diferentes tamaños de pantalla
- **Manejo de errores**: Botón de reintento si falla la carga de datos

> **📸 Captura de Pantalla**: Tomar imagen completa del Dashboard mostrando todas las métricas, gráficos y secciones

---

## 👥 **Gestión de Usuarios**

### **Funcionalidad**
Esta sección permite administrar todos los usuarios que tienen acceso al sistema, incluyendo su creación, edición y eliminación.

> **🔐 Acceso Restringido**: Esta sección solo es visible para usuarios con perfil de **administrador**. Los usuarios con perfil **normal** no pueden acceder a la gestión de usuarios del sistema.

### **Operaciones Disponibles**

#### **Visualización de Usuarios**
- Acceder a la sección "👥 Gestión de Usuarios" desde el menú izquierdo
- Visualizar lista completa de usuarios registrados
- Información mostrada: Usuario (username), Nombre completo, Rol, Estado, Fecha de Creación y Acciones disponibles
- **Filtros disponibles**:
  - Búsqueda por nombre, apellido o username
  - Filtro por rol (Administrador/Usuario Normal)
  - Filtro por estado (Activo/Inactivo)
- **Paginación**: Navegación por páginas para listas extensas

#### **Creación de Nuevo Usuario**
1. Hacer clic en el botón "Nuevo Usuario" (ícono +)
2. Completar los campos requeridos:
   - **Username**: Nombre de usuario único para acceder al sistema
   - **Contraseña**: Contraseña segura para el acceso (campo obligatorio)
   - **Nombre**: Nombre del usuario
   - **Apellido**: Apellido del usuario
   - **Rol**: Seleccionar entre:
     - `👤 Usuario Normal`: Acceso limitado según permisos asignados
     - `👑 Administrador`: Acceso completo a todas las funcionalidades
   - **Estado del Usuario**: Checkbox para activar/desactivar el usuario
3. Confirmar la creación haciendo clic en "Crear"

#### **Edición de Usuario Existente**
1. Localizar el usuario en la lista
2. Hacer clic en el botón "Editar" (ícono de lápiz ✏️)
3. Modificar los campos necesarios:
   - **Username**: No se puede modificar (campo de solo lectura)
   - **Contraseña**: 
     - Muestra "••••••••" si no se cambia
     - Hacer clic en ✏️ para limpiar y escribir nueva contraseña
     - Hacer clic en ℹ️ para ver información de la contraseña actual
   - **Nombre y Apellido**: Campos editables
   - **Rol**: Cambiar entre Usuario Normal y Administrador
   - **Estado**: Activar/desactivar usuario
4. Guardar cambios con "Guardar"

#### **Eliminación de Usuario**
1. Identificar el usuario a eliminar en la lista
2. Hacer clic en el botón "Eliminar" (ícono de basura 🗑️)
3. Confirmar la acción de eliminación en el diálogo de confirmación
4. **Restricciones de Seguridad**:
   - No se puede eliminar el propio usuario administrador
   - No se puede eliminar el último administrador del sistema
   - Solo usuarios con permisos de eliminación pueden realizar esta acción

### **Funcionalidades Adicionales**

#### **Gestión de Contraseñas**
- **Modo Creación**: Campo obligatorio para nueva contraseña
- **Modo Edición**: 
  - Muestra "••••••••" para contraseñas existentes
  - Botón ℹ️ para ver información de la contraseña actual
  - Botón ✏️ para limpiar y escribir nueva contraseña
  - Si no se modifica, mantiene la contraseña original

#### **Validaciones del Sistema**
- **Campos Obligatorios**: Username, Contraseña (solo en creación), Nombre, Apellido, Rol
- **Restricciones de Seguridad**:
  - No se puede eliminar el propio usuario
  - No se puede eliminar el último administrador
  - Solo usuarios con permisos específicos pueden realizar acciones

#### **Interfaz Responsiva**
- **Filtros Avanzados**: Búsqueda, filtros por rol y estado
- **Paginación Inteligente**: Navegación por páginas con contadores
- **Acciones por Usuario**: Ver detalles, Editar, Eliminar (según permisos)

> **📸 Captura de Pantalla**: Tomar imagen de la lista de usuarios mostrando las opciones de editar y eliminar, y del formulario de creación/edición

---

## 🏪 **Gestión de Locales**

### **Funcionalidad**
Esta sección permite administrar todos los locales comerciales que serán evaluados por los clientes, incluyendo su registro, modificación y generación de códigos QR.

> **🔐 Permisos por Rol**:
> - **Administradores**: Acceso completo (ver, crear, editar, eliminar locales)
> - **Usuarios Normales**: Solo pueden ver locales y generar códigos QR (no pueden crear, editar ni eliminar)

### **Operaciones Disponibles**

#### **Visualización de Locales**
- Acceder a la sección "🏪 Gestión de Locales" desde el menú izquierdo
- Visualizar lista completa de establecimientos registrados
- Información mostrada: nombre, tipo, dirección, estado y acciones disponibles

#### **Registro de Nuevo Local**
1. Hacer clic en el botón "Agregar Local"
2. Completar el formulario con:
   - **Nombre**: Nombre del establecimiento comercial
   - **Tipo**: Seleccionar categoría (Alimentos, Misceláneas, Taxis, Estacionamiento)
   - **Dirección**: Ubicación física del local
   - **Descripción**: Información adicional (campo opcional)
3. Confirmar el registro con "Guardar"

#### **Modificación de Local**
1. Localizar el local en la lista
2. Hacer clic en el botón "Editar"
3. Realizar los cambios necesarios
4. Guardar modificaciones con "Actualizar"

#### **Eliminación de Local**
1. Identificar el local a eliminar
2. Hacer clic en el botón "Eliminar"
3. Confirmar la acción de eliminación

#### **Generación de Código QR**
1. Localizar el local en la lista
2. Hacer clic en el botón "Generar QR"
3. Descargar automáticamente el PDF con el código QR
4. Imprimir y colocar el código en el establecimiento para que los clientes lo escaneen

> **📸 Captura de Pantalla**: Tomar imagen del formulario de creación de local y de la lista de locales

---

## 📊 **Gestión de Evaluaciones**

### **Funcionalidad**
Esta sección permite visualizar y analizar todas las evaluaciones que han realizado los clientes de cada local comercial, con navegación jerárquica desde locales hasta evaluaciones individuales.

> **🔐 Acceso**: Esta sección es visible para **todos los usuarios** del sistema (administradores y usuarios normales). Ambos roles pueden acceder completamente a la gestión de evaluaciones.

### **Operaciones Disponibles**

#### **Vista Principal - Locales Evaluados**
- Acceder a la sección "📊 Evaluaciones" desde el menú izquierdo
- **Vista de Resumen**: Grid de tarjetas mostrando todos los locales con evaluaciones
- **Información por Local**:
  - Nombre del establecimiento
  - Tipo de local (🍽️ Alimentos, 🛒 Misceláneas, 🚕 Taxis, 🅿️ Estacionamiento)
  - Total de evaluaciones recibidas
  - Calificación promedio (sistema de 5 estrellas)
  - Imagen representativa según el tipo de local

#### **Filtros de Búsqueda en Vista Principal**
- **🔍 Búsqueda por Nombre**: Buscar locales por nombre específico
- **🏪 Filtro por Tipo**: Seleccionar categoría de local (Todos, Alimentos, Misceláneas, Taxis, Estacionamiento)
- **📅 Filtro por Fecha Desde**: Establecer fecha inicial del rango
- **📅 Filtro por Fecha Hasta**: Establecer fecha final del rango (automáticamente ajusta el mínimo)
- **🔄 Botón Limpiar**: Resetear todos los filtros aplicados

#### **Navegación a Evaluaciones Detalladas**
1. **Hacer clic en cualquier tarjeta de local** en la vista principal
2. **Transición automática** a la vista de evaluaciones detalladas del local seleccionado
3. **Header de navegación** con:
   - Botón de retorno (←) para volver a la vista principal
   - Nombre del local seleccionado
   - Contador total de evaluaciones
   - Filtro de turnos específico para ese local

#### **Vista de Evaluaciones Detalladas por Local**
- **Filtro de Turnos**: Dropdown para filtrar evaluaciones por turno específico:
  - ☀️ Turno 1 (Mañana)
  - ⏰ Turno 2 (Tarde)
  - 🌅 Turno 3 - Madrugada (00:00 - 05:30)
  - 🌙 Turno 3 - Noche (21:00 - 24:00)
  - 🕐 TODOS LOS TURNOS

- **Grid de Evaluaciones**: Tarjetas individuales mostrando:
  - **Header con Calificación**: Estrellas visuales (1-5) con gradiente de colores
  - **Fecha y Hora**: Formato legible (ej: "15-diciembre-2024 02:30 PM")
  - **Badge de Turno**: Color-codificado según el turno
  - **Botón "VER DETALLES"**: Para acceder a información completa

#### **Modal de Detalles de Evaluación**
Al hacer clic en "VER DETALLES" se abre un modal completo con:

**Información del Header**:
- Nombre del local y tipo
- Fecha y hora exacta de la evaluación
- Badge del turno correspondiente
- Calificación visual con estrellas

**Sección de Comentarios**:
- Comentario completo del cliente (si existe)
- Indicador visual cuando no hay comentarios

**Preguntas y Respuestas por Tipo de Local**:
- **🍽️ Alimentos** (5 preguntas):
  - ¿El personal fue amable?
  - ¿El local estaba limpio?
  - ¿La atención fue rápida?
  - ¿Al finalizar su compra le entregaron ticket?
  - ¿La relación calidad-precio fue adecuada?

- **🛒 Misceláneas** (4 preguntas):
  - ¿El personal fue amable?
  - ¿El local estaba limpio?
  - ¿La atención fue rápida?
  - ¿Al finalizar su compra le entregaron ticket?

- **🚕 Taxis** (4 preguntas):
  - ¿El personal fue amable?
  - ¿Las instalaciones se encuentra limpias?
  - ¿La asignación de unidad fue rápida?
  - ¿Las instalaciones son adecuadas para realizar el abordaje?

- **🅿️ Estacionamiento** (4 preguntas):
  - ¿El personal fue amable?
  - ¿Las instalaciones se encuentran limpias?
  - ¿El acceso a las instalaciones son adecuadas?
  - ¿El proceso para pago fue optimo?

**Sistema de Puntuación**:
- Cada pregunta recibe puntuación de 1-5 puntos
- Colores según puntuación: Verde (5), Amarillo (4), Rojo (1-3)
- Estrellas visuales para cada puntuación
- Badge numérico con la puntuación exacta

#### **Cómo Usar el Sistema de Evaluaciones**

**Paso 1: Ver Locales con Evaluaciones**
- En la vista principal verás tarjetas de todos los locales que han recibido evaluaciones
- Cada tarjeta muestra el nombre del local, tipo, total de evaluaciones y calificación promedio

**Paso 2: Aplicar Filtros (Opcional)**
- Usa la barra de búsqueda para encontrar un local específico
- Selecciona el tipo de local (Alimentos, Misceláneas, Taxis, Estacionamiento)
- Establece un rango de fechas para ver evaluaciones de un período específico
- Haz clic en "Limpiar" para quitar todos los filtros

**Paso 3: Ver Evaluaciones de un Local**
- Haz clic en cualquier tarjeta de local para ver todas sus evaluaciones
- En la nueva vista verás un filtro de turnos para organizar las evaluaciones por horario
- Cada evaluación se muestra como una tarjeta con calificación, fecha y turno

**Paso 4: Ver Detalles de una Evaluación**
- Haz clic en "VER DETALLES" de cualquier evaluación
- Se abrirá una ventana con toda la información:
  - Comentario del cliente (si lo dejó)
  - Respuestas a las preguntas específicas del tipo de local
  - Puntuación de cada pregunta con estrellas visuales

**Paso 5: Navegar y Regresar**
- Usa el botón de flecha (←) para volver a la lista de locales
- Los filtros de fecha se mantienen activos al navegar entre vistas

> **📸 Captura de Pantalla**: Tomar imagen de la vista principal de locales, la vista detallada de evaluaciones, y el modal de detalles de evaluación

---

## 📈 **Análisis Estadístico**

### **Funcionalidad**
La sección de estadísticas muestra información organizada de las evaluaciones en **tres formularios diferentes**, cada uno con un propósito específico para analizar el rendimiento del sistema.

> **🔐 Acceso**: Esta sección es visible para **todos los usuarios** del sistema (administradores y usuarios normales). Ambos roles pueden acceder completamente a las estadísticas y reportes del sistema.

### **Formularios Disponibles**

#### **Formulario 1: 📋 Estadísticas por Local**
**¿Qué hace?**: Muestra una lista de todos los locales con sus calificaciones y evaluaciones.

**¿Qué información muestra?**:
- Nombre del local
- Tipo de local (Alimentos, Misceláneas, Taxis, Estacionamiento)
- Calificación promedio
- Total de evaluaciones recibidas
- Fecha de la última evaluación

**¿Para qué sirve?**: Para identificar qué locales tienen mejor o peor rendimiento, y cuáles necesitan atención inmediata.

**Funcionalidades**:
- Buscar locales por nombre
- Filtrar por tipo de local
- Ver locales con calificación baja (marcados en rojo)
- Navegar por páginas si hay muchos locales

#### **Formulario 2: ❓ Análisis por Pregunta**
**¿Qué hace?**: Muestra una gráfica de barras con el rendimiento de cada pregunta según el tipo de local.

**¿Qué información muestra?**:
- Gráfica de barras por pregunta
- Promedio de calificación (1-5 estrellas)
- Colores según rendimiento: Verde (excelente), Amarillo (regular), Rojo (necesita mejora)

**¿Para qué sirve?**: Para identificar qué preguntas específicas tienen mejor o peor rendimiento en cada tipo de local.

**Funcionalidades**:
- Seleccionar tipo de local (Alimentos, Misceláneas, Taxis, Estacionamiento)
- Ver gráfica interactiva con el rendimiento por pregunta
- Identificar fortalezas y debilidades específicas del servicio

#### **Formulario 3: 📈 Comparación por Tipo de Local**
**¿Qué hace?**: Compara el rendimiento entre diferentes tipos de locales.

**¿Qué información muestra?**:
- Tabla comparativa por categoría
- Promedio de calificación por tipo
- Total de evaluaciones por tipo
- Estado de rendimiento (Excelente, Regular, Necesita Mejora)

**¿Para qué sirve?**: Para comparar qué tipos de negocio tienen mejor servicio al cliente y aplicar mejores prácticas.

**Funcionalidades**:
- Ver rendimiento comparativo entre categorías
- Identificar tipos de local exitosos
- Planificar mejoras basadas en el rendimiento

### **Cómo Usar el Sistema de Estadísticas**

#### **Flujo de Trabajo Recomendado**

**Paso 1: Identificar Problemas**
- Usar el **Formulario 1** para encontrar locales con calificación baja
- Anotar los nombres de locales que requieren atención

**Paso 2: Analizar Causas**
- Usar el **Formulario 2** para ver qué preguntas específicas tienen bajo rendimiento
- Seleccionar el tipo de local del local problemático identificado

**Paso 3: Comparar y Mejorar**
- Usar el **Formulario 3** para ver qué tipos de local funcionan mejor
- Aplicar las mejores prácticas de las categorías exitosas

#### **Interpretación de Datos**

**Colores de Rendimiento**:
- **🟢 Verde (5⭐)**: Excelente - mantener estándares actuales
- **🟡 Amarillo (4⭐)**: Regular - oportunidades de mejora
- **🔴 Rojo (3-1⭐)**: Necesita mejora - requiere atención inmediata

**¿Qué buscar?**:
- **Locales con calificación baja** (≤3 estrellas)
- **Preguntas con bajo rendimiento** en la gráfica
- **Tipos de local problemáticos** en la comparación

> **📸 Captura de Pantalla**: Tomar imagen de la página de estadísticas mostrando los gráficos y reportes

---

## 🔐 **Cerrar Sesión**

### **Cómo Cerrar Sesión**

#### **Opción 1: Menú de Usuario**
1. **Hacer clic en el avatar o nombre de usuario** en la esquina superior derecha
2. **Seleccionar "Cerrar Sesión"** del menú desplegable
3. **Confirmar la acción** si se solicita
4. **Redirección automática** a la página de login

#### **Opción 2: Navegación Directa**
- **Cerrar la pestaña del navegador** (la sesión se mantiene activa)
- **Cerrar completamente el navegador** (la sesión se mantiene activa)
- **Navegar a otra URL** (la sesión permanece activa hasta expirar)

### **¿Qué Sucede al Cerrar Sesión?**

- **Sesión terminada**: No se puede acceder a funcionalidades del sistema
- **Redirección automática**: Te lleva de vuelta a la página de login
- **Mensaje de confirmación**: Notificación de que la sesión se cerró exitosamente

### **Recomendaciones de Seguridad**

#### **Al Finalizar el Trabajo**
- **Siempre cerrar sesión** al terminar de usar el sistema
- **No compartir credenciales** con otros usuarios
- **Cerrar sesión en dispositivos compartidos** inmediatamente después de usarlos

#### **En Caso de Olvido**
- **Sesión automática**: La sesión expira automáticamente después de un tiempo
- **Reinicio de sesión**: Puedes volver a iniciar sesión con las mismas credenciales

### **Problemas Comunes**

#### **Error al Cerrar Sesión**
- **Verificar conexión**: Asegurar que hay conexión a internet
- **Recargar página**: Si hay problemas, recargar la página e intentar nuevamente
- **Contactar administrador**: Si persisten los problemas

#### **Sesión No Cerrada**
- **Verificar redirección**: Confirmar que te llevó a la página de login
- **Limpiar navegador**: Cerrar todas las pestañas del sistema
- **Verificar logout**: Intentar acceder a una página del sistema para confirmar

> **📸 Captura de Pantalla**: Tomar imagen del menú de usuario mostrando la opción "Cerrar Sesión"

---

## 🎯 **Resumen de Funcionalidades**

### **Operaciones Principales**
1. **Acceso al Sistema**: Login seguro con credenciales de administrador
2. **Gestión de Usuarios**: Creación, edición y eliminación de cuentas
3. **Administración de Locales**: Registro y gestión de establecimientos
4. **Generación de Códigos QR**: Exportación de códigos para clientes
5. **Revisión de Evaluaciones**: Análisis de feedback de clientes
6. **Análisis Estadístico**: Reportes y métricas para toma de decisiones
7. **Cerrar Sesión**: Salida segura del sistema

### **Beneficios del Sistema**
- **Control total** sobre el proceso de evaluaciones
- **Gestión eficiente** de múltiples establecimientos
- **Análisis detallado** del servicio al cliente
- **Generación automática** de códigos QR
- **Seguridad avanzada** con tokens JWT y blacklist
- **Interfaz profesional** para administración completa

El Sistema de Evaluaciones TAQ proporciona una plataforma completa y profesional para la administración de evaluaciones de locales comerciales, facilitando la gestión y el análisis continuo del servicio al cliente.
