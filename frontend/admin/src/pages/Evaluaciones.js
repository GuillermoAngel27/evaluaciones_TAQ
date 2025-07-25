import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Rating,
  Grid,
  Avatar
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Reply as ReplyIcon,
  Assessment as AssessmentIcon,
  Star as StarIcon
} from '@mui/icons-material';

const Evaluaciones = () => {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvaluacion, setSelectedEvaluacion] = useState(null);
  const [filtros, setFiltros] = useState({
    local: '',
    fecha: '',
    calificacion: ''
  });

  useEffect(() => {
    fetchEvaluaciones();
  }, []);

  const fetchEvaluaciones = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/admin/evaluaciones', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEvaluaciones(data);
      } else {
        setError('Error al cargar evaluaciones');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleViewEvaluacion = (evaluacion) => {
    setSelectedEvaluacion(evaluacion);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvaluacion(null);
  };

  const getCalificacionColor = (calificacion) => {
    if (calificacion >= 4) return '#2dce89';
    if (calificacion >= 3) return '#fbb040';
    return '#f5365c';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES');
  };

  const calcularPromedio = (respuestas) => {
    if (!respuestas || respuestas.length === 0) return 0;
    const suma = respuestas.reduce((acc, resp) => acc + resp, 0);
    return (suma / respuestas.length).toFixed(1);
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
            Cargando evaluaciones...
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
  const evaluacionesEjemplo = [
    {
      id: 1,
      local: 'Restaurante El Buen Sabor',
      fecha: '2024-01-15T10:30:00',
      calificacion: 4.2,
      comentarios: 'Excelente servicio y comida deliciosa',
      respuestas: [4, 5, 4, 3, 5]
    },
    {
      id: 2,
      local: 'Café Central',
      fecha: '2024-01-14T15:45:00',
      calificacion: 3.8,
      comentarios: 'Buen café pero el servicio fue lento',
      respuestas: [4, 3, 4, 4, 4]
    },
    {
      id: 3,
      local: 'Pizzería Italia',
      fecha: '2024-01-13T19:20:00',
      calificacion: 2.5,
      comentarios: 'Pizza fría y servicio deficiente',
      respuestas: [2, 3, 2, 3, 2]
    }
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
          Gestión de Evaluaciones
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '1.125rem',
            fontWeight: 400
          }}
        >
          Revisa y administra todas las evaluaciones del sistema
        </Typography>
      </Box>

      {/* Estadísticas rápidas */}
      <Grid container spacing={3} sx={{ mb: 4, px: 3 }}>
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
                    {evaluacionesEjemplo.length}
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
                  <AssessmentIcon sx={{ fontSize: 24, color: 'white' }} />
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
                    {(evaluacionesEjemplo.reduce((sum, evaluacion) => sum + evaluacion.calificacion, 0) / evaluacionesEjemplo.length).toFixed(1)}
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
                  <StarIcon sx={{ fontSize: 24, color: 'white' }} />
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
                    Evaluaciones Hoy
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
                    {evaluacionesEjemplo.filter(e => new Date(e.fecha).toDateString() === new Date().toDateString()).length}
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
                  <AssessmentIcon sx={{ fontSize: 24, color: 'white' }} />
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
                    Baja Calificación
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
                    {evaluacionesEjemplo.filter(e => e.calificacion < 3).length}
                  </Typography>
                </Box>
                <Box sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'linear-gradient(87deg, #f5365c 0, #f56036 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 2rem 0 rgba(136, 152, 170, 0.15)',
                  transition: 'all 0.3s ease'
                }}>
                  <StarIcon sx={{ fontSize: 24, color: 'white' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtros */}
      <Box sx={{ px: 3, mb: 4 }}>
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
              Filtros de Búsqueda
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Local"
                  value={filtros.local}
                  onChange={(e) => setFiltros({ ...filtros, local: e.target.value })}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                      '& fieldset': {
                        borderColor: '#e9ecef'
                      },
                      '&:hover fieldset': {
                        borderColor: '#5e72e4'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#5e72e4'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: '#8898aa'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Fecha"
                  type="date"
                  value={filtros.fecha}
                  onChange={(e) => setFiltros({ ...filtros, fecha: e.target.value })}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                      '& fieldset': {
                        borderColor: '#e9ecef'
                      },
                      '&:hover fieldset': {
                        borderColor: '#5e72e4'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#5e72e4'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: '#8898aa'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#8898aa' }}>Calificación</InputLabel>
                  <Select
                    value={filtros.calificacion}
                    onChange={(e) => setFiltros({ ...filtros, calificacion: e.target.value })}
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
                    <MenuItem value="">Todas</MenuItem>
                    <MenuItem value="alta">Alta (4-5)</MenuItem>
                    <MenuItem value="media">Media (3-4)</MenuItem>
                    <MenuItem value="baja">Baja (1-3)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* Tabla de evaluaciones */}
      <Box sx={{ px: 3, pb: 3 }}>
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
              Lista de Evaluaciones
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: '#f8f9fa' }}>
                    <TableCell sx={{ 
                      color: '#172b4d', 
                      fontWeight: 700, 
                      fontSize: '0.875rem',
                      borderBottom: '2px solid #e9ecef'
                    }}>
                      Local
                    </TableCell>
                    <TableCell sx={{ 
                      color: '#172b4d', 
                      fontWeight: 700, 
                      fontSize: '0.875rem',
                      borderBottom: '2px solid #e9ecef'
                    }}>
                      Fecha
                    </TableCell>
                    <TableCell sx={{ 
                      color: '#172b4d', 
                      fontWeight: 700, 
                      fontSize: '0.875rem',
                      borderBottom: '2px solid #e9ecef'
                    }}>
                      Calificación
                    </TableCell>
                    <TableCell sx={{ 
                      color: '#172b4d', 
                      fontWeight: 700, 
                      fontSize: '0.875rem',
                      borderBottom: '2px solid #e9ecef'
                    }}>
                      Comentarios
                    </TableCell>
                    <TableCell sx={{ 
                      color: '#172b4d', 
                      fontWeight: 700, 
                      fontSize: '0.875rem',
                      borderBottom: '2px solid #e9ecef'
                    }}>
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {evaluacionesEjemplo.map((evaluacion) => (
                    <TableRow 
                      key={evaluacion.id}
                      sx={{ 
                        '&:hover': { 
                          background: '#f8f9fa' 
                        },
                        '&:last-child td': { 
                          border: 0 
                        }
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar 
                            sx={{ 
                              width: 40, 
                              height: 40,
                              background: 'linear-gradient(87deg, #5e72e4 0, #825ee4 100%)',
                              fontSize: '1rem',
                              fontWeight: 600
                            }}
                          >
                            {evaluacion.local.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography 
                              variant="subtitle1" 
                              sx={{ 
                                color: '#172b4d',
                                fontWeight: 600,
                                fontSize: '0.875rem'
                              }}
                            >
                              {evaluacion.local}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: '#8898aa',
                                fontSize: '0.75rem'
                              }}
                            >
                              ID: {evaluacion.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#172b4d',
                            fontWeight: 500,
                            fontSize: '0.875rem'
                          }}
                        >
                          {formatDate(evaluacion.fecha)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Rating 
                            value={evaluacion.calificacion} 
                            readOnly 
                            size="small"
                            sx={{
                              '& .MuiRating-iconFilled': {
                                color: getCalificacionColor(evaluacion.calificacion)
                              }
                            }}
                          />
                          <Chip 
                            label={evaluacion.calificacion} 
                            size="small" 
                            sx={{ 
                              background: getCalificacionColor(evaluacion.calificacion),
                              color: 'white',
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              borderRadius: 0
                            }} 
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#172b4d',
                            fontSize: '0.875rem',
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {evaluacion.comentarios}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleViewEvaluacion(evaluacion)}
                            sx={{ 
                              color: '#5e72e4',
                              '&:hover': {
                                background: 'rgba(94, 114, 228, 0.1)'
                              }
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{ 
                              color: '#11cdef',
                              '&:hover': {
                                background: 'rgba(17, 205, 239, 0.1)'
                              }
                            }}
                          >
                            <ReplyIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>

      {/* Dialog para ver evaluación detallada */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 0,
            boxShadow: '0 0 2rem 0 rgba(136, 152, 170, 0.15)'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(87deg, #5e72e4 0, #825ee4 100%)',
          color: 'white',
          fontWeight: 700
        }}>
          Detalles de la Evaluación
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedEvaluacion && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar 
                  sx={{ 
                    width: 60, 
                    height: 60,
                    background: 'linear-gradient(87deg, #5e72e4 0, #825ee4 100%)',
                    fontSize: '1.5rem',
                    fontWeight: 600
                  }}
                >
                  {selectedEvaluacion.local.charAt(0)}
                </Avatar>
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#172b4d',
                      fontWeight: 700,
                      fontSize: '1.25rem'
                    }}
                  >
                    {selectedEvaluacion.local}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#8898aa',
                      fontSize: '0.875rem'
                    }}
                  >
                    Evaluación #{selectedEvaluacion.id}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: '#172b4d',
                    fontWeight: 600,
                    mb: 1
                  }}
                >
                  Calificación General
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Rating 
                    value={selectedEvaluacion.calificacion} 
                    readOnly 
                    size="large"
                    sx={{
                      '& .MuiRating-iconFilled': {
                        color: getCalificacionColor(selectedEvaluacion.calificacion)
                      }
                    }}
                  />
                  <Chip 
                    label={selectedEvaluacion.calificacion} 
                    sx={{ 
                      background: getCalificacionColor(selectedEvaluacion.calificacion),
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '1rem',
                      borderRadius: 0
                    }} 
                  />
                </Box>
              </Box>

              <Box>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: '#172b4d',
                    fontWeight: 600,
                    mb: 1
                  }}
                >
                  Comentarios
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#172b4d',
                    fontSize: '1rem',
                    lineHeight: 1.6,
                    p: 2,
                    background: '#f8f9fa',
                    borderRadius: 0,
                    border: '1px solid #e9ecef'
                  }}
                >
                  {selectedEvaluacion.comentarios}
                </Typography>
              </Box>

              <Box>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: '#172b4d',
                    fontWeight: 600,
                    mb: 1
                  }}
                >
                  Fecha de Evaluación
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#8898aa',
                    fontSize: '1rem'
                  }}
                >
                  {formatDate(selectedEvaluacion.fecha)}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ 
              color: '#8898aa',
              border: '1px solid #e9ecef',
              borderRadius: 0,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1,
              '&:hover': {
                background: '#f8f9fa',
                borderColor: '#8898aa'
              }
            }}
          >
            Cerrar
          </Button>
          <Button 
            variant="contained"
            sx={{
              background: 'linear-gradient(87deg, #5e72e4 0, #825ee4 100%)',
              borderRadius: 0,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1,
              '&:hover': {
                background: 'linear-gradient(87deg, #4a5fd1 0, #6f4fd1 100%)'
              }
            }}
          >
            Responder
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Evaluaciones; 