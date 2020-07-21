import { VictoryTheme, VictoryScatter, VictoryChart, VictoryAxis, VictoryTooltip, VictoryLabel } from 'victory';
import { database } from '../../../firebase/firebase';
import React, { useState, useEffect } from 'react';

function stringToColour(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = '#';
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}

function formatAdvertiserCountSnapshot(snap, year) {
  const numberOfAds = snap.data().numberOfAds;
  const advertiser = snap.id;
  const victoryFormattedAdvertiserCount = {x: parseInt(year), 
                                           y: parseInt(numberOfAds), 
                                           fill: stringToColour(advertiser),
                                           label: `${advertiser} had ${numberOfAds} ads in ${year}.`};
  return victoryFormattedAdvertiserCount;
}

function getChartRange(victoryJsonList) {
  const ranges = victoryJsonList.map(json => json.y);

  return {min: Math.min(...ranges), max: Math.max(...ranges)};
}

function useAdvertisers(year) {
  const [advertisers, setAdvertisers] = useState([]);

  useEffect(() => {
    database.collection("dev_aggregates")
            .doc(year)
            .collection("advertisers")
            .orderBy("numberOfAds", "desc")
            .limit(5)
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
        text="T5 Most prolific ad words advertisers/year (hover for details)"
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