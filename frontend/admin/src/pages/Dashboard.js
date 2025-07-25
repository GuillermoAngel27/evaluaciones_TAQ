import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Store as StoreIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  TrendingDown as TrendingDownIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

// Componente de tarjeta de estadísticas con estilo Argon
const StatCard = ({ title, value, icon, color, gradient, trend, trendValue, subtitle }) => (
  <Card sx={{ 
    borderRadius: 0,
    background: 'white',
    border: 'none',
    
    boxShadow: '0 0 2rem 0 rgba(136, 152, 170, 0.15)',
    overflow: 'hidden',
    position: 'relative',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 0 2rem 0 rgba(136, 152, 170, 0.25)'
    }
  }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ flex: 1 }}>
          <Typography 
            sx={{ 
              color: '#8898aa',
              fontSize: '0.875rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              mb: 1
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant="h3" 
            component="div"
            sx={{ 
              color: '#172b4d',
              fontWeight: 700,
              fontSize: '2rem',
              lineHeight: 1,
              mb: 1
            }}
          >
            {value}
          </Typography>
          {subtitle && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#8898aa',
                fontSize: '0.875rem',
                fontWeight: 400
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        
        {/* Icono con estilo Argon */}
        <Box sx={{ 
          position: 'relative',
          ml: 2
        }}>
          <Box sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 2rem 0 rgba(136, 152, 170, 0.15)',
            transition: 'all 0.3s ease'
          }}>
            {React.cloneElement(icon, { 
              sx: { 
                fontSize: 24,
                color: 'white'
              } 
            })}
          </Box>
        </Box>
      </Box>
      
      {/* Indicador de tendencia estilo Argon */}
      {trend && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          mt: 2
        }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: trend === 'up' ? '#2dce89' : '#f5365c',
              fontSize: '0.875rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            {trend === 'up' ? (
              <TrendingUpIcon sx={{ fontSize: 16 }} />
            ) : (
              <TrendingDownIcon sx={{ fontSize: 16 }} />
            )}
            {trendValue}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#8898aa',
              fontSize: '0.875rem'
            }}
          >
            Since last month
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);

// Componente de gráfico con estilo Argon
const ModernChart = ({ data, title, type = 'line' }) => (
  <Card sx={{ 
    borderRadius: 0,
    background: 'white',
    border: 'none',
    boxShadow: '0 0 2rem 0 rgba(136, 152, 170, 0.15)',
    overflow: 'hidden',
    position: 'relative'
  }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#172b4d',
            fontWeight: 600,
            fontSize: '1.125rem'
          }}
        >
          {title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip 
            label="7 days" 
            size="small" 
            sx={{ 
              background: '#5e72e4',
              color: 'white',
              fontWeight: 600
            }} 
          />
          <IconButton size="small" sx={{ color: '#8898aa' }}>
            <MoreVertIcon />
          </IconButton>
        </Box>
      </Box>
      
      <ResponsiveContainer width="100%" height={300}>
        {type === 'line' ? (
          <LineChart data={data}>
            <defs>
              <linearGradient id="colorEvaluaciones" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5e72e4" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#5e72e4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#8898aa', fontSize: 12 }}
              axisLine={{ stroke: '#e9ecef' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: '#8898aa', fontSize: 12 }}
              axisLine={{ stroke: '#e9ecef' }}
              tickLine={false}
            />
            <RechartsTooltip 
              contentStyle={{
                background: 'white',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                boxShadow: '0 0 2rem 0 rgba(136, 152, 170, 0.15)',
                padding: '12px'
              }}
              labelStyle={{ color: '#172b4d', fontWeight: 600 }}
            />
            <Area 
              type="monotone" 
              dataKey="evaluaciones" 
              stroke="none"
              fill="url(#colorEvaluaciones)"
            />
            <Line 
              type="monotone" 
              dataKey="evaluaciones" 
              stroke="#5e72e4" 
              strokeWidth={3}
              dot={{ 
                fill: '#5e72e4', 
                strokeWidth: 2, 
                r: 4,
                stroke: 'white'
              }}
              activeDot={{ 
                r: 6, 
                stroke: '#5e72e4', 
                strokeWidth: 2,
                fill: 'white'
              }}
            />
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#8898aa', fontSize: 12 }}
              axisLine={{ stroke: '#e9ecef' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: '#8898aa', fontSize: 12 }}
              axisLine={{ stroke: '#e9ecef' }}
              tickLine={false}
            />
            <RechartsTooltip 
              contentStyle={{
                background: 'white',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                boxShadow: '0 0 2rem 0 rgba(136, 152, 170, 0.15)',
                padding: '12px'
              }}
            />
            <Bar 
              dataKey="evaluaciones" 
              fill="#5e72e4"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

// Componente de lista de locales con estilo Argon
const LocalesList = ({ locales, title }) => (
  <Card sx={{ 
    borderRadius: 0,
    background: 'white',
    border: 'none',
    boxShadow: '0 0 2rem 0 rgba(136, 152, 170, 0.15)',
    overflow: 'hidden',
    position: 'relative'
  }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#172b4d',
            fontWeight: 600,
            fontSize: '1.125rem'
          }}
        >
          {title}
        </Typography>
        <Tooltip title="Ver todos">
          <IconButton size="small" sx={{ color: '#5e72e4' }}>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      </Box>
      
      {locales && locales.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {locales.map((local, index) => (
            <Box 
              key={local.id || index} 
              sx={{ 
                p: 2, 
                background: '#f8f9fa',
                borderRadius: 0,
                border: '1px solid #e9ecef',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                '&:hover': {
                  background: '#f8f9fa',
                  borderColor: '#5e72e4'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar 
                  sx={{ 
                    width: 40, 
                    height: 40,
                    background: '#5e72e4',
                    fontSize: '1rem',
                    fontWeight: 600
                  }}
                >
                  {local.nombre?.charAt(0) || 'L'}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      color: '#172b4d',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      mb: 0.5
                    }}
                  >
                    {local.nombre || `Local ${index + 1}`}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <StarIcon sx={{ fontSize: 14, color: '#fbb040' }} />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#8898aa',
                          fontSize: '0.75rem',
                          fontWeight: 500
                        }}
                      >
                        {local.calificacion || '4.2'}
                      </Typography>
                    </Box>
                    <Chip 
                      label={local.calificacion < 3 ? 'Baja' : 'Media'} 
                      size="small" 
                      sx={{ 
                        background: local.calificacion < 3 ? '#f5365c' : '#fbb040',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.75rem'
                      }} 
                    />
                  </Box>
                </Box>
              </Box>
              
              {/* Barra de progreso estilo Argon */}
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" sx={{ color: '#8898aa', fontSize: '0.75rem' }}>
                    Calificación
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#172b4d', fontSize: '0.75rem', fontWeight: 600 }}>
                    {local.calificacion || '4.2'}/5.0
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(local.calificacion || 4.2) * 20} 
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    background: '#e9ecef',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 2,
                      background: local.calificacion < 3 
                        ? '#f5365c'
                        : '#fbb040'
                    }
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={{ 
          textAlign: 'center', 
          py: 4,
          color: '#8898aa'
        }}>
          <StoreIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            No hay locales disponibles
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Los locales aparecerán aquí cuando se registren
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setError('Error al cargar datos del dashboard');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '60vh'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress 
            size={60}
            sx={{ 
              color: '#5e72e4',
              mb: 2
            }} 
          />
          <Typography variant="body1" sx={{ color: '#8898aa' }}>
            Cargando dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ 
          mt: 2,
          borderRadius: 0,
          background: '#f5365c',
          color: 'white',
          border: 'none'
        }}
      >
        {error}
      </Alert>
    );
  }

  // Datos de ejemplo para el gráfico
  const chartData = [
    { name: 'Lun', evaluaciones: 4 },
    { name: 'Mar', evaluaciones: 3 },
    { name: 'Mié', evaluaciones: 7 },
    { name: 'Jue', evaluaciones: 5 },
    { name: 'Vie', evaluaciones: 8 },
    { name: 'Sáb', evaluaciones: 6 },
    { name: 'Dom', evaluaciones: 2 }
  ];

  // Datos de ejemplo para locales
  const sampleLocales = [
    { id: 1, nombre: 'Restaurante El Buen Sabor', calificacion: 2.8 },
    { id: 2, nombre: 'Café Central', calificacion: 3.2 },
    { id: 3, nombre: 'Pizzería Italia', calificacion: 2.5 }
  ];

  return (
    <Box sx={{ 
      background: '#f8f9fa',
      minHeight: '100vh',
      p: 0
    }}>
      {/* Header del Dashboard estilo Argon */}
      <Box sx={{ 
        mb: 4,
        p: 4,
        background: 'linear-gradient(87deg, #5e72e4 0, #825ee4 100%)',
        color: 'white'
      }}>
        <Typography 
          variant="h3" 
          sx={{ 
            color: 'white',
            fontWeight: 700,
            fontSize: { xs: '1.75rem', sm: '2.5rem' },
            mb: 1
          }}
        >
          Dashboard
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '1.125rem',
            fontWeight: 400
          }}
        >
          Bienvenido al panel de control del sistema de evaluaciones
        </Typography>
      </Box>

      {/* Tarjetas de estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4, px: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Locales Activos"
            value={stats?.localesActivos || 24}
            icon={<StoreIcon />}
            color="#5e72e4"
            gradient="linear-gradient(87deg, #5e72e4 0, #825ee4 100%)"
            trend="up"
            trendValue="+12%"
            subtitle="vs mes anterior"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Evaluaciones Hoy"
            value={stats?.evaluacionesHoy || 18}
            icon={<AssessmentIcon />}
            color="#2dce89"
            gradient="linear-gradient(87deg, #2dce89 0, #2dcecc 100%)"
            trend="up"
            trendValue="+8%"
            subtitle="vs ayer"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Promedio General"
            value={stats?.promedioGeneral || '4.2'}
            icon={<TrendingUpIcon />}
            color="#11cdef"
            gradient="linear-gradient(87deg, #11cdef 0, #1171ef 100%)"
            trend="up"
            trendValue="+0.3"
            subtitle="puntos"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Alertas"
            value={stats?.alertas || 3}
            icon={<WarningIcon />}
            color="#f5365c"
            gradient="linear-gradient(87deg, #f5365c 0, #f56036 100%)"
            trend="down"
            trendValue="-2"
            subtitle="vs semana anterior"
          />
        </Grid>
      </Grid>

      {/* Gráficos y listas */}
      <Grid container spacing={3} sx={{ px: 3, pb: 3 }}>
        <Grid item xs={12} lg={8}>
          <ModernChart 
            data={chartData} 
            title="Evaluaciones de la Semana" 
            type="line"
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <LocalesList 
            locales={stats?.localesBajaCalificacion || sampleLocales} 
            title="Locales con Baja Calificación"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 