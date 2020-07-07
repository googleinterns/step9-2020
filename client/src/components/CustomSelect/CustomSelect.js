import PropTypes from 'prop-types';
import React from 'react';

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

export default CustomSelect;
