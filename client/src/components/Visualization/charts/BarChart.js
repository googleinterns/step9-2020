import { Bar, VictoryBar, VictoryChart } from 'victory';

import React from 'react';
import { generateRandomHexColor } from '../../../utils/Utils';

const BarChart = () => (
  <div className="chart">
    <VictoryChart
      height={500}
      width={500}
      domainPadding={{ x: 50, y: [0, 20] }}
      scale={{ x: 'time' }}
    >
      <VictoryBar
        dataComponent={<Bar />}
        style={{ data: { fill: generateRandomHexColor() } }}
        data={[
          { x: new Date(1986, 1, 1), y: 2 },
          { x: new Date(1996, 1, 1), y: 3 },
          { x: new Date(2006, 1, 1), y: 5 },
          { x: new Date(2016, 1, 1), y: 4 },
        ]}
      />
    </VictoryChart>
  </div>
);

export default BarChart;
