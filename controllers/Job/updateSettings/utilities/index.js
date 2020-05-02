module.exports = {
  ...require('../../utilities'),
  get methodNames() {
    return ['add', 'changeDate', 'remove', 'edit'];
  },
  saveModifiedWeeks
};

function saveModifiedWeeks(weeksArray, modifiedWeekDocIds) {
  return new Promise((resolve, reject) => {
    let numCompleted = 0;
    for (let i = 0; i < weeksArray.length; i++) {
      const weekDoc = weeksArray[i].document;
      if (modifiedWeekDocIds.indexOf(weekDoc._id.toString()) !== -1) {
        weekDoc.save()
        .then(_weekDoc => {
          weeksArray[i].document = weekDoc;
          if (++numCompleted === weeksArray.length) resolve();
        })
        .catch(reject);
      }
      else if (++numCompleted === weeksArray.length) resolve();
    }
  });
}