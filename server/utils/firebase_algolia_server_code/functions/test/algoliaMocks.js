/**
 * Add an altered field to the json data passed into the mock functions. 
 * Use this field to validate that the data returned by the cloud functions
 * Corresponds to the data returned by the algoliaOperation input. 
 * @param {Object} someJson an arbitrary json input
 * @return {Object}
 */
function addField(someJson) {
  //someJson.altered = true;  
  return someJson;
} 

/**
 * Mock delete, simply returns the input. 
 * @param {Object} objectID json string of the form {id: 'some id'}.
 * @return {Object}
 */
function deleteObject(objectID) {
  return addField(objectID);
}

/**
 * Mock save, simply returns the input. 
 * @param {Object} data json string with arbitrary contents.
 * @param {Object} objectID json string of the form {id: 'id'}. 
 * @return {Object}
 */
function saveObject({data, objectID}) {
  var data = addField(data);
  var objectID = addField(objectID);
  return {data, objectID};
}

module.exports = {deleteObject, saveObject, addField};