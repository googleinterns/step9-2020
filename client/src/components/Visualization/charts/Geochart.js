/**
 * Description: Geochart implements a Google geochart component.
 * Author: Kira Toal
 * Date: 2020/07/21
 */
import { Chart } from "react-google-charts";
import React, { useState, useEffect } from 'react';
import { STATES } from '../../../constants/geochart_constants';
import { database } from '../../../firebase/firebase';

const Geochart = () => {
  const STATES_COLLECTION = 'states';
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

      let stateSpendPromises = [];
      let topAdvertiserPromises = [];

      for (let state of STATES) {
        stateSpendPromises.push(database.collection(STATES_COLLECTION)
            .doc(state.toLowerCase())
            .get()
        );
        topAdvertiserPromises.push(database.collection(STATES_COLLECTION)
            .doc(state.toLowerCase())
            .collection('advertisers')
            .orderBy('totalAdvertiserSpend')
            .limit(1)
            .get()
        );
      }

      let stateResults = await Promise.all(stateSpendPromises);
      let advertiserResults = await Promise.all(topAdvertiserPromises);
      const zippedResults = stateResults.map((e, i) => [e, advertiserResults[i]]);

      for (let [stateTotal, topAdvertiser] of zippedResults) {
        if (stateTotal.data() !== undefined) {  
          const tooltip = `Total Ad Spend (USD): ${stateTotal.data().totalStateSpend}
              Top Advertiser: ${topAdvertiser.docs[0].id}`;
          dataTable.push([stateTotal.id.toUpperCase(), stateTotal.data().totalStateSpend, tooltip]); 
        }
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
      <h2>State Ad Spend Geochart</h2>
      <p>
        Hover over a state to view how much was spent on
        Google Political Ads in that state from 2018-2020.
      </p>
      {adTotal.length > 0 ? (
        <Chart
          chartType="GeoChart"
          width={WIDTH}
          height={HEIGHT}
          data={adTotal}
          options={options}
        />
      ) : (
        <p>Loading State Ad Spend Geochart...</p>
      )}
    </div>
  );
};

export default Geochart;
