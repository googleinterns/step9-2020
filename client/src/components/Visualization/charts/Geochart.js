/**
 * Description: Geochart implements a Google geochart component.
 * Author: Kira Toal
 * Date: 2020/07/13
 */

import { Chart } from 'react-google-charts';
import React from 'react';
import { ads } from '../../../firebase/FirestoreDocumentReader';
import firebase from '../../../firebase/firebase';
import { states } from './StateDataParser';

const Geochart = () => {
  /*
   * Currently, getData assigns a meaningless random number to each state.
   * In the future, once the states dictionary contains ad information, getData will
   *    retrieve information such as minimum ad impressions and maximum ad spend.
   */

  function getData() {
    const data = [['State', 'Random Number']];
    for (const state in states) {
      data.push([state, Math.floor(Math.random() * Math.floor(1000))]);
    }
    return data;
  }

  const options = {
    enableRegionInteractivity: true,
    legend: { textStyle: { color: 'black', fontSize: 10 } },
    resolution: 'provinces',
    region: 'US',
    tooltip: { trigger: 'focus' }, // Trigger info box on mouse hover over state.
  };

  return (
    <div className="search-header center">
      <p>Impressions Geochart</p>
      <Chart
        chartType="GeoChart"
        width="700px"
        height="400px"
        data={getData()}
        options={options}
      />
    </div>
  );
};

export default Geochart;
