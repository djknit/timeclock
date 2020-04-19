const mongoose = require('mongoose');

const intTypeFactory = require('./integer');

const { isDateValid } = require('../../utilities');

const dateSchema = new mongoose.Schema({
  year: intTypeFactory(),
  month: intTypeFactory(),
  day: intTypeFactory()
}, {
  _id: false
}); 

module.exports = options => {
  const required = options && options.required;

  return {
    type: dateSchema,
    validate: {
      validator: isDateValid,
      message: 'Invalid date'
    },
    required
  };
};