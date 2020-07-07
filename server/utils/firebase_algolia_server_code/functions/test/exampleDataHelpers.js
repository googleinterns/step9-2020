/**
 * Return a snap as it would be by an algolia add mock
 */
function formattedSnap(snap) {
  return {data: snap.data(), objectID: snap.id};
}

/**
 * Return a change as it would be by an algolia update mock
 */
function formattedChange(change) {
  return {data: change.after.data(), objectID: change.after.id};
}

module.exports.formattedChange = formattedChange;
module.exports.formattedSnap = formattedSnap;
