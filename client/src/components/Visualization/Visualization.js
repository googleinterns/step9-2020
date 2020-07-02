import './Visualization.css';

import {
  CHART_TYPES,
  X_VALUES,
  Y_VALUES,
} from '../../constants/visualization_constant';
import React, { useState } from 'react';

import BarChart from './charts/BarChart';
import Interpolation from './charts/Interpolation';
import PropTypes from 'prop-types';
import ZoomLine from './charts/ZoomLine';
import tardigrade from '../../images/tardigrade.png';

const CustomSelect = props => {
  const { label, value, list, setFunction } = props;

  return (
    <div className={`container${label !== 'y-axis' ? ' margin-right' : ''}`}>
      <label>{label}</label>
      <select value={value} onChange={e => setFunction(e.target.value)}>
        {list.map((item, index) => (
          <option value={item} key={index}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};

CustomSelect.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  list: PropTypes.array,
  setFunction: PropTypes.func,
};

const Visualization = () => {
  const [chartType, setChartType] = useState('Zoomable Line');
  const [x, setX] = useState('USD Spent');
  const [y, setY] = useState('Time');

  const chartMap = {
    'Zoomable Line': <ZoomLine />,
    Interpolation: <Interpolation />,
    'Vertical Bar': <BarChart />,
  };

  return (
    <div className="container">
      <header className="search-header center">
        <img src={tardigrade} className="logo" alt="logo" />
        <div className="search-body">
          <CustomSelect
            label={'chart types'}
            value={chartType}
            list={CHART_TYPES}
            setFunction={setChartType}
          />
          <CustomSelect
            label={'x-axis'}
            value={x}
            list={X_VALUES}
            setFunction={setX}
          />
          <CustomSelect
            label={'y-axis'}
            value={y}
            list={Y_VALUES}
            setFunction={setY}
          />
        </div>
      </header>
      <div className="center">{chartMap[chartType]}</div>
    </div>
  );
};

export default Visualization;
