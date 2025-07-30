require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const localesRoutes = require('./routes/locales');
const evaluacionesRoutes = require('./routes/evaluaciones');
const tokensRoutes = require('./routes/tokens');
const usuariosRoutes = require('./routes/usuarios');
const { router: authRoutes } = require('./routes/auth');

const app = express();

// Configuración de CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', req.body);
  }
  next();
});

// Crear conexión a la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'evaluaciones_taq',
  port: process.env.DB_PORT || 3306
});

// Manejar errores de conexión
db.connect((err) => {
  if (err) {
    console.error('❌ Error de conexión a MySQL:', err.message);
    console.log('\n💡 Verifica:');
    console.log('   1. Que MySQL esté corriendo');
    console.log('   2. Las credenciales en el archivo .env');
    console.log('   3. Que la base de datos exista');
    process.exit(1);
  } else {
    console.log('✅ Conectado a MySQL exitosamente');
  }
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Evaluaciones funcionando',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      usuarios: '/api/usuarios',
      locales: '/api/locales',
      evaluaciones: '/api/evaluaciones',
      tokens: '/api/tokens'
    }
  });
});

// Ruta de salud
app.get('/health', (req, res) => {
  db.query('SELECT 1 as test', (err, results) => {
    if (err) {
      return res.status(500).json({ 
        status: 'error', 
        message: 'Error de base de datos',
        error: err.message 
      });
    }
    res.json({ 
      status: 'ok', 
      message: 'Servidor y base de datos funcionando',
      timestamp: new Date().toISOString()
    });
  });
});

// Ruta de prueba para locales
app.get('/test-locales', (req, res) => {
  console.log('Test endpoint para locales llamado');
  res.json({ 
    message: 'Endpoint de prueba para locales funcionando',
    timestamp: new Date().toISOString(),
    availableRoutes: [
      'GET /api/locales',
      'POST /api/locales',
      'GET /api/locales/:id',
      'PUT /api/locales/:id',
      'DELETE /api/locales/:id'
    ]
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/locales', localesRoutes);
app.use('/api/evaluaciones', evaluacionesRoutes);
app.use('/api/tokens', tokensRoutes);

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error('Error en el servidor:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: err.message 
  });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.originalUrl 
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend iniciado en puerto ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
  console.log(`📋 API endpoints:`);
  console.log(`   - Auth: http://localhost:${PORT}/api/auth`);
  console.log(`   - Usuarios: http://localhost:${PORT}/api/usuarios`);
  console.log(`   - Locales: http://localhost:${PORT}/api/locales`);
  console.log(`   - Evaluaciones: http://localhost:${PORT}/api/evaluaciones`);
  console.log(`   - Tokens: http://localhost:${PORT}/api/tokens`);
});

// Manejar cierre graceful
process.on('SIGINT', () => {
  console.log('\n🛑 Cerrando servidor...');
  db.end();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Cerrando servidor...');
  db.end();
  process.exit(0);
}); 