/**
 * Description: Geochart implements a Google geochart component.
 * Author: Kira Toal
 * Date: 2020/07/13
 */

import { Chart } from "react-google-charts";
import firebase from '../../../firebase/firebase';
import React, { useState, useEffect } from 'react';
import { STATES } from '../../../constants/geochart_constants';
import { app, database } from '../../../firebase/firebase';

const Geochart = () => {

  const [adTotal, setAdTotal] = useState(0);
  const width = "700";
  const height = "400";

  /**
   * Get all of the IDs for a state
   */ 
  // async function doStuff() {
  //   let stateDataCollectionRef = database.collection('dev_states')
  //                                        .doc('california')
  //                                        .collection('stateData');
  //   let stateDataCollection = await stateDataCollectionRef.limit(1).get();
  //   for(const doc of stateDataCollection.docs){
  //     console.log(doc.id, '=>', doc.data().totalStateSpend);
  //   }
  // }
  // doStuff();

  // useEffect makes a Firestore query for the total number of ads targeted at each state.
  useEffect(() => {
    async function fetchStateTotals() {
      let data = [["State", "Total Ad Spend (USD)"]];
      //for (let state in STATES) {
        let stateDataCollectionRef = database.collection('dev_states')
                                              .doc('virginia')
                                              .collection('stateData');
        let stateDataCollection = await stateDataCollectionRef.get();
        for(const doc of stateDataCollection.docs){
          data.push(['Virginia', doc.data().totalStateSpend]); // Update data table.
        }
      //}
      setAdTotal(data);
    }
    fetchStateTotals();
  }, [])

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
      <Chart chartType="GeoChart" width={width} height={height} data={adTotal} options={options} />
    </div>
  );
};

export default Geochart;
