/**
 * Description: Helper functions for count advertisers cloud functions.
 * Author: Robert Marcus
 * Date: July 14, 2020
 */

const { firestoreFieldValue, 
        AdvertiserDocumentNotFound, 
        IllegalAdCountDecrement } = require('./countAdvertisersConfig');

/**
 * Returns a filepath reference to a doc containing the numberOfAds an 
 * advertiser released in a particular year. Will link to whatever year 
 * the ad in the `snapshot` is from. 
 * If `advertiser` or `startDate` field is not well-typed/formed, 
 * an assertion error will be thrown.     
 * @param {Object} snapshot a json string
 * @param {Object} collection reference to a particular firestore collection
 * @returns {Object} 
 */
function getAdvertiserCountReference(snapshot, collection) {
  const data = snapshot.data();
  const advertiser = data.advertiser;
  const startDate = data.startDate;
  const isoStartDate = new Date(startDate);

  const startYear = isoStartDate.getFullYear().toString(); 

  const advertiserCountReference = 
      collection.doc(startYear)
                .collection("advertisers")
                .doc(advertiser);

  return advertiserCountReference;
}

/**
 * Decrements an advertiser's annual ad count by one for an ad in a given year.
 * Event triggered on delete. If the advertiser's count document does not 
 * exist in the relevant collection, a 500 error will be thrown.
 * If `advertiser` or `startDate` field is not well-typed/formed, 
 * an assertion error will be thrown. 
 * @param {Object} snapshot a json string
 * @param {Object} collection reference to a particular firestore collection
 * @returns {!Promise} 
 */
function decrementAdvertiserCount(snapshot, collection) {
  const advertiserCountReference = 
      getAdvertiserCountReference(snapshot, collection);

  return advertiserCountReference.get().then(function(doc) {
    if (doc.exists) {
      if (doc.data().numberOfAds < 1) {
        throw new IllegalAdCountDecrement();
      }

      return advertiserCountReference
                .update({numberOfAds: firestoreFieldValue.increment(-1)});
    } else {
      
      // If the document doesn't exist throw an error.
      throw new AdvertiserDocumentNotFound(snapshot.data().advertiser + 
                                              snapshot.data().startDate + 
                                              " `numberOfAds` doc not found");
    }
  }).catch(err => Promise.reject(err));
}

/**
 * Increments an advertiser's annual ad count by one for an ad in a given year.
 * Event triggered on create.
 * If the advertiser's count document does not exist in the relevant collection,
 * the document will be made and populated with default value of 1. 
 * If `advertiser` or `startDate` field is not well-typed/formed, 
 * an assertion error will be thrown. 
 * @param {Object} snapshot a json string
 * @param {Object} collection reference to a particular firestore collection
 * @returns {!Promise} 
 */
function incrementAdvertiserCount(snapshot, collection) {
  const advertiserCountReference = 
      getAdvertiserCountReference(snapshot, collection);

  return advertiserCountReference.get().then(function(doc) {
    if (doc.exists) {
      return advertiserCountReference
                  .update({numberOfAds: firestoreFieldValue.increment(1)});
    } else {

      // If the doc doesn't exist, create a doc with the advertiser name 
      // as the primary key, and with the field `numberOfAds` set to 1.  
      return advertiserCountReference.set({numberOfAds: 1});
    }
  }).catch(err => console.log(err));
}

module.exports = { decrementAdvertiserCount, 
                   incrementAdvertiserCount };
