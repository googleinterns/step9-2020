/**
 * Idempotent mock algolia functions
 * Sadly algolia does not provide any mocks
 */
function algoliaIndex() {
  function saveObject({data, objectID}) {
    return {data, objectID};
  }
  
  function  (objectID) {
    return objectID;
  }

  algoliaIndex.saveObject = saveObject;
  algoliaIndex.deleteObject = deleteObject;
}

module.exports.algoliaIndex = algoliaIndex; 