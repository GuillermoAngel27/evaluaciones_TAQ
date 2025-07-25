import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Store as StoreIcon,
  BarChart as BarChartIcon,
  Assessment as AssessmentIcon,
  AccountCircle,
  Logout
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 240;

const menuItems = [
  { text: 'Inicio', icon: <DashboardIcon />, path: '/' },
  { text: 'Locales', icon: <StoreIcon />, path: '/locales' },
  { text: 'Estadísticas', icon: <BarChartIcon />, path: '/estadisticas' },
  { text: 'Evaluaciones', icon: <AssessmentIcon />, path: '/evaluaciones' }
];

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/login');
  };

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      background: 'linear-gradient(87deg, #5e72e4 0, #825ee4 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Header del Sidebar */}
      <Box sx={{ 
        p: 3, 
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        zIndex: 1
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          mb: 1
        }}>
          <Box sx={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            mr: 2
          }}>
            <DashboardIcon sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'white',
              fontWeight: 700,
              fontSize: '1.125rem',
              textAlign: 'center'
            }}
          >
            Admin Panel
          </Typography>
        </Box>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.75rem',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
        >
          Sistema de Evaluaciones
        </Typography>
      </Box>

      {/* Menú de Navegación */}
      <Box sx={{ p: 2, position: 'relative', zIndex: 1 }}>
        <Typography 
          variant="overline" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            mb: 2,
            px: 2
          }}
        >
          Navegación
        </Typography>
        <List sx={{ p: 0 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 3,
                  mx: 1,
                  py: 1.5,
                  px: 2,
                  color: 'rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: location.pathname === item.path 
                      ? 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))'
                      : 'transparent',
                    borderRadius: 'inherit',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    transform: 'translateX(4px)',
                    '&::before': {
                      opacity: 1
                    }
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    color: 'white',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    '&::before': {
                      opacity: 1
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      transform: 'translateX(4px)'
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  color: 'inherit',
                  minWidth: 44,
                  mr: 2
                }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    background: location.pathname === item.path 
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease'
                  }}>
                    {React.cloneElement(item.icon, { 
                      sx: { 
                        fontSize: 18,
                        color: 'inherit'
                      } 
                    })}
                  </Box>
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    '& .MuiListItemText-primary': {
                      fontWeight: location.pathname === item.path ? 600 : 500,
                      fontSize: '0.875rem',
                      letterSpacing: '0.25px'
                    }
                  }}
                />
                {location.pathname === item.path && (
                  <Box sx={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: 'white',
                    boxShadow: '0 0 8px rgba(255, 255, 255, 0.5)'
                  }} />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Footer del Sidebar */}
      <Box sx={{ 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        p: 2,
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          p: 1.5,
          borderRadius: 2,
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <Box sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2
          }}>
            <AccountCircle sx={{ color: 'white', fontSize: 18 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'white',
                fontWeight: 600,
                fontSize: '0.875rem'
              }}
            >
              {user?.username || 'Administrador'}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.75rem'
              }}
            >
              Administrador
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'white',
          borderBottom: '1px solid #e9ecef',
          boxShadow: '0 0 2rem 0 rgba(136, 152, 170, 0.15)'
        }}
      >
        <Toolbar sx={{ 
          minHeight: '80px !important',
          px: { xs: 2, sm: 3 }
        }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { sm: 'none' },
              color: '#667eea',
              backgroundColor: 'rgba(102, 126, 234, 0.1)',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'rgba(102, 126, 234, 0.2)'
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Breadcrumb y título */}
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#172b4d',
                  fontWeight: 700,
                  fontSize: '1.25rem'
                }}
              >
                {menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
              </Typography>
              <Box sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#667eea',
                opacity: 0.6
              }} />
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#8898aa',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                Panel de Control
              </Typography>
            </Box>
          </Box>

          {/* Información del usuario */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            p: 1,
            borderRadius: 0,
            background: '#f8f9fa',
            border: '1px solid #e9ecef'
          }}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#172b4d',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  lineHeight: 1.2
                }}
              >
                {user?.username || 'Administrador'}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#8898aa',
                  fontSize: '0.75rem'
                }}
              >
                Administrador
              </Typography>
            </Box>
                         <IconButton
               size="large"
               aria-label="account of current user"
               aria-controls="menu-appbar"
               aria-haspopup="true"
               onClick={handleMenuOpen}
               sx={{
                 color: '#5e72e4',
                 backgroundColor: '#f8f9fa',
                 borderRadius: '50%',
                 width: 40,
                 height: 40,
                 border: '1px solid #e9ecef',
                 '&:hover': {
                   backgroundColor: '#e9ecef',
                   borderColor: '#5e72e4'
                 },
                 transition: 'all 0.2s ease'
               }}
             >
              <AccountCircle sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
                         PaperProps={{
               sx: {
                 mt: 1,
                 borderRadius: 0,
                 boxShadow: '0 0 2rem 0 rgba(136, 152, 170, 0.15)',
                 border: '1px solid #e9ecef',
                 overflow: 'hidden',
                 minWidth: 200
               }
             }}
          >
            {/* Header del menú */}
                         <Box sx={{ 
               p: 2, 
               background: 'linear-gradient(87deg, #5e72e4 0, #825ee4 100%)',
               color: 'white'
             }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                {user?.username || 'Administrador'}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Administrador del Sistema
              </Typography>
            </Box>
            
            {/* Opciones del menú */}
            <Box sx={{ p: 1 }}>
              <MenuItem 
                onClick={handleLogout}
                                 sx={{
                   borderRadius: 0,
                   mx: 0.5,
                   py: 1.5,
                   px: 2,
                   color: '#172b4d',
                   '&:hover': {
                     backgroundColor: '#f8f9fa',
                     color: '#5e72e4'
                   },
                   transition: 'all 0.2s ease'
                 }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Logout sx={{ 
                    fontSize: 18, 
                    color: 'inherit'
                  }} />
                </ListItemIcon>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Cerrar Sesión
                </Typography>
              </MenuItem>
            </Box>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              border: 'none'
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              border: 'none',
              boxShadow: '0 0 2rem 0 rgba(136, 152, 170, 0.15)'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
               <Box
           component="main"
           sx={{
             flexGrow: 1,
             p: 0,
             width: { sm: `calc(100% - ${drawerWidth}px)` },
             backgroundColor: '#f8f9fa',
             minHeight: '100vh'
           }}
         >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 