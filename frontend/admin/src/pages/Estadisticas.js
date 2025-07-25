import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

const COLORS = ['#5e72e4', '#2dce89', '#fbb040', '#f5365c', '#11cdef'];

const Estadisticas = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [periodo, setPeriodo] = useState('semana');

  useEffect(() => {
    fetchEstadisticas();
  }, [periodo]);

  const fetchEstadisticas = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/admin/estadisticas?periodo=${periodo}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setError('Error al cargar estadísticas');
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
            Cargando estadísticas...
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

  // Datos de ejemplo
  const evaluacionesPorTipo = [
    { name: 'Restaurante', value: 45 },
    { name: 'Café', value: 30 },
    { name: 'Bar', value: 25 },
    { name: 'Pizzería', value: 20 }
  ];

  const evaluacionesPorDia = [
    { dia: 'Lun', evaluaciones: 12 },
    { dia: 'Mar', evaluaciones: 8 },
    { dia: 'Mié', evaluaciones: 15 },
    { dia: 'Jue', evaluaciones: 10 },
    { dia: 'Vie', evaluaciones: 18 },
    { dia: 'Sáb', evaluaciones: 14 },
    { dia: 'Dom', evaluaciones: 6 }
  ];

  const calificacionesPorLocal = [
    { local: 'Restaurante El Buen Sabor', calificacion: 4.2 },
    { local: 'Café Central', calificacion: 3.8 },
    { local: 'Pizzería Italia', calificacion: 4.5 },
    { local: 'Bar La Esquina', calificacion: 3.9 },
    { local: 'Café Express', calificacion: 4.1 }
  ];

  return (
    <Box sx={{ 
      background: '#f8f9fa',
      minHeight: '100vh',
      p: 0
    }}>
      {/* Header estilo Argon */}
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
          Estadísticas
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '1.125rem',
            fontWeight: 400
          }}
        >
          Análisis detallado del rendimiento del sistema
        </Typography>
      </Box>

      {/* Selector de período */}
      <Box sx={{ px: 3, mb: 4 }}>
        <Card sx={{ 
          borderRadius: 0,
          background: 'white',
          border: 'none',
          boxShadow: '0 0 2rem 0 rgba(136, 152, 170, 0.15)',
          overflow: 'hidden'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#172b4d',
                  fontWeight: 700,
                  fontSize: '1.25rem'
                }}
              >
                Período de Análisis
              </Typography>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel sx={{ color: '#8898aa' }}>Período</InputLabel>
                <Select
                  value={periodo}
                  onChange={(e) => setPeriodo(e.target.value)}
                  sx={{
                    borderRadius: 0,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e9ecef'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#5e72e4'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#5e72e4'
                    }
                  }}
                >
                  <MenuItem value="semana">Última Semana</MenuItem>
                  <MenuItem value="mes">Último Mes</MenuItem>
                  <MenuItem value="trimestre">Último Trimestre</MenuItem>
                  <MenuItem value="año">Último Año</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Gráficos */}
      <Grid container spacing={3} sx={{ px: 3, pb: 3 }}>
        {/* Gráfico de evaluaciones por día */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ 
            borderRadius: 0,
            background: 'white',
            border: 'none',
            boxShadow: '0 0 2rem 0 rgba(136, 152, 170, 0.15)',
            overflow: 'hidden'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#172b4d',
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  mb: 3
                }}
              >
                Evaluaciones por Día
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={evaluacionesPorDia}>
                  <defs>
                    <linearGradient id="colorEvaluaciones" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5e72e4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#5e72e4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                  <XAxis 
                    dataKey="dia" 
                    tick={{ fill: '#8898aa', fontSize: 12 }}
                    axisLine={{ stroke: '#e9ecef' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: '#8898aa', fontSize: 12 }}
                    axisLine={{ stroke: '#e9ecef' }}
                    tickLine={false}
                  />
                  <Tooltip 
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
                    stroke="#5e72e4" 
                    strokeWidth={3}
                    fill="url(#colorEvaluaciones)"
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
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico de evaluaciones por tipo */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ 
            borderRadius: 0,
            background: 'white',
            border: 'none',
            boxShadow: '0 0 2rem 0 rgba(136, 152, 170, 0.15)',
            overflow: 'hidden'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#172b4d',
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  mb: 3
                }}
              >
                Evaluaciones por Tipo
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={evaluacionesPorTipo}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {evaluacionesPorTipo.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      background: 'white',
                      border: '1px solid #e9ecef',
                      borderRadius: '8px',
                      boxShadow: '0 0 2rem 0 rgba(136, 152, 170, 0.15)',
                      padding: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico de calificaciones por local */}
        <Grid item xs={12}>
          <Card sx={{ 
            borderRadius: 0,
            background: 'white',
            border: 'none',
            boxShadow: '0 0 2rem 0 rgba(136, 152, 170, 0.15)',
            overflow: 'hidden'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#172b4d',
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  mb: 3
                }}
              >
                Calificaciones por Local
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={calificacionesPorLocal}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                  <XAxis 
                    dataKey="local" 
                    tick={{ fill: '#8898aa', fontSize: 12 }}
                    axisLine={{ stroke: '#e9ecef' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: '#8898aa', fontSize: 12 }}
                    axisLine={{ stroke: '#e9ecef' }}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      background: 'white',
                      border: '1px solid #e9ecef',
                      borderRadius: '8px',
                      boxShadow: '0 0 2rem 0 rgba(136, 152, 170, 0.15)',
                      padding: '12px'
                    }}
                  />
                  <Bar 
                    dataKey="calificacion" 
                    fill="#5e72e4"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Estadísticas rápidas */}
        <Grid item xs={12} sm={6} md={3}>
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
                    Total Evaluaciones
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
                    {evaluacionesPorDia.reduce((sum, item) => sum + item.evaluaciones, 0)}
                  </Typography>
                </Box>
                <Box sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'linear-gradient(87deg, #5e72e4 0, #825ee4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 2rem 0 rgba(136, 152, 170, 0.15)',
                  transition: 'all 0.3s ease'
                }}>
                  <Typography sx={{ color: 'white', fontSize: 24, fontWeight: 700 }}>
                    E
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
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
                    Promedio General
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
                    {(calificacionesPorLocal.reduce((sum, item) => sum + item.calificacion, 0) / calificacionesPorLocal.length).toFixed(1)}
                  </Typography>
                </Box>
                <Box sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'linear-gradient(87deg, #2dce89 0, #2dcecc 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 2rem 0 rgba(136, 152, 170, 0.15)',
                  transition: 'all 0.3s ease'
                }}>
                  <Typography sx={{ color: 'white', fontSize: 24, fontWeight: 700 }}>
                    ★
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
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
                    Tipos de Local
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
                    {evaluacionesPorTipo.length}
                  </Typography>
                </Box>
                <Box sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'linear-gradient(87deg, #11cdef 0, #1171ef 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 2rem 0 rgba(136, 152, 170, 0.15)',
                  transition: 'all 0.3s ease'
                }}>
                  <Typography sx={{ color: 'white', fontSize: 24, fontWeight: 700 }}>
                    T
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
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
                    Locales Evaluados
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
                    {calificacionesPorLocal.length}
                  </Typography>
                </Box>
                <Box sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'linear-gradient(87deg, #fbb040 0, #f7931e 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 2rem 0 rgba(136, 152, 170, 0.15)',
                  transition: 'all 0.3s ease'
                }}>
                  <Typography sx={{ color: 'white', fontSize: 24, fontWeight: 700 }}>
                    L
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Estadisticas; 