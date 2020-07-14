import { Chart } from "react-google-charts";
import React from 'react';

import firebase from '../../../utils/firebase';
import { ads, states } from '../../../utils/MakeQuery';


const Geochart = () => {

  // ads.then(x => {
  //   console.log(x);
  // })

  function getData() {
    let data = [["State", "Random Number"]];
    for (let state in states) {  
      data.push([state, Math.floor(Math.random() * Math.floor(1000))]);
    }
    return data;
  }

  const options = {
    enableRegionInteractivity: true,
    legend: 'none',     
    resolution: 'provinces',
    region:'US',
    tooltip: {trigger:'focus'}
  };

  return (
    <div className="search-header center">
      <p>Impressions Geochart</p>
      <Chart chartType="GeoChart" width="100%" height="400px" data={getData()} options={options} />
    </div>
  );
};

export default Geochart;