import { VictoryTheme, VictoryScatter, VictoryChart, VictoryAxis, VictoryTooltip } from 'victory';
import { database } from '../../../firebase/firebase';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function formatAdvertiserCountSnapshot(snap, year) {
  const numberOfAds = snap.data().numberOfAds;
  const advertiser = snap.id;
  const victoryFormattedAdvertiserCount = {x: parseInt(year), 
                                           y: numberOfAds, 
                                           label: advertiser};
  
  return victoryFormattedAdvertiserCount;
}

function useAdvertisers() {
  const [advertisers, setAdvertisers] = useState([]);

  useEffect(() => {

    database.collection("dev_aggregates")
            .doc("2019")
            .collection("advertisers")
            .orderBy("numberOfAds", "desc")
            .limit(15)
            .get().then((snapshots) => {
      const newAdvertisers = snapshots.docs.map(snap => {
        return formatAdvertiserCountSnapshot(snap, "2019");
      });

      setAdvertisers(newAdvertisers);
    });
  }, []);

  return advertisers;
}
const ScatterPlot = () => {
  const advertisers = useAdvertisers();
  console.log("Advertisers looks like ", advertisers)
  return (
    <VictoryChart
      theme={VictoryTheme.material}
      domain={{ x: [2017, 2021], y: [0, 7] }}
    >
    <VictoryAxis tickValues = {[2018, 2019, 2020]}/>
      <VictoryScatter
        labelComponent={<VictoryTooltip/>}
        style={{ data: { fill: 'tomato' } }}
        size={7}
        data={/*[{ x: 2018, y: 2, label: "ad one" },
        { x: 2019, y: 3, label: "another ad!" },
        { x: 2020, y: 5, label: "omg another one 🗿" }]*/advertisers}
      />
    </VictoryChart>
  );
}


ScatterPlot.propTypes = {
  data: PropTypes.array,
};

export default ScatterPlot;