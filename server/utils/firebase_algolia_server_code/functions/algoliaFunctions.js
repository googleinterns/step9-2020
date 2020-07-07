/**
 * Delete an entity by it's corresponding firestore id
 */
function addEntityToIndex(algoliaOperation, snapshot) {
  const data = snapshot.data();
  const objectID = snapshot.id;

  return algoliaOperation({data, objectID}); // This is a promise.
}

function updateRecordInIndex(algoliaOperation, change) {
  const data = change.after.data();
  const objectID = change.after.id; 

  return algoliaOperation({data, objectID}); // This is a promise.
}

function deleteEntityFromIndex(algoliaOperation, snapshot) {
  return algoliaOperation(snapshot.id); // This is a promise.
}
  

module.exports.addEntityToIndex = addEntityToIndex;
module.exports.updateRecordInIndex = updateRecordInIndex;
module.exports.deleteEntityFromIndex = deleteEntityFromIndex;


