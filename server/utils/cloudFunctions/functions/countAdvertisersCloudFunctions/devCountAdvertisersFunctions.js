/**
 * Description: Cloud functions for DEV count advertisers.
 *              When an ad document is created in `dev_ads`
 *              a document will be created at 
 *              `/dev_aggregates/{startYear}/advertisers/{advertiser}`
 *              with the field `numberOfAds: 1`. If the document already 
 *              exists, `numberOfAds` will be incremented by 1. 
 *              If this document is deleted, `numberOfAds` will be decremented
 *              if `numberOfAds` is greater than 0.
 *              If `advertiser` or `startDate` field is not well-typed/formed, 
 *              an assertion error will be thrown. 
 * Author: Robert Marcus
 * Date: July 14, 2020
 */

// Import links to firebase dev databases.
const { DEV_ADS_DOCS } = require('../firebaseConfig');

// Import links to firebase dev advertisers collections.
// These are used to write directly to a collection.
const { DEV_AGGREGATES_COLLECTION } = require('./countAdvertisersConfig');

// Import helper functions.
const { incrementAdvertiserCount, decrementAdvertiserCount } = 
    require('./countAdvertisersHelpers');

/**
 * Increments an advertiser's annual ad count by one for an ad in a given year.
 * in dev env. Annual aggregate stored in firebase collection `DEV_AGGREGATES_COLLECTION`.
 * Event triggered on create.
 * @returns {!Promise}     
 */
exports.devCountAdvertisersOnCreate = 
  DEV_ADS_DOCS.onCreate(snapshot => {
      return incrementAdvertiserCount(snapshot, DEV_AGGREGATES_COLLECTION);
    });

/**
 * Decrements an advertiser's annual ad count by one for an ad in a given year.
 * in dev env. Annual aggregate stored in firebase collection `DEV_AGGREGATES_COLLECTION`.
 * Event triggered on delete.
 * @returns {!Promise} 
 */
exports.devCountAdvertisersOnDelete = 
    DEV_ADS_DOCS.onDelete(snapshot => {
      return decrementAdvertiserCount(snapshot, DEV_AGGREGATES_COLLECTION);
    });
