/**
 * Description: Geochart implements a Google geochart component.
 * Author: Kira Toal
 * Date: 2020/07/13
 */

import React, { useEffect, useState } from 'react';
import firebase, { app, database } from '../../../firebase/firebase';

import { Chart } from 'react-google-charts';
import { states } from './StateDataParser';

const Geochart = () => {
  const [adTotal, setAdTotal] = useState(0);
  const WIDTH = '700';
  const HEIGHT = '400';

  class GeochartAd {
    constructor(id) {
      /**
       * @param {string} id
       */
      this.id = id;
    }
    toString() {
      return this.id;
    }
  }

  // Firestore data converter converts snapshots to custom objects.
  const adConverter = {
    toFirestore(ad) {
      return {
        id: ad.id,
      };
    },
    fromFirestore(snapshot, options) {
      const data = snapshot.data(options);
      return new GeochartAd(data.id);
    },
  };

  useEffect(async () => {
    const data = [['State', 'Total Number of Ads']];
    for (const state in states) {
      const documentRef = database.collection('ads');
      const query = await documentRef
        .where('geoTarget', 'array-contains', state)
        .withConverter(adConverter)
        .get();
      data.push([state, query.docs.length]); // Update data table.
    }
    setAdTotal(data);
  }, []);

  const options = {
    enableRegionInteractivity: true,
    legend: { textStyle: { color: 'black', fontSize: 10 } },
    resolution: 'provinces',
    region: 'US',
    tooltip: { trigger: 'focus' }, // Trigger info box on mouse hover over state.
  };

  return (
    <div className="search-header center">
      <p>Impressions Geochart</p>
      <Chart
        chartType="GeoChart"
        width={WIDTH}
        height={HEIGHT}
        data={adTotal}
        options={options}
      />
    </div>
  );
};

export default Geochart;
