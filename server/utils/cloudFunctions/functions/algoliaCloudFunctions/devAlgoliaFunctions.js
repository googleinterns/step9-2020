/**
 * Description: Cloud functions for firebase->algolia features. 
 *              Cloud functions must be created as static JS objects
 *              hence not everything can be DRY. 
 *              Three basic operations supported: create, update, delete.
 *              Vocab: a firestore collection = algolia index
 *                     an ad entity = algolia record
 * Author: Robert Marcus
 * Date: July 7, 2020
 */

// Import algolia save/delete functions linked to dev index.
const { DEV_ADS_INDEX } = require('./algoliaConfig');

// Import links to firebase dev databases 
const { DEV_ADS_DOCS } = require('../firebaseConfig');

// Import algolia helper functions 
const { createRecord, updateRecord, deleteRecord } = 
    require('./algoliaFunctionsHelpers');

/**
 * Creates an algolia record from a firebase entity snapshot in dev env.
 * @param {function(string): !Promise=} algoliaOperation a save function
 * @return {function} 
 */
exports.devCreateRecord = 
    DEV_ADS_DOCS.onCreate(snapshot => {
      return createRecord(DEV_ADS_INDEX, snapshot);
    });

/**
 * Updates an algolia record from a firebase change type in dev env.
 * If the record does not exist in algolia, it will be created.
 * @param {function(string): !Promise=} algoliaOperation a save function
 * @return {function} 
 */
exports.devUpdateRecord = 
    DEV_ADS_DOCS.onUpdate(change => {
      return updateRecord(DEV_ADS_INDEX, change);
    });

/**
 * Delete's an algolia record from an entity snapshot in dev env. 
 * Use default value unless mocking an algoliaOperation.
 * @param {function(string): !Promise=} algoliaOperation a delete function
 * @return {function} 
 */
exports.devDeleteRecord = 
    DEV_ADS_DOCS.onDelete(snapshot => {
      return deleteRecord(DEV_ADS_INDEX, snapshot);
    });



