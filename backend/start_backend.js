require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const localesRoutes = require('./routes/locales');
const evaluacionesRoutes = require('./routes/evaluaciones');
const tokensRoutes = require('./routes/tokens');
const usuariosRoutes = require('./routes/usuarios');
const { router: authRoutes } = require('./routes/auth');
const { setupTokenCleanup } = require('./utils/tokenCleanup');

const app = express();

// Configuración de seguridad con Helmet
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    scriptSrc: ["'self'"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'"],
    fontSrc: ["'self'", "https:"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'none'"],
  },
}));

// Configuración de CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['https://evaluaciones.taqro.com.mx'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Middleware para logging
app.use((req, res, next) => {
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

// Función para crear usuario admin si no existe
const createAdminUser = async () => {
  try {
    // Verificar si el usuario admin ya existe
    const checkSql = 'SELECT id FROM usuarios WHERE username = ?';
    db.query(checkSql, ['admin'], (err, results) => {
      if (err) {
        return;
      }

      if (results.length > 0) {
        return;
      }

      // Si no existe, crear el usuario admin
      const hashedPassword = bcrypt.hashSync('admin2025', 10);
      const insertSql = `
        INSERT INTO usuarios (username, password, nombre, apellido, rol, activo) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      db.query(insertSql, [
        'admin',
        hashedPassword,
        'Administrador',
        'Sistema',
        'administrador',
        1
      ], (insertErr, insertResults) => {
        // Usuario admin creado o error silencioso
      });
    });
  } catch (error) {
    // Error silencioso
  }
};

// Manejar errores de conexión
db.connect((err) => {
  if (err) {
    process.exit(1);
  } else {
    // Conexión a la base de datos establecida exitosamente
    console.log('✅ Conexión a la base de datos establecida');
    // Crear usuario admin después de conectar exitosamente
    createAdminUser();
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
  // Conexión del servidor establecida exitosamente
  console.log(`🚀 Servidor iniciado en el puerto ${PORT}`);
  console.log(`📡 API disponible en: http://localhost:${PORT}`);
  
  // Configurar limpieza automática de tokens
  setupTokenCleanup();
});

// Manejar cierre graceful
process.on('SIGINT', () => {
  db.end();
  process.exit(0);
});

process.on('SIGTERM', () => {
  db.end();
  process.exit(0);
}); 