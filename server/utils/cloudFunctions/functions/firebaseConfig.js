/**
 * Description: Initialize the index environment by 
 *              initializng the firebase api to access the dev/prod ads db.
 * Author: Robert Marcus
 * Date: July 7, 2020
 */

// Initialize the firebase functions sdk. 
const functions = require('firebase-functions');
const ADMIN = require('firebase-admin');

// Initialize access to tardigrade firestore db
const CONFIG = 
    {
      apiKey: functions.config().firestore.key,
      authDomain: "step9-2020-capstone.firebaseapp.com",
      projectId: "step9-2020-capstone"
    };

ADMIN.initializeApp(CONFIG);

const DB = ADMIN.firestore();

// Access an individual document in our `ads` documents collection.
const DEV_ADS_DOC_NAME = 'dev_ads/{adId}';
const PROD_ADS_DOC_NAME = 'ads/{adId}';

// Initialize access to the specific collections cloud functions watch over. 
const DEV_ADS_DOCS = functions.firestore.document(DEV_ADS_DOC_NAME);
const PROD_ADS_DOCS = functions.firestore.document(PROD_ADS_DOC_NAME);

module.exports = { functions, ADMIN, DB, DEV_ADS_DOCS, PROD_ADS_DOCS };
