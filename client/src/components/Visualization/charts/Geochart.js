/**
 * Description: Geochart implements a Google geochart component.
 * Author: Kira Toal
 * Date: 2020/07/13
 */

import { ads } from '../../../firebase/FirestoreDocumentReader';
import { Chart } from "react-google-charts";
import firebase from '../../../firebase/firebase';
import React, { useState, useEffect } from 'react';
import { states } from './StateDataParser';
import { app, database } from '../../../firebase/firebase';

const Geochart = () => {

  const [adTotal, setAdTotal] = useState(0);
  const width = "700px";
  const height = "400px";

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
    toFirestore: function(ad) {
      return {
        id: ad.id,
      }
    },
    fromFirestore: function(snapshot, options){
      const data = snapshot.data(options);
      return new GeochartAd(data.id)
    }
  }
    
  useEffect(async () => {
    let data = [["State", "Total Number of Ads"]];
    for (let state in states) {
      const documentRef = database.collection('ads');
      const query = await documentRef.where("geoTarget", "array-contains", state)
                                  .withConverter(adConverter)
                                  .get();
      data.push([state, query.docs.length]); // Update data table.
    }
    setAdTotal(data)
  }, [])

  const options = {
    enableRegionInteractivity: true,
    legend: {textStyle: {color: 'black', fontSize: 10}},     
    resolution: 'provinces',
    region:'US',
    tooltip: {trigger:'focus'} // Trigger info box on mouse hover over state.
  };

  let sampleData = [["State", "Number"], ["California", 100], ["Montana", 12]];

  return (
    <div className="search-header center">
      <p>Impressions Geochart</p>
      <Chart chartType="GeoChart" width={ width } height={ height } data={ adTotal } options={ options } />
    </div>
  );
};

export default Geochart;
