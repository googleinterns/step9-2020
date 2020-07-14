import './Visualization.css';

import { Col, Container, Row } from 'react-grid-system';

import BarChart from './charts/BarChart';
import Interpolation from './charts/Interpolation';
import React from 'react';
import ZoomLine from './charts/ZoomLine';
import Geochart from './charts/Geochart';
import tardigrade from '../../images/tardigrade.png';

const CHARTS_TABLE = [['Zoomable Line'], ['Interpolation', 'Vertical Bar'], ['Geochart']];

const Visualization = () => {
  const chartMap = {
    'Zoomable Line': <ZoomLine />,
    'Interpolation': <Interpolation />,
    'Vertical Bar': <BarChart />,
    'Geochart': <Geochart />,
  };

  return (
    <div className="search-header center">
      <img src={tardigrade} className="logo" alt="logo" />
      <Container>
        {CHARTS_TABLE.map((row, rowIndex) => (
          <Row key={rowIndex}>
            {row.map((col, colIndex) => (
              <Col key={colIndex}>
                <div className="chart-container">{chartMap[col]}</div>
              </Col>
            ))}
          </Row>
        ))}
      </Container>
    </div>
  );
};

export default Visualization;