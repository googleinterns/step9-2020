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
 * 3) run: `firebase functions:config:set algolia.app=APP_ID algolia.key=ADMIN_API_KEY`
 * Now you can compile! 
 * Please *don't* expose the API_KEY to the public.
 * *don't* commit runtimeconfig either please. 
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
 * Create's an algolia record from a firebase entity snapshot.
 * Use default value unless mocking an algoliaOperation.
 * @param {function(string): !Promise=} algoliaOperation a save function
 * @return {function} 
 */
function addEntityToIndex(algoliaOperation = index.saveObject) {
  exports.addEntityToIndex = 
      DOCS.onCreate(snapshot => {
        return algoliaFunctions.addEntityToIndex(algoliaOperation, snapshot);
      });

  return exports.addEntityToIndex;
}

/**
 * Update's an algolia record from a firebase change type. 
 * If the record does not exist in algolia, it will be created.
 * Use default value unless mocking an algoliaOperation.
 * @param {function(string): !Promise=} algoliaOperation a save function
 * @return {function} 
 */
function updateRecordInIndex(algoliaOperation = index.saveObject) {
  exports.updateRecordInIndex = 
      DOCS.onUpdate(change => {
        return algoliaFunctions.updateRecordInIndex(algoliaOperation, change);
      });
  return exports.updateRecordInIndex;
}

/**
 * Delete's an algolia record from an entity snapshot. 
 * Use default value unless mocking an algoliaOperation.
 * @param {function(string): !Promise=} algoliaOperation a delete function
 * @return {function} 
 */
function deleteEntityFromIndex(algoliaOperation = index.deleteObject) {
  var deleteEntityFromIndex = 
      DOCS.onDelete(snapshot => {
        return algoliaFunctions
                  .deleteEntityFromIndex(algoliaOperation, snapshot);
      }); 
  return deleteEntityFromIndex;
}

addEntityToIndex();
updateRecordInIndex();
deleteEntityFromIndex();

module.exports.addEntityToIndex = addEntityToIndex;
module.exports.updateRecordInIndex = updateRecordInIndex;
module.exports.deleteEntityFromIndex = deleteEntityFromIndex;