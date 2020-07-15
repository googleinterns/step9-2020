/**
 * Description: Helper functions for count advertisers cloud functions.
 * Author: Robert Marcus
 * Date: July 14, 2020
 */


const { FieldValue } = require('./countAdvertisersConfig');

/**
 * Returns a filepath reference to a doc containing the numberOfAds an 
 * advertiser released in a particular year. Will link to whatever year 
 * the ad in the `snapshot` is from.     
 * @param {Object} snapshot a json string
 * @param {Object} collection reference to a particular firestore collection
 * @returns {Object} 
 */
function getAdvertiserCountReference(snapshot, collection) {
  const data = snapshot.data();

  const advertiser = data.advertiser;
  const startDate = data.startDate;
  const startYear = startDate.slice(0, 4);

  const advertiserCountReference = 
      collection.doc(startYear)
                .collection("advertisers")
                .doc(advertiser);

  return advertiserCountReference;
}

/**
 * Decrements an advertisers annual aggregate by one for an ad in a given year
 * in dev env. Annual aggregate stored in firebase collection `DEV_AGGREGATES_COLLECTION`.
 * Years possible are 2018, 2019, 2020. Event triggered on delete.
 * If the advertisers count document does not exist in the relevant collection,
 * a 500 error will be thrown.
 * @param {Object} snapshot a json string
 * @param {Object} collection reference to a particular firestore collection
 * @returns {!Promise} 
 */
function decrementAdvertiserCount(snapshot, collection) {
  const advertiserCountReference = 
      getAdvertiserCountReference(snapshot, collection);

  return advertiserCountReference.get().then(function(doc) {
    if (doc.exists) {

      // Only decrement if the numberOfAds is positive.
      const change = doc.data().numberOfAds > 0 ? -1 : 0;

      return advertiserCountReference
                .update({numberOfAds: FieldValue.increment(change)});
    } else {
      
      // If the document doesn't exist throw an error.
      const errorMessage = { code: 500, 
                             message: snapshot.data().advertiser + 
                                      snapshot.data().startDate +
                                      "aggregate doc not found"};
      throw errorMessage;
    }
  }).catch(err => console.log(err));
}

/**
 * Increments an advertisers annual aggregate by one for an ad in a given year
 * in dev env. Annual aggregate stored in firebase collection `DEV_AGGREGATES_COLLECTION`.
 * Years possible are 2018, 2019, 2020. Event triggered on create.
 * If the advertisers count document does not exist in the relevant collection,
 * the document will be made and populated with default value of 1. 
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
                  .update({numberOfAds: FieldValue.increment(1)});
    } else {

      // If the doc doesn't exist, create a doc with the advertiser name 
      // as the primary key, and with the field `numberOfAds` set to 1.  
      return advertiserCountReference.set({numberOfAds: 1});
    }
  }).catch(err => console.log(err));
}

module.exports = { decrementAdvertiserCount, 
                   incrementAdvertiserCount };
