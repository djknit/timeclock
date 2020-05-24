const getDates = require('./getDates');
const other = require('./other');

module.exports = {
  ...getDates,
  ...other
};