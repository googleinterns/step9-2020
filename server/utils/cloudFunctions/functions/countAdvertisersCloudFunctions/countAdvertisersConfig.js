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

const PROD_AGGREGATES_COLLECTION_NAME = "aggregates";
const PROD_AGGREGATES_COLLECTION = 
    DB.collection(PROD_AGGREGATES_COLLECTION_NAME);

// `FieldValue` is a method that allows atomic operations on int/long fields.
// i.e., `firestoreFieldValue.increment(change)` will atomically increment the 
// field value by `change`. 
const firestoreFieldValue = ADMIN.firestore.FieldValue;

// Custom error for illegally decrementing a document 
class IllegalAdCountDecrement extends Error {
  constructor() {
    super();
    this.message = "Cannot decrement `numberOfAds` past 0."
    this.name = "IllegalAdCountDecrement"; 
    this.statusCode = 400; // Bad request. 
  }
}

// Custom error for illegally decrementing a document 
class AdvertiserDocumentNotFound extends Error {
  constructor(message) {
    super(message); 
    this.name = "AdvertiserDocumentNotFound"; 
    this.statusCode = 404; // Not found error code. 
  }
}

module.exports = { DEV_AGGREGATES_COLLECTION, 
                   PROD_AGGREGATES_COLLECTION,
                   firestoreFieldValue, 
                   IllegalAdCountDecrement, 
                   AdvertiserDocumentNotFound }
