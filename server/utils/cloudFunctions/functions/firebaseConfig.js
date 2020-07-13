/**
 * Description: Initialize the index environment
 *              Basically prepare firestore and algolia
 * Author: Robert Marcus
 * Date: July 7, 2020
 */
// Initialize the firebase functions sdk. 
const functions = require('firebase-functions');

// Access an individual document in our `ads` documents collection
const DEV_ADS_DOC_NAME = 'dev_ads/{adId}';
const PROD_ADS_DOC_NAME = 'ads/{adId}';

// Initialize access to the specific collections cloud functions watch over. 
const DEV_ADS_DOCS = functions.firestore.document(DEV_ADS_DOC_NAME);
const PROD_ADS_DOCS = functions.firestore.document(PROD_ADS_DOC_NAME);

module.exports = { functions, DEV_ADS_DOCS, PROD_ADS_DOCS };