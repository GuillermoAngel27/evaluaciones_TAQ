// Supresor específico para errores de red de login
export const suppressNetworkErrors = () => {
  if (typeof window === 'undefined') return;

  // Interceptar y suprimir mensajes de error de red específicos
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  const originalConsoleLog = console.log;

  // Función para verificar si es un error de login que debe suprimirse
  const shouldSuppressLoginError = (message) => {
    if (typeof message !== 'string') return false;
    
    const suppressPatterns = [
      /XHRPOST.*\/auth\/login/,
      /HTTP\/1\.1 401.*\/auth\/login/,
      /POST.*\/auth\/login.*401/,
      /Failed to fetch.*\/auth\/login/,
      /Network Error.*\/auth\/login/
    ];
    
    return suppressPatterns.some(pattern => pattern.test(message));
  };

  // Función para verificar si es un error de red general que debe suprimirse
  const shouldSuppressNetworkError = (message) => {
    if (typeof message !== 'string') return false;
    
    const networkErrorPatterns = [
      /XHRPOST/,
      /HTTP\/1\.1 401/,
      /Failed to fetch/,
      /Network Error/,
      /401.*Unauthorized/
    ];
    
    return networkErrorPatterns.some(pattern => pattern.test(message));
  };

  // Sobrescribir console.error
  console.error = function(...args) {
    const message = args.join(' ');
    
    // Suprimir errores de login específicos
    if (shouldSuppressLoginError(message)) {
      return; // No mostrar el error
    }
    
    // Suprimir errores de red generales en páginas de login
    if (shouldSuppressNetworkError(message)) {
      const currentPath = window.location.pathname;
      const isLoginPage = currentPath.includes('/l/login') || currentPath.includes('/login');
      
      if (isLoginPage) {
        return; // No mostrar el error en páginas de login
      }
    }
    
    // Mostrar otros errores normalmente
    originalConsoleError.apply(console, args);
  };

  // Sobrescribir console.warn
  console.warn = function(...args) {
    const message = args.join(' ');
    
    // Suprimir warnings de login específicos
    if (shouldSuppressLoginError(message)) {
      return; // No mostrar el warning
    }
    
    // Suprimir warnings de red generales en páginas de login
    if (shouldSuppressNetworkError(message)) {
      const currentPath = window.location.pathname;
      const isLoginPage = currentPath.includes('/l/login') || currentPath.includes('/login');
      
      if (isLoginPage) {
        return; // No mostrar el warning en páginas de login
      }
    }
    
    // Mostrar otros warnings normalmente
    originalConsoleWarn.apply(console, args);
  };

  // Sobrescribir console.log
  console.log = function(...args) {
    const message = args.join(' ');
    
    // Suprimir logs de login específicos
    if (shouldSuppressLoginError(message)) {
      return; // No mostrar el log
    }
    
    // Mostrar otros logs normalmente
    originalConsoleLog.apply(console, args);
  };

  // Interceptar errores no capturados
  const originalOnError = window.onerror;
  window.onerror = function(message, source, lineno, colno, error) {
    if (shouldSuppressLoginError(message) || shouldSuppressNetworkError(message)) {
      return true; // Prevenir que el error se muestre
    }
    
    if (originalOnError) {
      return originalOnError(message, source, lineno, colno, error);
    }
    return false;
  };

  // Interceptar promesas rechazadas no manejadas
  const originalOnUnhandledRejection = window.onunhandledrejection;
  window.onunhandledrejection = function(event) {
    const message = event.reason?.message || event.reason?.toString() || '';
    
    if (shouldSuppressLoginError(message) || shouldSuppressNetworkError(message)) {
      event.preventDefault(); // Prevenir que el error se muestre
      return;
    }
    
    if (originalOnUnhandledRejection) {
      originalOnUnhandledRejection(event);
    }
  };

  // Interceptar XMLHttpRequest para suprimir errores de login
  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSend = XMLHttpRequest.prototype.send;
  
  XMLHttpRequest.prototype.open = function(method, url, ...args) {
    this._isLoginRequest = url && url.includes('/auth/login');
    return originalXHROpen.call(this, method, url, ...args);
  };
  
  XMLHttpRequest.prototype.send = function(...args) {
    if (this._isLoginRequest) {
      // Para peticiones de login, suprimir el registro automático de errores
      this.addEventListener('error', (e) => {
        e.stopPropagation();
      }, true);
      
      this.addEventListener('load', (e) => {
        if (this.status === 401) {
          // Suprimir el mensaje de error 401 para login
          e.stopPropagation();
        }
      }, true);
    }
    return originalXHRSend.call(this, ...args);
  };
};

// Ejecutar inmediatamente
suppressNetworkErrors(); 