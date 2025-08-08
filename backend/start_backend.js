require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const db = require('./db'); // Usar el pool de conexiones configurado
const localesRoutes = require('./routes/locales');
const evaluacionesRoutes = require('./routes/evaluaciones');
const tokensRoutes = require('./routes/tokens');
const usuariosRoutes = require('./routes/usuarios');
const { router: authRoutes } = require('./routes/auth');
const { setupTokenCleanup } = require('./utils/tokenCleanup');

const app = express();

// Logging de configuración de base de datos (sin mostrar password)
console.log('🔧 Configuración de Base de Datos:');
console.log(`   Host: ${process.env.DB_HOST || 'NO CONFIGURADO'}`);
console.log(`   User: ${process.env.DB_USER || 'NO CONFIGURADO'}`);
console.log(`   Database: ${process.env.DB_NAME || 'NO CONFIGURADO'}`);
console.log(`   Port: ${process.env.DB_PORT || 3306}`);
console.log(`   Password: ${process.env.DB_PASSWORD ? 'CONFIGURADO' : 'NO CONFIGURADO'}`);

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



// Configuración de CORS simplificada
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = ['https://admine.taqro.com.mx', 'https://evaluacion.taqro.com.mx', 'http://localhost:3000', 'http://localhost:3001'];
    
    // Permitir requests sin origin (como aplicaciones móviles o Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept']
}));

// Middleware adicional para CORS headers
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = ['https://admine.taqro.com.mx', 'https://evaluacion.taqro.com.mx', 'http://localhost:3000', 'http://localhost:3001'];
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());
app.use(cookieParser());

// Middleware para logging
app.use((req, res, next) => {
  next();
});

// Función para crear usuario admin si no existe
const createAdminUser = async () => {
  try {
    console.log('🔍 Verificando usuario administrador...');
    
    // Verificar si el usuario admin ya existe
    const checkSql = 'SELECT id FROM usuarios WHERE username = ?';
    db.query(checkSql, ['admin'], (err, results) => {
      if (err) {
        console.error('❌ Error verificando usuario admin:', err.message);
        return;
      }

      if (results.length > 0) {
        console.log('✅ Usuario administrador ya existe');
        return;
      }

      // Si no existe, crear el usuario admin
      console.log('👤 Creando usuario administrador...');
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
        if (insertErr) {
          console.error('❌ Error creando usuario admin:', insertErr.message);
        } else {
          console.log('✅ Usuario administrador creado exitosamente');
        }
      });
    });
  } catch (error) {
    console.error('❌ Error en createAdminUser:', error.message);
  }
};

// Función para probar la conexión a la base de datos
const testDatabaseConnection = () => {
  return new Promise((resolve, reject) => {
    console.log('🔌 Probando conexión a la base de datos...');
    
    db.query('SELECT 1 as test', (err, results) => {
      if (err) {
        console.error('❌ Error de conexión a la base de datos:', err.message);
        console.error('   Código de error:', err.code);
        console.error('   Número de error:', err.errno);
        reject(err);
      } else {
        console.log('✅ Conexión a la base de datos establecida exitosamente');
        console.log('   Resultado de prueba:', results[0]);
        resolve(results);
      }
    });
  });
};

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

// Ruta de salud mejorada
app.get('/health', (req, res) => {
  console.log('🏥 Health check solicitado');
  
  db.query('SELECT 1 as test', (err, results) => {
    if (err) {
      console.error('❌ Health check - Error de base de datos:', err.message);
      return res.status(500).json({ 
        status: 'error', 
        message: 'Error de base de datos',
        error: err.message,
        code: err.code,
        timestamp: new Date().toISOString()
      });
    }
    
    console.log('✅ Health check - Base de datos funcionando');
    res.json({ 
      status: 'ok', 
      message: 'Servidor y base de datos funcionando',
      timestamp: new Date().toISOString(),
      database: 'connected'
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
console.log('🔧 Registrando rutas de la API...');

app.use('/api/auth', (req, res, next) => {
  console.log('🔍 Request a /api/auth:', req.method, req.path);
  next();
}, authRoutes);

app.use('/api/usuarios', (req, res, next) => {
  console.log('🔍 Request a /api/usuarios:', req.method, req.path);
  next();
}, usuariosRoutes);

app.use('/api/locales', (req, res, next) => {
  console.log('🔍 Request a /api/locales:', req.method, req.path);
  next();
}, localesRoutes);

app.use('/api/evaluaciones', (req, res, next) => {
  console.log('🔍 Request a /api/evaluaciones:', req.method, req.path);
  next();
}, evaluacionesRoutes);

app.use('/api/tokens', (req, res, next) => {
  console.log('🔍 Request a /api/tokens:', req.method, req.path);
  next();
}, tokensRoutes);

console.log('✅ Rutas de la API registradas');

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

const PORT = process.env.PORT || 3000;

// Inicializar la aplicación
const initializeApp = async () => {
  try {
    // Probar conexión a la base de datos
    await testDatabaseConnection();
    
    // Crear usuario admin después de conectar exitosamente
    createAdminUser();
    
    // Iniciar el servidor
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor iniciado en el puerto ${PORT}`);
      console.log(`📡 API disponible en: http://0.0.0.0:${PORT}`);
      console.log(`🌐 Accesible desde: http://localhost:${PORT}`);
      
      // Configurar limpieza automática de tokens
      setupTokenCleanup();
    });
    
  } catch (error) {
    console.error('❌ Error inicializando la aplicación:', error.message);
    console.error('   Detalles:', error);
    process.exit(1);
  }
};

// Inicializar la aplicación
initializeApp();

// Manejar cierre graceful
process.on('SIGINT', () => {
  console.log('🛑 Cerrando aplicación...');
  db.end();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🛑 Cerrando aplicación...');
  db.end();
  process.exit(0);
}); 