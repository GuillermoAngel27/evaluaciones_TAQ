import React from "react";
import { Spinner } from "reactstrap";

const LoadingSpinner = ({ size = "lg", color = "primary", text = "Cargando..." }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "200px" }}>
      <Spinner color={color} size={size} />
      <p className="mt-3 text-muted">{text}</p>
    </div>
  );
};

export default LoadingSpinner; 