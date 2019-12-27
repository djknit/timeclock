const cc = require('currency-codes');

const intSubdocFactory = require('./integer');

module.exports = () => ({
  rate: Number,
  currency: {
    type: String,
    validate: {
      validator(value) {
        return cc.code(value) ? true : false;
      },
      message: 'Invalid currency code.'
    }
  },
  overtime: {
    isOn: Boolean,
    rate: Number,
    rateMultiplier: Number,
    useMultiplier: Boolean,
    cutoff: {
      type: Number,
      min: 0
    }
  }
});

function payRateSubdocFactory() {
  
}