import jsPDF from 'jspdf';
import QRCode from 'qrcode';

// Función para generar PDF con QR y nombre del local usando imagen de fondo
export const generateLocalQRPDF = async (localName, localId) => {
  try {
    // Crear un nuevo documento PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // URL para la evaluación - apunta a la aplicación de evaluación en puerto 3001
    const evaluationUrl = `http://localhost:3001/?id=${localId}`;
    
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
    
    const fileName = `QR_${localName.replace(/[^a-zA-Z0-9]/g, '_')}_${localId}.pdf`;
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
    
    let currentY = 20;
    let pageNumber = 1;

    for (let i = 0; i < locales.length; i++) {
      const local = locales[i];
      const evaluationUrl = `http://localhost:3001/?id=${local.id}`;
      
      // Generar QR para cada local
      const qrDataUrl = await QRCode.toDataURL(evaluationUrl, {
        width: 150,
        margin: 2,
        color: {
          dark: '#5A0C62',
          light: '#FFFFFF'
        }
      });

      // Verificar si necesitamos nueva página
      if (currentY > pageHeight - 80) {
        pdf.addPage();
        currentY = 20;
        pageNumber++;
        
        // Agregar imagen de fondo a la nueva página
        if (backgroundImage) {
          pdf.addImage(backgroundImage, 'PNG', 0, 0, pageWidth, pageHeight);
        } else {
          pdf.setFillColor(248, 249, 250);
          pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        }
      }

      // Agregar imagen de fondo a la primera página
      if (pageNumber === 1 && i === 0) {
        if (backgroundImage) {
          pdf.addImage(backgroundImage, 'PNG', 0, 0, pageWidth, pageHeight);
        } else {
          pdf.setFillColor(248, 249, 250);
          pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        }
      }

      // Configurar fuente
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(90, 12, 98);

      // QR code (reducido de 60 a 50)
      const qrSize = 50;
      const qrX = (pageWidth - qrSize) / 2;
      const qrY = currentY;
      pdf.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);
      currentY += qrSize + 5; // Reducida separación de 10 a 5

      // Nombre del local debajo del QR
      pdf.setFontSize(16); // Reducido de 18 a 16
      pdf.text(local.nombre, pageWidth / 2, currentY, { align: 'center' });
      currentY += 15; // Reducida separación de 20 a 15
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