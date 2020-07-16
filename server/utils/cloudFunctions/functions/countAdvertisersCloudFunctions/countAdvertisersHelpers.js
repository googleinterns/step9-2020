/**
 * Description: Helper functions for count advertisers cloud functions.
 * Author: Robert Marcus
 * Date: July 14, 2020
 */

const { assert } = require('../test/testConfig');
const { FieldValue } = require('./countAdvertisersConfig');

/**
 * Assert `advertiser` is a string
 * @param {string} advertiser as derived from snapshot
 */
function checkAdvertiser(advertiser) {
  assert.typeOf(advertiser, 'string');
}

/**
 * Assert `startDate` is a string with length at least 4.
 * @param {string} startDate as derived from snapshot
 */
function checkStartDate(startDate) {
  assert.typeOf(startDate, 'string');
  assert.isAtLeast(startDate.split('-')[0].length, 4); // check "YYYY-..."
}

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

  checkAdvertiser(advertiser);
  checkStartDate(startDate);
  
  const startYear = startDate.slice(0, 4);

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

      // Only decrement if the numberOfAds is positive.
      const change = doc.data().numberOfAds > 0 ? -1 : 0;

      return advertiserCountReference
                .update({numberOfAds: FieldValue.increment(change)});
    } else {
      
      // If the document doesn't exist throw an error.
      const errorMessage = { code: 500, 
                             message: snapshot.data().advertiser + 
                                      snapshot.data().startDate +
                                      "advertiser numberOfAds doc not found"};
      throw errorMessage;
    }
  }).catch(err => console.log(err));
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
