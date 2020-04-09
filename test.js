const cc = require('currency-codes');
const ccData = require('currency-codes/data');

const moment = require('moment-timezone');

// const zone = moment.tz.zone('America/Chicago');

console.log('_'.repeat(33) + '\n- - TEST' + ' -'.repeat(12) + '\n');

let date = { date: 10, month: 3, year: 2020 };
let dayMoment = moment.tz(date, 'America/Chicago');
console.log('day begins:')
console.log(dayMoment.valueOf())
console.log('ends:')
console.log(dayMoment.add(1, 'days').valueOf())

console.log('* * *');


console.log('_'.repeat(33) + '\n');