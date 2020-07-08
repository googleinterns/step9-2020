const {addField} = require('./algoliaMocks');

/**
 * Returns a snap id object as it would be by an algolia delete mock
 * @param {Object} snap a firebase snap object
 * @return Object
 */
function getFormattedID(snap) {
  return addField({'objectID': snap.id})
}

/**
 * Returns a snap as it would be by an algolia create mock
 * @param {Object} snap a firebase snap object
 * @return {Object}
 */
function getFormattedSnap(snap) {
  return {data: addField(snap.data()), objectID: addField(snap.id)};
}

/**
 * Returns a change as it would be by an algolia update mock
 * @param {Object} change a firebase change object
 * @return {Object}
 */
function getFormattedChange(change) {
  return getFormattedSnap(change.after); // change.after is a snap.
}

module.exports = {getFormattedID, getFormattedChange, getFormattedSnap};