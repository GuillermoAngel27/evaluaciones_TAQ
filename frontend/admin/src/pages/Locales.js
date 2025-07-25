import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Grid,
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  QrCode as QrCodeIcon,
  Store as StoreIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

const Locales = () => {
  const [locales, setLocales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingLocal, setEditingLocal] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    tipo_local: '',
    estatus: 'Activo'
  });

  useEffect(() => {
    fetchLocales();
  }, []);

  const fetchLocales = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/admin/locales', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLocales(data);
      } else {
        setError('Error al cargar locales');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (local = null) => {
    if (local) {
      setEditingLocal(local);
      setFormData({
        nombre: local.nombre,
        tipo_local: local.tipo_local,
        estatus: local.estatus
      });
    } else {
      setEditingLocal(null);
      setFormData({
        nombre: '',
        tipo_local: '',
        estatus: 'Activo'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingLocal(null);
    setFormData({
      nombre: '',
      tipo_local: '',
      estatus: 'Activo'
    });
  };

  const handleSubmit = async () => {
    try {
      const url = editingLocal 
        ? `http://localhost:4000/api/admin/locales/${editingLocal.id}`
        : 'http://localhost:4000/api/admin/locales';
      
      const method = editingLocal ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        handleCloseDialog();
        fetchLocales();
      } else {
        setError('Error al guardar local');
      }
    } catch (error) {
      setError('Error de conexión');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este local?')) {
      try {
        const response = await fetch(`http://localhost:4000/api/admin/locales/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });

        if (response.ok) {
          fetchLocales();
        } else {
          setError('Error al eliminar local');
        }
      } catch (error) {
        setError('Error de conexión');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Activo':
        return '#2dce89';
      case 'Inactivo':
        return '#f5365c';
      case 'Mantenimiento':
        return '#fbb040';
      default:
        return '#8898aa';
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
            Cargando locales...
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
          Gestión de Locales
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '1.125rem',
            fontWeight: 400
          }}
        >
          Administra los locales del sistema de evaluaciones
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
                    Total Locales
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
                    {locales.length}
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
                  <StoreIcon sx={{ fontSize: 24, color: 'white' }} />
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
                    Activos
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
                    {locales.filter(l => l.estatus === 'Activo').length}
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
                  <StoreIcon sx={{ fontSize: 24, color: 'white' }} />
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
                    Inactivos
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
                    {locales.filter(l => l.estatus === 'Inactivo').length}
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
                  <StoreIcon sx={{ fontSize: 24, color: 'white' }} />
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
                    Mantenimiento
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
                    {locales.filter(l => l.estatus === 'Mantenimiento').length}
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
                  <StoreIcon sx={{ fontSize: 24, color: 'white' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla de locales */}
      <Box sx={{ px: 3, pb: 3 }}>
        <Card sx={{ 
          borderRadius: 0,
          background: 'white',
          border: 'none',
          boxShadow: '0 0 2rem 0 rgba(136, 152, 170, 0.15)',
          overflow: 'hidden'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#172b4d',
                  fontWeight: 700,
                  fontSize: '1.25rem'
                }}
              >
                Lista de Locales
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
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
                Agregar Local
              </Button>
            </Box>

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
                      Tipo
                    </TableCell>
                    <TableCell sx={{ 
                      color: '#172b4d', 
                      fontWeight: 700, 
                      fontSize: '0.875rem',
                      borderBottom: '2px solid #e9ecef'
                    }}>
                      Estatus
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
                  {locales.map((local) => (
                    <TableRow 
                      key={local.id}
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
                            {local.nombre.charAt(0)}
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
                              {local.nombre}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: '#8898aa',
                                fontSize: '0.75rem'
                              }}
                            >
                              ID: {local.id}
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
                          {local.tipo_local}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={local.estatus} 
                          size="small" 
                          sx={{ 
                            background: getStatusColor(local.estatus),
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            borderRadius: 0
                          }} 
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(local)}
                            sx={{ 
                              color: '#5e72e4',
                              '&:hover': {
                                background: 'rgba(94, 114, 228, 0.1)'
                              }
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(local.id)}
                            sx={{ 
                              color: '#f5365c',
                              '&:hover': {
                                background: 'rgba(245, 54, 92, 0.1)'
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
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
                            <QrCodeIcon fontSize="small" />
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

      {/* Dialog para agregar/editar local */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
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
          {editingLocal ? 'Editar Local' : 'Agregar Local'}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Nombre del Local"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
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
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#8898aa' }}>Tipo de Local</InputLabel>
              <Select
                value={formData.tipo_local}
                onChange={(e) => setFormData({ ...formData, tipo_local: e.target.value })}
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
                <MenuItem value="Restaurante">Restaurante</MenuItem>
                <MenuItem value="Café">Café</MenuItem>
                <MenuItem value="Bar">Bar</MenuItem>
                <MenuItem value="Pizzería">Pizzería</MenuItem>
                <MenuItem value="Otro">Otro</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#8898aa' }}>Estatus</InputLabel>
              <Select
                value={formData.estatus}
                onChange={(e) => setFormData({ ...formData, estatus: e.target.value })}
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
                <MenuItem value="Activo">Activo</MenuItem>
                <MenuItem value="Inactivo">Inactivo</MenuItem>
                <MenuItem value="Mantenimiento">Mantenimiento</MenuItem>
              </Select>
            </FormControl>
          </Box>
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
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
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
            {editingLocal ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Locales; 