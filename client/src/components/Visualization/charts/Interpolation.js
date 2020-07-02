import React, { useState } from 'react';
import { VictoryChart, VictoryLine, VictoryScatter } from 'victory';

import PropTypes from 'prop-types';

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

const COLOR = 'tomato';

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

const Interpolation = props => {
  const { data } = props;
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
      <VictoryChart padding={120} polar={polar} height={600} width={900}>
        <VictoryLine
          interpolation={interpolation}
          data={data}
          style={{ data: { stroke: COLOR } }}
        />
        <VictoryScatter
          data={data}
          size={5}
          style={{ data: { fill: COLOR } }}
        />
      </VictoryChart>
    </div>
  );
};

Interpolation.propTypes = {
  data: PropTypes.array,
};

export default Interpolation;
