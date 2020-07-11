/**
  * Description: code that actually connects to algolia. 
  *              `algoliaOperation` parameter is used to reduce DRY
  *              as these functions are used in different contexts 
  *              by cloud functions depending on if dev/prod focus. 
  * Author: Robert Marcus
  * Date: July 7, 2020
  */

/**
 * Creates an algolia record from a firebase entity snapshot.
 * @param {function(string): !Promise} algoliaOperation a save function
 * @param {Object} snapshot a json string
 * @return {!Promise}
 */
function createRecord(algoliaIndex, snapshot) {
  const data = snapshot.data();
  const objectID = snapshot.id;

  return algoliaIndex.saveObject({data, objectID});
}

/**
 * Updates an algolia record from a firebase change type. 
 * If the record does not exist in algolia, it will be created.
 * @param {function(string): !Promise} algoliaOperation a save function
 * @param {Object} change a json string
 * @return {!Promise}
 */
function updateRecord(algoliaIndex, change) {
  return createRecord(algoliaIndex, change.after);
}

/**
 * Deletes an algolia record from an entity snapshot. 
 * @param {function(string): !Promise=} algoliaOperation a delete function
 * @return {!Promise} 
 */
function deleteRecord(algoliaIndex, snapshot) {
  return algoliaIndex.deleteObject(snapshot.id);
}

module.exports = { createRecord, updateRecord, deleteRecord };
