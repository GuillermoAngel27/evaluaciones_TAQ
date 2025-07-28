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

      <Container className="mt--7" fluid>
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Estadísticas</h3>
              </CardHeader>
              <CardBody>
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