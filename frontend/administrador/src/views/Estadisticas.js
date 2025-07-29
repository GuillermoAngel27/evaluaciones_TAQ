import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
} from "reactstrap";

const Estadisticas = () => {
  return (
    <>
      <div className="header pb-8 pt-5 pt-md-8" style={{ background: 'linear-gradient(135deg, #5A0C62 0%, #DC017F 100%)' }}>
        <Container fluid>
          <div className="header-body">
            <Row>
              <Col>
                <h6 className="h2 text-white d-inline-block mb-0"></h6>
              </Col>
            </Row>
          </div>
        </Container>
      </div>

      <Container className="mt--8" fluid>
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Estadísticas</h3>
              </CardHeader>
              <CardBody>
                
                
                
                {/* Filtros y búsqueda */}
                <Row className="mb-4 g-3">
                  {/* Buscar - Ocupa todo el ancho en móviles y tablets verticales */}
                  <Col xs="12" sm="12" md="12" lg="6" xl="6">
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Buscar estadísticas..."
                        className="form-control form-control-alternative"
                        disabled
                      />
                    </div>
                  </Col>
                  
                  {/* Filtro - Mitad en móviles, lado a lado en tablets */}
                  <Col xs="6" sm="6" md="6" lg="3" xl="3">
                    <div className="form-group">
                      <select
                        className="form-control form-control-alternative"
                        disabled
                        style={{
                          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                          border: '2px solid #e9ecef',
                          borderRadius: '12px',
                          padding: '12px 16px',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#495057',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                          transition: 'all 0.3s ease',
                          cursor: 'not-allowed',
                          width: '100%'
                        }}
                      >
                        <option>📊 Filtros</option>
                      </select>
                    </div>
                  </Col>
                  
                  {/* Botón Limpiar - Ancho completo en móviles y tablets */}
                  <Col xs="6" sm="6" md="6" lg="3" xl="3">
                    <button
                      className="btn btn-secondary btn-block"
                      disabled
                      style={{ width: '100%' }}
                    >
                      🔄 Limpiar
                    </button>
                  </Col>
                </Row>

                <div className="text-center py-5">
                  <h4 className="text-muted">Contenido movido a Dashboard</h4>
                  <p className="text-muted">
                    Todo el contenido de estadísticas se ha movido a la página de Dashboard para una mejor organización.
                  </p>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Estadisticas; 