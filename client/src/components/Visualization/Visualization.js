import './Visualization.css';

import { Col, Container, Row } from 'react-grid-system';

import Geochart from './charts/Geochart';
import React from 'react';
import ScatterPlot from './charts/ScatterPlot';
import tardigrade from '../../images/tardigrade.png';

// Charts are presented as a grid, with each row containing one or many charts
const CHARTS_TABLE = [['Scatter Plot'], ['Geochart']];

const Visualization = () => {
  const chartMap = {
    'Scatter Plot': <ScatterPlot />,
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
