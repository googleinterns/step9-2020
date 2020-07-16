/**
 * Description: Initialize the environment and firestore db access.
 *              See `readme.md` for more information. 
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
