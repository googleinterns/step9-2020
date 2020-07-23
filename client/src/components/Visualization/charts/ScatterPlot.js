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
const CHART_TITLE_X = 175; 
const CHART_TITLE_Y = 30;
const DOMAIN_START = 2017;
const DOMAIN_END = 2021;

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
    async function getNumberOfAds(year, queryLimit) {
      let snapshots = await database.collection("aggregates")
                                    .doc(year)
                                    .collection("advertisers")
                                    .orderBy("numberOfAds", "desc")
                                    .limit(queryLimit)
                                    .get();
      let newAdvertisers = 
          snapshots.docs.map(snap => formatAdvertiserCountSnapshot(snap, year));
      
      setAdvertisers(newAdvertisers);
    }
    
    getNumberOfAds(year, queryLimit);
  }, [year, queryLimit]);

  return advertisers;
}

const ScatterPlot = () => {  
  const queryLimit = 10;

  const advertisers2018 = useAdvertisers("2018", queryLimit);
  const advertisers2019 = useAdvertisers("2019", queryLimit);
  const advertisers2020 = useAdvertisers("2020", queryLimit);

  const advertisers = [...advertisers2018,
                       ...advertisers2019,
                       ...advertisers2020];

  // If the advertisers list is empty upon the initial render
  // It will cause many errors with the pattern `Error: <line> attribute y1: Expected length, "NaN"`
  // This will check if advertisers is empty, in which case it will push 
  // An invisible (white) bubble to coordinates (1, 1).  
  if (advertisers.length === 0) {
    advertisers.push({ x: 1, y: 1, fill: '#fff', label: '' });
  }

  const range = getChartRange(advertisers);
  const chartTitle = `T${queryLimit} Most prolific ad words advertisers/year`;

  return (
    <VictoryChart
      theme={VictoryTheme.material}
      domain={{ x: [DOMAIN_START, DOMAIN_END], y: [range.min*.5, range.max*2] }}
      scale={{ y: "log" }}
    >
      <VictoryLabel
        text={chartTitle}
        x={CHART_TITLE_X} y = {CHART_TITLE_Y}
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
        size={5}
        data={advertisers}
      />

    </VictoryChart>
  );
}

export default ScatterPlot;
