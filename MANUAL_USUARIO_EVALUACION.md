# 📱 Manual de Usuario - Sistema de Evaluaciones TAQ

## 📋 **Descripción General**

El **Sistema de Evaluaciones TAQ** es una aplicación web integral diseñada para que los clientes puedan evaluar la calidad del servicio de locales comerciales. La aplicación funciona mediante códigos QR únicos que redirigen al usuario a un formulario de evaluación personalizado según el tipo de establecimiento.

### **🎯 Propósito Principal**
El sistema tiene como objetivo principal **capturar información detallada** sobre la experiencia del cliente en cada local comercial, permitiendo a los administradores y propietarios de negocios:

- **Analizar la satisfacción del cliente** en tiempo real
- **Identificar áreas de mejora** específicas por local y tipo de servicio
- **Estudiar patrones de comportamiento** y preferencias de los clientes
- **Tomar decisiones informadas** para optimizar la calidad del servicio
- **Generar reportes estadísticos** para análisis de rendimiento

### **📊 Funcionalidad de Captura de Información**
El sistema está diseñado para **recopilar datos valiosos** que incluyen:

#### **Datos de Evaluación**
- **Calificaciones numéricas** (1-5 estrellas) por pregunta específica
- **Comentarios cualitativos** de los clientes
- **Timestamp de la evaluación** para análisis temporal
- **Turno del día** en que se realizó la evaluación
- **Tipo de local** evaluado (alimentos, misceláneas, taxis, estacionamiento)

#### **Datos de Contexto**
- **Identificación única del dispositivo** para control de duplicados
- **Localización del local** evaluado
- **Categorización del establecimiento** por tipo de servicio
- **Estado de actividad** del local al momento de la evaluación

#### **Métricas de Uso**
- **Frecuencia de evaluaciones** por local
- **Patrones de respuesta** por tipo de pregunta
- **Tendencias de satisfacción** a lo largo del tiempo
- **Comparación de rendimiento** entre diferentes establecimientos

### **🔬 Utilidad para Estudio de Locales**
La información capturada se convierte en **insights valiosos** para:

#### **Análisis de Rendimiento**
- **Ranking de satisfacción** por local y tipo de servicio
- **Identificación de fortalezas** y debilidades específicas
- **Benchmarking** entre establecimientos similares
- **Análisis de tendencias** temporales y estacionales

#### **Mejora Continua**
- **Detección de problemas** recurrentes en el servicio
- **Identificación de mejores prácticas** exitosas
- **Optimización de procesos** basada en feedback real
- **Planificación de capacitación** del personal

#### **Toma de Decisiones Estratégicas**
- **Inversión en mejoras** priorizadas por impacto
- **Expansión de servicios** exitosos
- **Gestión de recursos** basada en datos reales
- **Desarrollo de políticas** de calidad del servicio

---

## 🚀 **Cómo Acceder al Sistema**

### **Formas de Acceso**
1. **Escaneando un código QR** del local comercial
2. **Ingresando directamente la URL** con el token del local
3. **Accediendo desde un enlace** compartido por el establecimiento

### **URLs de Acceso**
- **Formato 1**: `https://evaluacion.taqro.com.mx/evaluar/TOKEN_DEL_LOCAL`
- **Formato 2**: `https://evaluacion.taqro.com.mx/TOKEN_DEL_LOCAL`
- **Ejemplo**: `https://evaluacion.taqro.com.mx/evaluar/ABC123DEF456`

---

## 🏠 **Página de Bienvenida**

### **Cuándo Aparece**
- Al acceder a la URL raíz (`/`)
- Al acceder a `/evaluar` sin token
- Cuando no se especifica un token válido

### **Elementos Visuales**
- **Logo de la empresa** (centrado, tamaño 200px)
- **Título**: "Sistema de Evaluaciones"
- **Descripción**: Instrucciones para el usuario
- **Información adicional**: Mensaje sobre la importancia de la opinión

### **Mensaje Principal**
```
Escanea el código QR o ingresa el enlace proporcionado para evaluar un local.
```

---

## ⚠️ **Estados de Error y Mensajes**

### **1. Token No Especificado**

#### **Cuándo Aparece**
- URL sin token: `https://evaluacion.taqro.com.mx/`
- Token vacío o malformado

#### **Mensaje Mostrado**
```
Token no especificado
No se ha especificado el local a evaluar.
```

#### **Formato Correcto Indicado**
```
Formato correcto:
https://evaluacion.taqro.com.mx/evaluar/TOKEN_DEL_LOCAL
o
https://evaluacion.taqro.com.mx/TOKEN_DEL_LOCAL
```

### **2. Local No Encontrado (Error 404)**

#### **Cuándo Aparece**
- Token inválido o inexistente
- Local eliminado de la base de datos

#### **Elementos Visuales**
- **Header azul-verde** con logo
- **Imagen de error** (error.png)
- **Mensaje**: "¡Ups! Error 404"
- **Explicación**: "Lo sentimos, la página que buscas no existe"

#### **Estilo Visual**
- Fondo degradado: `linear-gradient(135deg,rgb(222, 230, 193) 0%,rgb(166, 234, 221) 100%)`
- Logo de 120px en el header
- Imagen de error de 320px centrada

### **3. Local Temporalmente No Disponible**

#### **Cuándo Aparece**
- Local existe pero está marcado como "inactivo"
- Local suspendido temporalmente

#### **Elementos Visuales**
- **Header naranja-amarillo** con logo
- **Icono de advertencia**: ⚠️
- **Mensaje**: "Local Temporalmente No Disponible"
- **Explicación**: "No se pueden recibir evaluaciones"

#### **Información Mostrada**
```
El local [NOMBRE_DEL_LOCAL] se encuentra temporalmente inactivo.
Por favor, intenta más tarde cuando el local esté disponible nuevamente.
```

#### **Estilo Visual**
- Fondo degradado: `linear-gradient(135deg,rgb(255, 193, 7) 0%,rgb(255, 152, 0) 100%)`
- Logo de 120px en el header
- Icono de advertencia de 64px

---

## 🔄 **Estados de Carga**

### **1. Cargando Local**

#### **Cuándo Aparece**
- Durante la verificación inicial del token
- Mientras se consulta la base de datos

#### **Elementos Visuales**
- **Icono de reloj**: ⏳
- **Título**: "Cargando local..."
- **Mensaje**: "Estamos preparando la evaluación para ti"

#### **Estilo**
- Fondo azul claro (`#f5f6fa`)
- Tarjeta centrada con sombra
- Icono de 48px

### **2. Preparando Evaluación**

#### **Cuándo Aparece**
- Después de cargar el local
- Durante la verificación de evaluación previa

#### **Elementos Visuales**
- **Título**: "Preparando evaluación..."
- **Mensaje**: "Verificando evaluación previa..."
- **Subtítulo**: "Esto solo tomará un momento"

#### **Estilo**
- Tarjeta blanca con sombra
- Texto centrado
- Colores azules y grises

---

## 📝 **Formulario de Evaluación Principal**

### **Header del Formulario**

#### **Elementos**
- **Logo de la empresa** (120px, lado izquierdo)
- **Título**: "Evaluar: [NOMBRE_DEL_LOCAL]" (centrado)
- **Fondo degradado**: `linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)`

#### **Estilo Visual**
- Header azul con esquinas redondeadas superiores
- Logo y título en color blanco
- Padding de 24px

### **Sistema de Preguntas**

#### **Tipos de Local y Preguntas**

##### **🍽️ Alimentos (5 preguntas)**
1. ¿El personal fue amable?
2. ¿El local estaba limpio?
3. ¿La atención fue rápida?
4. ¿Al finalizar su compra le entregaron ticket?
5. ¿La relación calidad-precio fue adecuada?

##### **🛒 Misceláneas (4 preguntas)**
1. ¿El personal fue amable?
2. ¿El local estaba limpio?
3. ¿La atención fue rápida?
4. ¿Al finalizar su compra le entregaron ticket?

##### **🚕 Taxis (4 preguntas)**
1. ¿El personal fue amable?
2. ¿Las instalaciones se encuentra limpias?
3. ¿La asignación de unidad fue rápida?
4. ¿Las instalaciones son adecuadas para realizar el abordaje?

##### **🅿️ Estacionamiento (4 preguntas)**
1. ¿El personal fue amable?
2. ¿Las instalaciones se encuentran limpias?
3. ¿El acceso a las instalaciones son adecuadas?
4. ¿El proceso para pago fue optimo?

#### **Sistema de Rating Visual**

##### **Emojis Utilizados**
- **😡** = 1 estrella (Muy malo)
- **😕** = 2 estrellas (Malo)
- **😐** = 3 estrellas (Regular)
- **😊** = 4 estrellas (Bueno)
- **😍** = 5 estrellas (Excelente)

##### **Funcionamiento**
- **Tamaño**: 2rem (32px)
- **Estado activo**: Sin filtros, opacidad completa
- **Estado inactivo**: Escala de grises (80%) y opacidad reducida (50%)
- **Interacción**: Click para seleccionar
- **Espaciado**: 2px entre emojis

##### **Comportamiento Visual**
- El emoji seleccionado se muestra sin filtros
- Los emojis no seleccionados aparecen en escala de grises
- Transición suave al cambiar selección

### **Campo de Comentario**

#### **Características**
- **Etiqueta**: "Comentario (opcional):"
- **Placeholder**: "¿Algo más que quieras contarnos?"
- **Filas**: 3 líneas de texto
- **Opcional**: No es obligatorio para enviar la evaluación

#### **Estilo Visual**
- **Fondo**: `#f7fafd` (gris muy claro)
- **Borde**: `1.5px solid #cfd8dc` (gris claro)
- **Radio**: 10px
- **Padding**: 10px 12px
- **Transición**: Borde cambia a azul (`#1976d2`) al enfocar

### **Botón de Envío**

#### **Estados**
- **Normal**: "Enviar"
- **Enviando**: "Enviando..." (deshabilitado)

#### **Estilo Visual**
- **Fondo**: `#1976d2` (azul)
- **Color**: Blanco
- **Radio**: 10px
- **Padding**: 16px 0
- **Sombra**: `0 2px 8px 0 rgba(25, 118, 210, 0.08)`

#### **Estados de Hover**
- **Fondo**: `#125ea7` (azul más oscuro)
- **Sombra**: `0 4px 16px 0 rgba(25, 118, 210, 0.13)`

---

## ✅ **Validaciones del Formulario**

### **Validaciones de Respuestas**

#### **1. Respuestas Incompletas**
```
Por favor responde todas las preguntas antes de enviar.
```

#### **2. Valores Inválidos**
```
Las respuestas deben ser enteros del 1 al 5.
```

### **Validaciones del Sistema**

#### **1. Evaluación Previa**
- El sistema verifica si el dispositivo ya evaluó este local
- Previene evaluaciones duplicadas por dispositivo
- Usa `deviceId` almacenado en localStorage

#### **2. Token Válido**
- Verifica que el token exista en la base de datos
- Confirma que el local esté activo
- Valida que el token no haya sido usado

---

## 🎯 **Proceso de Envío**

### **Flujo de Envío**

#### **1. Validación Local**
- Verifica que todas las preguntas tengan respuesta
- Valida que las respuestas sean números del 1 al 5
- Confirma que el comentario sea opcional

#### **2. Generación de Token**
- Si no existe token, genera uno nuevo
- Almacena información en localStorage
- Asocia token con local_id y device_id

#### **3. Envío de Evaluación**
- POST a `/api/evaluaciones/`
- Incluye respuestas, preguntas, comentario y turno
- Marca token como usado

#### **4. Confirmación**
- Muestra página de agradecimiento
- Previene evaluaciones adicionales

### **Datos Enviados**
```json
{
  "token": "TOKEN_GENERADO",
  "device_id": "DEVICE_ID_UNICO",
  "respuestas": [4, 5, 4, 3, 5],
  "preguntas": ["¿El personal fue amable?", "..."],
  "comentario": "Comentario opcional del usuario",
  "turno": "Turno 1"
}
```

---

## 🎉 **Página de Agradecimiento**

### **Cuándo Aparece**
- Después de enviar exitosamente la evaluación
- Cuando el usuario ya evaluó previamente el local

### **Elementos Visuales**

#### **Header**
- **Fondo azul** (`#1976d2`)
- **Logo** (120px, lado izquierdo)
- **Título**: "¡Evaluación enviada!" (centrado)

#### **Contenido Principal**
- **Título**: "[NOMBRE_DEL_LOCAL] evaluado!"
- **Imagen**: gracias.png (220px, centrada)
- **Mensaje**: "¡Gracias por tu evaluación!"
- **Subtítulo**: "Tu opinión es muy importante para nosotros."

### **Estilo Responsivo**
- **Mobile** (≤600px): Logo 120px, título 18px
- **Tablet** (601-900px): Logo 180px, título 22px
- **Desktop** (>900px): Logo 220px, título 26px

---

## 🔧 **Funcionalidades Técnicas**

### **Almacenamiento Local**

#### **Device ID**
- Generado automáticamente al primer acceso
- Formato: `device_XXXXXXXXX_TIMESTAMP`
- Almacenado en localStorage
- Único por dispositivo

#### **Tokens**
- Almacenados por local_id
- Incluyen información de uso
- Previenen evaluaciones duplicadas

### **Detección de Turnos**

#### **API de Turno**
- Endpoint: `/api/evaluaciones/turno-actual`
- Fallback: "Turno 1" si hay error
- Se incluye en cada evaluación

#### **Turnos Disponibles**
1. **Turno 1**: 05:30:01 - 13:30:00 (Mañana)
2. **Turno 2**: 13:30:01 - 21:00:00 (Tarde)
3. **Turno 3**: 00:00:00 - 05:30:00 (Noche)
4. **Turno 4**: 21:00:01 - 23:59:59 (Madrugada)

---

## 📱 **Responsive Design**

### **Breakpoints**

#### **Mobile (≤600px)**
- Logo: 180px
- Título: 18px
- Botones: 14px, padding 10px
- Formulario optimizado para pantallas pequeñas

#### **Tablet (601-900px)**
- Logo: 240px
- Título: 22px
- Botones: 16px, padding 12px
- Layout intermedio

#### **Desktop (>900px)**
- Logo: 320px
- Título: 26px
- Botones: 18px, padding 14px
- Layout completo

### **Adaptaciones Móviles**
- **Touch-friendly**: Botones y controles adaptados al tacto
- **Scroll vertical**: Navegación optimizada para móviles
- **Espaciado**: Márgenes y padding adaptados a pantallas pequeñas

---

## 🚨 **Manejo de Errores**

### **Errores de Red**

#### **1. Error de Conexión**
- Fallback a preguntas básicas predefinidas
- Mensaje: "Error al cargar información del local"
- Funcionalidad básica mantenida

#### **2. Error de API**
- Fallback a preguntas estáticas según tipo de local
- Validación local de respuestas
- Mensajes de error específicos

### **Errores de Validación**

#### **1. Formulario Incompleto**
- Mensaje claro sobre qué falta
- Botón deshabilitado hasta completar
- Indicadores visuales de campos requeridos

#### **2. Datos Inválidos**
- Validación en tiempo real
- Mensajes de error específicos
- Prevención de envío con datos incorrectos

---

## 🔒 **Seguridad y Privacidad**

### **Prevención de Duplicados**
- **Device ID único** por dispositivo
- **Tokens únicos** por local
- **Verificación previa** antes de permitir evaluación

### **Validación de Datos**
- **Sanitización** de entradas
- **Validación de tipos** de respuesta
- **Verificación de rangos** (1-5 estrellas)

### **Control de Acceso**
- **Tokens públicos** para acceso
- **Verificación de estado** del local
- **Control de turnos** automático

---

## 🎯 **Valor de la Información Capturada**

### **💡 Insights para Propietarios de Negocios**
La información recopilada por el sistema proporciona **perspectivas valiosas** que permiten:

#### **📊 Análisis de Rendimiento del Negocio**
- **Métricas de satisfacción** del cliente en tiempo real
- **Comparación con estándares** de la industria
- **Identificación de fortalezas** competitivas
- **Detección de oportunidades** de mejora

#### **👥 Gestión del Personal**
- **Evaluación del desempeño** por turnos de trabajo
- **Identificación de necesidades** de capacitación
- **Optimización de horarios** basada en feedback del cliente
- **Reconocimiento de empleados** destacados

#### **🏗️ Optimización de Operaciones**
- **Análisis de procesos** que impactan la satisfacción
- **Identificación de cuellos de botella** en el servicio
- **Planificación de mejoras** priorizadas por impacto
- **Gestión de recursos** basada en datos reales

### **🔬 Aplicaciones para Investigación y Estudio**

#### **📈 Análisis de Mercado**
- **Tendencias de satisfacción** por tipo de establecimiento
- **Comparación de servicios** entre competidores
- **Análisis de preferencias** del consumidor
- **Identificación de nichos** de mercado

#### **🎓 Estudios Académicos**
- **Investigación en calidad** de servicios
- **Análisis de comportamiento** del consumidor
- **Estudios de satisfacción** del cliente
- **Tesis y proyectos** de investigación

#### **🏢 Consultoría Empresarial**
- **Auditorías de calidad** de servicio
- **Benchmarking** entre empresas
- **Análisis de competitividad** del mercado
- **Recomendaciones estratégicas** basadas en datos

### **📋 Casos de Uso Específicos**

#### **🍽️ Restaurantes y Cafeterías**
- **Análisis de calidad** de alimentos y servicio
- **Evaluación de limpieza** y ambiente
- **Satisfacción con relación** calidad-precio
- **Eficiencia en tiempos** de atención

#### **🛒 Tiendas de Conveniencia**
- **Calidad del servicio** al cliente
- **Eficiencia en transacciones** de compra
- **Disponibilidad de productos** y surtido
- **Ambiente de compra** y organización

#### **🚕 Servicios de Transporte**
- **Calidad del vehículo** y limpieza
- **Eficiencia en asignación** de unidades
- **Adecuación de instalaciones** para el servicio
- **Satisfacción general** con el transporte

#### **🅿️ Estacionamientos**
- **Calidad de las instalaciones** y mantenimiento
- **Eficiencia en el proceso** de pago
- **Adecuación del acceso** y salida
- **Seguridad y comodidad** del servicio

---

## 📊 **Estadísticas y Métricas**

### **Datos Recopilados**
- **Calificaciones** por pregunta (1-5 estrellas)
- **Comentarios** opcionales de usuarios
- **Turno** de la evaluación
- **Timestamp** de envío
- **Device ID** para control de duplicados

### **Uso de Datos para Análisis**
La información capturada se transforma en **métricas valiosas** que permiten:

#### **📈 Análisis de Tendencias**
- **Evolución de la satisfacción** del cliente a lo largo del tiempo
- **Patrones estacionales** y por turnos de trabajo
- **Comparación de rendimiento** entre períodos diferentes
- **Identificación de picos** y valles en la calidad del servicio

#### **🏪 Análisis por Local**
- **Ranking de satisfacción** individual de cada establecimiento
- **Análisis comparativo** entre locales del mismo tipo
- **Identificación de líderes** y establecimientos con oportunidades de mejora
- **Benchmarking** interno para establecer estándares de calidad

#### **🔍 Análisis por Pregunta**
- **Fortalezas específicas** de cada local (preguntas con mejor calificación)
- **Áreas de mejora** identificadas por pregunta
- **Correlación** entre diferentes aspectos del servicio
- **Priorización de acciones** basada en calificaciones más bajas

#### **⏰ Análisis por Turno**
- **Calidad del servicio** en diferentes horarios del día
- **Identificación de turnos** con mejor y peor rendimiento
- **Optimización de personal** por horarios de mayor demanda
- **Planificación de capacitación** específica por turno

### **Reportes y Dashboards**
Los datos recopilados se presentan en **formatos analíticos** que incluyen:

#### **📊 Métricas en Tiempo Real**
- **Dashboard actualizado** cada 30 segundos
- **Contadores de evaluaciones** del día actual
- **Promedios de satisfacción** en tiempo real
- **Alertas automáticas** para calificaciones bajas

#### **📋 Reportes Exportables**
- **Análisis estadístico** con gráficos y métricas
- **Análisis de datos** para insights internos
- **Reportes personalizables** por período y local
- **Capturas de pantalla** automáticas para presentaciones

#### **📱 Acceso Multiplataforma**
- **Panel administrativo** completo en navegador web
- **Responsive design** para dispositivos móviles y tablets
- **Acceso remoto** desde cualquier ubicación
- **Sincronización automática** de datos en tiempo real

---

## 🆘 **Solución de Problemas**

### **Problemas Comunes**

#### **1. "Token no especificado"**
- **Causa**: URL sin token o malformada
- **Solución**: Verificar que la URL incluya el token correcto
- **Formato**: `/evaluar/TOKEN` o `/TOKEN`

#### **2. "Local no encontrado"**
- **Causa**: Token inválido o local eliminado
- **Solución**: Verificar el token con el establecimiento
- **Alternativa**: Contactar al administrador del sistema

#### **3. "Local temporalmente no disponible"**
- **Causa**: Local marcado como inactivo
- **Solución**: Intentar más tarde
- **Alternativa**: Contactar al establecimiento

#### **4. "Ya evaluaste este local"**
- **Causa**: Evaluación previa desde el mismo dispositivo
- **Solución**: No es posible evaluar dos veces el mismo local
- **Alternativa**: Usar otro dispositivo si es necesario

### **Contacto de Soporte**
- **Administrador del sistema**: Para problemas técnicos
- **Establecimiento**: Para problemas con el local específico
- **Documentación**: Este manual para guía de uso

---

## 📝 **Resumen de Funcionalidades**

### **✅ Lo que SÍ puede hacer el usuario**
- Acceder mediante código QR o URL
- Ver información del local a evaluar
- Responder preguntas con sistema de emojis
- Agregar comentarios opcionales
- Enviar evaluación una vez por local
- Ver confirmación de envío exitoso

### **❌ Lo que NO puede hacer el usuario**
- Evaluar el mismo local dos veces
- Acceder a locales inactivos
- Usar tokens inválidos
- Enviar evaluaciones incompletas
- Modificar evaluaciones enviadas
- Acceder a estadísticas del sistema

### **🎯 Propósito del Sistema para el Estudio de Locales**
El sistema está diseñado para **capturar información valiosa** que permite:

#### **📊 Análisis de Datos**
- **Recopilación sistemática** de feedback del cliente
- **Métricas cuantificables** de satisfacción por aspecto del servicio
- **Análisis temporal** de tendencias y patrones
- **Comparación objetiva** entre diferentes establecimientos

#### **🔍 Insights de Calidad**
- **Identificación de fortalezas** y debilidades específicas
- **Análisis de correlación** entre diferentes aspectos del servicio
- **Detección de problemas** recurrentes y oportunidades de mejora
- **Benchmarking** interno y externo

#### **📈 Toma de Decisiones Basada en Datos**
- **Priorización de mejoras** por impacto en la satisfacción
- **Asignación de recursos** basada en necesidades identificadas
- **Planificación estratégica** para el desarrollo del negocio
- **Evaluación de ROI** de las mejoras implementadas

---

## 🔄 **Flujo Completo del Usuario**

```
1. Usuario escanea QR o accede a URL
   ↓
2. Sistema valida token y carga local
   ↓
3. Si local no existe → Error 404
   ↓
4. Si local inactivo → Mensaje de no disponible
   ↓
5. Si local activo → Carga preguntas según tipo
   ↓
6. Usuario responde preguntas (emojis 1-5)
   ↓
7. Usuario agrega comentario (opcional)
   ↓
8. Usuario envía evaluación
   ↓
9. Sistema valida y guarda datos
   ↓
10. Sistema marca token como usado
    ↓
11. Muestra página de agradecimiento
    ↓
12. Previene evaluaciones adicionales
```

---

## 📱 **Compatibilidad**

### **Navegadores Soportados**
- **Chrome**: Versión 90+
- **Firefox**: Versión 88+
- **Safari**: Versión 14+
- **Edge**: Versión 90+

### **Dispositivos Soportados**
- **Smartphones**: iOS 12+, Android 8+
- **Tablets**: iPadOS 12+, Android 8+
- **Computadoras**: Windows 10+, macOS 10.14+, Linux

### **Requisitos Técnicos**
- **JavaScript**: Habilitado
- **Cookies**: Habilitadas
- **LocalStorage**: Disponible
- **Conexión**: Internet estable

---

**Última actualización**: Diciembre 2024  
**Versión del manual**: 1.0  
**Sistema**: TAQ Evaluaciones v3.0
