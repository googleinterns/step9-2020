/**
 * Description: Turn ad entities into algolia records
 *              With HTTP cloud functions  
 *              Basically compile with `firebase deploy --only functions`
 *              These will then appear in functions tab of firestore 
 * Author: Robert Marcus
 * Date: July 7, 2020
 */

const { functions, algoliaFunctions, INDEX, DOCS } = require('./indexConfig');

const admin = require('firebase-admin');
admin.initializeApp();

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
/*
function createRecordFromEntity(algoliaOperation = INDEX.saveObject) {
  exports.create = 
      DOCS.onCreate(snapshot => {
        return algoliaFunctions
                  .createRecordFromEntity(algoliaOperation, snapshot);
      });

  return exports.create;
}*/

/**
 * Updates an algolia record from a firebase change type. 
 * If the record does not exist in algolia, it will be created.
 * Use default value unless mocking an algoliaOperation.
 * @param {function(string): !Promise=} algoliaOperation a save function
 * @return {function} 
 */
/*
function updateRecord(algoliaOperation = INDEX.saveObject) {
  exports.update = 
      DOCS.onUpdate(change => {
        return algoliaFunctions.updateRecord(algoliaOperation, change);
      });

  return exports.update;
}*/

/**
 * Delete's an algolia record from an entity snapshot. 
 * Use default value unless mocking an algoliaOperation.
 * @param {function(string): !Promise=} algoliaOperation a delete function
 * @return {function} 
 */
/*
function deleteRecord(algoliaOperation = INDEX.deleteObject) {
  return DOCS.onDelete(snapshot => {
        return algoliaFunctions.deleteRecord(algoliaOperation, snapshot);
      });
}
*/

exports.createRecord = 
    DOCS.onCreate(snapshot => {
      return algoliaFunctions
                .createRecordFromEntity(INDEX.saveObject, snapshot);
    });

exports.updateRecord = 
    DOCS.onUpdate(change => {
      return algoliaFunctions.updateRecord(INDEX.saveObject, change);
    });

exports.deleteRecord = DOCS.onDelete(snapshot => {
        return algoliaFunctions.deleteRecord(INDEX.deleteObject, snapshot);
      });

//module.exports = { INDEX };
