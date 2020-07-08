/**
 * Description: These functions can be used to verify that the functions under
 *              test return whatever data the algoliaOperation they are called
 *              with returns. I.e., if a function is supposed to return the 
 *              the result of a saveObject operation on the input data, put
 *              the input data through the corresponding getFormattedX
 *              and assert.deepEqual(output, formatted(input)).
 * Author: Robert Marcus
 * Date: July 7, 2020
 */

const {addField} = require('./algoliaMocks');

/**
 * Returns a snap id object as it would be by an algolia delete mock
 * @param {Object} snap a firebase snap object
 * @return {Object}
 */
function getExpectedOutputID(snap) {
  return addField({'objectID': snap.id});
}

/**
 * Returns a snap as it would be by an algolia create mock
 * @param {Object} snap a firebase snap object
 * @return {Object}
 */
function getExpectedOutputSnap(snap) {
  return {data: addField(snap.data()), objectID: addField(snap.id)};
}

/**
 * Returns a change as it would be by an algolia update mock
 * @param {Object} change a firebase change object
 * @return {Object}
 */
function getExpectedOutputChange(change) {
  return getExpectedOutputSnap(change.after); // change.after is a snap.
}

module.exports = 
    {getExpectedOutputID, getExpectedOutputChange, getExpectedOutputSnap};