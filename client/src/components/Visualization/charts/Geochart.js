/**
 * Description: Geochart implements a Google Geochart component.
 * Author: Kira Toal
 * Date Created: 2020/07/21
 * Last Update: 2020/08/04
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

      // Data table row format: [state name, total state spend, tooltip].
      // The first column is the state to which the data is passed.
      // The value of the second column determines the state's color.
      // The third column is the string in the tooltip infobox.
      let dataTable = [["State", "Total Ad Spend (USD)", {type: 'string', role: 'tooltip'}]];

      let stateSpendPromises = [];
      let topAdvertiserPromises = [];

      for (let state of STATES) {

        // Fetches the total ad spend in each state.
        stateSpendPromises.push(database.collection(STATES_COLLECTION)
            .doc(state.toLowerCase())
            .get()
        );

        // Fetches the top advertiser by ad spend in each state.
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

          // Format total state ad spend as currency string.
          const stateSpend = stateTotal.data().totalStateSpend;
          const options = {style: 'currency', currency: 'USD'};
          const currencyFormat = new Intl.NumberFormat('en-US', options);
          const formattedStateSpend = currencyFormat.format(stateSpend);

          const tooltip = `Total Ad Spend (USD): ${formattedStateSpend}
                            Top Advertiser: ${topAdvertiser.docs[0].id}`;

          dataTable.push([stateTotal.id.toUpperCase(), stateSpend, tooltip]);
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
