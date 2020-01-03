const mongoose = require('mongoose');

const intTypeFactory = require('./integer');

const dateSchema = new mongoose.Schema({
  year: intTypeFactory(),
  month: intTypeFactory(),
  day: intTypeFactory()
}, {
  _id: false
}); 

module.exports = options => {
  const required = options && options.required || undefined

  return {
    type: dateSchema,
    validate: {
      validator: val => {
        const { day, month, year } = val;
        const date = new Date(year, month, day);
        if (date.getDate() !== day) return false;
        if (date.getMonth() !== month) return false;
        if (date.getFullYear() !== year) return false;
        return true;
      },
      message: 'Invalid date'
    },
    required
  };
};