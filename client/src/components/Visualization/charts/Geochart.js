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
  const [state, setState] = useState('');
  const width = "700";
  const height = "400";

  useEffect(() => {
    async function fetchStateTotals() {

      let data = [["State", "Total Ad Spend (USD)", {type: 'string', role: 'tooltip'}]];

      for (let state of STATES) {
        const stateTotal = 0;
        let stateDataCollectionRef = database.collection('dev_states')
                                              .doc(state.toLowerCase())
                                              .collection('stateData');
        let stateDataCollection = await stateDataCollectionRef.get();
        for (const doc of stateDataCollection.docs){
          stateTotal = doc.data().totalStateSpend;
        }

        let topAdvertiser = '';
        let topAdvertiserSpend = 0;
        let advertiserCollectionRef = database.collection('dev_states')
                                              .doc(state.toLowerCase())
                                              .collection('advertisers')
                                              .orderBy('totalAdvertiserSpend')
                                              .limit(1);
        let topAdvertiserCollection = await advertiserCollectionRef.get();
        for (const doc of topAdvertiserCollection.docs){
          topAdvertiser = doc.id;
          topAdvertiserSpend = doc.data().totalAdvertiserSpend;
        }

        data.push([state, stateTotal, 
            "Total Ad Spend (USD): " + stateTotal +
            "\nTop Advertiser: " + topAdvertiser +
            "\nTop Advertiser Total Spend: " + topAdvertiserSpend]); 
      }

      setAdTotal(data); // Update data table.
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
      <p>Ad Spend Geochart</p>
      { adTotal.length > 0 ? <Chart chartType="GeoChart" 
                                    width={width} 
                                    height={height} 
                                    data={adTotal} 
                                    options={options} /> 
      : <p>Loading Ad Spend Geochart...</p> }
      <p>Click on a state to view the top advertisers by total ad spend.</p>   

    </div>
  );
};

export default Geochart;
