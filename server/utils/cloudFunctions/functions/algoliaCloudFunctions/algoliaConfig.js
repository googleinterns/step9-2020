/**
 * Description: Initialize the algolia environment by
 *              initializing the algolia api client 
 *              to access the dev/prod ads indices.
 * Author: Robert Marcus
 * Date: July 7, 2020
 */

// Import algoliasearch api, firebase functions for access to env vars.
const algoliasearch = require('algoliasearch');
const { functions } = require('../firebaseConfig');

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

// Initialize algoliasearch API.
const CLIENT = algoliasearch(APP_ID, ADMIN_KEY);

// Names of the algolia development and production ads index.  
const DEV_ADS_INDEX_NAME = 'dev_ADS';
const PROD_ADS_INDEX_NAME = 'prod_ADS';

// Initialize the specific index the `CLIENT` instance will operate on. 
const DEV_ADS_INDEX = CLIENT.initIndex(DEV_ADS_INDEX_NAME);
const PROD_ADS_INDEX = CLIENT.initIndex(PROD_ADS_INDEX_NAME);

module.exports = { DEV_ADS_INDEX, PROD_ADS_INDEX };
