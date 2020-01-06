const { Schema } = require('mongoose');

const dateSubdocFactory = require('../date');
const intSubdocFactory = require('../integer');

const weekSchema = new Schema({
  days: [{

  }],
  firstDate: dateSubdocFactory(),
  lastDate: dateSubdocFactory(),
  number: intSubdocFactory(),
});

module.exports =  () => ([{
  type: weekSchema
}]);