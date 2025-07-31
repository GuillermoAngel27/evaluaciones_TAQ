const db = require('./db');

async function setupTurnos() {
  console.log('Configurando tabla de turnos...');
  
  try {
    // Crear tabla de turnos
    const createTurnosTable = `
      CREATE TABLE IF NOT EXISTS turnos (
        turno INT(10) UNSIGNED NOT NULL,
        hra_ini VARCHAR(8) NOT NULL,
        hra_fin VARCHAR(8) NOT NULL,
        PRIMARY KEY (turno, hra_ini)
      )
    `;
    
    await new Promise((resolve, reject) => {
      db.query(createTurnosTable, (err) => {
        if (err) {
          console.error('Error creando tabla turnos:', err);
          reject(err);
        } else {
          console.log('✅ Tabla turnos creada/verificada');
          resolve();
        }
      });
    });
    
    // Limpiar datos existentes de turnos
    await new Promise((resolve, reject) => {
      db.query('DELETE FROM turnos', (err) => {
        if (err) {
          console.error('Error limpiando turnos:', err);
          reject(err);
        } else {
          console.log('✅ Datos de turnos limpiados');
          resolve();
        }
      });
    });
    
    // Insertar los turnos según los rangos especificados
    const insertTurnos = `
      INSERT INTO turnos (turno, hra_ini, hra_fin) VALUES
      (1, '05:30:01', '13:30:00'),
      (2, '13:30:01', '21:00:00'),
      (3, '00:00:00', '05:30:00'),
      (4, '21:00:01', '23:59:59')
    `;
    
    await new Promise((resolve, reject) => {
      db.query(insertTurnos, (err) => {
        if (err) {
          console.error('Error insertando turnos:', err);
          reject(err);
        } else {
          console.log('✅ Turnos insertados correctamente');
          resolve();
        }
      });
    });
    
    // Verificar si la columna turno existe en evaluaciones
    const checkColumn = `
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'evaluaciones' 
      AND COLUMN_NAME = 'turno'
    `;
    
    const columnExists = await new Promise((resolve, reject) => {
      db.query(checkColumn, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results.length > 0);
        }
      });
    });
    
    if (!columnExists) {
      // Agregar columna turno a la tabla evaluaciones
      const addTurnoColumn = `
        ALTER TABLE evaluaciones 
        ADD COLUMN turno INT(10) UNSIGNED NOT NULL DEFAULT 1 AFTER fecha
      `;
      
      await new Promise((resolve, reject) => {
        db.query(addTurnoColumn, (err) => {
          if (err) {
            console.error('Error agregando columna turno:', err);
            reject(err);
          } else {
            console.log('✅ Columna turno agregada a evaluaciones');
            resolve();
          }
        });
      });
    } else {
      console.log('✅ Columna turno ya existe en evaluaciones');
    }
    
    // Verificar la configuración
    console.log('\n📋 Verificando configuración de turnos:');
    const turnos = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM turnos ORDER BY hra_ini', (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
    
    console.log('Turnos configurados:');
    turnos.forEach(turno => {
      const turnoTexto = turno.turno === 1 ? 'Turno 1 (Mañana)' :
                        turno.turno === 2 ? 'Turno 2 (Tarde)' :
                        turno.turno === 3 ? 'Turno 3 - Madrugada (00:00 - 05:30)' :
                        turno.turno === 4 ? 'Turno 3 - Noche (21:00 - 24:00)' :
                        `Turno ${turno.turno}`;
      console.log(`  - ${turnoTexto}: ${turno.hra_ini} - ${turno.hra_fin}`);
    });
    
    console.log('\n✅ Configuración de turnos completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error en la configuración:', error);
  } finally {
    process.exit(0);
  }
}

setupTurnos(); 