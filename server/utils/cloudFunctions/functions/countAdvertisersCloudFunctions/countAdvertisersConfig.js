/**
 * Description: initialize the environment and firestore db access.
 *              `aggregates` refers to a collection of aggregated ad data.
 *              Currently the only aggregated data is `numberOfAds` in a year
 *              by a given advertiser. 
 * Author: Robert Marcus
 * Date: July 7, 2020
 */

// Import firebase functions for access to env vars.
const { ADMIN, DB } = require('../firebaseConfig');

const DEV_AGGREGATES_COLLECTION_NAME = "dev_aggregates";
const DEV_AGGREGATES_COLLECTION = 
    DB.collection(DEV_AGGREGATES_COLLECTION_NAME);

const FieldValue = ADMIN.firestore.FieldValue;

module.exports = 
    { DEV_AGGREGATES_COLLECTION, FieldValue }
