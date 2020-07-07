/**
 * Mock delete, simply returns the input. 
 * @param {Object} objectID json string of the form {id: 'id'}.
 */
function deleteObject(objectID) {
  return objectID;
}

/**
 * Mock save, simply returns the input. 
 * @param {Object} data json string with arbitrary contents.
 * @param {Object} objectID json string of the form {id: 'id'}. 
 */
function saveObject({data, objectID}) {
  return {data, objectID};
}

module.exports.deleteObject = deleteObject; 
module.exports.saveObject = saveObject;