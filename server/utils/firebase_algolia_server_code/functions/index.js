/**
 * Description: Turn ad entities into algolia records
 *              With HTTP cloud functions  
 *              Basically compile with `firebase deploy --only functions`
 *              These will then appear in functions tab of firestore 
 * Author: Robert Marcus
 * Date: July 7, 2020
 */

const { algoliaFunctions, INDEX, DOCS } = require('./indexConfig');

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
 * Creates an algolia record from a firebase entity snapshot.
 * Use default value unless mocking an algoliaOperation.
 * @param {function(string): !Promise=} algoliaOperation a save function
 * @return {function} 
 */
function createRecordFromEntity(algoliaOperation = INDEX.saveObject) {
  exports.createRecordFromEntity = 
      DOCS.onCreate(snapshot => {
        return algoliaFunctions
                  .createRecordFromEntity(algoliaOperation, snapshot);
      });

  return exports.createRecordFromEntity;
}

/**
 * Updates an algolia record from a firebase change type. 
 * If the record does not exist in algolia, it will be created.
 * Use default value unless mocking an algoliaOperation.
 * @param {function(string): !Promise=} algoliaOperation a save function
 * @return {function} 
 */
function updateRecord(algoliaOperation = INDEX.saveObject) {
  exports.updateRecord = 
      DOCS.onUpdate(change => {
        return algoliaFunctions.updateRecord(algoliaOperation, change);
      });

  return exports.updateRecord;
}

/**
 * Delete's an algolia record from an entity snapshot. 
 * Use default value unless mocking an algoliaOperation.
 * @param {function(string): !Promise=} algoliaOperation a delete function
 * @return {function} 
 */
function deleteRecord(algoliaOperation = INDEX.deleteObject) {
  exports.deleteRecord = 
      DOCS.onDelete(snapshot => {
        return algoliaFunctions
                  .deleteRecord(algoliaOperation, snapshot);
      }); 
      
  return exports.deleteRecord;
}

createRecordFromEntity();
updateRecord();
deleteRecord();

module.exports = { createRecordFromEntity, updateRecord, deleteRecord };
