// Supresor de warnings más agresivo
export const suppressWarnings = () => {
  // Interceptar console.warn antes de que React se inicialice
  const originalWarn = console.warn;
  const originalError = console.error;
  const originalLog = console.log;

  // Función para detectar warnings problemáticos
  const isProblematicWarning = (message) => {
    if (typeof message !== 'string') return false;
    
    const problematicPatterns = [
      /Support for defaultProps will be removed/,
      /React Router Future Flag Warning/,
      /React does not recognize the `getDatasetAtEvent` prop/,
      /Warning: .*: Support for defaultProps/,
      /Warning: .*: Support for/,
      /Warning: .*: /,
      /Warning: /,
      /defaultProps/,
      /React Router/,
      /getDatasetAtEvent/,
      /Spinner:/,
      /Sidebar:/,
      /Navbar:/,
      /Container:/,
      /Card:/,
      /Button:/,
      /Input:/,
      /Modal:/,
      /Table:/,
      /Progress:/,
      /Badge:/,
      /Tooltip:/,
      /Alert:/,
      /Dropdown:/,
      /Pagination:/,
      /FormGroup:/,
      /Row:/,
      /Col:/,
      /Nav:/,
      /NavItem:/,
      /NavbarBrand:/,
      /InputGroup:/,
      /InputGroupText:/,
      /CardBody:/,
      /CardHeader:/,
      /CardTitle:/,
      /UncontrolledTooltip:/,
      /LoadingSpinner:/,
      /ProtectedRoute:/,
      /Admin:/,
      /AuthProvider:/
    ];

    return problematicPatterns.some(pattern => pattern.test(message));
  };

  // Sobrescribir console.warn
  console.warn = function(...args) {
    if (!isProblematicWarning(args[0])) {
      originalWarn.apply(console, args);
    }
  };

  // Sobrescribir console.error
  console.error = function(...args) {
    if (!isProblematicWarning(args[0])) {
      originalError.apply(console, args);
    }
  };

  // Sobrescribir console.log (por si acaso)
  console.log = function(...args) {
    if (!isProblematicWarning(args[0])) {
      originalLog.apply(console, args);
    }
  };

  // También interceptar window.console para mayor compatibilidad
  if (typeof window !== 'undefined') {
    window.console.warn = console.warn;
    window.console.error = console.error;
    window.console.log = console.log;
  }
};

// Ejecutar inmediatamente
suppressWarnings(); 