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

// Import algolia save/delete functions linked to prod index.
const { PROD_ADS_INDEX } = 
    require('./algoliaConfig');

// Import links to firebase prod databases 
const { PROD_ADS_DOCS } = require('../firebaseConfig');

// Import algolia helper functions 
const { createRecord, updateRecord, deleteRecord } = 
    require('./algoliaFunctionsHelpers');

/**
 * Creates an algolia record from a firebase entity snapshot in prod env.
 * @param {function(string): !Promise=} algoliaOperation a save function
 * @return {function} 
 */
exports.prodCreateRecord = 
    PROD_ADS_DOCS.onCreate(snapshot => {
      return createRecord(PROD_ADS_INDEX, snapshot);
    });

/**
 * Updates an algolia record from a firebase change type in prod env.
 * If the record does not exist in algolia, it will be created.
 * @param {function(string): !Promise=} algoliaOperation a save function
 * @return {function} 
 */
exports.prodUpdateRecord = 
    PROD_ADS_DOCS.onUpdate(change => {
      return updateRecord(PROD_ADS_INDEX, change);
    });

/**
 * Delete's an algolia record from an entity snapshot in prod env. 
 * Use default value unless mocking an algoliaOperation.
 * @param {function(string): !Promise=} algoliaOperation a delete function
 * @return {function} 
 */
exports.prodDeleteRecord = 
    PROD_ADS_DOCS.onDelete(snapshot => {
      return deleteRecord(PROD_ADS_INDEX, snapshot);
    });



