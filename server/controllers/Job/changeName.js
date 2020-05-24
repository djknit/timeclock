const Job = require('../../models/Job');

module.exports = {
  changeName
};

function changeName(jobId, userId, newName) {
  return Job.findOneAndUpdate(
    {
      _id: jobId,
      user: userId
    },
    { name: newName },
    { new: true}
  );
}