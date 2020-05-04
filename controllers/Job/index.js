const { getJobById, getJobBasicsById } = require('./find');
const { create } = require('./create');
const { addWeek, createAndAddWeekWithDate } = require('./addWeek');
const { deleteJob } = require('./delete');
const { updatePropWithName } = require('./updateSettings');

module.exports = {
  create,
  addWeek,
  getJobById,
  deleteJob,
  createAndAddWeekWithDate,
  updatePropWithName
};