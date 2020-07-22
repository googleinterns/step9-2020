import './Visualization.css';

import { Col, Container, Row } from 'react-grid-system';

import BarChart from './charts/BarChart';
import Geochart from './charts/Geochart';
import Interpolation from './charts/Interpolation';
import ScatterPlot from './charts/ScatterPlot';
import React from 'react';
import ZoomLine from './charts/ZoomLine';
import tardigrade from '../../images/tardigrade.png';

// Charts are presented as a grid, with each row containing one or many charts
const CHARTS_TABLE = [
  ['Zoomable Line'], // first row, 1 column
  ['Interpolation', 'Scatter Plot'], // second row, 2 columns
  ['Geochart'],
];

const Visualization = () => {
  const chartMap = {
    'Zoomable Line': <ZoomLine />,
    'Interpolation': <Interpolation />,
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