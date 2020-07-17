/** 
 * Description: Geochart implements a Google geochart component.
 * Author: Kira Toal
 * Date: 2020/07/13
 */

import { ads } from '../../../firebase/FirestoreDocumentReader';
import { Chart } from "react-google-charts";
import firebase from '../../../firebase/firebase';
import React from 'react';
import { states } from './StateDataParser';
import { app, database } from '../../../firebase/firebase';


const Geochart = () => {

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

  async function getAdTotal(state) {
    let documentRef = database.collection('ads');
    let activeRef = await documentRef.where("geoTarget", "array-contains", state)
                                     .withConverter(adConverter)
                                     .get();
    let i = 0;
    for (const ad of activeRef.docs) {
      // console.log(ad.id);
      i++;
    }      
    return i; 
  }

  async function killme() {
    const users = await getAdTotal("Nevada");
    console.log(users);
  }

  killme();

  // console.log(getAdTotal());


  // console.log(getAdTotal("California").value);


  function getNumberOfAds(data, state) {
    database.collection("ads").where("geoTarget", "array-contains", state).withConverter(adConverter)
      .get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              // console.log(doc.id, " => ", doc.data());
          });
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });
  }

  /*
   * Currently, getData assigns a meaningless random number to each state.
   * In the future, once the states dictionary contains ad information, getData will
   *    retrieve information such as minimum ad impressions and maximum ad spend.
   */ 
  function getData() {
    let data = [["State", "Random Number"]];
    // console.log(getNumberOfAds("California"));
    for (let state in states) {
      // console.log(state + "  " + AAA(state));
      getNumberOfAds(data, state);
      // data.push([state, Math.floor(Math.random() * Math.floor(1000))]);
    }
    return data;
  }

  const options = {
    enableRegionInteractivity: true,
    legend: {textStyle: {color: 'black', fontSize: 10}},     
    resolution: 'provinces',
    region:'US',
    tooltip: {trigger:'focus'} // Trigger info box on mouse hover over state.
  };

  return (
    <div className="search-header center">
      <p>Impressions Geochart</p>
      <Chart chartType="GeoChart" width="700px" height="400px" data={getData()} options={options} />
    </div>
  );
};

export default Geochart;