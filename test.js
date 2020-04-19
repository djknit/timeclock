const cc = require('currency-codes');
const ccData = require('currency-codes/data');

const moment = require('moment-timezone');

// const zone = moment.tz.zone('America/Chicago');

console.log('_'.repeat(33) + '\n- - TEST' + ' -'.repeat(12) + '\n');

// let date = { date: 10, month: 3, year: 2020 };
// let dayMoment = moment.tz(date, 'America/Chicago');

const wageValidation = require('./utilities/wageValidation');

const testWage = {
  rate: -3,
  overtime: {}
}

// wageValidation.validateWage(testWage);

console.log('* * *');

let str = 'my string';
console.log(str);
console.log(str.toString())


console.log('_'.repeat(33) + '\n');