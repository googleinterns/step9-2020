/**
 * Idempotent mock algolia functions
 * Sadly algolia does not provide any mocks
 */
function deleteObject(objectID) {
  return objectID;
}

function saveObject({data, objectID}) {
  return {data, objectID};
}

module.exports.deleteObject = deleteObject; 
module.exports.saveObject = saveObject;