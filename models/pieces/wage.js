const cc = require('currency-codes');
const { Schema } = require('mongoose');

const intSubdocFactory = require('./integer');

const overtimeSchema = new Schema(
  {
    isOn: {
      type: Boolean,
      default: true
    },
    rate: Number,
    rateMultiplier: {
      type: Number,
      default: 1.5,
      min: 0
    },
    useMultiplier: {
      type: Boolean,
      default: true
    },
    cutoff: intSubdocFactory({
      default: 144000000,
      validate: {
        validator(value) {
          return (value <= 604800000) && (value >= 0);
        },
        message: 'Overtime cutoff cannot be greater than 7 days (604,800,000 ms) or less than 0.'
      }
    })
  },
  { _id: false }
);

const wageSchema = new Schema(
  {
    rate: {
      type: Number,
      required: true
    },
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
      type: overtimeSchema,
      validate: {
        validator(value) {
          return value.useMultiplier === true || !!value.rate;
        },
        message: 'You must specify the overtime rate or rate multiplier.'
      },
      default: {}
    }
  },
  { _id: false }
);

module.exports = () => ({
  type: wageSchema,
  validate: [
    {
      validator(value) {
        return validateDecimalDigits(value.rate, value.currency);
      },
      message: 'Invalid rate; too many decimal places.'
    }, {
      validator(value) {
        const { overtime } = value;
        if (!overtime || !overtime.rate) return true;
        return validateDecimalDigits(overtime.rate, value.currency)
      },
      message: 'Invalid overtime rate; too many decimal places.'
    }
  ]
});

function validateDecimalDigits(rate, currency) {
  const rateRightOfDecimalString = rate.toString().split('.')[1];
  const digits = (rateRightOfDecimalString && rateRightOfDecimalString.length) || 0;
  const allowedDigits = cc.code(currency).digits;
  return (digits <= allowedDigits);
}