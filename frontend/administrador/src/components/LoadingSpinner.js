import React from "react";
import { Spinner } from "reactstrap";

const LoadingSpinner = ({ size = "lg", color = "primary", text = "Cargando...", animationType = "default" }) => {
  // Estilos CSS personalizados
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes customPulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.1); opacity: 0.7; }
        100% { transform: scale(1); opacity: 1; }
      }

      @keyframes gradientRotate {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      @keyframes dots {
        0%, 20% { opacity: 0; transform: translateY(0); }
        50% { opacity: 1; transform: translateY(-10px); }
        80%, 100% { opacity: 0; transform: translateY(0); }
      }

      .custom-pulse-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #5A0C62;
        border-radius: 50%;
        animation: customPulse 1.5s ease-in-out infinite;
      }

      .gradient-spinner {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(45deg, #5A0C62, #DC017F, #5A0C62);
        background-size: 200% 200%;
        animation: gradientRotate 2s ease infinite;
      }

      .dots-spinner {
        display: flex;
        gap: 8px;
        justify-content: center;
      }

      .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: linear-gradient(135deg, #5A0C62 0%, #DC017F 100%);
        animation: dots 1.4s ease-in-out infinite;
      }

      .dot:nth-child(2) { animation-delay: 0.2s; }
      .dot:nth-child(3) { animation-delay: 0.4s; }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const renderSpinner = () => {
    switch (animationType) {
      case 'pulse':
        return <div className="custom-pulse-spinner" />;
      case 'gradient':
        return <div className="gradient-spinner" />;
      case 'dots':
        return (
          <div className="dots-spinner">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        );
      default:
        return <Spinner color={color} size={size} />;
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "200px" }}>
      {renderSpinner()}
      <p className="mt-3 text-muted">{text}</p>
    </div>
  );
};

export default LoadingSpinner; 