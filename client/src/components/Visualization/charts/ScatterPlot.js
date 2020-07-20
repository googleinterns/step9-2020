import { VictoryTheme, VictoryScatter, VictoryChart, VictoryAxis, VictoryTooltip } from 'victory';
import React from 'react';

const ScatterPlot = () => (
  <VictoryChart
    theme={VictoryTheme.material}
    domain={{ x: [2017, 2021], y: [0, 7] }}
  >
  <VictoryAxis tickValues = {[2018, 2019, 2020]}/>
    <VictoryScatter
      labelComponent={<VictoryTooltip/>}
      style={{ data: { fill: "#c43a31" } }}
      size={7}
      data={[
        { x: 2018, y: 2, label: "ad one" },
        { x: 2019, y: 3, label: "another ad!" },
        { x: 2020, y: 5, label: "omg another one 🗿" }
      ]}
    />
  </VictoryChart>
)

export default ScatterPlot;