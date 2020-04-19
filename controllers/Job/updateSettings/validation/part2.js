const { checkForFailure } = require('../../utilities');

module.exports = validateUpdates_part2of2;

function validateUpdates_part2of2(updates) {
  // This function checks to make sure a schedule entry is not marked for both editing and removal and not marked for both dateChange and removal.
  const removalUpdateIds = updates.remove.map(({ id }) => id);
  for (let i = 0; i < updates.edit.length + updates.changeDate.length; i++) {
    let update, failMsg, problemsObj;
    if (i < updates.edit.length) {
      update = updates.edit[i]
      failMsg = 'Cannot complete `edit` update because the entry with specified `id` is marked for removal.';
      problemsObj = {
        updates: { edit: true }
      };
    }
    else {
      update = updates.changeDate[i - updates.edit.length];
      failMsg = 'Cannot complete `changeDate` update because the entry with specified `id` is marked for removal.';
      problemsObj = {
        updates: { changeDate: true }
      };
    }
    checkForFailure(removalUpdateIds.indexOf(update.id) !== -1, failMsg, problemsObj, 422);
  }
}