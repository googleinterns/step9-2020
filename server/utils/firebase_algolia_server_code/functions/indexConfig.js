/**
 * Description: Initialize the index environment
 *              Basically prepare firestore and algolia
 * Author: Robert Marcus
 * Date: July 7, 2020
 */

const algoliasearch = require('algoliasearch');
const algoliaFunctions = require('./algoliaFunctions');
const functions = require('firebase-functions');

/**
 * Keys required to run this locally. 
 * How to get the keys: 
 * 1) Go to algolia, log in (ask robbie for credentials.) 
 * 2) Retrieve relevant keys. Save the api keys in `environment variables`
 * 3) Specifically: `firebase functions:config:set algolia.app=APP_ID algolia.key=ADMIN_API_KEY`
 * Now you can compile.
 * Please *don't* expose the API_KEY to the public.
 */
const APP_ID = functions.config().algolia.app;
const ADMIN_KEY = functions.config().algolia.key;

// Initialize algoliasearch API
const CLIENT = algoliasearch(APP_ID, ADMIN_KEY);
const INDEX_NAME = 'dev_ADS';
const INDEX = CLIENT.initIndex(INDEX_NAME);

// Access an individual document in our `ads` documents collection
const DOC_NAME = 'ads/{adId}';
const DOCS = functions.firestore.document(DOC_NAME);

module.exports = { algoliaFunctions, INDEX, DOCS };