/**
 * Description: Cloud functions for PROD count advertisers.
 *              When an ad document is created in `ads`
 *              a document will be created at 
 *              `/aggregates/{startYear}/advertisers/{advertiser}`
 *              with the field `numberOfAds: 1`. If the document already 
 *              exists, `numberOfAds` will be incremented by 1. 
 *              If this document is deleted, `numberOfAds` will be decremented
 *              if `numberOfAds` is greater than 0.
 *              If `advertiser` or `startDate` field is not well-typed/formed, 
 *              an assertion error will be thrown. 
 * Author: Robert Marcus
 * Date: July 14, 2020
 */

// Import links to firebase prod databases.
const { PROD_ADS_DOCS } = require('../firebaseConfig');

// Import links to firebase prod advertisers collections.
// These are used to write directly to a collection.
const { PROD_AGGREGATES_COLLECTION } = require('./countAdvertisersConfig');

// Import helper functions.
const { incrementAdvertiserCount, decrementAdvertiserCount } = 
    require('./countAdvertisersHelpers');

/**
 * Increments an advertiser's annual ad count by one for an ad in a given year.
 * in prod env. Annual ad count stored in firebase collection `PROD_AGGREGATES_COLLECTION`.
 * Event triggered on create.
 * @returns {!Promise}     
 */
exports.prodCountAdvertisersOnCreate = 
  PROD_ADS_DOCS.onCreate(snapshot => {
      return incrementAdvertiserCount(snapshot, PROD_AGGREGATES_COLLECTION);
    });

/**
 * Decrements an advertiser's annual ad count by one for an ad in a given year.
 * in prod env. Annual ad count stored in firebase collection `PROD_AGGREGATES_COLLECTION`.
 * Event triggered on delete.
 * @returns {!Promise} 
 */
exports.prodCountAdvertisersOnDelete = 
    PROD_ADS_DOCS.onDelete(snapshot => {
      return decrementAdvertiserCount(snapshot, PROD_AGGREGATES_COLLECTION);
    });
