/**
 * Description: Geochart implements a Google geochart component.
 * Author: Kira Toal
 * Date: 2020/07/13
 */

import { Chart } from "react-google-charts";
import React, { useState, useEffect } from 'react';
import { STATES } from '../../../constants/geochart_constants';
import { database } from '../../../firebase/firebase';

const Geochart = () => {

  const [adTotal, setAdTotal] = useState(0);
  const WIDTH = "700";
  const HEIGHT = "400";

  useEffect(() => {
    async function fetchStateTotals() {

      let data = [["State", "Total Ad Spend (USD)", {type: 'string', role: 'tooltip'}]];

      for (let state of STATES) {

        // Calculate state spend totals.
        let stateTotal = 0;
        let stateSpendData = await database.collection('dev_states')
                                           .doc(state.toLowerCase())
                                           .collection('stateData')
                                           .doc('spendData')
                                           .get();
        // Only add to total if present.
        if (stateSpendData.data()) {
          stateTotal = stateSpendData.data().totalStateSpend;
        }

        // Calculate top advertiser per state.
        let topAdvertiser = '';
        let advertiserCollectionRef = database.collection('dev_states')
                                              .doc(state.toLowerCase())
                                              .collection('advertisers')
                                              .orderBy('totalAdvertiserSpend')
                                              .limit(1);
        let topAdvertiserCollection = await advertiserCollectionRef.get();
        // Only add to total if present.
        if (topAdvertiserCollection.docs[0]) {
          topAdvertiser = topAdvertiserCollection.docs[0].id;   
        }

        const tooltip = `Total Ad Spend (USD): ${stateTotal} \nTop Advertiser: ${topAdvertiser}`;
        data.push([state, stateTotal, tooltip]); 
      }

      setAdTotal(data); // Update data table.
    }
    fetchStateTotals();
  }, [])

  const options = {
    legend: {textStyle: {color: 'black', fontSize: 10}},     
    resolution: 'provinces',
    region:'US',
    tooltip: {trigger:'focus'} // Trigger info box on mouse hover over state.
  };

  return (
    <div className="search-header center">
      <p>Ad Spend Geochart</p>
      { adTotal.length > 0 ? <Chart chartType="GeoChart" 
                                    width={WIDTH} 
                                    height={HEIGHT} 
                                    data={adTotal} 
                                    options={options} /> 
      : <p>Loading Ad Spend Geochart...</p> }
    </div>
  );
};

export default Geochart;
