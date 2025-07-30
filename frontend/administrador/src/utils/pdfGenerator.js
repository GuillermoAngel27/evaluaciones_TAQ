import jsPDF from 'jspdf';
import QRCode from 'qrcode';

// Función para generar PDF con QR y nombre del local usando imagen de fondo
export const generateLocalQRPDF = async (localName, tokenPublico) => {
  try {
    // Crear un nuevo documento PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // URL para la evaluación - formato corto
    const evaluationUrl = `http://localhost:3001/${tokenPublico}`;
    
    // Generar QR code como data URL
    const qrDataUrl = await QRCode.toDataURL(evaluationUrl, {
      width: 200,
      margin: 2,
      color: {
        dark: '#5A0C62',
        light: '#FFFFFF'
      }
    });

    // Cargar imagen de fondo
    const backgroundImage = await loadBackgroundImage();
    
    // Generar PDF con imagen de fondo
    generatePDFWithBackground(pdf, qrDataUrl, localName, backgroundImage);
    
    const fileName = `QR_${localName.replace(/[^a-zA-Z0-9]/g, '_')}_${tokenPublico}.pdf`;
    return fileName;

  } catch (error) {
    console.error('Error generando PDF:', error);
    throw error;
  }
};

// Función para cargar la imagen de fondo
const loadBackgroundImage = () => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');
      resolve(dataUrl);
    };
    img.onerror = () => {
      // Si no se puede cargar la imagen, usar un fondo sólido
      console.warn('No se pudo cargar la imagen de fondo, usando fondo sólido');
      resolve(null);
    };
    // Ruta de la imagen de fondo - guarda tu imagen en public/images/background.png
    img.src = '/images/background.png';
  });
};

// Función para generar PDF con imagen de fondo
const generatePDFWithBackground = (pdf, qrDataUrl, localName, backgroundImage) => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Agregar imagen de fondo si está disponible
  if (backgroundImage) {
    pdf.addImage(backgroundImage, 'PNG', 0, 0, pageWidth, pageHeight);
  } else {
    // Fondo sólido como fallback
    pdf.setFillColor(248, 249, 250);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  }

  // QR code centrado (subido para centrarlo mejor en el cuadro)
  const qrSize = 80;
  const qrX = (pageWidth - qrSize) / 2;
  const qrY = 100; // Subido de 120 a 100 para centrarlo mejor
  pdf.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

  // Configurar fuente para el nombre del local
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(90, 12, 98);
  pdf.setFontSize(20);
  
  // Nombre del local centrado más cerca del QR
  const nameY = qrY + qrSize + 10; // 10mm debajo del QR
  pdf.text(localName, pageWidth / 2, nameY, { align: 'center' });

  // Guardar el PDF
  const fileName = `QR_${localName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  pdf.save(fileName);
};

// Función para generar QR masivo con imagen de fondo
export const generateBulkQRPDF = async (locales) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Cargar imagen de fondo
    const backgroundImage = await loadBackgroundImage();

    for (let i = 0; i < locales.length; i++) {
      const local = locales[i];
      const evaluationUrl = `http://localhost:3001/${local.token_publico}`;
      
      // Generar QR para cada local
      const qrDataUrl = await QRCode.toDataURL(evaluationUrl, {
        width: 150,
        margin: 2,
        color: {
          dark: '#5A0C62',
          light: '#FFFFFF'
        }
      });

      // Agregar nueva página para cada QR (excepto la primera)
      if (i > 0) {
        pdf.addPage();
      }

      // Agregar imagen de fondo a cada página
      if (backgroundImage) {
        pdf.addImage(backgroundImage, 'PNG', 0, 0, pageWidth, pageHeight);
      } else {
        pdf.setFillColor(248, 249, 250);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      }

      // Configurar fuente
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(90, 12, 98);

      // QR code centrado (mismo layout que individual)
      const qrSize = 80; // Mismo tamaño que individual
      const qrX = (pageWidth - qrSize) / 2;
      const qrY = 100; // Misma posición que individual
      pdf.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);
      
      // Nombre del local centrado debajo del QR (mismo layout que individual)
      const nameY = qrY + qrSize + 10; // 10mm debajo del QR (igual que individual)
      pdf.setFontSize(20); // Mismo tamaño de fuente que individual
      pdf.text(local.nombre, pageWidth / 2, nameY, { align: 'center' });
    }

    // Guardar el PDF
    const fileName = `QR_Masivo_TTAQ_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    
    return fileName;
  } catch (error) {
    console.error('Error generando PDF masivo:', error);
    throw error;
  }
}; 