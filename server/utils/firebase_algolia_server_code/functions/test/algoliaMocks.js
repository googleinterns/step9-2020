/**
 * Add an altered field to the json data passed into the mock functions. 
 * Use this field to mark that the data returned by the cloud functions
 * Corresponds to the data returned by the algoliaOperation input. 
 * @param {Object} someJson an arbitrary json input
 * @return {Object}
 */
function markModified(someJson) {
  someJson.alteredByMockAlgolia = true;  
  return someJson;
} 

/**
 * Mock delete, simply returns the input + an altered field 
 * @param {string} objectID string
 * @return {Object}
 */
function deleteObject(objectID) {
  return markModified({'objectID': objectID});
}

/**
 * Mock save, simply returns the input + an altered field  
 * @param {Object} data json string with arbitrary contents.
 * @param {Object} objectID json string of the form {id: 'id'}. 
 * @return {Object}
 */
function saveObject({data, objectID}) {
  return {data: markModified(data), objectID: objectID};
}

module.exports = { deleteObject, saveObject };
