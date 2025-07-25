// Configuración de preguntas por tipo de local
const PREGUNTAS_POR_TIPO = {
  'miscelaneas': [
    '¿El personal fue amable?',
    '¿El local estaba limpio?',
    '¿La atención fue rápida?',
    '¿Al finalizar su compra le entregaron ticket?'
  ],
  
  'alimentos': [
    '¿El personal fue amable?',
    '¿El local estaba limpio?',
    '¿La atención fue rápida?',
    '¿Al finalizar su compra le entregaron ticket?',
    '¿La relación calidad-precio fue adecuada?'
  ],
  
  'taxis': [
    '¿El personal fue amable?',
    '¿Las instalaciones se encuentra limpias?',
    '¿La asignación de unidad fue rápida?',
    '¿Las instalaciones son adecuadas para realizar el abordaje?'
  ],
  
  'estacionamiento': [
    '¿El personal fue amable?',
    '¿Las instalaciones se encuentran limpias?',
    '¿El acceso a las instalaciones son adecuadas?',
    '¿El proceso para pago fue optimo?'
  ]
};

// Mejorar la normalización para aceptar todas las variantes de 'miscelanea', 'misceláneas', etc.
const normalizarTipoLocal = (tipoLocal) => {
  if (!tipoLocal) return '';
  let tipo = tipoLocal.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
  if (tipo.includes('miscelanea')) return 'miscelaneas';
  if (tipo.includes('alimento')) return 'alimentos';
  if (tipo.includes('taxi')) return 'taxis';
  if (tipo.includes('estacionamiento') || tipo.includes('parking')) return 'estacionamiento';
  return tipo;
};

// Función para obtener preguntas por tipo de local
const obtenerPreguntas = (tipoLocal) => {
  const tipoNormalizado = normalizarTipoLocal(tipoLocal);
  
  // Buscar en el objeto de preguntas
  const preguntas = PREGUNTAS_POR_TIPO[tipoNormalizado];
  
  if (preguntas) {
    return preguntas.map((pregunta, index) => ({
      pregunta_numero: index + 1,
      pregunta_texto: pregunta
    }));
  }
  
  // Fallback: preguntas básicas
  return [
    { pregunta_numero: 1, pregunta_texto: '¿El personal fue amable?' },
    { pregunta_numero: 2, pregunta_texto: '¿El local estaba limpio?' },
    { pregunta_numero: 3, pregunta_texto: '¿La atención fue rápida?' },
    { pregunta_numero: 4, pregunta_texto: '¿Al finalizar su compra le entregaron ticket?' }
  ];
};

// Función para obtener preguntas específicas por tipo y número
const obtenerPreguntaEspecifica = (tipoLocal, numeroPregunta) => {
  const preguntas = obtenerPreguntas(tipoLocal);
  return preguntas.find(p => p.pregunta_numero === numeroPregunta);
};

// Función para obtener todas las preguntas únicas (para estadísticas generales)
const obtenerTodasLasPreguntas = () => {
  const todasLasPreguntas = new Set();
  
  Object.values(PREGUNTAS_POR_TIPO).forEach(preguntas => {
    preguntas.forEach(pregunta => {
      todasLasPreguntas.add(pregunta);
    });
  });
  
  return Array.from(todasLasPreguntas);
};

// Función para obtener todos los tipos disponibles
const obtenerTiposDisponibles = () => {
  return Object.keys(PREGUNTAS_POR_TIPO).map(tipo => ({
    tipo_local: tipo,
    cantidad_preguntas: PREGUNTAS_POR_TIPO[tipo].length
  }));
};

module.exports = {
  obtenerPreguntas,
  obtenerPreguntaEspecifica,
  obtenerTodasLasPreguntas,
  obtenerTiposDisponibles,
  PREGUNTAS_POR_TIPO,
  normalizarTipoLocal
}; 