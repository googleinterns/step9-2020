import { Chart } from "react-google-charts";
import React from 'react';

const Geochart = () => {

  const data = [
    ["State", "Random Number"],
    ["Alaska", 301],
    ["California", 200],
    ["Texas", 180],
    ["Wyoming", 28]
  ];

  const options = {
    legend: 'none',     
    resolution: 'provinces',
    region:'US',
    tooltip: {trigger:'none'}  
  };

  return (
    <div className="search-header center">
      <p>Hello</p>
      <Chart chartType="GeoChart" width="100%" height="400px" data={data} options={options}/>
    </div>
  );
};

export default Geochart;