const { validateThatEntryIdsForMethodAreNotOnRemoveList } = require('./utilities');

module.exports = validateUpdates_part2of2;

function validateUpdates_part2of2(updates) {
  return validateThatEntryIdsForMethodAreNotOnRemoveList('edit', updates);
}