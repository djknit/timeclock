const User = require('../../models/User');

const { createAccount } = require('./create');
const { findByUsernameOrEmail, findById } = require('./find');
const { editAccountInfo } = require('./edit');
const { deleteAccount } = require('./delete');
const { checkForJobWithName, addJob, getWithJobBasics, removeJob } = require('./jobs');

module.exports = {
  createAccount,
  findByUsernameOrEmail,
  findById,
  deleteAccount,
  editAccountInfo,
  checkForJobWithName,
  addJob,
  getWithJobBasics,
  removeJob
};