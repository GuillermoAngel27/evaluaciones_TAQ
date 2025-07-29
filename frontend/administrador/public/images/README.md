# Imágenes de Fondo para Códigos QR

## Ubicación de la imagen de fondo

Para usar una imagen como fondo en los códigos QR generados, coloca tu imagen en esta carpeta con el nombre `background.png`.

### Estructura de archivos:
```
frontend/administrador/public/images/
├── background.png    <- Tu imagen de fondo aquí
└── README.md         <- Este archivo
```

### Especificaciones recomendadas para la imagen:

- **Formato**: PNG (recomendado) o JPG
- **Resolución**: 2480 x 3508 píxeles (A4 a 300 DPI)
- **Orientación**: Vertical (portrait)
- **Tamaño de archivo**: Menos de 2MB para mejor rendimiento

### Características de la imagen:

1. **Área del QR**: Deja espacio en el centro (aproximadamente 100mm desde arriba) para el código QR
2. **Área de texto**: Deja espacio debajo del QR (aproximadamente 190mm desde arriba) para el nombre del local
3. **Contraste**: Asegúrate de que el texto y QR sean legibles sobre tu imagen de fondo

### Ejemplo de layout:
```
┌─────────────────────┐
│ [Tu imagen de fondo] │
│                     │
│   [Código QR]       │  ← Centrado en Y=100mm
│                     │
│   Nombre del Local  │  ← Centrado debajo del QR (10mm separación)
│                     │
│                     │
└─────────────────────┘
```

### Tipos de PDF generados:

#### 1. QR Individual
- **Tamaño del QR**: 80mm x 80mm
- **Posición del QR**: Y=100mm desde arriba
- **Posición del nombre**: Y=190mm desde arriba
- **Tamaño de fuente**: 20pt

#### 2. QR Masivo (múltiples locales)
- **Formato**: Un QR por página con fondo completo
- **Tamaño del QR**: 80mm x 80mm (igual que individual)
- **Posición del QR**: Y=100mm desde arriba (igual que individual)
- **Posición del nombre**: Y=190mm desde arriba (igual que individual)
- **Tamaño de fuente**: 20pt (igual que individual)
- **Fondo**: Imagen de fondo completa en cada página
- **Resultado**: PDF con una página por cada local

### Notas importantes:

- Si no se encuentra la imagen `background.png`, el sistema usará un fondo sólido gris claro como respaldo
- La imagen se redimensionará automáticamente para ajustarse al tamaño A4
- Para mejores resultados, usa imágenes con colores que contrasten bien con el texto negro del QR
- El QR individual tiene un tamaño de 80mm x 80mm
- El nombre del local se muestra en fuente de 20pt
- En el PDF masivo, los QR son más pequeños (60mm) para optimizar el espacio 