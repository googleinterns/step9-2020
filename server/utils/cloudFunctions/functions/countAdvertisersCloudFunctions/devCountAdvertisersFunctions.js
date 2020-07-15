/**
 * Description: Cloud functions for DEV count advertisers. 
 * Author: Robert Marcus
 * Date: July 7, 2020
 */

// Import links to firebase dev databases 
const { DEV_ADS_DOCS } = require('../firebaseConfig');

// Import links to firebase dev advertisers collections
// These are used to write directly to a collection
const { DEV_AGGREGATES_COLLECTION } = require('./countAdvertisersConfig');

// Import helper functions
const { incrementAdvertiserCount, decrementAdvertiserCount } = 
    require('./countAdvertisersHelpers');

/**
 * Increments an advertisers annual aggregate by one for an ad in a given year
 * in dev env. Annual aggregate stored in firebase collection `DEV_AGGREGATES_COLLECTION`.
 * Years possible are 2018, 2019, 2020. Event triggered on create.
 * @returns {!Promise}     
 */
exports.devUpdateAdvertiserCountOnCreate = 
  DEV_ADS_DOCS.onCreate(snapshot => {
      return incrementAdvertiserCount(snapshot, DEV_AGGREGATES_COLLECTION);
    });

/**
 * Decrements an advertisers annual aggregate by one for an ad in a given year
 * in dev env. Annual aggregate stored in firebase collection `DEV_AGGREGATES_COLLECTION`.
 * Years possible are 2018, 2019, 2020. Event triggered on create.
 * @returns {!Promise} 
 */
exports.devUpdateAdvertiserCountOnDelete = 
    DEV_ADS_DOCS.onDelete(snapshot => {
      return decrementAdvertiserCount(snapshot, DEV_AGGREGATES_COLLECTION);
    });