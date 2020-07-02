import { Bar, VictoryBar, VictoryChart } from 'victory';

import PropTypes from 'prop-types';
import React from 'react';

const COLOR = 'tomato';

const BarChart = props => {
  const { data } = props;
  return (
    <div className="chart">
      <VictoryChart
        padding={120}
        height={600}
        width={800}
        scale={{ x: 'time' }}
      >
        <VictoryBar
          dataComponent={<Bar />}
          style={{ data: { fill: COLOR } }}
          data={data}
        />
      </VictoryChart>
    </div>
  );
};

BarChart.propTypes = {
  data: PropTypes.array,
};

export default BarChart;
