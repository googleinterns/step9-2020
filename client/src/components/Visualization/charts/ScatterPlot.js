import { VictoryTheme, VictoryScatter, VictoryChart, VictoryAxis, VictoryTooltip, VictoryLabel } from 'victory';
import { database } from '../../../firebase/firebase';
import React, { useState, useEffect } from 'react';

/**
 * Creates a hexidecimal color string from a string input. 
 * Taken from here: `https://stackoverflow.com/a/16348977`.
 * Loosely cleaned up for style.
 * This *should* return a valid hash, but if it doesn't,
 * the browser will just display `#000`.
 * @param {string} str input string 
 * @return {string}
 */
function stringToColor(str) {
  let hash = 0;
  let hexColor = '#';

  // Compute a hash from the input string.
  for (let index = 0; index < str.length; index++) {
    hash = str.charCodeAt(index) + ((hash << 5) - hash);
  }
  
  // Compute a hex string from the hash.
  for (let index = 0; index < 3; index++) {
    let value = (hash >> (index * 8)) & 0xFF;
    hexColor += ('00' + value.toString(16)).substr(-2);
  }

  return hexColor;
}

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
  const victoryFormattedAdvertiserCount = {x: parseInt(year), 
                                           y: parseInt(numberOfAds), 
                                           fill: stringToColor(advertiser),
                                           label: `${advertiser} had ${numberOfAds} ads in ${year}.`};
  return victoryFormattedAdvertiserCount;
}

/**
 * Returns the exclusive bounds for the range of all data points being charted.
 * @param {List[object]} victoryJsonList a list of objects in a victory-ready 
 *     format.
 * @returns {object}
 */
function getChartRange(victoryJsonList) {
  const ranges = victoryJsonList.map(json => json.y);

  return {min: Math.min(...ranges), max: Math.max(...ranges)};
}

/**
 * 
 */
function useAdvertisers(year) {
  const [advertisers, setAdvertisers] = useState([]);

  useEffect(() => {
    database.collection("dev_aggregates")
            .doc(year)
            .collection("advertisers")
            .orderBy("numberOfAds", "desc")
            .limit(4)
            .get().then((snapshots) => {
      const newAdvertisers = snapshots.docs.map(snap => {
        return formatAdvertiserCountSnapshot(snap, year);
      });

      setAdvertisers(newAdvertisers);
    });
  }, []);

  return advertisers;
}

const ScatterPlot = () => {
  const advertisers2018 = useAdvertisers("2018");
  const advertisers2019 = useAdvertisers("2019");
  const advertisers2020 = useAdvertisers("2020");
  
  const advertisers = [...advertisers2018,
                       ...advertisers2019,
                       ...advertisers2020];

  const range = getChartRange(advertisers);
  
  return (
    <VictoryChart
      theme={VictoryTheme.material}
      domain={{ x: [2017, 2021], y: [range.min*.5, range.max*2] }}
      scale={{ y: "log" }}
    >
      <VictoryLabel
        text="T4 Most prolific ad words advertisers/year (hover for details)"
        x={175} y = {30}
        textAnchor="middle"
      />
      <VictoryAxis 
        tickValues = {[2018, 2019, 2020]}
      />
      <VictoryAxis 
        dependentAxis
        tickValues = {[range.min, range.max]}
        label="# of ads (log scale)"
      />
      <VictoryScatter
        labelComponent={<VictoryTooltip/>}
        labels={({ datum }) => datum.y}
        style={{ data: { fill: ({ datum }) => datum.fill}}}
        size={10}
        data={advertisers}
      />
    </VictoryChart>
  );
}

export default ScatterPlot;