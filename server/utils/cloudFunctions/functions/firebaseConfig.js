/**
 * Description: Initialize the index environment by 
 *              initializng the firebase api to access the dev/prod ads db
 * Author: Robert Marcus
 * Date: July 7, 2020
 */

// Initialize the firebase functions sdk. 
const firebaseFunctions = require('firebase-functions');

// Access an individual document in our `ads` documents collection.
const DEV_ADS_DOC_NAME = 'dev_ads/{adId}';
const PROD_ADS_DOC_NAME = 'ads/{adId}';

// Initialize access to the specific collections cloud functions watch over. 
const DEV_ADS_DOCS = firebaseFunctions.firestore.document(DEV_ADS_DOC_NAME);
const PROD_ADS_DOCS = firebaseFunctions.firestore.document(PROD_ADS_DOC_NAME);

module.exports = { firebaseFunctions, DEV_ADS_DOCS, PROD_ADS_DOCS };
