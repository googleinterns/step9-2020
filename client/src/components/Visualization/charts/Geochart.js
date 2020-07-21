/**
 * Description: Geochart implements a Google geochart component.
 * Author: Kira Toal
 * Date: 2020/07/13
 */

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

  async function doStuff() {
    const documentRef = database.collection('states').doc('california').collection('ads');
    const query = await documentRef.get();
    for (let doc in query) {
      console.log(doc.id, " => ", doc.data());
    }
  }
  doStuff();

  // database.collection('states').doc('california').collection('ads')
  //     .get()
  //     .then(function(querySnapshot) {
  //         querySnapshot.forEach(function(doc) {
  //             // doc.data() is never undefined for query doc snapshots
  //             console.log(doc.id, " => ", doc.data());
  //         });
  //     })
  //     .catch(function(error) {
  //         console.log("Error getting documents: ", error);
  //     });


  // async function doStuff() {
  //   const documentRef = database.collection('states').doc('california').collection('ads').doc('CALIFORNIA ALLIANCE FOR JOBS');
  //   const query = await documentRef.withConverter(adConverter).get();
  //   //for (let document in query) {
  //     console.log('query: ' + query.toString());
  //   //}
  // }

  //doStuff();

  // useEffect makes a Firestore query for the total number of ads targeted at each state.
  useEffect(() => {
    async function fetchData() {
      let data = [["State", "Total Number of Ads"]];
      for (let state in states) {
        const documentRef = database.collection('ads');
        const query = await documentRef.where("geoTarget", "array-contains", state)
                                       .withConverter(adConverter)
                                       .get();
        data.push([state, query.docs.length]); // Update data table.
      }
      setAdTotal(data)
    }
    fetchData();
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
