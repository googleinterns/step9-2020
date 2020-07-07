/**
 * Description: Turn ad entities into algolia records
 *              With HTTP cloud functions  
 *              Basically compile with `firebase deploy --only functions`
 *              These will then appear in functions tab of firestore 
 * Author: Robert Marcus
 * Date: June 26, 2020
 * Note: Current algolia index is dev_ADS
 */

const algoliasearch = require('algoliasearch');
const algoliaFunctions = require('./algoliaFunctions');
const functions = require('firebase-functions');

/**
 * Looking to compile this on your local machine but don't have the keys?
 * Save api keys in `environment variables`
 * 1) Go to algolia, log in (ask robbie for credentials.) 
 * 2) Retrieve relevant keys
 * 3) run: firebase functions:config:set 
 *              algolia.app=APP_ID algolia.key=ADMIN_API_KEY
 * Now you can compile! 
 * Please _don't_ expose the API_KEY to the public.
 * _don't_ commit runtimeconfig either please. 
 */
const APP_ID = functions.config().algolia.app;
const ADMIN_KEY = functions.config().algolia.key;

// Initialize algoliasearch API
const client = algoliasearch(APP_ID, ADMIN_KEY);
const index = client.initIndex('dev_ADS');

// Access an individual document in our `ads` documents collection
const DOC_NAME = 'ads/{adId}';
const DOCS = functions.firestore.document(DOC_NAME);

/**
 * Cloud functions below
 * Vocab: a firestore collection = algolia index
 *        an ad entity = algolia record
 * Note: these are background events, basically event listeners
 * They are guaranteed 'at-least-once execution'
 * If these functions fail, they will not attempt to retry (currently)
 * Firebase has native support for enabling retry on failure
 * This feature will be integrated at some point post-MVP. 
 * https://cloud.google.com/functions/docs/bestpractices/retries
 */

/**
 * add an entity and all it's field to algolia
 * with the same objectID
 */
function addEntityToIndex(algoliaIndex) {
  exports.addEntityToIndex = 
      DOCS.onCreate(snapshot => {
        return algoliaFunctions.addEntityToIndex(algoliaIndex, snapshot);
      });

  return exports.addEntityToIndex;
}

/**
* Update record corresponding to ad entity if a change occurs.
*/
function updateRecordInIndex(algoliaIndex) {
  exports.updateRecordInIndex = 
      DOCS.onUpdate(change => {
        return algoliaFunctions.updateRecordInIndex(algoliaIndex, change);
      });
  return exports.updateRecordInIndex;
}

/**
* If delete an entity from firestore, delete the corresponding record
*/
function deleteEntityFromIndex(algoliaIndex) {
  exports.deleteEntityFromIndex = 
      DOCS.onDelete(snapshot => {
        return algoliaFunctions.deleteEntityFromIndex(algoliaIndex, snapshot);
      }); 
  return exports.deleteEntityFromIndex;
}

addEntityToIndex(index);
updateRecordInIndex(index);
deleteEntityFromIndex(index);

module.exports.addEntityToIndex = addEntityToIndex;
module.exports.updateRecordInIndex = updateRecordInIndex;
module.exports.deleteEntityFromIndex = deleteEntityFromIndex;