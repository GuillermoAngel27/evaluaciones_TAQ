import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Avatar,
  InputAdornment,
  IconButton
} from '@mui/material';
import { 
  LockOutlined, 
  Person, 
  Visibility, 
  VisibilityOff,
  AdminPanelSettings
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError('Por favor complete todos los campos');
      setLoading(false);
      return;
    }

    try {
      const result = await login(username, password);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'stretch',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Lado izquierdo - Imagen/Ilustración */}
      <Box
        sx={{
          flex: { xs: 0, lg: 1 },
          display: { xs: 'none', lg: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"%3E%3Cpath d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100" height="100" fill="url(%23grid)"/%3E%3C/svg%3E")',
            opacity: 0.3
          }
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            color: 'white',
            zIndex: 1,
            position: 'relative'
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { lg: '2.5rem', xl: '3rem' }
            }}
          >
            Sistema de Evaluaciones
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 300,
              opacity: 0.9,
              fontSize: { lg: '1.25rem', xl: '1.5rem' }
            }}
          >
            Panel de Administración
          </Typography>
        </Box>
      </Box>

      {/* Lado derecho - Formulario */}
      <Box
        sx={{
          flex: { xs: 1, lg: 1 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: { xs: 2, sm: 4, lg: 6 },
          background: 'white',
          position: 'relative'
        }}
      >
        <Container 
          component="main" 
          maxWidth="sm"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            py: { xs: 2, sm: 4 },
            position: 'relative',
            zIndex: 1
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              maxWidth: { xs: '100%', sm: '400px', md: '450px' }
            }}
          >
                         {/* Logo y título */}
             <Box
               sx={{
                 display: 'flex',
                 flexDirection: 'column',
                 alignItems: 'center',
                 mb: 4,
                 width: '100%'
               }}
             >
               <Avatar 
                 sx={{ 
                   width: 64,
                   height: 64,
                   background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                   boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                   mb: 2
                 }}
               >
                 <AdminPanelSettings sx={{ fontSize: 32, color: 'white' }} />
               </Avatar>
               
               <Typography 
                 component="h1" 
                 variant="h4" 
                 sx={{ 
                   mb: 1,
                   fontWeight: 600,
                   color: '#172b4d',
                   fontSize: { xs: '1.5rem', sm: '1.75rem' },
                   textAlign: 'center'
                 }}
               >
                 Iniciar Sesión
               </Typography>
               
               <Typography 
                 variant="body1" 
                 sx={{ 
                   textAlign: 'center',
                   fontSize: '0.875rem',
                   color: '#8898aa',
                   fontWeight: 400
                 }}
               >
                 Ingresa tus credenciales para acceder al panel
               </Typography>
             </Box>

                         {/* Mensaje de error */}
             {error && (
               <Alert 
                 severity="error" 
                 sx={{ 
                   width: '100%', 
                   mb: 3,
                   borderRadius: 1,
                   fontSize: '0.875rem'
                 }}
               >
                 {error}
               </Alert>
             )}

             {/* Formulario */}
             <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
               <TextField
                 margin="normal"
                 required
                 fullWidth
                 id="username"
                 label="Usuario"
                 name="username"
                 autoComplete="username"
                 autoFocus
                 value={username}
                 onChange={(e) => setUsername(e.target.value)}
                 disabled={loading}
                 sx={{
                   '& .MuiOutlinedInput-root': {
                     borderRadius: 1,
                     background: '#f8f9fa',
                     border: '1px solid #e9ecef',
                     transition: 'all 0.2s ease',
                     '&:hover': {
                       background: '#fff',
                       borderColor: '#667eea',
                     },
                     '&.Mui-focused': {
                       background: '#fff',
                       borderColor: '#667eea',
                       boxShadow: '0 0 0 0.2rem rgba(102, 126, 234, 0.25)',
                     },
                     '& fieldset': {
                       border: 'none'
                     }
                   },
                   '& .MuiInputLabel-root': {
                     fontSize: '0.875rem',
                     color: '#8898aa',
                     fontWeight: 400,
                     '&.Mui-focused': {
                       color: '#667eea'
                     }
                   },
                   '& .MuiInputBase-input': {
                     fontSize: '0.875rem',
                     py: 1.5,
                     px: 1.5,
                     color: '#172b4d',
                     '&::placeholder': {
                       color: '#8898aa',
                       opacity: 1
                     }
                   }
                 }}
                 InputProps={{
                   startAdornment: (
                     <InputAdornment position="start" sx={{ ml: 1 }}>
                       <Person sx={{ 
                         fontSize: 18,
                         color: '#8898aa'
                       }} />
                     </InputAdornment>
                   ),
                 }}
               />
               
               <TextField
                 margin="normal"
                 required
                 fullWidth
                 name="password"
                 label="Contraseña"
                 type={showPassword ? 'text' : 'password'}
                 id="password"
                 autoComplete="current-password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 disabled={loading}
                 sx={{
                   '& .MuiOutlinedInput-root': {
                     borderRadius: 1,
                     background: '#f8f9fa',
                     border: '1px solid #e9ecef',
                     transition: 'all 0.2s ease',
                     '&:hover': {
                       background: '#fff',
                       borderColor: '#667eea',
                     },
                     '&.Mui-focused': {
                       background: '#fff',
                       borderColor: '#667eea',
                       boxShadow: '0 0 0 0.2rem rgba(102, 126, 234, 0.25)',
                     },
                     '& fieldset': {
                       border: 'none'
                     }
                   },
                   '& .MuiInputLabel-root': {
                     fontSize: '0.875rem',
                     color: '#8898aa',
                     fontWeight: 400,
                     '&.Mui-focused': {
                       color: '#667eea'
                     }
                   },
                   '& .MuiInputBase-input': {
                     fontSize: '0.875rem',
                     py: 1.5,
                     px: 1.5,
                     color: '#172b4d',
                     '&::placeholder': {
                       color: '#8898aa',
                       opacity: 1
                     }
                   }
                 }}
                 InputProps={{
                   startAdornment: (
                     <InputAdornment position="start" sx={{ ml: 1 }}>
                       <LockOutlined sx={{ 
                         fontSize: 18,
                         color: '#8898aa'
                       }} />
                     </InputAdornment>
                   ),
                   endAdornment: (
                     <InputAdornment position="end" sx={{ mr: 1 }}>
                       <IconButton
                         aria-label="toggle password visibility"
                         onClick={handleTogglePasswordVisibility}
                         edge="end"
                         size="small"
                         sx={{
                           color: '#8898aa',
                           '&:hover': {
                             color: '#667eea',
                             background: 'rgba(102, 126, 234, 0.1)'
                           }
                         }}
                       >
                         {showPassword ? <VisibilityOff /> : <Visibility />}
                       </IconButton>
                     </InputAdornment>
                   ),
                 }}
               />
               
               <Button
                 type="submit"
                 fullWidth
                 variant="contained"
                 sx={{ 
                   mt: 4, 
                   mb: 3,
                   py: 1.5,
                   borderRadius: 1,
                   fontSize: '0.875rem',
                   fontWeight: 600,
                   textTransform: 'none',
                   background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                   boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
                   '&:hover': {
                     background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                     boxShadow: '0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)',
                     transform: 'translateY(-1px)',
                   },
                   '&:active': {
                     transform: 'translateY(0px)',
                   },
                   transition: 'all 0.15s ease'
                 }}
                 disabled={loading}
               >
                 {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
               </Button>
             </Box>

                         {/* Información de credenciales */}
             <Box
               sx={{
                 mt: 3,
                 p: 2,
                 borderRadius: 1,
                 background: '#f8f9fa',
                 border: '1px solid #e9ecef',
                 width: '100%',
                 textAlign: 'center'
               }}
             >
               <Typography 
                 variant="body2" 
                 sx={{ 
                   fontSize: '0.75rem',
                   mb: 0.5,
                   fontWeight: 600,
                   color: '#8898aa',
                   textTransform: 'uppercase',
                   letterSpacing: '0.5px'
                 }}
               >
                 Credenciales de prueba
               </Typography>
               <Typography 
                 variant="body2" 
                 sx={{ 
                   fontSize: '0.875rem',
                   wordBreak: 'break-word',
                   color: '#172b4d',
                   fontWeight: 500
                 }}
               >
                 Usuario: <strong style={{ color: '#667eea' }}>admin</strong> | 
                 Contraseña: <strong style={{ color: '#667eea' }}>admin123</strong>
               </Typography>
                          </Box>
           </Box>
         </Container>
       </Box>
     </Box>
   );
 };

export default Login; 