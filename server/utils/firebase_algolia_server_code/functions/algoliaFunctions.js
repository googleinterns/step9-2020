/**
 * Delete an entity by it's corresponding firestore id
 * @param {Object=} algoliaIndex an algolia index object
 * @return {!Promise}
 */
function addEntityToIndex(algoliaIndex, snapshot) {
  const data = snapshot.data();
  const objectID = snapshot.id;

  return algoliaIndex.saveObject({data, objectID}); // This is a promise.
}

function updateRecordInIndex(algoliaIndex, change) {
  const data = change.after.data();
  const objectID = change.after.id; 

  return algoliaIndex.saveObject({data, objectID}); // This is a promise.
}

function deleteEntityFromIndex(algoliaIndex, snapshot) {
  return algoliaIndex.deleteObject(snapshot.id); // This is a promise.
}
  

module.exports.addEntityToIndex = addEntityToIndex;
module.exports.updateRecordInIndex = updateRecordInIndex;
module.exports.deleteEntityFromIndex = deleteEntityFromIndex;
