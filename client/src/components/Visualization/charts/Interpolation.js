import React, { useState } from 'react';
import { VictoryChart, VictoryLine, VictoryScatter } from 'victory';

import PropTypes from 'prop-types';

const data = [
  { x: 0, y: 0 },
  { x: 1, y: 2 },
  { x: 2, y: 1 },
  { x: 3, y: 4 },
  { x: 4, y: 3 },
  { x: 5, y: 5 },
];

const cartesianInterpolations = [
  'basis',
  'bundle',
  'cardinal',
  'catmullRom',
  'linear',
  'monotoneX',
  'monotoneY',
  'natural',
  'step',
  'stepAfter',
  'stepBefore',
];

const polarInterpolations = ['basis', 'cardinal', 'catmullRom', 'linear'];

const InterpolationSelect = ({ currentValue, values, onChange }) => (
  <select
    onChange={onChange}
    value={currentValue}
    style={{ width: 'fit-content' }}
  >
    {values.map(value => (
      <option value={value} key={value}>
        {value}
      </option>
    ))}
  </select>
);

InterpolationSelect.propTypes = {
  currentValue: PropTypes.string,
  values: PropTypes.array,
  onChange: PropTypes.func,
};

const Interpolation = () => {
  const [polar, setPolar] = useState(false);
  const [interpolation, setInterpolation] = useState('linear');

  return (
    <div className="chart">
      <InterpolationSelect
        currentValue={interpolation}
        values={polar ? polarInterpolations : cartesianInterpolations}
        onChange={e => setInterpolation(e.target.value)}
      />
      <input
        type="checkbox"
        id="polar"
        value={polar}
        onChange={event => {
          setPolar(event.target.checked);
          setInterpolation('linear');
        }}
        style={{ marginLeft: 25, marginRight: 5 }}
      />
      <label htmlFor="polar">polar</label>
      <VictoryChart polar={polar} height={390}>
        <VictoryLine
          interpolation={interpolation}
          data={data}
          style={{ data: { stroke: '#c43a31' } }}
        />
        <VictoryScatter
          data={data}
          size={5}
          style={{ data: { fill: '#c43a31' } }}
        />
      </VictoryChart>
    </div>
  );
};

export default Interpolation;
