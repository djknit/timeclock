const cc = require('currency-codes');

const intSubdocFactory = require('./integer');

module.exports = () => ({
  rate: payRateSubdocFactory(this),
  currency: {
    type: String,
    validate: {
      validator(value) {
        if (!value) return false;
        return cc.code(value) ? true : false;
      },
      message: 'Invalid currency code.'
    },
    default: 'USD'
  },
  overtime: {
    isOn: {
      type: Boolean,
      default: true
    },
    rate: payRateSubdocFactory(this),
    rateMultiplier: {
      type: Number,
      default: 1.5,
      min: 0
    },
    useMultiplier: {
      type: Boolean,
      default: true
    },
    cutoff: {
      type: Number,
      min: 0,
      max: 604800000,
      default: 144000000
    }
  }
});

function payRateSubdocFactory(mainObj) {
  console.log(mainObj)

  const getAllowedDecimalDigits = () => {
    if (!mainObj.currency) return 2;
    cc.code(mainObj.currency).digits;
  }

  return {
    type: Number,
    validate: {
      validator(value) {
        const decimalSplitStringValue = value.toString().split('.');
        if (decimalSplitStringValue.length < 2) return true; // no decimal. (checked array length)
        if (decimalSplitStringValue[1].length > getAllowedDecimalDigits()) { // checked string length to right of decimal
          return false;
        }
        return true;
      },
      message: `Only ${getAllowedDecimalDigits()} decimal places are allowed.`
    }
  };
}