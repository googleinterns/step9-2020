/**
 * Description: Geochart implements a Google geochart component.
 * Author: Kira Toal
 * Date: 2020/21/13
 */
import { Chart } from "react-google-charts";
import React, { useState, useEffect } from 'react';
import { STATES } from '../../../constants/geochart_constants';
import { database } from '../../../firebase/firebase';

const Geochart = () => {
  const STATES_COLLECTION = 'dev_states';
  const [adTotal, setAdTotal] = useState(0);
  const WIDTH = '700';
  const HEIGHT = '400';

  useEffect(() => {
    async function fetchStateTotals() {
      /* 
      dataTable is read by the Chart component into Geochart format.
      The states are colored according to the value in the second column of
        the table ("Total Ad Spend (USD)").
      The first column (state name) and third column (info on total state ad 
        spend and top advertiser) are shown in the tooltip.
      */ 
      let dataTable = [["State", "Total Ad Spend (USD)", {type: 'string', role: 'tooltip'}]];
      for (let state of STATES) {
        
        // Calculate state spend totals.
        let stateTotal = 0;
        let stateSpendData = await database.collection(STATES_COLLECTION)
                                           .doc(state.toLowerCase())
                                           .get();
        
        // Only add to total if present.
        if (stateSpendData.data() !== undefined) {
          stateTotal = stateSpendData.data().totalStateSpend;
        }

        // Calculate top advertiser per state.
        let topAdvertiser = '';
        let advertiserCollectionRef = database.collection(STATES_COLLECTION)
                                              .doc(state.toLowerCase())
                                              .collection('advertisers')
                                              .orderBy('totalAdvertiserSpend')
                                              .limit(1);
        let topAdvertiserCollection = await advertiserCollectionRef.get();
        
        // Only add to total if present.
        if (topAdvertiserCollection.docs[0] !== undefined) {
          topAdvertiser = topAdvertiserCollection.docs[0].id;   
        }

        const tooltip = `Total Ad Spend (USD): ${stateTotal} \nTop Advertiser: ${topAdvertiser}`;
        dataTable.push([state, stateTotal, tooltip]); 
      }
      setAdTotal(dataTable); // Update data table.
    }
    fetchStateTotals();
  }, [])

  const options = {
    legend: {textStyle: {color: 'black', fontSize: 10}},     
    resolution: 'provinces',
    region: 'US',
    tooltip: { trigger: 'focus' }, // Trigger info box on mouse hover over state.
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
