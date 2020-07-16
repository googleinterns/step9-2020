/**
 * Description: Initialize the environment and firestore db access.
 *              `aggregates` refers to a collection of aggregated ad data
 *              broken down by year. An example might be: 
 * - dev_aggregates collection
 *   - 2018 doc
 *     - collection
 *       - advertiser_A doc
 *         - numberOfAds: 1
 *       - advertiser_B doc
 *         - numberOfAds: 12
 *   - 2019 doc
 *     - advertiser collection
 *       - advertiser_
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

// `FieldValue` is a method that allows atomic operations on int/long fields.
// i.e., `FieldValue.increment(change)` will atomically increment the field value
// by `change`. 
const FieldValue = ADMIN.firestore.FieldValue;

module.exports = 
    { DEV_AGGREGATES_COLLECTION, FieldValue }
