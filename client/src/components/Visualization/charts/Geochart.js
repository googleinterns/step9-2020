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

  class GeochartAd {
    constructor(id, impressionsMin) {
    /**
    * @param {string} id
    * @param {long} impressionsMin
    */
      this.id = id;
      this.impressionsMin = impressionsMin;
    }
    toString() {
      return this.id + ', ' + this.impressionsMin;
    }
  }

  // Firestore data converter converts snapshots to custom objects.
  const adConverter = {
    toFirestore: function(ad) {
      return {
        id: ad.id,
        impressionsMin: ad.impressionsMin,
      }
    },
    fromFirestore: function(snapshot, options){
      const data = snapshot.data(options);
      return new GeochartAd(data.id, data.impressionsMin)
    }
  }
    
  useEffect(
    async () => {
    let data = [["State", "Random Number"]];
    for (let state in states) {
      const documentRef = database.collection('ads');
      const query = await documentRef.where("geoTarget", "array-contains", state)
                                  .withConverter(adConverter)
                                  .get();
      data.push([state, query.docs.length]); // Update data table.
    }
    console.log(data);
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
      <Chart chartType="GeoChart" width="700px" height="400px" data={ adTotal } options={ options } />
    </div>
  );
};

export default Geochart;


/**
 * Description: Geochart implements a Google geochart component.
 * Author: Kira Toal
 * Date: 2020/07/13
 */

// import { Chart } from 'react-google-charts';
// import React from 'react';
// import { ads } from '../../../firebase/FirestoreDocumentReader';
// import firebase from '../../../firebase/firebase';
// import { useState, useEffect } from 'react';
// import { states } from './StateDataParser';
// import { app, database } from '../../../firebase/firebase';


// const Geochart = () => {
//   const [adTotal, setAdTotal] = useState(0);

//   class GeochartAd {
//     constructor(id, impressionsMin) {
//     /**
//     * @param {string} id
//     * @param {long} impressionsMin
//     */
//       this.id = id;
//       this.impressionsMin = impressionsMin;
//     }
//     toString() {
//       return this.id + ', ' + this.impressionsMin;
//     }
//   }

//   // Firestore data converter converts snapshots to custom objects.
//   const adConverter = {
//     toFirestore: function(ad) {
//       return {
//         id: ad.id,
//         impressionsMin: ad.impressionsMin,
//       }
//     },
//     fromFirestore: function(snapshot, options) {
//       const data = snapshot.data(options);
//       return new GeochartAd(data.id, data.impressionsMin)
//     }
//   }

//   /*
//    * Currently, getData assigns a meaningless random number to each state.
//    * In the future, once the states dictionary contains ad information, getData will
//    *    retrieve information such as minimum ad impressions and maximum ad spend.
//    */

//   function getData() {
//     const data = [['State', 'Random Number']];
//     for (const state in states) {
//       data.push([state, Math.floor(Math.random() * Math.floor(1000))]);
//     }
//   }
 
//   useEffect(async () => {
//     let data = [["State", "Random Number"]];
//     for (let state in states) {
//       const documentRef = database.collection('ads');
//       const query = await documentRef.where("geoTarget", "array-contains", state)
//                                   // .withConverter(adConverter)
//                                   .get();
//       data.push([state, query.docs.length]); // Update data table.
//     }
//     console.log(data);
//     setAdTotal(data)
//   }, [])

//   const options = {
//     enableRegionInteractivity: true,
//     legend: { textStyle: { color: 'black', fontSize: 10 } },
//     resolution: 'provinces',
//     region: 'US',
//     tooltip: { trigger: 'focus' }, // Trigger info box on mouse hover over state.
//   };

//   let sampleData = [["State", "Number"], ["California", 100], ["Montana", 12]];

//   return (
//     <div className="search-header center">
//       <p>Impressions Geochart</p>
//       <Chart
//         chartType="GeoChart"
//         width="700px"
//         height="400px"
//         data={getData()}
//         options={options}
//       />
//     </div>
//   );
// };

// export default Geochart;
