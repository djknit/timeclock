const utilities = require('../../utilities');

module.exports = {
  ...utilities,
  get methodNames() {
    return ['add', 'changeDate', 'remove', 'edit'];
  },
  saveModifiedWeeks
};

function saveModifiedWeeks(weeksArray, modifiedWeekDocIds) {
  return new Promise((resolve, reject) => {
    let numCompleted = 0;
    // console.log('SAVE MOD WEEKS')
    for (let i = 0; i < weeksArray.length; i++) {
      console.log('e___E__ -\n', i)
      console.log(weeksArray)
      console.log(weeksArray[i])
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