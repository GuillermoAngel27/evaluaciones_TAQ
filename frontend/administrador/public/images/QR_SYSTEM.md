# Sistema de Códigos QR - TTAQ

## Descripción General

El sistema genera códigos QR que dirigen a los usuarios a la página de evaluación específica de cada local. Los QR se generan con una imagen de fondo personalizada y contienen solo el código QR y el nombre del local.

## Flujo de Funcionamiento

### 1. Generación del QR
- **Ubicación**: `frontend/administrador/src/utils/pdfGenerator.js`
- **URL generada**: `http://localhost:3001/?id={localId}`
- **Formato**: PDF con imagen de fondo personalizada

### 2. Aplicación de Evaluación
- **Ubicación**: `frontend/evaluacion/`
- **Puerto**: 3001
- **URL**: `http://localhost:3001/?id={localId}`
- **Función**: Obtiene el ID del local desde los parámetros de URL

### 3. Proceso de Evaluación
1. Usuario escanea el código QR
2. Se abre la aplicación de evaluación en el navegador
3. La aplicación lee el parámetro `id` de la URL
4. Carga la información del local y las preguntas correspondientes
5. Usuario completa la evaluación
6. Se envía la evaluación al backend

## Estructura de Archivos

```
frontend/
├── administrador/           # Panel de administración
│   ├── src/utils/pdfGenerator.js  # Generador de QR
│   └── public/images/
│       ├── background.png   # Imagen de fondo para QR
│       └── README.md        # Instrucciones de imagen
└── evaluacion/              # Aplicación de evaluación
    ├── src/pages/EvaluacionPage.js  # Página principal
    └── package.json         # Configuración (puerto 3001)
```

## Configuración de URLs

### Generador de QR
```javascript
const evaluationUrl = `http://localhost:3001/?id=${localId}`;
```

### Aplicación de Evaluación
```javascript
function getLocalIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}
```

## Especificaciones del QR

- **Tamaño**: 80mm x 80mm
- **Posición**: Y=100mm desde arriba
- **Colores**: 
  - QR: #5A0C62 (morado TTAQ)
  - Fondo: Blanco
- **Contenido**: Solo código QR y nombre del local
- **Formato**: PDF con imagen de fondo personalizada

## Notas Importantes

1. **Puerto**: La aplicación de evaluación debe estar corriendo en el puerto 3001
2. **Imagen de fondo**: Colocar en `frontend/administrador/public/images/background.png`
3. **URLs**: Las URLs están configuradas para desarrollo local (localhost)
4. **Parámetros**: El ID del local se pasa como parámetro `?id=` en la URL

## Comandos para Ejecutar

### Panel de Administración
```bash
cd frontend/administrador
npm start
```

### Aplicación de Evaluación
```bash
cd frontend/evaluacion
npm start
```

La aplicación de evaluación se ejecutará automáticamente en el puerto 3001 según la configuración en `package.json`. 