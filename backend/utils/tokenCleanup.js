const cron = require('node-cron');
const { cleanupExpiredTokens, getBlacklistStats } = require('./tokenBlacklist');

// Configuración de limpieza automática
const setupTokenCleanup = () => {
  console.log('🕐 Configurando limpieza automática de tokens...');

  // Limpieza cada hora
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('🧹 Iniciando limpieza horaria de tokens...');
      const deletedCount = await cleanupExpiredTokens();
      
      if (deletedCount > 0) {
        console.log(`✅ Limpieza horaria completada: ${deletedCount} tokens eliminados`);
      }
    } catch (error) {
      console.error('❌ Error en limpieza horaria:', error);
    }
  });

  // Limpieza diaria a las 2 AM (más agresiva)
  cron.schedule('0 2 * * *', async () => {
    try {
      console.log('🌙 Iniciando limpieza diaria de tokens...');
      
      // Obtener estadísticas antes de la limpieza
      const statsBefore = await getBlacklistStats();
      
      // Limpieza más agresiva - eliminar tokens con más de 7 días
      const deletedCount = await cleanupExpiredTokens();
      
      // Obtener estadísticas después de la limpieza
      const statsAfter = await getBlacklistStats();
      
      console.log(`✅ Limpieza diaria completada:`);
      console.log(`   - Tokens eliminados: ${deletedCount}`);
      console.log(`   - Tokens activos restantes: ${statsAfter.active_tokens}`);
      console.log(`   - Tokens totales en blacklist: ${statsAfter.total_tokens}`);
      
    } catch (error) {
      console.error('❌ Error en limpieza diaria:', error);
    }
  });

  // Limpieza semanal los domingos a las 3 AM (muy agresiva)
  cron.schedule('0 3 * * 0', async () => {
    try {
      console.log('📅 Iniciando limpieza semanal de tokens...');
      
      // Eliminar tokens con más de 30 días
      const sql = 'DELETE FROM token_blacklist WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)';
      
      db.query(sql, (err, result) => {
        if (err) {
          console.error('❌ Error en limpieza semanal:', err);
        } else {
          console.log(`✅ Limpieza semanal completada: ${result.affectedRows} tokens antiguos eliminados`);
        }
      });
      
    } catch (error) {
      console.error('❌ Error en limpieza semanal:', error);
    }
  });

  // Reporte de estadísticas cada 6 horas
  cron.schedule('0 */6 * * *', async () => {
    try {
      const stats = await getBlacklistStats();
      
      console.log('📊 Estadísticas de blacklist de tokens:');
      console.log(`   - Total: ${stats.total_tokens}`);
      console.log(`   - Activos: ${stats.active_tokens}`);
      console.log(`   - Expirados: ${stats.expired_tokens}`);
      console.log(`   - Por logout: ${stats.logout_tokens}`);
      console.log(`   - Por seguridad: ${stats.security_tokens}`);
      
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
    }
  });

  console.log('✅ Limpieza automática configurada correctamente');
};

// Función para limpieza manual (útil para testing)
const manualCleanup = async () => {
  try {
    console.log('🔧 Iniciando limpieza manual...');
    const deletedCount = await cleanupExpiredTokens();
    console.log(`✅ Limpieza manual completada: ${deletedCount} tokens eliminados`);
    return deletedCount;
  } catch (error) {
    console.error('❌ Error en limpieza manual:', error);
    throw error;
  }
};

// Función para obtener estadísticas manualmente
const getStats = async () => {
  try {
    const stats = await getBlacklistStats();
    return stats;
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    throw error;
  }
};

module.exports = {
  setupTokenCleanup,
  manualCleanup,
  getStats
}; 