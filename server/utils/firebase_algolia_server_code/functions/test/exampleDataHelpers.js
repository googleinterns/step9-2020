/**
 * Returns a snap as it would be by an algolia add mock
 * @param {Object} snap a firebase snap object
 * @return {Object}
 */
function getFormattedSnap(snap) {
  return {data: snap.data(), objectID: snap.id};
}

/**
 * Returns a change as it would be by an algolia update mock
 * @param {Object} change a firebase change object
 * @return {Object}
 */
function getFormattedChange(change) {
  return getFormattedSnap(change.after); // change.after is a snap.
}

module.exports.getFormattedChange = getFormattedChange;
module.exports.getFormattedSnap = getFormattedSnap;
