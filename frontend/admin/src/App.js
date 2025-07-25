import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

// Components
import Layout from './components/Layout';
import Login from './pages/Login';

// Pages
import Dashboard from './pages/Dashboard';
import Locales from './pages/Locales';
import Estadisticas from './pages/Estadisticas';
import Evaluaciones from './pages/Evaluaciones';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppContent() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/locales" element={<Locales />} />
                  <Route path="/estadisticas" element={<Estadisticas />} />
                  <Route path="/evaluaciones" element={<Evaluaciones />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <AppContent />
        </Box>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
