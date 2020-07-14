import { ads, states } from '../../../firebase/GetFirestoreDocuments';
import { Chart } from "react-google-charts";
import firebase from '../../../firebase/firebase';
import React from 'react';

const Geochart = () => {

  function getData() {
    let data = [["State", "Random Number"]];
    for (let state in states) {  
      data.push([state, Math.floor(Math.random() * Math.floor(1000))]);
    }
    return data;
  }

  const options = {
    enableRegionInteractivity: true,
    legend: {textStyle: {color: 'black', fontSize: 10}},     
    resolution: 'provinces',
    region:'US',
    tooltip: {trigger:'focus'} // Trigger info box on mouse hover over state.
  };

  return (
    <div className="search-header center">
      <p>Impressions Geochart</p>
      <Chart chartType="GeoChart" width="100%" height="400px" data={getData()} options={options} />
    </div>
  );
};

export default Geochart;