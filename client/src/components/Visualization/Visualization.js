import './Visualization.css';

import { Col, Container, Row } from 'react-grid-system';

import BarChart from './charts/BarChart';
import Interpolation from './charts/Interpolation';
import React from 'react';
import ZoomLine from './charts/ZoomLine';
import tardigrade from '../../images/tardigrade.png';

const Visualization = () => {
  const chartMap = {
    'Zoomable Line': <ZoomLine />,
    Interpolation: <Interpolation />,
    'Vertical Bar': <BarChart />,
  };

  return (
    <div className="search-header center">
      <img src={tardigrade} className="logo" alt="logo" />
      <Container>
        <Row>
          <Col sm={3}>
            <div className="card">{chartMap['Vertical Bar']}</div>
          </Col>
          <Col>
            <div className="card">{chartMap['Zoomable Line']}</div>
          </Col>
          <Col sm={3}>
            <div className="card">{chartMap['Vertical Bar']}</div>
          </Col>
        </Row>
        <Row>
          <Col sm={3}>
            <div className="card">{chartMap['Vertical Bar']}</div>
          </Col>
          <Col sm={3}>
            <div className="card">{chartMap['Vertical Bar']}</div>
          </Col>
          <Col sm={3}>
            <div className="card">{chartMap['Vertical Bar']}</div>
          </Col>
          <Col sm={3}>
            <div className="card">{chartMap['Vertical Bar']}</div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Visualization;
