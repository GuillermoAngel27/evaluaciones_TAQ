const db = require('./db');

async function migrateTurnos() {
  console.log('🔄 Iniciando migración de turnos...\n');
  
  try {
    // Verificar si la tabla turnos existe
    const checkTurnosTable = `
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE() 
      AND table_name = 'turnos'
    `;
    
    const tableExists = await new Promise((resolve, reject) => {
      db.query(checkTurnosTable, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0].count > 0);
        }
      });
    });
    
    if (!tableExists) {
      console.log('❌ La tabla turnos no existe. Ejecuta primero setup-turnos.js');
      return;
    }
    
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
      console.log('❌ La columna turno no existe en evaluaciones. Ejecuta primero setup-turnos.js');
      return;
    }
    
    // Verificar el tipo de datos actual de la columna turno
    const checkColumnType = `
      SELECT DATA_TYPE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'evaluaciones' 
      AND COLUMN_NAME = 'turno'
    `;
    
    const columnInfo = await new Promise((resolve, reject) => {
      db.query(checkColumnType, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      });
    });
    
    console.log(`📋 Tipo actual de columna turno: ${columnInfo.DATA_TYPE}`);
    console.log(`📋 Valor por defecto: ${columnInfo.COLUMN_DEFAULT}`);
    
    // Si la columna ya es INT, no necesitamos migrar
    if (columnInfo.DATA_TYPE === 'int') {
      console.log('✅ La columna turno ya está en el formato correcto (INT)');
      
      // Solo actualizar evaluaciones que tengan valores de texto
      const updateTextValues = `
        UPDATE evaluaciones 
        SET turno = 1 
        WHERE turno NOT IN (1, 2, 3) 
        OR turno IS NULL
      `;
      
      await new Promise((resolve, reject) => {
        db.query(updateTextValues, (err, result) => {
          if (err) {
            reject(err);
          } else {
            console.log(`✅ Actualizadas ${result.affectedRows} evaluaciones con valores por defecto`);
            resolve();
          }
        });
      });
      
    } else {
      console.log('🔄 Migrando columna turno de VARCHAR a INT...');
      
      // Crear columna temporal
      const addTempColumn = `
        ALTER TABLE evaluaciones 
        ADD COLUMN turno_new INT(10) UNSIGNED NOT NULL DEFAULT 1 AFTER turno
      `;
      
      await new Promise((resolve, reject) => {
        db.query(addTempColumn, (err) => {
          if (err) {
            reject(err);
          } else {
            console.log('✅ Columna temporal creada');
            resolve();
          }
        });
      });
      
      // Migrar datos
      const migrateData = `
        UPDATE evaluaciones 
        SET turno_new = CASE 
          WHEN turno = 'Turno 1' OR turno = '1' THEN 1
          WHEN turno = 'Turno 2' OR turno = '2' THEN 2
          WHEN turno = 'Turno 3' OR turno = '3' THEN 3
          ELSE 1
        END
      `;
      
      await new Promise((resolve, reject) => {
        db.query(migrateData, (err, result) => {
          if (err) {
            reject(err);
          } else {
            console.log(`✅ Migrados ${result.affectedRows} registros`);
            resolve();
          }
        });
      });
      
      // Eliminar columna antigua
      const dropOldColumn = `ALTER TABLE evaluaciones DROP COLUMN turno`;
      await new Promise((resolve, reject) => {
        db.query(dropOldColumn, (err) => {
          if (err) {
            reject(err);
          } else {
            console.log('✅ Columna antigua eliminada');
            resolve();
          }
        });
      });
      
      // Renombrar columna nueva
      const renameColumn = `ALTER TABLE evaluaciones CHANGE turno_new turno INT(10) UNSIGNED NOT NULL DEFAULT 1`;
      await new Promise((resolve, reject) => {
        db.query(renameColumn, (err) => {
          if (err) {
            reject(err);
          } else {
            console.log('✅ Columna renombrada');
            resolve();
          }
        });
      });
    }
    
    // Verificar el resultado
    const verifyMigration = `
      SELECT 
        COUNT(*) as total_evaluaciones,
        SUM(CASE WHEN turno = 1 THEN 1 ELSE 0 END) as turno_1,
        SUM(CASE WHEN turno = 2 THEN 1 ELSE 0 END) as turno_2,
        SUM(CASE WHEN turno = 3 THEN 1 ELSE 0 END) as turno_3
      FROM evaluaciones
    `;
    
    const stats = await new Promise((resolve, reject) => {
      db.query(verifyMigration, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      });
    });
    
    console.log('\n📊 Estadísticas después de la migración:');
    console.log(`   Total evaluaciones: ${stats.total_evaluaciones}`);
    console.log(`   Turno 1: ${stats.turno_1}`);
    console.log(`   Turno 2: ${stats.turno_2}`);
    console.log(`   Turno 3: ${stats.turno_3}`);
    
    console.log('\n✅ Migración completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error en la migración:', error);
  } finally {
    process.exit(0);
  }
}

migrateTurnos(); 