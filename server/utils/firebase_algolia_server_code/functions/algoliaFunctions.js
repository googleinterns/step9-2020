/**
 * Creates an algolia record from a firebase entity snapshot.
 * @param {function(string): !Promise} algoliaOperation a save function
 * @param {Object} snapshot a json string
 * @return {!Promise}
 */
function createRecordFromEntity(algoliaOperation, snapshot) {
  const data = snapshot.data();
  const objectID = snapshot.id;

  return algoliaOperation({data, objectID});
}

/**
 * Updates an algolia record from a firebase change type. 
 * If the record does not exist in algolia, it will be created.
 * @param {function(string): !Promise} algoliaOperation a save function
 * @param {Object} change a json string
 * @return {!Promise}
 */
function updateRecordInIndex(algoliaOperation, change) {
  const data = change.after.data();
  const objectID = change.after.id; 

  return algoliaOperation({data, objectID});
}

/**
 * Deletes an algolia record from an entity snapshot. 
 * @param {function(string): !Promise=} algoliaOperation a delete function
 * @return {!Promise} 
 */
function deleteEntityFromIndex(algoliaOperation, snapshot) {
  return algoliaOperation(snapshot.id);
}
  
module.exports.createRecordFromEntity = createRecordFromEntity;
module.exports.updateRecordInIndex = updateRecordInIndex;
module.exports.deleteEntityFromIndex = deleteEntityFromIndex;


