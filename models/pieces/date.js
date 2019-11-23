const mongoose = require('mongoose');

const dateSchema = new mongoose.Schema({
  year: intTypeFactory(),
  month: intTypeFactory(),
  day: intTypeFactory()
}, {
  _id: false
}); 

const intTypeFactory = () => ({
  validator: val => {
    if (Math.floor(val) !== val) return false;
  },
  message: 'Must be an integer.'
});

module.exports = () => ({
  type: dateSchema,
  validate: {
    validator: val => {
      const { day, month, year } = val;
      const date = new Date(year, month, day);
      if (date.getDate !== day) return false;
      if (date.getMonth !== month) return false;
      if (date.getFullYear !== year) return false;
      return true;
    },
    message: 'Invalid date'
  }
});