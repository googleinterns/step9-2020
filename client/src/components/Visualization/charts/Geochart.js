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
      data.push([state, Math.floor(Math.random() * Math.floor(2000) + 500)]); // Update data table.
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
      <p>State Ad Totals Geochart</p>
      { adTotal.length > 0 ? <Chart chartType="GeoChart" 
                                    width={WIDTH} 
                                    height={HEIGHT} 
                                    data={adTotal} 
                                    options={options} /> 
          : <p>Loading State Ad Total Geochart...</p> }
    </div>
  );
};

export default Geochart;