import 'react-input-range/lib/css/index.css';
import './RangeSlider.css';

import React, { useState } from 'react';

import InputRange from 'react-input-range';

const RangeSlider = () => {
  const [value, setValue] = useState({ min: 20000, max: 80000 });

  return (
    <InputRange
      maxValue={100000}
      minValue={0}
      value={value}
      onChange={newValue => setValue(newValue)}
      step={1000}
    />
  );
};

export default RangeSlider;
