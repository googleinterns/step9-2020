/**
 * Description: Cloud functions for DEV firebase->algolia features. 
 *              Cloud functions must be created as static JS objects
 *              hence not everything can be DRY. 
 *              Three basic operations supported: create, update, delete.
 *              Vocab: a firestore collection = algolia index
 *                     an ad document = algolia record
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
 * Creates an algolia record from a firebase document snapshot in dev env.
 * @return {!Promise} 
 */
exports.devCreateRecord = 
    DEV_ADS_DOCS.onCreate(snapshot => {
      return createRecord(DEV_ADS_INDEX, snapshot);
    });

/**
 * Updates an algolia record from a firebase change type in dev env.
 * If the record does not exist in algolia, it will be created.
 * @return {!Promise} 
 */
exports.devUpdateRecord = 
    DEV_ADS_DOCS.onUpdate(change => {
      return updateRecord(DEV_ADS_INDEX, change);
    });

/**
 * Delete's an algolia record from a document snapshot in dev env. 
 * Use default value unless mocking an algoliaOperation.
 * @return {!Promise} 
 */
exports.devDeleteRecord = 
    DEV_ADS_DOCS.onDelete(snapshot => {
      return deleteRecord(DEV_ADS_INDEX, snapshot);
    });
