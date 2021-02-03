module.exports = {
  ...require('../../utilities'),
  ...require('./problems'),
  findItemWithId
};

function findItemWithId(id, items, hardFailItemName) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item._id.toString() === id.toString()) {
      return item;
    }
  }
  if (!!hardFailItemName) {
    throw new Error(`${hardFailItemName} not found.`);
  }
  return null;
}
