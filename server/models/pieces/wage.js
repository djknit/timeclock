const cc = require('currency-codes');
const { Schema } = require('mongoose');

// cannot require '../../utilities/index.js' b/c exports appear empty. I'm guessing this is due to circular requires b/c this file is required by a file which is required by '../../utilities/index.js', so this file would be requiring a file which requires this file indirectly.
const { wageDefaultValues } = require('../../utilities/constants');

const intSubdocFactory = require('./integer');

const overtimeSchema = new Schema(
  {
    rate: {
      type: Number,
      min: 0
    },
    rateMultiplier: {
      type: Number,
      default: wageDefaultValues.overtime.rateMultiplier,
      min: 0
    },
    useMultiplier: {
      type: Boolean,
      default: wageDefaultValues.overtime.useMultiplier
    },
    cutoff: intSubdocFactory({
      default: wageDefaultValues.overtime.cutoff,
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
      required: true,
      min: 0
    },
    currency: {
      type: String,
      validate: {
        validator: validateCurrencyCode,
        message: 'Invalid currency code.'
      },
      default: wageDefaultValues.currency
    },
    overtime: {
      type: overtimeSchema,
      validate: {
        validator(value) {
          if (!value) return true;
          return value.useMultiplier === true || !!value.rate;
        },
        message: 'You must specify the overtime rate or rate multiplier.'
      }
    }
  },
  { _id: false }
);

module.exports = () => ({
  type: wageSchema,
  validate: [
    {
      validator(value) {
        if (!value) return true;
        return validateCurrencyCode(value && value.currency);
      },
      message: 'Invalid wage currency. Must be an ISO 4217 alphabetic currency code.'
    }, {
      validator(value) {
        if (!value) return true;
        return validateDecimalDigits(value.rate, value.currency);
      },
      message: 'Invalid rate; too many decimal places.'
    }, {
      validator(value) {
        if (!value) return true;
        const { overtime } = value;
        if (!overtime || !overtime.rate) return true;
        return validateDecimalDigits(overtime.rate, value.currency);
      },
      message: 'Invalid overtime rate; too many decimal places.'
    }
  ]
});

function validateDecimalDigits(rate, currency) {
  if (!rate && rate !== 0) return true;
  const rateRightOfDecimalString = rate.toString().split('.')[1];
  const digits = (rateRightOfDecimalString && rateRightOfDecimalString.length) || 0;
  const currencyData = cc.code(currency);
  const allowedDigits = (currencyData && currencyData.digits) || 0;
  return (digits <= allowedDigits);
}

function validateCurrencyCode(candidateValue) {
  if (!candidateValue) return false;
  return (cc.code(candidateValue) || candidateValue === 'X') ? true : false;
}