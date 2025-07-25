// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Suprimir warnings específicos durante las pruebas
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  const message = args[0];
  if (
    typeof message === 'string' && (
      message.includes("Support for defaultProps will be removed") ||
      message.includes("React does not recognize the `getDatasetAtEvent` prop")
    )
  ) {
    return;
  }
  originalConsoleWarn.apply(console, args);
}; 