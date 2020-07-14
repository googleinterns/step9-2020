/**
 * Description: initialize the environment and firestore db access
 * Author: Robert Marcus
 * Date: July 7, 2020
 */

// Import firebase functions for access to env vars.
const { functions } = require('../firebaseConfig');

// Initialize access to tardigrade firestore db
const CONFIG = 
    {
      apiKey: functions.config().firestore.key,
      authDomain: "step9-2020-capstone.firebaseapp.com",
      projectId: "step9-2020-capstone"
    };

const ADMIN = require('firebase-admin');
ADMIN.initializeApp(CONFIG);

const DB = ADMIN.firestore();

const DEV_AGGREGATES_COLLECTION_NAME = "dev_aggregates";
const DEV_AGGREGATES_COLLECTION = 
    DB.collection(DEV_AGGREGATES_COLLECTION_NAME);


const FieldValue = ADMIN.firestore.FieldValue;
module.exports = 
    { DEV_AGGREGATES_COLLECTION, FieldValue }
