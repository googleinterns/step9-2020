/**
 * Description: exports a react/victory object of 
 *              a scatterplot with the top X most prolific advertisers
 *              across 2018, 2019, 2020, as computed in `aggregates`
 *              firestore collection. 
 * Date: 7/21/2020
 * Author: Robbie Marcus
 */

import { database } from '../../../firebase/firebase';
import React, { useState, useEffect } from 'react';
import { stringToHexColor } from '../../../utils/Utils';
import { VictoryTheme, 
         VictoryScatter, 
         VictoryChart, 
         VictoryAxis, 
         VictoryTooltip, 
         VictoryLabel } from 'victory';

// Chart constants. 
const chartTitleX = 175; 
const chartTitleY = 30;
const domainStart = 2017;
const domainEnd = 2021;

/**
 * Turn a firestore snap into a victory formatted
 * json object that can be charted without further alteration.
 * @param {object} snap a firestore snap object
 * @param {string} year year corresponding to the relevant year. 
 * @return {object}
 */
function formatAdvertiserCountSnapshot(snap, year) {
  const numberOfAds = snap.data().numberOfAds;
  const advertiser = snap.id;

  const victoryFormattedAdvertiserCount = 
      {
        x: parseInt(year), 
        y: parseInt(numberOfAds), 
        fill: stringToHexColor(advertiser),
        label: `${advertiser} had ${numberOfAds} ads in ${year}.`
      };

  return victoryFormattedAdvertiserCount;
}

/**
 * Returns the exclusive bounds for the range of all data points being charted.
 * Uses the spread `...` operator.
 * `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax` 
 * @param {List[object]} victoryJsonList a list of objects in a victory-ready 
 *     format.
 * @returns {object}
 */
function getChartRange(victoryJsonList) {
  const ranges = victoryJsonList.map(json => json.y);

  return {min: Math.min(...ranges), max: Math.max(...ranges)};
}

/**
 * Custom react webhook. Currently calls `dev_aggregates` collection
 * and queries for the top `year`.
 * @param {string} year year to query
 * @param {int} limit maximum number of database documents to return
 * @return {object}
 */
function useAdvertisers(year, queryLimit) {
  const [advertisers, setAdvertisers] = useState([]);

  useEffect(() => {
      database.collection("dev_aggregates")
              .doc(year)
              .collection("advertisers")
              .orderBy("numberOfAds", "desc")
              .limit(queryLimit)
              .get()
              .then((snapshots) => {
        const newAdvertisers = snapshots.docs.map(snap => {
          return formatAdvertiserCountSnapshot(snap, year);
        });

        setAdvertisers(newAdvertisers);
      });
    }, [advertisers, year, queryLimit]);

    return advertisers;
  }

const ScatterPlot = () => {
  const queryLimit = 4; 
  
  const advertisers2018 = useAdvertisers("2018", queryLimit);
  const advertisers2019 = useAdvertisers("2019", queryLimit);
  const advertisers2020 = useAdvertisers("2020", queryLimit);
  
  const advertisers = [...advertisers2018,
                       ...advertisers2019,
                       ...advertisers2020];

  const range = getChartRange(advertisers);
  const chartTitle = `T${queryLimit} Most prolific ad words advertisers/year`;
  
  return (
    <VictoryChart
      theme={ VictoryTheme.material }
      domain={{ x: [domainStart, domainEnd], y: [range.min*.5, range.max*2] }}
      scale={{ y: "log" }}
    >
      <VictoryLabel
        text={ chartTitle }
        x={chartTitleX} y = {chartTitleY}
        textAnchor="middle"
      />

      <VictoryAxis tickValues = {[2018, 2019, 2020]} />

      <VictoryAxis dependentAxis
        tickValues = {[range.min, range.max]}
        label="# of ads (log scale)"
      />

      <VictoryScatter
        labelComponent={ <VictoryTooltip/> }
        labels={({ datum }) => datum.y }
        style={{ data: { fill: ({ datum }) => datum.fill }}}
        size={10}
        data={advertisers}
      />

    </VictoryChart>
  );
}

export default ScatterPlot;
