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

const DEV_ADVERTISERS_COLLECTION_NAME = "dev_advertisers"
const DEV_ADVERTISERS_COLLECTION = 
    DB.collection(DEV_ADVERTISERS_COLLECTION_NAME)

const DEV_ADVERTISERS_2018 = DEV_ADVERTISERS_COLLECTION.collection("2018");
const DEV_ADVERTISERS_2019 = DEV_ADVERTISERS_COLLECTION.collection("2019");
const DEV_ADVERTISERS_2020 = DEV_ADVERTISERS_COLLECTION.collection("2020");

module.exports = 
    { DEV_ADVERTISERS_2018, DEV_ADVERTISERS_2019, DEV_ADVERTISERS_2020 }
