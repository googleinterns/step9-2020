/**
 * Description: Cloud functions for DEV count advertisers . 
 * Author: Robert Marcus
 * Date: July 7, 2020
 */

// Import links to firebase dev databases 
const { DEV_ADS_DOCS } = require('../firebaseConfig');

// Import links to firebase dev advertisers collections
// These are used to write directly to a collection
const { DEV_AGGREGATES_COLLECTION, FieldValue } = require('./countAdvertisersConfig');

// Import helper functions
const { updateAdvertiserCount } = require('./countAdvertisersHelpers');

exports.devNewAd = 
  DEV_ADS_DOCS.onCreate(snapshot => {
      const data = snapshot.data();
      const advertiser = data.advertiser;
      const startDate = data.startDate;
      const startYear = startDate.slice(0, 4);

      const aggregateRef = 
          DEV_AGGREGATES_COLLECTION.doc(startYear)
                                   .collection("advertisers")
                                   .doc(advertiser);
      
      aggregateRef.get().then(function(doc) {
        if (doc.exists) {
          return aggregateRef.update({numberOfAds: FieldValue.increment(1)});
        } else {
          return aggregateRef.set({numberOfAds: 1});
        }
      }).catch(err => console.log(err));
    });

exports.devDeleteAd = 
    DEV_ADS_DOCS.onDelete(snapshot => {
      const data = snapshot.data();
      const advertiser = data.advertiser;
      const startDate = data.startDate;
      const startYear = startDate.slice(0, 4);

      const aggregateRef =          
          DEV_AGGREGATES_COLLECTION.doc(startYear)
                                   .collection("advertisers")
                                   .doc(advertiser);

      aggregateRef.get().then(function(doc) {
        if (doc.exists) {
          return aggregateRef.update({numberOfAds: FieldValue.increment(-1)});
        }
        return;
      }).catch(err => console.log(err));
    });