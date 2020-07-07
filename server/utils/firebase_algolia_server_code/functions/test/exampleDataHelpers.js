/**
 * Return a snap as it would be by an algolia add mock
 * @param {Object} snap a json string
 * @return {Object}
 */
function getFormattedSnap(snap) {
  return {data: snap.data(), objectID: snap.id};
}

/**
 * Return a change as it would be by an algolia update mock
 * @param {Object} change a json string
 * @return {Object}
 */
function getFormattedChange(change) {
  return {data: change.after.data(), objectID: change.after.id};
}

module.exports.getFormattedChange = getFormattedChange;
module.exports.getFormattedSnap = getFormattedSnap;
